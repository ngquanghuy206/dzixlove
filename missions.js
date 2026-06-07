// ═══════════════════════════════════════
//  MISSIONS SYSTEM — DZI MUSIC & MOVIE
//  LV max: 30, 7 nhiệm vụ/ngày random
// ═══════════════════════════════════════

// ── Cấu hình EXP theo level ──
const LV_EXP = [
  0,     // lv0 (không dùng)
  100,   // lv1 → lv2
  200,   // lv2 → lv3
  350,   // lv3 → lv4
  550,   // lv4 → lv5
  800,   // lv5 → lv6
  1100,  // lv6 → lv7
  1450,  // lv7 → lv8
  1850,  // lv8 → lv9
  2300,  // lv9 → lv10
  2800,  // lv10 → lv11
  3400,  // lv11 → lv12
  4100,  // lv12 → lv13
  4900,  // lv13 → lv14
  5800,  // lv14 → lv15
  6800,  // lv15 → lv16
  7900,  // lv16 → lv17
  9100,  // lv17 → lv18
  10400, // lv18 → lv19
  11800, // lv19 → lv20
  13300, // lv20 → lv21
  14900, // lv21 → lv22
  16600, // lv22 → lv23
  18400, // lv23 → lv24
  20300, // lv24 → lv25
  22300, // lv25 → lv26
  24400, // lv26 → lv27
  26600, // lv27 → lv28
  28900, // lv28 → lv29
  31300, // lv29 → lv30
];

const MAX_LV = 30;
const MISSIONS_PER_DAY = 7;

// ── Tất cả nhiệm vụ có thể (pool) ──
const MISSION_POOL = [
  { id:'w_1', type:'watch_phim',  icon:'🎬', title:'Xem 1 bộ phim',           desc:'Xem bất kỳ phim nào trên DZI',            exp:30, target:1 },
  { id:'w_3', type:'watch_phim',  icon:'🎬', title:'Xem 3 phim liên tiếp',     desc:'Xem 3 phim khác nhau trong ngày',          exp:80, target:3 },
  { id:'a_1', type:'watch_anime', icon:'🎌', title:'Xem 1 tập Anime',          desc:'Xem bất kỳ anime nào',                     exp:25, target:1 },
  { id:'a_3', type:'watch_anime', icon:'🎌', title:'Binge-watch 3 tập anime',  desc:'Xem 3 tập anime trong ngày',               exp:70, target:3 },
  { id:'m_5', type:'listen_music',icon:'🎵', title:'Nghe 5 bài nhạc',          desc:'Nghe đủ 5 bài trên DZI x MUSIC',          exp:20, target:5 },
  { id:'m_10',type:'listen_music',icon:'🎵', title:'Nghe 10 bài nhạc',         desc:'Tận hưởng 10 bài trên DZI x MUSIC',       exp:45, target:10},
  { id:'m_3', type:'listen_music',icon:'🎧', title:'Nghe nhạc 3 thể loại',     desc:'Nghe nhạc từ 3 thể loại khác nhau',       exp:35, target:3 },
  { id:'s_1', type:'search',      icon:'🔍', title:'Tìm kiếm phim',             desc:'Dùng tìm kiếm để tìm 1 bộ phim',          exp:10, target:1 },
  { id:'s_3', type:'search',      icon:'🔍', title:'Tìm kiếm 3 lần',            desc:'Thực hiện 3 lần tìm kiếm',                exp:20, target:3 },
  { id:'f_1', type:'favorite',    icon:'❤️', title:'Yêu thích 1 phim',          desc:'Thêm 1 phim vào danh sách yêu thích',    exp:15, target:1 },
  { id:'f_3', type:'favorite',    icon:'❤️', title:'Yêu thích 3 phim',          desc:'Thêm 3 phim vào yêu thích',              exp:40, target:3 },
  { id:'yt_1',type:'watch_yt',    icon:'🔴', title:'Xem DZITube',               desc:'Xem 1 video trên DZITube',                exp:20, target:1 },
  { id:'yt_3',type:'watch_yt',    icon:'🔴', title:'Xem 3 video DZITube',       desc:'Xem 3 video khác nhau trên DZITube',      exp:55, target:3 },
  { id:'sh_1',type:'watch_short', icon:'⚡', title:'Xem DZITube Short',         desc:'Xem 1 short video',                       exp:10, target:1 },
  { id:'sh_5',type:'watch_short', icon:'⚡', title:'Xem 5 DZITube Short',       desc:'Xem 5 short video trong ngày',            exp:30, target:5 },
  { id:'lt_1',type:'watch_lt',    icon:'🔊', title:'Xem phim lồng tiếng',       desc:'Xem 1 phim có lồng tiếng',                exp:35, target:1 },
  { id:'bo_1',type:'watch_phim_bo',icon:'📺','title':'Xem phim bộ',             desc:'Xem ít nhất 1 tập phim bộ',               exp:30, target:1 },
  { id:'bo_3',type:'watch_phim_bo',icon:'📺','title':'Xem 3 tập phim bộ',       desc:'Xem 3 tập phim bộ bất kỳ',               exp:75, target:3 },
  { id:'daily',type:'daily_login',icon:'📅', title:'Đăng nhập hôm nay',        desc:'Chỉ cần mở app và đăng nhập',             exp:15, target:1 },
  { id:'ex_1', type:'explore',    icon:'🌟', title:'Khám phá Anime mới',        desc:'Vào trang Anime và xem thử 1 bộ',         exp:25, target:1 },
  { id:'hist_1',type:'check_hist',icon:'🕐', title:'Xem lịch sử xem phim',     desc:'Mở trang lịch sử xem phim của bạn',       exp:8,  target:1 },
];

// ── Lấy ngày hôm nay dạng string ──
function getTodayKey(){ return new Date().toISOString().slice(0,10); }

// ── Seeded random dựa vào ngày + user ──
function seededRand(seed){
  let h = 0x9dc5811c;
  for(let i=0;i<seed.length;i++){ h = Math.imul(h^seed.charCodeAt(i), 0x9e3779b9); h ^= h>>>16; }
  return function(){ h ^= h<<13; h ^= h>>>17; h ^= h<<5; return (h>>>0)/0x100000000; };
}

// ── Lấy 7 nhiệm vụ ngẫu nhiên cho ngày hôm nay ──
function getDailyMissions(username){
  const key = getTodayKey() + '_' + (username||'guest');
  const rand = seededRand(key);
  const pool = [...MISSION_POOL];
  // shuffle
  for(let i=pool.length-1;i>0;i--){
    const j = Math.floor(rand()*(i+1));
    [pool[i],pool[j]] = [pool[j],pool[i]];
  }
  return pool.slice(0, MISSIONS_PER_DAY);
}

// ── Load state từ localStorage ──
function loadMissionState(username){
  const raw = localStorage.getItem('dzi_missions_' + (username||'guest'));
  if(!raw) return null;
  try{ return JSON.parse(raw); } catch{ return null; }
}

// ── Save state vào localStorage ──
function saveMissionState(username, state){
  localStorage.setItem('dzi_missions_' + (username||'guest'), JSON.stringify(state));
  // Sync to MongoDB
  if(window.DZI_TOKEN && window.dziSyncData && username && username!=='guest'){
    clearTimeout(window._missionSyncTimer);
    window._missionSyncTimer = setTimeout(()=>dziSyncData({missions: state}), 1500);
  }
}

// ── Khởi tạo state nhiệm vụ hôm nay ──
function initMissionState(username){
  const today = getTodayKey();
  let state = loadMissionState(username);
  if(!state || state.date !== today){
    // Ngày mới: reset missions
    const missions = getDailyMissions(username);
    state = {
      date: today,
      missions: missions.map(m => ({...m, progress: 0, done: false})),
      totalExp: state ? state.totalExp : 0,
      level: state ? state.level : 1,
    };
    // daily_login: tự hoàn thành khi load
    state.missions.forEach(m => {
      if(m.type === 'daily_login' && !m.done){ m.progress = 1; m.done = true; }
    });
    saveMissionState(username, state);
  }
  return state;
}

// ── Tính level từ totalExp ──
function calcLevel(exp){
  let lv = 1, cumExp = 0;
  for(let i=1;i<LV_EXP.length;i++){
    cumExp += LV_EXP[i];
    if(exp >= cumExp) lv = i+1;
    else break;
  }
  return Math.min(lv, MAX_LV);
}

// ── Tính % tiến độ lên level tiếp theo ──
function calcLevelProgress(exp){
  if(calcLevel(exp) >= MAX_LV) return { lv: MAX_LV, pct: 100, curExp: exp, needExp: 0 };
  let cumExp = 0;
  for(let i=1;i<LV_EXP.length;i++){
    const need = LV_EXP[i];
    if(exp < cumExp + need){
      const inLevel = exp - cumExp;
      return { lv: i, pct: Math.floor(inLevel/need*100), curExp: inLevel, needExp: need };
    }
    cumExp += need;
  }
  return { lv: MAX_LV, pct: 100, curExp: exp, needExp: 0 };
}

// ── Tên màu theo level ──
function getLvColor(lv){
  if(lv < 5)  return '#78909c';
  if(lv < 10) return '#42a5f5';
  if(lv < 15) return '#66bb6a';
  if(lv < 20) return '#ab47bc';
  if(lv < 25) return '#ff7043';
  if(lv < 30) return '#ffd600';
  return '#ff1744';
}

function getLvTitle(lv){
  if(lv < 5)  return 'Người mới';
  if(lv < 10) return 'Khán giả';
  if(lv < 15) return 'Mê phim';
  if(lv < 20) return 'Cinephile';
  if(lv < 25) return 'Cao thủ';
  if(lv < 30) return 'Huyền thoại';
  return '⭐ DZI Master';
}

// ── Cộng tiến độ nhiệm vụ ──
window.missionProgress = function(type, amount){
  amount = amount || 1;
  const username = window.DZI_USER ? DZI_USER.username : null;
  if(!username) return;
  const state = initMissionState(username);
  let earned = 0;
  state.missions.forEach(m => {
    if(m.type === type && !m.done){
      m.progress = Math.min(m.progress + amount, m.target);
      if(m.progress >= m.target){
        m.done = true;
        earned += m.exp;
        showToast(`✅ Nhiệm vụ hoàn thành! +${m.exp} EXP — "${m.title}"`);
      }
    }
  });
  if(earned > 0){
    state.totalExp += earned;
    const newLv = calcLevel(state.totalExp);
    if(newLv > state.level){
      state.level = newLv;
      setTimeout(()=> showLvUpEffect(newLv), 600);
    }
  }
  saveMissionState(username, state);
};

// ── Hiệu ứng lên level ──
function showLvUpEffect(lv){
  const el = document.createElement('div');
  el.style.cssText = `position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);animation:lvupFadeIn .3s ease`;
  el.innerHTML = `
    <div style="text-align:center;animation:lvupBounce .5s cubic-bezier(.34,1.56,.64,1)">
      <div style="font-size:72px;margin-bottom:8px">🎉</div>
      <div style="font-size:14px;font-weight:700;color:rgba(255,255,255,.6);letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">THĂNG CẤP!</div>
      <div style="font-size:64px;font-weight:900;background:linear-gradient(135deg,${getLvColor(lv)},#fff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1">LV ${lv}</div>
      <div style="font-size:20px;color:${getLvColor(lv)};font-weight:700;margin-top:8px">${getLvTitle(lv)}</div>
      <div style="margin-top:24px;font-size:13px;color:rgba(255,255,255,.5)">Chạm để tiếp tục</div>
    </div>`;
  el.onclick = () => el.remove();
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
  if(!document.getElementById('lvup-style')){
    const s = document.createElement('style');
    s.id='lvup-style';
    s.textContent=`@keyframes lvupFadeIn{from{opacity:0}to{opacity:1}}@keyframes lvupBounce{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}`;
    document.head.appendChild(s);
  }
}

// ── Trang nhiệm vụ ──
window.pgMissions = function(){
  const username = window.DZI_USER ? DZI_USER.username : null;
  if(!username){
    showToast('⚠️ Vui lòng đăng nhập để xem nhiệm vụ');
    go('home'); return;
  }
  const state = initMissionState(username);
  const { lv, pct, curExp, needExp } = calcLevelProgress(state.totalExp);
  const color = getLvColor(lv);
  const title = getLvTitle(lv);
  const doneCnt = state.missions.filter(m=>m.done).length;
  const totalExp = state.missions.reduce((a,m)=>a+m.exp,0);
  const earnedExp = state.missions.filter(m=>m.done).reduce((a,m)=>a+m.exp,0);

  const app = document.getElementById('app');
  app.innerHTML = renderNav() + `
  <div class="page" id="pg-missions" style="padding-bottom:80px;max-width:600px;margin:0 auto">

    <!-- HEADER -->
    <div style="padding:20px 16px 0;text-align:center">
      <div style="font-size:11px;font-weight:800;letter-spacing:3px;color:rgba(232,238,255,.4);text-transform:uppercase;margin-bottom:8px">NHIỆM VỤ HẰNG NGÀY</div>
      <h2 style="font-size:26px;font-weight:900;color:#e8eeff;margin:0 0 4px">Thử thách hôm nay</h2>
      <div style="font-size:13px;color:rgba(232,238,255,.45)">Reset mỗi ngày lúc 00:00 · Hôm nay: ${getTodayKey()}</div>
    </div>

    <!-- LEVEL CARD -->
    <div style="margin:18px 16px 0;background:linear-gradient(135deg,rgba(${hexToRgb(color)},0.15),rgba(0,0,0,.3));border:1px solid rgba(${hexToRgb(color)},0.35);border-radius:20px;padding:20px;position:relative;overflow:hidden">
      <div style="position:absolute;top:-40px;right:-40px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(${hexToRgb(color)},.25),transparent 70%);pointer-events:none"></div>
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
        <div style="width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,${color},rgba(${hexToRgb(color)},.4));display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#fff;box-shadow:0 4px 20px rgba(${hexToRgb(color)},.4);flex-shrink:0">
          ${lv >= MAX_LV ? '👑' : lv}
        </div>
        <div>
          <div style="font-size:18px;font-weight:900;color:${color}">${title}</div>
          <div style="font-size:12px;color:rgba(232,238,255,.5);margin-top:2px">Level ${lv}${lv<MAX_LV?` / ${MAX_LV}`:' — MAX!'}</div>
        </div>
        <div style="margin-left:auto;text-align:right">
          <div style="font-size:22px;font-weight:900;color:#e8eeff">${state.totalExp.toLocaleString()}</div>
          <div style="font-size:11px;color:rgba(232,238,255,.4)">tổng EXP</div>
        </div>
      </div>
      ${lv < MAX_LV ? `
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:11px;color:rgba(232,238,255,.5)">${curExp.toLocaleString()} / ${needExp.toLocaleString()} EXP</span>
          <span style="font-size:11px;font-weight:700;color:${color}">${pct}%</span>
        </div>
        <div style="background:rgba(255,255,255,.08);border-radius:99px;height:8px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${color},rgba(${hexToRgb(color)},.6));border-radius:99px;transition:width .8s cubic-bezier(.34,1.56,.64,1);box-shadow:0 0 10px rgba(${hexToRgb(color)},.5)"></div>
        </div>
        <div style="font-size:11px;color:rgba(232,238,255,.35);margin-top:5px;text-align:right">Cần ${(needExp-curExp).toLocaleString()} EXP nữa → LV ${lv+1}</div>
      </div>` : `<div style="text-align:center;font-size:13px;color:${color};font-weight:700">🏆 Bạn đã đạt cấp độ tối đa!</div>`}
    </div>

    <!-- PROGRESS BAR MISSIONS -->
    <div style="margin:14px 16px 0;background:rgba(255,255,255,.04);border:1px solid rgba(79,124,255,.12);border-radius:16px;padding:14px;display:flex;align-items:center;gap:14px">
      <div style="position:relative;width:52px;height:52px;flex-shrink:0">
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(79,124,255,.15)" stroke-width="5"/>
          <circle cx="26" cy="26" r="22" fill="none" stroke="#4f7cff" stroke-width="5" stroke-dasharray="${Math.round(138.2*doneCnt/MISSIONS_PER_DAY)} 138.2" stroke-linecap="round" transform="rotate(-90 26 26)"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#e8eeff">${doneCnt}</div>
      </div>
      <div>
        <div style="font-size:16px;font-weight:800;color:#e8eeff">${doneCnt}/${MISSIONS_PER_DAY} Hoàn thành</div>
        <div style="font-size:12px;color:rgba(232,238,255,.45);margin-top:2px">+${earnedExp} / ${totalExp} EXP hôm nay</div>
      </div>
      ${doneCnt===MISSIONS_PER_DAY?`<div style="margin-left:auto;font-size:24px">🎊</div>`:''}
    </div>

    <!-- MISSIONS LIST -->
    <div style="margin:14px 16px 0;display:flex;flex-direction:column;gap:10px">
      ${state.missions.map((m,i) => {
        const pct2 = m.target > 1 ? Math.floor(m.progress/m.target*100) : (m.done?100:0);
        return `
        <div style="background:${m.done?'rgba(34,197,94,.06)':'rgba(255,255,255,.04)'};border:1px solid ${m.done?'rgba(34,197,94,.3)':'rgba(79,124,255,.12)'};border-radius:16px;padding:14px;transition:all .3s" id="msn-${i}">
          <div style="display:flex;align-items:flex-start;gap:12px">
            <div style="width:42px;height:42px;border-radius:13px;background:${m.done?'rgba(34,197,94,.2)':'rgba(79,124,255,.12)'};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${m.done?'✅':m.icon}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:14px;font-weight:800;color:${m.done?'rgba(232,238,255,.55)':'#e8eeff'};${m.done?'text-decoration:line-through':''}">${m.title}</div>
              <div style="font-size:12px;color:rgba(232,238,255,.4);margin-top:2px">${m.desc}</div>
              ${m.target > 1 && !m.done ? `
              <div style="margin-top:8px">
                <div style="background:rgba(255,255,255,.08);border-radius:99px;height:5px;overflow:hidden">
                  <div style="height:100%;width:${pct2}%;background:linear-gradient(90deg,#4f7cff,#7c3aed);border-radius:99px;transition:width .5s"></div>
                </div>
                <div style="font-size:10px;color:rgba(232,238,255,.35);margin-top:4px">${m.progress} / ${m.target}</div>
              </div>` : ''}
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div style="font-size:14px;font-weight:900;color:${m.done?'rgba(34,197,94,.6)':'#fbbf24'}">+${m.exp}</div>
              <div style="font-size:10px;color:rgba(232,238,255,.35)">EXP</div>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- TIP -->
    <div style="margin:16px 16px 0;background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.2);border-radius:14px;padding:12px 14px;font-size:12px;color:rgba(251,191,36,.8)">
      💡 Mẹo: Nhiệm vụ tự động cập nhật khi bạn xem phim, nghe nhạc, thêm yêu thích…
    </div>

    ${renderFooter()}
  </div>`;
  setupNavScroll();
};

// ── Hex to RGB helper ──
function hexToRgb(hex){
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '79,124,255';
}

// ── Tổng số người dùng tin tưởng (fake counter với localStorage) ──
function getTrustCount(){
  // Simulate growing user base
  const base = 1247;
  const seed = Math.floor(Date.now() / (1000*60*60*24)); // thay đổi mỗi ngày
  return base + (seed % 200) + Math.floor(Math.random()*5);
}
window.DZI_TRUST_COUNT = getTrustCount();
