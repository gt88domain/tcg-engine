import { u as useGame, a as useAuth, _ as usePlayerRole, b as useActor, c as useQuery, j as jsxRuntimeExports, d as Skeleton, L as Link, S as Swords, B as BookOpen, g as ListChecks, e as createActor } from "./index-Ch41Ib91.js";
import { B as Button } from "./button-BHF8-SKr.js";
import { e as useDecks } from "./useDecks-ndD26K18.js";
import { T as Trophy } from "./trophy-DvNsf82w.js";
import { U as User } from "./user-BRQZiytH.js";
import "./index-CyXusObr.js";
function RecordBadge({
  wins,
  losses,
  gamesPlayed
}) {
  if (gamesPlayed === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "No games yet" });
  }
  const winRate = gamesPlayed > 0 ? Math.round(wins / gamesPlayed * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "font-semibold tabular-nums",
        style: { color: "oklch(var(--status-published))" },
        children: [
          wins,
          "W"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "font-semibold tabular-nums",
        style: { color: "oklch(var(--danger))" },
        children: [
          losses,
          "L"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground tabular-nums", children: [
      winRate,
      "%"
    ] })
  ] });
}
function PlayHomePage() {
  const { game, isLoading, gameName } = useGame();
  const { isAuthenticated, principal } = useAuth();
  const { player, isLoading: roleLoading } = usePlayerRole();
  const { actor, isFetching } = useActor(createActor);
  const { data: myDecks = [], isLoading: decksLoading } = useDecks(
    game == null ? void 0 : game.id,
    principal ?? void 0
  );
  const { data: playerAccount, isLoading: playerLoading } = useQuery({
    queryKey: ["player", principal == null ? void 0 : principal.toText()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getPlayer(principal);
    },
    enabled: !!actor && !isFetching && !!principal && isAuthenticated
  });
  const record = (playerAccount == null ? void 0 : playerAccount.record) ?? (player == null ? void 0 : player.record);
  if (isLoading || roleLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-2xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-2xl mx-auto space-y-5", "data-ocid": "play_home.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl border border-border p-8",
        style: { background: "oklch(var(--card))" },
        "data-ocid": "play_home.identity_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground tracking-tight", children: gameName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-2 max-w-md mx-auto", children: [
              "Welcome to ",
              gameName,
              ". Build your deck and challenge other players."
            ] }),
            game && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
              "Designed by",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs", children: [
                game.designerPrincipal.toText().slice(0, 8),
                "…"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-center mt-6 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/play/new", "data-ocid": "play_home.play_now_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                className: "gap-2 px-8",
                style: {
                  background: "oklch(var(--primary))",
                  color: "oklch(var(--primary-foreground))"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Swords, { className: "w-4 h-4" }),
                  "Play Now"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/how-to-play", "data-ocid": "play_home.how_to_play_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", className: "gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4" }),
              "How To Play"
            ] }) })
          ] })
        ]
      }
    ),
    isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border p-5 flex items-center justify-between gap-4",
        style: { background: "oklch(var(--card))" },
        "data-ocid": "play_home.my_record_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-8 h-8 rounded-full flex items-center justify-center",
                style: { background: "oklch(var(--primary)/0.12)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Trophy,
                  {
                    className: "w-4 h-4",
                    style: { color: "oklch(var(--primary))" }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest", children: "My Record" }),
              playerLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 mt-1" }) : record ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                RecordBadge,
                {
                  wins: Number(record.wins),
                  losses: Number(record.losses),
                  gamesPlayed: Number(record.gamesPlayed)
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No games yet" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", "data-ocid": "play_home.profile_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "gap-1.5 text-xs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5" }),
                "Profile"
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border p-5",
        style: { background: "oklch(var(--card))" },
        "data-ocid": "play_home.my_decks_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ListChecks,
                {
                  className: "w-4 h-4",
                  style: { color: "oklch(var(--primary))" }
                }
              ),
              "My Decks"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/my-decks", "data-ocid": "play_home.view_decks_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "text-xs h-7",
                children: "View All"
              }
            ) })
          ] }),
          decksLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 rounded-lg" }, n)) }) : myDecks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-4",
              "data-ocid": "play_home.decks_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No decks yet." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/my-decks", "data-ocid": "play_home.build_deck_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
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
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: myDecks.slice(0, 3).map((deck, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30",
              "data-ocid": `play_home.deck_item.${i + 1}`,
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
  PlayHomePage as default
};
