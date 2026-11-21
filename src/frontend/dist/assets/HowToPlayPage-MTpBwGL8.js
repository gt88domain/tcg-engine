import { k as createLucideIcon, j as jsxRuntimeExports, B as BookOpen, r as reactExports, a5 as ChevronRight, S as Swords } from "./index-Ch41Ib91.js";
import { B as Badge } from "./badge-UtblI1Uf.js";
import "./index-CyXusObr.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
];
const Shield = createLucideIcon("shield", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const PHASE_INFO = [
  {
    id: "Start",
    name: "Start Phase",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
    desc: "Mana refills to your maximum. Start-of-turn abilities (e.g. Verdant Healer) trigger here."
  },
  {
    id: "Draw",
    name: "Draw Phase",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4" }),
    desc: "Draw one card from your library. If your library is empty when you must draw, you lose."
  },
  {
    id: "Main",
    name: "Main Phase",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Swords, { className: "w-4 h-4" }),
    desc: "Play cards by spending Mana. Creatures, Spells, and Artifacts all enter play here. Enter-play abilities resolve immediately."
  },
  {
    id: "Combat",
    name: "Combat Phase",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-4 h-4" }),
    desc: "Declare attackers. Opponent assigns blockers. Damage is simultaneous. Creatures at 0 defense are destroyed."
  },
  {
    id: "End",
    name: "End Phase",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
    desc: "Discard down to 7 cards. End-of-turn effects and temporary stat boosts expire."
  }
];
const CARD_TYPES = [
  {
    name: "Creature",
    color: "oklch(var(--status-published))",
    bg: "oklch(var(--status-published)/0.1)",
    desc: "Stays in play. Can attack and block. Has Attack/Defense. Reduced to 0 defense = destroyed."
  },
  {
    name: "Spell",
    color: "oklch(var(--status-playtesting))",
    bg: "oklch(var(--status-playtesting)/0.1)",
    desc: "One-time effect. Resolves then goes to the graveyard. Cannot block or attack."
  },
  {
    name: "Artifact",
    color: "oklch(var(--info))",
    bg: "oklch(var(--info)/0.1)",
    desc: "Stays in play like a creature but has no Attack/Defense. Provides passive or triggered resource effects."
  }
];
const KEYWORDS = [
  { name: "Flying", desc: "Can only be blocked by creatures with Flying." },
  {
    name: "Defender",
    desc: "Cannot attack. Compensated with high Defense or powerful passive effects."
  },
  {
    name: "Haste",
    desc: "Can attack the turn it enters play. Normal creatures have Summoning Sickness for one turn."
  },
  {
    name: "Trample",
    desc: "Excess combat damage above a blocker's Defense is dealt to the opponent."
  },
  {
    name: "Lifesteal",
    desc: "When this creature deals damage, heal that same amount."
  }
];
const TIPS = [
  "Play Mana Siphon or Leyline Conduit early to ramp into big threats faster.",
  "Flying creatures are hard to block — use Galewind Hawk or Aether Sphinx for consistent pressure.",
  "Save removal like Arc Lightning or Wither Curse for your opponent's most dangerous creature.",
  "Crystal Golem and Iron Warden hold off aggro decks while you build your board.",
  "Watch open Mana during your opponent's Main phase — they might have a counter-spell.",
  "If you're behind on board, a well-timed Inferno Wave can reset the game."
];
function Section({
  title,
  children,
  index
}) {
  const [open, setOpen] = reactExports.useState(index < 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border overflow-hidden",
      "data-ocid": `how_to_play.section.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/40 transition-colors duration-150 text-left",
            onClick: () => setOpen((v) => !v),
            "aria-expanded": open,
            "data-ocid": `how_to_play.toggle.${index}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronRight,
                {
                  className: "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-150",
                  style: { transform: open ? "rotate(90deg)" : "rotate(0deg)" }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid transition-[grid-template-rows] duration-200",
            style: { gridTemplateRows: open ? "1fr" : "0fr" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 bg-muted/20 border-t border-border", children }) })
          }
        )
      ]
    }
  );
}
function HowToPlayPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-3xl space-y-4", "data-ocid": "how_to_play.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold", children: "How to Play — Aura TCG" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "A strategic card game of elemental power and tactical combat." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Overview & Goal", index: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground", children: [
        "Aura TCG is a two-player card game. Each player starts with",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "20 life" }),
        " and a deck of 20–60 cards. Reduce your opponent's life to zero to win."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
        { label: "Starting Life", value: "20" },
        { label: "Mana Per Turn", value: "2" },
        { label: "Max Hand Size", value: "7" },
        { label: "Min Deck Size", value: "20" }
      ].map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-lg bg-muted/30 px-3 py-2 flex items-center justify-between",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: row.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-sm font-bold tabular-nums",
                style: { color: "oklch(var(--primary))" },
                children: row.value
              }
            )
          ]
        },
        row.label
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Turn Structure", index: 1, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-3", children: PHASE_INFO.map((phase, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold tabular-nums mt-0.5",
          style: {
            background: "oklch(var(--primary)/0.12)",
            color: "oklch(var(--primary))"
          },
          children: i + 1
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(var(--primary))" }, children: phase.icon }),
          phase.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: phase.desc })
      ] })
    ] }, phase.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Card Types", index: 2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: CARD_TYPES.map((ct) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-3 rounded-lg p-3",
        style: { background: ct.bg },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "px-2 py-0.5 rounded text-xs font-bold shrink-0 mt-0.5",
              style: { color: ct.color, border: `1px solid ${ct.color}` },
              children: ct.name
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed", children: ct.desc })
        ]
      },
      ct.name
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Keyword Glossary", index: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: KEYWORDS.map((kw) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2 px-3 py-2 rounded-lg bg-muted/30",
        "data-ocid": `how_to_play.keyword.${kw.name.toLowerCase()}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: "text-xs shrink-0 mt-0.5",
              style: {
                background: "oklch(var(--primary)/0.15)",
                color: "oklch(var(--primary))",
                border: "none"
              },
              children: kw.name
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: kw.desc })
        ]
      },
      kw.name
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "How to Win", index: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 rounded-lg bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Flame,
          {
            className: "w-4 h-4 shrink-0 mt-0.5",
            style: { color: "oklch(var(--analysis-critical))" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Life to Zero" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Deal damage until your opponent reaches 0 life via attacking creatures or damage spells." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 rounded-lg bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          BookOpen,
          {
            className: "w-4 h-4 shrink-0 mt-0.5",
            style: { color: "oklch(var(--status-playtesting))" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Deck Out" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "A player who cannot draw on their Draw Phase loses immediately." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Strategy Tips", index: 5, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: TIPS.map((tip, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static tip list
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums",
            style: {
              background: "oklch(var(--primary)/0.12)",
              color: "oklch(var(--primary))"
            },
            children: i + 1
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: tip })
      ] }, i)
    )) }) })
  ] });
}
export {
  HowToPlayPage as default
};
