# Design system & rationale

**Direction: "executive futuristic technology".** Calm, precise and premium, closer to a professional instrument than a gaming dashboard. Dark graphite is the default branded experience; a light theme ships with the same tokens.

## Principles

1. **The tool is the hero.** On tool pages the working UI appears right after a one-sentence value proposition, above the fold on phones (≈440 px from the top at 375×812).
2. **One accent, used with intent.** Electric cyan marks the primary action, focus and progress. Nothing else competes.
3. **Quiet surfaces, crisp edges.** Layered graphite surfaces, 1 px borders and a faint top highlight instead of heavy shadows, glassmorphism or gradients. The only glow is a subtle radial accent behind hero areas.
4. **Honest feedback.** Every state (empty, selected, processing, success, error, cancelled) has a distinct, calm visual treatment and an accessible announcement.

## Tokens (`src/styles/tokens.css`)

| Group | Tokens | Notes |
| --- | --- | --- |
| Color: surfaces | `--color-bg` `#0a0c0f` → `--color-surface` → `-2` → `-3`, `--color-surface-inset` | Near-black graphite, each step slightly lighter |
| Color: text | `--color-text` `#edf1f5`, `-muted` `#a3adba`, `-subtle` `#808b99` | Subtle text is ≥ 4.8:1 on all dark surfaces (WCAG AA) |
| Color: accent | `--color-accent` `#38d7f5`, `-strong`, `-text`, `-soft`, `-border`, `--color-accent-2` (blue, logo/progress gradient only) | Text on accent uses `--color-accent-contrast` (≈11:1) |
| Color: status | `--color-success`, `--color-warning`, `--color-error` (+ `-soft`, `-border`) | Each ≥ 4.5:1 on its surfaces |
| Category hues | `--hue-rose` (PDF), `--hue-violet` (Image), `--hue-emerald` (Utility) | Used **only** as icon tint/tiles for wayfinding |
| Type | Geist Variable; `--text-2xs` … `--text-display` (fluid `clamp()` from 2xl up) | Headings: semibold, negative tracking; numbers: tabular |
| Space | 4 px grid `--space-1` … `--space-24`, `--space-section`, `--gutter` (fluid) | |
| Radius | `xs 6` · `sm 8` · `md 12` · `lg 16` · `xl 22` · `full` | Cards `lg`, tool shell `xl`, controls `md/sm` |
| Shadow | `xs` … `lg`, `--shadow-accent`, `--highlight` (inset top line) | Dark theme relies on borders more than shadows |
| Motion | `--duration-fast 140ms` · `base 220ms` · `slow 360ms`; `--ease-out`, `--ease-standard` | All animation is disabled under `prefers-reduced-motion` |
| Layers | `--z-raised` … `--z-toast` | No magic z-index numbers |
| Layout | `--container 74rem`, `--header-height 64px`, `--tap-target 44px` | Breakpoints: 480 · 560 · 640 · 768 · 900 · 1024 |

The light theme (`:root[data-theme='light']`) redefines only color, shadow and glow tokens; components never branch on theme. The theme choice is applied by a tiny inline script before first paint (no flash) and persisted.

## Typography

- **Geist Variable** (OFL), self-hosted, latin subset preloaded (≈30 KB), latin-ext loaded on demand. It is technical and precise without being cold, and pairs well with tabular numerals for sizes and percentages.
- Scale: display headlines use `clamp(2.25rem → 4rem)` with −0.04em tracking; body 16 px with 1.55 leading; inputs are ≥ 16 px to prevent iOS zoom.
- `text-wrap: balance` for headings and `pretty` for paragraphs avoid awkward rag.

## Components and patterns

- **Header**: logo lockup ("Nexora **Tools**" + small "by Codywork"), category nav, a search trigger styled as a field (⌘/Ctrl K), a language menu and a theme toggle. On phones: logo, search icon, language and menu only.
- **Tool cards**: icon tile tinted by category hue, name, one-line tagline, "On your device" micro-badge and an arrow that nudges on hover. The whole card is one link (stretched link). On phones they switch to a compact horizontal layout.
- **Category cards**: header link and a list of tool links (no stretched link, since they contain several links).
- **Tool shell**: one elevated card with a hairline accent along the top edge. Inside it:
  - Empty state: a large dashed dropzone with an accent glyph and one primary button. On touch devices the "drop" wording is hidden and the button leads.
  - Selected state: split layout on desktop (files | options + action), a single column on mobile with a **sticky action bar** so the primary button stays reachable while scrolling long lists.
  - Processing state: the action area becomes an accent progress panel with a message, percentage and Cancel button. Options are disabled via `<fieldset disabled>`.
  - Success state: a green check with a halo, the title receives focus, an optional before/after comparison with a colored delta, and a prominent download (or "Download all (ZIP)" plus per-file compact downloads). Then "Process more files", "Continue with" related tools, and the local-processing note.
  - Error state: a red icon, human title and explanation, recovery actions, and an alternative tool only when genuinely helpful.
- **Options**: segmented controls (native radios) for 2–4 choices, ranges with live value, selects, checkboxes with hints, and number pairs (W × H). All use native elements for accessibility.
- **Privacy badge**: a pill that is green-tinted when local and neutral otherwise. The copy is derived from the tool's execution mode.
- **Notices**: info, warning and error rows with an icon and optional dismiss.
- **Search**: a combobox with rich options (icon tile, name, tagline, category) and a keyboard-hint footer on desktop. It is full-screen on phones.

## Page composition

- **Home**: hero (brand eyebrow, H1 value proposition, subtitle, search, "Explore all tools" and trust row, plus an illustrative product preview card on desktop) → recently used → popular tools → categories → privacy architecture panel with a flow diagram → why Nexora → explore CTA and "Built by Codywork".
- **Tool page**: breadcrumbs → icon, H1, lead and privacy badge → tool shell → how it works and about/good-to-know (with a sticky "Tool details" card on desktop) → FAQ → related tools → explore CTA.
- **Directory**: H1, lead, in-place filter with a live count, and tools grouped by category.

## Brand relationship with Codywork

Nexora Tools stands on its own; Codywork ownership is visible but understated:

- the header lockup "by Codywork" (small, subtle text);
- the footer line "Nexora Tools is a Codywork product." with a link to codywork.com;
- a home section "Built by Codywork";
- the About page (full relationship), `Organization` JSON-LD as publisher, and OG images.

## Logo

The Nexora mark is an "N" drawn as one continuous stroke with two nodes at its inner vertices: connected steps, a nexus. The stroke uses a cyan→blue gradient on a graphite tile. Sources live in `src/components/ui/LogoMark.astro` and `scripts/generate-brand-assets.mjs` (favicon, PWA and OG images).

## Accessibility baseline

Semantic landmarks, a skip link, one H1 per page, visible `:focus-visible` rings (accent, 2 px), ≥ 44 px targets (40 px minimum for compact controls on touch), native dialogs for the menu and search (focus trap and Escape), `aria-live` status announcements in tools, focus moved to result and error headings, `prefers-reduced-motion` support, and AA contrast in both themes.
