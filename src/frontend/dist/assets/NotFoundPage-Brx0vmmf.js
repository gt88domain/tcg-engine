import { j as jsxRuntimeExports, L as Link } from "./index-Ch41Ib91.js";
import { B as Button } from "./button-BHF8-SKr.js";
import { C as CircleAlert } from "./circle-alert-DLzG0qpP.js";
import "./index-CyXusObr.js";
function NotFoundPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center h-full gap-4 p-8 text-center",
      "data-ocid": "not_found.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-10 h-10 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-display font-bold", children: "Page not found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "The page you're looking for doesn't exist." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", "data-ocid": "not_found.home_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Go home" }) })
      ]
    }
  );
}
export {
  NotFoundPage as default
};
