import { Button } from "@/components/ui/button";
import { useRouterState } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";

// Shared stub page for routes not yet fully implemented.
// These will be replaced by dedicated pages in subsequent build phases.
export default function StubPage() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const pageName =
    pathname
      .split("/")
      .filter(Boolean)
      .map((s) => s.replace(/-/g, " "))
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" / ") || "Page";

  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-5 p-8 text-center"
      data-ocid="stub.page"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: "oklch(var(--primary) / 0.12)" }}
      >
        <Construction
          className="w-7 h-7"
          style={{ color: "oklch(var(--primary))" }}
        />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-lg font-display font-semibold">{pageName}</h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          This section is coming in the next build phase.
        </p>
      </div>
      <Button asChild variant="outline" size="sm" data-ocid="stub.home_button">
        <Link to="/">← Back to Dashboard</Link>
      </Button>
    </div>
  );
}
