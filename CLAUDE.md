# Study-Type Space Design Website (Group 6, Ajou University)

## What this project is
A website that shows four study spaces our team DESIGNED for four study types.
The user answers "What am I studying today?" and sees the design card for that type.

## Word rules (professor's feedback: keep wording consistent)
- Spaces are **designed** by our team. The website **shows** the designs.
- Do NOT write "recommend existing spaces". We are not recommending real Ajou rooms.
- Study types (always these four names): Memorization, Idea generation, Teamwork, Comfort
- Design names: Focus Room, Idea Lounge, Team Studio, Green Nook
- Every design card has exactly 3 elements: Lighting, Noise, Seating — each with a reason and a research source.

## Languages (KO | EN)
- Default language is English. The KO | EN switch is in the top bar; the choice is saved in localStorage (wrapped in try/catch, falls back to English).
- Every visible text exists in both languages. Content = `{ en: "...", ko: "..." }` in data.js (and in plans.js / space3d.js labels). Page words (buttons, headings, hints) = `UI` in i18n.js.
- Use `tr({ en, ko })` for content and `t("uiWord")` for page words. Never write a visible English-only string.
- Korean terms: Memorization = 암기, Idea generation = 아이디어 구상, Teamwork = 팀플, Comfort = 편안함. Space names stay in English in both languages. Study names (author, year) and links are never translated.
- Korean style: natural 해요체 that university students read easily. Korean uses Noto Sans KR (Google Fonts; offline → system font).
- `<html lang>` follows the language. Changing language fires `lang:change`; app.js redraws the texts and keeps the open card.

## Files
- `i18n.js`   — language switch, UI words (en/ko), saved language. Loads first.
- `data.js`   — all text content (design cards, reasons, sources) in en + ko. Edit content here.
- `plans.js`  — top-view floor plans drawn as SVG; each plan is a function that gets `L({ en, ko })` for its labels (shown by the "Floor plan" button, and for spaces without 3D yet).
- `space3d.js`— 3D room viewer (`window.Space3D`). CSS 3D transforms only, no libraries. Must load before app.js.
- `sound.js`  — "Hear this space" sounds, generated with Web Audio API (no audio files).
- `style.css` — design + lighting preview colors per space (`[data-zone="..."]`).
- `app.js`    — page logic. Card buttons are updated in place (`updateControls`), not by re-rendering the card, so the 3D view is not rebuilt.
- `index.html`— page structure.

## 3D view (space3d.js)
- Flow: question → design card (3D view first, "Floor plan" tab for 2D) → "Full screen" overlay (× / Esc closes it and stops the sound).
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
