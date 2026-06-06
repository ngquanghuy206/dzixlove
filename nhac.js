// ═══════════════════════════════════════════════════════════
//  NHẠC — ZING MP3 Style  |  SoundCloud API
// ═══════════════════════════════════════════════════════════

const ZMP = {
  results: [],
  queue: [],
  curIdx: -1,
  audio: null,
  playing: false,
  loop: false,
  shuffle: false,
  volume: 0.8,
  clientId: null,
  rightTab: 'queue',
  liked: new Set(JSON.parse(localStorage.getItem('zmp_liked')||'[]')),
};

const CORS = 'https://api.allorigins.win/raw?url=';

// ── Helpers ──────────────────────────────────────────────
function fmtT(s){ if(!s||isNaN(s))return'0:00'; const m=Math.floor(s/60),sec=Math.floor(s%60); return`${m}:${sec.toString().padStart(2,'0')}`; }
function fmtN(n){ if(!n)return'0'; if(n>=1e6)return(n/1e6).toFixed(1)+'M'; if(n>=1e3)return(n/1e3).toFixed(1)+'K'; return String(n); }

// ── SoundCloud ───────────────────────────────────────────
async function zcGetId(){
  if(ZMP.clientId) return ZMP.clientId;
  try{
    const html = await fetch(CORS+encodeURIComponent('https://soundcloud.com/')).then(r=>r.text());
    const srcs = [...html.matchAll(/src="(https:\/\/a-v2\.sndcdn\.com\/assets\/[^"]+\.js)"/g)];
    if(!srcs.length) throw new Error('no script');
    const js = await fetch(CORS+encodeURIComponent(srcs[srcs.length-1][1])).then(r=>r.text());
    const m = js.match(/client_id:"([^"]+)"/);
    if(m){ ZMP.clientId=m[1]; return m[1]; }
  }catch(e){}
  ZMP.clientId='iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX';
  return ZMP.clientId;
}

async function zcSearch(q){
  const cid = await zcGetId();
  const url = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(q)}&client_id=${cid}&limit=20&offset=0`;
  const d = await fetch(CORS+encodeURIComponent(url)).then(r=>r.json());
  return (d.collection||[]).map(t=>({
    id: t.id,
    title: t.title||'Unknown',
    artist: t.user?.username||'Unknown',
    art: (t.artwork_url||t.user?.avatar_url||'').replace('-large','-t300x300'),
    dur: t.duration?Math.floor(t.duration/1000):0,
    plays: t.playback_count||0,
    likes: t.likes_count||0,
    url: t.permalink_url||'',
  }));
}

async function zcStream(track){
  const cid = await zcGetId();
  const resolve = `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(track.url)}&client_id=${cid}`;
  const d = await fetch(CORS+encodeURIComponent(resolve)).then(r=>r.json());
  const tc = d.media?.transcodings?.find(t=>t.format?.protocol==='progressive') || d.media?.transcodings?.[0];
  if(!tc) throw new Error('no stream');
  const s = await fetch(CORS+encodeURIComponent(tc.url+'?client_id='+cid)).then(r=>r.json());
  return s.url;
}

// ════════════════════════════════════════
//  PAGE RENDER
// ════════════════════════════════════════
function pgNhac(){
  const app = document.getElementById('app');
  app.innerHTML = renderNav() + `
  <div class="music-page" id="zmp">
    <div class="zmp-layout">

      <!-- ── LEFT: Search + Tracklist ── -->
      <div class="zmp-left">
        <div class="zmp-search">
          <div class="zmp-search-box">
            <span class="zmp-search-icon">🔍</span>
            <input class="zmp-search-inp" id="zs-inp" type="text"
              placeholder="Tìm bài hát, nghệ sĩ..."
              autocomplete="off"
              onkeydown="if(event.key==='Enter') zSearch()"/>
            <button class="zmp-search-btn" onclick="zSearch()">Tìm</button>
          </div>
        </div>
        <div class="zmp-tags">
          ${['🇻🇳 Nhạc Việt','🎤 V-Pop','🎧 Rap Việt','🎶 Bolero','🌙 Lo-Fi','⚡ EDM','💫 K-Pop','🎸 Rock'].map(t=>
            `<button class="zmp-tag" onclick="zQuick('${t.replace(/['"]/g,'')}')">${t}</button>`
          ).join('')}
        </div>
        <div id="ztracklist" class="zmp-tracklist">
          <div class="zmp-list-empty">
            <div style="font-size:32px;margin-bottom:10px">🎵</div>
            <div>Tìm bài hát để bắt đầu</div>
            <div style="margin-top:6px;font-size:10px;color:#333">Powered by SoundCloud</div>
          </div>
        </div>
      </div>

      <!-- ── CENTER: Player ── -->
      <div class="zmp-center" id="zmp-center">
        <div class="zmp-blur-bg" id="zbg"></div>
        <div id="zmp-player-inner" class="zmp-center-inner" style="display:none">
          <!-- Vinyl -->
          <div class="zmp-vinyl-wrap" id="zvwrap">
            <div class="zmp-vinyl" id="zvdisc">
              <div class="zv-art" id="zv-art"></div>
              <div class="zv-grooves"></div>
              <div class="zv-gloss"></div>
              <div class="zv-center"></div>
            </div>
            <div class="zmp-needle" id="zneedle">
              <div class="needle-pivot"></div>
              <div class="needle-arm"><div class="needle-head"></div></div>
            </div>
          </div>
          <!-- Info -->
          <div class="zmp-track-meta">
            <div class="zmp-song-title" id="zsong-title">–</div>
            <div class="zmp-song-artist" id="zsong-artist">–</div>
            <div class="zmp-song-stats">
              <span class="zmp-stat" id="zstats"></span>
              <button class="zmp-like-btn" id="zlike-btn" onclick="zToggleLike()">🤍 Thích</button>
            </div>
          </div>
          <!-- Progress -->
          <div class="zmp-prog-wrap">
            <div class="zmp-prog-bar" id="zpb" onclick="zSeek(event)">
              <div class="zmp-prog-fill" id="zpf" style="width:0%"></div>
            </div>
            <div class="zmp-prog-times">
              <span id="zpt-cur">0:00</span>
              <span id="zpt-dur">0:00</span>
            </div>
          </div>
          <!-- Controls -->
          <div class="zmp-controls">
            <button class="zctl" id="zshuffle-btn" onclick="zToggleShuffle()" title="Shuffle">⇄</button>
            <button class="zctl" onclick="zPrev()" title="Trước">⏮</button>
            <button class="zctl-play" id="zplay-btn" onclick="zTogglePlay()">▶</button>
            <button class="zctl" onclick="zNext()" title="Tiếp">⏭</button>
            <button class="zctl" id="zloop-btn" onclick="zToggleLoop()" title="Lặp">🔁</button>
          </div>
          <!-- Volume -->
          <div class="zmp-vol-wrap">
            <span class="zvol-icon" onclick="zMute()">🔊</span>
            <input type="range" class="zvol-sl" id="zvol" min="0" max="1" step="0.02"
              value="${ZMP.volume}" oninput="zSetVol(this.value)">
          </div>
        </div>
        <!-- Idle -->
        <div class="zmp-idle" id="zmp-idle">
          <div class="zmp-idle-rings">
            <div class="zmp-idle-ring zir1"></div>
            <div class="zmp-idle-ring zir2"></div>
            <div class="zmp-idle-ring zir3"></div>
            <div class="zmp-idle-ring zir4"></div>
            <div class="zmp-idle-icon">🎵</div>
          </div>
          <div class="zmp-idle-text">Chọn bài hát để phát nhạc<br><span style="font-size:10px;color:#333">Tìm trên SoundCloud</span></div>
        </div>
        <!-- Loading overlay -->
        <div class="zmp-loading-overlay" id="zload-ov" style="display:none">
          <div class="zmp-load-spin"></div>
          <div>Đang tải nhạc...</div>
        </div>
      </div>

      <!-- ── RIGHT: Queue/Lyrics ── -->
      <div class="zmp-right">
        <div class="zmp-right-tabs">
          <div class="zrt on" id="ztab-queue" onclick="zSwitchTab('queue')">Danh sách</div>
          <div class="zrt" id="ztab-lyrics" onclick="zSwitchTab('lyrics')">Lời nhạc</div>
        </div>
        <div id="zqueue" class="zmp-queue-list"></div>
        <div id="zlyrics" class="zmp-lyrics-wrap" style="display:none">
          <div class="zmp-lyrics-empty">
            <div style="font-size:24px;margin-bottom:8px">🎤</div>
            Tính năng lời nhạc đang phát triển
          </div>
        </div>
      </div>
    </div>

    <!-- ── BOTTOM BAR ── -->
    <div class="zmp-bottom" id="zbottom" style="display:none">
      <div class="zbt-art"><img id="zbt-art" src="" alt=""></div>
      <div class="zbt-info">
        <div class="zbt-title" id="zbt-title">–</div>
        <div class="zbt-artist" id="zbt-artist">–</div>
      </div>
      <div class="zbt-controls">
        <button class="zbt-btn" onclick="zPrev()">⏮</button>
        <button class="zbt-play" id="zbt-play" onclick="zTogglePlay()">▶</button>
        <button class="zbt-btn" onclick="zNext()">⏭</button>
      </div>
      <div class="zbt-prog">
        <div class="zbt-bar" onclick="zSeekBar(event)">
          <div class="zbt-fill" id="zbt-fill" style="width:0%"></div>
        </div>
        <div class="zbt-times"><span id="zbt-cur">0:00</span><span id="zbt-dur">0:00</span></div>
      </div>
      <div class="zbt-vol">
        <span class="zbt-vol-icon">🔊</span>
        <input type="range" class="zbt-vol-sl" min="0" max="1" step="0.02"
          value="${ZMP.volume}" oninput="zSetVol(this.value)">
      </div>
    </div>
  </div>`;

  setupNavScroll();

  // Restore state
  if(ZMP.results.length) zRenderList(ZMP.results);
  if(ZMP.curIdx >= 0 && ZMP.results[ZMP.curIdx]) zShowPlayer(ZMP.results[ZMP.curIdx], false);
  zRenderQueue();
}

// ── Search ────────────────────────────────────────────────
window.zSearch = async function(){
  const q = document.getElementById('zs-inp')?.value?.trim();
  if(!q) return;
  const tl = document.getElementById('ztracklist');
  if(!tl) return;
  tl.innerHTML = `<div class="zmp-list-loading"><div class="zmp-spin"></div><div>Đang tìm "${q}"…</div></div>`;
  try{
    const tracks = await zcSearch(q);
    ZMP.results = tracks;
    ZMP.queue = [...tracks];
    if(!tracks.length){
      tl.innerHTML = `<div class="zmp-list-empty"><div style="font-size:28px">😔</div><div>Không tìm thấy kết quả</div></div>`;
      return;
    }
    zRenderList(tracks);
    zRenderQueue();
  }catch(e){
    tl.innerHTML = `<div class="zmp-list-empty"><div style="font-size:28px">⚠️</div><div>Lỗi kết nối. Thử lại sau.</div></div>`;
  }
};

window.zQuick = function(q){
  const inp = document.getElementById('zs-inp');
  if(inp) inp.value = q.replace(/^[^\s]+\s/,''); // strip emoji
  // find matching tag
  document.querySelectorAll('.zmp-tag').forEach(el=>{ el.classList.toggle('active', el.textContent.includes(q.split(' ').slice(1).join(' '))); });
  zSearch();
};

function zRenderList(tracks){
  const tl = document.getElementById('ztracklist');
  if(!tl) return;
  tl.innerHTML = `<div class="zmp-list-head">KẾT QUẢ (${tracks.length})</div>` +
    tracks.map((t,i)=>`
    <div class="zmp-track ${ZMP.curIdx===i?'zactive':''}" id="zt-${t.id}" onclick="zPlay(${i})">
      <div class="zmp-track-idx">
        <span class="zmp-track-idx-num">${i+1}</span>
        <div class="zmp-playing-anim"><div class="zpa-bar"></div><div class="zpa-bar"></div><div class="zpa-bar"></div></div>
      </div>
      <div class="zmp-track-art">
        <img src="${t.art||''}" alt="" onerror="this.style.display='none'">
        <div class="zmp-track-art-ov">▶</div>
      </div>
      <div class="zmp-track-info">
        <div class="zmp-track-name">${esc(t.title)}</div>
        <div class="zmp-track-artist">${esc(t.artist)}</div>
      </div>
      <div class="zmp-track-dur">${fmtT(t.dur)}</div>
    </div>`).join('');
}

function zRenderQueue(){
  const q = document.getElementById('zqueue');
  if(!q || !ZMP.queue.length) return;
  q.innerHTML = ZMP.queue.map((t,i)=>`
    <div class="zq-track ${ZMP.curIdx===i?'zqactive':''}" onclick="zPlay(${i})">
      <div class="zq-art"><img src="${t.art||''}" alt="" onerror="this.style.display='none'"></div>
      <div class="zq-info">
        <div class="zq-name">${esc(t.title)}</div>
        <div class="zq-artist">${esc(t.artist)}</div>
      </div>
      <div class="zq-dur">${fmtT(t.dur)}</div>
    </div>`).join('');
}

// ── Play ──────────────────────────────────────────────────
window.zPlay = async function(idx){
  const track = ZMP.results[idx];
  if(!track) return;
  ZMP.curIdx = idx;

  // Update active states
  document.querySelectorAll('.zmp-track').forEach(el=>el.classList.remove('zactive'));
  document.querySelectorAll('.zq-track').forEach(el=>el.classList.remove('zqactive'));
  document.getElementById('zt-'+track.id)?.classList.add('zactive');
  document.querySelectorAll('.zq-track')[idx]?.classList.add('zqactive');

  zShowPlayer(track, true);
};

function zShowPlayer(track, load){
  // Show player, hide idle
  const inner = document.getElementById('zmp-player-inner');
  const idle = document.getElementById('zmp-idle');
  const bottom = document.getElementById('zbottom');
  if(inner) inner.style.display = 'flex';
  if(idle) idle.style.display = 'none';
  if(bottom) bottom.style.display = 'flex';

  // Blur BG
  const bg = document.getElementById('zbg');
  if(bg && track.art){ bg.style.backgroundImage=`url('${track.art}')`; bg.classList.add('loaded'); }

  // Vinyl art
  const art = document.getElementById('zv-art');
  if(art) art.style.backgroundImage = `url('${track.art||''}')`;

  // Info
  const tEl = document.getElementById('zsong-title'); if(tEl) tEl.textContent = track.title;
  const aEl = document.getElementById('zsong-artist'); if(aEl) aEl.textContent = track.artist;
  const stEl = document.getElementById('zstats');
  if(stEl) stEl.innerHTML = `🎧 ${fmtN(track.plays)} · ❤️ ${fmtN(track.likes)}`;

  // Like btn
  const lb = document.getElementById('zlike-btn');
  if(lb){ const liked=ZMP.liked.has(String(track.id)); lb.className='zmp-like-btn'+(liked?' liked':''); lb.textContent=liked?'❤️ Đã thích':'🤍 Thích'; }

  // Duration
  const durEl = document.getElementById('zpt-dur'); if(durEl) durEl.textContent = fmtT(track.dur);

  // Bottom bar
  const btArt = document.getElementById('zbt-art'); if(btArt) btArt.src = track.art||'';
  const btTitle = document.getElementById('zbt-title'); if(btTitle) btTitle.textContent = track.title;
  const btArtist = document.getElementById('zbt-artist'); if(btArtist) btArtist.textContent = track.artist;

  if(load) zLoadPlay(track);
}

async function zLoadPlay(track){
  const ov = document.getElementById('zload-ov');
  const disc = document.getElementById('zvdisc');
  const wrap = document.getElementById('zvwrap');

  if(ov) ov.style.display = 'flex';
  if(disc){ disc.classList.remove('vspin','vpause'); }

  // Stop old audio
  if(ZMP.audio){ ZMP.audio.pause(); ZMP.audio.src=''; ZMP.audio=null; }
  ZMP.playing = false;

  try{
    const streamUrl = await zcStream(track);
    const audio = new Audio(streamUrl);
    audio.volume = ZMP.volume;
    audio.loop = ZMP.loop;
    ZMP.audio = audio;

    audio.addEventListener('timeupdate', zOnTime);
    audio.addEventListener('ended', zOnEnded);
    audio.addEventListener('canplay', ()=>{
      if(ov) ov.style.display='none';
      if(disc) disc.classList.add('vspin');
      if(wrap) wrap.classList.add('playing');
    });
    audio.addEventListener('waiting', ()=>{ if(ov) ov.style.display='flex'; });

    await audio.play();
    ZMP.playing = true;

    const pb = document.getElementById('zplay-btn'); if(pb) pb.textContent='⏸';
    const pbt = document.getElementById('zbt-play'); if(pbt) pbt.textContent='⏸';
    document.getElementById('zbt-art')?.classList.add('spinning');
  }catch(e){
    if(ov){ ov.innerHTML = `<div style="color:#ff6b6b;font-size:12px">❌ Không thể phát bài này</div>`; }
    setTimeout(()=>{ if(ov){ ov.style.display='none'; ov.innerHTML='<div class="zmp-load-spin"></div><div>Đang tải nhạc...</div>'; } }, 2000);
  }
}

function zOnTime(){
  const a = ZMP.audio; if(!a) return;
  const cur=a.currentTime, dur=a.duration||0, pct=dur?(cur/dur)*100:0;
  // center
  const pf=document.getElementById('zpf'); if(pf) pf.style.width=pct+'%';
  const ct=document.getElementById('zpt-cur'); if(ct) ct.textContent=fmtT(cur);
  const dt=document.getElementById('zpt-dur'); if(dt) dt.textContent=fmtT(dur);
  // bottom
  const bf=document.getElementById('zbt-fill'); if(bf) bf.style.width=pct+'%';
  const bc=document.getElementById('zbt-cur'); if(bc) bc.textContent=fmtT(cur);
  const bd=document.getElementById('zbt-dur'); if(bd) bd.textContent=fmtT(dur);
}

function zOnEnded(){
  if(ZMP.loop){ ZMP.audio?.play(); return; }
  if(ZMP.shuffle){
    zPlay(Math.floor(Math.random()*ZMP.results.length));
  } else {
    zNext();
  }
}

// ── Controls ──────────────────────────────────────────────
window.zTogglePlay = function(){
  const a = ZMP.audio;
  if(!a) return;
  const disc = document.getElementById('zvdisc');
  const wrap = document.getElementById('zvwrap');
  if(a.paused){
    a.play(); ZMP.playing=true;
    document.getElementById('zplay-btn').textContent='⏸';
    document.getElementById('zbt-play').textContent='⏸';
    if(disc){ disc.classList.remove('vpause'); disc.classList.add('vspin'); }
    if(wrap) wrap.classList.add('playing');
  } else {
    a.pause(); ZMP.playing=false;
    document.getElementById('zplay-btn').textContent='▶';
    document.getElementById('zbt-play').textContent='▶';
    document.getElementById('zbt-art')?.classList.remove('spinning');
    if(disc){ disc.classList.add('vpause'); }
    if(wrap) wrap.classList.remove('playing');
  }
};

window.zNext = function(){
  let next;
  if(ZMP.shuffle) next = Math.floor(Math.random()*ZMP.results.length);
  else next = (ZMP.curIdx+1) % ZMP.results.length;
  zPlay(next);
};

window.zPrev = function(){
  const a = ZMP.audio;
  if(a && a.currentTime > 3){ a.currentTime=0; return; }
  let prev;
  if(ZMP.shuffle) prev = Math.floor(Math.random()*ZMP.results.length);
  else prev = (ZMP.curIdx-1+ZMP.results.length) % ZMP.results.length;
  zPlay(prev);
};

window.zToggleLoop = function(){
  ZMP.loop = !ZMP.loop;
  if(ZMP.audio) ZMP.audio.loop = ZMP.loop;
  document.getElementById('zloop-btn')?.classList.toggle('zon', ZMP.loop);
};

window.zToggleShuffle = function(){
  ZMP.shuffle = !ZMP.shuffle;
  document.getElementById('zshuffle-btn')?.classList.toggle('zon', ZMP.shuffle);
};

window.zSetVol = function(v){
  ZMP.volume = parseFloat(v);
  if(ZMP.audio) ZMP.audio.volume = ZMP.volume;
  const allVols = document.querySelectorAll('.zvol-sl,.zbt-vol-sl');
  allVols.forEach(el=>{ el.value=v; });
};

window.zMute = function(){
  ZMP.volume = ZMP.volume > 0 ? 0 : 0.8;
  zSetVol(ZMP.volume);
};

window.zSeek = function(e){
  const pb = document.getElementById('zpb'); if(!pb||!ZMP.audio) return;
  const r=pb.getBoundingClientRect();
  ZMP.audio.currentTime = Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)) * (ZMP.audio.duration||0);
};
window.zSeekBar = function(e){
  const pb = e.currentTarget; if(!pb||!ZMP.audio) return;
  const r=pb.getBoundingClientRect();
  ZMP.audio.currentTime = Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)) * (ZMP.audio.duration||0);
};

window.zToggleLike = function(){
  const t = ZMP.results[ZMP.curIdx]; if(!t) return;
  const k = String(t.id);
  if(ZMP.liked.has(k)){
    ZMP.liked.delete(k);
    const likedTracks = JSON.parse(localStorage.getItem('zmp_liked_tracks')||'[]');
    localStorage.setItem('zmp_liked_tracks', JSON.stringify(likedTracks.filter(x=>String(x.id)!==k)));
  } else {
    ZMP.liked.add(k);
    const likedTracks = JSON.parse(localStorage.getItem('zmp_liked_tracks')||'[]');
    if(!likedTracks.find(x=>String(x.id)===k)) likedTracks.unshift(t);
    localStorage.setItem('zmp_liked_tracks', JSON.stringify(likedTracks));
  }
  localStorage.setItem('zmp_liked', JSON.stringify([...ZMP.liked]));
  const lb = document.getElementById('zlike-btn');
  const liked = ZMP.liked.has(k);
  if(lb){ lb.className='zmp-like-btn'+(liked?' liked':''); lb.textContent=liked?'❤️ Đã thích':'🤍 Thích'; }
};

window.zSwitchTab = function(tab){
  ZMP.rightTab = tab;
  document.getElementById('zqueue').style.display = tab==='queue'?'block':'none';
  document.getElementById('zlyrics').style.display = tab==='lyrics'?'block':'none';
  document.getElementById('ztab-queue').className = 'zrt'+(tab==='queue'?' on':'');
  document.getElementById('ztab-lyrics').className = 'zrt'+(tab==='lyrics'?' on':'');
};
