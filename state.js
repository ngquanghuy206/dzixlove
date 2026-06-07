// ═══════════════════════════════════════
//  STATE
// ═══════════════════════════════════════
const S = {
  page: 'home',
  // navigation data
  slug: null, malId: null, ytId: null,
  q: '', src: 'all',
  cat: '', ltTab: 'bo-lt',
  epIdx: 0, svIdx: 0, epNum: 1, dub: 0,
  // user data
  wl: JSON.parse(localStorage.getItem('lp_wl')||'[]'),
  hist: JSON.parse(localStorage.getItem('lp_h')||'[]'),
};

const inWL = id => S.wl.some(m=>m.uid===String(id));

window.toggleWL = function(raw){
  const m = typeof raw==='string' ? JSON.parse(raw) : raw;
  const k = String(m.uid);
  if(inWL(k)){ S.wl=S.wl.filter(x=>x.uid!==k); showToast('💔 Đã xóa khỏi yêu thích'); }
  else { S.wl.unshift(m); showToast('❤️ Đã thêm vào yêu thích'); }
  localStorage.setItem('lp_wl', JSON.stringify(S.wl));
  const fb = document.getElementById('fav-btn');
  if(fb){ const on=inWL(k); fb.className='fav-btn'+(on?' on':''); fb.textContent=on?'❤️':'🤍'; }
};

function addHist(m){
  S.hist = [m, ...S.hist.filter(x=>x.uid!==m.uid)].slice(0,80);
  localStorage.setItem('lp_h', JSON.stringify(S.hist));
}

let _toast;
function showToast(msg){
  clearTimeout(_toast);
  const el = document.getElementById('toast');
  el.textContent = msg; el.style.display = 'flex';
  _toast = setTimeout(()=>{ el.style.display='none'; }, 2600);
}

// ── PiP state ───────────────────────────
const PIP = { active: false, src: '', title: '', fromPage: null, fromOpts: {} };

function pipShow(src, title){
  const pip = document.getElementById('dzi-pip');
  const fr  = document.getElementById('dzi-pip-frame');
  const tl  = document.getElementById('dzi-pip-title');
  if(!pip || !fr) return;
  if(fr.src !== src) fr.src = src;
  if(tl) tl.textContent = title || 'Đang xem...';
  pip.classList.add('show');
  PIP.active = true;
  PIP.src = src;
  PIP.title = title;
}

window.pipClose = function(){
  const pip = document.getElementById('dzi-pip');
  const fr  = document.getElementById('dzi-pip-frame');
  if(pip) pip.classList.remove('show');
  PIP.active = false; PIP.src = ''; PIP.title = '';
  // Delay blanking so iframe keeps playing briefly while navigating
  setTimeout(()=>{ if(!PIP.active && fr) fr.src = 'about:blank'; }, 500);
};

window.pipGoBack = function(){
  // Navigate back to player page
  if(PIP.fromPage){
    const p = PIP.fromPage, o = PIP.fromOpts;
    PIP.fromPage = null;
    // Hide PiP visually first
    const pip = document.getElementById('dzi-pip');
    if(pip) pip.classList.remove('show');
    PIP.active = false;
    // go() is defined later in router.js, use setTimeout to be safe
    setTimeout(()=>{ if(window.go) window.go(p, o); }, 0);
  }
};

// Draggable PiP — init after DOM ready
function initPipDrag(){
  const pip = document.getElementById('dzi-pip');
  if(!pip) return;
  let ox=0,oy=0,startX=0,startY=0,dragging=false;
  pip.addEventListener('pointerdown', e=>{
    if(e.target.closest('.pip-btn')) return;
    dragging=true; pip.setPointerCapture(e.pointerId);
    startX=e.clientX-ox; startY=e.clientY-oy;
  });
  pip.addEventListener('pointermove', e=>{
    if(!dragging) return;
    ox=e.clientX-startX; oy=e.clientY-startY;
    pip.style.transform=`translate(${ox}px,${oy}px)`;
  });
  pip.addEventListener('pointerup', ()=>{ dragging=false; });
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', initPipDrag);
} else {
  initPipDrag();
}

const PLAYER_PAGES = new Set(['play-kk','play-ani','play-yt']);

window.go = function(page, opts){
  opts = opts||{};

  // If currently on player page → activate PiP before navigating away
  if(PLAYER_PAGES.has(S.page) && !PLAYER_PAGES.has(page)){
    // Grab the live iframe src directly from DOM
    const liveIframe = document.querySelector('.player-wrap iframe, .player-page iframe');
    if(liveIframe && liveIframe.src && liveIframe.src !== 'about:blank'){
      PIP.src = liveIframe.src;
    }
    if(PIP.src){
      PIP.fromPage = S.page;
      PIP.fromOpts = { slug: S.slug, malId: S.malId, ytId: S.ytId, epIdx: S.epIdx, svIdx: S.svIdx };
      pipShow(PIP.src, PIP.title || document.querySelector('.player-title')?.textContent || 'Đang xem...');
    }
  }

  // If navigating TO a player page → close PiP
  if(PLAYER_PAGES.has(page)){
    pipClose();
  }

  S.page = page;
  ['slug','malId','ytId','q','src','cat','ltTab'].forEach(k=>{ if(opts[k]!==undefined) S[k]=opts[k]; });
  if(!PLAYER_PAGES.has(page)){ S.epIdx=0; S.svIdx=0; S.epNum=1; S.dub=0; }
  window.scrollTo({top:0,behavior:'smooth'});
  render();
};

// Intercept browser back button
window.addEventListener('popstate', function(e){
  if(PLAYER_PAGES.has(S.page)){
    const liveIframe = document.querySelector('.player-wrap iframe, .player-page iframe');
    if(liveIframe && liveIframe.src && liveIframe.src !== 'about:blank'){
      PIP.src = liveIframe.src;
      PIP.fromPage = S.page;
      PIP.fromOpts = { slug: S.slug, malId: S.malId, ytId: S.ytId };
      pipShow(PIP.src, PIP.title || 'Đang xem...');
    }
    // Navigate back to previous non-player page
    S.page = 'home';
    setTimeout(()=>{ if(window.render) window.render(); }, 0);
  }
});
// Push state when entering player so back button fires popstate
const _origRender = window.render;
window.render = function(){
  if(PLAYER_PAGES.has(S.page)){
    // Store current "from" page so back buttons can navigate correctly
    const prevState = history.state || {};
    history.pushState({ page: S.page, from: prevState.page || 'home', fromOpts: prevState.fromOpts || {} }, '', location.href);
  }
  _origRender();
};
