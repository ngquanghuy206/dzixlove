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
  else {
    S.wl.unshift(m); showToast('❤️ Đã thêm vào yêu thích');
    if(window.sfxFavorite) sfxFavorite();
    if(window.missionProgress) missionProgress('favorite');
  }
  localStorage.setItem('lp_wl', JSON.stringify(S.wl));
  const fb = document.getElementById('fav-btn');
  if(fb){ const on=inWL(k); fb.className='fav-btn'+(on?' on':''); fb.textContent=on?'❤️':'🤍'; }
};

function addHist(m){
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

// FIX: initPipDrag được định nghĩa trong components.js — gọi sau khi DOM sẵn sàng
// Tránh lỗi "initPipDrag is not defined" nếu components.js chưa load
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', ()=>{ if(window.initPipDrag) initPipDrag(); });
} else {
  if(window.initPipDrag) initPipDrag();
}

const PLAYER_PAGES = new Set(['play-kk','play-ani','play-yt']);

window.go = function(page, opts){
  opts = opts||{};

  if(PLAYER_PAGES.has(page)){
    window._watchTimer && clearInterval(window._watchTimer);
  }

  // Âm thanh chuyển trang (không phát khi vào player)
  if(window.sfxNav && !PLAYER_PAGES.has(page)) sfxNav();

  S.page = page;
  ['slug','malId','ytId','q','src','cat','ltTab'].forEach(k=>{ if(opts[k]!==undefined) S[k]=opts[k]; });
  if(!PLAYER_PAGES.has(page)){ S.epIdx=0; S.svIdx=0; S.epNum=1; S.dub=0; }
  window.scrollTo({top:0,behavior:'smooth'});
  render();
};

window.addEventListener('popstate', function(e){
  if(PLAYER_PAGES.has(S.page)){
    S.page = 'home';
    setTimeout(()=>{ if(window.render) window.render(); }, 0);
  }
});

// FIX: lưu ref render gốc chỉ khi nó đã tồn tại, tránh loop vô hạn
(function(){
  const _origRender = window.render;
  window.render = function(){
    if(PLAYER_PAGES.has(S.page)){
      const prevState = history.state || {};
      history.pushState({ page: S.page, from: prevState.page || 'home', fromOpts: prevState.fromOpts || {} }, '', location.href);
    }
    if(_origRender) _origRender();
  };
})();
