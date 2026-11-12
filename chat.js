// =============================================================
// Chatbot on the first screen: two (or three) questions → which of OUR four
// designed spaces fits you now. (It shows our designs; it does not
// point to real Ajou rooms.)
//
// The conversation is kept as DATA, not HTML:
//   state = { type: study id | null, mood: mood id | null, pick: space id | "both" | null }
// and the whole chat is redrawn from it. That is why switching
// KO | EN mid-chat shows the same conversation in the new language,
// and why the chat is still there after visiting a card and coming back.
// Only "Start over" clears it (a page reload also starts fresh).
//
// Flow: Q1 study type → Q2 mood → if they point to different spaces,
// Q3 "Which place feels better right now?" (VIBES of both spaces + "Both
// feel about the same") → result.
// Texts: CHAT, MOODS and VIBES in data.js, chat words in i18n.js (UI).
// Rules A / P / E are in decide() below.
// =============================================================

window.Chat = (() => {
  const t = (...a) => window.I18N.t(...a);
  const tr = (v) => window.I18N.tr(v);
  const designs = () => window.DESIGNS;
  const nameOf = (id) => designs().find((d) => d.id === id).name;
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TYPING_MS = 600;

  /**
   * Which space fits? (pure function — easy to test)
   *   pick = answer to question 3: a space id, "both", or null (not answered yet)
   *   A. mood's space = study type's space → that space only (main + match). No question 3.
   *   P. question 3: one space picked      → that space only (picked[space])
   *   E. question 3: "both about the same" → main = study space, extra = mood's space (main + moodTip)
   * Returns { rule, main, extra, lines: [{ en, ko }, ...] },
   * or null while question 3 still has to be answered.
   */
  function decide(typeId, moodId, pick = null) {
    const C = window.CHAT;
    const moodSpace = window.MOODS.find((m) => m.id === moodId).space;
    if (moodSpace === typeId) {
      return { rule: "A", main: typeId, extra: null, lines: [C.main[typeId], C.match] };
    }
    if (!pick) return null; // ask question 3 first
    if (pick === "both") {
      return { rule: "E", main: typeId, extra: moodSpace, lines: [C.main[typeId], C.moodTip[moodId]] };
    }
    return { rule: "P", main: pick, extra: null, lines: [C.picked[pick]] };
  }

  // the two spaces question 3 asks about (null when they are the same)
  function splitSpaces() {
    const moodSpace = window.MOODS.find((m) => m.id === state.mood).space;
    return moodSpace === state.type ? null : [state.type, moodSpace];
  }

  // the bot's small icon: Ajou University logo (images/ajou-logo.png).
  // Decorative only (alt=""), the messages themselves are read out.
  const BOT_ICON = `<img src="images/ajou-logo.png" alt="" width="32" height="32" decoding="async">`;

  let state = { type: null, mood: null, pick: null };
  let root, log, options, actions;
  let shown = 0;   // how many messages are already on screen
  let run = 0;     // cancels an animation that is still typing
  let onOpen = () => {};

  // the whole conversation, built from state
  function script() {
    const msgs = [
      { who: "bot", text: t("chatHello") },
      { who: "bot", text: t("question") }
    ];
    if (!state.type) return { msgs, ask: "type" };
    msgs.push({ who: "user", text: tr(designs().find((d) => d.id === state.type).type) });
    msgs.push({ who: "bot", text: t("chatMood") });
    if (!state.mood) return { msgs, ask: "mood" };
    msgs.push({ who: "user", text: tr(window.MOODS.find((m) => m.id === state.mood).label) });
    if (splitSpaces()) {
      msgs.push({ who: "bot", text: t("chatSplit") });
      msgs.push({ who: "bot", text: t("chatPlace") });
      if (!state.pick) return { msgs, ask: "pick" };
      msgs.push({ who: "user", text: state.pick === "both" ? t("chatBoth") : tr(window.VIBES[state.pick]) });
    }
    msgs.push({ who: "bot", result: decide(state.type, state.mood, state.pick) });
    return { msgs, ask: null };
  }

  function bubble(msg) {
    const row = document.createElement("div");
    row.className = `chat-row chat-row--${msg.who}`;
    if (msg.who === "bot") row.innerHTML = `<span class="chat-avatar">${BOT_ICON}</span>`;
    const b = document.createElement("div");
    b.className = "chat-bubble" + (msg.result ? " chat-bubble--result" : "");
    if (msg.result) {
      const r = msg.result;
      b.innerHTML =
        r.lines.map((l) => `<p>${tr(l)}</p>`).join("") +
        `<div class="chat-open">
          <button class="btn btn-primary chat-main" data-open="${r.main}">${t("openSpace", nameOf(r.main))}</button>
          ${r.extra ? `<button class="btn-link chat-extra" data-open="${r.extra}">${t("openSpace", nameOf(r.extra))}</button>` : ""}
        </div>`;
    } else {
      b.textContent = msg.text;
    }
    row.appendChild(b);
    return row;
  }

  function typingRow() {
    const row = document.createElement("div");
    row.className = "chat-row chat-row--bot chat-row--typing";
    row.innerHTML = `<span class="chat-avatar">${BOT_ICON}</span>
      <div class="chat-bubble chat-typing" role="img" aria-label="${t("typing")}"><i></i><i></i><i></i></div>`;
    return row;
  }

  function drawChoices(ask) {
    options.innerHTML = "";
    options.hidden = !ask;
    if (!ask) return;
    const lists = {
      type: () => designs().map((d) => ({ attr: `data-type="${d.id}"`, label: tr(d.type) })),
      mood: () => window.MOODS.map((m) => ({ attr: `data-mood="${m.id}"`, label: tr(m.label) })),
      // ① study type's space ② mood's space ③ both — described by mood, no names
      pick: () => [
        ...splitSpaces().map((id) => ({ attr: `data-pick="${id}"`, label: tr(window.VIBES[id]) })),
        { attr: `data-pick="both"`, label: t("chatBoth") }
      ]
    };
    const list = lists[ask]();
    options.setAttribute("aria-label", t({ type: "studyTypes", mood: "moods", pick: "places" }[ask]));
    options.innerHTML = list.map((o) => `<button class="chat-choice" ${o.attr}>${o.label}</button>`).join("");
  }

  function drawActions(done) {
    actions.hidden = !done;
    actions.innerHTML = done
      ? `<button class="btn-link chat-restart" data-restart>${t("startOver")}</button>
         <a class="chat-all" href="#/compare">${t("seeAll")}</a>`
      : "";
  }

  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  /**
   * Redraw the chat from state.
   *   animate: new bot messages appear after "Typing…"
   *   focus:   move keyboard focus to the new buttons (after a click in the chat)
   */
  async function render({ animate = false, focus = false } = {}) {
    const my = ++run;
    const { msgs, ask } = script();
    const from = animate ? Math.min(shown, msgs.length) : msgs.length;

    log.innerHTML = "";
    msgs.slice(0, from).forEach((m) => log.appendChild(bubble(m)));
    drawChoices(null);
    drawActions(false);

    for (const m of msgs.slice(from)) {
      if (m.who === "bot" && !reduceMotion()) {
        const typing = typingRow();
        log.appendChild(typing);
        await wait(TYPING_MS);
        if (my !== run) return; // something newer started
        typing.remove();
      }
      log.appendChild(bubble(m));
    }
    shown = msgs.length;
    drawChoices(ask);
    drawActions(!ask);
    if (focus) {
      const next = options.querySelector("button") || log.querySelector(".chat-main");
      if (next) next.focus({ preventScroll: false });
    }
  }

  function mount(el, opts = {}) {
    root = el;
    onOpen = opts.onOpen || onOpen;
    root.innerHTML = `
      <div class="chat-log" role="log" aria-live="polite"></div>
      <div class="chat-options" role="group" hidden></div>
      <div class="chat-actions" hidden></div>`;
    log = root.querySelector(".chat-log");
    options = root.querySelector(".chat-options");
    actions = root.querySelector(".chat-actions");
    log.setAttribute("aria-label", t("chatLog"));

    root.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.type) { state.type = b.dataset.type; render({ animate: true, focus: true }); }
      else if (b.dataset.mood) { state.mood = b.dataset.mood; render({ animate: true, focus: true }); }
      else if (b.dataset.pick) { state.pick = b.dataset.pick; render({ animate: true, focus: true }); }
      else if (b.dataset.open) onOpen(b.dataset.open);   // the router opens the card
      else if ("restart" in b.dataset) { reset(); render({ animate: true, focus: true }); }
    });

    // KO | EN: same conversation, new language, no typing again.
    // The log is muted while redrawing so screen readers don't read it all again.
    document.addEventListener("lang:change", () => {
      log.setAttribute("aria-label", t("chatLog"));
      log.setAttribute("aria-live", "off");
      render();
      setTimeout(() => log.setAttribute("aria-live", "polite"), 50);
    });

    render({ animate: true });
  }

  function reset() {
    state = { type: null, mood: null, pick: null };
    shown = 0;
  }

  return { mount, decide, get state() { return { ...state }; } };
})();
