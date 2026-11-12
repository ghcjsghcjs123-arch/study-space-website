// =============================================================
// Page logic. One screen at a time, each with its own address (URL hash):
//   #/            chatbot (chat.js)        #/compare   all four designs
//   #/survey      survey                   #/research  one card per study
//   #/<id>        design card              #/<id>/3d   + full screen 3D
// The browser / phone back button goes to the previous screen.
// Text: t("uiWord") for page words (i18n.js), tr({ en, ko }) for content (data.js).
// =============================================================

(() => {
  const designs = window.DESIGNS;
  const $ = (id) => document.getElementById(id);
  const t = (...a) => window.I18N.t(...a);
  const tr = (v) => window.I18N.tr(v);

  let selected = null;
  let view = "3d"; // what the card shows: "3d" or "plan"

  const ICON = window.Space3D.ICON; // 1.5px line icons

  // study names and links are never translated
  const citeLinks = (cites) =>
    cites.length
      ? cites.map((c) => `<a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>`).join(" · ")
      : `<span class="todo">${t("surveySoon")}</span>`;

  const planSvg = (d) => {
    const plan = window.PLANS[d.id];
    return `<svg viewBox="0 0 320 230" role="img" aria-label="${t("planAria", d.name)}">${typeof plan === "function" ? plan(tr) : plan}</svg>`;
  };

  // ---------- 1. chatbot (chat.js) ----------
  // Its "Open …" buttons go through the router like every other way to a card.
  window.Chat.mount($("chat"), { onOpen: (id) => openFromList(id) });

  // ---------- 2. design card ----------
  let viewer = null; // the 3D view inside the card (space3d.js)

  function renderCard(d) {
    const has3d = window.Space3D && window.Space3D.supports(d);
    $("card").innerHTML = `
      <button class="btn-link card-back" id="cardBack">${t("back")}</button>
      <header class="card-head">
        <p class="meta">${t("designFor", tr(d.type))}</p>
        <h2 class="page-title">${d.name}</h2>
        <p class="lede">${tr(d.tagline)}</p>
        <button class="btn-link" id="soundBtn"></button>
      </header>
      <div class="card-body">
        <figure class="plan-figure">
          ${has3d ? `
          <div class="seg view-tabs" role="group" aria-label="${t("viewTabs")}">
            <button class="seg-btn view-tab" data-view="3d"><span>${t("view3d")}</span></button>
            <button class="seg-btn view-tab" data-view="plan"><span>${t("viewPlan")}</span></button>
          </div>` : ""}
          <div class="view-slot" id="viewSlot"></div>
          <figcaption class="meta plan-caption" id="planCaption"></figcaption>
        </figure>
        <ul class="elements">
          ${d.elements.map((el) => `
            <li class="element">
              <p class="meta element-key">${tr(el.key)}</p>
              <p class="element-value">${tr(el.value)}</p>
              <p class="element-reason">${tr(el.reason)}</p>
              <p class="element-cite">${citeLinks(el.cites)}</p>
            </li>`).join("")}
        </ul>
      </div>`;

    $("cardBack").addEventListener("click", back);
    $("soundBtn").addEventListener("click", () => {
      if (window.SpaceSound.isPlaying(d.sound)) window.SpaceSound.stop();
      else window.SpaceSound.play(d.sound);
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
      viewer = window.Space3D.mount(slot, d, { onFullscreen: () => go({ page: "card", id: d.id, full: true }) });
      $("planCaption").textContent = t("caption3d", tr(d.soundLabel));
    } else {
      slot.innerHTML = `<div class="plan">${planSvg(d)}</div>`;
      $("planCaption").textContent = t("captionPlan", tr(d.soundLabel));
    }
  }

  // update the card buttons without rebuilding the card (keeps the 3D view as it is)
  function updateControls(d) {
    const sb = $("soundBtn");
    if (!sb) return;
    const playing = window.SpaceSound.isPlaying(d.sound);
    sb.setAttribute("aria-pressed", String(playing));
    sb.innerHTML = `${playing ? ICON.soundOff : ICON.sound}<span>${playing ? t("stopSound") : t("hearSpace")}</span>`;
  }

  document.addEventListener("spacesound:change", () => {
    if (selected) updateControls(selected);
  });

  // ---------- screens and addresses (the router) ----------
  // A route is { page, id, full }: page = chat | compare | survey | research | card.
  const PAGES = ["compare", "survey", "research"]; // reserved words, never a space id
  const LEGACY = { "#top": "chat", "#pick": "chat", "#compare": "compare", "#survey": "survey", "#research": "research" };
  const CHAT_ROUTE = { page: "chat", id: null, full: false };
  let current = { page: null, id: null, full: false };

  const ROUTE = /^#\/([a-z]*)(?:\/(3d))?\/?$/;
  // "#/idea/3d" → card + full. "#/compare" → compare. Unknown → chat. Not an address → null.
  function parse(hash) {
    if (!hash || hash === "#") return CHAT_ROUTE;
    if (LEGACY[hash]) return { page: LEGACY[hash], id: null, full: false }; // old in-page links
    const m = ROUTE.exec(hash);
    if (!m) return null;
    if (PAGES.includes(m[1])) return { page: m[1], id: null, full: false };
    const d = designs.find((x) => x.id === m[1]);
    if (!d) return CHAT_ROUTE;
    return { page: "card", id: d.id, full: !!m[2] && window.Space3D.supports(d) };
  }
  function address(r) {
    if (r.page === "card") return `#/${r.id}${r.full ? "/3d" : ""}`;
    return r.page === "chat" ? "#/" : `#/${r.page}`;
  }
  const screenOf = (r) => (r.page === "card" ? `card:${r.id}` : r.page); // full screen is on top of its card

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
    if (address(r) === address(current)) return;
    setAddress(r, replace);
    show(r, { focus: true });
  }

  // one step back: to whatever screen came before (chat, compare, research…)
  function back() {
    if (history.state && history.state.inApp) history.back();
    else go(current.full ? { ...current, full: false } : CHAT_ROUTE, { replace: true });
  }

  // from the chatbot, the compare cards or the research cards
  function openFromList(id) {
    go({ page: "card", id, full: false });
  }

  // draw the screen for route r
  function show(r, { focus = false } = {}) {
    if (address(r) === address(current)) return;
    const prev = current;
    current = r;
    window.SpaceSound.stop(); // a new screen starts quiet

    if (!r.full && window.Space3D.isFullscreen()) window.Space3D.closeFullscreen();

    if (screenOf(r) !== screenOf(prev)) {
      if (r.page === "card") openCard(r.id);
      else if (selected) closeCard();
      document.querySelectorAll("[data-screen]").forEach((sec) => {
        sec.hidden = sec.dataset.screen !== r.page;
      });
      window.scrollTo(0, 0);
      // tell screen readers / keyboard users where they are now
      if (focus) {
        const h = document.querySelector(`[data-screen="${r.page}"] h1, [data-screen="${r.page}"] h2`);
        if (h) {
          if (!h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1");
          h.focus({ preventScroll: true });
        }
      }
    }
    markNav();

    if (r.full && !window.Space3D.isFullscreen()) {
      window.Space3D.openFullscreen(selected, { onBack: back });
    }
  }

  // top bar: the current screen gets aria-current="page" (card and 3D count as "Find your space")
  function markNav() {
    const here = current.page === "card" ? "chat" : current.page;
    document.querySelectorAll("[data-nav]").forEach((a) => {
      if (a.dataset.nav === here) {
        a.setAttribute("aria-current", "page");
        // narrow phones: the tab row scrolls sideways — keep the current tab visible
        const bar = a.parentElement;
        if (bar.scrollWidth > bar.clientWidth) bar.scrollLeft = a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2;
      } else a.removeAttribute("aria-current");
    });
  }

  function openCard(id) {
    if (viewer) { viewer.destroy(); viewer = null; }
    selected = designs.find((x) => x.id === id);
    renderCard(selected);
  }

  function closeCard() {
    if (viewer) { viewer.destroy(); viewer = null; }
    selected = null;
    view = "3d";
    $("card").innerHTML = "";
  }

  window.addEventListener("popstate", () => show(parse(location.hash) || CHAT_ROUTE));
  // someone typed a new address by hand
  window.addEventListener("hashchange", () => {
    const r = parse(location.hash);
    if (r) show(r);
  });

  // every in-page link (top bar, "See all four designs", brand) goes through the router
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button > 0) return; // let "open in new tab" work
    const r = parse(a.getAttribute("href"));
    if (!r) return;
    e.preventDefault();
    if (address(r) === address(current)) window.scrollTo({ top: 0, behavior: "smooth" });
    else go(r);
  });

  // first visit: open the screen in the address (e.g. a shared link to #/teamwork/3d)
  // and build the steps behind it, so "back" goes 3D → card → chat.
  function start() {
    // we scroll ourselves; the browser's own "restore scroll" would jump around
    try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}
    const r = parse(location.hash) || CHAT_ROUTE;
    try {
      history.replaceState({ inApp: true }, "", "#/");
      if (r.page !== "chat") history.pushState({ inApp: true }, "", address({ ...r, full: false }));
      if (r.full) history.pushState({ inApp: true }, "", address(r));
    } catch (e) { /* history not available: back buttons still work via replace */ }
    show(r);
  }

  // ---------- 3. compare ----------
  function renderCompare() {
    $("compareGrid").innerHTML = designs
      .map((d) => `
        <button class="mini" data-id="${d.id}">
          <span class="meta">${tr(d.type)}</span>
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

  // ---------- research screen: one card per study ----------
  // Study names, journals and links are never translated.
  function renderStudies() {
    let group = null;
    $("studies").innerHTML = window.STUDIES.map((st) => {
      // spaces whose design card cites this study (found automatically)
      const usedIn = designs.filter((d) => d.elements.some((el) => el.cites.includes(st)));
      const heading = st.group !== group ? `<h3 class="study-group">${tr(st.group)}</h3>` : "";
      group = st.group;
      const about = st.about ? tr(st.about) : null;
      return `${heading}
        <article class="study">
          <h4 class="study-name">${st.label}</h4>
          ${st.journal ? `<p class="meta study-journal">${st.journal}</p>` : ""}
          ${about ? `<ol class="study-about">${about.map((x) => `<li>${x}</li>`).join("")}</ol>` : ""}
          <div class="study-foot">
            ${usedIn.length ? `<div class="study-used"><span>${t("usedIn")}</span>
              ${usedIn.map((d) => `<a href="#/${d.id}">${d.name}</a>`).join("")}</div>` : ""}
            <a class="study-link" href="${st.url}" target="_blank" rel="noopener">${t("readOriginal")} ↗</a>
          </div>
        </article>`;
    }).join("");
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
    renderStudies();
    if (selected) renderCard(selected);
  });

  renderFact();
  renderCompare();
  renderStudies();
  start();
})();
