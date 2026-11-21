import { u as useGame, _ as usePlayerRole, h as useUpdateGame, r as reactExports, j as jsxRuntimeExports, d as Skeleton, a7 as Lock, a4 as ue } from "./index-Ch41Ib91.js";
import { B as Button } from "./button-BHF8-SKr.js";
import { I as Input } from "./input-CV14CozU.js";
import { L as Label } from "./label-TE4_J2Pw.js";
import { S as Save } from "./save-BJZuHhJY.js";
import "./index-CyXusObr.js";
import "./index-Bqm77G7d.js";
function SettingsPage() {
  const { game, isLoading, isOwner } = useGame();
  const { isLoading: roleLoading } = usePlayerRole();
  const updateGame = useUpdateGame();
  const [name, setName] = reactExports.useState((game == null ? void 0 : game.name) ?? "");
  const [description, setDescription] = reactExports.useState("");
  const [handSize, setHandSize] = reactExports.useState(7);
  const [resourceCap, setResourceCap] = reactExports.useState(10);
  const isMutating = updateGame.isPending;
  async function handleSave(e) {
    e.preventDefault();
    if (!isOwner) return;
    try {
      await updateGame.mutateAsync({
        gameName: name || void 0
      });
      ue.success("Settings saved");
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to save");
    }
  }
  if (isLoading || roleLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-2xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" })
    ] });
  }
  if (!isOwner) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-[60vh]",
        "data-ocid": "settings.access_denied",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-8 h-8 mx-auto text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Only the game owner can change settings." })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-2xl mx-auto space-y-6", "data-ocid": "settings.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold", children: "Game Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border p-5 space-y-4",
          style: { background: "oklch(var(--card))" },
          "data-ocid": "settings.identity_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Identity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "game-name", className: "text-sm", children: "Game Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "game-name",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  placeholder: "My Trading Card Game",
                  className: "bg-background",
                  "data-ocid": "settings.name_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "game-desc", className: "text-sm", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "game-desc",
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                  placeholder: "A short description of your game",
                  className: "bg-background",
                  "data-ocid": "settings.description_input"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border p-5 space-y-4",
          style: { background: "oklch(var(--card))" },
          "data-ocid": "settings.rules_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Rules" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "hand-size", className: "text-sm", children: "Hand Size Limit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "hand-size",
                  type: "number",
                  min: 1,
                  max: 20,
                  value: handSize,
                  onChange: (e) => setHandSize(Number(e.target.value)),
                  className: "bg-background w-32",
                  "data-ocid": "settings.hand_size_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "resource-cap", className: "text-sm", children: "Resource Cap" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "resource-cap",
                  type: "number",
                  min: 1,
                  max: 99,
                  value: resourceCap,
                  onChange: (e) => setResourceCap(Number(e.target.value)),
                  className: "bg-background w-32",
                  "data-ocid": "settings.resource_cap_input"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border p-5 space-y-2",
          style: { background: "oklch(var(--card))" },
          "data-ocid": "settings.template_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Template" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: "Resource + Combat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "The game template cannot be changed after creation." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          disabled: isMutating,
          className: "gap-2",
          "data-ocid": "settings.save_button",
          style: {
            background: "oklch(var(--primary))",
            color: "oklch(var(--primary-foreground))"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
            isMutating ? "Saving…" : "Save Changes"
          ]
        }
      )
    ] })
  ] });
}
export {
  SettingsPage as default
};
