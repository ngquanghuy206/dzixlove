// ═══════════════════════════════════════════════════════════
//  NHẠC — ZING MP3 Style  |  SoundCloud via DZI Server
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

// ─── Server ─────────────────────────────────────────────
const MUSIC_SERVER = 'http://prem-eu5.bot-hosting.cloud:20427';
let _serverOk = null;

async function checkServer() {
  if (_serverOk !== null) return _serverOk;
  try {
    const r = await fetch(`${MUSIC_SERVER}/ping`, { signal: AbortSignal.timeout(8000) });
    _serverOk = r.ok;
  } catch { _serverOk = false; }
  setTimeout(() => { _serverOk = null; }, 60000);
  return _serverOk;
}

// ── Helpers ──────────────────────────────────────────────
function fmtT(s){ if(!s||isNaN(s))return'0:00'; const m=Math.floor(s/60),sec=Math.floor(s%60); return`${m}:${sec.toString().padStart(2,'0')}`; }
function fmtN(n){ if(!n)return'0'; if(n>=1e6)return(n/1e6).toFixed(1)+'M'; if(n>=1e3)return(n/1e3).toFixed(1)+'K'; return String(n); }

// ── SoundCloud ───────────────────────────────────────────
// Web gửi query → MUSIC_SERVER tìm → trả JSON về
async function zcSearch(q){
  const r = await fetch(`${MUSIC_SERVER}/search?q=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(25000) });
  if(!r.ok) throw new Error('Server loi ' + r.status);
  const d = await r.json();
  return d.tracks || [];
}

async function zcStream(track){
  const r = await fetch(`${MUSIC_SERVER}/stream?url=${encodeURIComponent(track.url)}`, { signal: AbortSignal.timeout(15000) });
  if(!r.ok) throw new Error('Stream loi ' + r.status);
  const d = await r.json();
  return d.url;
}

// ════════════════════════════════════════
//  PAGE RENDER
// ════════════════════════════════════════
function pgNhac(){
  const app = document.getElementById('app');
  app.innerHTML = renderNav() + `
  <div class="music-page" id="zmp">
    <div class="zmp-bg" id="zbg"></div>

    <div class="zmp-layout">

      <!-- ── LEFT: Search + Tracklist ── -->
      <div class="zmp-left">
        <div class="zmp-search">
          <div class="zmp-search-box">
            <span style="font-size:14px;color:rgba(255,255,255,.3)">🔍</span>
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
        <div class="zmp-list-tabs">
          <div class="zmp-list-tab on" id="ztab-all" onclick="zSwitchListTab('all')">Kết quả</div>
          <div class="zmp-list-tab" id="ztab-liked" onclick="zSwitchListTab('liked')">❤️ Đã thích</div>
        </div>
        <div id="ztracklist" class="zmp-tracklist">
          <div class="zmp-list-empty">
            <div style="font-size:36px;opacity:.4">🎵</div>
            <div>Tìm bài hát để bắt đầu</div>
            <div style="font-size:10px;color:rgba(255,255,255,.15);margin-top:4px">Powered by SoundCloud</div>
          </div>
        </div>
      </div>

      <!-- ── CENTER: Player ── -->
      <div class="zmp-center" id="zmp-center">
        <!-- Loading overlay -->
        <div class="zmp-loading-ov" id="zload-ov" style="display:none">
          <div class="zmp-load-ring"></div>
          <div>Đang tải nhạc...</div>
        </div>

        <!-- Idle state -->
        <div id="zmp-idle" class="zmp-idle">
          <div class="zmp-idle-icon">🎵</div>
          <div>Chọn bài hát để phát nhạc</div>
          <div style="font-size:10px;opacity:.5;margin-top:4px">Tìm trên SoundCloud</div>
        </div>

        <!-- Player (hidden until track loads) -->
        <div id="zmp-player-inner" style="display:none;flex-direction:column;align-items:center;width:100%">
          <!-- Album art -->
          <div class="zmp-art-wrap">
            <div class="zmp-art-disc" id="zart-disc">
              <img id="zart-img" src="" alt="">
            </div>
          </div>

          <!-- Song meta -->
          <div class="zmp-song-meta">
            <div class="zmp-song-title" id="zsong-title">–</div>
            <div class="zmp-song-artist" id="zsong-artist">–</div>
            <div class="zmp-song-actions">
              <button class="zmp-like-btn" id="zlike-btn" onclick="zToggleLike()">🤍 Thích</button>
              <span class="zmp-stat-badge" id="zstats"></span>
            </div>
          </div>

          <!-- Progress -->
          <div class="zmp-prog">
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
          <div class="zmp-vol">
            <span class="zvol-icon" onclick="zMute()">🔊</span>
            <input type="range" class="zvol-sl" id="zvol" min="0" max="1" step="0.02"
              value="${ZMP.volume}" oninput="zSetVol(this.value)">
          </div>
        </div>
      </div>

      <!-- ── RIGHT: Queue ── -->
      <div class="zmp-right">
        <div class="zmp-right-tabs">
          <div class="zrt on" id="ztab-queue" onclick="zSwitchTab('queue')">Danh sách</div>
          <div class="zrt" id="ztab-lyrics" onclick="zSwitchTab('lyrics')">Lời nhạc</div>
        </div>
        <div id="zqueue" class="zmp-queue-list"></div>
        <div id="zlyrics" class="zmp-lyrics-wrap" style="display:none">
          <div class="zmp-lyrics-empty">
            <div style="font-size:32px;margin-bottom:10px">🎤</div>
            Tính năng lời nhạc đang phát triển
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile search overlay -->
    <div class="zmp-mobile-search" id="zmobile-search">
      <div class="zmp-mobile-search-box">
        <button class="zmp-mobile-back" onclick="zCloseMobileSearch()">←</button>
        <input class="zmp-mobile-search-inp" id="zs-inp-mobile" type="text"
          placeholder="Tìm bài hát, nghệ sĩ..."
          autocomplete="off"
          onkeydown="if(event.key==='Enter') zSearchMobile()"/>
        <button class="zmp-search-btn" onclick="zSearchMobile()">Tìm</button>
      </div>
      <div class="zmp-mobile-tags">
        ${['🇻🇳 Nhạc Việt','🎤 V-Pop','🎧 Rap Việt','🎶 Bolero','🌙 Lo-Fi','⚡ EDM'].map(t=>
          `<button class="zmp-tag" onclick="zQuickMobile('${t.replace(/['"]/g,'')}')">${t}</button>`
        ).join('')}
      </div>
      <div id="zmobile-tracklist" class="zmp-mobile-tracklist">
        <div class="zmp-list-empty">
          <div style="font-size:32px;opacity:.4">🎵</div>
          <div>Tìm bài hát để bắt đầu</div>
        </div>
      </div>
    </div>

    <!-- FAB search (mobile) -->
    <button class="zmp-fab" onclick="zOpenMobileSearch()" title="Tìm nhạc">🔍</button>

    <!-- Bottom mini player -->
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

  // Check server và hiện badge
  checkServer().then(online => {
    const tl = document.getElementById('ztracklist');
    if(!tl) return;
    const badge = document.createElement('div');
    badge.style.cssText = 'text-align:center;padding:8px 0 4px;font-size:11px;opacity:.6';
    badge.innerHTML = online
      ? '🟢 Server cục bộ đang chạy — tìm nhạc siêu nhanh!'
      : '🌐 Dùng CORS proxy (chậm hơn) — chạy <code>python server.py</code> để tăng tốc';
    tl.prepend(badge);
  });

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
    document.getElementById('ztab-all')?.classList.add('on');
    document.getElementById('ztab-liked')?.classList.remove('on');
    if(!tracks.length){
      tl.innerHTML = `<div class="zmp-list-empty"><div style="font-size:32px;opacity:.5">😔</div><div>Không tìm thấy kết quả cho "${q}"</div></div>`;
      return;
    }
    zRenderList(tracks);
    zRenderQueue();
  }catch(e){
    tl.innerHTML = `<div class="zmp-list-empty">
      <div style="font-size:32px;opacity:.5">⚠️</div>
      <div style="color:#f87171">Lỗi kết nối server</div>
      <div style="font-size:11px;margin-top:6px;opacity:.5">${e.message||'Thử lại sau'}</div>
      <button class="zmp-search-btn" style="margin-top:12px" onclick="zSearch()">Thử lại</button>
    </div>`;
    console.error('[zSearch]', e);
  }
};

window.zSearchMobile = async function(){
  const q = document.getElementById('zs-inp-mobile')?.value?.trim();
  if(!q) return;
  const tl = document.getElementById('zmobile-tracklist');
  if(!tl) return;
  tl.innerHTML = `<div class="zmp-list-loading"><div class="zmp-spin"></div><div>Đang tìm "${q}"…</div></div>`;
  try{
    const tracks = await zcSearch(q);
    ZMP.results = tracks;
    ZMP.queue = [...tracks];
    if(!tracks.length){
      tl.innerHTML = `<div class="zmp-list-empty"><div style="font-size:32px;opacity:.5">😔</div><div>Không tìm thấy kết quả</div></div>`;
      return;
    }
    zRenderList(tracks, 'zmobile-tracklist');
    zRenderQueue();
    zCloseMobileSearch();
  }catch(e){
    tl.innerHTML = `<div class="zmp-list-empty"><div style="font-size:32px;opacity:.5">⚠️</div><div style="color:#f87171">Lỗi kết nối</div><button class="zmp-search-btn" style="margin-top:12px" onclick="zSearchMobile()">Thử lại</button></div>`;
  }
};

window.zOpenMobileSearch = function(){
  document.getElementById('zmobile-search')?.classList.add('show');
  setTimeout(()=>document.getElementById('zs-inp-mobile')?.focus(), 100);
};
window.zCloseMobileSearch = function(){
  document.getElementById('zmobile-search')?.classList.remove('show');
};
window.zQuickMobile = function(q){
  const inp = document.getElementById('zs-inp-mobile');
  if(inp) inp.value = q.replace(/^\S+\s/,'');
  zSearchMobile();
};

window.zSwitchListTab = function(tab){
  document.getElementById('ztab-all')?.classList.toggle('on', tab==='all');
  document.getElementById('ztab-liked')?.classList.toggle('on', tab==='liked');
  if(tab==='liked'){
    const likedTracks = JSON.parse(localStorage.getItem('zmp_liked_tracks')||'[]');
    if(!likedTracks.length){
      const tl = document.getElementById('ztracklist');
      if(tl) tl.innerHTML = '<div class="zmp-list-empty"><div style="font-size:32px;opacity:.4">❤️</div><div>Chưa có bài hát yêu thích</div></div>';
      return;
    }
    ZMP.results = likedTracks;
    ZMP.queue = [...likedTracks];
    zRenderList(likedTracks);
    zRenderQueue();
  } else {
    if(ZMP.results.length) zRenderList(ZMP.results);
  }
};

window.zQuick = function(q){
  const inp = document.getElementById('zs-inp');
  if(inp) inp.value = q.replace(/^[^\s]+\s/,''); // strip emoji
  // find matching tag
  document.querySelectorAll('.zmp-tag').forEach(el=>{ el.classList.toggle('active', el.textContent.includes(q.split(' ').slice(1).join(' '))); });
  zSearch();
};

function zRenderList(tracks, containerId='ztracklist'){
  const tl = document.getElementById(containerId);
  if(!tl) return;
  if(!tracks.length){
    tl.innerHTML='<div class="zmp-list-empty"><div style="font-size:32px;opacity:.4">😔</div><div>Không tìm thấy kết quả</div></div>';
    return;
  }
  tl.innerHTML = `<div class="zmp-list-head">KẾT QUẢ · ${tracks.length} bài</div>` +
    tracks.map((t,i)=>`
    <div class="zmp-track ${ZMP.curIdx===i&&ZMP.results===tracks?'zactive':''}" id="zt-${t.id}" onclick="zPlay(${i})">
      <div class="zmp-track-num">
        <span class="zmp-track-num-val">${i+1}</span>
        <div class="zmp-bars"><span></span><span></span><span></span></div>
      </div>
      <div class="zmp-track-thumb">
        <img src="${t.art||''}" alt="" onerror="this.style.display='none'">
        <div class="zmp-track-thumb-ov">▶</div>
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

  // BG blur from art
  const bg = document.getElementById('zbg');
  if(bg && track.art) bg.style.backgroundImage = `url('${track.art}')`;

  // Album art image
  const artImg = document.getElementById('zart-img');
  if(artImg) artImg.src = track.art || '';

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

  if(ov) ov.style.display = 'flex';
  const disc = document.getElementById('zart-disc');
  if(disc){ disc.classList.remove('spinning','paused'); }

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
      if(disc){ disc.classList.add('spinning'); disc.classList.remove('paused'); }
    });
    audio.addEventListener('waiting', ()=>{ if(ov) ov.style.display='flex'; });

    await audio.play();
    ZMP.playing = true;

    const pb = document.getElementById('zplay-btn'); if(pb) pb.textContent='⏸';
    const pbt = document.getElementById('zbt-play'); if(pbt) pbt.textContent='⏸';
    const btArt = document.getElementById('zbt-art'); if(btArt) btArt.classList.add('spinning');
  }catch(e){
    if(ov){
      ov.innerHTML = '<div style="color:#f87171;font-size:13px;text-align:center">❌ Không thể kết nối SoundCloud<br><span style="font-size:11px;opacity:.6">Thử lại hoặc chọn bài khác</span></div>';
    }
    setTimeout(()=>{
      if(ov){
        ov.style.display='none';
        ov.innerHTML='<div class="zmp-load-ring"></div><div>Đang tải nhạc...</div>';
      }
    }, 3000);
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
  if(a.paused){
    a.play(); ZMP.playing=true;
    document.getElementById('zplay-btn').textContent='⏸';
    document.getElementById('zbt-play').textContent='⏸';
    const disc2 = document.getElementById('zart-disc');
    if(disc2){ disc2.classList.add('spinning'); disc2.classList.remove('paused'); }
  } else {
    a.pause(); ZMP.playing=false;
    document.getElementById('zplay-btn').textContent='▶';
    document.getElementById('zbt-play').textContent='▶';
    document.getElementById('zbt-art')?.classList.remove('spinning');
    const disc2 = document.getElementById('zart-disc');
    if(disc2){ disc2.classList.remove('spinning'); disc2.classList.add('paused'); }
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
