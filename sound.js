// =============================================================
// Sound preview ("Hear this space").
//
// Signal path (Web Audio API):
//   scene sources → master (scene level + 1.5 s fade-in)
//                 → userGain (volume slider 0–100, mute)
//                 → limiter (DynamicsCompressor) → speakers
//
// - Idea Lounge "cafe" plays a real recording: sounds/cafe.mp3
//   (fetch → decodeAudioData → AudioBufferSourceNode, loop = true,
//   gapless). It is loaded once and reused. If it can't be loaded
//   (no file, or index.html opened as a file so fetch is blocked),
//   a synthetic café plays instead.
// - quiet / talk / nature are synthetic (made in the browser).
// - Recordings live in sounds/, credits + license in sounds/CREDITS.md
//   (CC0 or public domain only). No background music.
// - Volume is saved in localStorage (try/catch → 30% if blocked).
// =============================================================

window.SpaceSound = (() => {
  let ctx = null;
  let master = null;    // scene level + fade-in / fade-out
  let userGain = null;  // the volume slider and mute
  let limiter = null;   // stops sudden loud peaks
  let nodes = [];       // running sources of the current scene
  let timers = [];      // scheduled random events of the current scene
  let current = null;
  const buffers = {};

  const SCENE_VOLUME = { quiet: 0.5, cafe: 0.9, cafeFile: 1.0, talk: 0.8, nature: 0.75 };
  const FADE_IN = 1.5;  // seconds
  const CAFE_URL = "sounds/cafe.mp3";

  // ---------- volume (0–100), saved; mute is for this visit only ----------
  const VOL_KEY = "studySpaceVolume";
  const DEFAULT_VOLUME = 30;
  let volume = DEFAULT_VOLUME;
  let muted = false;
  try {
    const v = parseInt(window.localStorage.getItem(VOL_KEY), 10);
    if (v >= 0 && v <= 100) volume = v;
  } catch (e) { /* storage blocked: start at 30% */ }
  // the ear hears loudness on a curve, so the slider is not linear
  const gainFor = () => (muted ? 0 : Math.pow(volume / 100, 1.5));

  function init() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0;
      userGain = ctx.createGain();
      userGain.gain.value = gainFor();
      limiter = ctx.createDynamicsCompressor();      // used as a limiter
      limiter.threshold.value = -10;  // dB
      limiter.knee.value = 0;
      limiter.ratio.value = 20;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.25;
      master.connect(userGain).connect(limiter).connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
  }

  // ---------- building blocks ----------
  function noiseBuffer(kind) {
    if (buffers[kind]) return buffers[kind];
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === "white") {
        d[i] = w;
      } else if (kind === "pink") {
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852;    b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522;    b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      } else { // brown
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      }
    }
    buffers[kind] = buf;
    return buf;
  }

  function noise(kind) {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuffer(kind);
    s.loop = true;
    s.start(0, Math.random() * 2); // random start point per voice
    nodes.push(s);
    return s;
  }

  function filter(type, freq, q = 0.7) {
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    return f;
  }

  function gain(v) {
    const g = ctx.createGain();
    g.gain.value = v;
    return g;
  }

  // slow wobble on any parameter (e.g. wind getting stronger/weaker)
  function wobble(param, rate, depth) {
    const o = ctx.createOscillator();
    const g = gain(depth);
    o.frequency.value = rate;
    o.connect(g);
    g.connect(param);
    o.start();
    nodes.push(o);
  }

  // call fn again and again at random intervals
  function every(minMs, maxMs, fn) {
    const tick = () => {
      if (!current) return;
      fn();
      timers.push(setTimeout(tick, minMs + Math.random() * (maxMs - minMs)));
    };
    timers.push(setTimeout(tick, Math.random() * minMs));
  }

  // a "voice" = band-passed noise whose loudness jumps like syllables
  function voice(centerFreq, level) {
    const g = gain(0);
    noise("white").connect(filter("bandpass", centerFreq, 1.4)).connect(g).connect(master);
    every(110, 300, () => {
      const speaking = Math.random() < 0.75;
      g.gain.setTargetAtTime(speaking ? level * (0.4 + Math.random() * 0.6) : 0, ctx.currentTime, 0.04);
    });
  }

  function clink() {
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = gain(0);
    o.type = "sine";
    o.frequency.value = 2200 + Math.random() * 1600;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + 0.55);
  }

  function chirp() {
    const t0 = ctx.currentTime;
    const notes = 2 + Math.floor(Math.random() * 4);
    const base = 2600 + Math.random() * 1400;
    for (let i = 0; i < notes; i++) {
      const t = t0 + i * (0.09 + Math.random() * 0.05);
      const o = ctx.createOscillator();
      const g = gain(0);
      o.type = "sine";
      o.frequency.setValueAtTime(base, t);
      o.frequency.exponentialRampToValueAtTime(base * (1.3 + Math.random() * 0.4), t + 0.07);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.035, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(g).connect(master);
      o.start(t); o.stop(t + 0.1);
    }
  }

  // ---------- scenes ----------
  const scenes = {
    // soft room tone, like a quiet library
    quiet() {
      noise("brown").connect(filter("lowpass", 300)).connect(gain(0.18)).connect(master);
    },
    // café (fallback when sounds/cafe.mp3 can't be loaded):
    // murmuring voices + cups, with only a little background noise (it sounded like wind)
    cafe() {
      noise("pink").connect(filter("lowpass", 600)).connect(gain(0.05)).connect(master);
      [420, 650, 900, 1250].forEach((f) => voice(f, 0.05));
      every(1500, 5000, clink);
    },
    // café recording, looped without a gap
    cafeFile(buf) {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const [a, b] = loopPoints(buf);
      src.loopStart = a;
      src.loopEnd = b;
      src.connect(master);
      src.start(0, a);
      nodes.push(src);
    },
    // group discussion: fewer, closer, louder voices
    talk() {
      noise("brown").connect(filter("lowpass", 400)).connect(gain(0.12)).connect(master);
      [380, 560, 820].forEach((f) => voice(f, 0.11));
    },
    // nature: wind that rises and falls + birds
    nature() {
      const windGain = gain(0.25);
      const windFilter = filter("lowpass", 700);
      noise("brown").connect(windFilter).connect(windGain).connect(master);
      wobble(windGain.gain, 0.12, 0.12);
      wobble(windFilter.frequency, 0.08, 300);
      every(1800, 6000, chirp);
    }
  };

  // ---------- the café recording: load once, reuse ----------
  let cafeLoad = null; // Promise<AudioBuffer | null>
  function loadCafe() {
    if (!cafeLoad) {
      cafeLoad = fetch(CAFE_URL)
        .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then((data) => new Promise((ok, fail) => ctx.decodeAudioData(data, ok, fail)))
        .catch(() => null); // → synthetic café
    }
    return cafeLoad;
  }
  // MP3 files can carry a few ms of silence at the start and end.
  // Loop only the part with sound, so the loop has no gap.
  function loopPoints(buf) {
    const ch = [...Array(buf.numberOfChannels)].map((_, i) => buf.getChannelData(i));
    const loud = (i) => ch.some((d) => Math.abs(d[i]) > 1e-4);
    const max = Math.min(buf.length, Math.floor(buf.sampleRate * 0.5)); // look at most 0.5 s in
    let a = 0, b = buf.length;
    while (a < max && !loud(a)) a++;
    while (b > buf.length - max && !loud(b - 1)) b--;
    return [a / buf.sampleRate, b / buf.sampleRate];
  }

  // ---------- public controls ----------
  // tell the page (buttons, sliders) that something changed
  function emit() {
    document.dispatchEvent(new CustomEvent("spacesound:change", { detail: { current, volume, muted } }));
  }

  function stop() {
    if (!ctx) return;
    const oldNodes = nodes;
    nodes = [];
    timers.forEach(clearTimeout);
    timers = [];
    const was = current;
    current = null;
    if (was) emit();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.06);
    setTimeout(() => oldNodes.forEach((n) => { try { n.stop(); n.disconnect(); } catch (e) {} }), 300);
  }

  function fadeIn(level) {
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(level, now + FADE_IN);
  }

  function play(sceneName) {
    init();
    stop();
    current = sceneName;
    emit();
    const ready = sceneName === "cafe" ? loadCafe() : Promise.resolve(null);
    // let the old scene fade out before the new one starts
    Promise.all([ready, new Promise((r) => setTimeout(r, 320))]).then(([buf]) => {
      if (current !== sceneName) return; // stopped or changed meanwhile
      if (buf) {
        scenes.cafeFile(buf);
        fadeIn(SCENE_VOLUME.cafeFile);
      } else {
        scenes[sceneName]();
        fadeIn(SCENE_VOLUME[sceneName] || 0.7);
      }
    });
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(100, Math.round(v)));
    muted = false; // moving the slider turns the sound back on
    try { window.localStorage.setItem(VOL_KEY, String(volume)); } catch (e) { /* not saved */ }
    if (userGain) userGain.gain.setTargetAtTime(gainFor(), ctx.currentTime, 0.05);
    emit();
  }
  function setMuted(on) {
    muted = !!on;
    if (userGain) userGain.gain.setTargetAtTime(gainFor(), ctx.currentTime, 0.05);
    emit();
  }

  // ---------- one-time tip ("Using earphones?") ----------
  const TIP_KEY = "studySpaceSoundTip";
  let tipShown = false;
  try { tipShown = window.localStorage.getItem(TIP_KEY) === "1"; } catch (e) {}
  function takeTip() { // true only the first time sound is turned on
    if (tipShown) return false;
    tipShown = true;
    try { window.localStorage.setItem(TIP_KEY, "1"); } catch (e) {}
    return true;
  }

  /**
   * Sound controls for a space: play/stop · mute · volume slider (0–100).
   * Used on the design card and in full screen 3D. Returns { el, destroy }.
   */
  function controls(sceneName) {
    const t = (...a) => window.I18N.t(...a);
    const ICON = window.Space3D.ICON;
    const el = document.createElement("div");
    el.className = "sound-ctl";
    el.innerHTML = `
      <button class="btn-link sound-play" data-act="sound" aria-pressed="false"></button>
      <div class="sound-vol">
        <button class="icon-btn sound-mute" aria-pressed="false"></button>
        <input class="sound-range" type="range" min="0" max="100" step="1">
        <span class="meta sound-val" aria-hidden="true"></span>
      </div>
      <p class="meta sound-tip" hidden>${t("earphoneTip")}</p>`;
    const $ = (s) => el.querySelector(s);

    function sync() {
      const on = current === sceneName;
      const p = $(".sound-play");
      p.setAttribute("aria-pressed", String(on));
      p.innerHTML = `${on ? ICON.soundOff : ICON.sound}<span>${on ? t("stopSound") : t("hearSpace")}</span>`;
      const m = $(".sound-mute");
      m.setAttribute("aria-pressed", String(muted));
      m.setAttribute("aria-label", muted ? t("unmute") : t("mute"));
      m.innerHTML = muted ? ICON.soundOff : ICON.sound;
      const r = $(".sound-range");
      if (document.activeElement !== r) r.value = volume;
      r.setAttribute("aria-label", t("volume"));
      r.setAttribute("aria-valuetext", muted ? `${volume}% (${t("mute")})` : `${volume}%`);
      r.style.setProperty("--fill", `${muted ? 0 : volume}%`);
      $(".sound-val").textContent = muted ? t("mute") : `${volume}%`;
    }

    $(".sound-play").addEventListener("click", () => {
      if (current === sceneName) { stop(); return; }
      if (takeTip()) $(".sound-tip").hidden = false;
      play(sceneName);
    });
    $(".sound-mute").addEventListener("click", () => setMuted(!muted));
    $(".sound-range").addEventListener("input", (e) => setVolume(e.target.value));
    document.addEventListener("spacesound:change", sync);
    document.addEventListener("lang:change", sync);
    sync();
    return {
      el,
      destroy() {
        document.removeEventListener("spacesound:change", sync);
        document.removeEventListener("lang:change", sync);
        el.remove();
      }
    };
  }

  return {
    play, stop, controls, setVolume, setMuted,
    isPlaying: (name) => current === name,
    get volume() { return volume; },
    get muted() { return muted; },
    // read-only numbers for the automatic tests (no effect on the page)
    debug: () => ({
      running: ctx ? ctx.state : "none",
      source: nodes.some((n) => n.buffer && n.loop && n.buffer.duration > 10) ? "file" : nodes.length ? "synth" : "none",
      master: master ? master.gain.value : 0,
      user: userGain ? userGain.gain.value : 0,
      limiter: limiter ? { threshold: limiter.threshold.value, ratio: limiter.ratio.value } : null
    }),
    loopPoints
  };
})();
