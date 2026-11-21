import { k as createLucideIcon, u as useGame, b as useActor, a0 as useQueryClient, r as reactExports, c as useQuery, a1 as useMutation, j as jsxRuntimeExports, U as Users, d as Skeleton, a4 as ue, H as ChevronDown, e as createActor } from "./index-Ch41Ib91.js";
import { R as Role } from "./backend.d-BTU9fW2_.js";
import { B as Badge } from "./badge-UtblI1Uf.js";
import "./index-CyXusObr.js";
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
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode);
const ROLE_OPTIONS = [
  { value: Role.Player, label: "Player" },
  { value: Role.CoDesigner, label: "Co-Designer" },
  { value: Role.Playtester, label: "Playtester" },
  { value: Role.Spectator, label: "Spectator" }
];
function roleColor(role) {
  switch (role) {
    case Role.Owner:
      return "oklch(var(--primary))";
    case Role.CoDesigner:
      return "oklch(var(--status-playtesting))";
    case Role.Playtester:
      return "oklch(var(--info))";
    case Role.Player:
      return "oklch(var(--status-published))";
    default:
      return "oklch(var(--muted-foreground))";
  }
}
function RoleSelect({
  player,
  onChange,
  isPending
}) {
  if (player.role === Role.Owner) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Badge,
      {
        variant: "outline",
        className: "text-xs",
        style: {
          color: roleColor(Role.Owner),
          borderColor: "oklch(var(--primary)/0.4)"
        },
        children: "Owner"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "select",
      {
        value: player.role,
        onChange: (e) => onChange(e.target.value),
        disabled: isPending,
        "data-ocid": `players.role_select.${player.principal.toText().slice(0, 8)}`,
        className: "appearance-none text-xs font-medium pr-6 pl-2 py-1 rounded-md border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
        style: { color: roleColor(player.role) },
        "aria-label": "Change player role",
        children: ROLE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, className: "text-foreground", children: opt.label }, opt.value))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ChevronDown,
      {
        className: "absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none",
        style: { color: roleColor(player.role) }
      }
    )
  ] });
}
function PlayerRow({
  player,
  index,
  onRoleChange,
  pendingPrincipal
}) {
  const record = player.record;
  const joinDate = new Date(
    Number(player.joinedAt) / 1e6
  ).toLocaleDateString();
  const isPending = pendingPrincipal === player.principal.toText();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-4 px-4 py-3.5 rounded-xl border border-border bg-card",
      "data-ocid": `players.player_item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
            style: {
              background: "oklch(var(--primary)/0.12)",
              color: "oklch(var(--primary))"
            },
            children: (player.username ?? player.principal.toText())[0].toUpperCase()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold truncate", children: player.username ?? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
            player.principal.toText().slice(0, 12),
            "…"
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "Joined ",
              joinDate
            ] }),
            Number(record.gamesPlayed) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              record.wins.toString(),
              "W / ",
              record.losses.toString(),
              "L"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RoleSelect,
          {
            player,
            onChange: (role) => onRoleChange(player.principal.toText(), role),
            isPending
          }
        )
      ]
    }
  );
}
function PlayersPage() {
  var _a;
  const { game, isOwner, isLoading: gameLoading } = useGame();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [pendingPrincipal, setPendingPrincipal] = reactExports.useState(null);
  const { data: players = [], isLoading: playersLoading } = useQuery({
    queryKey: ["players", (_a = game == null ? void 0 : game.id) == null ? void 0 : _a.toString()],
    queryFn: async () => {
      if (!actor || !game) return [];
      return actor.listPlayers(game.id);
    },
    enabled: !!actor && !isFetching && !!game
  });
  const roleChangeMutation = useMutation({
    mutationFn: async ({
      principalText,
      role
    }) => {
      if (!actor) throw new Error("Not connected");
      const player = players.find(
        (p) => p.principal.toText() === principalText
      );
      if (!player) throw new Error("Player not found");
      const result = await actor.updatePlayerRole(player.principal, role);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onMutate: ({ principalText }) => setPendingPrincipal(principalText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      ue.success("Role updated.");
    },
    onError: (e) => ue.error(e.message),
    onSettled: () => setPendingPrincipal(null)
  });
  if (!isOwner && !gameLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-[60vh]",
        "data-ocid": "players.access_denied",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Only the game owner can view player management." })
      }
    );
  }
  const isLoading = gameLoading || playersLoading;
  const playerCount = players.filter((p) => p.role === Role.Player).length;
  const totalGames = players.reduce(
    (s, p) => s + Number(p.record.gamesPlayed),
    0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-3xl mx-auto space-y-6", "data-ocid": "players.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4", children: [
      {
        label: "Total Players",
        value: players.length,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" })
      },
      {
        label: "Active Players",
        value: playerCount,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-4 h-4" })
      },
      {
        label: "Games Played",
        value: totalGames,
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4" })
      }
    ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border p-4 text-center",
        style: { background: "oklch(var(--card))" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-1.5 text-muted-foreground mb-1", children: stat.icon }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-8 mx-auto" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xl font-display font-bold tabular-nums",
              style: { color: "oklch(var(--primary))" },
              children: stat.value
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: stat.label })
        ]
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "players.list_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Players" }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }, n)) }) : players.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-16 rounded-2xl border border-border",
          style: { background: "oklch(var(--card))" },
          "data-ocid": "players.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-10 h-10 text-muted-foreground opacity-30 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No players yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 text-center max-w-xs", children: "Invite players to your game using the Publish & Visibility settings." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: players.map((player, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        PlayerRow,
        {
          player,
          index: i + 1,
          onRoleChange: (principalText, role) => roleChangeMutation.mutate({ principalText, role }),
          pendingPrincipal
        },
        player.principal.toText()
      )) })
    ] })
  ] });
}
export {
  PlayersPage as default
};
