import { u as useGame, a as useAuth, b as useActor, c as useQuery, j as jsxRuntimeExports, S as Swords, d as Skeleton, U as Users, R as Radio, B as BookOpen, L as Link, e as createActor } from "./index-Ch41Ib91.js";
import { B as Badge } from "./badge-UtblI1Uf.js";
import { B as Button } from "./button-BHF8-SKr.js";
import { C as Card, a as CardContent } from "./card-COfiP1uU.js";
import { C as CircleAlert } from "./circle-alert-DLzG0qpP.js";
import { P as Plus } from "./plus-BKBsPs_y.js";
import { A as ArrowRight } from "./arrow-right-TKHCIIQm.js";
import "./index-CyXusObr.js";
function StatCard({
  label,
  value,
  icon,
  loading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-start gap-4 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "p-2 rounded-lg shrink-0",
        style: { background: "oklch(var(--primary) / 0.15)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(var(--primary))" }, children: icon })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: label }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold tabular-nums mt-0.5", children: value })
    ] })
  ] }) });
}
function CardWinRateRow({
  stat,
  cardName,
  index
}) {
  const winRate = Number(stat.uses) > 0 ? Math.round(Number(stat.wins) / Number(stat.uses) * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30",
      "data-ocid": `dashboard.card_winrate.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: cardName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground tabular-nums", children: [
            stat.uses.toString(),
            " uses"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-semibold tabular-nums",
              style: {
                color: winRate >= 60 ? "oklch(var(--analysis-good))" : winRate >= 40 ? "oklch(var(--analysis-warning))" : "oklch(var(--analysis-critical))"
              },
              children: [
                winRate,
                "%"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function RecentGameRow({ game, index }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30",
      "data-ocid": `dashboard.recent_game.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "w-2 h-2 rounded-full shrink-0",
              style: {
                background: "oklch(var(--status-published))"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm truncate", children: [
            "Turn ",
            game.finalTurn.toString(),
            " ·",
            " ",
            game.endCondition === "HealthZero" ? "Health Zero" : game.endCondition === "Forfeit" ? "Forfeit" : "Concede"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground tabular-nums shrink-0 ml-2", children: new Date(Number(game.completedAt) / 1e6).toLocaleDateString() })
      ]
    }
  );
}
function DashboardPage() {
  var _a;
  const { game, isLoading, isPublished, isOwner } = useGame();
  const { isAuthenticated, login } = useAuth();
  const { actor, isFetching } = useActor(createActor);
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardData();
    },
    enabled: !!actor && !isFetching
  });
  const { data: allCards = [] } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCards((game == null ? void 0 : game.id) ?? BigInt(1));
    },
    enabled: !!actor && !isFetching
  });
  const cardNameMap = new Map(allCards.map((c) => [c.id.toString(), c.name]));
  const stats = dashboardData == null ? void 0 : dashboardData.stats;
  const cardWinRates = (stats == null ? void 0 : stats.cardWinRates) ?? [];
  const recentGames = (stats == null ? void 0 : stats.recentGames) ?? [];
  const gamesPlayed = Number((stats == null ? void 0 : stats.gamesPlayed) ?? 0);
  const activePlayers = Number((stats == null ? void 0 : stats.activePlayers) ?? 0);
  const sortedWinRates = [...cardWinRates].sort(
    (a, b) => Number(b.uses) - Number(a.uses)
  );
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center h-full gap-6 p-8 text-center",
        "data-ocid": "dashboard.unauthenticated",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-16 h-16 rounded-2xl flex items-center justify-center",
              style: { background: "oklch(var(--primary) / 0.15)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Swords,
                {
                  className: "w-8 h-8",
                  style: { color: "oklch(var(--primary))" }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: "Welcome to your TCG" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm", children: "Sign in with Internet Identity to design your game or start playing." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "lg",
              onClick: () => login(),
              "data-ocid": "dashboard.login_button",
              style: {
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))"
              },
              children: "Sign in to get started"
            }
          )
        ]
      }
    );
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [...Array(4)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: positional skeleton
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24" }, i)
      )) })
    ] });
  }
  if (!game && isOwner === false) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-4 p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-10 h-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No game found for this instance." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 max-w-5xl", "data-ocid": "dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold", children: (game == null ? void 0 : game.name) ?? "Your Game" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          className: "text-xs",
          style: {
            background: isPublished ? "oklch(var(--status-published) / 0.2)" : "oklch(var(--status-draft) / 0.2)",
            color: isPublished ? "oklch(var(--status-published))" : "oklch(var(--status-draft))",
            border: "none"
          },
          children: isPublished ? "Published" : "In Development"
        }
      ),
      game && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
        "v",
        game.version.toString()
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Games Played",
          value: dashboardLoading ? "…" : gamesPlayed,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Swords, { className: "w-5 h-5" }),
          loading: dashboardLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Active Players",
          value: dashboardLoading ? "…" : activePlayers,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5" }),
          loading: dashboardLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Status",
          value: isPublished ? "Live" : "Draft",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Card Types",
          value: ((_a = game == null ? void 0 : game.cardTypes) == null ? void 0 : _a.length) ?? 0,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.card_winrates_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Card Win Rates" }),
      dashboardLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" }, n)) }) : sortedWinRates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-6 rounded-xl border border-border bg-card",
          "data-ocid": "dashboard.card_winrates_empty_state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No games played yet. Win rates will appear here once players start playing." })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: sortedWinRates.slice(0, 6).map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CardWinRateRow,
        {
          stat,
          cardName: cardNameMap.get(stat.cardId.toString()) ?? `Card #${stat.cardId}`,
          index: i + 1
        },
        String(stat.cardId)
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.recent_games_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Recent Games" }),
      dashboardLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" }, n)) }) : recentGames.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-6 rounded-xl border border-border bg-card",
          "data-ocid": "dashboard.recent_games_empty_state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No games played yet." })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: recentGames.slice(0, 5).map((game2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        RecentGameRow,
        {
          game: game2,
          index: i + 1
        },
        String(game2.completedAt)
      )) })
    ] }),
    isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.quick_actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Quick Actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/design/cards", "data-ocid": "dashboard.new_card_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border hover:border-[oklch(var(--primary))] transition-colors duration-150 cursor-pointer group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Plus,
            {
              className: "w-4 h-4",
              style: { color: "oklch(var(--primary))" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "New Card" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/design/game-rules", "data-ocid": "dashboard.edit_rules_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border hover:border-[oklch(var(--primary))] transition-colors duration-150 cursor-pointer group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            BookOpen,
            {
              className: "w-4 h-4",
              style: { color: "oklch(var(--primary))" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Edit Rules" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/publish", "data-ocid": "dashboard.publish_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border hover:border-[oklch(var(--primary))] transition-colors duration-150 cursor-pointer group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Radio,
            {
              className: "w-4 h-4",
              style: { color: "oklch(var(--primary))" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: isPublished ? "Manage Visibility" : "Publish Game" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" })
        ] }) }) })
      ] })
    ] }),
    !isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", "data-ocid": "dashboard.player_actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          style: {
            background: "oklch(var(--primary))",
            color: "oklch(var(--primary-foreground))"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/play", "data-ocid": "dashboard.play_now_button", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Swords, { className: "w-4 h-4 mr-2" }),
            "Play Now"
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/my-decks", "data-ocid": "dashboard.my_decks_button", children: "My Decks" }) })
    ] })
  ] });
}
export {
  DashboardPage as default
};
