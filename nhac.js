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
function msUrl(path){
  const [p, qs] = path.split('?');
  return '/api/music?' + (qs ? '_p='+encodeURIComponent(p)+'&'+qs : '_p='+encodeURIComponent(p));
}
let _serverOk = null;

async function checkServer() {
  if (_serverOk !== null) return _serverOk;
  try {
    const r = await fetchTimeout(msUrl('/ping'), 8000);
    _serverOk = r.ok;
  } catch { _serverOk = false; }
  setTimeout(() => { _serverOk = null; }, 60000);
  return _serverOk;
}

// ── Helpers ──────────────────────────────────────────────
function fetchTimeout(url, ms){
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(id));
}

function fmtT(s){ if(!s||isNaN(s))return'0:00'; const m=Math.floor(s/60),sec=Math.floor(s%60); return`${m}:${sec.toString().padStart(2,'0')}`; }
function fmtN(n){ if(!n)return'0'; if(n>=1e6)return(n/1e6).toFixed(1)+'M'; if(n>=1e3)return(n/1e3).toFixed(1)+'K'; return String(n); }

// ── SoundCloud ───────────────────────────────────────────
async function zcSearch(q){
  const r = await fetchTimeout(msUrl('/search?q=' + encodeURIComponent(q)), 25000);
  if(!r.ok) throw new Error('Server loi ' + r.status);
  const d = await r.json();
  return d.tracks || [];
}

async function zcStream(track){
  const r = await fetchTimeout(msUrl('/stream?url=' + encodeURIComponent(track.url)), 15000);
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input class="zmp-search-inp" id="zs-inp" type="text"
              placeholder="Tìm bài hát, nghệ sĩ..."
              autocomplete="off"
              onkeydown="if(event.key==='Enter') zSearch()"/>
            <button class="zmp-search-btn" onclick="zSearch()">Tìm</button>
          </div>
        </div>
        <div class="zmp-tags">
          ${['🇻🇳 Nhạc Việt','🎤 V-Pop','🎧 Rap Việt','🎶 Bolero','🌙 Lo-Fi','⚡ EDM','💫 K-Pop','🎸 Rock'].map(t=>
            `<button class="zmp-tag" onclick="zQuick('${t.replace(/['\"]/g,'')}')">${t}</button>`
          ).join('')}
        </div>
        <div class="zmp-list-tabs">
          <div class="zmp-list-tab on" id="ztab-all" onclick="zSwitchListTab('all')">Kết quả</div>
          <div class="zmp-list-tab" id="ztab-liked" onclick="zSwitchListTab('liked')"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Đã thích</div>
        </div>
        <div id="ztracklist" class="zmp-tracklist">
          <div class="zmp-list-empty">
            <div style="font-size:36px;opacity:.4">🎵</div>
            <div>Tìm bài hát để bắt đầu</div>
            <div style="font-size:10px;color:rgba(255,255,255,.15);margin-top:4px">DZI x MUSIC</div>
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
          <div class="zmp-idle-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>
          <div>Chọn bài hát để phát nhạc</div>
          <div style="font-size:10px;opacity:.5;margin-top:4px">Tìm kiếm nhạc</div>
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
            <button class="zctl" onclick="zPrev()" title="Trước"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg></button>
            <button class="zctl-play" id="zplay-btn" onclick="zTogglePlay()"><svg id="zplay-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>
            <button class="zctl" onclick="zNext()" title="Tiếp"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="m6 18 8.5-6L6 6v12zm2-8.14 5.5 3.64L8 19.14V9.86zM16 6h2v12h-2z"/></svg></button>
            <button class="zctl" id="zloop-btn" onclick="zToggleLoop()" title="Lặp"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></button>
          </div>

          <!-- Volume -->
          <div class="zmp-vol">
            <span class="zvol-icon" onclick="zMute()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg></span>
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

    <!-- Mobile: back-to-search button (shown when player is active) -->
    <button class="zmp-back-btn" id="zmp-back-btn" onclick="zMobileBackToSearch()" style="display:none">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>

  </div>`;

  setupNavScroll();

  // Restore state khi quay lại trang nhạc
  if(ZMP.results.length) zRenderList(ZMP.results);
  if(ZMP.curIdx >= 0 && ZMP.results[ZMP.curIdx]) zShowPlayer(ZMP.results[ZMP.curIdx], false);
  zRenderQueue();

  // Sync play button với trạng thái audio hiện tại
  if(ZMP.audio && !ZMP.audio.paused){
    const pb = document.getElementById('zplay-btn');
    if(pb) pb.innerHTML=`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    const disc = document.getElementById('zart-disc');
    if(disc){ disc.classList.add('spinning'); disc.classList.remove('paused'); }
  }
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

// Mobile: switch between search view and player view
window.zMobileShowPlayer = function(){
  if(window.innerWidth > 750) return;
  const left = document.getElementById('zmp')?.querySelector('.zmp-left');
  const center = document.getElementById('zmp-center');
  const backBtn = document.getElementById('zmp-back-btn');
  if(left){ left.classList.add('mobile-hide'); left.classList.remove('mobile-show'); }
  if(center){ center.classList.add('mobile-show'); center.classList.remove('mobile-hide'); }
  if(backBtn) backBtn.style.display = 'flex';
};
window.zMobileBackToSearch = function(){
  if(window.innerWidth > 750) return;
  const left = document.getElementById('zmp')?.querySelector('.zmp-left');
  const center = document.getElementById('zmp-center');
  const backBtn = document.getElementById('zmp-back-btn');
  if(left){ left.classList.remove('mobile-hide'); }
  if(center){ center.classList.remove('mobile-show'); }
  if(backBtn) backBtn.style.display = 'none';
  left?.scrollTo(0,0);
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
    const tl = document.getElementById('ztracklist');
    if(tl) tl.innerHTML = '';
    if(ZMP.results.length) zRenderList(ZMP.results);
    else if(tl) tl.innerHTML = '<div class="zmp-list-empty"><div style="font-size:32px;opacity:.4">🔍</div><div>Tìm bài hát để bắt đầu</div></div>';
  }
};

window.zQuick = function(q){
  const inp = document.getElementById('zs-inp');
  if(inp) inp.value = q.replace(/^[^\s]+\s/,''); // strip emoji
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
        <div class="zmp-track-thumb-ov"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>
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
  if(window.missionProgress) missionProgress('listen_music');

  // Update active states
  document.querySelectorAll('.zmp-track').forEach(el=>el.classList.remove('zactive'));
  document.querySelectorAll('.zq-track').forEach(el=>el.classList.remove('zqactive'));
  document.getElementById('zt-'+track.id)?.classList.add('zactive');
  document.querySelectorAll('.zq-track')[idx]?.classList.add('zqactive');

  zShowPlayer(track, true);
};

function zShowPlayer(track, load){
  const inner = document.getElementById('zmp-player-inner');
  const idle = document.getElementById('zmp-idle');
  const bottom = document.getElementById('zbottom');
  if(inner) inner.style.display = 'flex';
  if(idle) idle.style.display = 'none';
  if(bottom){ bottom.classList.add('active'); bottom.style.display = ''; }
  document.body.classList.add('has-player');
  window.zMobileShowPlayer && window.zMobileShowPlayer();

  const bg = document.getElementById('zbg');
  if(bg && track.art) bg.style.backgroundImage = `url('${track.art}')`;

  const artImg = document.getElementById('zart-img');
  if(artImg) artImg.src = track.art || '';

  const tEl = document.getElementById('zsong-title'); if(tEl) tEl.textContent = track.title;
  const aEl = document.getElementById('zsong-artist'); if(aEl) aEl.textContent = track.artist;
  const stEl = document.getElementById('zstats');
  if(stEl) stEl.innerHTML = `<svg width=14 height=14 viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M3 18v-6a9 9 0 0 1 18 0v6'/><path d='M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z'/></svg> ${fmtN(track.plays)} · <svg width=12 height=12 viewBox='0 0 24 24' fill='currentColor'><path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/></svg> ${fmtN(track.likes)}`;

  const lb = document.getElementById('zlike-btn');
  if(lb){ const liked=ZMP.liked.has(String(track.id)); lb.className='zmp-like-btn'+(liked?' liked':''); lb.innerHTML=liked?`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Đã thích`:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Thích`; }

  const durEl = document.getElementById('zpt-dur'); if(durEl) durEl.textContent = fmtT(track.dur);

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
    });
    audio.addEventListener('waiting', ()=>{ if(ov) ov.style.display='flex'; });

    const savedEntry = S.nhacHist && S.nhacHist.find(x=>x.id===String(track.id));
    const savedPos = savedEntry && savedEntry.positionSec > 5 ? savedEntry.positionSec : 0;

    await audio.play();
    ZMP._lastHistSave = null;
    ZMP.playing = true;

    if(savedPos && audio.duration && savedPos < audio.duration - 10){
      audio.currentTime = savedPos;
    } else if(savedPos){
      const trySeek = ()=>{ if(audio.duration && savedPos < audio.duration - 10) audio.currentTime = savedPos; };
      audio.addEventListener('loadedmetadata', trySeek, {once:true});
    }

    if(disc){ disc.classList.add('spinning'); disc.classList.remove('paused'); }
    if(ov) ov.style.display='none';

    // FIX: dùng innerHTML svg thay vì textContent để tránh bug icon
    const pb = document.getElementById('zplay-btn');
    if(pb) pb.innerHTML=`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    const pbt = document.getElementById('zbt-play');
    if(pbt) pbt.innerHTML=`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    const btArt = document.getElementById('zbt-art'); if(btArt) btArt.classList.add('spinning');
  }catch(e){
    if(ov){
      ov.innerHTML = '<div style="color:#f87171;font-size:13px;text-align:center">❌ Không thể phát bài này<br><span style="font-size:11px;opacity:.6">Thử lại hoặc chọn bài khác</span></div>';
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
  const pf=document.getElementById('zpf'); if(pf) pf.style.width=pct+'%';
  const ct=document.getElementById('zpt-cur'); if(ct) ct.textContent=fmtT(cur);
  const dt=document.getElementById('zpt-dur'); if(dt) dt.textContent=fmtT(dur);
  const bf=document.getElementById('zbt-fill'); if(bf) bf.style.width=pct+'%';
  const bc=document.getElementById('zbt-cur'); if(bc) bc.textContent=fmtT(cur);
  const bd=document.getElementById('zbt-dur'); if(bd) bd.textContent=fmtT(dur);
  if(!ZMP._lastHistSave || cur - ZMP._lastHistSave >= 5){
    ZMP._lastHistSave = cur;
    const track = ZMP.results[ZMP.curIdx];
    if(track && window.addNhacHist) addNhacHist({...track, dur: dur||track.dur}, cur);
  }
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
    // FIX: dùng innerHTML svg thay vì textContent ký tự unicode
    const pb = document.getElementById('zplay-btn');
    if(pb) pb.innerHTML=`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    const pbt = document.getElementById('zbt-play');
    if(pbt) pbt.innerHTML=`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    const disc2 = document.getElementById('zart-disc');
    if(disc2){ disc2.classList.add('spinning'); disc2.classList.remove('paused'); }
    document.getElementById('zbt-art')?.classList.add('spinning');
  } else {
    a.pause(); ZMP.playing=false;
    const pb = document.getElementById('zplay-btn');
    if(pb) pb.innerHTML=`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    const pbt = document.getElementById('zbt-play');
    if(pbt) pbt.innerHTML=`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
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
  if(lb){ lb.className='zmp-like-btn'+(liked?' liked':''); lb.innerHTML=liked?`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Đã thích`:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Thích`; }
};

window.zSwitchTab = function(tab){
  ZMP.rightTab = tab;
  document.getElementById('zqueue').style.display = tab==='queue'?'block':'none';
  document.getElementById('zlyrics').style.display = tab==='lyrics'?'block':'none';
  document.getElementById('ztab-queue').className = 'zrt'+(tab==='queue'?' on':'');
  document.getElementById('ztab-lyrics').className = 'zrt'+(tab==='lyrics'?' on':'');
};

// ── Keyboard Shortcuts ────────────────────────────────────
// FIX: thêm keyboard shortcuts cho J/K/V và các phím khác
document.addEventListener('keydown', function(e){
  // Bỏ qua khi đang focus vào input/textarea/select
  const tag = document.activeElement?.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT') return;
  // Bỏ qua khi đang xem phim (iframe focused)
  if(document.activeElement?.tagName==='IFRAME') return;

  switch(e.key){
    case ' ':                          // Space = play/pause
      e.preventDefault();
      if(ZMP.audio) zTogglePlay();
      break;
    case 'k':                          // K = play/pause
    case 'K':
      if(ZMP.audio) zTogglePlay();
      break;
    case 'j':                          // J = bài trước
    case 'J':
      if(ZMP.results.length) zPrev();
      break;
    case 'l':                          // L = bài tiếp
    case 'L':
      if(ZMP.results.length) zNext();
      break;
    case 'ArrowLeft':                  // ← = tua lùi 5s
      if(ZMP.audio){ e.preventDefault(); ZMP.audio.currentTime = Math.max(0, ZMP.audio.currentTime - 5); }
      break;
    case 'ArrowRight':                 // → = tua tới 5s
      if(ZMP.audio){ e.preventDefault(); ZMP.audio.currentTime = Math.min(ZMP.audio.duration||0, ZMP.audio.currentTime + 5); }
      break;
    case 'ArrowUp':                    // ↑ = tăng volume
      e.preventDefault();
      zSetVol(Math.min(1, ZMP.volume + 0.1).toFixed(2));
      break;
    case 'ArrowDown':                  // ↓ = giảm volume
      e.preventDefault();
      zSetVol(Math.max(0, ZMP.volume - 0.1).toFixed(2));
      break;
    case 'v':                          // V = mute/unmute
    case 'V':
    case 'm':                          // M = mute
    case 'M':
      zMute();
      break;
    case 'r':                          // R = toggle loop
    case 'R':
      zToggleLoop();
      break;
    case 's':                          // S = toggle shuffle
    case 'S':
      zToggleShuffle();
      break;
  }
});

// ── Touch fix cho slider trên iOS/Android ────────────────
// Safari iOS không trigger oninput đúng khi touchmove trên <input type=range>
// Fix: dùng pointermove / touchmove để update thủ công
(function(){
  function fixSlider(sel, onChangeFn){
    document.addEventListener('pointerdown', function(e){
      const el = e.target.closest(sel);
      if(!el) return;
      function onMove(ev){
        const rect = el.getBoundingClientRect();
        const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const val = parseFloat(el.min||0) + pct * (parseFloat(el.max||1) - parseFloat(el.min||0));
        el.value = val;
        onChangeFn(val, el);
      }
      function onUp(){ document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    }, {passive: true});
  }

  // Volume nhạc
  fixSlider('.zvol-sl', function(val){ zSetVol(val); });
  // Volume bottom bar
  fixSlider('.zbt-vol-sl', function(val){ zSetVol(val); });
  // Volume YT
  fixSlider('.yt-vol-sl', function(val){ if(window.ytVol) ytVol(Math.round(val)); });
  // Seek bar nhạc (zpb) — dùng click handler gốc, thêm touch
  fixSlider('.zmp-prog-bar', function(val, el){
    if(!ZMP.audio) return;
    const pct = (val - parseFloat(el.min||0)) / (parseFloat(el.max||1) - parseFloat(el.min||0));
    ZMP.audio.currentTime = pct * (ZMP.audio.duration||0);
  });
})();
