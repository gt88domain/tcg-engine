import { k as createLucideIcon, u as useGame, b as useActor, a as useAuth, a0 as useQueryClient, Y as useNavigate, r as reactExports, c as useQuery, a1 as useMutation, j as jsxRuntimeExports, d as Skeleton, U as Users, I as Check, S as Swords, a4 as ue, e as createActor } from "./index-Ch41Ib91.js";
import { B as Badge } from "./badge-UtblI1Uf.js";
import { B as Button } from "./button-BHF8-SKr.js";
import { L as Link2, C as Copy } from "./link-2-B1w4sLIi.js";
import { A as ArrowRight } from "./arrow-right-TKHCIIQm.js";
import "./index-CyXusObr.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
];
const Bot = createLucideIcon("bot", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode);
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
function CopyField({ value, ocid }) {
  const [copied, setCopied] = reactExports.useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
    ue.success("Copied!");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm font-mono truncate",
        style: { color: "oklch(var(--foreground))" },
        children: value
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: handleCopy,
        "data-ocid": ocid,
        "aria-label": "Copy",
        className: "p-2 rounded-lg border border-border hover:bg-muted transition-colors duration-150",
        children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4 text-muted-foreground" })
      }
    )
  ] });
}
function NewGamePage() {
  var _a;
  const { game, isLoading: gameLoading } = useGame();
  const { actor, isFetching } = useActor(createActor);
  const { principal } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mode, setMode] = reactExports.useState(null);
  const [selectedDeckId, setSelectedDeckId] = reactExports.useState(null);
  const [waitingSession, setWaitingSession] = reactExports.useState(null);
  const { data: myDecks = [], isLoading: decksLoading } = useQuery({
    queryKey: ["decks", "mine", principal == null ? void 0 : principal.toText()],
    queryFn: async () => {
      if (!actor || !game || !principal) return [];
      return actor.listDecks(principal, game.id);
    },
    enabled: !!actor && !isFetching && !!game && !!principal
  });
  const { data: starterDecks = [] } = useQuery({
    queryKey: ["decks", "starter", (_a = game == null ? void 0 : game.id) == null ? void 0 : _a.toString()],
    queryFn: async () => {
      if (!actor || !game) return [];
      const all = await actor.listDecks(null, game.id);
      return all.filter((d) => d.isStarterDeck);
    },
    enabled: !!actor && !isFetching && !!game
  });
  const allDecks = [
    ...starterDecks.filter((s) => !myDecks.some((m) => m.id === s.id)),
    ...myDecks
  ];
  const startMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !game) throw new Error("Not connected");
      const code = mode === "private" ? generateInviteCode() : `BOT-${generateInviteCode()}`;
      const session = await actor.createGameSession(game.id, code);
      return session;
    },
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ["game-sessions"] });
      if (mode === "practice") {
        ue.success("Practice session started!");
        navigate({
          to: "/play/game/$sessionId",
          params: { sessionId: session.id.toString() }
        });
      } else {
        setWaitingSession({
          inviteCode: session.inviteCode,
          sessionId: session.id.toString()
        });
      }
    },
    onError: (e) => ue.error(e.message)
  });
  const cancelSession = () => {
    setWaitingSession(null);
    setMode(null);
  };
  if (gameLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-2xl" })
    ] });
  }
  if (waitingSession) {
    const joinUrl = `${window.location.origin}/join/${waitingSession.inviteCode}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center min-h-[60vh] px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-md w-full mx-auto rounded-2xl border border-border p-8 space-y-5",
        style: { background: "oklch(var(--card))" },
        "data-ocid": "new_game.waiting_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4",
                style: { background: "oklch(var(--primary)/0.12)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LoaderCircle,
                  {
                    className: "w-6 h-6 animate-spin",
                    style: { color: "oklch(var(--primary))" }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-semibold", children: "Waiting for Opponent…" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Share the code or link below" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5", children: "Join Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-center py-3 rounded-xl",
                  style: { background: "oklch(var(--primary)/0.08)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-3xl font-display font-bold tracking-[0.15em]",
                      style: { color: "oklch(var(--primary))" },
                      children: waitingSession.inviteCode
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5", children: "Invite Link" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CopyField, { value: joinUrl, ocid: "new_game.copy_link_button" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "w-full",
              onClick: cancelSession,
              "data-ocid": "new_game.cancel_button",
              children: "Cancel"
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-xl mx-auto space-y-6", "data-ocid": "new_game.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "new_game.mode_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Choose Mode" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setMode("private"),
            "data-ocid": "new_game.private_mode_button",
            className: "flex flex-col items-start gap-3 p-5 rounded-xl border transition-colors duration-150 text-left",
            style: {
              borderColor: mode === "private" ? "oklch(var(--primary)/0.6)" : "oklch(var(--border))",
              background: mode === "private" ? "oklch(var(--primary)/0.07)" : "oklch(var(--card))"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-9 h-9 rounded-lg flex items-center justify-center",
                  style: {
                    background: "oklch(var(--primary)/0.12)",
                    color: "oklch(var(--primary))"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Private Game" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Invite a specific opponent via link or code" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setMode("practice"),
            "data-ocid": "new_game.practice_mode_button",
            className: "flex flex-col items-start gap-3 p-5 rounded-xl border transition-colors duration-150 text-left",
            style: {
              borderColor: mode === "practice" ? "oklch(var(--primary)/0.6)" : "oklch(var(--border))",
              background: mode === "practice" ? "oklch(var(--primary)/0.07)" : "oklch(var(--card))"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-9 h-9 rounded-lg flex items-center justify-center",
                  style: {
                    background: "oklch(var(--primary)/0.12)",
                    color: "oklch(var(--primary))"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-5 h-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Practice Mode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Play solo against a scripted opponent" })
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "new_game.deck_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Select Deck" }),
      decksLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }, n)) }) : allDecks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "py-8 text-center rounded-xl border border-border",
          "data-ocid": "new_game.decks_empty_state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No decks available. Build one first." })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "space-y-2",
          role: "radiogroup",
          "aria-label": "Deck selection",
          children: allDecks.map((deck, i) => {
            const selected = selectedDeckId === deck.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "aria-pressed": selected,
                onClick: () => setSelectedDeckId(deck.id),
                "data-ocid": `new_game.deck_item.${i + 1}`,
                className: "w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-colors duration-150 text-left",
                style: {
                  borderColor: selected ? "oklch(var(--primary)/0.6)" : "oklch(var(--border))",
                  background: selected ? "oklch(var(--primary)/0.07)" : "oklch(var(--card))"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link2,
                      {
                        className: "w-4 h-4",
                        style: {
                          color: selected ? "oklch(var(--primary))" : "oklch(var(--muted-foreground))"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: deck.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
                          deck.cards.reduce((s, e) => s + Number(e.count), 0),
                          " ",
                          "cards"
                        ] }),
                        deck.isStarterDeck && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "outline",
                            className: "text-[10px] px-1.5 py-0",
                            children: "Starter"
                          }
                        )
                      ] })
                    ] })
                  ] }),
                  selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Check,
                    {
                      className: "w-4 h-4 shrink-0",
                      style: { color: "oklch(var(--primary))" }
                    }
                  )
                ]
              },
              deck.id.toString()
            );
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        className: "w-full gap-2",
        disabled: !mode || startMutation.isPending || allDecks.length > 0 && selectedDeckId === null,
        onClick: () => startMutation.mutate(),
        "data-ocid": "new_game.start_button",
        style: {
          background: "oklch(var(--primary))",
          color: "oklch(var(--primary-foreground))"
        },
        children: startMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
          "Starting…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Swords, { className: "w-4 h-4" }),
          mode === "practice" ? "Start Practice" : mode === "private" ? "Create Game" : "Start Game",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-auto" })
        ] })
      }
    )
  ] });
}
export {
  NewGamePage as default
};
