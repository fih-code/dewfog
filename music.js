// dewfog background music: loops /dewfog.mp3 across the site, with an on/off switch.
// Browsers block sound until the visitor interacts with the page, so playback starts on the
// first click, tap or key press. The choice is remembered, and the track resumes roughly where
// it left off when moving between pages.
(function () {
  var SRC = '/dewfog.mp3', VOLUME = 0.55, PREF = 'dewfog-music', POS = 'dewfog-music-pos';
  var RESUME_WINDOW = 30 * 60 * 1000;   // only resume the saved position if it is recent

  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var enabled = load(PREF) !== 'off';
  var audio = new Audio(SRC);
  audio.loop = true; audio.preload = 'auto'; audio.volume = 0;
  try {
    var saved = JSON.parse(load(POS) || 'null');
    if (saved && Date.now() - saved.at < RESUME_WINDOW) audio.currentTime = saved.t;
  } catch (e) {}

  // ── switch ──────────────────────────────────────────────────────────────
  var css = document.createElement('style');
  css.textContent = [
    '.dewMusic { display: inline-flex; align-items: flex-end; gap: 2px; height: 14px; padding: 6px 4px; margin: 0;',
    '  background: none; border: none; cursor: pointer; pointer-events: auto; box-sizing: content-box; z-index: 8; }',
    '.dewMusic span { display: block; width: 2px; height: 3px; border-radius: 1px; background: rgba(159,232,219,.55);',
    '  transition: height .4s ease, background .3s ease; }',
    '.dewMusic:hover span, .dewMusic:focus-visible span { background: rgba(159,232,219,1); }',
    '.dewMusic:focus-visible { outline: 1px solid rgba(159,232,219,.5); outline-offset: 2px; }',
    '.dewMusic.playing span { background: rgba(159,232,219,.85); animation: dewMusicBar 1.1s ease-in-out infinite alternate; }',
    '.dewMusic.playing span:nth-child(2) { animation-duration: .8s; animation-delay: -.3s; }',
    '.dewMusic.playing span:nth-child(3) { animation-duration: 1.3s; animation-delay: -.6s; }',
    '.dewMusic.playing span:nth-child(4) { animation-duration: .95s; animation-delay: -.2s; }',
    '@keyframes dewMusicBar { from { height: 3px; } to { height: 14px; } }',
    '@media (prefers-reduced-motion: reduce) { .dewMusic.playing span { animation: none; height: 10px; } }',
    '.dewMusic.corner { position: fixed; top: calc(5% - 7px); right: 5%; }',
    '#dewNav .dewMusic { margin-left: auto; }',
    '#top-nav .dewMusic { margin-left: auto; }'
  ].join('\n');
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.className = 'dewMusic'; btn.type = 'button';
  btn.innerHTML = '<span></span><span></span><span></span><span></span>';

  var nav = document.getElementById('dewNav'), topNav = document.getElementById('top-nav');
  if (nav) nav.appendChild(btn);                                             // homepage top bar
  else if (topNav && getComputedStyle(topNav).position === 'sticky') topNav.appendChild(btn);   // references page
  else { btn.classList.add('corner'); document.body.appendChild(btn); }       // topic pages

  function render() {
    var playing = !audio.paused;
    btn.classList.toggle('playing', playing);
    btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    var label = enabled ? 'turn music off' : 'turn music on';
    btn.setAttribute('aria-label', label); btn.title = label;
  }

  // ── playback with short fades ───────────────────────────────────────────
  var fadeTimer = null;
  function fadeTo(target, ms, done) {
    clearInterval(fadeTimer);
    var start = audio.volume, t0 = performance.now();
    fadeTimer = setInterval(function () {
      var f = Math.min(1, (performance.now() - t0) / ms);
      audio.volume = start + (target - start) * f;
      if (f === 1) { clearInterval(fadeTimer); if (done) done(); }
    }, 30);
  }
  function play() {
    if (!enabled || document.hidden) return;
    var p = audio.play();
    if (p && p.then) p.then(function () { fadeTo(VOLUME, 1500); render(); }, function () { render(); });
  }
  function stop() { fadeTo(0, 400, function () { audio.pause(); render(); }); }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    enabled = !enabled;
    save(PREF, enabled ? 'on' : 'off');
    if (enabled) play(); else stop();
    render();
  });

  // start on the first interaction anywhere else on the page (clicks on the switch are handled above)
  function firstInteraction(e) {
    if (btn.contains(e.target)) return;
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) { removeEventListener(t, firstInteraction, true); });
    if (audio.paused) play();
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) { addEventListener(t, firstInteraction, true); });

  // pause while the tab is in the background; pick up again when it returns
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (!audio.paused) { audio.pause(); render(); } }
    else if (enabled && audio.currentTime > 0) play();
  });

  // remember the position so the next page continues the track
  function savePos() { if (audio.currentTime > 0) save(POS, JSON.stringify({ t: audio.currentTime, at: Date.now() })); }
  setInterval(function () { if (!audio.paused) savePos(); }, 1000);
  addEventListener('pagehide', savePos);

  render();
  play();   // works right away if the browser allows it; otherwise waits for the first interaction
}());
