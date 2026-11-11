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

## Files
- `data.js`   — all text content (design cards, reasons, sources). Edit content here.
- `plans.js`  — top-view floor plans drawn as SVG (shown by the "Floor plan" button, and for spaces without 3D yet).
- `space3d.js`— 3D room viewer (`window.Space3D`). CSS 3D transforms only, no libraries. Must load before app.js.
- `sound.js`  — "Hear this space" sounds, generated with Web Audio API (no audio files).
- `style.css` — design + lighting preview colors per space (`[data-zone="..."]`).
- `app.js`    — page logic. Card buttons are updated in place (`updateControls`), not by re-rendering the card, so the 3D view is not rebuilt.
- `index.html`— page structure.

## 3D view (space3d.js)
- Flow: question → design card (3D view first, "Floor plan" tab for 2D) → "Full screen" overlay (× / Esc closes it and stops the sound).
- Done: Idea Lounge (`idea`). To do: memorization, teamwork, comfort.
- To add a room: (1) a `view3d` block in data.js (ceiling ours/compare in m, light presets + short names, notes with source), (2) a builder `BUILDERS.<id>(k)` in space3d.js that calls `k.room({ w, d })` then `k.add(...)`.
- Units: meters, 1 m = 46 px (`M`). Axes: x = right, y = back wall → front, z = up. x/y = center of the footprint, z = bottom. Back wall at y = 0, left wall at x = 0; front and right stay open (dollhouse).
- Helpers: `box`, `plane` (face: up/front/right/back/left/down), `crossed`, `group` (rz rotation), `label`. Furniture: `loungeChair`, `roundTable`, `pendant`, `floorLamp`, `plant`, `pool`.
- Ceiling height = CSS variable `--ceil` (animated via `@property`). Anything that must follow the ceiling (walls, hanging lamps, height marker) uses `z: "var(--ceil)"`; things on walls (whiteboard, windows) use fixed heights.
- Light presets live in `LIGHTS` (filter + bg/glow/pool/core colors). Keep the same filter functions in the same order so they animate.
- Labels are 2D tags drawn over the 3D view at the projected point, so they always face the viewer and stay readable on phones.
- Comparison sentences must follow the word rules: our team **designed** the space; the compare option is not a real Ajou room.

## Style
- Plain HTML/CSS/JS, no build tools, must work by opening index.html directly.
- Simple English that university students can read quickly.
- Must work on phones (no horizontal scroll).

## Still to do
- 3D views for Focus Room, Team Studio, Green Nook.
- Comfort > Seating reason: add our survey result (week 12).
- Survey section: add a chart of preferred spaces by study type.
- Replace Google Scholar search links (Steidle & Werth, Brooks) with the original article links.
