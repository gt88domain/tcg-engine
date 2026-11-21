# Design Brief

## Direction

TCG Design & Play Platform — self-sovereign trading card game engine with integrated design workshop and rule-enforced online play, optimised for precision, control, and immersive gameplay.

## Tone

Precise, focused, quietly creative — a professional workspace that builds confidence through clarity, restraint, and intentional interaction.

## Differentiation

Three adaptive interface contexts (design workshop, immersive play, calm dashboard) coupled with deep-teal navigation and zero-layout-shift principles create a trustworthy platform that empowers both designers and players without chrome distraction.

## Color Palette

| Token | Light OKLCH | Dark OKLCH | Role |
| --- | --- | --- | --- |
| primary | 0.45 0.18 210 | 0.60 0.20 210 | Strategic accent, CTAs, links |
| sidebar | 0.28 0.12 220 | 0.20 0.12 220 | Deep saturated navigation base |
| sidebar-foreground | 1 0 0 | 1 0 0 | Pure white text/icons |
| sidebar-accent | 0.75 0.15 195 | 0.70 0.18 195 | Active nav left-border accent |
| background | 0.98 0.005 220 | 0.12 0.01 0 | Page base, light mode default |
| card | 0.96 0.008 220 | 0.15 0.01 0 | Elevated content containers |
| text-primary | 0.18 0.02 240 | 0.95 0.01 0 | Body text |
| text-secondary | 0.42 0.02 240 | 0.70 0.01 0 | Labels, hints |
| muted | 0.88 0.01 240 | 0.28 0.01 0 | Disabled, inactive |

## Semantic Role Colours

| Role | Light | Dark | Usage |
| --- | --- | --- | --- |
| threat | 0.55 0.22 25 | 0.65 0.25 25 | Damage, aggressive |
| answer | 0.45 0.18 260 | 0.60 0.22 260 | Defensive, interactive |
| draw | 0.52 0.16 235 | 0.62 0.20 235 | Draw, advantage |
| resource | 0.55 0.18 145 | 0.65 0.22 145 | Mana, energy, resources |
| disruption | 0.50 0.20 300 | 0.60 0.25 300 | Disruptive effects |
| defense | 0.48 0.14 220 | 0.58 0.18 220 | Block, protection |
| utility | 0.55 0.14 60 | 0.65 0.18 60 | Misc, utility |
| finisher | 0.40 0.22 20 | 0.55 0.28 20 | Powerful, ending |

## Rarity Colours

| Rarity | Light | Dark | |
| --- | --- | --- | --- |
| common | 0.62 0.01 240 | 0.70 0.02 0 | Muted grey |
| uncommon | 0.55 0.18 145 | 0.65 0.22 145 | Green |
| rare | 0.52 0.16 235 | 0.62 0.20 235 | Blue |
| epic | 0.50 0.20 300 | 0.60 0.25 300 | Purple |
| legendary | 0.65 0.18 75 | 0.75 0.22 75 | Gold/amber |

## Status Colours

| Status | Light | Dark | |
| --- | --- | --- | --- |
| draft | 0.62 0.01 240 | 0.70 0.02 0 | Muted |
| playtesting | 0.52 0.16 235 | 0.62 0.20 235 | Info blue |
| published | 0.55 0.18 145 | 0.65 0.22 145 | Success green |
| archived | 0.75 0.01 240 | 0.65 0.03 0 | Disabled |

## Typography

| Layer | Font | Usage |
| --- | --- | --- |
| Display | Space Grotesk | Titles, headers, brand |
| Body | DM Sans | UI, descriptions, rule text |
| Mono | JetBrains Mono | Costs, stats, game log, tabular numerals |

## Motion

| Context | Duration | Easing | Usage | Reduced Motion |
| --- | --- | --- | --- | --- |
| UI (buttons, toggles, inputs) | 150–200ms | ease | State changes, hovers, focus | instant |
| Play-context (card moves, reveals) | 250ms | ease | Card animations only | instant |
| Analytics (chart updates) | 200ms | ease | Analysis updates | instant |

## Constraints

- WCAG 2.1 AA contrast (foreground-on-background ≥0.7 lightness difference)
- No decorative animations, no scale transforms, no modals or slide-ins
- All interactions inline or anchored popovers
- Zero layout shift: fixed-size skeletons, no empty space holders
- Touch targets 44×44px minimum
- `prefers-reduced-motion: reduce` → all transitions instant
- Card stats rendered with tabular numerals

## Signature Detail

Deep-teal sidebar (OKLCH 0.28 0.12 220 light, 0.20 0.12 220 dark) with pure white foreground creates visual confidence. Active nav items marked with left-border accent (0.75 0.15 195) and subtle background tint. Semantic role/rarity/status tokens enable rapid visual scanning in dense design contexts. Three adaptive interface contexts transform solely through layout reconfiguration—no chrome collapse, no overlays—keeping users grounded and in control.
