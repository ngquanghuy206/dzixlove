// ═══════════════════════════════════════════════════════
//  DZI MUSIC AUTH SYSTEM
// ═══════════════════════════════════════════════════════

// ── Global auth state ──
window.DZI_USER    = null;   // { username, email, avatar, role, joinDate }
window.DZI_TOKEN   = null;
window.DZI_ADMIN   = false;
let _rememberMe    = localStorage.getItem('dzi_remember') === '1';

// ── Restore session on load ──
(function restoreSession(){
  const store = _rememberMe ? localStorage : sessionStorage;
  const tok = store.getItem('dzi_token') || sessionStorage.getItem('dzi_token');
  const usr = store.getItem('dzi_user')  || sessionStorage.getItem('dzi_user');
  if(tok && usr){
    try {
      DZI_TOKEN = tok;
      DZI_USER  = JSON.parse(usr);
      DZI_ADMIN = DZI_USER.role === 'admin';
    } catch(e){ DZI_TOKEN = null; DZI_USER = null; }
  }
})();

// ── Show / hide auth screen ──
function showAuthScreen(){
  const auth = document.getElementById('dzi-auth-screen');
  const main = document.getElementById('app');
  if(auth) auth.style.display = 'flex';
  if(main) main.style.display = 'none';
  switchAuthTab('login');
}
function hideAuthScreen(){
  const auth = document.getElementById('dzi-auth-screen');
  const main = document.getElementById('app');
  if(auth) auth.style.display = 'none';
  if(main) main.style.display = '';
  // Update nav user button
  updateNavUser();
}

function updateNavUser(){
  const btn = document.getElementById('nav-user-btn');
  if(!btn) return;
  if(DZI_USER){
    const av = DZI_USER.avatar
      ? `<img src="${DZI_USER.avatar}" style="width:26px;height:26px;border-radius:50%;object-fit:cover">`
      : `<span style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#4f7cff,#7c3aed);display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:800">${(DZI_USER.username||'?')[0].toUpperCase()}</span>`;
    btn.innerHTML = `${av}<span style="font-size:12px;font-weight:700;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${DZI_USER.username}</span>`;
    btn.onclick = () => openAccountModal();
  } else {
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>Đăng nhập</span>`;
    btn.onclick = () => showAuthScreen();
  }
}

// ── Tab switching ──
function switchAuthTab(tab){
  const loginForm = document.getElementById('dzi-login-form');
  const regForm   = document.getElementById('dzi-register-form');
  const titleLogin= document.getElementById('dzi-title-login');
  const titleReg  = document.getElementById('dzi-title-register');
  const subLogin  = document.getElementById('dzi-sub-login');
  const subReg    = document.getElementById('dzi-sub-register');
  const tabLogin  = document.getElementById('dzi-tab-login');
  const tabReg    = document.getElementById('dzi-tab-reg');

  if(loginForm) loginForm.style.display  = tab==='login' ? 'flex' : 'none';
  if(regForm)   regForm.style.display    = tab==='register' ? 'flex' : 'none';
  if(titleLogin) titleLogin.style.display= tab==='login' ? '' : 'none';
  if(titleReg)   titleReg.style.display  = tab==='register' ? '' : 'none';
  if(subLogin)   subLogin.style.display  = tab==='login' ? '' : 'none';
  if(subReg)     subReg.style.display    = tab==='register' ? '' : 'none';
  if(tabLogin)   tabLogin.classList.toggle('active', tab==='login');
  if(tabReg)     tabReg.classList.toggle('active',   tab==='register');

  // Toggle bottom switch links
  const bottomLogin = document.getElementById('dzi-auth-bottom-login');
  const bottomReg   = document.getElementById('dzi-auth-bottom-reg');
  if(bottomLogin) bottomLogin.style.display = tab==='login' ? '' : 'none';
  if(bottomReg)   bottomReg.style.display   = tab==='register' ? '' : 'none';

  if(tab==='register'){
    const s1 = document.getElementById('dzi-reg-step1');
    const s2 = document.getElementById('dzi-reg-step2');
    if(s1) s1.style.display = 'block';
    if(s2) s2.style.display = 'none';
  }
}

// ── Toggle password visibility ──
window.dziTogglePw = function(inputId, btn){
  const inp = document.getElementById(inputId);
  if(!inp) return;
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.classList.toggle('active', show);
  const eye    = btn.querySelector('.eye-icon');
  const eyeOff = btn.querySelector('.eye-off-icon');
  if(eye)    eye.style.display    = show ? 'none' : '';
  if(eyeOff) eyeOff.style.display = show ? '' : 'none';
};

// ── Remember me ──
window.dziToggleRemember = function(){
  _rememberMe = !_rememberMe;
  localStorage.setItem('dzi_remember', _rememberMe ? '1' : '0');
  const el = document.getElementById('dzi-remember-check');
  if(el){ el.classList.toggle('checked', _rememberMe); el.textContent = _rememberMe ? '✓' : ''; }
};

// ── LOGIN ──
window.doLogin = async function(){
  const u   = document.getElementById('dzi-login-user').value.trim();
  const p   = document.getElementById('dzi-login-pass').value.trim();
  const err = document.getElementById('dzi-login-err');
  const btn = document.getElementById('dzi-login-btn');
  if(!u||!p){ showErr(err,'Vui lòng nhập đầy đủ thông tin'); return; }
  btn.disabled = true; btn.textContent = '⏳ Đang đăng nhập...'; err.style.display='none';
  try {
    let r;
    try {
      r = await fetch((window.API_BASE||'')+'/api/login',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({username:u, password:p})
      });
    } catch(netErr){
      throw new Error('Không kết nối được server. Kiểm tra lại mạng.');
    }
    let d;
    try { d = await r.json(); }
    catch(_){ throw new Error(r.ok ? 'Lỗi phản hồi server' : 'Sai tên đăng nhập hoặc mật khẩu'); }
    if(!r.ok) throw new Error(d.detail||'Sai tên đăng nhập hoặc mật khẩu');
    saveSession(d);
    hideAuthScreen();
    dziToast('✅ Chào mừng trở lại, '+DZI_USER.username+'!','#10b981');
  } catch(e){ showErr(err, e.message); }
  finally { btn.disabled=false; btn.textContent='🔐 Đăng nhập'; }
};

function saveSession(d){
  DZI_TOKEN = d.token;
  DZI_USER  = { username: d.username, email: d.email||'', avatar: d.avatar||'', role: (d.is_admin||d.role==='admin') ? 'admin' : (d.role||'user'), joinDate: d.joinDate||'' };
  DZI_ADMIN = DZI_USER.role === 'admin';
  const store = _rememberMe ? localStorage : sessionStorage;
  store.setItem('dzi_token', DZI_TOKEN);
  store.setItem('dzi_user',  JSON.stringify(DZI_USER));
}

// ── REGISTER ──
let _regOtpTimer = null;
function stopRegTimer(){ if(_regOtpTimer){ clearInterval(_regOtpTimer); _regOtpTimer=null; } }
function startRegTimer(){
  stopRegTimer();
  let rem = 300;
  const lbl = document.getElementById('dzi-reg-timer-val');
  const bar = document.getElementById('dzi-reg-bar-fill');
  function tick(){
    const m=Math.floor(rem/60), s=rem%60;
    if(lbl) lbl.textContent = m+':'+(s<10?'0':'')+s;
    if(bar)  bar.style.width = (rem/300*100)+'%';
    if(rem<=0){ stopRegTimer(); if(lbl){lbl.textContent='Hết hạn!';lbl.style.color='#ff5252';} return; }
    rem--;
  }
  tick(); _regOtpTimer = setInterval(tick, 1000);
}

window.doRegisterSendOtp = async function(){
  const u   = document.getElementById('dzi-reg-user').value.trim();
  const p   = document.getElementById('dzi-reg-pass').value.trim();
  const em  = document.getElementById('dzi-reg-email').value.trim();
  const err = document.getElementById('dzi-reg-err');
  const btn = document.getElementById('dzi-reg-btn');
  if(!u||!p||!em){ showErr(err,'Vui lòng nhập đầy đủ thông tin'); return; }
  if(u.length<6||p.length<6){ showErr(err,'Username & mật khẩu tối thiểu 6 ký tự'); return; }
  if(!em.toLowerCase().endsWith('@gmail.com')){ showErr(err,'Chỉ chấp nhận @gmail.com'); return; }
  btn.disabled=true; btn.textContent='⏳ Đang gửi OTP...'; err.style.display='none';
  try {
    const r = await fetch((window.API_BASE||'')+'/api/register/send-otp',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username:u, password:p, email:em})
    });
    let d; try { d = await r.json(); } catch(_) { throw new Error(r.ok ? 'Lỗi server' : 'Lỗi gửi OTP'); }
    if(!r.ok) throw new Error(d.detail||'Lỗi gửi OTP');
    document.getElementById('dzi-reg-step1').style.display = 'none';
    document.getElementById('dzi-reg-step2').style.display = 'flex';
    startRegTimer();
    dziToast('📨 OTP đã gửi về Gmail của bạn!','#4f7cff');
  } catch(e){ showErr(err, e.message); }
  finally { btn.disabled=false; btn.textContent='📧 Gửi mã OTP xác minh'; }
};

window.doRegisterVerify = async function(){
  const u   = document.getElementById('dzi-reg-user').value.trim();
  const p   = document.getElementById('dzi-reg-pass').value.trim();
  const em  = document.getElementById('dzi-reg-email').value.trim();
  const otp = document.getElementById('dzi-reg-otp').value.trim();
  const err = document.getElementById('dzi-reg-err');
  const btn = document.getElementById('dzi-reg-otp-btn');
  if(!otp||otp.length!==6){ showErr(err,'Nhập đủ 6 số OTP'); return; }
  btn.disabled=true; btn.textContent='⏳ Đang xác minh...'; err.style.display='none';
  try {
    const r = await fetch((window.API_BASE||'')+'/api/register',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username:u, password:p, email:em, otp})
    });
    let d; try { d = await r.json(); } catch(_) { throw new Error(r.ok ? 'Lỗi server' : 'Lỗi đăng ký'); }
    if(!r.ok) throw new Error(d.detail||'Lỗi đăng ký');
    stopRegTimer();
    dziToast('✅ Đăng ký thành công! Hãy đăng nhập.','#10b981');
    switchAuthTab('login');
  } catch(e){ showErr(err, e.message); }
  finally { btn.disabled=false; btn.textContent='✅ Xác minh & Đăng ký'; }
};

// ── FORGOT PASSWORD ──
let _forgotEmail='', _forgotOtp='';
let _forgotTimer = null;
function stopForgotTimer(){ if(_forgotTimer){ clearInterval(_forgotTimer); _forgotTimer=null; } }
function startForgotTimer(){
  stopForgotTimer();
  let rem=300;
  const lbl=document.getElementById('dzi-forgot-timer-val');
  const bar=document.getElementById('dzi-forgot-bar-fill');
  function tick(){
    const m=Math.floor(rem/60),s=rem%60;
    if(lbl) lbl.textContent=m+':'+(s<10?'0':'')+s;
    if(bar)  bar.style.width=(rem/300*100)+'%';
    if(rem<=0){stopForgotTimer();if(lbl){lbl.textContent='Hết hạn!';lbl.style.color='#ff5252';}return;}
    rem--;
  }
  tick(); _forgotTimer=setInterval(tick,1000);
}

window.openForgotModal = function(){
  _forgotEmail=''; _forgotOtp='';
  ['dzi-forgot-step1','dzi-forgot-step2','dzi-forgot-step3'].forEach((id,i)=>{
    const el=document.getElementById(id); if(el) el.style.display=i===0?'block':'none';
  });
  ['dzi-forgot-email','dzi-forgot-otp','dzi-forgot-newpw','dzi-forgot-confirmpw'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  ['dzi-forgot-err1','dzi-forgot-err2','dzi-forgot-err3'].forEach(id=>{
    const el=document.getElementById(id); if(el){el.textContent='';el.style.display='none';}
  });
  openDziModal('dzi-forgot-modal');
};

window.doForgotSend = async function(){
  const email = document.getElementById('dzi-forgot-email').value.trim();
  const err   = document.getElementById('dzi-forgot-err1');
  const btn   = document.getElementById('dzi-forgot-btn1');
  if(!email){ showErr(err,'Vui lòng nhập Gmail'); return; }
  if(!email.toLowerCase().endsWith('@gmail.com')){ showErr(err,'Chỉ chấp nhận @gmail.com'); return; }
  btn.disabled=true; btn.textContent='⏳ Đang gửi...'; err.style.display='none';
  try {
    const r=await fetch((window.API_BASE||'')+'/api/forgot-password',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email})
    });
    const d=await r.json(); if(!r.ok) throw new Error(d.detail||'Lỗi gửi OTP');
    _forgotEmail=email;
    document.getElementById('dzi-forgot-step1').style.display='none';
    document.getElementById('dzi-forgot-step2').style.display='block';
    startForgotTimer();
  } catch(e){ showErr(err,e.message); }
  finally { btn.disabled=false; btn.textContent='📧 Gửi mã OTP'; }
};

window.doVerifyForgotOtp = async function(){
  const otp = document.getElementById('dzi-forgot-otp').value.trim();
  const err = document.getElementById('dzi-forgot-err2');
  const btn = document.getElementById('dzi-forgot-btn2');
  if(!otp||otp.length!==6){ showErr(err,'OTP gồm 6 số'); return; }
  btn.disabled=true; btn.textContent='⏳...'; err.style.display='none';
  try {
    const r=await fetch((window.API_BASE||'')+'/api/verify-otp',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email:_forgotEmail,otp})
    });
    const d=await r.json(); if(!r.ok) throw new Error(d.detail||'OTP không đúng');
    _forgotOtp=otp; stopForgotTimer();
    document.getElementById('dzi-forgot-step2').style.display='none';
    document.getElementById('dzi-forgot-step3').style.display='block';
  } catch(e){ showErr(err,e.message); }
  finally { btn.disabled=false; btn.textContent='✅ Xác nhận OTP'; }
};

window.doResetPassword = async function(){
  const pw  = document.getElementById('dzi-forgot-newpw').value.trim();
  const pw2 = document.getElementById('dzi-forgot-confirmpw').value.trim();
  const err = document.getElementById('dzi-forgot-err3');
  const btn = document.getElementById('dzi-forgot-btn3');
  if(!pw||pw.length<6){ showErr(err,'Mật khẩu tối thiểu 6 ký tự'); return; }
  if(pw!==pw2){ showErr(err,'Mật khẩu không khớp'); return; }
  btn.disabled=true; btn.textContent='⏳...'; err.style.display='none';
  try {
    const r=await fetch((window.API_BASE||'')+'/api/reset-password',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email:_forgotEmail,otp:_forgotOtp,new_password:pw})
    });
    const d=await r.json(); if(!r.ok) throw new Error(d.detail||'Lỗi đặt lại');
    closeDziModal('dzi-forgot-modal');
    dziToast('✅ Đổi mật khẩu thành công! Hãy đăng nhập lại.','#10b981');
  } catch(e){ showErr(err,e.message); }
  finally { btn.disabled=false; btn.textContent='🔐 Đặt lại mật khẩu'; }
};

// ── LOGOUT ──
window.doLogout = function(){
  const tok = DZI_TOKEN;
  DZI_TOKEN=null; DZI_USER=null; DZI_ADMIN=false;
  ['dzi_token','dzi_user'].forEach(k=>{ localStorage.removeItem(k); sessionStorage.removeItem(k); });
  closeDziModal('dzi-account-modal');
  updateNavUser();
  dziToast('👋 Đã đăng xuất','#5a6a8a');
  if(tok) fetch((window.API_BASE||'')+'/api/logout',{method:'POST',headers:{'Authorization':'Bearer '+tok}}).catch(()=>{});
};

// ── ACCOUNT MODAL ──
window.openAccountModal = function(){
  if(!DZI_USER){ showAuthScreen(); return; }
  // Fill user info
  const el = id => document.getElementById(id);
  const letter = (DZI_USER.username||'?')[0].toUpperCase();
  const avCircle = el('dzi-av-circle');
  if(avCircle){
    if(DZI_USER.avatar){
      avCircle.innerHTML = `<img src="${DZI_USER.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
    } else {
      avCircle.innerHTML = `<span style="font-size:34px;font-weight:900;color:#fff">${letter}</span>`;
    }
  }
  if(el('dzi-acc-username'))    el('dzi-acc-username').textContent    = DZI_USER.username||'—';
  if(el('dzi-acc-email'))       el('dzi-acc-email').textContent       = DZI_USER.email||'—';
  if(el('dzi-acc-role'))        el('dzi-acc-role').textContent        = DZI_ADMIN?'👑 Admin':'Thành viên';
  if(el('dzi-acc-joindate'))    el('dzi-acc-joindate').textContent    = DZI_USER.joinDate||'—';
  if(el('dzi-acc-username-at')) el('dzi-acc-username-at').textContent = DZI_USER.username||'—';

  // ── Level & EXP ──
  if(window.initMissionState && window.calcLevelProgress) {
    const ms = initMissionState(DZI_USER.username);
    const { lv, pct, curExp, needExp } = calcLevelProgress(ms.totalExp);
    const color = getLvColor(lv);
    const title = getLvTitle(lv);
    const lvEl = el('dzi-acc-lv-wrap');
    if(lvEl) lvEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;padding:12px;background:rgba(${hexToRgb(color)},.08);border:1px solid rgba(${hexToRgb(color)},.2);border-radius:14px;margin-bottom:12px">
        <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,${color},rgba(${hexToRgb(color)},.4));display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff;flex-shrink:0;box-shadow:0 2px 12px rgba(${hexToRgb(color)},.4)">
          ${lv >= 30 ? '👑' : lv}
        </div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:800;color:${color}">${title} · Lv ${lv}</div>
          <div style="font-size:11px;color:rgba(232,238,255,.4);margin-bottom:6px">${ms.totalExp.toLocaleString()} EXP tổng</div>
          ${lv < 30 ? `
          <div style="background:rgba(255,255,255,.08);border-radius:99px;height:6px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${color},rgba(${hexToRgb(color)},.5));border-radius:99px"></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:4px">
            <span style="font-size:10px;color:rgba(232,238,255,.35)">${curExp.toLocaleString()} / ${needExp.toLocaleString()} EXP</span>
            <span style="font-size:10px;font-weight:700;color:${color}">${pct}% → Lv ${lv+1}</span>
          </div>` : `<div style="font-size:11px;color:${color};font-weight:700">🏆 Cấp độ tối đa!</div>`}
        </div>
        <button onclick="closeDziModal('dzi-account-modal');go('missions')" style="padding:6px 12px;background:rgba(${hexToRgb(color)},.15);border:1px solid rgba(${hexToRgb(color)},.3);border-radius:10px;color:${color};font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap">Nhiệm vụ →</button>
      </div>`;
  }

  // Clear pw fields
  ['dzi-acc-oldpw','dzi-acc-newpw','dzi-acc-newpw2'].forEach(id=>{ if(el(id)) el(id).value=''; });
  if(el('dzi-acc-pw-err')){ el('dzi-acc-pw-err').textContent=''; }
  openDziModal('dzi-account-modal');
  // Load stats from server
  loadAccountStats();
};

async function loadAccountStats(){
  if(!DZI_TOKEN) return;
  try {
    const r = await fetch((window.API_BASE||'')+'/api/user/profile',{headers:{'Authorization':'Bearer '+DZI_TOKEN}});
    if(!r.ok) return;
    const d = await r.json();
    const el = id => document.getElementById(id);
    if(el('dzi-acc-favcount'))   el('dzi-acc-favcount').textContent   = d.fav_count||'0';
    if(el('dzi-acc-watchcount')) el('dzi-acc-watchcount').textContent = d.watch_count||'0';
  } catch(e){}
}

window.handleAvatarChange = function(input){
  if(!input.files||!input.files[0]) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e){
    const src = e.target.result;
    const avCircle = document.getElementById('dzi-av-circle');
    if(avCircle) avCircle.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
    if(DZI_USER) DZI_USER.avatar = src;
    const store = _rememberMe ? localStorage : sessionStorage;
    store.setItem('dzi_user', JSON.stringify(DZI_USER));
    updateNavUser();
    fetch((window.API_BASE||'')+'/api/user/avatar',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+DZI_TOKEN},
      body:JSON.stringify({avatar:src})
    }).catch(()=>{});
    dziToast('✅ Đã cập nhật ảnh đại diện','#10b981');
  };
  reader.readAsDataURL(file);
};

window.doChangePw = async function(){
  const oldpw = document.getElementById('dzi-acc-oldpw').value.trim();
  const newpw = document.getElementById('dzi-acc-newpw').value.trim();
  const newpw2= document.getElementById('dzi-acc-newpw2').value.trim();
  const err   = document.getElementById('dzi-acc-pw-err');
  const btn   = document.getElementById('dzi-acc-pw-btn');
  if(!oldpw||!newpw||!newpw2){ err.textContent='Vui lòng nhập đầy đủ'; return; }
  if(newpw.length<6){ err.textContent='Mật khẩu mới tối thiểu 6 ký tự'; return; }
  if(newpw!==newpw2){ err.textContent='Mật khẩu xác nhận không khớp'; return; }
  btn.disabled=true; btn.textContent='⏳...'; err.textContent='';
  try {
    const r=await fetch((window.API_BASE||'')+'/api/user/change-password',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+DZI_TOKEN},
      body:JSON.stringify({old_password:oldpw,new_password:newpw})
    });
    const d=await r.json(); if(!r.ok) throw new Error(d.detail||'Lỗi đổi mật khẩu');
    dziToast('✅ Đã đổi mật khẩu thành công','#10b981');
    ['dzi-acc-oldpw','dzi-acc-newpw','dzi-acc-newpw2'].forEach(id=>{
      const el=document.getElementById(id); if(el) el.value='';
    });
  } catch(e){ err.textContent=e.message; }
  finally { btn.disabled=false; btn.textContent='Cập nhật mật khẩu'; }
};

// ── Modal helpers ──
window.openDziModal = function(id){
  const el = document.getElementById(id);
  if(el){ el.style.display='flex'; setTimeout(()=>el.classList.add('open'),10); }
};
window.closeDziModal = function(id){
  const el = document.getElementById(id);
  if(el){ el.classList.remove('open'); setTimeout(()=>el.style.display='none',250); }
};

// ── Toast ──
window.dziToast = function(msg, color){
  // reuse existing showToast if available
  if(window.showToast){ showToast(msg); return; }
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent=msg; t.style.display='flex'; t.style.color=color||'';
  clearTimeout(window._dziToastTimer);
  window._dziToastTimer=setTimeout(()=>{ t.style.display='none'; },2600);
};

// ── Error helper ──
function showErr(el, msg){
  if(!el) return;
  el.textContent = msg; el.style.display='block';
}

// ── Init: decide to show auth or app ──
document.addEventListener('DOMContentLoaded', function(){
  // Build nav user button if not exists
  updateNavUser();
  // Require login before accessing app
  if(!DZI_USER) showAuthScreen();
});

// ── ADMIN STATS MODAL ──
window.openAdminStatsModal = function(){
  if(!DZI_ADMIN){ dziToast('⛔ Chỉ admin mới được dùng chức năng này','#ef4444'); return; }
  const cur = window.DZI_TRUST_COUNT || 1247;
  const inp = document.getElementById('admin-trust-count');
  if(inp) inp.value = cur;
  const err = document.getElementById('dzi-admin-stats-err');
  if(err){ err.textContent=''; err.style.display='none'; }
  openDziModal('dzi-admin-stats-modal');
};

window.saveAdminStats = async function(){
  if(!DZI_ADMIN) return;
  const inp = document.getElementById('admin-trust-count');
  const err = document.getElementById('dzi-admin-stats-err');
  const val = parseInt(inp ? inp.value : '');
  if(isNaN(val)||val<0){ if(err){err.textContent='Vui lòng nhập số hợp lệ';err.style.display='block';} return; }
  // Save via API
  try {
    const r = await fetch((window.API_BASE||'')+'/api/admin/stats',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+DZI_TOKEN},
      body:JSON.stringify({trust_count: val})
    });
    if(r.ok){
      window.DZI_TRUST_COUNT = val;
      localStorage.setItem('dzi_trust_count', val);
      closeDziModal('dzi-admin-stats-modal');
      dziToast('✅ Đã cập nhật số liệu: '+val.toLocaleString()+' người dùng','#10b981');
      // Re-render home if on home page
      if(window.S && window.S.page==='home' && window.pgHome) pgHome();
    } else {
      // Save locally even if API fails
      window.DZI_TRUST_COUNT = val;
      localStorage.setItem('dzi_trust_count', val);
      closeDziModal('dzi-admin-stats-modal');
      dziToast('✅ Đã lưu số liệu: '+val.toLocaleString()+' người dùng','#10b981');
      if(window.S && window.S.page==='home' && window.pgHome) pgHome();
    }
  } catch(e){
    window.DZI_TRUST_COUNT = val;
    localStorage.setItem('dzi_trust_count', val);
    closeDziModal('dzi-admin-stats-modal');
    dziToast('✅ Đã lưu: '+val.toLocaleString()+' người dùng','#10b981');
    if(window.S && window.S.page==='home' && window.pgHome) pgHome();
  }
};

// Load saved trust count from localStorage on startup
(function loadTrustCount(){
  const saved = localStorage.getItem('dzi_trust_count');
  if(saved) window.DZI_TRUST_COUNT = parseInt(saved);
})();
