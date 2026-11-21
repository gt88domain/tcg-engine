import { u as useGame, j as jsxRuntimeExports, W as WandSparkles, L as Link, B as BookOpen, f as Layers, g as ListChecks } from "./index-Ch41Ib91.js";
import { A as ArrowRight } from "./arrow-right-TKHCIIQm.js";
const sections = [
  {
    id: "game-rules",
    label: "Game Rules",
    desc: "Define resource system, card types, win conditions, and turn structure.",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5" }),
    path: "/design/game-rules"
  },
  {
    id: "cards",
    label: "Card Library",
    desc: "Create and manage all cards in your game with the structured ability builder.",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-5 h-5" }),
    path: "/design/cards"
  },
  {
    id: "decks",
    label: "Decks",
    desc: "Build starter and preconstructed decks with live cost-curve analysis.",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "w-5 h-5" }),
    path: "/design/decks"
  }
];
function DesignWorkspacePage() {
  const { gameName } = useGame();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 max-w-3xl", "data-ocid": "design.workspace_page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "w-5 h-5", style: { color: "oklch(var(--primary))" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-lg font-display font-bold", children: [
        gameName,
        " — Design Workspace"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Build your game from the ground up. Define the rules, create cards, and assemble decks." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: sections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: s.path, "data-ocid": `design.${s.id}_link`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-[oklch(var(--primary))] transition-colors duration-150 group cursor-pointer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "p-2 rounded-lg shrink-0",
          style: { background: "oklch(var(--primary) / 0.15)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(var(--primary))" }, children: s.icon })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: s.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: s.desc })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity" })
    ] }) }, s.id)) })
  ] });
}
export {
  DesignWorkspacePage as default
};
