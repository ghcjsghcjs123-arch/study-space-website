// =============================================================
// Page logic: question buttons → design card (3D view / floor plan) → lighting + sound.
// Text: t("uiWord") for page words (i18n.js), tr({ en, ko }) for content (data.js).
// =============================================================

(() => {
  const designs = window.DESIGNS;
  const $ = (id) => document.getElementById(id);
  const t = (...a) => window.I18N.t(...a);
  const tr = (v) => window.I18N.tr(v);

  let selected = null;
  let lightsOn = true;
  let view = "3d"; // what the card shows: "3d" or "plan"

  const icons = {
    sound: `<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>`,
    light: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3z"/></svg>`
  };

  // study names and links are never translated
  const citeLinks = (cites) =>
    cites.length
      ? cites.map((c) => `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`).join(" · ")
      : `<span class="todo">${t("surveySoon")}</span>`;

  const planSvg = (d) => {
    const plan = window.PLANS[d.id];
    return `<svg viewBox="0 0 320 230" role="img" aria-label="${t("planAria", d.name)}">${typeof plan === "function" ? plan(tr) : plan}</svg>`;
  };

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
        <button class="choice" data-id="${d.id}" aria-pressed="${selected && selected.id === d.id}">
          <strong>${tr(d.type)}</strong>
          <span>${d.name}</span>
        </button>`)
      .join("");
  }
  $("choices").addEventListener("click", (e) => {
    const btn = e.target.closest(".choice");
    if (btn) select(btn.dataset.id, true);
  });

  // ---------- 2. design card ----------
  let viewer = null; // the 3D view inside the card (space3d.js)

  function renderCard(d) {
    const has3d = window.Space3D && window.Space3D.supports(d);
    $("card").innerHTML = `
      <div class="card-head">
        <div>
          <p class="card-type">${t("designFor", tr(d.type))}</p>
          <h2>${d.name}</h2>
          <p class="card-tagline">${tr(d.tagline)}</p>
        </div>
        <div class="controls">
          <button class="btn" id="soundBtn"></button>
          <button class="btn" id="lightBtn"></button>
        </div>
      </div>
      <div class="card-body">
        <figure class="plan-figure">
          ${has3d ? `
          <div class="view-tabs" role="group" aria-label="${t("viewTabs")}">
            <button class="view-tab" data-view="3d">${t("view3d")}</button>
            <button class="view-tab" data-view="plan">${t("viewPlan")}</button>
          </div>` : ""}
          <div class="view-slot" id="viewSlot"></div>
          <figcaption class="plan-caption" id="planCaption"></figcaption>
        </figure>
        <ul class="elements">
          ${d.elements.map((el) => `
            <li class="element">
              <div class="element-key">${tr(el.key)}</div>
              <div class="element-value">${tr(el.value)}</div>
              <p class="element-reason">${tr(el.reason)}</p>
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
    showView(d, has3d ? view : "plan");
  }

  // 3D view or 2D floor plan in the card
  function showView(d, next) {
    if (viewer) { viewer.destroy(); viewer = null; }
    view = next;
    const slot = $("viewSlot");
    slot.innerHTML = "";
    document.querySelectorAll(".view-tab").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.view === next)));
    if (next === "3d") {
      viewer = window.Space3D.mount(slot, d);
      $("planCaption").textContent = t("caption3d", tr(d.soundLabel));
    } else {
      slot.innerHTML = `<div class="plan">${planSvg(d)}</div>`;
      $("planCaption").textContent = t("captionPlan", tr(d.soundLabel));
    }
  }

  // update the card buttons without rebuilding the card (keeps the 3D view as it is)
  function updateControls(d) {
    const sb = $("soundBtn"), lb = $("lightBtn");
    if (!sb || !lb) return;
    const playing = window.SpaceSound.isPlaying(d.sound);
    sb.setAttribute("aria-pressed", String(playing));
    sb.innerHTML = `${icons.sound} ${playing ? t("stopSound") : t("hearSpace")}`;
    lb.setAttribute("aria-pressed", String(lightsOn));
    lb.innerHTML = `${icons.light} ${t("lightingPreview", lightsOn)}`;
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
          <span class="card-type">${tr(d.type)}</span>
          <h3>${d.name}</h3>
          <div class="plan">${planSvg(d)}</div>
          <dl>
            ${d.elements.map((el) => `<dt>${tr(el.key)}</dt><dd>${tr(el.value)}</dd>`).join("")}
          </dl>
        </button>`)
      .join("");
  }
  $("compareGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".mini");
    if (btn) select(btn.dataset.id, true);
  });

  // ---------- 5. research list (study names are not translated) ----------
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
    $("fact").innerHTML = `${t("factPrefix")} ${tr(f.text)} (<a href="${f.cite.url}" target="_blank" rel="noopener">${f.cite.label}</a>)`;
  }

  // Esc stops any sound
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") window.SpaceSound.stop(); // buttons update via "spacesound:change"
  });

  // language switch (KO | EN): redraw every text, keep the open card as it is
  document.addEventListener("lang:change", () => {
    renderChoices();
    renderFact();
    renderCompare();
    if (selected) renderCard(selected);
  });

  renderChoices();
  renderFact();
  renderCompare();
  renderResearch();
})();
