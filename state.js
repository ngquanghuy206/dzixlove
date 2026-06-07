// ═══════════════════════════════════════
//  STATE
// ═══════════════════════════════════════
const S = {
  page: 'home',
  slug: null, malId: null, ytId: null,
  q: '', src: 'all',
  cat: '', ltTab: 'bo-lt',
  epIdx: 0, svIdx: 0, epNum: 1, dub: 0,
  wl: JSON.parse(localStorage.getItem('lp_wl')||'[]'),
  hist: JSON.parse(localStorage.getItem('lp_h')||'[]'),
  nhacHist: JSON.parse(localStorage.getItem('lp_nh')||'[]'),
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
  // Preserve existing positionSec if new entry doesn't have one
  const existing = S.hist.find(x=>x.uid===m.uid);
  if(existing && m.positionSec===undefined) m.positionSec = existing.positionSec||0;
  m.addedAt = Date.now();
  S.hist = [m, ...S.hist.filter(x=>x.uid!==m.uid)].slice(0,200);
  localStorage.setItem('lp_h', JSON.stringify(S.hist));
}

window.updateHistPos = function(uid, positionSec){
  const entry = S.hist.find(x=>x.uid===uid);
  if(entry){ entry.positionSec=Math.floor(positionSec); localStorage.setItem('lp_h', JSON.stringify(S.hist)); }
};

window.addNhacHist = function(track, positionSec){
  if(!track||!track.id) return;
  const entry = {
    id: String(track.id),
    title: track.title||'?',
    artist: track.artist||'',
    art: track.art||'',
    dur: track.dur||0,
    positionSec: Math.floor(positionSec||0),
    addedAt: Date.now(),
  };
  S.nhacHist = [entry, ...S.nhacHist.filter(x=>x.id!==entry.id)].slice(0,200);
  localStorage.setItem('lp_nh', JSON.stringify(S.nhacHist));
};

window.updateNhacHistPos = function(id, positionSec){
  const entry = S.nhacHist.find(x=>x.id===String(id));
  if(entry){ entry.positionSec=Math.floor(positionSec); localStorage.setItem('lp_nh', JSON.stringify(S.nhacHist)); }
};

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

  // Build src with autoplay=1
  let pipSrc = src;
  try {
    const u = new URL(src);
    u.searchParams.set('autoplay','1');
    pipSrc = u.toString();
  } catch(e){ pipSrc = src; }

  fr.src = 'about:blank';
  setTimeout(()=>{ fr.src = pipSrc; }, 50);

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
  setTimeout(()=>{ if(!PIP.active && fr) fr.src = 'about:blank'; }, 500);
};

window.pipGoBack = function(){
  if(PIP.fromPage){
    const p = PIP.fromPage, o = PIP.fromOpts;
    PIP.fromPage = null;
    const pip = document.getElementById('dzi-pip');
    if(pip) pip.classList.remove('show');
    PIP.active = false;
    const fr = document.getElementById('dzi-pip-frame');
    if(fr) fr.src = 'about:blank';
    setTimeout(()=>{ if(window.go) window.go(p, o); }, 0);
  }
};

// Draggable PiP — tap once = go back to movie, drag = move
function initPipDrag(){
  const pip = document.getElementById('dzi-pip');
  if(!pip) return;
  let ox=0,oy=0,startX=0,startY=0,moved=false;

  pip.addEventListener('pointerdown', e=>{
    if(e.target.closest('.pip-btn')) return;
    moved=false;
    pip.setPointerCapture(e.pointerId);
    startX=e.clientX-ox; startY=e.clientY-oy;
  });
  pip.addEventListener('pointermove', e=>{
    const nx=e.clientX-startX, ny=e.clientY-startY;
    if(Math.abs(nx-ox)>6||Math.abs(ny-oy)>6) moved=true;
    ox=nx; oy=ny;
    pip.style.transform=`translate(${ox}px,${oy}px)`;
  });
  pip.addEventListener('pointerup', e=>{
    if(!moved && !e.target.closest('.pip-btn')){
      // Single tap = navigate back to movie
      pipGoBack();
    }
  });
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', initPipDrag);
} else {
  initPipDrag();
}

const PLAYER_PAGES = new Set(['play-kk','play-ani','play-yt']);

window.go = function(page, opts){
  opts = opts||{};

  if(PLAYER_PAGES.has(S.page) && !PLAYER_PAGES.has(page)){
    const liveIframe = document.querySelector('.player-wrap iframe, .player-page iframe');
    if(liveIframe && liveIframe.src && liveIframe.src !== 'about:blank'){
      PIP.src = liveIframe.src;
      // Move live iframe into PiP BEFORE render() destroys #app — video keeps playing
      const pipVideo = document.getElementById('dzi-pip-video');
      const oldFr = document.getElementById('dzi-pip-frame');
      if(pipVideo){
        liveIframe.id = 'dzi-pip-frame';
        liveIframe.style.cssText = 'position:absolute;left:-20%;top:-25%;width:140%;height:190%;border:none;display:block;pointer-events:auto;';
        if(oldFr && oldFr !== liveIframe) oldFr.remove();
        pipVideo.insertBefore(liveIframe, pipVideo.firstChild);
      }
    }
    if(PIP.src){
      PIP.fromPage = S.page;
      PIP.fromOpts = { slug: S.slug, malId: S.malId, ytId: S.ytId, epIdx: S.epIdx, svIdx: S.svIdx };
      const tl = document.getElementById('dzi-pip-title');
      if(tl) tl.textContent = PIP.title || document.querySelector('.player-title')?.textContent || 'Đang xem...';
      const pip = document.getElementById('dzi-pip');
      if(pip) pip.classList.add('show');
      PIP.active = true;
    }
  }

  if(PLAYER_PAGES.has(page)){
    pipClose();
    // Clear watch position timer when entering player
    window._watchTimer && clearInterval(window._watchTimer);
  }

  S.page = page;
  ['slug','malId','ytId','q','src','cat','ltTab'].forEach(k=>{ if(opts[k]!==undefined) S[k]=opts[k]; });
  if(!PLAYER_PAGES.has(page)){ S.epIdx=0; S.svIdx=0; S.epNum=1; S.dub=0; }
  window.scrollTo({top:0,behavior:'smooth'});
  render();
};

window.addEventListener('popstate', function(e){
  if(PLAYER_PAGES.has(S.page)){
    const liveIframe = document.querySelector('.player-wrap iframe, .player-page iframe');
    if(liveIframe && liveIframe.src && liveIframe.src !== 'about:blank'){
      PIP.src = liveIframe.src;
      PIP.fromPage = S.page;
      PIP.fromOpts = { slug: S.slug, malId: S.malId, ytId: S.ytId };
      pipShow(PIP.src, PIP.title || 'Đang xem...');
    }
    S.page = 'home';
    setTimeout(()=>{ if(window.render) window.render(); }, 0);
  }
});

const _origRender = window.render;
window.render = function(){
  if(PLAYER_PAGES.has(S.page)){
    const prevState = history.state || {};
    history.pushState({ page: S.page, from: prevState.page || 'home', fromOpts: prevState.fromOpts || {} }, '', location.href);
  }
  _origRender();
};
