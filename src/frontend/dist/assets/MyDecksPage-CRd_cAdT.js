import { k as createLucideIcon, b as useActor, c as useQuery, j as jsxRuntimeExports, L as Link, f as Layers, d as Skeleton, e as createActor } from "./index-Ch41Ib91.js";
import { B as Badge } from "./badge-UtblI1Uf.js";
import { B as Button } from "./button-BHF8-SKr.js";
import { C as Card, a as CardContent } from "./card-COfiP1uU.js";
import "./index-CyXusObr.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode);
const DECK_DESCRIPTIONS = {
  "Starter Deck": "Balanced introduction to Aura TCG. All card types represented, low variance.",
  "Aggro Rush": "Flood the board fast with low-cost threats and burn spells. Win by turn 8.",
  "Control Wall": "High-defense creatures and counter-spells. Outlast the opponent and win with card advantage.",
  "Midrange Value": "Efficient creatures backed by targeted removal. Strong at every stage of the game.",
  "Burn Storm": "Direct damage from hand. Your opponent's life total is the only resource that matters.",
  "Ramp Titan": "Accelerate mana early, drop enormous threats late. Unstoppable after turn 6."
};
function DeckCard({ deck, index }) {
  const totalCards = deck.cards.reduce((s, e) => s + Number(e.count), 0);
  const updatedDate = new Date(
    Number(deck.updatedAt) / 1e6
  ).toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  const description = DECK_DESCRIPTIONS[deck.name] ?? "A custom deck for Aura TCG.";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "border-border bg-card flex flex-col",
      "data-ocid": `my_decks.deck_card.${index}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 flex flex-col gap-3 h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                style: { background: "oklch(var(--primary)/0.12)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Layers,
                  {
                    className: "w-4 h-4",
                    style: { color: "oklch(var(--primary))" }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold truncate", children: deck.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground tabular-nums", children: [
                totalCards,
                " cards"
              ] })
            ] })
          ] }),
          deck.isStarterDeck && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: "text-xs shrink-0",
              style: {
                background: "oklch(var(--info)/0.15)",
                color: "oklch(var(--info))",
                border: "none"
              },
              children: "Starter"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed flex-1", children: description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Updated ",
            updatedDate
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              size: "sm",
              variant: "outline",
              className: "h-7 text-xs",
              "data-ocid": `my_decks.edit_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/design/decks", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-3 h-3 mr-1.5" }),
                "Edit"
              ] })
            }
          )
        ] })
      ] })
    }
  );
}
function MyDecksPage() {
  const { actor, isFetching } = useActor(createActor);
  const { data: decks = [], isLoading } = useQuery({
    queryKey: ["my-decks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDecks(null, BigInt(1));
    },
    enabled: !!actor && !isFetching
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-5xl", "data-ocid": "my_decks.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold", children: "My Decks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: isLoading ? "Loading…" : `${decks.length} deck${decks.length === 1 ? "" : "s"}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          style: {
            background: "oklch(var(--primary))",
            color: "oklch(var(--primary-foreground))"
          },
          "data-ocid": "my_decks.new_deck_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/design/decks", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4 mr-2" }),
            "New Deck"
          ] })
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 rounded-xl" }, n)) }) : decks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 rounded-2xl border border-border",
        style: { background: "oklch(var(--card))" },
        "data-ocid": "my_decks.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-10 h-10 text-muted-foreground opacity-30 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No decks yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 text-center max-w-xs", children: "Build your first deck from cards in the Card Library." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              size: "sm",
              className: "mt-4",
              style: {
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/design/cards", children: "Go to Card Library" })
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: decks.map((deck, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(DeckCard, { deck, index: i + 1 }, String(deck.id))) })
  ] });
}
export {
  MyDecksPage as default
};
