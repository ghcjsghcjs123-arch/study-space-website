// =============================================================
// Floor plans (top view), drawn as SVG with thin black lines
// (style.css turns every shape into a 1.5px line, no fill).
//
// The plans use the SAME meters as the 3D rooms (space3d.js):
// rooms are 10 m × 8 m, x = left → right, y = back wall → front.
// p(x, y) turns meters into plan pixels, so a change in 3D should be
// copied here with the same numbers.
//
// Each plan is a function: L({ en, ko }) gives a label in the current language.
// =============================================================

(() => {
  // 10 m → 300 px, 8 m → 190 px, room starts at (10, 10)
  const X = (x) => +(10 + x * 30).toFixed(1);
  const Y = (y) => +(10 + y * 23.75).toFixed(1);
  const W = (w) => +(w * 30).toFixed(1);
  const H = (d) => +(d * 23.75).toFixed(1);
  const line = (attrs) => `stroke="currentColor" stroke-width="1.5" fill="none" ${attrs || ""}`;

  // walls; the front (bottom) has the entrance gap
  const room = (L, label) => `
    <path d="M135 200 H10 V10 H310 V200 H185" ${line('stroke-linejoin="round"')}/>
    <text x="310" y="222" text-anchor="end" class="plan-label">${L({ en: "entrance ↑", ko: "입구 ↑" })}</text>
    ${label ? `<text x="10" y="222" class="plan-label">${L(label)}</text>` : ""}`;  // room note: under the plan, left

  // a rectangle centered at (x, y) in meters
  const rect = (x, y, w, d, extra = "") =>
    `<rect x="${X(x - w / 2)}" y="${Y(y - d / 2)}" width="${W(w)}" height="${H(d)}" ${line(extra)}/>`;
  const circle = (x, y, rPx, extra = "") => `<circle cx="${X(x)}" cy="${Y(y)}" r="${rPx}" ${line(extra)}/>`;
  const text = (x, y, s, anchor = "middle") => `<text x="${X(x)}" y="${Y(y)}" text-anchor="${anchor}" class="plan-label">${s}</text>`;
  const plant = (x, y, s = 1) => circle(x, y, 7 * s) + circle(x, y, 3 * s);
  // a thick line along a wall (whiteboard wall, screen, window)
  const wallBack = (x0, x1, inset = 4) => `<line x1="${X(x0)}" y1="${10 + inset}" x2="${X(x1)}" y2="${10 + inset}" ${line()}/><line x1="${X(x0)}" y1="${10 + inset + 3}" x2="${X(x1)}" y2="${10 + inset + 3}" ${line()}/>`;
  const wallLeft = (y0, y1, inset = 4) => `<line x1="${10 + inset}" y1="${Y(y0)}" x2="${10 + inset}" y2="${Y(y1)}" ${line()}/><line x1="${10 + inset + 3}" y1="${Y(y0)}" x2="${10 + inset + 3}" y2="${Y(y1)}" ${line()}/>`;
  // chair around a table: small circle
  const seat = (x, y) => circle(x, y, 4);

  window.PLANS = {
    // ---------- Focus Room ----------
    memorization: (L) => {
      const desks = [];
      [2.4, 4.9].forEach((y) => [1.4, 3.1, 4.8, 6.5].forEach((x) => {
        desks.push(
          rect(x, y, 1.1, 0.6),                                    // desk
          `<line x1="${X(x - 0.55)}" y1="${Y(y - 0.3) - 2}" x2="${X(x + 0.55)}" y2="${Y(y - 0.3) - 2}" ${line()}/>`, // back divider
          rect(x + 0.3, y - 0.17, 0.16, 0.12),                      // charging panel (outlet + USB)
          seat(x, y + 0.62)
        );
      }));
      // 2 soundproof single rooms (door = gap at the front)
      const booth = (y) => `
        <path d="M${X(8.95 - 0.25)} ${Y(y + 0.8)} H${X(8.2)} V${Y(y - 0.8)} H${X(9.7)} V${Y(y + 0.8)} H${X(8.95 + 0.25)}" ${line()}/>
        <path d="M${X(8.95 - 0.25)} ${Y(y + 0.8)} L${X(8.95 - 0.25)} ${Y(y + 0.8) + 6}" ${line()}/>`;
      return `
        ${room(L, { en: "lower ceiling · 2.4 m", ko: "낮은 천장 · 2.4 m" })}
        ${desks.join("")}
        ${booth(2.6)}${booth(4.9)}
        ${rect(9.2, 0.22, 1.4, 0.36)}
        ${wallLeft(3.0, 4.4)}
        ${plant(0.6, 7.4)}
        ${text(9.85, 6.35, L({ en: "soundproof rooms", ko: "방음 학습실" }), "end")}
        ${text(4, 6.6, L({ en: "single desks · charging", ko: "1인 책상 · 충전" }))}`;
    },

    // ---------- Idea Lounge ----------
    idea: (L) => `
      ${room(L, { en: "high ceiling · 3.2 m", ko: "높은 천장 · 3.2 m" })}
      ${wallBack(1.0, 8.2)}
      ${text(4.6, 1.15, L({ en: "whiteboard wall", ko: "화이트보드 벽" }))}
      <ellipse cx="${X(5)}" cy="${Y(4.2)}" rx="${W(3.8)}" ry="${H(2.8)}" ${line('stroke-dasharray="5 5"')}/>
      ${text(5, 7.7, L({ en: "walking loop", ko: "걷는 동선" }))}
      ${circle(5, 4.2, 16)}
      ${rect(5, 2.6, 2.3, 0.9)}${rect(5, 2.25, 2.3, 0.2)}
      ${text(5, 1.95, L({ en: "sofa", ko: "소파" }))}
      ${rect(3.66, 4.98, 0.86, 0.82)}${rect(6.34, 4.98, 0.86, 0.82)}
      ${wallLeft(2.9, 5.5)}
      ${plant(0.6, 0.6)}${plant(9.4, 0.6)}${plant(0.6, 7.4)}${plant(9.4, 7.4)}
      ${circle(8.4, 0.8, 5)}`,

    // ---------- Team Studio ----------
    teamwork: (L) => {
      const tables = [[2.7, 2.6], [7.3, 2.6], [5, 5.6]].map(([tx, ty], t) => {
        let chairs = "";
        for (let i = 0; i < 5; i++) {
          const a = ((i / 5) * 360 + t * 36 + 90) * (Math.PI / 180);
          chairs += seat(tx + Math.cos(a) * 1.08, ty + Math.sin(a) * 1.08);
        }
        return circle(tx, ty, 16) + chairs;
      }).join("");
      const glass = 'stroke-dasharray="2 3"';
      return `
        ${room(L, { en: "3 group rooms", ko: "그룹 룸 3개" })}
        ${text(9.8, 4.62, L({ en: "low glass walls", ko: "낮은 유리벽" }), "end")}
        <line x1="${X(5)}" y1="${Y(0)}" x2="${X(5)}" y2="${Y(3.9)}" ${line(glass)}/>
        <line x1="${X(0.2)}" y1="${Y(4.15)}" x2="${X(3.9)}" y2="${Y(4.15)}" ${line(glass)}/>
        <line x1="${X(6.1)}" y1="${Y(4.15)}" x2="${X(9.8)}" y2="${Y(4.15)}" ${line(glass)}/>
        ${tables}
        ${wallBack(5.55, 9.15)}
        ${text(7.35, 1.2, L({ en: "whiteboard wall", ko: "화이트보드 벽" }))}
        ${wallLeft(4.65, 7.45)}
        ${text(0.7, 4.6, L({ en: "shared screen", ko: "공유 화면" }), "start")}
        <line x1="${X(8.62)}" y1="${Y(6.15)}" x2="${X(9.18)}" y2="${Y(4.65)}" ${line()}/>
        ${text(9.6, 6.75, L({ en: "movable board", ko: "이동식 보드" }), "end")}
        ${plant(0.6, 7.4)}${plant(9.4, 0.6)}`;
    },

    // ---------- Green Nook ----------
    comfort: (L) => `
      ${room(L, "")}
      ${wallLeft(0.2, 7.8)}
      <path d="M${10 + 8} ${Y(3.2)} L${10 + 20} ${Y(3.2)} M${10 + 8} ${Y(4.8)} L${10 + 20} ${Y(4.8)}" ${line()}/>
      ${text(0.95, 4.1, L({ en: "vent", ko: "환기창" }), "start")}
      ${text(0.95, 7.0, L({ en: "window wall · green view", ko: "창문 벽 · 초록 풍경" }), "start")}
      ${rect(5.2, 3.9, 4.6, 3.2)}
      ${rect(5.2, 0.75, 2.4, 0.9)}${rect(5.2, 0.39, 2.4, 0.2)}
      ${text(5.2, 1.75, L({ en: "sofa", ko: "소파" }))}
      ${circle(3.9, 4.6, 12)}${circle(5.4, 5.1, 12)}${circle(6.8, 4.4, 12)}
      ${text(5.4, 6.3, L({ en: "beanbags", ko: "빈백" }))}
      ${rect(9.2, 5.5, 0.36, 0.3)}
      ${text(9.0, 6.3, L({ en: "air purifier", ko: "공기청정기" }), "end")}
      ${rect(1.9, 0.12, 0.3, 0.12)}
      ${text(1.9, 0.75, L({ en: "thermostat", ko: "온도 조절" }))}
      ${circle(7.4, 0.75, 5)}
      ${plant(9.3, 0.7, 1.3)}${plant(9.3, 7.3, 1.3)}${plant(3.2, 0.6, 1.1)}${plant(8.6, 4, 1.1)}
      ${plant(0.7, 0.6, 0.7)}${plant(0.7, 7.4, 0.7)}${plant(8.8, 2.1, 0.7)}${plant(2.0, 7.4, 0.7)}${plant(6.6, 7.4, 0.7)}`
  };
})();
