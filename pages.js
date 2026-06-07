// ═══════════════════════════════════════
//  HOME PAGE — GIỚI THIỆU (v18 Enhanced)
// ═══════════════════════════════════════
function pgHome(){
  const app=document.getElementById('app');
  const ms = (window.DZI_USER && window.initMissionState) ? initMissionState(DZI_USER.username) : null;
  const doneCnt = ms ? ms.missions.filter(m=>m.done).length : 0;
  const isAdmin = window.DZI_ADMIN;
  const lv = isAdmin ? 30 : (ms ? calcLevel(ms.totalExp) : 1);
  const lvColor = isAdmin ? '#ff1744' : (ms ? getLvColor(lv) : '#4f7cff');
  const trustCount = window.DZI_TRUST_COUNT || parseInt(localStorage.getItem('dzi_trust_count')||'0') || 1247;
  app.innerHTML = renderNav() + `
  <div class="page" id="hp-intro">

    <!-- HERO INTRO -->
    <div class="intro-hero">
      <div class="intro-hero-bg"></div>
      <div class="intro-hero-content">
        <div class="intro-avatar-wrap">
          <div class="intro-avatar-ring"></div>
          <div class="intro-avatar">
            <img src="anh.jpg" alt="DZI" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.style.display='none';this.parentElement.innerHTML='<span style=font-size:36px;line-height:1>🎵</span>'"/>
          </div>
        </div>
        <div class="intro-tag-line">
          <span class="intro-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            Hà Đông · Hà Nội
          </span>
          <span class="intro-badge intro-badge-green">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 3a7 7 0 1 1 0 14A7 7 0 0 1 12 5zm0 2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/></svg>
            Sinh năm 2006
          </span>
        </div>
        <h1 class="intro-name">Nguyễn Hoàng Khánh Nam</h1>
        <div class="intro-alias">
          <span class="intro-dzi">DZI</span>
        </div>
        <p class="intro-desc">
          Chào mừng bạn đến với <strong>DZI MUSIC &amp; MOVIE</strong> — nền tảng nghe nhạc &amp; xem phim hoàn toàn <em>miễn phí</em>, được xây dựng bởi một người đam mê âm nhạc và điện ảnh từ Hà Đông, Hà Nội.
        </p>
        <div class="intro-cta-row">
          <button class="btn btn-red intro-cta" onclick="go('phim')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
            Xem Phim
          </button>
          <button class="btn intro-cta" style="background:linear-gradient(135deg,#064e3b,#059669)" onclick="go('nhac')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            Nghe Nhạc
          </button>
        </div>
      </div>
    </div>

    <!-- STATS ROW -->
    <!-- TRUST COUNTER -->
    <div class="intro-trust-bar">
      <div class="trust-avatars">
        <div class="ta" style="background:linear-gradient(135deg,#4f7cff,#7c3aed)">K</div>
        <div class="ta" style="background:linear-gradient(135deg,#059669,#0284c7)">H</div>
        <div class="ta" style="background:linear-gradient(135deg,#dc2626,#f97316)">M</div>
        <div class="ta" style="background:linear-gradient(135deg,#9333ea,#ec4899)">A</div>
        <div class="ta" style="background:linear-gradient(135deg,#0891b2,#7c3aed)">T</div>
        <div class="ta" style="background:rgba(79,124,255,.2);color:rgba(232,238,255,.6);font-size:10px">+${Math.max(0,trustCount-5)}</div>
      </div>
      <div class="trust-text">
        <div class="trust-num" id="trust-counter">${trustCount.toLocaleString()}</div>
        <div class="trust-label">người dùng đã tin tưởng DZI</div>
      </div>
      <div class="trust-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Uy tín
      </div>
    </div>

    <!-- STATS ROW -->
    <div class="intro-stats">
      <div class="intro-stat">
        <div class="intro-stat-num">∞</div>
        <div class="intro-stat-label">Phim miễn phí</div>
      </div>
      <div class="intro-stat">
        <div class="intro-stat-num">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </div>
        <div class="intro-stat-label">DZI x MUSIC</div>
      </div>
      <div class="intro-stat">
        <div class="intro-stat-num">0đ</div>
        <div class="intro-stat-label">Chi phí</div>
      </div>
      <div class="intro-stat">
        <div class="intro-stat-num">24/7</div>
        <div class="intro-stat-label">Hoạt động</div>
      </div>
    </div>

    <!-- MISSIONS PROMO (nếu đã login) -->
    ${window.DZI_USER ? `
    <div class="intro-mission-card" onclick="go('missions')">
      <div class="imc-left">
        <div class="imc-icon">⚔️</div>
        <div>
          <div class="imc-title">Nhiệm vụ hôm nay</div>
          <div class="imc-sub">${doneCnt}/7 hoàn thành · Lv<span style="color:${lvColor};font-weight:900"> ${lv}</span> ${getLvTitle(lv)}</div>
        </div>
      </div>
      <div class="imc-right">
        <div class="imc-ring">
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(79,124,255,.2)" stroke-width="4"/>
            <circle cx="22" cy="22" r="18" fill="none" stroke="#4f7cff" stroke-width="4" stroke-dasharray="${Math.round(113.1*doneCnt/7)} 113.1" stroke-linecap="round" transform="rotate(-90 22 22)"/>
          </svg>
          <span style="position:absolute;font-size:12px;font-weight:900;color:#e8eeff">${doneCnt}</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(232,238,255,.4)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>` : `
    <div class="intro-mission-card" onclick="openDziModal('dzi-auth-screen')" style="border-color:rgba(251,191,36,.25);background:rgba(251,191,36,.05)">
      <div class="imc-left">
        <div class="imc-icon">🎯</div>
        <div>
          <div class="imc-title" style="color:#fbbf24">Hệ thống nhiệm vụ</div>
          <div class="imc-sub">Đăng nhập để nhận 7 nhiệm vụ · Kiếm EXP · Thăng cấp</div>
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(251,191,36,.5)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </div>`}

    <!-- ADMIN INFO CARD -->
    <div class="intro-admin-card">
      <div class="iac-header">
        <div class="iac-crown">👨‍💻</div>
        <div>
          <div class="iac-name">Nguyễn Hoàng Khánh Nam</div>
          <div class="iac-role">DZI · Founder & Developer · 2006</div>
        </div>
      </div>
      <div class="iac-contacts">
        <a class="iac-btn iac-zalo" href="https://zalo.me/0993329535" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/></svg>
          Zalo
        </a>
        <a class="iac-btn iac-tele" href="https://t.me/dzimeomeo" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.68 8.26l-2.05 9.66c-.15.68-.55.84-1.11.52l-3.07-2.26-1.48 1.43c-.16.16-.3.3-.62.3l.22-3.12 5.67-5.12c.25-.22-.05-.34-.38-.12L6.97 14.6 3.94 13.6c-.66-.21-.67-.66.14-.97l11.16-4.3c.55-.2 1.03.13.44.93z"/></svg>
          Telegram
        </a>
        <a class="iac-btn iac-tiktok" href="https://tiktok.com/@hkhanhnam206" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.32a8.16 8.16 0 004.77 1.52V7.39a4.85 4.85 0 01-1-.7z"/></svg>
          @hkhanhnam206
        </a>
      </div>
    </div>

    <!-- ABOUT SECTION -->
    <div class="intro-about-grid">
      <div class="intro-card">
        <div class="intro-card-icon" style="background:linear-gradient(135deg,#7c1d1d,#dc2626)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
        </div>
        <h3>Xem Phim</h3>
        <p>Phim Việt, phim bộ, phim lẻ, lồng tiếng, thuyết minh. Anime mới nhất. DZITube không quảng cáo. Tất cả miễn phí.</p>
        <button class="btn btn-ghost intro-card-btn" onclick="go('phim')">Khám phá →</button>
      </div>

      <div class="intro-card">
        <div class="intro-card-icon" style="background:linear-gradient(135deg,#064e3b,#10b981)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        </div>
        <h3>DZI x MUSIC</h3>
        <p>Nghe nhạc trực tuyến miễn phí. V-Pop, Rap Việt, Bolero, Lo-Fi, EDM, K-Pop. Playlist cá nhân, yêu thích &amp; tìm kiếm.</p>
        <button class="btn btn-ghost intro-card-btn" style="border-color:var(--green);color:var(--green)" onclick="go('nhac')">Nghe ngay →</button>
      </div>

      <div class="intro-card">
        <div class="intro-card-icon" style="background:linear-gradient(135deg,#1e3a5f,#3b82f6)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <h3>Miễn Phí 100%</h3>
        <p>Không đăng ký, không tài khoản, không quảng cáo phiền hà. Truy cập trực tiếp, xem &amp; nghe không giới hạn.</p>
        <button class="btn btn-ghost intro-card-btn" style="border-color:var(--blue);color:var(--blue)" onclick="go('nhac')">Bắt đầu →</button>
      </div>
    </div>

    <!-- DZI x MUSIC — CUSTOM PLAYER -->
    <section class="intro-sc-section">
      <div class="intro-sc-header">
        <div class="intro-sc-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          DZI x MUSIC
        </div>
        <span class="intro-sc-sub">Nhạc cá nhân tuyển chọn</span>
      </div>
      <div class="dzi-music-player" id="dzi-home-player">
        <div class="dmp-visualizer">
          <div class="dmp-bars" id="dmp-bars">
            <div class="dmp-bar" style="animation-delay:0.0s"></div><div class="dmp-bar" style="animation-delay:0.07s"></div><div class="dmp-bar" style="animation-delay:0.14s"></div><div class="dmp-bar" style="animation-delay:0.21s"></div><div class="dmp-bar" style="animation-delay:0.28s"></div><div class="dmp-bar" style="animation-delay:0.35s"></div><div class="dmp-bar" style="animation-delay:0.42s"></div><div class="dmp-bar" style="animation-delay:0.49s"></div><div class="dmp-bar" style="animation-delay:0.56s"></div><div class="dmp-bar" style="animation-delay:0.63s"></div><div class="dmp-bar" style="animation-delay:0.7s"></div><div class="dmp-bar" style="animation-delay:0.77s"></div><div class="dmp-bar" style="animation-delay:0.84s"></div><div class="dmp-bar" style="animation-delay:0.91s"></div><div class="dmp-bar" style="animation-delay:0.98s"></div><div class="dmp-bar" style="animation-delay:1.05s"></div><div class="dmp-bar" style="animation-delay:1.12s"></div><div class="dmp-bar" style="animation-delay:1.19s"></div><div class="dmp-bar" style="animation-delay:1.26s"></div><div class="dmp-bar" style="animation-delay:1.33s"></div><div class="dmp-bar" style="animation-delay:1.4s"></div><div class="dmp-bar" style="animation-delay:1.47s"></div><div class="dmp-bar" style="animation-delay:1.54s"></div><div class="dmp-bar" style="animation-delay:1.61s"></div>
          </div>
          <div class="dmp-vinyl" id="dmp-vinyl">
            <div class="dmp-vinyl-inner">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
          </div>
        </div>
        <div class="dmp-info">
          <div class="dmp-track-name" id="dmp-name">Nonstop Trend 2026 - Nhạc Remix</div>
          <div class="dmp-track-artist" id="dmp-artist">DZI x MUSIC · Tuyển chọn</div>
          <div class="dmp-progress-wrap">
            <div class="dmp-progress-bg"><div class="dmp-progress-fill" id="dmp-fill"></div></div>
            <div class="dmp-time"><span id="dmp-cur">0:00</span><span id="dmp-dur">--:--</span></div>
          </div>
          <div class="dmp-controls">
            <button class="dmp-btn dmp-btn-sm" onclick="dmpPrev()" title="Trước"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg></button>
            <button class="dmp-btn dmp-btn-play" id="dmp-play" onclick="dmpToggle()">
              <svg id="dmp-ico-play" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              <svg id="dmp-ico-pause" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            </button>
            <button class="dmp-btn dmp-btn-sm" onclick="dmpNext()" title="Tiếp"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2.5-6 8.5 6V6z"/></svg></button>
            <button class="dmp-btn dmp-btn-sm dmp-shuffle" id="dmp-shuf" onclick="dmpShuffle()" title="Ngẫu nhiên"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="4" y1="4" x2="9" y2="9"/></svg></button>
          </div>
        </div>
        <div class="dmp-playlist" id="dmp-playlist">
          <div class="dmp-pl-title">Danh sách phát</div>
          <div id="dmp-pl-items"></div>
        </div>
      </div>
      <button class="btn intro-sc-more" onclick="go('nhac')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        Khám phá thêm nhạc →
      </button>
    </section>

    ${renderFooter()}
  </div>`;
  setupNavScroll();
  // Animate trust counter
  setTimeout(()=>{
    const el = document.getElementById('trust-counter');
    if(!el) return;
    const target = trustCount;
    let cur = target - 30;
    const step = () => { cur = Math.min(cur+3, target); el.textContent = cur.toLocaleString(); if(cur<target) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, 300);
}

// ═══════════════════════════════════════
//  PHIM PAGE — TRANG XEM PHIM (cũ là home)
// ═══════════════════════════════════════
// ═══════════════════════════════════════
//  PHIM PAGE (catalog)
// ═══════════════════════════════════════
// ── Phim cache ───────────────────────────────────────────
const PHIM_CACHE_KEY = 'dzi_phim_cache';
const PHIM_CACHE_TTL = 10 * 60 * 1000; // 10 phút

function phimCacheGet(){
  try{
    const raw = localStorage.getItem(PHIM_CACHE_KEY);
    if(!raw) return null;
    const c = JSON.parse(raw);
    if(Date.now() - c.ts > PHIM_CACHE_TTL) return null;
    return c.data;
  }catch(e){ return null; }
}
function phimCacheSet(data){
  try{ localStorage.setItem(PHIM_CACHE_KEY, JSON.stringify({ts:Date.now(), data})); }catch(e){}
}

async function pgPhim(){
  const app=document.getElementById('app');

  // Helper render từ data
  function renderPhimPage(data, isStale){
    const {kkN,kkBo,kkLe,kkLT,jkS,jkT,ytV} = data;
    const newItems  = (kkN&&kkN.items||[]).slice(0,24);
    const boItems   = kkI(kkBo).slice(0,24);
    const leItems   = kkI(kkLe).slice(0,24);
    const ltItems   = kkI(kkLT).slice(0,24);
    const aniSItems = (jkS&&jkS.data||[]).slice(0,24);
    const aniTItems = (jkT&&jkT.data||[]).slice(0,24);
    const featured  = [...newItems.slice(0,4), ...aniTItems.slice(0,3)];
    const heroHTML  = featured.map((m,i)=>{
      let bg,title,ori,year,ep,desc,srcBadge,bw,bi;
      if(m.slug){
        bg=fixImg(m.thumb_url)||fixImg(m.poster_url)||PH(1280,720);
        title=m.name||''; ori=m.origin_name||''; year=m.year||''; ep=m.episode_current||''; desc=m.content||m.description||'';
        srcBadge=`<span class="h-src" style="background:var(--green)">🇻🇳 ${kkTxt(m)}</span>`;
        bw=`go('play-kk',{slug:'${m.slug}'})`; bi=`go('det-kk',{slug:'${m.slug}'})`;
      }else{
        const imgs=m.images||{};
        bg=(imgs.jpg&&imgs.jpg.large_image_url)||(imgs.webp&&imgs.webp.large_image_url)||PH(1280,720);
        title=m.title||''; ori=m.title_english||''; year=m.year||''; ep=''; desc=m.synopsis||'';
        srcBadge=`<span class="h-src" style="background:var(--purple)">🎌 ANIME</span>`;
        bw=`go('play-ani',{malId:${m.mal_id}})`; bi=`go('det-ani',{malId:${m.mal_id}})`;
      }
      return `<div class="hslide${i===0?' on':''}">
      <div class="hbg" style="background-image:url('${esc(bg)}')"></div>
      <div class="hgrad"></div>
      <div class="hcont">
        ${srcBadge}
        <h1 class="h-title">${esc(title)}</h1>
        <div class="h-meta">
          ${year?`<span>${year}</span>`:''}
          ${ep?`<span class="h-chip">${esc(ep)}</span>`:''}
          ${ori&&ori!==title?`<span style="color:var(--mu)">${esc(ori)}</span>`:''}
        </div>
        <p class="h-desc">${esc(desc)}</p>
        <div class="h-btns">
          <button class="btn btn-red" onclick="${bw}">▶ Xem ngay</button>
          <button class="btn btn-ghost" onclick="${bi}">ℹ Chi tiết</button>
        </div>
      </div>
    </div>`;
    }).join('');
    const dotsHTML = featured.map((_,i)=>`<button class="hdot${i===0?' on':''}" onclick="setSlide(${i})"></button>`).join('');
    const ytHTML = (ytV||[]).length
      ? ytV.map(CardYT).join('')
      : `<div style="color:var(--mu);font-size:13px;padding:18px">YouTube không load. <a onclick="go('cat',{cat:'yt'})" style="color:var(--yt);cursor:pointer">Tìm thủ công →</a></div>`;
    const staleNote = ''; // Update ngầm, không thông báo
    return `${staleNote}<div class="hero" id="hero">${heroHTML}<div class="hdots">${dotsHTML}</div></div>
    <section class="sec">
      <div class="sec-head"><h2 class="sec-title">🆕 Phim Việt mới cập nhật</h2><a class="see-all" onclick="go('cat',{cat:'phim-moi'})">Tất cả →</a></div>
      <div class="row">${newItems.map(CardKK).join('')}</div>
    </section>
    <section class="sec" style="background:linear-gradient(180deg,transparent,var(--s1) 20%,var(--s1) 80%,transparent)">
      <div class="sec-head"><h2 class="sec-title">🔊 Lồng tiếng / Thuyết minh</h2><a class="see-all" onclick="go('lt')">Tất cả →</a></div>
      <div class="row">${ltItems.length ? ltItems.map(CardKK).join('') : newItems.slice(4,16).map(CardKK).join('')}</div>
    </section>
    <section class="sec">
      <div class="sec-head"><h2 class="sec-title">📺 Phim bộ Vietsub</h2><a class="see-all" onclick="go('cat',{cat:'phim-bo'})">Tất cả →</a></div>
      <div class="row">${boItems.map(CardKK).join('')}</div>
    </section>
    <section class="sec" style="background:linear-gradient(180deg,transparent,var(--s1) 20%,var(--s1) 80%,transparent)">
      <div class="sec-head"><h2 class="sec-title">🎬 Phim lẻ Vietsub</h2><a class="see-all" onclick="go('cat',{cat:'phim-le'})">Tất cả →</a></div>
      <div class="row">${leItems.map(CardKK).join('')}</div>
    </section>
    <div class="div-row"><div class="div-line"></div><span class="div-label" style="background:rgba(255,0,0,.1);color:var(--yt)">🔴 YOUTUBE</span><div class="div-line"></div></div>
    <section class="sec">
      <div class="sec-head"><h2 class="sec-title">🔴 Phim hot YouTube</h2><a class="see-all" onclick="go('cat',{cat:'yt'})">Tìm kiếm →</a></div>
      <div class="row">${ytHTML}</div>
    </section>
    <div class="div-row"><div class="div-line"></div><span class="div-label" style="background:rgba(168,85,247,.1);color:var(--purple)">🎌 ANIME</span><div class="div-line"></div></div>
    <section class="sec">
      <div class="sec-head"><h2 class="sec-title">📅 Anime đang chiếu</h2><a class="see-all" onclick="go('cat',{cat:'anime-now'})">Tất cả →</a></div>
      <div class="row">${aniSItems.map(CardAnime).join('')}</div>
    </section>
    <section class="sec">
      <div class="sec-head"><h2 class="sec-title">🏆 Top Anime mọi thời đại</h2><a class="see-all" onclick="go('cat',{cat:'anime'})">Tất cả →</a></div>
      <div class="row">${aniTItems.map(CardAnime).join('')}</div>
    </section>
    ${renderFooter()}`;
  }

  function setupHeroCarousel(hp){
    let idx=0;
    const slides=hp.querySelectorAll('.hslide'), dots=hp.querySelectorAll('.hdot');
    window.setSlide = i => {
      slides[idx]?.classList.remove('on'); dots[idx]?.classList.remove('on');
      idx=i; slides[idx]?.classList.add('on'); dots[idx]?.classList.add('on');
    };
    clearInterval(window._ht);
    window._ht = setInterval(()=>setSlide((idx+1)%slides.length), 5800);
  }

  // ── Hiện cache ngay lập tức nếu có ──
  const cached = phimCacheGet();
  if(cached){
    app.innerHTML = renderNav() + `<div class="page" id="hp">${renderPhimPage(cached, true)}</div>`;
    setupNavScroll();
    const hp=document.getElementById('hp'); if(hp) setupHeroCarousel(hp);
    // Refresh ngầm sau 300ms
    setTimeout(async()=>{
      try{
        let kkN2,kkBo2,kkLe2,kkLT2,jkS2,jkT2,ytV2=[];
        [kkN2,kkBo2,kkLe2,jkS2,jkT2] = await Promise.all([kkNew(1),kkCat('phim-bo',1),kkCat('phim-le',1),jkSeason(),jkTop(1)]);
        try{ kkLT2=await get(KK_LT_URL(1)); }catch(e){ kkLT2=null; }
        try{ ytV2=await ytSearch('phim chiếu rạp 2024 hay nhất',1); }catch(e){}
        const newData={kkN:kkN2,kkBo:kkBo2,kkLe:kkLe2,kkLT:kkLT2,jkS:jkS2,jkT:jkT2,ytV:ytV2};
        phimCacheSet(newData);
        // Nếu vẫn đang ở trang phim thì re-render
        const hp3=document.getElementById('hp');
        if(hp3){ hp3.innerHTML=renderPhimPage(newData,false); setupHeroCarousel(hp3); }
        document.getElementById('phim-refresh-note')?.remove();
      }catch(e){ document.getElementById('phim-refresh-note')?.remove(); }
    }, 300);
    return;
  }

  // ── Không có cache: hiện skeleton rồi fetch (không spinner, load ngầm) ──
  app.innerHTML = renderNav() + `<div class="page" id="hp">
    <div class="hero sk" style="height:420px;border-radius:0;flex-shrink:0"></div>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">🆕 Phim Việt mới</h2></div>${skRow()}</section>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">🔊 Lồng tiếng</h2></div>${skRow()}</section>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">📺 Phim bộ</h2></div>${skRow()}</section>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">🎬 Phim lẻ</h2></div>${skRow()}</section>
    <div class="div-row"><div class="div-line"></div><span class="div-label" style="background:rgba(255,0,0,.1);color:var(--yt)">🔴 YOUTUBE</span><div class="div-line"></div></div>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">🔴 Phim hot trên DZITube</h2></div>${skYTRow()}</section>
    <div class="div-row"><div class="div-line"></div><span class="div-label" style="background:rgba(168,85,247,.1);color:var(--purple)">🎌 ANIME</span><div class="div-line"></div></div>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">📅 Anime đang chiếu</h2></div>${skRow()}</section>
    <section class="sec"><div class="sec-head"><h2 class="sec-title">🏆 Top Anime</h2></div>${skRow()}</section>
  </div>`;
  setupNavScroll();

  let kkN,kkBo,kkLe,kkLT,jkS,jkT,ytV=[];
  try{
    [kkN,kkBo,kkLe,jkS,jkT] = await Promise.all([
      kkNew(1), kkCat('phim-bo',1), kkCat('phim-le',1), jkSeason(), jkTop(1)
    ]);
    try{ kkLT = await get(KK_LT_URL(1)); }catch(e){ kkLT=null; }
    try{ ytV = await ytSearch('phim chiếu rạp 2024 hay nhất',1); }catch(e){ ytV=[]; }
  }catch(e){
    const hp2=document.getElementById('hp');
    if(hp2) hp2.innerHTML=`<div style="padding:160px 0;text-align:center"><div style="font-size:36px">😞</div><div style="font-size:14px;color:var(--mu);margin-top:11px">Lỗi kết nối API. Kiểm tra mạng.</div><button class="btn btn-red" onclick="pgPhim()" style="margin-top:14px">Thử lại</button></div>`+renderFooter();
    return;
  }

  const hp=document.getElementById('hp'); if(!hp) return;

  const newItems  = (kkN&&kkN.items||[]).slice(0,24);
  const boItems   = kkI(kkBo).slice(0,24);
  const leItems   = kkI(kkLe).slice(0,24);
  const ltItems   = kkI(kkLT).slice(0,24);
  const aniSItems = (jkS&&jkS.data||[]).slice(0,24);
  const aniTItems = (jkT&&jkT.data||[]).slice(0,24);

  // Lưu cache
  const fetchedData = {kkN,kkBo,kkLe,kkLT,jkS,jkT,ytV};
  phimCacheSet(fetchedData);

  const hpFresh=document.getElementById('hp'); if(!hpFresh) return;
  hpFresh.innerHTML = renderPhimPage(fetchedData, false);
  setupHeroCarousel(hpFresh);
}

// ═══════════════════════════════════════
//  LỒNG TIẾNG PAGE
// ═══════════════════════════════════════
async function pgLT(){
  if(window.missionProgress) missionProgress('watch_lt');
  const app=document.getElementById('app');
  app.innerHTML = renderNav() + `<div class="lt-page page">
    <h1>🔊 Lồng tiếng / Thuyết minh</h1>
    <p>Phim bộ và phim lẻ có lồng tiếng Việt Nam</p>
    <div class="lt-tabs">
      <button class="lt-tab ${S.ltTab==='bo-lt'?'on':''}" onclick="switchLT('bo-lt')">📺 Phim bộ lồng tiếng</button>
      <button class="lt-tab ${S.ltTab==='bo-tm'?'on':''}" onclick="switchLT('bo-tm')">📺 Phim bộ thuyết minh</button>
      <button class="lt-tab ${S.ltTab==='le-lt'?'on':''}" onclick="switchLT('le-lt')">🎬 Phim lẻ lồng tiếng</button>
      <button class="lt-tab ${S.ltTab==='search-lt'?'on':''}" onclick="switchLT('search-lt')">🔍 Tìm lồng tiếng</button>
    </div>
    <div id="lt-count" class="result-count">Đang tải...</div>
    <div id="lt-grid" class="grid">${skGrid(20)}</div>
    <div id="lt-more" style="text-align:center;margin-top:18px"></div>
  </div>`;
  setupNavScroll();
  await loadLT(1);
}

window.switchLT = function(tab){
  S.ltTab = tab;
  document.querySelectorAll('.lt-tab').forEach((el,i)=>{
    const tabs=['bo-lt','bo-tm','le-lt','search-lt'];
    el.className = 'lt-tab' + (tabs[i]===tab?' on':'');
  });
  loadLT(1);
};

let _ltPage=1;
window.loadLT = async function(p){
  p=p||1; _ltPage=p;
  const grid=document.getElementById('lt-grid');
  const count=document.getElementById('lt-count');
  const more=document.getElementById('lt-more');
  if(!grid) return;
  if(p===1) grid.innerHTML=skGrid(20);
  try{
    let items=[], total=1;
    if(S.ltTab==='bo-lt'){
      const d=await get(KK_LT_URL(p)); items=kkI(d); total=kkP(d);
      if(!items.length){ const d2=await kkSearch('lồng tiếng phim bộ',p); items=kkI(d2); total=kkP(d2); }
    } else if(S.ltTab==='bo-tm'){
      const d=await get(KK_TM_URL(p)); items=kkI(d); total=kkP(d);
      if(!items.length){ const d2=await kkSearch('thuyết minh phim bộ',p); items=kkI(d2); total=kkP(d2); }
    } else if(S.ltTab==='le-lt'){
      const d=await get(KK_LT_LE(p)); items=kkI(d); total=kkP(d);
      if(!items.length){ const d2=await kkSearch('lồng tiếng phim lẻ',p); items=kkI(d2); total=kkP(d2); }
    } else if(S.ltTab==='search-lt'){
      const [r1,r2]=await Promise.all([
        kkSearch('lồng tiếng',p).catch(()=>null),
        kkSearch('thuyết minh',p).catch(()=>null),
      ]);
      const i1=kkI(r1); const i2=kkI(r2);
      const seen=new Set();
      items=[...i1,...i2].filter(m=>{ if(seen.has(m.slug))return false; seen.add(m.slug); return true; });
      total=Math.max(kkP(r1),kkP(r2));
    }
    const cards=items.map(CardKK).join('');
    if(p===1){ grid.innerHTML=cards||'<div style="text-align:center;padding:48px;color:var(--mu)">Không có dữ liệu.</div>'; }
    else{ grid.insertAdjacentHTML('beforeend',cards); }
    if(count) count.textContent=`${items.length} phim · Trang ${p}${total>1?'/'+total:''}`;
    if(more) more.innerHTML=p<Math.min(total,20)?`<button class="btn btn-ghost" onclick="loadLT(${p+1})">Tải thêm ↓</button>`:'';
  }catch(e){
    if(grid) grid.innerHTML=`<div style="text-align:center;padding:48px;color:var(--mu)">Lỗi: ${esc(e.message)}</div>`;
  }
};

// ═══════════════════════════════════════
//  CATEGORY PAGE
// ═══════════════════════════════════════
const CAT_LABEL = {
  'phim-moi':'🆕 Phim mới', 'phim-le':'🎬 Phim lẻ', 'phim-bo':'📺 Phim bộ',
  'hoat-hinh':'🎌 Hoạt hình', 'tv-shows':'📡 TV Shows',
  'anime':'🏆 Top Anime', 'anime-now':'📅 Anime đang chiếu',
  'yt':'🔴 Tìm kiếm DZITube',
};

async function pgCat(){
  if(S.cat==='anime' && window.missionProgress) missionProgress('explore');
  const app=document.getElementById('app');
  const isYT = S.cat==='yt';
  app.innerHTML = renderNav() + `<div class="cat-page page">
    <h1>${CAT_LABEL[S.cat]||S.cat}</h1>
    ${isYT?`<div class="big-search-wrap" style="margin-bottom:14px">
      <span>🔍</span>
      <input class="big-search" id="yt-q" type="text" placeholder="Tìm video DZITube..." autocomplete="off"
        oninput="ytLive(this.value)"
        onkeydown="if(event.key==='Enter'){clearTimeout(window._ytT);loadYT(this.value,1)}"/>
    </div>`:''}
    <div id="cat-count" class="result-count">Đang tải...</div>
    <div id="cat-grid" class="${isYT?'yt-grid':'grid'}">${isYT?skGrid(12).replace(/sk-p/g,'sk-yt'):skGrid(24)}</div>
    <div id="cat-more" style="text-align:center;margin-top:18px"></div>
  </div>`;
  setupNavScroll();
  if(isYT){
    const inp=document.getElementById('yt-q'); if(inp) inp.focus();
    await loadYT('',1); // load trending by default
  } else {
    await loadCat(1);
  }
}

let _ytQ='', _ytPage=1, _ytToken='';
window.loadYT = async function(q,p){
  const isNew = (q && q !== _ytQ) || p===1;
  if(isNew){ _ytToken=''; _ytPage=1; }
  _ytQ=q||_ytQ; _ytPage=p||1;
  const grid=document.getElementById('cat-grid'), count=document.getElementById('cat-count'), more=document.getElementById('cat-more');
  if(!grid) return;
  if(p===1) grid.innerHTML='<div class="yt-grid">'+Array(12).fill('<div class="sk sk-yt"></div>').join('')+'</div>';
  try{
    let vids;
    if(!_ytQ.trim()){
      vids = await ytTrending();
      if(count) count.textContent = vids.length ? '🔥 Trending YouTube Việt Nam' : ' ';
      if(more) more.innerHTML='';
    } else {
      const token = _ytPage>1 ? ytNextToken(_ytQ, _ytPage) : '';
      vids = await ytSearch(_ytQ, _ytPage, token);
      const nextToken = ytNextToken(_ytQ, _ytPage+1);
      if(count) count.textContent=vids.length?`Kết quả cho "${_ytQ}"`:' ';
      if(more) more.innerHTML=vids.length>=10&&nextToken?`<button class="btn btn-ghost" onclick="loadYT('${esc(_ytQ)}',${_ytPage+1})">Tải thêm ↓</button>`:'';
    }
    const cards=vids.map(CardYT).join('');
    if(p===1){ grid.innerHTML=cards||'<div style="text-align:center;padding:48px;color:var(--mu)">Không tìm thấy.</div>'; }
    else{ grid.insertAdjacentHTML('beforeend',cards); }
  }catch(e){ if(grid) grid.innerHTML=`<div style="text-align:center;padding:48px;color:var(--mu)">Lỗi DZITube: ${esc(e.message)}</div>`; }
};
window.ytLive=function(q){ clearTimeout(window._ytT); if(!q.trim()){ loadYT('',1); return; } window._ytT=setTimeout(()=>loadYT(q,1),500); };

window.loadCat = async function(p){
  p=p||1;
  const grid=document.getElementById('cat-grid'), count=document.getElementById('cat-count'), more=document.getElementById('cat-more');
  if(!grid) return;
  if(p===1) grid.innerHTML=skGrid(24);
  try{
    let items=[], total=1, cardFn=CardKK;
    if(S.cat==='phim-moi'){ const d=await kkNew(p); items=d&&d.items||[]; total=(d&&d.pagination&&d.pagination.totalPages)||1; }
    else if(['phim-le','phim-bo','hoat-hinh','tv-shows'].includes(S.cat)){ const d=await kkCat(S.cat,p); items=kkI(d); total=kkP(d); }
    else if(S.cat==='anime'){ const d=await jkTop(p); items=d&&d.data||[]; total=(d&&d.pagination&&d.pagination.last_visible_page)||1; cardFn=CardAnime; }
    else if(S.cat==='anime-now'){ const d=await jkSeason(); items=d&&d.data||[]; total=1; cardFn=CardAnime; }
    const cards=items.map(cardFn).join('');
    if(p===1){ grid.innerHTML=cards||'<div style="text-align:center;padding:48px;color:var(--mu)">Không có dữ liệu.</div>'; }
    else{ grid.insertAdjacentHTML('beforeend',cards); }
    if(count) count.textContent=`Trang ${p}${total>1?'/'+total:''}`;
    if(more) more.innerHTML=p<Math.min(total,20)?`<button class="btn btn-ghost" onclick="loadCat(${p+1})">Tải thêm ↓</button>`:'';
  }catch(e){ if(grid) grid.innerHTML=`<div style="text-align:center;padding:48px;color:var(--mu)">Lỗi: ${esc(e.message)}</div>`; }
};

// ═══════════════════════════════════════
//  DETAIL — KKPhim
// ═══════════════════════════════════════
async function pgDetKK(){
  const app=document.getElementById('app');
  app.innerHTML=renderNav()+`<div class="det page"><div class="loading" style="padding-top:40px"><div class="spin"></div></div></div>`;
  setupNavScroll();
  let data, movie, episodes=[];
  try{ data=await kkDetail(S.slug); movie=data&&data.movie||data; episodes=data&&data.episodes||[]; }
  catch(e){ app.innerHTML=renderNav()+`<div class="det page"><div class="empty-state" style="padding-top:80px"><div class="ico">😕</div><h3>Không tìm thấy phim</h3><p>${esc(e.message)}</p><button class="btn btn-red" onclick="go('home')" style="margin-top:13px">Về trang chủ</button></div></div>`; return; }

  const title=movie.name||'', ori=movie.origin_name||'', year=movie.year||'';
  const ep=movie.episode_current||'', tot=movie.episode_total||'';
  const lang=(movie.lang||'').toLowerCase();
  const isLT=lang.includes('lồng')||lang.includes('long')||lang.includes('thuyết');
  const bg=fixImg(movie.thumb_url)||fixImg(movie.poster_url)||'';
  const po=fixImg(movie.poster_url)||fixImg(movie.thumb_url)||PH(180,270);
  const gens=(movie.category||[]).map(g=>`<span class="gtag vn">${esc(g.name||g)}</span>`).join('');
  const countries=(movie.country||[]).map(c=>c.name||c).join(', ');
  const wl=inWL('kk_'+(movie._id||movie.slug));
  const wlData=JSON.stringify({uid:'kk_'+(movie._id||movie.slug),name:movie.name,thumb:fixImg(movie.thumb_url||movie.poster_url),year,src:'kk',slug:movie.slug||S.slug});

  let epHTML='';
  if(episodes.length>0){
    const svTabs=episodes.map((sv,i)=>`<button class="sv-tab${i===0?' on':''}" id="svt${i}" onclick="swSv(${i})">${esc(sv.server_name||'Server '+(i+1))}</button>`).join('');
    const firstEps=(episodes[0]&&episodes[0].server_data)||[];
    const epBtns=firstEps.map((e,i)=>`<button class="ep-btn${i===0?' on':''}" onclick="playEp(${i},0)">${esc(e.name||'Tập '+(i+1))}</button>`).join('');
    epHTML=`<div class="ep-box">
      <h2 class="ep-box-title">Danh sách tập</h2>
      <div class="sv-tabs" id="sv-tabs">${svTabs}</div>
      <div class="ep-list" id="ep-list">${epBtns}</div>
    </div>`;
  }

  let simH='';
  try{ const sim=await kkNew(2); simH=(sim&&sim.items||[]).slice(0,10).map(CardKK).join(''); }catch(e){}

  app.innerHTML=renderNav()+`<div class="det page">
    <div class="det-hero">
      <div class="det-bg" style="background-image:url('${esc(bg)}')"></div>
      <div class="det-fog"></div>
      <div class="det-body">
        <div class="det-poster"><img src="${po}" onerror="this.src='${PH(180,270)}'"/></div>
        <div class="det-info">
          <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:9px">
            
            ${isLT?`<span style="display:inline-flex;align-items:center;gap:4px;background:rgba(245,158,11,.15);color:var(--gold);font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px">🔊 Lồng tiếng</span>`:''}
          </div>
          <h1 class="det-title">${esc(title)}</h1>
          ${ori&&ori!==title?`<div class="det-ori">${esc(ori)}</div>`:''}
          <div class="det-chips">
            ${movie.quality?`<span class="det-chip" style="color:#22c55e">${esc(movie.quality)}</span>`:''}
            ${movie.lang?`<span class="det-chip">${esc(movie.lang)}</span>`:''}
            ${year?`<span class="det-chip">${year}</span>`:''}
            ${ep?`<span class="det-chip">Tập ${esc(ep)}${tot?'/'+esc(tot):''}</span>`:''}
            ${countries?`<span class="det-chip">🌍 ${esc(countries)}</span>`:''}
          </div>
          <div class="det-genres">${gens}</div>
          <p class="det-desc">${esc(movie.content||movie.description||'Chưa có mô tả.')}</p>
          <div class="det-acts">
            <button class="btn btn-red" onclick="go('play-kk',{slug:'${esc(movie.slug||S.slug)}'})">▶ Xem phim</button>
            <button class="fav-btn${wl?' on':''}" id="fav-btn" onclick='toggleWL(${JSON.stringify(wlData)})'>${wl?'❤️':'🤍'}</button>
            <button class="btn btn-ghost" onclick="go(history.state&&history.state.from||'home', history.state&&history.state.fromOpts||{})">← Quay lại</button>
          </div>
        </div>
      </div>
    </div>
    ${epHTML}
    ${simH?`<section class="sec"><div class="sec-head"><h2 class="sec-title">Phim liên quan</h2></div><div class="row">${simH}</div></section>`:''}
    ${renderFooter()}
  </div>`;
  setupNavScroll();

  window._eps=episodes;
  window.swSv=function(i){
    window._eps.forEach((_,j)=>{ const t=document.getElementById('svt'+j); if(t) t.className='sv-tab'+(j===i?' on':''); });
    const eps=(window._eps[i]&&window._eps[i].server_data)||[];
    const el=document.getElementById('ep-list');
    if(el) el.innerHTML=eps.map((e,k)=>`<button class="ep-btn${k===0?' on':''}" onclick="playEp(${k},${i})">${esc(e.name||'Tập '+(k+1))}</button>`).join('');
  };
  window.playEp=function(ei,si){ S.epIdx=ei; S.svIdx=si; go('play-kk',{slug:movie.slug||S.slug}); };
}

// ═══════════════════════════════════════
//  DETAIL — Anime
// ═══════════════════════════════════════
async function pgDetAni(){
  const app=document.getElementById('app');
  app.innerHTML=renderNav()+`<div class="det page"><div class="loading" style="padding-top:40px"><div class="spin"></div></div></div>`;
  setupNavScroll();
  let anime;
  try{ const d=await jkDetail(S.malId); anime=d&&d.data||d; }
  catch(e){ app.innerHTML=renderNav()+`<div class="det page"><div class="empty-state" style="padding-top:80px"><div class="ico">😕</div><h3>Không tìm thấy</h3><button class="btn btn-red" onclick="go('home')" style="margin-top:13px">Về trang chủ</button></div></div>`; return; }

  const title=anime.title||'', eng=anime.title_english||anime.title_japanese||'';
  const year=anime.year||'', rat=anime.score?anime.score.toFixed(1):'';
  const eps=anime.episodes||0;
  const imgs=anime.images||{};
  const po=(imgs.jpg&&imgs.jpg.large_image_url)||(imgs.webp&&imgs.webp.image_url)||PH(180,270);
  const gens=(anime.genres||[]).map(g=>`<span class="gtag ani">${esc(g.name)}</span>`).join('');
  const wl=inWL('ani_'+anime.mal_id);
  const wlData=JSON.stringify({uid:'ani_'+anime.mal_id,name:title,thumb:po,year,src:'ani',malId:anime.mal_id});

  const epCount=Math.max(eps||24,1);
  const epOpts=Array.from({length:Math.min(epCount,1000)},(_,i)=>`<option value="${i+1}">Tập ${i+1}</option>`).join('');
  const relH=(anime.recommendations||[]).slice(0,8).map(r=>r.entry?CardAnime(r.entry):null).filter(Boolean).join('');

  app.innerHTML=renderNav()+`<div class="det page">
    <div class="det-hero">
      <div class="det-bg" style="background-image:url('${esc(po)}');filter:blur(3px) brightness(.22)"></div>
      <div class="det-fog"></div>
      <div class="det-body">
        <div class="det-poster"><img src="${po}" onerror="this.src='${PH(180,270)}'"/></div>
        <div class="det-info">
          <span style="display:inline-flex;align-items:center;gap:4px;background:rgba(168,85,247,.15);color:var(--purple);font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:1px;margin-bottom:9px">🎌 Anime</span>
          <h1 class="det-title">${esc(title)}</h1>
          ${eng&&eng!==title?`<div class="det-ori">${esc(eng)}</div>`:''}
          <div class="det-chips">
            ${rat?`<span style="color:var(--gold);font-weight:700;font-size:13px">⭐${rat}</span>`:''}
            ${year?`<span class="det-chip">${year}</span>`:''}
            ${eps?`<span class="det-chip">${eps} tập</span>`:''}
            ${anime.status?`<span class="det-chip" style="color:#fb923c">${esc(anime.status)}</span>`:''}
          </div>
          <div class="det-genres">${gens}</div>
          <p class="det-desc">${esc(anime.synopsis||'Chưa có mô tả.')}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
            <select id="ani-ep" class="sel">${epOpts}</select>
            <select id="ani-dub" class="sel">
              <option value="0">Phụ đề (Sub)</option>
              <option value="1">Lồng tiếng (Dub)</option>
            </select>
            <button class="btn btn-red" onclick="watchAniEp()">▶ Xem tập này</button>
          </div>
          <div class="det-acts">
            <button class="btn btn-red" onclick="go('play-ani',{malId:${anime.mal_id}})">▶ Xem tập 1</button>
            <button class="fav-btn${wl?' on':''}" id="fav-btn" onclick='toggleWL(${JSON.stringify(wlData)})'>${wl?'❤️':'🤍'}</button>
            <button class="btn btn-ghost" onclick="go(history.state&&history.state.from||'home', history.state&&history.state.fromOpts||{})">← Quay lại</button>
          </div>
        </div>
      </div>
    </div>
    ${relH?`<section class="sec"><div class="sec-head"><h2 class="sec-title">Anime liên quan</h2></div><div class="row">${relH}</div></section>`:''}
    ${renderFooter()}
  </div>`;
  setupNavScroll();
  window.watchAniEp=function(){
    const e=document.getElementById('ani-ep'), d=document.getElementById('ani-dub');
    S.epNum=parseInt((e&&e.value)||1); S.dub=parseInt((d&&d.value)||0);
    go('play-ani',{malId:anime.mal_id});
  };
}

// ═══════════════════════════════════════
//  PLAYER — KKPhim
// ═══════════════════════════════════════
async function pgPlayKK(){
  const app=document.getElementById('app');
  app.innerHTML=renderNav()+`<div class="player-page page"><div class="loading" style="padding-top:40px"><div class="spin"></div></div></div>`;
  setupNavScroll();
  let data, movie, episodes=[];
  try{ data=await kkDetail(S.slug); movie=data&&data.movie||data; episodes=data&&data.episodes||[]; }
  catch(e){ go('home'); return; }

  addHist({uid:'kk_'+(movie._id||movie.slug),name:movie.name,thumb:fixImg(movie.thumb_url||movie.poster_url),year:movie.year,src:'kk',slug:movie.slug||S.slug});
  if(window.missionProgress) missionProgress('watch_phim'); if(window.missionProgress) missionProgress('watch_phim_bo');

  // Track watch position by elapsed time
  const _histUid = 'kk_'+(movie._id||movie.slug);
  const _prevPos = (S.hist.find(x=>x.uid===_histUid)||{}).positionSec||0;
  let _watchStart = Date.now(), _watchPos = _prevPos;
  window._watchTimer && clearInterval(window._watchTimer);
  window._watchTimer = setInterval(()=>{
    _watchPos = _prevPos + Math.round((Date.now()-_watchStart)/1000);
    if(window.updateHistPos) updateHistPos(_histUid, _watchPos);
  }, 5000);

  const title=movie.name||'', year=movie.year||'';
  const svIdx=Math.min(S.svIdx,Math.max(0,episodes.length-1));
  const server=episodes[svIdx]||null;
  const epList=(server&&server.server_data)||[];
  const epIdx=Math.min(S.epIdx,Math.max(0,epList.length-1));
  const curEp=epList[epIdx]||null;
  const embed=curEp&&curEp.link_embed||null;
  const m3u8=curEp&&curEp.link_m3u8||null;
  const wl=inWL('kk_'+(movie._id||movie.slug));
  const wlData=JSON.stringify({uid:'kk_'+(movie._id||movie.slug),name:movie.name,thumb:fixImg(movie.thumb_url||movie.poster_url),year,src:'kk',slug:movie.slug||S.slug});

  const epSW=epList.length>1?`<div style="margin-top:10px"><div style="font-size:12px;font-weight:600;margin-bottom:6px;color:var(--mu)">📋 Chọn tập:</div><div class="ep-sw">${epList.map((e,i)=>`<button class="ep-btn${i===epIdx?' on':''}" onclick="S.epIdx=${i};S.svIdx=${svIdx};go('play-kk',{slug:'${esc(movie.slug||S.slug)}'})">${esc(e.name||'Tập '+(i+1))}</button>`).join('')}</div></div>`:'';
  const svSW=episodes.length>1?`<div style="margin-top:8px"><div style="font-size:12px;font-weight:600;margin-bottom:6px;color:var(--mu)">🔄 Server:</div><div style="display:flex;gap:6px;flex-wrap:wrap">${episodes.map((sv,i)=>`<button class="ep-btn${i===svIdx?' on':''}" onclick="S.svIdx=${i};S.epIdx=0;go('play-kk',{slug:'${esc(movie.slug||S.slug)}'})">${esc(sv.server_name||'Server '+(i+1))}</button>`).join('')}</div></div>`:'';

  let playerHTML;
  if(embed){
    const embedUrl = (()=>{ try{ const u=new URL(embed); u.searchParams.set('autoplay','1'); return u.toString(); }catch(e){ return embed; }})();
    playerHTML=`<iframe src="${esc(embedUrl)}" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen></iframe>`;

  } else if(m3u8){
    playerHTML=`<video id="hls-v" controls autoplay style="position:absolute;inset:0;width:100%;height:100%"></video>`;
  } else {
    playerHTML=`<div class="no-video"><div style="font-size:48px;opacity:.4">🎬</div><h3>Chưa có nguồn phim</h3><p style="font-size:12.5px;color:var(--mu)">Thử server hoặc tập khác.</p></div>`;
  }

  let simH='';
  try{ const sim=await kkNew(2); simH=(sim&&sim.items||[]).slice(0,8).map(CardKK).join(''); }catch(e){}

  app.innerHTML=renderNav()+`<div class="player-page page">
    <div class="player-wrap" style="position:relative">
      <button onclick="go(history.state&&history.state.from||'home', history.state&&history.state.fromOpts||{})" style="position:absolute;top:10px;left:10px;z-index:20;width:36px;height:36px;border-radius:50%;background:transparent;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.8))"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      ${playerHTML}
    </div>
    <div class="player-info">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div style="flex:1">
          <div class="player-title">${esc(title)}${curEp&&curEp.name?` <span style="color:var(--green);font-size:17px">— ${esc(curEp.name)}</span>`:''}</div>
          <div class="player-meta">${year}${server?' · '+esc(server.server_name):''}${embed||m3u8?' · 🟢 Đang phát':' · ⚠️ Không có nguồn'}</div>
          ${epSW}${svSW}
        </div>
        <div style="display:flex;gap:7px;align-items:center;flex-shrink:0">
          <button class="fav-btn${wl?' on':''}" id="fav-btn" onclick='toggleWL(${JSON.stringify(wlData)})'>${wl?'❤️':'🤍'}</button>
          <button class="btn btn-ghost" onclick="go('det-kk',{slug:'${esc(movie.slug||S.slug)}'})">ℹ Chi tiết</button>
        </div>
      </div>
    </div>
    ${simH?`<section class="sec"><h2 class="sec-title" style="margin-bottom:13px">Phim liên quan</h2><div class="row">${simH}</div></section>`:''}
    ${renderFooter()}
  </div>`;
  setupNavScroll();

  if(!embed && m3u8){
    const sc=document.createElement('script');
    sc.src='https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.10/hls.min.js';
    sc.onload=function(){
      const v=document.getElementById('hls-v'); if(!v) return;
      if(window.Hls&&Hls.isSupported()){ const h=new Hls(); h.loadSource(m3u8); h.attachMedia(v); }
      else if(v.canPlayType('application/vnd.apple.mpegurl')){ v.src=m3u8; }
    };
    document.head.appendChild(sc);
  }
}

// ═══════════════════════════════════════
//  PLAYER — Anime / VidSrc
// ═══════════════════════════════════════
async function pgPlayAni(){
  const app=document.getElementById('app');
  const id=S.malId, epn=S.epNum||1, dub=S.dub||0;
  app.innerHTML=renderNav()+`<div class="player-page page"><div class="loading" style="padding-top:40px"><div class="spin"></div></div></div>`;
  setupNavScroll();
  try{
    const d=await jkDetail(id); const anime=d&&d.data||d;
    const title=anime.title||'', year=anime.year||'';
    const totalEps=anime.episodes||100;
    const imgs=anime.images||{};
    const po=(imgs.jpg&&imgs.jpg.large_image_url)||(imgs.webp&&imgs.webp.image_url)||'';
    addHist({uid:'ani_'+id,name:title,thumb:po,year,src:'ani',malId:id});
    if(window.missionProgress) missionProgress('watch_anime');
    // Track watch position by elapsed time
    const _ahUid='ani_'+id, _apPos=(S.hist.find(x=>x.uid===_ahUid)||{}).positionSec||0;
    let _awStart=Date.now(), _awPos=_apPos;
    window._watchTimer&&clearInterval(window._watchTimer);
    window._watchTimer=setInterval(()=>{ _awPos=_apPos+Math.round((Date.now()-_awStart)/1000); if(window.updateHistPos)updateHistPos(_ahUid,_awPos); },5000);
    const wl=inWL('ani_'+id);
    const wlData=JSON.stringify({uid:'ani_'+id,name:title,thumb:po,year,src:'ani',malId:id});
    const eMax=Math.min(totalEps||200,1000);
    const eOpts=Array.from({length:eMax},(_,i)=>`<option value="${i+1}"${i+1===epn?' selected':''}>Tập ${i+1}</option>`).join('');
    const dOpts=`<option value="0"${dub===0?' selected':''}>Sub</option><option value="1"${dub===1?' selected':''}>Dub</option>`;

    const aniEmbedSrcRaw = vsAnime(id,epn,dub);
    const aniEmbedSrc = (()=>{ try{ const u=new URL(aniEmbedSrcRaw); u.searchParams.set('autoplay','1'); return u.toString(); }catch(e){ return aniEmbedSrcRaw; }})();

    app.innerHTML=renderNav()+`<div class="player-page page">
      <div class="player-wrap" style="position:relative">
        <button onclick="go(history.state&&history.state.from||'home', history.state&&history.state.fromOpts||{})" style="position:absolute;top:10px;left:10px;z-index:20;width:36px;height:36px;border-radius:50%;background:transparent;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.8))"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <iframe id="ani-fr" src="${esc(aniEmbedSrc)}" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="player-info">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px">
          <div style="flex:1">
            <div class="player-title">${esc(title)} <span style="color:var(--purple);font-size:17px">Tập ${epn} · ${dub?'Dub':'Sub'}</span></div>
            <div class="player-meta">${year} · 🟢 VidSrc.icu · <span style="color:var(--purple);font-weight:600">🎌 Anime</span></div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
              <select id="a-ep" class="sel" onchange="swAniEp()">${eOpts}</select>
              <select id="a-dub" class="sel" onchange="swAniEp()">${dOpts}</select>
            </div>
          </div>
          <div style="display:flex;gap:7px;align-items:center;flex-shrink:0">
            <button class="fav-btn${wl?' on':''}" id="fav-btn" onclick='toggleWL(${JSON.stringify(wlData)})'>${wl?'❤️':'🤍'}</button>
            <button class="btn btn-ghost" onclick="go('det-ani',{malId:${id}})">ℹ Chi tiết</button>
          </div>
        </div>
      </div>
      ${renderFooter()}
    </div>`;
    setupNavScroll();
    window.swAniEp=function(){
      const e=document.getElementById('a-ep'), db=document.getElementById('a-dub');
      const ne=parseInt((e&&e.value)||1), nd=parseInt((db&&db.value)||0);
      const fr=document.getElementById('ani-fr');
      if(fr){
        // FIX: thêm autoplay=1 khi đổi tập
        try{ const u=new URL(vsAnime(id,ne,nd)); u.searchParams.set('autoplay','1'); fr.src=u.toString(); }
        catch(err){ fr.src=vsAnime(id,ne,nd); }
      }
    };
  }catch(e){
    app.innerHTML=renderNav()+`<div class="player-page page"><div class="no-video" style="height:50vh"><div style="font-size:48px;opacity:.4">🎌</div><h3>Không tải được</h3><p style="color:var(--mu);font-size:13px">${esc(e.message)}</p></div>${renderFooter()}</div>`;
    setupNavScroll();
  }
}

// ═══════════════════════════════════════
//  DZITUBE LANDING PAGE
// ═══════════════════════════════════════
async function pgDZITube(){
  const app=document.getElementById('app');
  app.innerHTML=renderNav()+`<div class="cat-page page">
    <h1 style="color:var(--yt)">🔴 DZITube</h1>
    <div class="sec-head"><h2 class="sec-title">🔥 Trending DZITube</h2></div>
    <div id="dzt-grid" class="yt-grid">${skGrid(12).replace(/sk-p/g,'sk-yt')}</div>
  </div>`;
  setupNavScroll();
  // Load trending
  try{
    const items=await ytTrending();
    const grid=document.getElementById('dzt-grid');
    if(!grid) return;
    if(!items||!items.length){ grid.innerHTML='<div style="color:var(--mu);padding:20px">Không load được trending.</div>'; return; }
    grid.innerHTML=items.map(v=>{
      const thumb=(v.videoThumbnails||[]).find(t=>t.quality==='medium')||v.videoThumbnails?.[0]||{};
      return `<div class="yt-card" onclick="go('play-yt',{ytId:'${esc(v.videoId)}'})">
        <div class="yt-thumb"><img src="${esc(thumb.url||'')}" loading="lazy" onerror="this.src='https://i.ytimg.com/vi/${esc(v.videoId)}/hqdefault.jpg'"></div>
        <div class="yt-info">
          <div class="yt-title">${esc(v.title||'')}</div>
          <div class="yt-meta"><span class="tag yt">DZITube</span>${esc(v.author||'')}</div>
        </div>
      </div>`;
    }).join('');
  }catch(e){
    const grid=document.getElementById('dzt-grid');
    if(grid) grid.innerHTML='<div style="color:var(--mu);padding:20px">Lỗi load trending.</div>';
  }
}

// ═══════════════════════════════════════
//  DZITUBE SHORT — TikTok-style shorts
// ═══════════════════════════════════════
// ═══════════════════════════════════════
//  DZITUBE SHORT — TikTok style, YT IFrame API
// ═══════════════════════════════════════
let _shortVideos=[], _shortIdx=0, _shortPage=null, _shortLoading=false;
let _shortYTPlayer=null, _shortYTAPIReady=false, _shortCurrentVid=null;

async function pgDZITubeShort(){
  const app=document.getElementById('app');
  _shortVideos=[]; _shortIdx=0; _shortPage=null; _shortLoading=false;
  _shortYTPlayer=null; _shortCurrentVid=null;

  app.innerHTML=`
  <div id="short-page" style="position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:50;overflow:hidden">

    <!-- Header -->
    <div style="position:absolute;top:0;left:0;right:0;z-index:60;padding:14px 16px;background:linear-gradient(to bottom,rgba(0,0,0,.75) 0%,transparent 100%);display:flex;align-items:center;gap:10px;pointer-events:none">
      <button onclick="go('dzitube')" style="background:none;border:none;color:#fff;cursor:pointer;padding:4px;pointer-events:all">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div style="color:#fff;font-weight:700;font-size:17px;letter-spacing:.5px;pointer-events:none">DZITube Short</div>
      <div style="flex:1"></div>
      <button onclick="shortOpenSearch()" style="background:none;border:none;color:#fff;cursor:pointer;padding:4px;pointer-events:all">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
    </div>

    <!-- Search bar (hidden by default) -->
    <div id="short-searchbar" style="position:absolute;top:0;left:0;right:0;z-index:65;background:rgba(0,0,0,.9);padding:12px 16px;display:none;align-items:center;gap:8px">
      <button onclick="shortCloseSearch()" style="background:none;border:none;color:#fff;cursor:pointer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <input id="short-q" type="text" placeholder="Tìm DZITube Short..." autocomplete="off"
        style="flex:1;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);border-radius:20px;padding:8px 16px;color:#fff;font-size:14px;outline:none"
        onkeydown="if(event.key==='Enter'){shortSearch();shortCloseSearch()}"/>
      <button onclick="shortSearch();shortCloseSearch()" style="background:#ff0050;border:none;border-radius:20px;padding:8px 16px;color:#fff;font-size:13px;font-weight:600;cursor:pointer">Tìm</button>
    </div>

    <!-- YT IFrame container (fullscreen, behind everything) -->
    <div id="short-yt-wrap" style="position:absolute;inset:0;z-index:1">
      <div id="short-yt-player"></div>
    </div>

    <!-- Tap overlay: tap center to pause/play -->
    <div id="short-tap-overlay" style="position:absolute;inset:0;z-index:10" onclick="shortTapToggle()"></div>

    <!-- Pause/Play flash icon -->
    <div id="short-flash-icon" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:20;pointer-events:none;opacity:0;transition:opacity .25s">
      <div style="width:72px;height:72px;border-radius:50%;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center">
        <svg id="short-flash-svg" width="36" height="36" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
      </div>
    </div>

    <!-- Bottom info -->
    <div id="short-info" style="position:absolute;bottom:0;left:0;right:80px;z-index:15;padding:20px 16px 36px;background:linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 100%);pointer-events:none">
      <div id="short-title" style="color:#fff;font-weight:700;font-size:15px;line-height:1.35;text-shadow:0 1px 4px rgba(0,0,0,.8);margin-bottom:6px"></div>
      <div id="short-author" style="color:rgba(255,255,255,.75);font-size:13px;display:flex;align-items:center;gap:6px">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="5" fill="transparent"/>
          <path d="M21.8 7.2s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 4 12 4 12 4s-4.2 0-7 .3c-.4.1-1.3.1-2 .9-.6.6-.8 2-.8 2S2 8.8 2 10.4v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.8C6.6 18 12 18 12 18s4.2 0 7-.3c.4-.1 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 8.8 21.8 7.2 21.8 7.2z" fill="#ff0000"/>
          <path d="M10 14.5v-5l5.5 2.5-5.5 2.5z" fill="white"/>
        </svg>
        <span id="short-author-text"></span>
      </div>
    </div>

    <!-- Side actions (TikTok style) -->
    <div style="position:absolute;bottom:40px;right:10px;z-index:15;display:flex;flex-direction:column;align-items:center;gap:22px">
      <!-- Like (decorative) -->
      <div style="text-align:center">
        <div style="width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer" onclick="shortLike(this)">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <div style="color:#fff;font-size:12px;margin-top:2px;text-shadow:0 1px 3px rgba(0,0,0,.8)">Thích</div>
      </div>
      <!-- Open full player -->
      <div style="text-align:center">
        <div id="short-open-btn" style="width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;pointer-events:all" onclick="shortOpenFull()">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        </div>
        <div style="color:#fff;font-size:12px;margin-top:2px;text-shadow:0 1px 3px rgba(0,0,0,.8)">Mở rộng</div>
      </div>
      <!-- Next video -->
      <div style="text-align:center">
        <div style="width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer" onclick="shortNext()">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div style="color:#fff;font-size:12px;margin-top:2px;text-shadow:0 1px 3px rgba(0,0,0,.8)">Tiếp</div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div id="short-loading-overlay" style="position:absolute;inset:0;z-index:70;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
      <div style="width:44px;height:44px;border-radius:50%;border:3px solid rgba(255,255,255,.15);border-top-color:#ff0050;animation:spin .8s linear infinite"></div>
      <div style="color:rgba(255,255,255,.7);font-size:14px">Đang tải...</div>
    </div>

    <style>
      @keyframes spin{to{transform:rotate(360deg)}}
      #short-yt-player { width: 100vw !important; height: 100vh !important; }
      #short-yt-player iframe { width: 100vw !important; height: 100vh !important; position: fixed; top: 0; left: 0; pointer-events: none; z-index: 1; }
      #short-yt-wrap > div:not(#short-yt-player) { display: none !important; }
    </style>
  </div>`;

  // Load videos first
  await shortLoad('');
  // Init YT API
  shortInitYT();
  // Swipe setup
  shortSetupSwipe();
}

// ── Search helpers ─────────────────────
window.shortOpenSearch=function(){
  const sb=document.getElementById('short-searchbar');
  if(sb){sb.style.display='flex';const q=document.getElementById('short-q');if(q)q.focus();}
};
window.shortCloseSearch=function(){
  const sb=document.getElementById('short-searchbar');
  if(sb) sb.style.display='none';
};
window.shortSearch=function(){
  const q=(document.getElementById('short-q')||{}).value||'';
  _shortVideos=[]; _shortIdx=0; _shortPage=null;
  shortLoad(q).then(()=>shortPlayIdx(0));
};

// ── Load videos ────────────────────────
async function shortLoad(q){
  if(_shortLoading) return;
  _shortLoading=true;
  try{
    const qs=new URLSearchParams({_p:'/yt/shorts'});
    if(q) qs.set('q',q);
    if(_shortPage) qs.set('pageToken',_shortPage);
    const d=await (await fetch((window.API_BASE||'')+'/api/music?'+qs)).json();
    const items=d.items||[];
    _shortPage=d.nextPageToken||null;
    _shortVideos=[..._shortVideos,...items];
  }catch(e){}
  _shortLoading=false;
}

// ── Init YT IFrame API ─────────────────
function shortInitYT(){
  function createPlayer(){
    if(!window.YT||!window.YT.Player){setTimeout(createPlayer,200);return;}
    const el=document.getElementById('short-yt-player');
    if(!el) return;
    _shortYTPlayer=new YT.Player('short-yt-player',{
      width:'100%',
      height:'100%',
      playerVars:{
        autoplay:1,
        playsinline:1,
        controls:0,
        rel:0,
        modestbranding:1,
        iv_load_policy:3,
        fs:0,
        disablekb:1,
        loop:1,
      },
      events:{
        onReady:function(e){
          _shortYTAPIReady=true;
          shortPlayIdx(0);
        },
        onStateChange:function(e){
          // Auto-next khi video kết thúc
          if(e.data===YT.PlayerState.ENDED){
            if(_shortIdx<_shortVideos.length-1) shortNext();
          }
        }
      }
    });
    // Make iframe fill screen
    const iframe=el.querySelector('iframe');
    if(iframe){
      iframe.style.cssText='width:100vw!important;height:100vh!important;position:fixed;top:0;left:0;pointer-events:none;z-index:1';
    }
    // Hide any extra iframes (old player)
    document.querySelectorAll('#short-yt-wrap iframe').forEach((f,i)=>{ if(i>0) f.style.display='none'; });
  }

  if(!window.YT){
    const prev=window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady=function(){
      if(prev) prev();
      _shortYTAPIReady=true;
      createPlayer();
    };
    if(!document.getElementById('yt-api-script')){
      const s=document.createElement('script');
      s.id='yt-api-script';
      s.src='https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
  } else {
    createPlayer();
  }
}

// ── Play by index ──────────────────────
window.shortPlayIdx=function(idx){
  if(!_shortVideos.length) return;
  idx=Math.max(0,Math.min(idx,_shortVideos.length-1));
  _shortIdx=idx;
  const v=_shortVideos[idx];
  if(!v) return;
  if(window.missionProgress) missionProgress('watch_short');
  _shortCurrentVid=v.videoId;

  // Update info UI
  const titleEl=document.getElementById('short-title');
  const authorEl=document.getElementById('short-author-text');
  if(titleEl) titleEl.textContent=v.title||'';
  if(authorEl) authorEl.textContent=v.author||'';

  // Update dots
  // shortUpdateDots removed

  // Hide loading overlay once we start playing
  const overlay=document.getElementById('short-loading-overlay');
  if(overlay) overlay.style.display='none';

  // Play via YT Player
  if(_shortYTPlayer&&_shortYTPlayer.loadVideoById){
    _shortYTPlayer.loadVideoById({videoId:v.videoId,startSeconds:0});
  }

  // Preload more if near end
  if(idx>=_shortVideos.length-4) shortLoad('');
};

// ── Navigation ─────────────────────────
window.shortNext=function(){
  if(_shortIdx<_shortVideos.length-1) shortPlayIdx(_shortIdx+1);
};
window.shortPrev=function(){
  if(_shortIdx>0) shortPlayIdx(_shortIdx-1);
};
window.shortOpenFull=function(){
  if(_shortCurrentVid) go('play-yt',{ytId:_shortCurrentVid});
};
window.shortLike=function(btn){
  const svg=btn.querySelector('svg');
  if(!svg) return;
  const liked=svg.getAttribute('fill')==='#ff0050';
  svg.setAttribute('fill',liked?'none':'#ff0050');
  svg.setAttribute('stroke',liked?'#fff':'#ff0050');
};

// ── Tap to pause/play ──────────────────
let _shortPaused=false;
window.shortTapToggle=function(){
  if(!_shortYTPlayer) return;
  try{
    const state=_shortYTPlayer.getPlayerState();
    const icon=document.getElementById('short-flash-icon');
    const flashSvg=document.getElementById('short-flash-svg');
    if(state===1){
      _shortYTPlayer.pauseVideo(); _shortPaused=true;
      if(flashSvg) flashSvg.innerHTML='<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
    } else {
      _shortYTPlayer.playVideo(); _shortPaused=false;
      if(flashSvg) flashSvg.innerHTML='<path d="M8 5v14l11-7z"/>';
    }
    if(icon){
      icon.style.opacity='1';
      setTimeout(()=>{if(icon)icon.style.opacity='0';},600);
    }
  }catch(e){}
};

// ── Dots indicator ─────────────────────
// ── Swipe gesture ──────────────────────
function shortSetupSwipe(){
  const page=document.getElementById('short-page');
  if(!page) return;
  let startY=0,startX=0,moved=false;
  page.addEventListener('touchstart',e=>{
    startY=e.touches[0].clientY;
    startX=e.touches[0].clientX;
    moved=false;
  },{passive:true});
  page.addEventListener('touchmove',e=>{
    const dy=Math.abs(e.touches[0].clientY-startY);
    const dx=Math.abs(e.touches[0].clientX-startX);
    if(dy>10||dx>10) moved=true;
  },{passive:true});
  page.addEventListener('touchend',e=>{
    if(!moved) return;
    const diffY=e.changedTouches[0].clientY-startY;
    if(diffY<-60) shortNext();
    else if(diffY>60) shortPrev();
  },{passive:true});
  // Mouse wheel
  let wt=0;
  page.addEventListener('wheel',e=>{
    const now=Date.now();
    if(now-wt<600) return; wt=now;
    if(e.deltaY>30) shortNext();
    else if(e.deltaY<-30) shortPrev();
  },{passive:true});
}


// ═══════════════════════════════════════
//  PLAYER — YouTube (dùng YT IFrame API để custom controls)
// ═══════════════════════════════════════
async function pgPlayYT(){
  const app=document.getElementById('app');
  const id=S.ytId||'';
  if(!id){ go('home'); return; }
  const thumb=`https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  let videoTitle='DZITube Video', videoAuthor='', videoViews='';
  try{
    const det=await ytDetail(id);
    if(det&&det.title){ videoTitle=det.title; videoAuthor=det.author||''; videoViews=det.viewCount?fmtNum(parseInt(det.viewCount))+' lượt xem':''; }
  }catch(e){}

  addHist({uid:'yt_'+id,name:videoTitle||('DZITube: '+id),thumb:thumb,year:'',src:'yt',ytId:id});
  if(window.missionProgress) missionProgress('watch_yt');
  const _yhUid='yt_'+id, _ypPos=(S.hist.find(x=>x.uid===_yhUid)||{}).positionSec||0;
  let _ywStart=Date.now(), _ywPos=_ypPos;
  window._watchTimer&&clearInterval(window._watchTimer);
  window._watchTimer=setInterval(()=>{ _ywPos=_ypPos+Math.round((Date.now()-_ywStart)/1000); if(window.updateHistPos)updateHistPos(_yhUid,_ywPos); },5000);

  app.innerHTML=renderNav()+`<div class="player-page page">
    <div class="yt-player-outer">
      <button onclick="go(history.state&&history.state.from||'home', history.state&&history.state.fromOpts||{})" class="yt-back-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.8))"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <!-- YT IFrame API target -->
      <div id="yt-api-player"></div>
      <!-- Transparent tap overlay to show/hide controls (z-index > iframe to catch iOS touch) -->
      <div id="yt-tap-overlay" style="position:absolute;inset:0;z-index:14;cursor:pointer;pointer-events:auto" onclick="ytTapOverlayClick(event)"></div>
      <!-- Custom controls -->
      <div class="yt-ctrl" id="yt-ctrl">
        <div class="yt-prog-wrap">
          <span class="yt-time" id="yt-cur">0:00</span>
          <div class="yt-prog" id="yt-prog" onclick="ytSeek(event)">
            <div class="yt-prog-fill" id="yt-prog-fill"></div>
            <div class="yt-prog-thumb" id="yt-prog-thumb"></div>
          </div>
          <span class="yt-time" id="yt-dur">0:00</span>
        </div>
        <div class="yt-btns">
          <button class="yt-btn" onclick="ytSkip(-10)" title="-10s">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/><text x="12" y="14" text-anchor="middle" font-size="6" fill="currentColor">10</text></svg>
          </button>
          <button class="yt-btn yt-play-btn" id="yt-play-btn" onclick="ytToggle()">
            <svg id="yt-play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button class="yt-btn" onclick="ytSkip(10)" title="+10s">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/><text x="12" y="14" text-anchor="middle" font-size="6" fill="currentColor">10</text></svg>
          </button>
          <div class="yt-vol-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            <input type="range" class="yt-vol-sl" id="yt-vol" min="0" max="100" value="100" oninput="ytVol(this.value)">
          </div>
          <button class="yt-btn yt-fs-btn" onclick="ytFullscreen()" title="Fullscreen">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          </button>
        </div>
      </div>
    </div>
    <div class="player-info">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px">
        <div style="flex:1;min-width:0">
          <div class="player-title">🔴 ${esc(videoTitle)}</div>
          <div class="player-meta">${esc(videoAuthor)}${videoViews?' · '+esc(videoViews):''} · <span style="color:var(--yt);font-weight:600">DZITube</span></div>
        </div>
        <div style="display:flex;gap:7px;align-items:center;flex-shrink:0">
          <button class="fav-btn${inWL('yt_'+id)?' on':''}" id="fav-btn" onclick='toggleWL(${JSON.stringify({uid:"yt_"+id,name:videoTitle,thumb:thumb,year:"",src:"yt",ytId:id})})'>${inWL('yt_'+id)?'❤️':'🤍'}</button>
          <button class="btn btn-ghost" onclick="go('cat',{cat:'yt'})">🔍 Tìm video khác</button>
        </div>
      </div>
    </div>
    ${renderFooter()}
  </div>`;
  setupNavScroll();
  initYTPlayer(id);
}

// ═══════════════════════════════════════
//  SEARCH PAGE
// ═══════════════════════════════════════
let _srchT;
async function pgSearch(){
  if(window.missionProgress) missionProgress('search');
  const app=document.getElementById('app');
  const q=S.q, src=S.src||'all';
  app.innerHTML=renderNav()+`<div class="search-page page">
    <h1>Tìm kiếm</h1>
    <div class="big-search-wrap">
      <span>🔍</span>
      <input class="big-search" id="srch-q" type="text" placeholder="Tìm phim, anime, YouTube..." value="${esc(q)}" autocomplete="off"
        oninput="liveSearch(this.value)"
        onkeydown="if(event.key==='Enter'){clearTimeout(_srchT);runSearch(this.value,1)}"/>
    </div>
    <div class="filter-tabs">
      <button class="f-tab${src==='all'?' on-all':''}" id="f-all" onclick="setSrc('all')">🔍 Tất cả</button>
      <button class="f-tab${src==='vn'?' on-vn':''}" id="f-vn" onclick="setSrc('vn')">🇻🇳 Phim Việt</button>
      <button class="f-tab${src==='lt'?' on-lt':''}" id="f-lt" onclick="setSrc('lt')">🔊 Lồng tiếng</button>
      <button class="f-tab${src==='ani'?' on-ani':''}" id="f-ani" onclick="setSrc('ani')">🎌 Anime</button>
      <button class="f-tab${src==='yt'?' on-yt':''}" id="f-yt" onclick="setSrc('yt')">🔴 DZITube</button>
    </div>
    <div id="s-count" class="result-count">${q?'Đang tìm...':''}</div>
    <div id="s-grid" class="${src==='yt'?'yt-grid':'grid'}">${q?skGrid(12):''}</div>
    <div id="s-more" style="text-align:center;margin-top:18px"></div>
  </div>`;
  setupNavScroll();
  const inp=document.getElementById('srch-q'); if(inp) inp.focus();
  if(q) await runSearch(q,1);
}

window.setSrc=function(s){ S.src=s; go('search',{q:S.q,src:s}); };
window.liveSearch=function(q){ S.q=q; clearTimeout(_srchT); const g=document.getElementById('s-grid'); if(!q.trim()){if(g)g.innerHTML='';return;} _srchT=setTimeout(()=>runSearch(q,1),480); };

window.runSearch=async function(q,p){
  p=p||1; S.q=q;
  const grid=document.getElementById('s-grid'), count=document.getElementById('s-count'), more=document.getElementById('s-more');
  if(!grid) return;
  const src=S.src||'all';
  if(p===1){ grid.className=src==='yt'?'yt-grid':'grid'; grid.innerHTML=src==='yt'?skGrid(12):skGrid(12); }
  if(count) count.textContent='Đang tìm...';
  try{
    if(src==='yt'){
      grid.className='yt-grid';
      const vids=await ytSearch(q,p);
      if(p===1){ grid.innerHTML=vids.map(CardYT).join('')||`<div style="text-align:center;padding:48px;color:var(--mu)">Không tìm thấy.</div>`; }
      else{ grid.insertAdjacentHTML('beforeend',vids.map(CardYT).join('')); }
      if(count) count.textContent=vids.length?`${vids.length} video DZITube cho "${q}"`:' ';
      if(more) more.innerHTML=vids.length>=5?`<button class="btn btn-ghost" onclick="runSearch('${esc(q)}',${p+1})">Tải thêm ↓</button>`:'';
      return;
    }
    grid.className='grid';
    const doVN=src==='all'||src==='vn';
    const doLT=src==='lt';
    const doAni=src==='all'||src==='ani';
    const doYT=src==='all';

    const [kkR,kkLR,jkR,ytR]=await Promise.all([
      doVN?kkSearch(q,p).catch(()=>null):null,
      doLT?kkSearch(q+' lồng tiếng',1).catch(()=>null):null,
      doAni?jkSearch(q,p).catch(()=>null):null,
      doYT?ytSearch(q,1).catch(()=>[]):null,
    ]);

    const kkItems2=kkR?kkI(kkR):[];
    const kkLItems=kkLR?kkI(kkLR).filter(m=>!kkItems2.some(x=>x.slug===m.slug)):[];
    const jkItems2=jkR?(jkR.data||[]):[];
    const ytItems=(ytR||[]).slice(0,4);

    let cards=[];
    const ml=Math.max(kkItems2.length,kkLItems.length,jkItems2.length);
    for(let i=0;i<ml;i++){
      if(i<kkItems2.length) cards.push(CardKK(kkItems2[i]));
      if(i<kkLItems.length) cards.push(CardKK(kkLItems[i]));
      if(i<jkItems2.length) cards.push(CardAnime(jkItems2[i]));
    }
    ytItems.forEach(v=>{
      const vid=v.videoId||''; const t=esc(v.title||''); const thumb=ytThumb(v);
      cards.push(`<div class="card" onclick="go('play-yt',{ytId:'${vid}'})">
        <div class="c-poster"><img src="${esc(thumb)}" alt="${t}" loading="lazy" onerror="this.src='${PH()}'">
        <span class="c-badge cb-yt">🔴 YT</span>
        <div class="c-ov"><div class="c-play">▶</div></div></div>
        <div class="c-info"><div class="c-title">${t}</div><div class="c-sub">${esc(v.author||'')}</div></div>
      </div>`);
    });

    const total=kkItems2.length+kkLItems.length+jkItems2.length+ytItems.length;
    if(p===1){ grid.innerHTML=cards.join('')||`<div style="text-align:center;padding:48px;color:var(--mu)">Không tìm thấy "<strong>${esc(q)}</strong>"</div>`; }
    else{ grid.insertAdjacentHTML('beforeend',cards.join('')); }
    if(count) count.textContent=total?`${total} kết quả cho "${q}"`:' ';
    if(more) more.innerHTML=total>=20?`<button class="btn btn-ghost" onclick="runSearch('${esc(q)}',${p+1})">Tải thêm ↓</button>`:'';
  }catch(e){
    if(grid) grid.innerHTML=`<div style="text-align:center;padding:48px;color:var(--mu)">Lỗi: ${esc(e.message)}</div>`;
  }
};

// ═══════════════════════════════════════
//  WATCHLIST PAGE
// ═══════════════════════════════════════
function pgWatchlist(){
  if(window.missionProgress) missionProgress('check_hist');
  const app=document.getElementById('app');
  const PER_PAGE = 20;

  function srcTag(m){
    if(m.src==='ani') return '<span class="tag ani">🎌</span>';
    if(m.src==='yt')  return '<span class="tag yt">🔴</span>';
    return '<span class="tag vn">🇻🇳</span>';
  }
  function fmtSec(s){ if(!s||isNaN(s))return''; const m=Math.floor(s/60),sec=Math.floor(s%60); return`${m}:${sec.toString().padStart(2,'0')}`; }

  // ── Yêu thích card (no STT, no progress)
  function wCard(m, idx){
    const t=esc(m.name||'?'), po=m.thumb||PH(), y=m.year||'';
    let oc,pc;
    if(m.src==='ani'){oc=`go('det-ani',{malId:${m.malId}})`;pc=`go('play-ani',{malId:${m.malId}})`;}
    else if(m.src==='yt'){oc=`go('play-yt',{ytId:'${esc(m.ytId||m.uid.replace('yt_',''))}'})`; pc=oc;}
    else{oc=`go('det-kk',{slug:'${esc(m.slug)}'})`;pc=`go('play-kk',{slug:'${esc(m.slug)}'})` ;}
    return `<div class="card" onclick="${oc}">
      <div class="c-poster"><img src="${po}" loading="lazy" onerror="this.src='${PH()}'">
      <div class="c-ov"><div class="c-play" onclick="event.stopPropagation();${pc}">▶</div></div>
      <div class="c-stt">${idx+1}</div>
      </div>
      <div class="c-info"><div class="c-title">${t}</div><div class="c-sub">${y} ${srcTag(m)}</div></div>
    </div>`;
  }

  // ── Lịch sử phim card (with progress bar)
  function hCard(m, idx){
    const t=esc(m.name||'?'), po=m.thumb||PH(), y=m.year||'';
    let oc,pc;
    if(m.src==='ani'){oc=`go('det-ani',{malId:${m.malId}})`;pc=`go('play-ani',{malId:${m.malId}})`;}
    else if(m.src==='yt'){oc=`go('play-yt',{ytId:'${esc(m.ytId||m.uid.replace('yt_',''))}'})`; pc=oc;}
    else{oc=`go('det-kk',{slug:'${esc(m.slug)}'})`;pc=`go('play-kk',{slug:'${esc(m.slug)}'})` ;}
    const pos = m.positionSec||0;
    const posLabel = pos>0 ? `<span class="hist-pos">▶ ${fmtSec(pos)}</span>` : '';
    return `<div class="card hist-card" onclick="${oc}">
      <div class="c-poster"><img src="${po}" loading="lazy" onerror="this.src='${PH()}'">
      <div class="c-ov"><div class="c-play" onclick="event.stopPropagation();${pc}">▶</div></div>
      <div class="c-stt">${idx+1}</div>
      </div>
      <div class="c-info">
        <div class="c-title">${t}</div>
        <div class="c-sub">${y} ${srcTag(m)} ${posLabel}</div>
      </div>
    </div>`;
  }

  // ── Lịch sử nhạc card (with progress bar)
  function nhCard(t, idx){
    const title=esc(t.title||'?'), artist=esc(t.artist||''), art=t.art||'';
    const dur=t.dur||0, pos=t.positionSec||0;
    const pct=dur>0?Math.min(100,Math.round(pos/dur*100)):0;
    const durLabel=dur?fmtSec(dur):'';
    const posLabel=pos>0?fmtSec(pos):'';
    return `<div class="wl-music-card nh-hist-card" onclick="go('nhac')">
      <div class="nh-stt">${idx+1}</div>
      <div class="wlm-art">
        <img src="${art}" alt="" onerror="this.src='${PH()}'">
        <div class="wlm-art-ov">🎵</div>
      </div>
      <div class="wlm-info">
        <div class="wlm-title">${title}</div>
        <div class="wlm-artist">${artist}</div>
        ${pos>0?`<div class="nh-prog-wrap"><div class="nh-prog-bar" style="width:${pct}%"></div></div><div class="nh-time-row"><span>${posLabel}</span><span>${durLabel}</span></div>`:''}
      </div>
      <div class="wlm-dur">${durLabel}</div>
    </div>`;
  }

  // Load liked music tracks
  const likedMusic = JSON.parse(localStorage.getItem('zmp_liked_tracks')||'[]');
  function mCard(t){
    const title=esc(t.title||'?'), artist=esc(t.artist||''), art=t.art||'';
    return `<div class="wl-music-card" onclick="go('nhac')">
      <div class="wlm-art">
        <img src="${art}" alt="" onerror="this.style.display='none'">
        <div class="wlm-art-ov">🎵</div>
      </div>
      <div class="wlm-info">
        <div class="wlm-title">${title}</div>
        <div class="wlm-artist">${artist}</div>
      </div>
      <div class="wlm-dur">${t.dur?Math.floor(t.dur/60)+':'+(t.dur%60).toString().padStart(2,'0'):''}</div>
    </div>`;
  }

  // ── Pagination helpers
  function renderPager(tabId, total, curPage){
    const totalPages = Math.ceil(total/PER_PAGE);
    if(totalPages<=1) return '';
    let btns='';
    for(let i=1;i<=totalPages;i++){
      btns+=`<button class="pg-btn${i===curPage?' on':''}" onclick="wlGoPage('${tabId}',${i})">${i}</button>`;
    }
    return `<div class="pg-row">${btns}</div>`;
  }

  function renderWlTab(items, cardFn){
    if(!items.length) return null;
    return items.map((m,i)=>cardFn(m,i));
  }

  // Page state
  const pgState = { wl:1, hi:1, nh:1 };

  function renderTabContent(tab){
    const PAGE = PER_PAGE;
    if(tab==='wl'){
      const p=pgState.wl, items=S.wl.slice((p-1)*PAGE, p*PAGE);
      if(!S.wl.length) return `<div class="empty-state"><div class="ico">🎬</div><h3>Chưa có yêu thích</h3><p>Bấm ❤️ để lưu phim.</p><button class="btn btn-red" onclick="go('home')" style="margin-top:13px">Khám phá</button></div>`;
      return `<div class="grid">${items.map((m,i)=>wCard(m,(p-1)*PAGE+i)).join('')}</div>${renderPager('wl',S.wl.length,p)}`;
    }
    if(tab==='hi'){
      const p=pgState.hi, items=S.hist.slice((p-1)*PAGE, p*PAGE);
      if(!S.hist.length) return `<div class="empty-state"><div class="ico">🕑</div><h3>Chưa có lịch sử xem</h3><p>Xem phim để xuất hiện ở đây.</p></div>`;
      return `<div class="grid">${items.map((m,i)=>hCard(m,(p-1)*PAGE+i)).join('')}</div>${renderPager('hi',S.hist.length,p)}`;
    }
    if(tab==='nh'){
      const p=pgState.nh, items=S.nhacHist.slice((p-1)*PAGE, p*PAGE);
      if(!S.nhacHist.length) return `<div class="empty-state"><div class="ico">🎵</div><h3>Chưa có lịch sử nhạc</h3><p>Nghe nhạc để xuất hiện ở đây.</p><button class="btn btn-red" onclick="go('nhac')" style="margin-top:13px">Nghe nhạc</button></div>`;
      return `<div class="wl-music-list">${items.map((t,i)=>nhCard(t,(p-1)*PAGE+i)).join('')}</div>${renderPager('nh',S.nhacHist.length,p)}`;
    }
    if(tab==='mu'){
      if(!likedMusic.length) return `<div class="empty-state"><div class="ico">🎵</div><h3>Chưa có nhạc yêu thích</h3><p>Bấm ❤️ khi nghe nhạc để lưu vào đây.</p><button class="btn btn-red" onclick="go('nhac')" style="margin-top:13px">Nghe nhạc</button></div>`;
      return `<div class="wl-music-list">${likedMusic.map(mCard).join('')}</div>`;
    }
    return '';
  }

  app.innerHTML=renderNav()+`<div class="wl-page page">
    <h1>Thư viện của tôi</h1>
    <p style="font-size:13px;color:var(--mu)">Yêu thích & lịch sử — 🇻🇳 Phim Việt · 🎌 Anime · 🔴 DZITube · 🎵 Nhạc</p>
    <div class="wl-tabs wl-tabs-5">
      <button class="wl-tab on" id="wt1" onclick="swWL('wl')">❤️ Yêu thích (${S.wl.length})</button>
      <button class="wl-tab" id="wt2" onclick="swWL('hi')">🎬 L.Sử Phim (${S.hist.length})</button>
      <button class="wl-tab" id="wt3" onclick="swWL('nh')">🎵 L.Sử Nhạc (${S.nhacHist.length})</button>
      <button class="wl-tab" id="wt4" onclick="swWL('mu')">❤️ Nhạc (${likedMusic.length})</button>
    </div>
    <div id="wtc1">${renderTabContent('wl')}</div>
    <div id="wtc2" style="display:none">${renderTabContent('hi')}</div>
    <div id="wtc3" style="display:none">${renderTabContent('nh')}</div>
    <div id="wtc4" style="display:none">${renderTabContent('mu')}</div>
  </div>`;

  window.swWL=t=>{
    ['wtc1','wtc2','wtc3','wtc4'].forEach((id,i)=>{ document.getElementById(id).style.display=(['wl','hi','nh','mu'][i]===t)?'':'none'; });
    ['wt1','wt2','wt3','wt4'].forEach((id,i)=>{ document.getElementById(id).className='wl-tab'+(['wl','hi','nh','mu'][i]===t?' on':''); });
  };

  window.wlGoPage = function(tab, page){
    pgState[tab]=page;
    const idxMap={wl:'wtc1',hi:'wtc2',nh:'wtc3',mu:'wtc4'};
    const el=document.getElementById(idxMap[tab]);
    if(el){ el.innerHTML=renderTabContent(tab); window.scrollTo({top:0,behavior:'smooth'}); }
  };

  setupNavScroll();
}

// ═══════════════════════════════════════
//  DZI HOME MUSIC PLAYER (custom, no SC embed)
// ═══════════════════════════════════════
(function(){
  const TRACKS = [
    { name:'Nonstop Trend 2026 - Nhạc Remix Ti...', artist:'Jayk', dur:'--:--' },
    { name:'Em Của Ngày Hôm Qua - Sơn Tùng MTP', artist:'Sơn Tùng MTP', dur:'--:--' },
    { name:'Waiting For You - MONO', artist:'MONO', dur:'--:--' },
    { name:'Có Chắc Yêu Là Đây - Sơn Tùng', artist:'Sơn Tùng MTP', dur:'--:--' },
    { name:'Từ Hôm Nay - 1 9 1 9', artist:'1 9 1 9', dur:'--:--' },
  ];

  let curIdx = 0, playing = false, prog = 0, timer = null, shuffle = false;

  function renderPlaylist(){
    const el = document.getElementById('dmp-pl-items');
    if(!el) return;
    el.innerHTML = TRACKS.map((t,i)=>`
      <div class="dmp-pl-item${i===curIdx?' active':''}" onclick="dmpPlay(${i})">
        <span class="dmp-pl-num">${i===curIdx&&playing?'▶':i+1}</span>
        <div class="dmp-pl-track">
          <div class="dmp-pl-tname">${t.name}</div>
          <div class="dmp-pl-tartist">${t.artist}</div>
        </div>
        <span class="dmp-pl-dur">${t.dur}</span>
      </div>`).join('');
  }

  function updateUI(){
    const t = TRACKS[curIdx];
    const nm = document.getElementById('dmp-name');
    const ar = document.getElementById('dmp-artist');
    if(nm) nm.textContent = t.name;
    if(ar) ar.textContent = t.artist + ' · DZI x MUSIC';
    const fill = document.getElementById('dmp-fill');
    if(fill) fill.style.width = prog + '%';
    const pl = document.getElementById('dzi-home-player');
    if(pl){ pl.classList.toggle('dmp-playing', playing); }
    const ip = document.getElementById('dmp-ico-play');
    const ipa = document.getElementById('dmp-ico-pause');
    if(ip) ip.style.display = playing ? 'none' : '';
    if(ipa) ipa.style.display = playing ? '' : 'none';
    // Randomize bar heights for visual
    if(playing){
      document.querySelectorAll('.dmp-bar').forEach(b=>{
        b.style.animationDuration = (0.5 + Math.random()*0.8).toFixed(2)+'s';
        b.style.animationDelay = (Math.random()*0.5).toFixed(2)+'s';
      });
    }
    renderPlaylist();
  }

  function startTimer(){
    clearInterval(timer);
    if(!playing) return;
    timer = setInterval(()=>{
      prog = Math.min(100, prog + 0.2);
      const fill = document.getElementById('dmp-fill');
      if(fill) fill.style.width = prog + '%';
      const secs = Math.floor(prog * 2.5);
      const cur = document.getElementById('dmp-cur');
      if(cur) cur.textContent = `${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}`;
      if(prog >= 100){ prog=0; dmpNext(); }
    }, 300);
  }

  window.dmpToggle = function(){
    playing = !playing;
    updateUI(); startTimer();
  };
  window.dmpPlay = function(i){
    curIdx = i; prog = 0; playing = true;
    updateUI(); startTimer();
  };
  window.dmpNext = function(){
    prog = 0;
    curIdx = shuffle ? Math.floor(Math.random()*TRACKS.length) : (curIdx+1)%TRACKS.length;
    updateUI(); startTimer();
  };
  window.dmpPrev = function(){
    prog = 0;
    curIdx = (curIdx - 1 + TRACKS.length) % TRACKS.length;
    updateUI(); startTimer();
  };
  window.dmpShuffle = function(){
    shuffle = !shuffle;
    const btn = document.getElementById('dmp-shuf');
    if(btn) btn.classList.toggle('active', shuffle);
  };

  // Init when home page loads
  const _origPgHome = window.pgHome;
  window.pgHome = function(){
    _origPgHome && _origPgHome();
    setTimeout(()=>{ playing=false; prog=0; curIdx=0; updateUI(); }, 50);
  };
})();

// ═══════════════════════════════════════
//  YT IFrame API — custom controls
// ═══════════════════════════════════════
let _ytPlayer = null, _ytTimer = null, _ytHideTimer = null, _ytCtrlVisible = true;
let _ytVolume = 100; // track volume locally vì setVolume cần player ready

function fmtYTTime(s){
  s = Math.floor(s||0);
  const m = Math.floor(s/60), sec = s%60;
  return m+':'+(sec<10?'0':'')+sec;
}

// ── Auto-hide controls ─────────────────────────────────
function ytShowCtrl(){
  const ctrl = document.getElementById('yt-ctrl');
  const back = document.querySelector('.yt-back-btn');
  const overlay = document.getElementById('yt-tap-overlay');
  _ytCtrlVisible = true;
  if(ctrl){ ctrl.style.opacity='1'; ctrl.style.pointerEvents='auto'; }
  if(back){ back.style.opacity='1'; }
  // Khi controls hiện: overlay transparent, không chặn controls phía trên
  if(overlay){ overlay.style.pointerEvents='none'; }
  clearTimeout(_ytHideTimer);
  if(_ytPlayer){
    try{
      const s = _ytPlayer.getPlayerState();
      if(s===1){ _ytHideTimer = setTimeout(ytHideCtrl, 3000); }
    }catch(e){}
  }
}

function ytHideCtrl(){
  const ctrl = document.getElementById('yt-ctrl');
  const back = document.querySelector('.yt-back-btn');
  const overlay = document.getElementById('yt-tap-overlay');
  _ytCtrlVisible = false;
  if(ctrl){ ctrl.style.opacity='0'; ctrl.style.pointerEvents='none'; }
  if(back){ back.style.opacity='0'; }
  // Khi controls ẩn: overlay bắt touch để show lại
  if(overlay){ overlay.style.pointerEvents='auto'; }
}

// Tap overlay click — chỉ toggle, không fire khi tap controls
window.ytTapOverlayClick = function(e){
  ytToggleCtrl();
};

function ytToggleCtrl(){
  if(_ytCtrlVisible) ytHideCtrl();
  else ytShowCtrl();
}

// ── Update UI ──────────────────────────────────────────
function ytUpdateUI(){
  if(!_ytPlayer || typeof _ytPlayer.getCurrentTime !== 'function') return;
  try {
    const cur = _ytPlayer.getCurrentTime()||0;
    const dur = _ytPlayer.getDuration()||0;
    const pct = dur ? (cur/dur*100) : 0;
    const $ = id => document.getElementById(id);
    if($('yt-cur')) $('yt-cur').textContent = fmtYTTime(cur);
    if($('yt-dur')) $('yt-dur').textContent = fmtYTTime(dur);
    if($('yt-prog-fill')) $('yt-prog-fill').style.width = pct+'%';
    if($('yt-prog-thumb')) $('yt-prog-thumb').style.left = pct+'%';
    const state = _ytPlayer.getPlayerState();
    const icon = $('yt-play-icon');
    if(icon){
      icon.innerHTML = state===1
        ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
        : '<path d="M8 5v14l11-7z"/>';
    }
    // Volume slider sync
    const volEl = $('yt-vol');
    if(volEl) volEl.value = _ytVolume;
  } catch(e){}
}

// ── Controls ───────────────────────────────────────────
window.ytToggle = function(){
  if(!_ytPlayer) return;
  ytShowCtrl();
  try {
    const s = _ytPlayer.getPlayerState();
    if(s===1){ _ytPlayer.pauseVideo(); clearTimeout(_ytHideTimer); ytShowCtrl(); }
    else { _ytPlayer.playVideo(); }
  } catch(e){}
};

window.ytSkip = function(sec){
  if(!_ytPlayer) return;
  ytShowCtrl();
  try { _ytPlayer.seekTo((_ytPlayer.getCurrentTime()||0)+sec, true); } catch(e){}
};

window.ytSeek = function(e){
  if(!_ytPlayer) return;
  ytShowCtrl();
  try {
    const bar = document.getElementById('yt-prog');
    if(!bar) return;
    const r = bar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - r.left)/r.width));
    _ytPlayer.seekTo((_ytPlayer.getDuration()||0)*pct, true);
  } catch(e){}
};

// FIX: ytVol nhận 0-100, gọi setVolume đúng cách
window.ytVol = function(v){
  _ytVolume = Math.round(parseFloat(v));
  ytShowCtrl();
  if(!_ytPlayer) return;
  try { _ytPlayer.setVolume(_ytVolume); } catch(e){}
};

let _ytFakeFS = false;
window.ytFullscreen = function(){
  ytShowCtrl();
  const outer = document.querySelector('.yt-player-outer');
  if(!outer) return;

  // Thử native fullscreen trước (Android Chrome)
  if(!_ytFakeFS){
    const req = outer.requestFullscreen || outer.webkitRequestFullscreen || outer.mozRequestFullScreen;
    if(req && !(/iP(hone|ad|od)/.test(navigator.userAgent))){
      try{
        req.call(outer);
        return;
      }catch(e){}
    }
    // iOS / không support: dùng CSS fake fullscreen
    _ytFakeFS = true;
    outer.style.cssText += ';position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;max-height:100vh!important;z-index:9999!important;border-radius:0!important;aspect-ratio:unset!important';
    document.body.style.overflow='hidden';
    // Đổi icon thành thu nhỏ
    const fsBtn = outer.querySelector('.yt-fs-btn svg');
    if(fsBtn) fsBtn.innerHTML='<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/>';
  } else {
    // Exit fake fullscreen
    _ytFakeFS = false;
    outer.style.cssText = outer.style.cssText
      .replace(/position:[^;]+;?/gi,'')
      .replace(/top:[^;]+;?/gi,'')
      .replace(/left:[^;]+;?/gi,'')
      .replace(/width:[^;v]+;?/gi,'')
      .replace(/height:[^;v]+;?/gi,'')
      .replace(/max-height:[^;]+;?/gi,'')
      .replace(/z-index:[^;]+;?/gi,'')
      .replace(/border-radius:[^;]+;?/gi,'')
      .replace(/aspect-ratio:[^;]+;?/gi,'');
    document.body.style.overflow='';
    const fsBtn = outer.querySelector('.yt-fs-btn svg');
    if(fsBtn) fsBtn.innerHTML='<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>';
    // Native exit fullscreen nếu đang active
    if(document.fullscreenElement||document.webkitFullscreenElement){
      (document.exitFullscreen||document.webkitExitFullscreen||function(){}).call(document);
    }
  }
  ytShowCtrl();
};

// ── Init player ────────────────────────────────────────
window.initYTPlayer = function(videoId){
  clearInterval(_ytTimer);
  clearTimeout(_ytHideTimer);
  _ytPlayer = null;
  _ytVolume = 100;

  function createPlayer(){
    if(!window.YT || !window.YT.Player){ setTimeout(createPlayer, 200); return; }
    const el = document.getElementById('yt-api-player');
    if(!el) return;
    _ytPlayer = new YT.Player('yt-api-player', {
      videoId: videoId,
      playerVars: { autoplay:1, rel:0, modestbranding:1, iv_load_policy:3, controls:0, disablekb:0, fs:0, playsinline:1 },
      events: {
        onReady: function(e){
          e.target.playVideo();
          e.target.setVolume(100);
          startYTTimer();
          // Bắt đầu auto-hide sau 3s
          _ytHideTimer = setTimeout(ytHideCtrl, 3000);
          // Tap overlay xử lý qua onclick inline (ytTapOverlayClick)
          // Setup volume slider với pointer events (fix mobile)
          const volSl = document.getElementById('yt-vol');
          if(volSl){
            volSl.addEventListener('input', function(){ ytVol(this.value); });
            let _dragging = false;
            volSl.addEventListener('pointerdown', function(){ _dragging=true; ytShowCtrl(); });
            volSl.addEventListener('pointermove', function(e){
              if(!_dragging) return;
              ytShowCtrl();
              ytVol(this.value);
            });
            volSl.addEventListener('pointerup', function(){ _dragging=false; ytVol(this.value); });
          }
          // Setup seek bar touch
          const progBar = document.getElementById('yt-prog');
          if(progBar){
            function seekFromEvent(ev){
              const r = progBar.getBoundingClientRect();
              const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
              const pct = Math.max(0, Math.min(1,(cx-r.left)/r.width));
              if(_ytPlayer) try{ _ytPlayer.seekTo((_ytPlayer.getDuration()||0)*pct, true); }catch(e){}
              ytShowCtrl();
            }
            progBar.addEventListener('touchstart', seekFromEvent, {passive:true});
            progBar.addEventListener('touchmove', seekFromEvent, {passive:true});
          }
        },
        onStateChange: function(e){
          ytUpdateUI();
          // Pause → giữ controls hiện; Play → bắt đầu đếm ẩn
          if(e.data===1){ _ytHideTimer = setTimeout(ytHideCtrl, 3000); }
          else { clearTimeout(_ytHideTimer); ytShowCtrl(); }
        }
      }
    });
  }

  if(!window.YT){
    window.onYouTubeIframeAPIReady = createPlayer;
    if(!document.getElementById('yt-api-script')){
      const s = document.createElement('script');
      s.id = 'yt-api-script';
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
  } else {
    createPlayer();
  }
};

function startYTTimer(){
  clearInterval(_ytTimer);
  _ytTimer = setInterval(ytUpdateUI, 500);
}
