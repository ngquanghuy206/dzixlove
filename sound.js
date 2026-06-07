// ═══════════════════════════════════════
//  DZI SOUND SYSTEM — Web Audio API
//  Không cần file mp3, tất cả synthesized
// ═══════════════════════════════════════

(function(){
  let _ctx = null;
  let _enabled = localStorage.getItem('dzi_sound') !== 'off';

  function ctx(){
    if(!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    if(_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  }

  // ── Hàm nền tảng: phát 1 oscillator ──
  function playTone(freq, type, startVol, endVol, duration, startTime){
    if(!_enabled) return;
    try{
      const c = ctx();
      const t = startTime || c.currentTime;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain); gain.connect(c.destination);
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(startVol, t);
      gain.gain.exponentialRampToValueAtTime(endVol || 0.001, t + duration);
      osc.start(t); osc.stop(t + duration);
    } catch(e){}
  }

  function playNoise(duration, vol){
    if(!_enabled) return;
    try{
      const c = ctx();
      const buf = c.createBuffer(1, c.sampleRate * duration, c.sampleRate);
      const d = buf.getChannelData(0);
      for(let i=0;i<d.length;i++) d[i] = (Math.random()*2-1);
      const src = c.createBufferSource();
      const gain = c.createGain();
      const filter = c.createBiquadFilter();
      filter.type = 'bandpass'; filter.frequency.value = 1000; filter.Q.value = 0.5;
      src.buffer = buf;
      src.connect(filter); filter.connect(gain); gain.connect(c.destination);
      gain.gain.setValueAtTime(vol, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
      src.start(); src.stop(c.currentTime + duration);
    } catch(e){}
  }

  // ══════════════════════════════════════
  //  CÁC HIỆU ỨNG ÂM THANH
  // ══════════════════════════════════════

  // 🖱️ Click nút thông thường — soft tick
  window.sfxClick = function(){
    playTone(800, 'sine', 0.08, 0.001, 0.06);
  };

  // 🖱️ Click nhẹ hơn (menu item)
  window.sfxTap = function(){
    playTone(600, 'sine', 0.05, 0.001, 0.04);
  };

  // ✅ Hoàn thành nhiệm vụ — ascending chord
  window.sfxMissionDone = function(){
    const c = ctx(); if(!c) return;
    const t = c.currentTime;
    playTone(523, 'sine', 0.15, 0.001, 0.25, t);       // C5
    playTone(659, 'sine', 0.12, 0.001, 0.25, t+0.1);   // E5
    playTone(784, 'sine', 0.15, 0.001, 0.4,  t+0.2);   // G5
    playTone(1047,'sine', 0.18, 0.001, 0.5,  t+0.32);  // C6
    playNoise(0.08, 0.03);
  };

  // 🎉 Thăng cấp — fanfare
  window.sfxLevelUp = function(){
    const c = ctx(); if(!c) return;
    const t = c.currentTime;
    // Base chord
    playTone(261, 'sawtooth', 0.1, 0.001, 0.8, t);
    playTone(329, 'sawtooth', 0.08, 0.001, 0.8, t);
    playTone(392, 'sawtooth', 0.08, 0.001, 0.8, t);
    // Melody
    playTone(523, 'square', 0.12, 0.001, 0.15, t);
    playTone(659, 'square', 0.12, 0.001, 0.15, t+0.15);
    playTone(784, 'square', 0.12, 0.001, 0.15, t+0.3);
    playTone(1047,'square', 0.15, 0.001, 0.15, t+0.45);
    playTone(1318,'square', 0.15, 0.001, 0.15, t+0.6);
    playTone(1568,'square', 0.18, 0.001, 0.5,  t+0.75);
    // Shimmer
    setTimeout(()=> playNoise(0.1, 0.05), 750);
  };

  // 🔔 Toast / thông báo — soft ding
  window.sfxNotify = function(){
    const c = ctx(); if(!c) return;
    const t = c.currentTime;
    playTone(880, 'sine', 0.1, 0.001, 0.3, t);
    playTone(1108,'sine', 0.08, 0.001, 0.25, t+0.12);
  };

  // ❌ Lỗi / thất bại — descending
  window.sfxError = function(){
    const c = ctx(); if(!c) return;
    const t = c.currentTime;
    playTone(300, 'sawtooth', 0.12, 0.001, 0.2, t);
    playTone(220, 'sawtooth', 0.1, 0.001, 0.3, t+0.15);
  };

  // 💚 Đăng nhập thành công — welcoming
  window.sfxLogin = function(){
    const c = ctx(); if(!c) return;
    const t = c.currentTime;
    playTone(440, 'sine', 0.08, 0.001, 0.2, t);
    playTone(554, 'sine', 0.1, 0.001, 0.2, t+0.1);
    playTone(659, 'sine', 0.12, 0.001, 0.3, t+0.2);
    playTone(880, 'sine', 0.1, 0.001, 0.4, t+0.3);
  };

  // ❤️ Yêu thích — pop
  window.sfxFavorite = function(){
    const c = ctx(); if(!c) return;
    const t = c.currentTime;
    playTone(700, 'sine', 0.12, 0.001, 0.08, t);
    playTone(900, 'sine', 0.15, 0.001, 0.15, t+0.06);
    playTone(1200,'sine', 0.1, 0.001, 0.2, t+0.12);
  };

  // 🎬 Mở trang / navigate — whoosh
  window.sfxNav = function(){
    const c = ctx(); if(!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(500, t+0.12);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t+0.15);
    osc.start(t); osc.stop(t+0.15);
  };

  // 🔓 Mở modal — pop up
  window.sfxModalOpen = function(){
    const c = ctx(); if(!c) return;
    const t = c.currentTime;
    playTone(400, 'sine', 0.06, 0.001, 0.08, t);
    playTone(600, 'sine', 0.08, 0.001, 0.12, t+0.06);
  };

  // 📋 Copy / xong — double tick
  window.sfxDone = function(){
    const c = ctx(); if(!c) return;
    const t = c.currentTime;
    playTone(880, 'sine', 0.1, 0.001, 0.1, t);
    playTone(1108,'sine', 0.12, 0.001, 0.15, t+0.1);
  };

  // ══════════════════════════════════════
  //  TOGGLE BẬT/TẮT ÂM THANH
  // ══════════════════════════════════════
  window.sfxToggle = function(){
    _enabled = !_enabled;
    localStorage.setItem('dzi_sound', _enabled ? 'on' : 'off');
    if(_enabled) sfxClick();
    return _enabled;
  };

  window.sfxIsEnabled = function(){ return _enabled; };

  // ══════════════════════════════════════
  //  AUTO-HOOK: gắn vào các sự kiện hiện có
  // ══════════════════════════════════════
  document.addEventListener('click', function(e){
    if(!_enabled) return;
    const t = e.target;
    // Nút close sidebar
    if(t.classList.contains('sb-close') || t.classList.contains('hamburger')){
      sfxTap(); return;
    }
    // Nút trong sidebar
    if(t.closest('#sidebar') && (t.tagName==='A'||t.tagName==='BUTTON')){
      sfxTap(); return;
    }
    // Nút chính
    if(t.tagName==='BUTTON' && t.classList.contains('btn')){
      sfxClick(); return;
    }
    // Card click
    if(t.closest('.card') || t.closest('.intro-mission-card') || t.closest('.yt-card')){
      sfxTap(); return;
    }
  }, true);

  // Hook vào showToast
  const _origToast = window.showToast;
  if(typeof _origToast === 'function'){
    window.showToast = function(msg){
      _origToast(msg);
      if(!_enabled) return;
      if(msg && (msg.includes('✅') || msg.includes('hoàn thành'))) sfxMissionDone();
      else if(msg && (msg.includes('❌') || msg.includes('lỗi') || msg.includes('thất bại'))) sfxError();
      else sfxNotify();
    };
  }

  // Hook showLvUpEffect
  const _origLvUp = window.showLvUpEffect;
  if(typeof _origLvUp === 'function'){
    window.showLvUpEffect = function(lv){
      _origLvUp(lv);
      sfxLevelUp();
    };
  }

  console.log('[DZI Sound] ✅ Hệ thống âm thanh đã sẵn sàng. Trạng thái:', _enabled ? 'BẬT' : 'TẮT');
})();
