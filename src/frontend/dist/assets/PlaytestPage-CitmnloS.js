import { r as reactExports, j as jsxRuntimeExports, a8 as FlaskConical } from "./index-Ch41Ib91.js";
function PlaytestPage() {
  const [showInvite, setShowInvite] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-col items-center justify-center h-full min-h-[400px] p-8",
        "data-ocid": "playtest.empty_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 text-center max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-7 w-7 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground font-display", children: "Run Your First Playtest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Solo playtests let you feel the game before you invite others. Invite playtester links let others join." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "playtest.start_solo.primary_button",
              style: {
                background: "var(--primary)",
                color: "white",
                borderRadius: "0.5rem",
                padding: "0.625rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer"
              },
              onClick: () => {
              },
              children: "Start Solo Playtest"
            }
          )
        ] })
      }
    );
  }
}
export {
  PlaytestPage as default
};
