// =============================================================
// Page logic: chatbot (chat.js) → design card (3D view / floor plan) → full screen 3D.
// Each step has its own address (URL hash), so the browser / phone back button works:
//   #/            question screen
//   #/idea        design card of the Idea Lounge
//   #/idea/3d     the same card + full screen 3D
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

  // ---------- 1. chatbot (chat.js) ----------
  // Its "Open …" buttons go through the router like every other way to a card.
  window.Chat.mount($("chat"), { onOpen: (id) => openFromList(id) });

  // ---------- 2. design card ----------
  let viewer = null; // the 3D view inside the card (space3d.js)

  function renderCard(d) {
    const has3d = window.Space3D && window.Space3D.supports(d);
    $("card").innerHTML = `
      <button class="back-link" id="cardBack">${t("backToChoices")}</button>
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

    $("cardBack").addEventListener("click", back);
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
      viewer = window.Space3D.mount(slot, d, { onFullscreen: () => go({ id: d.id, full: true }) });
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

  // ---------- screens: question / card / full screen 3D ----------
  let current = { id: null, full: false };

  const ROUTE = /^#\/([a-z]*)(?:\/(3d))?\/?$/;
  // "#/idea/3d" → { id: "idea", full: true }. Not a screen address (e.g. "#compare") → null.
  function parse(hash) {
    if (!hash || hash === "#") return { id: null, full: false };
    const m = ROUTE.exec(hash);
    if (!m) return null;
    const d = designs.find((x) => x.id === m[1]);
    if (!d) return { id: null, full: false }; // unknown space → question screen
    return { id: d.id, full: !!m[2] && window.Space3D.supports(d) };
  }
  const address = (r) => (r.id ? `#/${r.id}${r.full ? "/3d" : ""}` : "#/");

  function setAddress(r, replace) {
    try {
      history[replace ? "replaceState" : "pushState"]({ inApp: true }, "", address(r));
    } catch (e) {
      // very old browsers / blocked history: fall back to plain hash links
      if (replace) location.replace(address(r)); else location.hash = address(r);
    }
  }

  // go to a screen (adds a step to the browser history unless replace)
  function go(r, { replace = false } = {}) {
    setAddress(r, replace);
    show(r, { scroll: true });
  }

  // one step back: question ← card ← full screen 3D
  function back() {
    if (history.state && history.state.inApp) history.back();
    else go(current.full ? { id: current.id, full: false } : { id: null, full: false }, { replace: true });
  }

  // from the question buttons or the compare cards
  function openFromList(id) {
    if (current.id === id) {
      $("result").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // card → another card replaces the step, so "back" always returns to the question
    go({ id, full: false }, { replace: !!current.id });
  }

  // draw the screen for route r
  function show(r, { scroll = false, instant = false } = {}) {
    if (address(r) === address(current) && (!r.id || selected)) return;
    const prev = current;
    current = r;
    window.SpaceSound.stop(); // a new screen starts quiet

    if (!r.full && window.Space3D.isFullscreen()) {
      window.Space3D.closeFullscreen();
      // back from full screen: make sure the card is on screen
      const top = $("result").getBoundingClientRect().top;
      if (r.id === (selected && selected.id) && (top < -40 || top > window.innerHeight * 0.5)) {
        $("result").scrollIntoView({ behavior: "auto", block: "start" });
      }
    }

    if (r.id !== (selected && selected.id)) {
      if (r.id) openCard(r.id);
      else closeCard();
      if (scroll) {
        const behavior = instant ? "auto" : "smooth";
        if (r.id) $("result").scrollIntoView({ behavior, block: "start" });
        else if (prev.id) {
          // back to the question screen: show the chat result if there is one
          const a = window.Chat.anchor();
          if (a) a.scrollIntoView({ behavior, block: "center" });
          else $("pick").scrollIntoView({ behavior, block: "start" });
        }
      }
    }

    if (r.full && !window.Space3D.isFullscreen()) {
      window.Space3D.openFullscreen(selected, { onBack: back });
    }
    applyLighting(); // lighting follows the screen (none on the question screen)
  }

  function openCard(id) {
    selected = designs.find((x) => x.id === id);
    $("result").hidden = false;
    renderCard(selected);
  }

  function closeCard() {
    if (viewer) { viewer.destroy(); viewer = null; }
    selected = null;
    view = "3d";
    $("result").hidden = true;
    $("card").innerHTML = "";
  }

  window.addEventListener("popstate", () => show(parse(location.hash) || { id: null, full: false }, { scroll: true }));
  // someone typed a new address by hand
  window.addEventListener("hashchange", () => {
    const r = parse(location.hash);
    if (r) show(r, { scroll: true });
  });

  // top-bar links (#pick, #compare, #research) only scroll; they don't change the screen address
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute("href").startsWith("#/")) return;
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // first visit: open the screen in the address (e.g. a shared link to #/teamwork/3d)
  // and build the steps behind it, so "back" still goes card → question.
  function start() {
    // we scroll to the right place ourselves; the browser's own "restore scroll"
    // would jump back to wherever the page was when that step was created
    try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}
    const r = parse(location.hash);
    if (!r) { show({ id: null, full: false }); return; } // old anchor like #compare: just show the page
    try {
      history.replaceState({ inApp: true }, "", "#/");
      if (r.id) history.pushState({ inApp: true }, "", address({ id: r.id, full: false }));
      if (r.full) history.pushState({ inApp: true }, "", address(r));
    } catch (e) { /* history not available: back buttons still work via replace */ }
    show(r, { scroll: true, instant: true });
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
    if (btn) openFromList(btn.dataset.id);
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
    renderFact();
    renderCompare();
    if (selected) renderCard(selected);
  });

  renderFact();
  renderCompare();
  renderResearch();
  start();
})();
