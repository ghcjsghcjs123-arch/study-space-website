// =============================================================
// Floor plans (top view) for each design, drawn as SVG.
// Colors come from CSS: "currentColor" = line color,
// var(--accent) = highlight color of the current space.
// Replace with your own sketch image if you prefer:
//   PLANS.idea = '<img src="images/idea-sketch.png" alt="...">';
// =============================================================

(() => {
  const room = (label) => `
    <path d="M135 200 H10 V10 H310 V200 H185" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
    <text x="160" y="222" text-anchor="middle" class="plan-label">entrance</text>
    <text x="20" y="28" class="plan-label">${label}</text>`;

  const desk = (x, y) => `
    <rect x="${x}" y="${y}" width="34" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="${x}" y1="${y - 4}" x2="${x + 34}" y2="${y - 4}" stroke="var(--accent)" stroke-width="3"/>
    <circle cx="${x + 17}" cy="${y + 28}" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>`;

  const roundTable = (cx, cy) => {
    let chairs = "";
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      chairs += `<circle cx="${cx + Math.cos(a) * 30}" cy="${cy + Math.sin(a) * 30}" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
    }
    return `<circle cx="${cx}" cy="${cy}" r="19" fill="none" stroke="var(--accent)" stroke-width="2.5"/>${chairs}`;
  };

  const plant = (cx, cy, r = 9) => `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--accent)" opacity="0.35"/>
    <circle cx="${cx - r / 3}" cy="${cy - r / 3}" r="${r / 2}" fill="var(--accent)" opacity="0.6"/>`;

  window.PLANS = {
    memorization: `
      ${room("lower ceiling · 2.4 m")}
      ${[60, 125, 190, 255].map((x) => desk(x - 17, 55)).join("")}
      ${[60, 125, 190, 255].map((x) => desk(x - 17, 120)).join("")}
      <text x="300" y="192" text-anchor="end" class="plan-label">single desks with dividers</text>`,

    idea: `
      ${room("high ceiling · 3 m+")}
      <ellipse cx="160" cy="105" rx="115" ry="62" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 6"/>
      <text x="160" y="52" text-anchor="middle" class="plan-label">walking loop</text>
      <line x1="80" y1="14" x2="240" y2="14" stroke="var(--accent)" stroke-width="5"/>
      <text x="160" y="32" text-anchor="middle" class="plan-label">idea wall</text>
      ${[[125, 95], [195, 95], [160, 125]].map(([x, y]) => `<rect x="${x - 13}" y="${y - 11}" width="26" height="22" rx="9" fill="none" stroke="currentColor" stroke-width="1.5"/>`).join("")}
      <circle cx="160" cy="105" r="3" fill="currentColor"/>
      ${plant(30, 180)}${plant(290, 180)}`,

    teamwork: `
      ${room("movable furniture")}
      ${roundTable(80, 80)}${roundTable(160, 135)}${roundTable(240, 80)}
      <line x1="306" y1="60" x2="306" y2="150" stroke="var(--accent)" stroke-width="5"/>
      <text x="296" y="172" text-anchor="end" class="plan-label">shared screen</text>`,

    comfort: `
      ${room("")}
      <rect x="10" y="10" width="300" height="10" fill="var(--accent)" opacity="0.45"/>
      <text x="160" y="36" text-anchor="middle" class="plan-label">window wall · green view</text>
      <rect x="40" y="60" width="90" height="34" rx="12" fill="none" stroke="currentColor" stroke-width="1.8"/>
      <rect x="40" y="60" width="90" height="10" rx="5" fill="currentColor" opacity="0.15"/>
      <text x="85" y="110" text-anchor="middle" class="plan-label">sofa</text>
      ${[[200, 75], [255, 95], [215, 140]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="18" ry="15" fill="none" stroke="currentColor" stroke-width="1.8"/>`).join("")}
      <text x="235" y="172" text-anchor="middle" class="plan-label">beanbags</text>
      ${plant(30, 40)}${plant(290, 40)}${plant(30, 180, 11)}${plant(120, 160)}${plant(290, 180, 11)}`
  };
})();
