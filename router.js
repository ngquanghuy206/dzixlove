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
    default:          pgHome();
  }
}
// FIX: gán window.render TRƯỚC khi state.js IIFE đã wrap nó
// Router load sau state.js, nên ghi đè lại đúng thứ tự
window.render = render;
render();
