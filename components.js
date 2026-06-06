// ═══════════════════════════════════════
//  BADGE + TEXT
// ═══════════════════════════════════════
function kkBadge(m){
  const t = m.type||'';
  const lang = (m.lang||'').toLowerCase();
  const isLT = lang.includes('lồng')||lang.includes('long')||lang.includes('thuyết');
  if(isLT) return '<span class="c-badge cb-lt">🔊 LỒNG TIẾNG</span>';
  if(t==='series')   return '<span class="c-badge cb-bo">PHIM BỘ</span>';
  if(t==='single')   return '<span class="c-badge cb-le">PHIM LẺ</span>';
  if(t==='hoathinh') return '<span class="c-badge cb-hh">HOẠT HÌNH</span>';
  return '<span class="c-badge cb-vn">🇻🇳</span>';
}
function kkTxt(m){
  const t=m.type||'';
  if(t==='series')   return 'PHIM BỘ';
  if(t==='single')   return 'PHIM LẺ';
  if(t==='hoathinh') return 'HOẠT HÌNH';
  return 'PHIM VIỆT';
}

// ═══════════════════════════════════════
//  CARD BUILDERS
// ═══════════════════════════════════════
function CardKK(m){
  const title = esc(m.name||m.title||'?');
  const sub   = esc(m.origin_name||'');
  const year  = m.year||'';
  const slug  = m.slug||'';
  const po    = fixImg(m.poster_url||m.thumb_url)||PH();
  const ep    = m.episode_current||'';
  return `<div class="card" onclick="go('det-kk',{slug:'${slug}'})">
    <div class="c-poster">
      <img src="${po}" alt="${title}" loading="lazy" onerror="this.src='${PH()}'">
      ${kkBadge(m)}
      ${ep?`<span class="c-ep">${esc(ep)}</span>`:''}
      <div class="c-ov"><div class="c-play" onclick="event.stopPropagation();go('play-kk',{slug:'${slug}'})">▶</div></div>
    </div>
    <div class="c-info">
      <div class="c-title">${title}</div>
      ${sub&&sub!==title?`<div class="c-sub">${sub}</div>`:''}
      <div class="c-sub">${year}</div>
    </div>
  </div>`;
}

function CardAnime(m){
  const d     = m.node||m;
  const title = esc(d.title||'?');
  const eng   = esc(d.title_english||'');
  const year  = d.year||'';
  const rat   = d.score?d.score.toFixed(1):'';
  const id    = d.mal_id;
  const imgs  = d.images||{};
  const po    = (imgs.jpg&&(imgs.jpg.large_image_url||imgs.jpg.image_url))||(imgs.webp&&imgs.webp.image_url)||PH();
  const eps   = d.episodes?d.episodes+'ep':'';
  return `<div class="card" onclick="go('det-ani',{malId:${id}})">
    <div class="c-poster">
      <img src="${po}" alt="${title}" loading="lazy" onerror="this.src='${PH()}'">
      <span class="c-badge cb-ani">ANIME</span>
      ${rat?`<span class="c-rat">⭐${rat}</span>`:''}
      ${eps?`<span class="c-ep">${eps}</span>`:''}
      <div class="c-ov"><div class="c-play" onclick="event.stopPropagation();go('play-ani',{malId:${id}})">▶</div></div>
    </div>
    <div class="c-info">
      <div class="c-title">${title}</div>
      ${eng&&eng!==title?`<div class="c-sub">${eng}</div>`:''}
      <div class="c-sub">${year}</div>
    </div>
  </div>`;
}

function CardYT(v){
  const id    = v.videoId||'';
  const title = esc(v.title||'');
  const ch    = esc(v.author||'');
  const dur   = fmtSec(v.lengthSeconds||0);
  const thumb = ytThumb(v);
  return `<div class="yt-card" onclick="go('play-yt',{ytId:'${id}'})">
    <div class="yt-thumb">
      <img src="${esc(thumb)}" alt="${title}" loading="lazy" onerror="this.src='${PH(210,118)}'">
      ${dur?`<span class="yt-dur">${dur}</span>`:''}
    </div>
    <div class="yt-info">
      <div class="yt-title">${title}</div>
      <div class="yt-ch">📺 ${ch}</div>
    </div>
  </div>`;
}

// ═══════════════════════════════════════
//  SKELETON LOADERS
// ═══════════════════════════════════════
function skRow(n=10){
  return '<div class="row">' + Array(n).fill(`<div class="sk sk-p"></div>`).join('') + '</div>';
}
function skYTRow(n=8){
  return '<div class="row">' + Array(n).fill(`<div class="sk sk-yt"></div>`).join('') + '</div>';
}
function skGrid(n=20){
  return '<div class="grid">' + Array(n).fill(`<div class="sk sk-p" style="height:${232}px"></div>`).join('') + '</div>';
}

// ═══════════════════════════════════════
//  NAV
// ═══════════════════════════════════════
function renderNav(){
  const p = S.page;
  const isOn = (pg, cat) => (p===pg && (!cat||S.cat===cat)) ? 'on' : '';
  return `<div id="nav">
    <button class="hamburger" id="ham-btn" onclick="toggleSidebar()" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <div class="logo" onclick="go('home')">DZI<b> MUSIC & MOVIE</b></div>
    <ul class="nav-links">
      <li><a class="${isOn('home')}" onclick="go('home')">Trang chủ</a></li>
      <li><a class="${isOn('cat','phim-moi')}" onclick="go('cat',{cat:'phim-moi'})">Phim mới</a></li>
      <li><a class="${isOn('cat','phim-le')}" onclick="go('cat',{cat:'phim-le'})">Phim lẻ</a></li>
      <li><a class="${isOn('cat','phim-bo')}" onclick="go('cat',{cat:'phim-bo'})">Phim bộ</a></li>
      <li><a class="${p==='lt'?'on':''}" onclick="go('lt')" style="color:${p==='lt'?'var(--gold)':''}">🔊 Lồng tiếng</a></li>
      <li><a class="${isOn('cat','anime')}" onclick="go('cat',{cat:'anime'})">Anime 🎌</a></li>
      <li><a class="${isOn('cat','yt')}" onclick="go('cat',{cat:'yt'})" style="color:${isOn('cat','yt')?'':S.cat==='yt'?'var(--yt)':''}">🔴 YouTube</a></li>
      <li><a class="${p==='nhac'?'on':''}" onclick="go('nhac')" style="color:${p==='nhac'?'var(--green)':''}">🎵 Nhạc</a></li>
      <li><a onclick="go('watchlist')">Yêu thích</a></li>
    </ul>
    <div class="nav-right">
      <div class="search-wrap" id="sw">
        <div class="search-box">
          <span style="color:var(--mu);font-size:14px">🔍</span>
          <input type="text" placeholder="${p==='nhac'?'Tìm bài hát, nghệ sĩ...':'Tìm phim, anime, YT...'}" id="nav-q"
            value="${p==='search'?esc(S.q):''}"
            autocomplete="off"
            oninput="navInput(this.value)"
            onkeydown="if(event.key==='Enter'){if(S.page==='nhac'){const zi=document.getElementById('zs-inp');if(zi){zi.value=this.value;zSearch();}else{go('search',{q:this.value});}closeNav();}else{go('search',{q:this.value});closeNav();}}"
            onfocus="navInput(this.value)"/>
        </div>
        <div id="drop"></div>
      </div>
    </div>
  </div>

  <!-- MOBILE SIDEBAR OVERLAY -->
  <div id="sidebar-overlay" onclick="closeSidebar()"></div>
  <div id="sidebar">
    <div class="sb-header">
      <div class="sb-logo">DZI<b> MUSIC & MOVIE</b></div>
      <button class="sb-close" onclick="closeSidebar()">✕</button>
    </div>

    <!-- MODE SWITCHER: NHẠC / PHIM -->
    <div class="sb-mode">
      <button class="sb-mode-btn ${p==='nhac'?'active':''}" onclick="go('nhac');closeSidebar()">
        <span class="sbm-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </span>
        <span class="sbm-label">Nghe Nhạc</span>
      </button>
      <button class="sb-mode-btn ${p!=='nhac'?'active':''}" onclick="go('home');closeSidebar()">
        <span class="sbm-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
        </span>
        <span class="sbm-label">Xem Phim</span>
      </button>
    </div>

    <div class="sb-divider"></div>

    <!-- PHIM LINKS -->
    <div class="sb-section-title">PHIM</div>
    <ul class="sb-icon-links">
      <li><a class="${isOn('home')}" onclick="go('home');closeSidebar()">
        <span class="sbi" style="background:linear-gradient(135deg,#1e3a5f,#2563eb)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </span>Trang chủ
      </a></li>
      <li><a class="${isOn('cat','phim-moi')}" onclick="go('cat',{cat:'phim-moi'});closeSidebar()">
        <span class="sbi" style="background:linear-gradient(135deg,#7c1d1d,#dc2626)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </span>Phim mới
      </a></li>
      <li><a class="${isOn('cat','phim-le')}" onclick="go('cat',{cat:'phim-le'});closeSidebar()">
        <span class="sbi" style="background:linear-gradient(135deg,#1e3a2f,#059669)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
        </span>Phim lẻ
      </a></li>
      <li><a class="${isOn('cat','phim-bo')}" onclick="go('cat',{cat:'phim-bo'});closeSidebar()">
        <span class="sbi" style="background:linear-gradient(135deg,#1e2a3a,#0284c7)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </span>Phim bộ
      </a></li>
      <li><a class="${p==='lt'?'on':''}" onclick="go('lt');closeSidebar()">
        <span class="sbi" style="background:linear-gradient(135deg,#3d2a00,#d97706)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </span><span style="color:var(--gold)">Lồng tiếng</span>
      </a></li>
      <li><a class="${isOn('cat','anime')}" onclick="go('cat',{cat:'anime'});closeSidebar()">
        <span class="sbi" style="background:linear-gradient(135deg,#2d1a3d,#9333ea)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        </span>Anime
      </a></li>
      <li><a class="${isOn('cat','yt')}" onclick="go('cat',{cat:'yt'});closeSidebar()">
        <span class="sbi" style="background:linear-gradient(135deg,#3d0000,#ef4444)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
        </span><span style="color:var(--yt)">YouTube</span>
      </a></li>
    </ul>

    <div class="sb-divider"></div>

    <div class="sb-section-title">NHẠC</div>
    <ul class="sb-icon-links">
      <li><a class="${p==='nhac'?'on':''}" onclick="go('nhac');closeSidebar()">
        <span class="sbi" style="background:linear-gradient(135deg,#0f2a1a,#16a34a)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </span><span style="color:${p==='nhac'?'var(--green)':''}">Nghe nhạc</span>
      </a></li>
    </ul>

    <div class="sb-divider"></div>

    <div class="sb-section-title">TÀI KHOẢN</div>
    <ul class="sb-icon-links">
      <li><a onclick="go('watchlist');closeSidebar()">
        <span class="sbi" style="background:linear-gradient(135deg,#3d0a0a,#dc2626)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </span>Yêu thích
      </a></li>
      <li><a onclick="go('search',{q:''});closeSidebar()">
        <span class="sbi" style="background:linear-gradient(135deg,#1a1a3d,#4f46e5)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>Tìm kiếm
      </a></li>
    </ul>
  </div>`;
}

// ═══════════════════════════════════════
//  FOOTER
// ═══════════════════════════════════════
function renderFooter(){
  return `<footer>
    <div class="ft-row">
      <div>
        <div class="ft-logo">DZI<b> MUSIC & MOVIE</b></div>
        <div class="ft-tag">Phim Việt · Anime · YouTube — Hoàn toàn miễn phí</div>
        <div class="ft-src">
          <span class="ft-chip" style="background:rgba(16,185,129,.15);color:var(--green)">🇻🇳 KKPhim</span>
          <span class="ft-chip" style="background:rgba(168,85,247,.15);color:var(--purple)">🎌 Jikan/MAL</span>
          <span class="ft-chip" style="background:rgba(255,0,0,.15);color:var(--yt)">🔴 YouTube</span>
          <span class="ft-chip" style="background:rgba(59,130,246,.15);color:var(--blue)">📺 VidSrc</span>
        </div>
      </div>
      <div class="ft-cols">
        <div class="ft-col"><h4>Phim Việt</h4><ul>
          <li><a onclick="go('cat',{cat:'phim-moi'})">Phim mới</a></li>
          <li><a onclick="go('cat',{cat:'phim-le'})">Phim lẻ</a></li>
          <li><a onclick="go('cat',{cat:'phim-bo'})">Phim bộ</a></li>
          <li><a onclick="go('lt')" style="color:var(--gold)">🔊 Lồng tiếng</a></li>
          <li><a onclick="go('cat',{cat:'hoat-hinh'})">Hoạt hình</a></li>
        </ul></div>
        <div class="ft-col"><h4>Anime</h4><ul>
          <li><a onclick="go('cat',{cat:'anime'})">Top Anime</a></li>
          <li><a onclick="go('cat',{cat:'anime-now'})">Đang chiếu</a></li>
        </ul></div>
        <div class="ft-col"><h4>YouTube</h4><ul>
          <li><a onclick="go('cat',{cat:'yt'})">Tìm kiếm YT</a></li>
        </ul></div>
        <div class="ft-col"><h4>🎵 Nhạc</h4><ul>
          <li><a onclick="go('nhac')">Nghe Nhạc</a></li>
          <li><a onclick="go('nhac')">SoundCloud</a></li>
        </ul></div>
        <div class="ft-col"><h4>Tài khoản</h4><ul>
          <li><a onclick="go('watchlist')">Yêu thích</a></li>
          <li><a onclick="go('watchlist')">Lịch sử xem</a></li>
        </ul></div>
      </div>
    </div>
    <div class="ft-bot">
      <div>© 2026 DZI MUSIC & MOVIE</div>
      <div>KKPhim · Jikan · Invidious · VidSrc</div>
    </div>
  </footer>`;
}

// ═══════════════════════════════════════
//  NAV SCROLL EFFECT
// ═══════════════════════════════════════
function setupNavScroll(){
  const nav=document.getElementById('nav'); if(!nav) return;
  window.removeEventListener('scroll',window._ns);
  window._ns=()=>nav.style.background=window.scrollY>40?'rgba(7,9,15,.99)':'rgba(7,9,15,.96)';
  window.addEventListener('scroll',window._ns); window._ns();
}

// ═══════════════════════════════════════
//  NAV SEARCH DROPDOWN
// ═══════════════════════════════════════
let _navT;
window.navInput = async function(q){
  const drop=document.getElementById('drop'); if(!drop) return;
  if(!q.trim()){ drop.className=''; drop.innerHTML=''; return; }
  clearTimeout(_navT);
  drop.className='show';
  drop.innerHTML='<div style="padding:12px;text-align:center"><span class="spin"></span></div>';
  _navT=setTimeout(async function(){
    try{
      const [kkR,jkR,ytR]=await Promise.all([
        kkSearch(q,1).catch(()=>null),
        jkSearch(q,1).catch(()=>null),
        ytSearch(q,1).catch(()=>[]),
      ]);
      const ki=(kkR?kkI(kkR):[]).slice(0,4);
      const ji=(jkR?(jkR.data||[]):[]).slice(0,3);
      const yi=(ytR||[]).slice(0,3);
      if(!ki.length&&!ji.length&&!yi.length){ drop.className=''; drop.innerHTML=''; return; }
      let html='';
      if(ki.length){
        html+='<div class="drop-sep">🇻🇳 Phim Việt (KKPhim)</div>';
        html+=ki.map(m=>`<div class="drop-item" onclick="go('det-kk',{slug:'${m.slug}'});closeNav()">
          <img src="${fixImg(m.thumb_url||m.poster_url)||PH(32,48)}" onerror="this.src='${PH(32,48)}'">
          <div><div class="di-title">${esc(m.name||m.title||'')}</div>
          <div class="di-sub"><span class="tag vn">KKPhim</span>${esc(m.year||'')}</div></div>
        </div>`).join('');
      }
      if(ji.length){
        html+='<div class="drop-sep">🎌 Anime (Jikan/MAL)</div>';
        html+=ji.map(m=>{ const imgs=m.images||{}; const po2=(imgs.jpg&&imgs.jpg.image_url)||(imgs.webp&&imgs.webp.image_url)||PH(32,48);
          return `<div class="drop-item" onclick="go('det-ani',{malId:${m.mal_id}});closeNav()">
            <img src="${po2}" onerror="this.src='${PH(32,48)}'">
            <div><div class="di-title">${esc(m.title||'')}</div>
            <div class="di-sub"><span class="tag ani">Anime</span>${esc(m.year||'')}</div></div>
          </div>`;}).join('');
      }
      if(yi.length){
        html+='<div class="drop-sep">🔴 YouTube</div>';
        html+=yi.map(v=>`<div class="drop-item yt-row" onclick="go('play-yt',{ytId:'${esc(v.videoId||'')}'}); closeNav()">
          <img src="${esc(ytThumb(v))}" onerror="this.src='${PH(54,34)}'">
          <div><div class="di-title">${esc(v.title||'')}</div>
          <div class="di-sub"><span class="tag yt">YouTube</span>${esc(v.author||'')}</div></div>
        </div>`).join('');
      }
      html+=`<div class="drop-more" onclick="go('search',{q:'${esc(q)}'});closeNav()">Xem tất cả kết quả cho "${esc(q)}" →</div>`;
      drop.innerHTML=html; drop.className='show';
    }catch(e){ drop.className=''; drop.innerHTML=''; }
  },360);
};

window.closeNav=()=>{ const d=document.getElementById('drop'); if(d){d.className='';d.innerHTML='';} };
document.addEventListener('click',e=>{ const sw=document.getElementById('sw'); if(sw&&!sw.contains(e.target)) closeNav(); });

// ═══════════════════════════════════════
//  SIDEBAR TOGGLE
// ═══════════════════════════════════════
window.toggleSidebar = function(){
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  const btn = document.getElementById('ham-btn');
  if(!sb) return;
  const open = sb.classList.toggle('open');
  if(ov) ov.classList.toggle('show', open);
  if(btn) btn.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
window.closeSidebar = function(){
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  const btn = document.getElementById('ham-btn');
  if(sb) sb.classList.remove('open');
  if(ov) ov.classList.remove('show');
  if(btn) btn.classList.remove('open');
  document.body.style.overflow = '';
};
