// ═══════════════════════════════════════════════════════
//  DZI SYNC — Đồng bộ user data localStorage ↔ MongoDB
// ═══════════════════════════════════════════════════════

let _syncTimer = null;
let _syncPending = false;

// ── Push data lên server ──
async function syncPush() {
  if (!window.DZI_USER || !window.DZI_TOKEN) return;
  try {
    const missions = localStorage.getItem('dzi_missions_' + DZI_USER.username);
    const payload = {
      watchlist:          JSON.parse(localStorage.getItem('lp_wl') || '[]'),
      history:            JSON.parse(localStorage.getItem('lp_h') || '[]'),
      music_history:      JSON.parse(localStorage.getItem('lp_nh') || '[]'),
      music_liked:        JSON.parse(localStorage.getItem('zmp_liked') || '[]'),
      music_liked_tracks: JSON.parse(localStorage.getItem('zmp_liked_tracks') || '[]'),
    };
    if (missions) payload.missions = JSON.parse(missions);

    await fetch((window.API_BASE || '') + '/api/userdata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DZI_TOKEN },
      body: JSON.stringify(payload)
    });
  } catch(e) {}
}

// ── Pull data từ server về, merge vào localStorage ──
async function syncPull() {
  if (!window.DZI_USER || !window.DZI_TOKEN) return;
  try {
    const r = await fetch((window.API_BASE || '') + '/api/userdata', {
      headers: { 'Authorization': 'Bearer ' + DZI_TOKEN }
    });
    if (!r.ok) return;
    const d = await r.json();

    if (d.watchlist && d.watchlist.length)
      localStorage.setItem('lp_wl', JSON.stringify(d.watchlist));
    if (d.history && d.history.length)
      localStorage.setItem('lp_h', JSON.stringify(d.history));
    if (d.music_history && d.music_history.length)
      localStorage.setItem('lp_nh', JSON.stringify(d.music_history));
    if (d.music_liked && d.music_liked.length)
      localStorage.setItem('zmp_liked', JSON.stringify(d.music_liked));
    if (d.music_liked_tracks && d.music_liked_tracks.length)
      localStorage.setItem('zmp_liked_tracks', JSON.stringify(d.music_liked_tracks));
    if (d.missions)
      localStorage.setItem('dzi_missions_' + DZI_USER.username, JSON.stringify(d.missions));

    // Reload state từ localStorage mới
    if (window.S) {
      S.wl   = JSON.parse(localStorage.getItem('lp_wl') || '[]');
      S.hist = JSON.parse(localStorage.getItem('lp_h') || '[]');
      S.nhacHist = JSON.parse(localStorage.getItem('lp_nh') || '[]');
    }
  } catch(e) {}
}

// ── Debounce push — tránh push quá nhiều lần ──
window.syncSchedule = function() {
  _syncPending = true;
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(() => {
    if (_syncPending) { _syncPending = false; syncPush(); }
  }, 3000); // push sau 3 giây idle
};

// ── Gọi khi login xong ──
window.syncOnLogin = async function() {
  await syncPull(); // pull về trước
  if (window.render) render();
};

// ── Push khi đóng tab ──
window.addEventListener('beforeunload', () => {
  if (window.DZI_USER && window.DZI_TOKEN) syncPush();
});

// ── Auto push mỗi 2 phút ──
setInterval(() => {
  if (window.DZI_USER && window.DZI_TOKEN) syncPush();
}, 120000);
