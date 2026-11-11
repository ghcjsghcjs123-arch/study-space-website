// =============================================================
// 3D room viewer — made only with CSS 3D transforms
// (perspective + transform-style: preserve-3d). No libraries,
// works offline by opening index.html.
//
// HOW TO ADD A ROOM (for example the Focus Room):
//   1. In data.js, give the design a `view3d` block
//      (ceiling heights, light presets, comparison sentences).
//   2. Below, add BUILDERS.memorization = (k) => { ... }
//      Start with k.room({ w, d }), then k.add(...) furniture.
//   That's it — the card shows the 3D view automatically.
//
// UNITS: every size is in meters. 1 m = 46 px (M below).
// AXES:  x = left → right, y = back wall → front, z = floor → up.
//        x/y of an object = the CENTER of its footprint,
//        z = its BOTTOM. The back wall is at y = 0, the left
//        wall at x = 0. The front and right sides stay open
//        (a "dollhouse") so you can look inside.
// =============================================================

window.Space3D = (() => {
  const M = 46; // 1 meter = 46 px

  // meters → CSS length. Strings (e.g. "var(--ceil)") pass through.
  const px = (v) => (typeof v === "number" ? `${Math.round(v * M * 100) / 100}px` : v);
  const plus = (a, b) =>
    typeof a === "number" && typeof b === "number" ? px(a + b) : `calc(${px(a)} + ${px(b)})`;

  const div = (cls) => {
    const e = document.createElement("div");
    e.className = cls;
    return e;
  };

  // look = a CSS background string, or an object of CSS styles
  function paint(e, look) {
    if (!look) return;
    if (typeof look === "string") e.style.background = look;
    else Object.assign(e.style, look);
  }

  // =============================================================
  // Building blocks
  // =============================================================

  // How dark each side of a box is (fake light from above-front).
  const SHADE = { up: 0, front: 0.1, right: 0.18, left: 0.26, back: 0.3, down: 0.42 };

  /**
   * plane — a flat rectangle (floor, wall, whiteboard, poster...).
   *   face: which way it looks.
   *     "up"    lies flat (w along x, h along y)
   *     "front" stands up, faces the front (like the back wall)
   *     "right" stands up, faces right (like the left wall)
   *     "back", "left", "down" — the other directions
   *   For standing planes: w = width along the wall, h = height.
   *   spin: extra turn inside its own surface (degrees), e.g. a tilted sticky note.
   */
  function plane({ face = "up", x = 0, y = 0, z = 0, w, h, look, cls = "", shade, spin = 0 }) {
    const e = div(`s3d-n s3d-face ${cls}`);
    e.style.width = px(w);
    e.style.height = px(h);
    const T = {
      up: () => `translate3d(${px(x - w / 2)}, ${px(y - h / 2)}, ${px(z)})`,
      down: () => `translate3d(${px(x - w / 2)}, ${px(y + h / 2)}, ${px(z)}) rotateX(180deg)`,
      front: () => `translate3d(${px(x - w / 2)}, ${px(y)}, ${plus(z, h)}) rotateX(-90deg)`,
      back: () => `translate3d(${px(x + w / 2)}, ${px(y)}, ${plus(z, h)}) rotateZ(180deg) rotateX(-90deg)`,
      right: () => `translate3d(${px(x)}, ${px(y + w / 2)}, ${plus(z, h)}) rotateZ(-90deg) rotateX(-90deg)`,
      left: () => `translate3d(${px(x)}, ${px(y - w / 2)}, ${plus(z, h)}) rotateZ(90deg) rotateX(-90deg)`
    };
    e.style.transform = T[face]() + (spin ? ` rotate(${spin}deg)` : "");
    e.style.setProperty("--shade", shade ?? SHADE[face]);
    paint(e, look);
    return e;
  }

  /**
   * group — moves and turns several parts together.
   *   rz: turn around the vertical axis (degrees).
   *   z may also be a CSS string, e.g. "var(--ceil)" to hang from the ceiling.
   */
  function group({ x = 0, y = 0, z = 0, rz = 0, children = [] } = {}) {
    const g = div("s3d-n");
    g.style.transform = `translate3d(${px(x)}, ${px(y)}, ${px(z)})` + (rz ? ` rotateZ(${rz}deg)` : "");
    children.flat().forEach((c) => c && g.appendChild(c));
    return g;
  }

  /**
   * box — a solid block for furniture. Each side gets a slightly
   * different brightness so it looks 3D.
   *   w = width (x), d = depth (y), h = height (z).
   *   top: optional different look for the top (e.g. a cushion).
   */
  function box({ x = 0, y = 0, z = 0, w, d, h, look, top, bottom = false }) {
    return group({
      x, y, z,
      children: [
        plane({ face: "up", z: h, w, h: d, look: top || look }),
        plane({ face: "front", y: d / 2, w, h, look }),
        plane({ face: "back", y: -d / 2, w, h, look }),
        plane({ face: "right", x: w / 2, w: d, h, look }),
        plane({ face: "left", x: -w / 2, w: d, h, look }),
        bottom && plane({ face: "down", w, h: d, look })
      ]
    });
  }

  /**
   * crossed — two standing planes crossed like a "+" seen from above.
   * Looks round from every side: plant leaves, lamp glow, thin poles.
   */
  function crossed({ x = 0, y = 0, z = 0, w, h, look, cls = "" }) {
    return group({
      x, y, z,
      children: [
        plane({ face: "front", w, h, look, cls, shade: 0 }),
        plane({ face: "right", w, h, look, cls, shade: 0 })
      ]
    });
  }

  // =============================================================
  // Furniture library (reusable in every room)
  // =============================================================
  const GLOW = "radial-gradient(circle, var(--glow) 0, transparent 68%)";

  // a soft pool of light on the floor (color follows the light setting)
  const pool = ({ x, y, r = 1 }) =>
    plane({ x, y, z: 0.04, w: r * 2, h: r * 2, shade: 0, look: `radial-gradient(circle, var(--pool) 0, transparent 70%)` });

  // lamp hanging from the ceiling; moves up/down with the ceiling
  const pendant = ({ x, y, drop = 0.7, color = "#c9924a" }) =>
    group({
      x, y, z: "var(--ceil)",
      children: [
        crossed({ z: -drop, w: 0.025, h: drop, look: "#1d1916" }),
        box({ z: -drop - 0.24, w: 0.44, d: 0.44, h: 0.24, look: color }),
        plane({ face: "down", z: -drop - 0.245, w: 0.38, h: 0.38, look: "var(--core)", shade: 0, cls: "s3d-round" }),
        crossed({ z: -drop - 0.24 - 0.5, w: 1, h: 1, look: GLOW })
      ]
    });

  const floorLamp = ({ x, y, h = 1.7 }) =>
    group({
      x, y,
      children: [
        plane({ z: 0.02, w: 0.42, h: 0.42, look: "#2a2420", cls: "s3d-round" }),
        crossed({ z: 0.02, w: 0.035, h: h - 0.36, look: "#2a2420" }),
        box({ z: h - 0.38, w: 0.46, d: 0.46, h: 0.38, look: "var(--core)" }),
        crossed({ z: h - 0.19 - 0.65, w: 1.3, h: 1.3, look: GLOW })
      ]
    });

  const LEAVES = [
    "radial-gradient(circle at 50% 30%, #63ad6c 0 20%, transparent 21%)",
    "radial-gradient(circle at 30% 50%, #3f8f4e 0 23%, transparent 24%)",
    "radial-gradient(circle at 70% 48%, #4c9c59 0 23%, transparent 24%)",
    "radial-gradient(circle at 50% 68%, #2f7a3e 0 27%, transparent 28%)"
  ].join(",");

  const plant = ({ x, y, s = 1 }) =>
    group({
      x, y,
      children: [
        box({ w: 0.42 * s, d: 0.42 * s, h: 0.42 * s, look: "#b8643c", top: "#4a3324" }),
        crossed({ z: 0.32 * s, w: 0.95 * s, h: 1.05 * s, look: LEAVES }),
        plane({ z: 0.85 * s, w: 0.8 * s, h: 0.8 * s, shade: 0, look: LEAVES }) // seen from above
      ]
    });

  // lounge chair with arms and a backrest; turns to face (tx, ty)
  function loungeChair({ x, y, color, faceTo }) {
    const rz = faceTo ? (Math.atan2(-(faceTo[0] - x), faceTo[1] - y) * 180) / Math.PI : 0;
    return group({
      x, y, rz,
      children: [
        box({ y: 0.08, w: 0.58, d: 0.66, h: 0.42, look: color }),                // seat
        box({ y: -0.33, w: 0.86, d: 0.16, h: 0.86, look: color }),               // backrest
        box({ x: -0.36, y: 0.08, w: 0.14, d: 0.66, h: 0.6, look: color }),       // arm
        box({ x: 0.36, y: 0.08, w: 0.14, d: 0.66, h: 0.6, look: color })         // arm
      ]
    });
  }

  const roundTable = ({ x, y, r = 0.55, h = 0.42, color = "#8a6446" }) =>
    group({
      x, y,
      children: [
        plane({ z: 0.01, w: 0.5, h: 0.5, look: "#3a2c22", cls: "s3d-round" }),
        box({ w: 0.16, d: 0.16, h: h - 0.05, look: "#3a2c22" }),
        plane({ z: h - 0.05, w: r * 2, h: r * 2, look: color, shade: 0.3, cls: "s3d-round" }),
        plane({ z: h, w: r * 2, h: r * 2, look: color, shade: 0, cls: "s3d-round" })
      ]
    });

  const LOOKS = {
    wood: [
      `repeating-linear-gradient(90deg, rgba(0,0,0,.14) 0 1px, transparent 1px ${px(0.2)})`,
      `repeating-linear-gradient(0deg, transparent 0 ${px(1.4)}, rgba(0,0,0,.08) ${px(1.4)} ${px(1.42)})`,
      `repeating-linear-gradient(90deg, #b27c4e 0 ${px(0.2)}, #a87348 ${px(0.2)} ${px(0.4)}, #b7835a ${px(0.4)} ${px(0.6)})`
    ].join(",")
  };

  // =============================================================
  // Light presets — used by data.js `view3d.light.*.preset`.
  //   filter: CSS filter on the whole 3D scene
  //   bg:     background behind the room
  //   glow:   lamp glow, pool: light on the floor, core: bulb color
  // Keep the same filter functions in the same order in every
  // preset, so the browser can fade smoothly between them.
  // =============================================================
  const LIGHTS = {
    dimWarm: {
      filter: "brightness(0.8) sepia(0.38) saturate(1.3) contrast(1.02)",
      bg: "#1c1411", glow: "rgba(255,158,64,0.62)", pool: "rgba(255,150,60,0.5)", core: "#ffc77a"
    },
    brightOffice: {
      filter: "brightness(1.07) sepia(0) saturate(0.82) contrast(1)",
      bg: "#dfe6ee", glow: "rgba(236,246,255,0.7)", pool: "rgba(255,255,255,0.45)", core: "#ffffff"
    }
  };

  // =============================================================
  // Rooms — one builder per design id
  // (memorization, idea, teamwork, comfort).
  // k = toolkit: k.room, k.add, k.label, + all the helpers above.
  // =============================================================
  const BUILDERS = {
    idea(k) {
      const W = 10, D = 8;
      const C = [5, 4.2]; // center of the lounge
      k.room({ w: W, d: D, floor: LOOKS.wood, wall: "#efe5d8" });

      // floor: round rug + walking loop
      k.add(k.plane({
        x: C[0], y: C[1], z: 0.02, w: 3.8, h: 3.8, shade: 0, cls: "s3d-round",
        look: "radial-gradient(circle, #c99d74 0 30%, #a9693f 30.5% 33%, #c99d74 33.5% 60%, #9c5d36 60.5% 64%, #c99d74 64.5%)"
      }));
      k.add(k.plane({
        x: C[0], y: C[1], z: 0.03, w: 7.6, h: 5.6, shade: 0, cls: "s3d-round",
        look: { border: `${px(0.08)} dashed #ff8a2a` }
      }));

      // back wall: whiteboard ("Idea wall") with 16 sticky notes
      k.add(k.plane({
        face: "front", x: 5, y: 0.02, z: 0.85, w: 4, h: 1.4, cls: "s3d-wall",
        look: { background: "#fbfbf8", border: `${px(0.06)} solid #9aa3ad` }
      }));
      const notes = ["#ffe066", "#ff8fab", "#7fd1ff", "#9be38a"];
      for (let i = 0; i < 16; i++) {
        const col = i % 4, row = Math.floor(i / 4);
        const jx = Math.sin(i * 12.9) * 0.12, jz = Math.cos(i * 7.3) * 0.05;
        k.add(k.plane({
          face: "front", x: 3.55 + col * 0.95 + jx, y: 0.04, z: 1.0 + row * 0.29 + jz,
          w: 0.26, h: 0.26, look: notes[(i + row) % 4], shade: 0.04, spin: Math.sin(i * 3.1) * 8, cls: "s3d-wall"
        }));
      }

      // left wall: window
      k.add(k.plane({
        face: "right", x: 0.02, y: 4.2, z: 0.9, w: 2.6, h: 1.3, cls: "s3d-wall",
        look: {
          border: `${px(0.08)} solid #f4efe8`,
          background:
            "linear-gradient(90deg, transparent calc(50% - 2px), #f4efe8 calc(50% - 2px) calc(50% + 2px), transparent calc(50% + 2px))," +
            "linear-gradient(180deg, #8fc6ec, #d6ecff 68%, #a9d29b 69%)"
        }
      }));

      // coffee table + 3 lounge chairs facing it, each with a pendant lamp
      k.add(k.roundTable({ x: C[0], y: C[1] }));
      const chairs = [
        { x: 5, y: 2.65, color: "#2a9d8f" },
        { x: 3.66, y: 4.98, color: "#e9c46a" },
        { x: 6.34, y: 4.98, color: "#e76f51" }
      ];
      chairs.forEach((c) => {
        k.add(k.pool({ x: c.x, y: c.y, r: 1.1 }));
        k.add(k.loungeChair({ ...c, faceTo: C }));
        k.add(k.pendant({ x: c.x, y: c.y }));
      });

      // floor lamp in the back corner, plants in all four corners
      k.add(k.pool({ x: 8.4, y: 0.8, r: 1.2 }));
      k.add(k.floorLamp({ x: 8.4, y: 0.8 }));
      [[0.6, 0.6], [9.4, 0.6], [0.6, 7.4], [9.4, 7.4]].forEach(([x, y]) => k.add(k.plant({ x, y })));

      // labels (always face the viewer)
      k.add(k.label("Idea wall", { x: 5, y: 0.05, z: 2.3, facing: [0, 1] }));
      k.add(k.label("Walking loop", { x: C[0], y: C[1] + 2.8, z: 0.05, place: "center" }));
      k.add(k.label("Lounge chairs", { x: 5, y: 2.65, z: 1.0 }));
    }
  };

  // =============================================================
  // Viewer
  // =============================================================
  const modes = {}; // per design id: { light: "ours"|"compare", ceiling: "ours"|"compare" }
  const viewers = new Set();
  const getModes = (id) => (modes[id] = modes[id] || { light: "ours", ceiling: "ours" });
  const supports = (d) => !!(d && BUILDERS[d.id] && d.view3d);
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const TILT = [18, 78];   // up/down limit (degrees; 0 = straight down)
  const ZOOM = [0.6, 2.6];
  const PERSPECTIVE = 1500;

  function mount(slot, design, { fullscreen = false } = {}) {
    const cfg = design.view3d;
    const m = getModes(design.id);

    const root = div(`s3d${fullscreen ? " s3d--full" : ""}`);
    root.innerHTML = `
      <div class="s3d-viewport" tabindex="0" role="img"
           aria-label="3D model of the ${design.name}. Drag to turn, scroll or pinch to zoom, or use the arrow keys.">
        <div class="s3d-stage"><div class="s3d-camera"><div class="s3d-n s3d-room"></div></div></div>
        <div class="s3d-labels" aria-hidden="true"></div>
        <p class="s3d-hint" aria-hidden="true">Drag to turn · scroll or pinch to zoom</p>
      </div>
      <div class="s3d-bar">
        <button class="s3d-btn" data-act="light" aria-pressed="false"><small>Light</small><b></b></button>
        <button class="s3d-btn" data-act="ceiling" aria-pressed="false"><small>Ceiling</small><b></b></button>
        ${fullscreen
          ? `<button class="s3d-btn s3d-btn--plain" data-act="sound" aria-pressed="false"><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span><b></b></button>`
          : `<button class="s3d-btn s3d-btn--plain" data-act="full"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg><b>Full screen</b></button>`}
      </div>
      <p class="s3d-note" aria-live="polite">Tap <b>Light</b> or <b>Ceiling</b> to compare our design with a different one.</p>`;
    slot.appendChild(root);

    const $ = (s) => root.querySelector(s);
    const vp = $(".s3d-viewport"), stage = $(".s3d-stage"), camera = $(".s3d-camera");
    const roomEl = $(".s3d-room"), labelLayer = $(".s3d-labels");

    // ---------- toolkit given to the room builder ----------
    const labels = [];
    const size = { w: 10, d: 8 };
    const add = (...els) => els.flat().forEach((e) => e && roomEl.appendChild(e));
    const kit = {
      M, px, plane, box, crossed, group, add, looks: LOOKS,
      pool, pendant, floorLamp, plant, loungeChair, roundTable,
      // floating name tag at a 3D point; it never turns with the room
      label(text, { x, y, z, place = "above", facing } = {}) {
        const a = div("s3d-n s3d-anchor");
        a.style.transform = `translate3d(${px(x)}, ${px(y)}, ${px(z)})`;
        const el = document.createElement("span");
        el.className = `s3d-label s3d-label--${place}`;
        labelLayer.appendChild(el);
        labels.push({ a, el, text, facing, place, last: "", w: 0, h: 0 });
        return a;
      },
      // floor slab + back wall + left wall + ceiling height marker
      room({ w, d, floor = LOOKS.wood, wall = "#ece3d6", wall2 }) {
        size.w = w; size.d = d;
        add(box({ x: w / 2, y: d / 2, z: -0.25, w, d, h: 0.25, look: "#5d4636", top: floor }));
        add(plane({ face: "front", x: w / 2, y: 0, w, h: "var(--ceil)", look: wall, cls: "s3d-wall s3d-wallface" }));
        add(plane({ face: "right", x: 0, y: d / 2, w: d, h: "var(--ceil)", look: wall2 || wall, cls: "s3d-wall s3d-wallface" }));
        const mark = "#3fc1e8";
        add(crossed({ x: 0.1, y: 0.1, w: 0.035, h: "var(--ceil)", look: mark }));
        add(crossed({ x: 0.1, y: 0.1, z: 0.01, w: 0.45, h: 0.035, look: mark }));
        add(group({ x: 0.1, y: 0.1, z: "var(--ceil)", children: [crossed({ z: -0.035, w: 0.45, h: 0.035, look: mark })] }));
        add(kit.label(() => `Ceiling ${currentCeiling().toFixed(1)} m`, { x: 0.1, y: 0.1, z: "var(--ceil)", place: "ceiling" }));
      }
    };
    BUILDERS[design.id](kit);
    const PIVOT_Z = 1.1; // the room turns around its center, 1.1 m above the floor
    roomEl.style.transform = `translate3d(${px(-size.w / 2)}, ${px(-size.d / 2)}, ${px(-PIVOT_Z)})`;

    const currentCeiling = () => {
      const v = parseFloat(getComputedStyle(root).getPropertyValue("--ceil"));
      return isNaN(v) ? cfg.ceiling[m.ceiling] : v / M;
    };

    // ---------- camera ----------
    const START = { yaw: 34, tilt: 58 };
    const cam = { yaw: START.yaw, tilt: START.tilt, zoom: 1 };
    let intro = reduceMotion() ? null : { from: START.yaw + 30, t0: performance.now(), ms: 2800 };
    if (intro) cam.yaw = intro.from;

    // Scale so the whole room fits, for the current tilt.
    // Width: the floor diagonal (so turning left/right never changes the size).
    // Height: floor depth seen at this tilt + wall height.
    const box2d = { w: 0, h: 0 };
    function fit() {
      const r = vp.getBoundingClientRect();
      box2d.w = r.width; box2d.h = r.height;
    }
    function fitScale() {
      const t = (cam.tilt * Math.PI) / 180;
      const diag = Math.hypot(size.w, size.d);
      const H = cfg.ceiling.ours > cfg.ceiling.compare ? cfg.ceiling.ours : cfg.ceiling.compare;
      const top = (diag / 2) * Math.cos(t) + (H - PIVOT_Z) * Math.sin(t);    // above the pivot
      const bottom = (diag / 2) * Math.cos(t) + (PIVOT_Z + 0.25) * Math.sin(t); // below (incl. floor slab)
      const s = Math.min(box2d.w / (diag * M * 1.06), (box2d.h - 40) / ((top + bottom) * M * 1.12));
      return { s: Math.max(s, 0.05), shift: ((top - bottom) / 2) * M * 1.06 + 12 };
    }

    function apply(now) {
      if (intro) {
        const p = Math.min(1, (now - intro.t0) / intro.ms);
        const ease = 1 - Math.pow(1 - p, 3);
        cam.yaw = intro.from + (START.yaw - intro.from) * ease;
        if (p >= 1) intro = null;
      }
      const f = fitScale();
      const s = f.s * cam.zoom;
      stage.style.perspective = `${PERSPECTIVE * s}px`;
      camera.style.transform =
        `translateY(${(f.shift * f.s).toFixed(1)}px) scale3d(${s}, ${s}, ${s}) rotateX(${cam.tilt}deg) rotateZ(${cam.yaw}deg)`;

      // place labels on top of their 3D anchor points
      const vr = vp.getBoundingClientRect();
      const yawR = (cam.yaw * Math.PI) / 180;
      labels.forEach((L) => {
        const txt = typeof L.text === "function" ? L.text() : L.text;
        if (txt !== L.last) {
          L.el.textContent = txt;
          L.last = txt;
          L.w = L.el.offsetWidth; L.h = L.el.offsetHeight;
        }
        const r = L.a.getBoundingClientRect();
        const x = r.left + r.width / 2 - vr.left;
        const y = r.top + r.height / 2 - vr.top;
        const facing = !L.facing || L.facing[0] * Math.sin(yawR) + L.facing[1] * Math.cos(yawR) > 0.05;
        const inside = x > 0 && y > 0 && x < vr.width && y < vr.height;
        // where the tag sits next to its point
        let lx = x - L.w / 2, ly = y - L.h / 2;
        if (L.place === "above") ly = y - L.h - 10;
        if (L.place === "ceiling") lx = x - 8 - L.w > 4 ? x - 8 - L.w : x + 8;
        L.box = { lx, ly, show: facing && inside };
      });

      // don't let tags cover each other: push a tag down below the one it hits
      const placed = [];
      labels
        .filter((L) => L.box.show)
        .sort((a, b) => a.box.ly - b.box.ly)
        .forEach((L) => {
          const b = L.box;
          b.lx = clamp(b.lx, 4, vr.width - L.w - 4);
          b.ly = clamp(b.ly, 4, vr.height - L.h - 4);
          for (const o of placed) {
            const hitX = b.lx < o.box.lx + o.w + 4 && o.box.lx < b.lx + L.w + 4;
            const hitY = b.ly < o.box.ly + o.h + 3 && o.box.ly < b.ly + L.h + 3;
            if (hitX && hitY) b.ly = o.box.ly + o.h + 3;
          }
          placed.push(L);
        });
      labels.forEach((L) => {
        L.el.style.transform = `translate(${L.box.lx.toFixed(1)}px, ${L.box.ly.toFixed(1)}px)`;
        L.el.classList.toggle("is-hidden", !L.box.show);
      });
    }

    // run the drawing loop only while something moves
    let raf = 0, busyUntil = 0, dragging = false;
    function frame(now) {
      raf = 0;
      apply(now);
      if (intro || dragging || now < busyUntil) raf = requestAnimationFrame(frame);
    }
    function kick(ms = 400) {
      busyUntil = Math.max(busyUntil, performance.now() + ms);
      if (!raf) raf = requestAnimationFrame(frame);
    }

    // ---------- light + ceiling ----------
    function applyModes() {
      const L = LIGHTS[cfg.light[m.light].preset];
      stage.style.filter = L.filter;
      root.style.setProperty("--bg", L.bg);
      root.style.setProperty("--glow", L.glow);
      root.style.setProperty("--pool", L.pool);
      root.style.setProperty("--core", L.core);
      root.style.setProperty("--ceil", px(cfg.ceiling[m.ceiling]));

      const lb = $('[data-act="light"]'), cb = $('[data-act="ceiling"]');
      lb.setAttribute("aria-pressed", String(m.light === "compare"));
      lb.querySelector("b").textContent = `${m.light === "ours" ? "Our design" : "Compare"}: ${cfg.light[m.light].name}`;
      cb.setAttribute("aria-pressed", String(m.ceiling === "compare"));
      cb.querySelector("b").textContent = `${m.ceiling === "ours" ? "Our design" : "Compare"}: ${cfg.ceiling[m.ceiling]} m`;
      kick(1400);
    }

    function showNote(kind) {
      const n = cfg.notes[kind];
      const note = $(".s3d-note");
      note.innerHTML = "";
      note.append(n[m[kind]] + " ");
      const src = document.createElement("span");
      src.className = "s3d-src";
      src.textContent = `(${n.source})`;
      note.append(src);
    }

    function toggle(kind) {
      m[kind] = m[kind] === "ours" ? "compare" : "ours";
      viewers.forEach((v) => v.id === design.id && v.sync());
      showNote(kind);
    }

    function syncSound() {
      const b = $('[data-act="sound"]');
      if (!b) return;
      const on = window.SpaceSound.isPlaying(design.sound);
      b.setAttribute("aria-pressed", String(on));
      b.querySelector("b").textContent = on ? "Stop sound" : "Hear this space";
    }

    root.querySelector(".s3d-bar").addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const act = b.dataset.act;
      if (act === "light" || act === "ceiling") toggle(act);
      else if (act === "full") openFullscreen(design);
      else if (act === "sound") {
        if (window.SpaceSound.isPlaying(design.sound)) window.SpaceSound.stop();
        else window.SpaceSound.play(design.sound);
      }
    });
    document.addEventListener("spacesound:change", syncSound);

    // ---------- drag to turn, wheel / pinch to zoom ----------
    const pts = new Map();
    let pinch = null;
    const gap = () => {
      const [a, b] = [...pts.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    const stopIntro = () => {
      intro = null;
      root.classList.add("is-touched");
    };

    vp.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button > 0) return;
      vp.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) pinch = { d: gap(), zoom: cam.zoom };
      dragging = true;
      stopIntro();
      vp.classList.add("is-dragging");
      kick();
    });
    vp.addEventListener("pointermove", (e) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      if (pts.size === 1) {
        cam.yaw -= (e.clientX - p.x) * 0.4;
        cam.tilt = clamp(cam.tilt - (e.clientY - p.y) * 0.3, TILT[0], TILT[1]);
      }
      p.x = e.clientX; p.y = e.clientY;
      if (pts.size === 2 && pinch) cam.zoom = clamp(pinch.zoom * (gap() / pinch.d), ZOOM[0], ZOOM[1]);
    });
    const up = (e) => {
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = null;
      if (!pts.size) {
        dragging = false;
        vp.classList.remove("is-dragging");
        kick();
      }
    };
    vp.addEventListener("pointerup", up);
    vp.addEventListener("pointercancel", up);
    vp.addEventListener("wheel", (e) => {
      e.preventDefault();
      stopIntro();
      cam.zoom = clamp(cam.zoom * Math.exp(-e.deltaY * 0.0015), ZOOM[0], ZOOM[1]);
      kick();
    }, { passive: false });
    vp.addEventListener("keydown", (e) => {
      const step = { ArrowLeft: [6, 0], ArrowRight: [-6, 0], ArrowUp: [0, -5], ArrowDown: [0, 5] }[e.key];
      if (step) {
        cam.yaw += step[0];
        cam.tilt = clamp(cam.tilt + step[1], TILT[0], TILT[1]);
      } else if (e.key === "+" || e.key === "=") cam.zoom = clamp(cam.zoom * 1.15, ZOOM[0], ZOOM[1]);
      else if (e.key === "-") cam.zoom = clamp(cam.zoom / 1.15, ZOOM[0], ZOOM[1]);
      else return;
      e.preventDefault();
      stopIntro();
      kick();
    });

    const ro = new ResizeObserver(() => { fit(); kick(); });
    ro.observe(vp);

    const viewer = {
      id: design.id,
      sync: applyModes,
      destroy() {
        cancelAnimationFrame(raf);
        ro.disconnect();
        document.removeEventListener("spacesound:change", syncSound);
        viewers.delete(viewer);
        root.remove();
      }
    };
    viewers.add(viewer);

    fit();
    applyModes();
    syncSound();
    kick();
    return viewer;
  }

  // ---------- full screen ----------
  let overlay = null;
  function openFullscreen(design) {
    if (overlay) return;
    const back = document.activeElement;
    overlay = div("s3d-overlay");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", `${design.name} in 3D`);
    overlay.innerHTML = `
      <div class="s3d-overlay-head">
        <div><p class="card-type">Design for ${design.type}</p><h2>${design.name}</h2></div>
        <button class="s3d-close" aria-label="Close 3D view">&times;</button>
      </div>
      <div class="s3d-overlay-body"></div>`;
    document.body.appendChild(overlay);
    document.body.classList.add("s3d-lock");
    const v = mount(overlay.querySelector(".s3d-overlay-body"), design, { fullscreen: true });

    const close = () => {
      document.removeEventListener("keydown", onKey, true);
      v.destroy();
      overlay.remove();
      overlay = null;
      document.body.classList.remove("s3d-lock");
      window.SpaceSound.stop(); // closing the 3D view also stops the sound
      if (back && back.focus) back.focus();
    };
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
    };
    document.addEventListener("keydown", onKey, true);
    overlay.querySelector(".s3d-close").addEventListener("click", close);
    overlay.querySelector(".s3d-close").focus();
  }

  return { M, supports, mount, openFullscreen, BUILDERS, LIGHTS };
})();
