## Goal

Repaint the entire app (dark theme) with your provided palette:
- **App background** → `#0a0a0f` (near-black with a hint of blue)
- **Container / card backgrounds** → `rgba(18, 18, 26, 0.8)` (semi-transparent dark surface)

All colors live as semantic tokens in `src/styles.css`, so this is a token-level change — no component edits needed. Accent colors (teal, gold, bull/bear, AI blue) and typography stay exactly as they are.

## What changes

All edits are in the `@theme` block of `src/styles.css` (the dark theme). The light theme (`.theme-light`) is left untouched.

### 1. Global background
```
--color-background: #050816  →  #0a0a0f
```
This drives the page/body background everywhere.

### 2. Card & container surfaces
```
--color-surface:  #0d1424  →  rgba(18, 18, 26, 0.8)
--color-card:     #0d1424  →  rgba(18, 18, 26, 0.8)
--color-ai-tint:  #0d1424  →  rgba(18, 18, 26, 0.8)
```
`--color-surface` is what the `.glass-card` utility (used by every `Card`) paints with, so all cards, panels, and containers pick this up. Because it's semi-transparent, cards will read as a soft elevated layer floating over the `#0a0a0f` base.

### 3. Supporting surfaces (kept in harmony with the new palette)
To avoid a mismatched look where nested/elevated elements clash with the new base, these related dark tokens shift to tones derived from the same `18,18,26` family:
```
--color-surface-alt: #0b1120  →  #101018   (alt rows / subtle panels)
--color-elevated:    #111a2e  →  #16161f   (inputs, dropdowns, popovers base)
--color-sidebar:     #070c1a  →  #08080d   (left nav chrome)
--color-popover:     #111a2e  →  #16161f
--color-secondary:   #111a2e  →  #16161f
--color-muted:       #111a2e  →  #16161f
--color-accent:      #111a2e  →  #16161f
```

Borders, text colors, and all brand accents are unchanged, so contrast and readability stay intact.

## Scope / non-goals
- Only `src/styles.css` dark-theme tokens change.
- No JSX/component changes, no new files.
- Light theme untouched.
- If after previewing you want the cards more opaque or a different base tint, that's a one-line follow-up tweak.

## How you'll review it
Once implemented, open the Dashboard and Finance pages in the preview — the background goes near-black and every card becomes the translucent dark surface, matching your reference image. Adjustments to opacity or exact tint are trivial from there.
