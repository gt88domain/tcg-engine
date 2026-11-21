import { BottomNav, Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useRouterState } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";

function getContext(pathname: string): "design" | "play" | "browse" {
  if (pathname.startsWith("/play/game/")) return "play";
  if (pathname.startsWith("/design")) return "design";
  return "browse";
}

interface ShellProps {
  children: ReactNode;
  /** Optional contextual right-panel content */
  rightPanel?: ReactNode;
}

export function Shell({ children, rightPanel }: ShellProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const context = getContext(pathname);
  const isPlayContext = context === "play";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col h-screen overflow-hidden",
          `context-${context}`,
        )}
        data-ocid="app.shell"
      >
        {/* Body row */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Sidebar — collapses to 0 in play context */}
          {!isPlayContext && (
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed((v) => !v)}
            />
          )}

          {/* Main content */}
          <main
            className={cn(
              "flex-1 overflow-y-auto bg-background min-w-0",
              // Extra bottom padding for mobile nav
              "pb-16 md:pb-0",
            )}
            data-ocid="app.main_content"
          >
            {children}
          </main>

          {/* Right panel — slides in when provided */}
          {rightPanel && !isPlayContext && (
            <aside
              className={cn(
                "hidden lg:flex flex-col w-80 shrink-0",
                "border-l border-border bg-card",
                "overflow-y-auto",
              )}
              data-ocid="app.right_panel"
            >
              {rightPanel}
            </aside>
          )}
        </div>

        {/* Mobile bottom nav */}
        {!isPlayContext && <BottomNav />}

        <Toaster richColors position="top-right" />
      </div>
    </TooltipProvider>
  );
}
