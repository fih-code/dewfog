// dewfog background music: loops /dewfog.mp3 across the site, with an on/off switch.
//
// Browsers block sound until the visitor interacts with the page, so playback starts on the
// first click, tap or key press, and the on/off choice is remembered.
//
// A normal page load would cut the music, so while it is playing, clicking a link to another
// dewfog page turns the current page into a shell: its own content is cleared and the next page
// opens in a full-screen frame, while the audio keeps playing in the shell. The address bar,
// tab title and back/forward buttons follow the page inside the frame. Pages running inside the
// frame don't start their own audio; their switch controls the shell's player.
(function () {
  var SRC = '/dewfog.mp3', VOLUME = 0.4, PREF = 'dewfog-music', POS = 'dewfog-music-pos';
  var RESUME_WINDOW = 30 * 60 * 1000;   // only resume a saved position if it is recent

  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // ── switch (same look on every page) ────────────────────────────────────
  function makeSwitch(onClick) {
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
      '#dewNav .dewMusic, #top-nav .dewMusic { margin-left: auto; }'
    ].join('\n');
    document.head.appendChild(css);

    var btn = document.createElement('button');
    btn.className = 'dewMusic'; btn.type = 'button';
    for (var i = 0; i < 4; i++) btn.appendChild(document.createElement('span'));

    var nav = document.getElementById('dewNav'), topNav = document.getElementById('top-nav');
    if (nav) nav.appendChild(btn);                                                                // homepage top bar
    else if (topNav && getComputedStyle(topNav).position === 'sticky') topNav.appendChild(btn);  // references page
    else { btn.classList.add('corner'); document.body.appendChild(btn); }                        // topic pages

    btn.addEventListener('click', function (e) { e.stopPropagation(); onClick(); });
    return function render(enabled, playing) {
      btn.classList.toggle('playing', playing);
      btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      var label = enabled ? 'turn music off' : 'turn music on';
      btn.setAttribute('aria-label', label); btn.title = label;
    };
  }

  // calls fn on every click, tap or key press (except on the switch itself) until isDone() says the music started.
  // iOS only lets a page start sound from a completed gesture — click / touchend, not touchstart or pointerdown —
  // and a refused attempt must not stop us listening for the next one.
  function onGestureUntil(fn, isDone) {
    var types = ['click', 'touchend', 'pointerup', 'keydown'];
    function handler(e) {
      if (isDone()) { types.forEach(function (t) { removeEventListener(t, handler, true); }); return; }
      if (e.target.closest && e.target.closest('.dewMusic')) return;
      fn();
    }
    types.forEach(function (t) { addEventListener(t, handler, true); });
  }

  // ── page running inside the shell's frame: drive the shell's player ──────
  var shellPlayer = null;
  try { if (window.top !== window && window.top.dewMusic) shellPlayer = window.top.dewMusic; } catch (e) {}
  if (shellPlayer) {
    var renderInFrame = makeSwitch(function () { shellPlayer.toggle(); });
    var sync = function () { renderInFrame(shellPlayer.enabled(), shellPlayer.playing()); };
    shellPlayer.onchange = sync;    // only the current frame page listens
    sync();
    onGestureUntil(function () { shellPlayer.play(); }, function () { return shellPlayer.playing() || !shellPlayer.enabled(); });
    // a link to another site with no target would open inside the frame; send it to the whole tab
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (a && a.origin !== location.origin && !a.target) a.target = '_top';
    }, true);
    return;
  }

  // ── top-level page: owns the audio ───────────────────────────────────────
  var enabled = load(PREF) !== 'off';
  var audio = new Audio(SRC);
  audio.loop = true; audio.preload = 'auto'; audio.volume = 0;
  try {
    var saved = JSON.parse(load(POS) || 'null');
    if (saved && Date.now() - saved.at < RESUME_WINDOW) audio.currentTime = saved.t;
  } catch (e) {}

  var player = window.dewMusic = {
    enabled: function () { return enabled; },
    playing: function () { return !audio.paused; },
    play: play,
    toggle: function () {
      enabled = !enabled;
      save(PREF, enabled ? 'on' : 'off');
      if (enabled) play(); else stop();
      update();
    },
    onchange: null
  };
  var renderHere = makeSwitch(player.toggle);
  function update() {
    renderHere(enabled, !audio.paused);
    if (player.onchange) try { player.onchange(); } catch (e) { player.onchange = null; }
  }
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);

  // volume: iOS ignores audio.volume (media always plays at full volume), so there the sound is routed
  // through a Web Audio gain node, which iOS does let a page turn down
  var volumeLocked = (function () { var a = new Audio(); a.volume = 0.5; return a.volume !== 0.5; }());
  var ctx = null, gain = null;
  function ensureGain() {
    if (!volumeLocked || gain) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      ctx = new AC(); gain = ctx.createGain(); gain.gain.value = 0;
      ctx.createMediaElementSource(audio).connect(gain); gain.connect(ctx.destination);
    } catch (e) { ctx = null; gain = null; }
  }
  function getVol() { return gain ? gain.gain.value : audio.volume; }
  function setVol(v) { if (gain) gain.gain.value = v; else audio.volume = v; }

  // playback with short fades
  var fadeTimer = null;
  function fadeTo(target, ms, done) {
    clearInterval(fadeTimer);
    var start = getVol(), t0 = performance.now();
    fadeTimer = setInterval(function () {
      var f = Math.min(1, (performance.now() - t0) / ms);
      setVol(start + (target - start) * f);
      if (f === 1) { clearInterval(fadeTimer); if (done) done(); }
    }, 30);
  }
  function play() {
    if (!enabled || document.hidden || !audio.paused) return;
    // Safari: treat this as media playback, like a video, rather than as sound effects the mute switch silences
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    ensureGain();
    if (ctx && ctx.state !== 'running') ctx.resume().catch(function () {});
    var p = audio.play();
    if (p && p.then) p.then(function () { fadeTo(VOLUME, 1500); }, function () {});
  }
  function stop() { fadeTo(0, 400, function () { audio.pause(); }); }

  onGestureUntil(play, function () { return !audio.paused || !enabled; });

  // pause while the tab is in the background; pick up again when it returns
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) audio.pause();
    else if (enabled && audio.currentTime > 0) play();
  });

  // remember the position, for the next visit or a page opened without the shell
  function savePos() { if (audio.currentTime > 0) save(POS, JSON.stringify({ t: audio.currentTime, at: Date.now() })); }
  function startSaving() { return setInterval(function () { if (!audio.paused) savePos(); }, 1000); }
  startSaving();
  addEventListener('pagehide', savePos);

  // ── shell: keep this page (and the audio) alive, show the next pages in a frame ──
  var frame = null;
  function isInternalLink(e, a) {
    return a && !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey &&
      a.origin === location.origin && (!a.target || a.target === '_self') && !a.hasAttribute('download') &&
      !(a.pathname === location.pathname && a.hash);                  // same-page anchor: let it scroll
  }
  addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (frame || audio.paused || !isInternalLink(e, a)) return;
    e.preventDefault();
    enterShell(a.href);
  });

  function enterShell(url) {
    frame = document.createElement('iframe');
    frame.title = 'dewfog';
    frame.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;margin:0;padding:0;' +
      'background:#0b1316;z-index:2147483647;opacity:0;transition:opacity .25s ease;';
    frame.src = url;
    document.body.appendChild(frame);
    history.pushState({ dewShell: true }, '', url);
    var first = true;
    frame.addEventListener('load', function () {
      if (first) { first = false; clearPage(); }
      frame.style.opacity = '1';
      try {
        var w = frame.contentWindow;
        history.replaceState({ dewShell: true }, '', w.location.pathname + w.location.search + w.location.hash);
        document.title = w.document.title;
        w.focus();
      } catch (e) {}
    });
    // back/forward to the page the shell started on (or back again) loads it into the frame
    addEventListener('popstate', function () {
      try {
        if (frame.contentWindow.location.href !== location.href) frame.contentWindow.location.replace(location.href);
      } catch (e) {}
    });
  }

  // stop this page's own animations and timers and remove its content, keeping only the frame
  function clearPage() {
    window.requestAnimationFrame = function () { return 0; };        // animation loops stop rescheduling
    var last = setTimeout(function () {}, 0);
    for (var id = last; id > 0; id--) { clearTimeout(id); clearInterval(id); }
    if (!audio.paused) setVol(VOLUME);                                 // in case a fade was cut short
    startSaving();
    Array.prototype.slice.call(document.body.children).forEach(function (el) { if (el !== frame) el.remove(); });
    document.body.style.cssText += ';margin:0;overflow:hidden;background:#0b1316;';
  }

  update();
  play();   // works right away if the browser allows it; otherwise waits for the first interaction
}());
