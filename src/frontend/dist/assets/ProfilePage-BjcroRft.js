import { u as useGame, a as useAuth, _ as usePlayerRole, b as useActor, c as useQuery, j as jsxRuntimeExports, d as Skeleton, L as Link, S as Swords, e as createActor } from "./index-Ch41Ib91.js";
import { B as Button } from "./button-BHF8-SKr.js";
import { e as useDecks } from "./useDecks-ndD26K18.js";
import { U as User } from "./user-BRQZiytH.js";
import { T as Trophy } from "./trophy-DvNsf82w.js";
import "./index-CyXusObr.js";
function ProfilePage() {
  const { game } = useGame();
  const { isAuthenticated, principal } = useAuth();
  const { player, isLoading: roleLoading } = usePlayerRole();
  const { actor, isFetching } = useActor(createActor);
  const { data: playerAccount, isLoading: playerLoading } = useQuery({
    queryKey: ["player", principal == null ? void 0 : principal.toText()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getPlayer(principal);
    },
    enabled: !!actor && !isFetching && !!principal && isAuthenticated
  });
  const { data: myDecks = [], isLoading: decksLoading } = useDecks(
    game == null ? void 0 : game.id,
    principal ?? void 0
  );
  const record = playerAccount == null ? void 0 : playerAccount.record;
  const wins = Number((record == null ? void 0 : record.wins) ?? 0);
  const losses = Number((record == null ? void 0 : record.losses) ?? 0);
  const gamesPlayed = Number((record == null ? void 0 : record.gamesPlayed) ?? 0);
  const winRate = gamesPlayed > 0 ? Math.round(wins / gamesPlayed * 100) : 0;
  const displayName = (playerAccount == null ? void 0 : playerAccount.username) ?? "Player";
  const roleLabel = (player == null ? void 0 : player.role) ?? "Player";
  if (roleLoading || playerLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-2xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-2xl mx-auto space-y-5", "data-ocid": "profile.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-2xl border border-border p-6",
        style: { background: "oklch(var(--card))" },
        "data-ocid": "profile.header_card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-14 h-14 rounded-full flex items-center justify-center",
              style: { background: "oklch(var(--primary)/0.12)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                User,
                {
                  className: "w-7 h-7",
                  style: { color: "oklch(var(--primary))" }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold", children: displayName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground capitalize", children: roleLabel })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border p-5",
        style: { background: "oklch(var(--card))" },
        "data-ocid": "profile.stats_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Trophy,
              {
                className: "w-4 h-4",
                style: { color: "oklch(var(--primary))" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Match Record" })
          ] }),
          gamesPlayed === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-4",
              "data-ocid": "profile.record_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No matches played yet." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/play/new", "data-ocid": "profile.play_now_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "link",
                    size: "sm",
                    className: "text-xs mt-1 gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Swords, { className: "w-3.5 h-3.5" }),
                      "Play your first game"
                    ]
                  }
                ) })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-2xl font-display font-bold tabular-nums",
                  style: { color: "oklch(var(--status-published))" },
                  children: wins
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Wins" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-2xl font-display font-bold tabular-nums",
                  style: { color: "oklch(var(--danger))" },
                  children: losses
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Losses" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-display font-bold tabular-nums text-foreground", children: [
                winRate,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Win Rate" })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border p-5",
        style: { background: "oklch(var(--card))" },
        "data-ocid": "profile.decks_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-3", children: "My Decks" }),
          decksLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 rounded-lg" }, n)) }) : myDecks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-4",
              "data-ocid": "profile.decks_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No decks yet." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/my-decks", "data-ocid": "profile.build_deck_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "link",
                    size: "sm",
                    className: "text-xs mt-1",
                    children: "Build your first deck"
                  }
                ) })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: myDecks.map((deck, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30",
              "data-ocid": `profile.deck_item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium truncate", children: deck.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums shrink-0 ml-2", children: [
                  deck.cards.reduce((s, e) => s + Number(e.count), 0),
                  " cards"
                ] })
              ]
            },
            deck.id.toString()
          )) })
        ]
      }
    )
  ] });
}
export {
  ProfilePage as default
};
