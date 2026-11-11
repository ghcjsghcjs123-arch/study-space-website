// =============================================================
// Sound preview — every sound is generated in the browser
// with the Web Audio API, so there are no audio files and
// no copyright issues. Volumes are a "feel", not real dB.
// =============================================================

window.SpaceSound = (() => {
  let ctx = null;
  let master = null;
  let nodes = [];   // running sources of the current scene
  let timers = [];  // scheduled random events of the current scene
  let current = null;
  const buffers = {};

  const SCENE_VOLUME = { quiet: 0.5, cafe: 0.9, talk: 0.8, nature: 0.75 };

  function init() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
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
    // café: background hum + murmuring voices + cups
    cafe() {
      noise("pink").connect(filter("lowpass", 900)).connect(gain(0.22)).connect(master);
      [420, 650, 900, 1250].forEach((f) => voice(f, 0.05));
      every(1500, 5000, clink);
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

  // ---------- public controls ----------
  // tell the page (buttons) that the sound changed
  function emit() {
    document.dispatchEvent(new CustomEvent("spacesound:change", { detail: { current } }));
  }

  function stop() {
    if (!ctx) return;
    const oldNodes = nodes;
    nodes = [];
    timers.forEach(clearTimeout);
    timers = [];
    current = null;
    emit();
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.06);
    setTimeout(() => oldNodes.forEach((n) => { try { n.stop(); n.disconnect(); } catch (e) {} }), 300);
  }

  function play(sceneName) {
    init();
    stop();
    current = sceneName;
    emit();
    // let the old scene fade before the new one starts
    setTimeout(() => {
      if (current !== sceneName) return;
      scenes[sceneName]();
      master.gain.setTargetAtTime(SCENE_VOLUME[sceneName] || 0.7, ctx.currentTime, 0.4);
    }, 320);
  }

  return { play, stop, isPlaying: (name) => current === name };
})();
