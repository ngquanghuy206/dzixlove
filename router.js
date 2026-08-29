// ═══════════════════════════════════════
//  ROUTER
// ═══════════════════════════════════════
function render(){
  clearInterval(window._ht);
  // Reset fake fullscreen khi chuyển trang
  if(window._ytFakeFS){
    window._ytFakeFS = false;
    document.body.style.overflow='';
  }
  switch(S.page){
    case 'home':      pgHome();      break;
    case 'phim':      pgPhim();      break;
    case 'lt':        pgLT();        break;
    case 'cat':       pgCat();       break;
    case 'det-kk':    pgDetKK();     break;
    case 'det-ani':   pgDetAni();    break;
    case 'play-kk':   pgPlayKK();    break;
    case 'play-ani':  pgPlayAni();   break;
    case 'dzitube':       pgDZITube();       break;
    case 'dzitube-short': pgDZITubeShort();  break;
    case 'play-yt':   pgPlayYT();    break;
    case 'search':    pgSearch();    break;
    case 'watchlist': pgWatchlist(); break;
    case 'nhac':      pgNhac();      break;
    case 'missions':  pgMissions();  break;
    case 'phim18':    pgPhim18();    break;
    case 'phim18cat': pgPhim18Cat(); break;
    case 'det-xvid':  pgDetXvid();   break;
    case 'play-xvid': pgPlayXvid();  break;
    default:          pgHome();
  }
}
// FIX: Gán window.render và bọc lại để xử lý history state
window.render = render;
(function(){
  const _origRender = window.render;
  window.render = function(){
    if(PLAYER_PAGES.has(S.page)){
      const prevState = history.state || {};
      history.pushState({ page: S.page, from: prevState.page || 'home', fromOpts: prevState.fromOpts || {} }, '', location.href);
    }
    _origRender();
  };
})();
// Không gọi render() ở đây — auth.js sẽ gọi sau khi xác nhận login

// Init app on load
window.addEventListener('DOMContentLoaded', async () => {
  if (window.hideAuthScreen) hideAuthScreen();
  if (window.DZI_USER && window.DZI_TOKEN && window.syncPull) {
    try { await syncPull(); } catch(e){}
  }
  render();
});
