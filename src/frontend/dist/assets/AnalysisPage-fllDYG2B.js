import { k as createLucideIcon, b as useActor, c as useQuery, j as jsxRuntimeExports, d as Skeleton, e as createActor } from "./index-Ch41Ib91.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode);
function getCostCurve(deck, cardMap) {
  const buckets = {};
  for (const entry of deck.cards) {
    const card = cardMap.get(entry.cardId);
    if (!card) continue;
    const cost = Number(card.cost);
    buckets[cost] = (buckets[cost] ?? 0) + Number(entry.count);
  }
  return Array.from({ length: 7 }, (_, i) => ({
    cost: i,
    count: buckets[i] ?? 0
  }));
}
function getTypeDist(deck, cardMap) {
  const dist = {};
  let total = 0;
  for (const entry of deck.cards) {
    const card = cardMap.get(entry.cardId);
    if (!card) continue;
    const count = Number(entry.count);
    dist[card.cardType] = (dist[card.cardType] ?? 0) + count;
    total += count;
  }
  return Object.entries(dist).map(([type, count]) => ({
    type,
    count,
    pct: total > 0 ? Math.round(count / total * 100) : 0
  }));
}
function getRoleDist(deck, cardMap) {
  const roleMap = {
    Threat: ["Aggro", "Haste", "Trample", "Finisher"],
    Answer: ["Removal", "Answer", "Counter", "Sweeper"],
    Draw: ["Draw"],
    Resource: ["Resource", "Ramp"],
    Defense: ["Defense", "Control", "Defender"],
    Utility: ["Utility", "Recursion", "Buff", "Debuff"]
  };
  const dist = {};
  let total = 0;
  for (const entry of deck.cards) {
    const card = cardMap.get(entry.cardId);
    if (!card) continue;
    const count = Number(entry.count);
    let matched = false;
    for (const [role, keywords] of Object.entries(roleMap)) {
      if (card.tags.some((t) => keywords.includes(t))) {
        dist[role] = (dist[role] ?? 0) + count;
        matched = true;
        break;
      }
    }
    if (!matched) dist.Other = (dist.Other ?? 0) + count;
    total += count;
  }
  return Object.entries(dist).sort((a, b) => b[1] - a[1]).map(([role, count]) => ({
    role,
    count,
    pct: total > 0 ? Math.round(count / total * 100) : 0
  }));
}
const COST_COLORS = [
  "oklch(var(--primary)/0.25)",
  "oklch(var(--primary)/0.4)",
  "oklch(var(--primary)/0.55)",
  "oklch(var(--primary)/0.70)",
  "oklch(var(--primary)/0.85)",
  "oklch(var(--primary))",
  "oklch(var(--analysis-critical)/0.8)"
];
function CostCurveChart({ curve }) {
  const max = Math.max(...curve.map((b) => b.count), 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", "data-ocid": "analysis.cost_curve", children: [
    curve.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 text-right text-xs text-muted-foreground tabular-nums shrink-0", children: b.cost }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-5 rounded bg-muted/30 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded",
          style: {
            width: `${b.count / max * 100}%`,
            background: COST_COLORS[i] ?? COST_COLORS[6]
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 text-xs tabular-nums text-muted-foreground shrink-0", children: b.count })
    ] }, b.cost)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground ml-6 mt-1", children: "Mana cost (0–6+)" })
  ] });
}
const TYPE_COLORS = {
  Creature: "oklch(var(--status-published))",
  Spell: "oklch(var(--status-playtesting))",
  Artifact: "oklch(var(--info))"
};
function TypeDistChart({ dist }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "analysis.type_distribution", children: dist.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "w-14 text-xs font-medium truncate",
        style: {
          color: TYPE_COLORS[d.type] ?? "oklch(var(--muted-foreground))"
        },
        children: d.type
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-4 rounded bg-muted/30 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full rounded",
        style: {
          width: `${d.pct}%`,
          background: TYPE_COLORS[d.type] ?? "oklch(var(--muted-foreground)/0.5)"
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-14 text-xs tabular-nums text-right text-muted-foreground", children: [
      d.count,
      " (",
      d.pct,
      "%)"
    ] })
  ] }, d.type)) });
}
const ROLE_COLORS = {
  Threat: "oklch(var(--analysis-critical)/0.8)",
  Answer: "oklch(var(--primary))",
  Draw: "oklch(var(--info))",
  Resource: "oklch(var(--status-published))",
  Defense: "oklch(var(--status-playtesting))",
  Utility: "oklch(var(--muted-foreground))",
  Other: "oklch(var(--muted-foreground)/0.5)"
};
function RoleDistChart({ dist }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "analysis.role_distribution", children: dist.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "w-16 text-xs font-medium",
        style: {
          color: ROLE_COLORS[d.role] ?? "oklch(var(--muted-foreground))"
        },
        children: d.role
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-4 rounded bg-muted/30 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full rounded",
        style: {
          width: `${d.pct}%`,
          background: ROLE_COLORS[d.role] ?? "oklch(var(--muted-foreground)/0.4)"
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-14 text-xs tabular-nums text-right text-muted-foreground", children: [
      d.count,
      " (",
      d.pct,
      "%)"
    ] })
  ] }, d.role)) });
}
function SectionBlock({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4", children: title }),
    children
  ] });
}
function AnalysisPage() {
  const { actor, isFetching } = useActor(createActor);
  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCards(BigInt(1));
    },
    enabled: !!actor && !isFetching
  });
  const { data: decks = [], isLoading: decksLoading } = useQuery({
    queryKey: ["decks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDecks(null, BigInt(1));
    },
    enabled: !!actor && !isFetching
  });
  const isLoading = cardsLoading || decksLoading;
  const targetDeck = decks.find((d) => d.name === "Midrange Value") ?? decks[0];
  const cardMap = new Map(
    cards.map((c) => [
      c.id,
      { cost: c.cost, cardType: c.cardType, tags: c.tags }
    ])
  );
  const curve = targetDeck ? getCostCurve(targetDeck, cardMap) : [];
  const typeDist = targetDeck ? getTypeDist(targetDeck, cardMap) : [];
  const roleDist = targetDeck ? getRoleDist(targetDeck, cardMap) : [];
  const totalCards = targetDeck ? targetDeck.cards.reduce((s, e) => s + Number(e.count), 0) : 0;
  const avgCost = targetDeck && totalCards > 0 ? (curve.reduce((s, b) => s + b.cost * b.count, 0) / totalCards).toFixed(
    1
  ) : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl space-y-6", "data-ocid": "analysis.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold", children: "Deck Analysis" }),
        targetDeck && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          "Showing:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: targetDeck.name }),
          " ",
          "· ",
          totalCards,
          " cards"
        ] })
      ] }),
      !isLoading && targetDeck && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Avg. cost" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-2xl font-display font-bold tabular-nums",
            style: { color: "oklch(var(--primary))" },
            children: avgCost
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }, n)) }) : !targetDeck ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 rounded-2xl border border-border",
        style: { background: "oklch(var(--card))" },
        "data-ocid": "analysis.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-10 h-10 text-muted-foreground opacity-30 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No decks to analyse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Build a deck in the Deck Builder first." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionBlock, { title: "Mana Cost Curve", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CostCurveChart, { curve }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionBlock, { title: "Card Type Distribution", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypeDistChart, { dist: typeDist }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionBlock, { title: "Role Distribution", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleDistChart, { dist: roleDist }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border p-4",
          style: {
            background: "oklch(var(--info)/0.06)",
            borderColor: "oklch(var(--info)/0.25)"
          },
          "data-ocid": "analysis.synergy_note",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs font-semibold",
                style: { color: "oklch(var(--info))" },
                children: "Coming soon"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Full synergy analysis — combo detection, simulated draws, mulligan rate, and the relationship map — is in development." })
          ]
        }
      )
    ] })
  ] });
}
export {
  AnalysisPage as default
};
