import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { usePlayerRole } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { cn } from "@/lib/utils";
import { useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, Gamepad2, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";

function getPageTitle(pathname: string): string {
  if (pathname === "/" || pathname === "/dashboard") return "Dashboard";
  if (pathname === "/design") return "Design Workspace";
  if (pathname === "/design/game-rules") return "Game Rules";
  if (pathname === "/design/cards") return "Card Library";
  if (pathname === "/design/decks") return "Decks";
  if (pathname === "/play") return "Play";
  if (pathname.startsWith("/play/game/")) return "Live Game";
  if (pathname === "/play/new") return "New Game";
  if (pathname.startsWith("/join/")) return "Join Game";
  if (pathname === "/publish") return "Publish & Visibility";
  return "";
}

export function Header() {
  const { gameName } = useGame();
  const { isAuthenticated, login, logout, principal } = useAuth();
  const { isOwner } = usePlayerRole();
  const { theme, setTheme } = useTheme();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const pageTitle = getPageTitle(pathname);

  const shortPrincipal = principal
    ? `${principal.toText().slice(0, 5)}…`
    : null;

  const isPlayContext = pathname.startsWith("/play/game/");

  return (
    <header
      className={cn(
        "flex h-14 items-center gap-4 border-b px-4 shrink-0",
        "bg-[var(--header-surface,var(--card))] border-[var(--border)]",
        "z-40 relative",
      )}
      data-ocid="app.header"
    >
      {/* Left: brand + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <Gamepad2
            className="w-5 h-5"
            style={{ color: "oklch(var(--primary))" }}
            aria-hidden
          />
          <span
            className="font-display text-base font-semibold tracking-tight truncate max-w-[140px]"
            style={{ color: "oklch(var(--primary))" }}
          >
            {gameName}
          </span>
        </div>
        {pageTitle && !isPlayContext && (
          <>
            <span className="text-[var(--muted-foreground)] opacity-40 select-none">
              |
            </span>
            <span className="text-sm font-medium text-foreground truncate">
              {pageTitle}
            </span>
          </>
        )}
      </div>

      {/* Center: search */}
      {!isPlayContext && (
        <div className="flex-1 flex justify-center px-4">
          <div
            className="relative w-full max-w-sm"
            data-ocid="app.search_input"
          >
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Global search…"
              className={cn(
                "w-full pl-9 pr-3 py-1.5 text-sm rounded-md",
                "bg-[var(--muted)] border border-[var(--border)]",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-[oklch(var(--ring))]",
                "transition-colors duration-150",
              )}
              aria-label="Global search"
            />
          </div>
        </div>
      )}

      {/* Right: actions */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          type="button"
          aria-label="Toggle theme"
          data-ocid="app.theme_toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-8 h-8 text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>

        {/* Notifications */}
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            aria-label="Notifications"
            data-ocid="app.notifications_button"
            className="w-8 h-8 text-muted-foreground hover:text-foreground relative"
          >
            <Bell className="w-4 h-4" />
          </Button>
        )}

        {/* Avatar / auth */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-[var(--muted)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(var(--ring))]"
                data-ocid="app.avatar_button"
                aria-label="Account menu"
              >
                <Avatar className="w-7 h-7">
                  <AvatarFallback
                    className="text-xs"
                    style={{
                      background: "oklch(var(--primary))",
                      color: "oklch(var(--primary-foreground))",
                    }}
                  >
                    {isOwner ? "D" : "P"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {shortPrincipal}
                </span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                disabled
                className="text-xs text-muted-foreground"
              >
                {isOwner ? "Designer (Owner)" : "Player"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                data-ocid="app.logout_button"
                className="text-destructive focus:text-destructive"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={() => login()}
            data-ocid="app.login_button"
            style={{
              background: "oklch(var(--primary))",
              color: "oklch(var(--primary-foreground))",
            }}
            className="h-8 text-xs"
          >
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
