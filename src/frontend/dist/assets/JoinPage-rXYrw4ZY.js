import { k as createLucideIcon, a2 as useParams, b as useActor, a as useAuth, u as useGame, a0 as useQueryClient, Y as useNavigate, r as reactExports, c as useQuery, a1 as useMutation, j as jsxRuntimeExports, d as Skeleton, S as Swords, a4 as ue, e as createActor } from "./index-Ch41Ib91.js";
import { R as Role } from "./backend.d-BTU9fW2_.js";
import { B as Button } from "./button-BHF8-SKr.js";
import { I as Input } from "./input-CV14CozU.js";
import { L as Label } from "./label-TE4_J2Pw.js";
import { C as CircleAlert } from "./circle-alert-DLzG0qpP.js";
import { U as User } from "./user-BRQZiytH.js";
import "./index-CyXusObr.js";
import "./index-Bqm77G7d.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode);
function JoinPage() {
  const { code } = useParams({ strict: false });
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated, principal, login } = useAuth();
  const { game } = useGame();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [username, setUsername] = reactExports.useState("");
  const [joiningAsGuest, setJoiningAsGuest] = reactExports.useState(false);
  const {
    data: inviteLink,
    isLoading,
    error: linkError
  } = useQuery({
    queryKey: ["invite-link", code],
    queryFn: async () => {
      if (!actor || !code) return null;
      return actor.getInviteLink(code);
    },
    enabled: !!actor && !isFetching && !!code,
    retry: false
  });
  const joinMutation = useMutation({
    mutationFn: async ({ asGuest }) => {
      if (!actor) throw new Error("Not connected");
      const useResult = await actor.useInviteLink(code);
      if (useResult.__kind__ === "err") throw new Error(useResult.err);
      if (principal && game) {
        const name = asGuest ? null : username.trim() || null;
        await actor.registerPlayer(principal, game.id, Role.Player, name);
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player"] });
      ue.success("Welcome! You've joined the game.");
      navigate({ to: "/play" });
    },
    onError: (e) => ue.error(e.message)
  });
  const isExpired = (inviteLink == null ? void 0 : inviteLink.expiresAt) !== void 0 && inviteLink.expiresAt < BigInt(Date.now() * 1e6);
  const linkInvalid = !isLoading && (!inviteLink || isExpired);
  if (isLoading || isFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full mx-auto px-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-xl" })
    ] }) });
  }
  if (linkInvalid || linkError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] px-6",
        "data-ocid": "join.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CircleAlert,
            {
              className: "w-12 h-12 mb-4",
              style: { color: "oklch(var(--danger))" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-display font-semibold text-foreground", children: "Invalid or Expired Link" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center mt-2 max-w-sm", children: "This invite link is no longer valid. Ask the game owner for a new one." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center min-h-[60vh] px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full mx-auto space-y-5", "data-ocid": "join.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl border border-border p-8 text-center",
        style: { background: "oklch(var(--card))" },
        "data-ocid": "join.game_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Swords,
            {
              className: "w-10 h-10 mx-auto mb-4",
              style: { color: "oklch(var(--primary))" },
              "aria-hidden": true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: (game == null ? void 0 : game.name) ?? "Join Game" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "You've been invited to play" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
              style: { background: "oklch(var(--primary)/0.1)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-xs font-mono font-semibold",
                  style: { color: "oklch(var(--primary))" },
                  children: [
                    "Code: ",
                    code
                  ]
                }
              )
            }
          )
        ]
      }
    ),
    isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border p-6 space-y-4",
        style: { background: "oklch(var(--card))" },
        "data-ocid": "join.auth_join_form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-8 h-8 rounded-full flex items-center justify-center",
                style: { background: "oklch(var(--primary)/0.12)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  User,
                  {
                    className: "w-4 h-4",
                    style: { color: "oklch(var(--primary))" }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Joining as" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-mono text-muted-foreground", children: [
                principal == null ? void 0 : principal.toText().slice(0, 12),
                "…"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "join-username", className: "text-xs font-medium", children: [
              "Display name",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "join-username",
                type: "text",
                placeholder: "Enter a display name",
                value: username,
                onChange: (e) => setUsername(e.target.value),
                "data-ocid": "join.username_input",
                maxLength: 32
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              className: "w-full gap-2",
              onClick: () => joinMutation.mutate({ asGuest: false }),
              disabled: joinMutation.isPending,
              "data-ocid": "join.join_button",
              style: {
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))"
              },
              children: joinMutation.isPending ? "Joining…" : "Join Game"
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border p-6 space-y-4",
        style: { background: "oklch(var(--card))" },
        "data-ocid": "join.unauthenticated_form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Sign in to save your progress and track your record." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              className: "w-full gap-2",
              onClick: () => login(),
              "data-ocid": "join.login_button",
              style: {
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-4 h-4" }),
                "Sign in with Internet Identity"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-full border-t border-border" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-card px-3 text-muted-foreground", children: "or" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "w-full gap-2",
              onClick: () => {
                setJoiningAsGuest(true);
              },
              "data-ocid": "join.guest_button",
              children: "Continue as Guest"
            }
          ),
          joiningAsGuest && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Guest sessions are not tracked across visits." })
        ]
      }
    )
  ] }) });
}
export {
  JoinPage as default
};
