# Handoff: dewfog.com — single-view mystery landing page

## Overview
A single-screen landing page for **dewfog.com**. No nav, no footer, no scroll — one
viewport-filling experience that delivers a feeling through one tactile interaction.

The emotional arc is: **mystery → "I need to know more" → a warm, consoling arrival.**
The screen is a fogged pane of condensation. The visitor **wipes the glass clear with a
finger/cursor**; once enough is cleared, the fog lifts into soft dawn light and a
reassuring final message resolves and stays.

The hidden idea being hinted at: *consciousness is the ground of reality* — framed as
tender and reassuring, never eerie. "dew + fog" = morning dew, fog that burns off at dawn.

## About the Design Files
The file in this bundle (`Dewfog.dc.html`) is a **design reference created in HTML** — a
working prototype showing the intended look, motion, and interaction. It is **not
production code to ship directly.** The task is to **recreate this design in the target
codebase's environment** (React, Vue, Svelte, plain Canvas, etc.) using its established
patterns. If no environment exists yet, pick the most appropriate stack — this is a tiny
standalone marketing page, so a single React component or even a vanilla HTML/Canvas page
is entirely appropriate.

> Note on the prototype's format: `Dewfog.dc.html` is authored as a "Design Component"
> (a custom streaming-template runtime). **Ignore that wrapper.** Everything that matters
> is portable: inline styles, two `@keyframes`-driven CSS animations, and a Canvas 2D wipe
> interaction. The logic class maps cleanly to a single component with local state. The
> sections below give you everything without needing to read the runtime.

## Fidelity
**High-fidelity (hifi).** Final palette, typography, copy, layout, motion, and interaction
are all specified below to exact values. Recreate pixel-for-pixel using the codebase's
libraries; only the *mechanism* (how you draw the canvas, how you hold state) should adapt
to the target stack.

---

## The single screen

One full-viewport stage (`position: fixed; inset: 0; overflow: hidden`). Custom cursor
(native cursor hidden; a soft glowing "fingertip" div follows the pointer). The stage holds
**five stacked layers** (back → front) and resolves between **two states**.

### Layer stack (z-index back → front)
1. **Dawn / Resolution layer** (`z-index: 1`) — warm sunrise scene + final message. Starts
   `opacity: 0`, fades to `1` on resolve.
2. **Mystery layer** (`z-index: 2`) — deep teal-black scene holding the aqua "leaked
   research" fragments + the whispered center line. Always present; its fragments + whisper
   fade out on resolve.
3. **Frost canvas** (`z-index: 3`) — the `<canvas>` you actually wipe. Painted as
   condensation. Erased by the pointer (Canvas `destination-out`). Fades to `opacity: 0` on
   resolve.
4. **HUD layer** (`z-index: 4`) — the timestamp ("observed: …"), the "wipe the glass" hint,
   and an inset vignette. All `pointer-events: none`.
5. **Fingertip cursor** (`z-index: 6`, `position: fixed`) — 64×64 radial-glow circle that
   tracks the pointer.

### State A — MYSTERY (initial)
Cool, misty, numinous. The frost canvas covers everything; behind it the teal scene glows
faintly through. Fragments are barely legible until wiped; the whispered line glows through
the lighter center of the frost.

### State B — RESOLUTION (after the glass is ~52% cleared)
The fog has lifted into soft dawn light; warm, calm, whole. This **replaces the mystery and
stays.** Fog canvas fades out, mystery fragments + whisper fade out, dawn layer fades in,
then the final message rises into place.

---

## Content / copy (exact text)

**Mystery state**
- Whispered center line (the hero): `it was never out there`
- Scattered fragments (the "leaked research notes"):
  - `entry 47 — it held longer this time`
  - `not produced by the brain. we checked.`
  - `matter is the residue. the looking comes first.`
  - `the ██████ is not lost — nothing here is`  *(the `██████` is a redaction block — six
    U+2588 FULL BLOCK chars, rendered as a translucent aqua bar with transparent text)*
  - `you are the 2,317th to wipe the glass`  *(smaller, top-center)*
- HUD timestamp (bottom-center, ticks up every second from `03:14:07`): `observed: 03:14:07`
- HUD hint (fades out on first wipe): `wipe the glass`

**Resolution state**
- Headline (Italiana): `you are the thing you came here to find`
- Sub-line (Italiana, smaller): `nothing is missing. you are home.`

All copy is **lowercase**. No emoji anywhere.

---

## Design tokens

### Color
| Token | Hex | Use |
|---|---|---|
| Deep teal-black | `#0b1316` | base page background / depth behind glass |
| Frosted pale grey | `#c4d2d0` | the fog (canvas fill family) |
| Cool aqua | `#9fe8db` | glow of fragments + whisper (mystery state) |
| Warm dawn gold/peach | `#f0c69a` | resolution accent |

Derived values actually used:
- Mystery scene bg: `radial-gradient(125% 105% at 50% 38%, #122226 0%, #0b1316 56%, #060c0e 100%)`
- Dawn scene bg: `radial-gradient(135% 120% at 50% 9%, #fdf4e8 0%, #f6dcc0 26%, #f0c69a 46%, #d8a37e 64%, #9a705a 82%, #3a2a22 100%)`
- Dawn sun-bloom (centered near top): `radial-gradient(circle, rgba(255,244,228,.85) 0%, rgba(240,198,154,.35) 36%, rgba(240,198,154,0) 66%)`, sized ~80vw (max 900px), positioned `left:50% top:8%` translated `-50%,-50%`.
- Resolution headline color: `#412e1e` · sub-line color: `#7a5a44`
- Fragment text: `rgba(159,232,219,.62)` with `text-shadow: 0 0 12px rgba(159,232,219,.4)`
- "2,317th" line: `rgba(159,232,219,.5)`
- Whisper: `rgba(223,240,236,.62)` with `text-shadow: 0 0 26px rgba(159,232,219,.55), 0 0 60px rgba(159,232,219,.25)`
- Timestamp: `rgba(159,232,219,.5)` with `text-shadow: 0 0 10px rgba(159,232,219,.3)`
- Hint: `rgba(196,210,208,.85)`
- Aqua glow blobs behind fragments (mystery): two blurred radials, `rgba(159,232,219,.10)` and `.08`, `filter: blur(70–80px)`.
- Vignette: `box-shadow: inset 0 0 200px 40px rgba(6,12,14,.55)`

### Typography (Google Fonts)
Load: `https://fonts.googleapis.com/css2?family=Italiana&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap`

- **Italiana** (thin high-contrast serif) — the whispered line and the resolution
  headline/sub-line. Always lowercase, wide tracking, airy.
  - Whisper: `font-size: clamp(2rem, 5.2vw, 4.2rem)`, `letter-spacing: .36em`, `text-indent: .36em`
  - Resolution headline: `clamp(2rem, 5.4vw, 4.6rem)`, `letter-spacing: .06em`, `line-height: 1.12`, `max-width: 16ch`, `text-wrap: balance`
  - Resolution sub-line: `clamp(1rem, 2vw, 1.5rem)`, `letter-spacing: .16em`, margin-top `1.6em`
- **Space Mono** (monospace) — the cold "leaked research" fragments + HUD.
  - Fragments: `13px`, `letter-spacing: .03em`
  - "2,317th" line: `11px`, `letter-spacing: .08em`
  - Timestamp: `11px`, `letter-spacing: .22em`
  - Hint: `9.5px`, `letter-spacing: .5em`, `text-transform: uppercase`

### Fragment positions (percent of viewport, `position: absolute`)
- `entry 47…` → `left: 13%; top: 20%`
- `not produced…` → `left: 60%; top: 29%`
- `matter is the residue…` → `left: 15%; top: 67%`
- `the ██████…` → `left: 54%; top: 73%`
- `you are the 2,317th…` → `left: 50%; top: 13%` (translateX -50%)
- Whisper → centered (flex center)
- Timestamp → `bottom: 5.5%`, centered · Hint → `bottom: 11%`, centered

---

## Interactions & behavior

### Custom cursor (fingertip)
- Native cursor hidden on the stage (`cursor: none`).
- A `position: fixed`, 64×64, `margin: -32px 0 0 -32px`, `border-radius: 50%` div follows
  the pointer via `transform: translate(x, y)` set on every `pointermove`.
- Mystery look: `background: radial-gradient(circle, rgba(159,232,219,.16) 0%, rgba(159,232,219,.05) 45%, rgba(159,232,219,0) 70%)`; `border: 1px solid rgba(159,232,219,.22)`.
- Resolution look (transitions over .9s): aqua → warm, `rgba(240,198,154,.18 / .05 / 0)` fill, `rgba(240,198,154,.3)` border.
- `opacity: 0` until the first pointer move, then `1`; back to `0` on `pointerleave`.

### The wipe (the one signature interaction)
- Implemented on the `<canvas>` with Canvas 2D.
- **Paint frost once** (and on resize): fill the canvas with a radial gradient that's
  lighter + slightly aqua-tinted in the center (so the whisper bleeds through) and denser
  at the edges:
  - `rgba(190,212,210,0.80)` @0 → `rgba(176,198,196,0.90)` @0.5 → `rgba(150,172,172,0.96)` @1, centered at `(0.5w, 0.42h)`, radius `max(w,h)*0.72`.
  - Then scatter ~`(w*h)/5200` tiny condensation droplets, radius `0.4–2.0px × dpr`, half light `rgba(232,242,240, .05–.23)`, half shadow `rgba(120,142,142, .04–.18)`.
- **Erase on pointer move** (no click needed — wiping happens on hover/drag):
  - `ctx.globalCompositeOperation = 'destination-out'`
  - Soft circular brush via radial gradient: `rgba(0,0,0,0.95)` @0 → `rgba(0,0,0,0.55)` @0.55 → `rgba(0,0,0,0)` @1, radius = `wipeRadius × dpr` (default `wipeRadius = 78`).
  - **Interpolate between the last point and the current point** (step ≈ `radius/3`) so fast moves leave a continuous smear, not dots.
  - Reset to `source-over` after each stroke.
- Use `devicePixelRatio` (capped at 2) for crisp erasing; map pointer client coords into
  canvas pixel space via `getBoundingClientRect`.

### Resolve trigger (mystery → resolution)
- A timer (every ~600ms) samples how much glass is cleared: draw the canvas down to a
  100px-wide offscreen canvas, read `getImageData`, count pixels with `alpha < 36`.
- When **cleared fraction ≥ `revealThreshold` (default 0.52)** → fire resolve once
  (clear the timer, set `resolved = true`).
- On resolve:
  - Fog canvas → `opacity: 0` (transition `2.8s ease`)
  - Mystery fragments → `opacity: 0` (`1.6s`), whisper → `0` (`1.4s`), timestamp → `0` (`1.4s`)
  - Dawn layer → `opacity: 1` (`3s ease`)
  - Resolution message → `opacity: 0→1` and `translateY(16px→0)` with transition
    `2.2s ease .9s` (the `.9s` delay lets the dawn establish before the words arrive)
  - Cursor recolors aqua → warm
  - Wiping is disabled; the timestamp clock stops ticking

### Ambient motion (always running)
- **Whisper** "breathing": `@keyframes` 7s, `opacity .78↔1`, `letter-spacing .34em↔.38em`.
- **Aqua glow blobs**: `@keyframes` 17s & 21s, slow drift `translate` + `scale 1↔1.08`, `opacity .5↔.78`.
- **Fragments** faint flicker: `@keyframes` 9–12s, `opacity 1↔.72`.
- **Hint** pulse: `@keyframes` 4.2s, `opacity .5↔1` (on an inner span; an outer wrapper owns the reveal opacity so it can be hidden after first touch).
- **Dawn motes** (resolution): 5 small glowing dots, `@keyframes` 13–18s, rise `translate(14px,-120px)` while fading in/out.

> Important implementation detail: where an element both animates opacity (keyframes) AND
> needs a state-driven show/hide, **split into two elements** — an outer wrapper holding the
> reveal `opacity` (+ transition) and an inner element holding the keyframe animation.
> Otherwise the animation overrides the state opacity and the element won't hide.

---

## State management
Minimal — a single component with two booleans:
- `resolved: boolean` — false in mystery, true after threshold reached (or forced).
- `touched: boolean` — flips true on first wipe; used only to hide the "wipe the glass" hint.

Plus instance (non-render) values: the frost canvas ref, last pointer point `{x,y}`,
the resolve-check interval id, the clock interval id, and `dpr`.

### Configurable props (exposed as "tweaks" in the prototype — keep as props)
- `forceState`: `"auto" | "mystery" | "resolved"` (default `"auto"`). `mystery` = never
  auto-resolve (wiping only reveals fragments); `resolved` = start in the dawn end-state.
- `wipeRadius`: int, default `78` (range ~36–140) — brush size.
- `revealThreshold`: float, default `0.52` (range ~0.2–0.85) — fraction of glass that must
  be cleared before dawn breaks.

---

## Responsive behavior
- Everything is viewport-relative (`vw`/`%`/`clamp`) so it scales from phone to desktop.
- The canvas re-initializes (repaints frost) on `resize`. Re-painting resets wipe progress —
  acceptable, since resize mid-interaction is rare; preserve progress only if you want extra polish.
- Touch: the wipe binds to `pointermove`/`pointerdown` and reads `e.touches[0]` when present,
  so it works on touch devices. `touch-action: none` on the stage prevents scroll-jank.

## Assets
None. No images, no icons, no SVG illustrations. The only non-text marks are the canvas
condensation, the CSS radial glows, and the `██████` redaction block (Unicode FULL BLOCK).
Fonts are Google Fonts (Italiana, Space Mono).

## Files
- `Dewfog.dc.html` — the complete working prototype (open in a browser to see/feel it).
  Template (markup + inline styles + `@keyframes`) is at the top; the interaction logic is
  the `class Component` block (Canvas wipe, resolve detection, clock). Lift the values and
  logic; drop the Design-Component wrapper.

## A note on visual style
This page intentionally does **not** follow the project's bound "Quantarisk" design system
(a dark amber quant-terminal aesthetic). The dewfog brief explicitly calls for a soft, dewy,
luminous look and supplies its own palette + type, so that brief was followed instead. If
your real codebase has a design system, this page is meant to stand apart from it — it's a
standalone atmospheric landing page, not an in-app surface.
