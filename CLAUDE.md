# Study-Type Space Design Website (Group 6, Ajou University)

## What this project is
A website that shows four study spaces our team DESIGNED for four study types.
A chatbot asks "What am I studying today?" and "How are you feeling right now?", then shows which of our four designs fits, and opens its design card.

## Word rules (professor's feedback: keep wording consistent)
- Spaces are **designed** by our team. The website **shows** the designs.
- Do NOT write "recommend existing spaces". We are not recommending real Ajou rooms.
- Study types (always these four names): Memorization, Idea generation, Teamwork, Comfort
- Design names: Focus Room, Idea Lounge, Team Studio, Green Nook
- Every design card has exactly 3 elements: Lighting, Noise, Seating — each with a reason and a research source.
- The chatbot result = "which of the four spaces OUR TEAM DESIGNED fits me now". Never write it as if it picks real Ajou rooms.
- English: use "fits" (e.g. "our Focus Room design fits best"), not "recommend".

## Chatbot (chat.js, first screen `#/`)
- Flow: bot greeting → Q1 study type (`t("question")`, choices = `DESIGNS[].type`) → user answer → Q2 mood (choices = `MOODS`) → user answer → result bubble with "Open <space>" buttons → "Start over" + "See all four designs" (`#/compare`).
- Data in data.js: `MOODS` = `[{ id, label: { en, ko }, space }]` (focused → memorization, stuck → idea, energetic → teamwork, tired → comfort). `CHAT` = `main[studyId]`, `match`, `tiredFirst` (with `{space}` = extra space name), `moodTip[moodId]` — all `{ en, ko }`. Write full sentences (no building sentences from pieces) so Korean particles stay right.
- Rules (`Chat.decide(type, mood)`, a pure function):
  - A. mood space = study space → that space only; lines = main + match
  - B. mood = tired and study ≠ comfort → main = comfort (Green Nook), extra = study space; line = tiredFirst
  - C. otherwise → main = study space, extra = mood space; lines = main + moodTip
- The conversation is stored as data (`{ type, mood }`), not HTML, and redrawn from it. KO | EN mid-chat redraws the same conversation. Visiting other screens and coming back keeps it; only "Start over" (or a reload) clears it.
- "Open …" buttons call app.js `openFromList(id)` (the router). Never draw a card from chat.js.
- Bot messages appear after a 0.6 s "Typing…" (no delay with prefers-reduced-motion). The log is `role="log" aria-live="polite"`; all choices are `<button>`s. Colors use the style.css variables (--surface, --ink, --accent…).
- Chat words (greeting, Q2, buttons, "Typing…") are in i18n.js `UI`.

## Screens and the back button
- One screen at a time. Each has its own URL hash:
  - `#/` chatbot (first screen, only the chat) · `#/compare` all four designs · `#/survey` survey · `#/research` one card per study
  - `#/<id>` design card (alone) · `#/<id>/3d` full screen 3D on top of the card (ids: memorization, idea, teamwork, comfort)
- `compare`, `survey`, `research` are reserved words — never use them as a space id. Old in-page links (`#compare`, `#research`, `#pick`) open the matching screen.
- app.js is the router. A route is `{ page, id, full }` (page = chat | compare | survey | research | card). `parse()` / `address()` convert hash ↔ route, `show()` draws it, `go(route)` uses `history.pushState`, `back()` uses `history.back()`, `popstate` redraws. Don't change screens any other way (no direct `openFullscreen`, no showing/hiding sections by hand).
- Every in-page link `<a href="#/…">` (top bar, brand, "See all four designs", research "Used in" buttons) is caught by one click handler and goes through `go()`. Sections are `<section data-screen="…">`; only the current one is visible.
- Top bar = screen tabs: Find your space (`#/`) · Compare · Survey · Research. The current one has `aria-current="page"`; the card and 3D screens count as "Find your space". On phones the tabs stay on one row (they scroll sideways on very narrow screens).
- On every screen change: scroll to the top, stop the sound, lighting preview only on card / 3D (none elsewhere), focus the new screen's heading (for keyboard / screen readers).
- Card "← Back" and full screen "← Back" (plus × and Esc) call `back()` → the screen you came from (chat, compare, research…).
- A direct link (e.g. `#/teamwork/3d`, `#/research`) builds the steps behind it on load (`#/` first), so back ends on the chatbot. Unknown ids open the chatbot.
- The chat conversation lives in chat.js memory, so it survives visits to other screens; only "Start over" (or a reload) clears it.
- `history.scrollRestoration` is manual; the router scrolls.

## Research screen (`#/research`)
- `window.STUDIES` (data.js) = 11 studies in the order of the team's week-10 literature review:
  overall (1 Barrett) → focus (2 Meyers-Levy, 3 Mehta & Zhu 2009) → ideas (4 Mehta, Zhu & Cheema, 5 Steidle, 6 Oppezzo) → collaboration (7 Brooks) → rest (8 Kaplan, 9 Berman, 10 Lee, 11 Atchley).
- Each study: `label` and `journal` (never translated), `url`, `group: { en, ko }`, `about: { en: [...], ko: [...] }` (5 sentences for 1, 2, 4, 5, 6; 4-sentence summaries of the week-10 notes for the rest). Only use what the team wrote — no new claims.
- `key: true` → "Key evidence" badge (2, 4, 6: the same space feature works differently for different kinds of study).
- "Used in" is found automatically: the spaces whose design card `cites` that study (hidden when none, e.g. Mehta & Zhu 2009, Atchley 2012). The card ends with "Read the original" (the `url`). The KEY_FACT line is the screen's intro; the "tendencies, not rules" note stays at the bottom.

## Languages (KO | EN)
- Default language is English. The KO | EN switch is in the top bar; the choice is saved in localStorage (wrapped in try/catch, falls back to English).
- Every visible text exists in both languages. Content = `{ en: "...", ko: "..." }` in data.js (and in plans.js / space3d.js labels). Page words (buttons, headings, hints) = `UI` in i18n.js.
- Use `tr({ en, ko })` for content and `t("uiWord")` for page words. Never write a visible English-only string.
- Korean terms: Memorization = 암기, Idea generation = 아이디어 구상, Teamwork = 팀플, Comfort = 편안함. Space names stay in English in both languages. Study names (author, year) and links are never translated.
- Korean style: natural 해요체 that university students read easily. Korean uses Noto Sans KR (Google Fonts; offline → system font).
- `<html lang>` follows the language. Changing language fires `lang:change`; app.js redraws the texts and keeps the open card.

## Files
- `i18n.js`   — language switch, UI words (en/ko), saved language. Loads first.
- `data.js`   — all text content (design cards, reasons, sources, chatbot MOODS + CHAT, research STUDIES) in en + ko. Edit content here.
- `chat.js`   — chatbot on the first screen (`window.Chat`: mount, decide, state). Loads before app.js.
- `plans.js`  — top-view floor plans drawn as SVG; each plan is a function that gets `L({ en, ko })` for its labels (shown by the "Floor plan" button, and for spaces without 3D yet).
- `space3d.js`— 3D room viewer (`window.Space3D`). CSS 3D transforms only, no libraries. Must load before app.js.
- `sound.js`  — "Hear this space" sounds, generated with Web Audio API (no audio files).
- `style.css` — design + lighting preview colors per space (`[data-zone="..."]`).
- `app.js`    — page logic. Card buttons are updated in place (`updateControls`), not by re-rendering the card, so the 3D view is not rebuilt.
- `index.html`— page structure.
- `images/ajou-logo.png` — Ajou University logo, used as the chatbot's avatar (128 px).

## 3D view (space3d.js)
- Flow: chatbot / compare / research → design card (3D view first, "Floor plan" tab for 2D) → "Full screen" overlay ("← Back", × or Esc goes back to the card and stops the sound). `mount(slot, design, { onFullscreen })` and `openFullscreen(design, { onBack })` let app.js control the URL; `closeFullscreen()` closes it.
- All four spaces have a 3D room: memorization, idea, teamwork, comfort. Every card opens in 3D by default.
- Each room = (1) a `view3d` block in data.js and (2) a builder `BUILDERS.<id>(k)` in space3d.js that calls `k.room({ w, d })` then `k.add(...)`. All rooms are 10 m x 8 m.
- `view3d` (per space, all wording lives here):
  - `ceiling: { ours, compare }` in meters
  - `light: { ours: { preset, name }, compare: { preset, name } }` — `name` = `{ en, ko }` button text
  - `notes.light.ours / .compare` and `notes.ceiling.ours / .compare` = `{ text: { en, ko }, source? }`. `source` shows as "(Author, year)" before the final period. Leave `source` out when the sentence has no study. Only use studies already cited in data.js — never invent one.
  - `callout` (optional, Team Studio) = a `{ text: { en, ko }, source }` note shown inside the room (hidden when the 3D view is small, e.g. the phone card).
- Units: meters, 1 m = 46 px (`M`). Axes: x = right, y = back wall → front, z = up. x/y = center of the footprint, z = bottom. Back wall at y = 0, left wall at x = 0; front and right stay open (dollhouse).
- Helpers: `box` (`faces` = different look per side), `plane` (face: up/front/right/back/left/down), `crossed`, `group` (rz rotation), `label` (text = `{ en, ko }`, or a function returning one, e.g. depends on `k.modes`). Builders also get `k.cfg` (the view3d block) and `k.modes` (current ours/compare).
- Furniture: `loungeChair`, `chair`, `roundTable`, `desk`, `deskLamp`, `panelLight`, `pendant`, `floorLamp`, `bookshelf`, `clock`, `sofa`, `beanbag`, `mobileWhiteboard`, `plant`, `pool`. Use `faceTo: [x, y]` to turn chairs toward a table.
- Keep the number of 3D parts low (about 400 max per room) so phones stay smooth: thin things (dividers, chair backs, desk legs) are single `plane`s, not `box`es.
- Ceiling height = CSS variable `--ceil` (animated via `@property`). Anything that must follow the ceiling (walls, hanging lamps, height marker) uses `z: "var(--ceil)"`; things on walls (whiteboard, windows) use fixed heights.
- Light presets live in `LIGHTS`: dimWarm, brightOffice, brightWarm, dim, daylightGreen, coldWhite (filter + bg/glow/pool/core colors). Keep the same 5 filter functions in the same order so they animate. Keep `bg` darker than the walls so walls stay visible.
- Labels are 2D tags drawn over the 3D view at the projected point, so they always face the viewer and stay readable on phones.
- Comparison sentences must follow the word rules: our team **designed** the space; the compare option is not a real Ajou room.

## Style
- Plain HTML/CSS/JS, no build tools, must work by opening index.html directly.
- Simple English that university students can read quickly.
- Must work on phones (no horizontal scroll).

## Still to do
- Comfort > Seating reason: add our survey result (week 12).
- Survey section: add a chart of preferred spaces by study type.
- Replace Google Scholar search links (Steidle & Werth, Brooks) with the original article links.
