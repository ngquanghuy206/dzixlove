// ═══════════════════════════════════════════════════
//  API SOURCES:
//  🇻🇳 KKPhim   → phimapi.com      (Phim Việt)
//  🎌  Jikan    → api.jikan.moe    (Anime)
//  🔴  YouTube  → Invidious API    (YT search, no key)
//  📺  VidSrc   → vidsrc.icu       (Anime player)
//
//  CORS: auto proxy khi mở file local
// ═══════════════════════════════════════════════════

const KK   = 'https://phimapi.com';
const JK   = 'https://api.jikan.moe/v4';
const VS   = 'https://vidsrc.icu/embed';
const KIMG = 'https://phimimg.com';

// ── Backend server (bot-hosting) ──
const API_BASE = 'http://prem-eu5.bot-hosting.cloud:20427';

// ── XvidAPI (proxy qua backend để tránh CORS) ──
const XVID = API_BASE + '/api/xvid';

// Tất cả danh mục 18+ từ xvidapi.com
const XVID_ALL_CATS = [
  { id: 8,   label: 'Nghiệp dư' },
  { id: 43,  label: 'Nhật Bản' },
  { id: 49,  label: 'Phụ nữ trưởng thành' },
  { id: 53,  label: 'Diễn viên nổi tiếng' },
  { id: 54,  label: 'Nghiệp dư thực tế' },
  { id: 45,  label: 'Đồng tính nữ' },
  { id: 20,  label: 'Ngực to' },
  { id: 11,  label: 'Phụ nữ châu Á' },
  { id: 41,  label: 'Ấn Độ' },
  { id: 27,  label: 'Xuất tinh trong' },
  { id: 29,  label: 'Xuất tinh ngoài' },
  { id: 23,  label: 'Quan hệ miệng' },
  { id: 18,  label: 'Mông to' },
  { id: 19,  label: 'Dương vật to' },
  { id: 22,  label: 'Tóc vàng' },
  { id: 24,  label: 'Tóc nâu' },
  { id: 26,  label: 'Webcam' },
  { id: 28,  label: 'Cắm sừng' },
  { id: 31,  label: 'Mặt' },
  { id: 37,  label: 'Tập thể' },
  { id: 39,  label: 'Đồng tính nam' },
  { id: 42,  label: 'Đa chủng tộc' },
  { id: 44,  label: 'Latina' },
  { id: 46,  label: 'Đồ lót gợi cảm' },
  { id: 47,  label: 'Massage' },
  { id: 48,  label: 'Trưởng thành' },
  { id: 50,  label: 'Thoa dầu' },
  { id: 51,  label: 'Nhóm' },
  { id: 55,  label: 'Tóc đỏ' },
  { id: 57,  label: 'Đồ chơi tình dục' },
  { id: 61,  label: 'Tự sướng' },
  { id: 62,  label: 'Phun trào' },
  { id: 63,  label: 'Tất lưới' },
  { id: 65,  label: 'Tuổi teen' },
  { id: 68,  label: 'Thực tế ảo' },
];

// Danh mục nổi bật cho hero sections (hiển thị trên trang chủ 18+)
const XVID_FEATURED_CATS = [
  { id: 43, label: 'Nhật Bản',            icon: '🇯🇵' },
  { id: 8,  label: 'Nghiệp dư',           icon: '🎭' },
  { id: 11, label: 'Phụ nữ châu Á',       icon: '👱' },
  { id: 49, label: 'Phụ nữ trưởng thành', icon: '💄' },
  { id: 53, label: 'Diễn viên nổi tiếng', icon: '⭐' },
  { id: 45, label: 'Đồng tính nữ',        icon: '🌸' },
  { id: 20, label: 'Ngực to',             icon: '💎' },
  { id: 41, label: 'Ấn Độ',               icon: '🌺' },
];

// Invidious instances (fallback list)
const INV_HOSTS = [
  'https://inv.nadeko.net',
  'https://invidious.privacydev.net',
  'https://yt.artemislena.eu',
];
