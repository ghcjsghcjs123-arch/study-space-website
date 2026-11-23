// =============================================================
// Pie charts for the survey screen (#/survey) — plain SVG, no library.
// Data: window.SURVEY.sections (data.js). Words: i18n.js (t / tr).
//
// - % inside a slice only when the slice is 7% or more.
// - single / likert: % = share of the people who answered.
// - multi: % in the circle = share of all selections;
//          % in the legend (brackets) = share of respondents who chose it.
// - Legend: most chosen first (likert keeps 1 → 5); 0-person options last.
// - A one-line summary under every chart title (computed, never typed).
// - Options with 0 people: not in the pie; gray in the legend
//   (single questions: left out of the legend too).
// - Colors live only inside the charts. The same option has the same
//   color in every chart (multi: by the section's `order`). Likert = one
//   blue from light (1) to dark (5); "No answer" is gray.
// =============================================================

window.SurveyCharts = (() => {
  const t = (...a) => window.I18N.t(...a);
  const tr = (v) => window.I18N.tr(v);

  // 8 calm colors (charts only — the rest of the site stays black and white)
  const PALETTE = ["#4c6a92", "#c17c5b", "#6e9a7b", "#c9a64a", "#8a6fa3", "#5e9aa6", "#b5687d", "#7d7a6e"];
  const LIKERT = { s1: "#d9e2ee", s2: "#afc1d8", s3: "#7f9cc0", s4: "#52739f", s5: "#2e4c77", none: "#cfcfcf" };
  const ZERO = "#d6d6d6";

  function colorOf(sec, id) {
    if (sec.kind === "likert") return LIKERT[id] || ZERO;
    const order = sec.order || Object.keys(sec.labels);
    return PALETTE[order.indexOf(id) % PALETTE.length];
  }
  // dark text on light slices, white on dark ones
  const inkOn = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#111111" : "#ffffff";
  };
  const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

  // one slice from angle a0 to a1 (radians, 0 = 12 o'clock)
  function slicePath(cx, cy, r, a0, a1) {
    const p = (a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
  }

  // one chart card: question → count line → pie → legend
  function card(sec, chart) {
    const multi = sec.kind === "multi";
    const all = chart.items.map((it) => ({ ...it, label: tr(sec.labels[it.id]), color: colorOf(sec, it.id) }));
    const total = all.reduce((s, it) => s + it.n, 0);                 // pie: answers (single) / selections (multi)
    const people = multi ? chart.respondents : total;                  // legend brackets: share of people
    const inPie = all.filter((it) => it.n > 0);
    // legend: most chosen first (0 people last); colors stay fixed per option.
    // Likert stays in scale order (1 → 5) so the scale reads naturally.
    const rank = (list) => (sec.kind === "likert" ? list
      : [...list].sort((x, y) => y.n - x.n || all.indexOf(x) - all.indexOf(y)));
    const inLegend = rank(sec.kind === "single" ? inPie : all);

    // slices
    const CX = 100, CY = 100, R = 92;
    let a = 0;
    const slices = inPie.map((it) => {
      const share = it.n / total;
      const a0 = a, a1 = a + share * Math.PI * 2;
      a = a1;
      const mid = (a0 + a1) / 2;
      return { ...it, share, a0, a1, mid, lx: CX + R * 0.62 * Math.sin(mid), ly: CY - R * 0.62 * Math.cos(mid) };
    });
    const summary = inLegend.map((it) => `${it.label} ${it.n} (${pct(it.n, people)}%)`).join(", ");
    const svg = `
      <svg viewBox="0 0 200 200" role="img" aria-label="${escapeAttr(`${tr(chart.q)} — ${summary}`)}">
        ${slices.map((s, i) => (slices.length === 1
          ? `<circle class="pie-slice" data-i="${i}" cx="${CX}" cy="${CY}" r="${R}" fill="${s.color}"/>`
          : `<path class="pie-slice" data-i="${i}" d="${slicePath(CX, CY, R, s.a0, s.a1)}" fill="${s.color}"/>`)).join("")}
        ${slices.map((s) => (s.share >= 0.07
          ? `<text class="pie-pct" x="${s.lx.toFixed(1)}" y="${s.ly.toFixed(1)}" fill="${inkOn(s.color)}" aria-hidden="true">${Math.round(s.share * 100)}%</text>`
          : "")).join("")}
      </svg>`;

    // a section with one chart whose question is already in the section title: don't repeat it
    const repeat = sec.charts.length === 1 && tr(sec.title).includes(tr(chart.q));
    const countLine = multi ? t("multiCount", chart.respondents, total) : t("respCount", total);
    const sumLine = summary1(sec, all, people);
    const space = chart.space && window.DESIGNS.find((d) => d.id === chart.space);
    const legend = inLegend.map((it) => {
      const i = slices.findIndex((s) => s.id === it.id);
      const nums = t("legendNums", it.n, pct(it.n, people));
      return it.n > 0
        ? `<li><button class="legend-item" data-i="${i}" aria-label="${escapeAttr(`${it.label}: ${tip(it, slices[i], multi, people)}`)}">
             <span class="sw" style="background:${it.color}" aria-hidden="true"></span>
             <span class="lg-name">${it.label}</span><span class="lg-num">${nums}</span></button></li>`
        : `<li class="legend-zero"><span class="legend-item">
             <span class="sw" style="background:${ZERO}" aria-hidden="true"></span>
             <span class="lg-name">${it.label}</span><span class="lg-num">${nums}</span></span></li>`;
    }).join("");

    const el = document.createElement("article");
    el.className = "chart-card";
    el.innerHTML = `
      ${repeat ? "" : `<h4 class="chart-q">${tr(chart.q)}${space ? ` <a class="chart-space" href="#/${space.id}">→ ${space.name}</a>` : ""}</h4>`}
      <p class="chart-sum">${sumLine}</p>
      <p class="meta">${countLine}</p>
      <div class="chart-pie">${svg}<div class="chart-tip" role="status" hidden></div></div>
      <ul class="chart-legend">${legend}</ul>`;
    wire(el, slices, multi, people);
    return el;
  }

  // one-line summary under the title
  //   single / multi: the most chosen option(s) with % of people (multi: of respondents)
  //   likert: share who rated 4 or 5
  function summary1(sec, all, people) {
    if (sec.kind === "likert") {
      const hi = all.filter((it) => it.id === "s4" || it.id === "s5").reduce((s, it) => s + it.n, 0);
      return t("sumLikert", pct(hi, people));
    }
    const max = Math.max(...all.map((it) => it.n));
    const top = all.filter((it) => it.n === max);
    return t("sumTop", top.map((it) => it.label).join(", "), pct(max, people), top.length > 1);
  }

  // tooltip text: name · people · %
  function tip(it, s, multi, people) {
    return multi ? t("tipMulti", it.n, pct(it.n, people), Math.round(s.share * 100)) : t("tipSingle", it.n, pct(it.n, people));
  }

  // hover / tap / keyboard: highlight one slice and show the tooltip
  function wire(el, slices, multi, people) {
    const tipEl = el.querySelector(".chart-tip");
    let active = -1;
    const set = (i) => {
      active = i;
      el.classList.toggle("is-focus", i >= 0);
      el.querySelectorAll("[data-i]").forEach((n) => n.classList.toggle("is-on", +n.dataset.i === i));
      if (i < 0) { tipEl.hidden = true; return; }
      const s = slices[i];
      tipEl.innerHTML = `<b>${s.label}</b><span>${tip(s, s, multi, people)}</span>`;
      // place the tooltip over the middle of the slice (in % of the pie box)
      const x = slices.length === 1 ? 50 : (100 + 92 * 0.55 * Math.sin(s.mid)) / 2;
      const y = slices.length === 1 ? 50 : (100 - 92 * 0.55 * Math.cos(s.mid)) / 2;
      tipEl.style.left = `${x}%`;
      tipEl.style.top = `${y}%`;
      tipEl.hidden = false;
      // keep the whole tooltip on the screen (phones: slices near the edge)
      const r = tipEl.getBoundingClientRect(), vw = document.documentElement.clientWidth, pad = 8;
      const dx = r.left < pad ? pad - r.left : r.right > vw - pad ? vw - pad - r.right : 0;
      if (dx) tipEl.style.left = `calc(${x}% + ${dx.toFixed(1)}px)`;
    };
    el.addEventListener("pointerover", (e) => {
      const n = e.target.closest("[data-i]");
      if (n && e.pointerType === "mouse") set(+n.dataset.i);
    });
    el.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") set(-1); });
    el.addEventListener("click", (e) => {                      // tap (phones) or click: toggle
      const n = e.target.closest("[data-i]");
      if (!n) return;
      set(active === +n.dataset.i ? -1 : +n.dataset.i);
    });
    el.addEventListener("focusin", (e) => { const n = e.target.closest("[data-i]"); if (n) set(+n.dataset.i); });
    el.addEventListener("focusout", () => set(-1));
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  // the whole survey screen: one block per section, chart cards in a grid
  function render(root) {
    const S = window.SURVEY;
    root.innerHTML = "";
    S.sections.forEach((sec) => {
      const block = document.createElement("section");
      block.className = "chart-section";
      block.innerHTML = `
        <h3 class="section-title">${tr(sec.title)}</h3>
        ${sec.note ? `<p class="meta">${tr(sec.note)}</p>` : ""}
        <div class="chart-grid"></div>
        ${sec.outro ? `<p class="section-outro">${tr(sec.outro)}</p>` : ""}`;
      const grid = block.querySelector(".chart-grid");
      sec.charts.forEach((c) => grid.appendChild(card(sec, c)));
      root.appendChild(block);
    });
  }

  return { render, PALETTE, LIKERT };
})();
