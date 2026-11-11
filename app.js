// =============================================================
// Page logic: question buttons → design card (3D view / floor plan) → lighting + sound.
// =============================================================

(() => {
  const designs = window.DESIGNS;
  const $ = (id) => document.getElementById(id);

  let selected = null;
  let lightsOn = true;

  const icons = {
    sound: `<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>`,
    light: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3z"/></svg>`
  };

  const citeLinks = (cites) =>
    cites.length
      ? cites.map((c) => `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`).join(" · ")
      : `<span class="todo">Source: our survey (coming soon)</span>`;

  const planSvg = (id) =>
    `<svg viewBox="0 0 320 230" role="img" aria-label="Floor plan of the ${id} space">${window.PLANS[id]}</svg>`;

  // ---------- lighting preview ----------
  function applyLighting() {
    const zone = selected && lightsOn ? selected.id : "none";
    if (document.body.dataset.zone === zone) return;
    document.body.classList.remove("switching");
    void document.body.offsetWidth; // restart the flicker animation
    document.body.classList.add("switching");
    document.body.dataset.zone = zone;
  }

  // ---------- 1. question buttons ----------
  function renderChoices() {
    $("choices").innerHTML = designs
      .map((d) => `
        <button class="choice" data-id="${d.id}" aria-pressed="false">
          <strong>${d.type}</strong>
          <span>${d.name}</span>
        </button>`)
      .join("");
    $("choices").addEventListener("click", (e) => {
      const btn = e.target.closest(".choice");
      if (btn) select(btn.dataset.id, true);
    });
  }

  // ---------- 2. design card ----------
  let viewer = null; // the 3D view inside the card (space3d.js)

  function renderCard(d) {
    const has3d = window.Space3D && window.Space3D.supports(d);
    $("card").innerHTML = `
      <div class="card-head">
        <div>
          <p class="card-type">Design for ${d.type}</p>
          <h2>${d.name}</h2>
          <p class="card-tagline">${d.tagline}</p>
        </div>
        <div class="controls">
          <button class="btn" id="soundBtn"></button>
          <button class="btn" id="lightBtn"></button>
        </div>
      </div>
      <div class="card-body">
        <figure class="plan-figure">
          ${has3d ? `
          <div class="view-tabs" role="group" aria-label="How to show the space">
            <button class="view-tab" data-view="3d">3D view</button>
            <button class="view-tab" data-view="plan">Floor plan</button>
          </div>` : ""}
          <div class="view-slot" id="viewSlot"></div>
          <figcaption class="plan-caption" id="planCaption"></figcaption>
        </figure>
        <ul class="elements">
          ${d.elements.map((el) => `
            <li class="element">
              <div class="element-key">${el.key}</div>
              <div class="element-value">${el.value}</div>
              <p class="element-reason">${el.reason}</p>
              <div class="element-cite">${citeLinks(el.cites)}</div>
            </li>`).join("")}
        </ul>
      </div>`;

    $("soundBtn").addEventListener("click", () => {
      if (window.SpaceSound.isPlaying(d.sound)) window.SpaceSound.stop();
      else window.SpaceSound.play(d.sound);
    });
    $("lightBtn").addEventListener("click", () => {
      lightsOn = !lightsOn;
      applyLighting();
      updateControls(d);
    });
    if (has3d) {
      $("card").querySelector(".view-tabs").addEventListener("click", (e) => {
        const b = e.target.closest(".view-tab");
        if (b) showView(d, b.dataset.view);
      });
    }
    updateControls(d);
    showView(d, has3d ? "3d" : "plan");
  }

  // 3D view or 2D floor plan in the card
  function showView(d, view) {
    if (viewer) { viewer.destroy(); viewer = null; }
    const slot = $("viewSlot");
    slot.innerHTML = "";
    document.querySelectorAll(".view-tab").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.view === view)));
    if (view === "3d") {
      viewer = window.Space3D.mount(slot, d);
      $("planCaption").textContent = `3D model · sound: ${d.soundLabel}`;
    } else {
      slot.innerHTML = `<div class="plan">${planSvg(d.id)}</div>`;
      $("planCaption").textContent = `Top-view layout · sound: ${d.soundLabel}`;
    }
  }

  // update the card buttons without rebuilding the card (keeps the 3D view as it is)
  function updateControls(d) {
    const sb = $("soundBtn"), lb = $("lightBtn");
    if (!sb || !lb) return;
    const playing = window.SpaceSound.isPlaying(d.sound);
    sb.setAttribute("aria-pressed", String(playing));
    sb.innerHTML = `${icons.sound} ${playing ? "Stop sound" : "Hear this space"}`;
    lb.setAttribute("aria-pressed", String(lightsOn));
    lb.innerHTML = `${icons.light} Lighting preview ${lightsOn ? "on" : "off"}`;
  }

  document.addEventListener("spacesound:change", () => {
    if (selected) updateControls(selected);
  });

  function select(id, scroll) {
    const d = designs.find((x) => x.id === id);
    if (!d) return;
    // switching rooms stops the previous room's sound
    if (selected && selected.id !== id) window.SpaceSound.stop();
    selected = d;

    document.querySelectorAll(".choice").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.id === id)));

    $("result").hidden = false;
    renderCard(d);
    applyLighting();
    if (scroll) $("result").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- 3. compare ----------
  function renderCompare() {
    $("compareGrid").innerHTML = designs
      .map((d) => `
        <button class="mini" data-zone="${d.id}" data-id="${d.id}">
          <span class="card-type">${d.type}</span>
          <h3>${d.name}</h3>
          <div class="plan">${planSvg(d.id)}</div>
          <dl>
            ${d.elements.map((el) => `<dt>${el.key}</dt><dd>${el.value}</dd>`).join("")}
          </dl>
        </button>`)
      .join("");
    $("compareGrid").addEventListener("click", (e) => {
      const btn = e.target.closest(".mini");
      if (btn) select(btn.dataset.id, true);
    });
  }

  // ---------- 5. research list ----------
  function renderResearch() {
    const seen = new Map();
    designs.forEach((d) => d.elements.forEach((el) => el.cites.forEach((c) => seen.set(c.label, c.url))));
    const k = window.KEY_FACT.cite;
    seen.set(k.label, k.url);
    $("researchList").innerHTML = [...seen.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${label}</a></li>`)
      .join("");
  }

  function renderFact() {
    const f = window.KEY_FACT;
    $("fact").innerHTML = `Why space matters: ${f.text} (<a href="${f.cite.url}" target="_blank" rel="noopener">${f.cite.label}</a>)`;
  }

  // Esc stops any sound
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") window.SpaceSound.stop(); // buttons update via "spacesound:change"
  });

  renderChoices();
  renderFact();
  renderCompare();
  renderResearch();
})();
