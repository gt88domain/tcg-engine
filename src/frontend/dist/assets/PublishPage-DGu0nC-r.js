import { k as createLucideIcon, u as useGame, b as useActor, a0 as useQueryClient, r as reactExports, c as useQuery, a1 as useMutation, j as jsxRuntimeExports, d as Skeleton, R as Radio, a5 as ChevronRight, a4 as ue, U as Users, a6 as Globe, I as Check, e as createActor } from "./index-Ch41Ib91.js";
import { a as GameVisibility } from "./backend.d-BTU9fW2_.js";
import { B as Badge } from "./badge-UtblI1Uf.js";
import { B as Button } from "./button-BHF8-SKr.js";
import { P as Plus } from "./plus-BKBsPs_y.js";
import { L as Link2, C as Copy } from "./link-2-B1w4sLIi.js";
import "./index-CyXusObr.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$2);
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
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$1);
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
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
const VISIBILITY_OPTIONS = [
  {
    value: GameVisibility.Private,
    label: "Private",
    description: "Only you and invited collaborators can access.",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" })
  },
  {
    value: GameVisibility.InviteOnly,
    label: "Invite-Only",
    description: "Anyone with an invite link or join code can play.",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" })
  },
  {
    value: GameVisibility.Open,
    label: "Open",
    description: "Anyone who finds the link can join and play.",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4" })
  }
];
function CopyButton({ text, ocid }) {
  const [copied, setCopied] = reactExports.useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
    ue.success("Copied to clipboard");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: handleCopy,
      "data-ocid": ocid,
      "aria-label": "Copy to clipboard",
      className: "p-1.5 rounded-md hover:bg-muted transition-colors duration-150 text-muted-foreground hover:text-foreground",
      children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
    }
  );
}
function InviteLinkRow({ link, index }) {
  const joinUrl = `${window.location.origin}/join/${link.code}`;
  const isExpired = link.expiresAt !== void 0 && link.expiresAt < BigInt(Date.now() * 1e6);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card",
      "data-ocid": `publish.invite_link_item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "code",
              {
                className: "text-sm font-mono font-semibold tracking-wider",
                style: { color: "oklch(var(--primary))" },
                children: link.code
              }
            ),
            isExpired && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-xs",
                style: {
                  color: "oklch(var(--danger))",
                  borderColor: "oklch(var(--danger)/0.4)"
                },
                children: "Expired"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: joinUrl }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Used by ",
            link.usedBy.length,
            " player",
            link.usedBy.length !== 1 ? "s" : "",
            link.expiresAt !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 inline-flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
              "Expires",
              " ",
              new Date(
                Number(link.expiresAt) / 1e6
              ).toLocaleDateString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { text: joinUrl, ocid: `publish.copy_link_button.${index}` })
      ]
    }
  );
}
function PublishSettingsPage() {
  var _a;
  const { game, isLoading, isPublished, isOwner, refetch } = useGame();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [confirmUnpublish, setConfirmUnpublish] = reactExports.useState(false);
  const [selectedVisibility, setSelectedVisibility] = reactExports.useState(null);
  const currentVisibility = selectedVisibility ?? (game == null ? void 0 : game.visibility) ?? GameVisibility.Private;
  const {
    data: inviteLinks = [],
    isLoading: linksLoading,
    refetch: refetchLinks
  } = useQuery({
    queryKey: ["invite-links", (_a = game == null ? void 0 : game.id) == null ? void 0 : _a.toString()],
    queryFn: async () => {
      if (!actor || !game) return [];
      return actor.listInviteLinks(game.id);
    },
    enabled: !!actor && !isFetching && !!game
  });
  const publishMutation = useMutation({
    mutationFn: async (visibility) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.publishGame(visibility);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game"] });
      ue.success("Game published!");
      refetch();
    },
    onError: (e) => ue.error(e.message)
  });
  const unpublishMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.unpublishGame();
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game"] });
      ue.success("Game unpublished.");
      setConfirmUnpublish(false);
      refetch();
    },
    onError: (e) => ue.error(e.message)
  });
  const createLinkMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !game) throw new Error("Not connected");
      return actor.createInviteLink(game.id);
    },
    onSuccess: () => {
      refetchLinks();
      ue.success("Invite link created!");
    },
    onError: (e) => ue.error(e.message)
  });
  if (!isOwner) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-[60vh]",
        "data-ocid": "publish.access_denied",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Only the game owner can manage publish settings." })
      }
    );
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-2xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-2xl" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-2xl mx-auto space-y-6", "data-ocid": "publish.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "rounded-2xl border border-border p-6",
        style: { background: "oklch(var(--card))" },
        "aria-label": "Publish status",
        "data-ocid": "publish.status_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                className: "text-sm font-semibold px-3 py-1",
                variant: "outline",
                style: {
                  color: isPublished ? "oklch(var(--status-published))" : "oklch(var(--status-draft))",
                  borderColor: isPublished ? "oklch(var(--status-published)/0.4)" : "oklch(var(--status-draft)/0.4)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-3.5 h-3.5 mr-1.5" }),
                  isPublished ? "Published" : "Unpublished"
                ]
              }
            ),
            (game == null ? void 0 : game.publishedAt) !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1.5", children: [
              "Published",
              " ",
              new Date(
                Number(game.publishedAt) / 1e6
              ).toLocaleString(),
              " · ",
              "Version ",
              game.version.toString()
            ] })
          ] }),
          !isPublished ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: () => publishMutation.mutate(currentVisibility),
              disabled: publishMutation.isPending,
              "data-ocid": "publish.publish_button",
              style: {
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))"
              },
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-4 h-4" }),
                publishMutation.isPending ? "Publishing…" : "Publish Game"
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-end gap-2", children: !confirmUnpublish ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => setConfirmUnpublish(true),
              "data-ocid": "publish.unpublish_button",
              className: "gap-2 text-destructive border-destructive/30 hover:bg-destructive/5",
              children: "Unpublish"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 p-3 rounded-xl border border-destructive/30 bg-destructive/5",
              "data-ocid": "publish.unpublish_confirm_row",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TriangleAlert,
                  {
                    className: "w-4 h-4 shrink-0",
                    style: { color: "oklch(var(--danger))" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground", children: "Players can no longer start new games." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "destructive",
                    onClick: () => unpublishMutation.mutate(),
                    disabled: unpublishMutation.isPending,
                    "data-ocid": "publish.unpublish_confirm_button",
                    children: unpublishMutation.isPending ? "Unpublishing…" : "Confirm"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "ghost",
                    onClick: () => setConfirmUnpublish(false),
                    "data-ocid": "publish.unpublish_cancel_button",
                    children: "Cancel"
                  }
                )
              ]
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "rounded-2xl border border-border p-6",
        style: { background: "oklch(var(--card))" },
        "aria-label": "Visibility settings",
        "data-ocid": "publish.visibility_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4", children: "Visibility" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: VISIBILITY_OPTIONS.map((opt) => {
            const active = currentVisibility === opt.value;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setSelectedVisibility(opt.value);
                  if (isPublished) publishMutation.mutate(opt.value);
                },
                "data-ocid": `publish.visibility_option_${opt.value.toLowerCase()}`,
                className: "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors duration-150 text-left",
                style: {
                  borderColor: active ? "oklch(var(--primary)/0.6)" : "oklch(var(--border))",
                  background: active ? "oklch(var(--primary)/0.07)" : "transparent"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "shrink-0",
                      style: {
                        color: active ? "oklch(var(--primary))" : "oklch(var(--muted-foreground))"
                      },
                      children: opt.icon
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: opt.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: opt.description })
                  ] }),
                  active && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ChevronRight,
                    {
                      className: "w-4 h-4 shrink-0",
                      style: { color: "oklch(var(--primary))" }
                    }
                  )
                ]
              },
              opt.value
            );
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "rounded-2xl border border-border p-6",
        style: { background: "oklch(var(--card))" },
        "aria-label": "Invite links",
        "data-ocid": "publish.invite_links_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Invite Links" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: () => createLinkMutation.mutate(),
                disabled: createLinkMutation.isPending,
                "data-ocid": "publish.create_invite_link_button",
                className: "gap-1.5 h-8 text-xs",
                style: {
                  background: "oklch(var(--primary))",
                  color: "oklch(var(--primary-foreground))"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  createLinkMutation.isPending ? "Creating…" : "New Link"
                ]
              }
            )
          ] }),
          linksLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }, n)) }) : inviteLinks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-8",
              "data-ocid": "publish.invite_links_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-8 h-8 mx-auto text-muted-foreground opacity-40 mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No invite links yet." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Create one to share with players." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: inviteLinks.map((link, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(InviteLinkRow, { link, index: i + 1 }, link.code)) })
        ]
      }
    )
  ] });
}
export {
  PublishSettingsPage as default
};
