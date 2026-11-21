import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type DemoRole, useDemoMode } from "@/context/DemoModeContext";
import { usePlayerRole } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  HelpCircle,
  Layers,
  LayoutDashboard,
  ListChecks,
  Radio,
  Settings,
  Swords,
  Users,
  Wand2,
} from "lucide-react";
import { useState } from "react";

interface NavItemDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: NavItemDef[];
}

const ownerNav: NavItemDef[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    path: "/",
  },
  {
    id: "design",
    label: "Design",
    icon: <Wand2 className="w-4 h-4" />,
    path: "/design",
    children: [
      {
        id: "game-rules",
        label: "Game Rules",
        icon: <BookOpen className="w-4 h-4" />,
        path: "/design/game-rules",
      },
      {
        id: "cards",
        label: "Card Library",
        icon: <Layers className="w-4 h-4" />,
        path: "/design/cards",
      },
      {
        id: "decks",
        label: "Decks",
        icon: <ListChecks className="w-4 h-4" />,
        path: "/design/decks",
      },
      {
        id: "analysis",
        label: "Analysis",
        icon: <BarChart2 className="w-4 h-4" />,
        path: "/design/analysis",
      },
      {
        id: "playtest",
        label: "Playtest",
        icon: <FlaskConical className="w-4 h-4" />,
        path: "/design/playtest",
      },
    ],
  },
  {
    id: "play",
    label: "Play",
    icon: <Swords className="w-4 h-4" />,
    path: "/play",
  },
  {
    id: "players",
    label: "Players",
    icon: <Users className="w-4 h-4" />,
    path: "/players",
  },
  {
    id: "publish",
    label: "Publish / Visibility",
    icon: <Radio className="w-4 h-4" />,
    path: "/publish",
  },
  {
    id: "settings",
    label: "Game Settings",
    icon: <Settings className="w-4 h-4" />,
    path: "/settings",
  },
];

const playerNav: NavItemDef[] = [
  {
    id: "play",
    label: "Play",
    icon: <Swords className="w-4 h-4" />,
    path: "/play",
  },
  {
    id: "my-decks",
    label: "My Decks",
    icon: <ListChecks className="w-4 h-4" />,
    path: "/my-decks",
  },
  {
    id: "how-to-play",
    label: "How To Play",
    icon: <HelpCircle className="w-4 h-4" />,
    path: "/how-to-play",
  },
];

const ALL_ROLES: DemoRole[] = [
  "Owner",
  "CoDesigner",
  "Playtester",
  "Player",
  "Spectator",
];

const ROLE_LABELS: Record<DemoRole, string> = {
  Owner: "Owner",
  CoDesigner: "Co-Designer",
  Playtester: "Playtester",
  Player: "Player",
  Spectator: "Spectator",
};

const ROLE_COLORS: Record<DemoRole, string> = {
  Owner: "bg-amber-400/20 text-amber-200",
  CoDesigner: "bg-sky-400/20 text-sky-200",
  Playtester: "bg-violet-400/20 text-violet-200",
  Player: "bg-emerald-400/20 text-emerald-200",
  Spectator: "bg-white/10 text-white/50",
};

const ROLE_DOT_COLORS: Record<DemoRole, string> = {
  Owner: "bg-amber-400",
  CoDesigner: "bg-sky-400",
  Playtester: "bg-violet-400",
  Player: "bg-emerald-400",
  Spectator: "bg-white/40",
};

const ROLE_NAMES: Record<DemoRole, string> = {
  Owner: "Alex Designer",
  CoDesigner: "Sam Co-Designer",
  Playtester: "Jordan Tester",
  Player: "Taylor Player",
  Spectator: "Riley Watcher",
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { isOwner } = usePlayerRole();
  const { isPublished, gameName } = useGame();
  const { selectedRole, demoUser, setRole } = useDemoMode();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["design"]),
  );

  const navItems = isOwner ? ownerNav : playerNav;
  const displayName = demoUser?.name ?? "Guest";
  const initials = demoUser?.initials ?? "?";
  const currentRoleLabel = selectedRole ? ROLE_LABELS[selectedRole] : "Guest";
  const _roleBadgeClass = selectedRole
    ? ROLE_COLORS[selectedRole]
    : "bg-white/10 text-white/50";

  function isActive(path: string): boolean {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  function toggleExpand(id: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleRoleSelect(role: DemoRole) {
    setRole(role);
    setShowRoleSwitcher(false);
  }

  function NavItemRow({
    item,
    depth = 0,
  }: {
    item: NavItemDef;
    depth?: number;
  }) {
    const active = isActive(item.path);
    const hasChildren = !!item.children?.length;
    const expanded = expandedItems.has(item.id);

    const baseInactive = "text-white/60 hover:text-white hover:bg-white/[0.08]";
    const activeStyles =
      "text-white font-semibold bg-white/[0.12] border-l-[3px] border-[oklch(var(--sidebar-primary))] rounded-l-none pl-[calc(0.75rem-3px)]";

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              to={item.path}
              data-ocid={`sidebar.${item.id}_link`}
              className={cn(
                "flex items-center justify-center w-10 h-10 mx-auto rounded-md",
                "transition-all duration-150",
                active
                  ? "text-white bg-white/[0.12] border-l-2 border-[oklch(var(--sidebar-primary))]"
                  : "text-white/60 hover:text-white hover:bg-white/[0.08]",
              )}
              aria-label={item.label}
            >
              {item.icon}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      );
    }

    return (
      <div>
        {hasChildren ? (
          <button
            type="button"
            onClick={() => toggleExpand(item.id)}
            data-ocid={`sidebar.${item.id}_toggle`}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md",
              "text-sm font-medium transition-all duration-150",
              depth > 0 ? "pl-9" : "",
              active ? activeStyles : baseInactive,
            )}
            aria-expanded={expanded}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="flex-1 truncate">{item.label}</span>
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            )}
          </button>
        ) : (
          <Link
            to={item.path}
            data-ocid={`sidebar.${item.id}_link`}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md",
              "text-sm font-medium transition-all duration-150",
              depth > 0 ? "pl-9" : "",
              active ? activeStyles : baseInactive,
            )}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </Link>
        )}

        {hasChildren && expanded && !collapsed && (
          <div className="mt-0.5 space-y-0.5">
            {item.children!.map((child) => (
              <NavItemRow key={child.id} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside
      data-ocid="app.sidebar"
      className={cn(
        "hidden md:flex flex-col shrink-0 overflow-hidden h-full",
        "transition-[width] duration-200 ease-in-out",
        "border-r border-white/10",
        "bg-[oklch(0.28_0.12_220)] text-white",
      )}
      style={{ width: collapsed ? "64px" : "240px" }}
      aria-label="Sidebar navigation"
    >
      {/* Header: game name + chevron */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-white/10 shrink-0",
          collapsed ? "justify-center px-2" : "px-3 gap-2",
        )}
      >
        {!collapsed && (
          <span
            className="flex-1 min-w-0 truncate text-sm font-semibold text-white font-display"
            title={gameName}
          >
            {gameName}
          </span>
        )}
        <button
          type="button"
          onClick={onToggle}
          data-ocid="sidebar.collapse_toggle"
          className="w-7 h-7 flex items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-all duration-150 shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav items */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto py-3",
          collapsed ? "px-2" : "px-3",
        )}
        aria-label="Main navigation"
      >
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.id}>
              <NavItemRow item={item} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Status indicator */}
      {!collapsed && (
        <div className="px-3 pt-2 shrink-0">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background: isPublished
                  ? "oklch(var(--status-published))"
                  : "oklch(var(--warning))",
              }}
            />
            <span className="text-xs font-medium text-white/80 truncate">
              {isPublished ? "Published" : "In Development"}
            </span>
          </div>
        </div>
      )}

      {/* Profile / role block with demo role switcher */}
      <div
        className={cn(
          "relative shrink-0 border-t border-white/15 mt-2",
          collapsed ? "px-2 py-3" : "px-3 py-3",
        )}
      >
        {/* Role switcher popover — anchored above the profile block */}
        {showRoleSwitcher && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowRoleSwitcher(false)}
              onKeyDown={(e) =>
                e.key === "Escape" && setShowRoleSwitcher(false)
              }
              aria-hidden="true"
            />
            <div
              className="absolute bottom-full left-0 right-0 mb-1 mx-2 z-20 rounded-lg overflow-hidden shadow-lg border border-white/15"
              style={{ background: "oklch(var(--sidebar))" }}
              data-ocid="sidebar.role_switcher"
            >
              <p className="px-3 pt-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                Switch Role
              </p>
              <ul className="pb-1">
                {ALL_ROLES.map((role) => {
                  const isSelected = role === selectedRole;
                  return (
                    <li key={role}>
                      <button
                        type="button"
                        onClick={() => handleRoleSelect(role)}
                        data-ocid={`sidebar.role_option_${role.toLowerCase()}`}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-100",
                          isSelected
                            ? "text-white bg-white/15"
                            : "text-white/70 hover:text-white hover:bg-white/[0.08]",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0",
                            ROLE_COLORS[role],
                          )}
                        >
                          {ROLE_LABELS[role]}
                        </span>
                        <span className="flex-1 text-left truncate">
                          {ROLE_NAMES[role]}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-white/60 shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}

        {/* Collapsed: role dot + avatar */}
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setShowRoleSwitcher((v) => !v)}
                  data-ocid="sidebar.profile_avatar_button"
                  className="relative w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white text-xs font-semibold hover:bg-white/30 transition-colors duration-150"
                  aria-label={`${displayName} — ${currentRoleLabel}. Click to switch role`}
                >
                  {initials}
                  {selectedRole && (
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[oklch(var(--sidebar))]",
                        ROLE_DOT_COLORS[selectedRole],
                      )}
                    />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {displayName} · {currentRoleLabel}
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Role switcher — prominent dropdown */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1">
                Switch Role
              </p>
              <button
                type="button"
                onClick={() => setShowRoleSwitcher((v) => !v)}
                data-ocid="sidebar.role_switcher_button"
                className={cn(
                  "w-full flex items-center gap-2 px-2.5 py-2 rounded-md",
                  "text-sm font-semibold text-white transition-colors duration-150",
                  "bg-white/10 hover:bg-white/15",
                )}
                aria-expanded={showRoleSwitcher}
                aria-haspopup="listbox"
              >
                <span
                  className={cn(
                    "w-2.5 h-2.5 rounded-full shrink-0",
                    selectedRole
                      ? ROLE_DOT_COLORS[selectedRole]
                      : "bg-white/30",
                  )}
                />
                <span className="flex-1 text-left truncate text-[var(--text-on-sidebar)]">
                  {currentRoleLabel}
                </span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-white/50 shrink-0 transition-transform duration-150",
                    showRoleSwitcher && "rotate-180",
                  )}
                />
              </button>
            </div>

            {/* User name */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-semibold shrink-0 select-none">
                {initials}
              </div>
              <p className="text-xs font-medium text-white/80 truncate leading-tight">
                {displayName}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

/** Mobile bottom navigation */
export function BottomNav() {
  const { isOwner } = usePlayerRole();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const mobileNav = isOwner
    ? [
        {
          id: "dashboard",
          label: "Home",
          icon: <LayoutDashboard className="w-5 h-5" />,
          path: "/",
        },
        {
          id: "design",
          label: "Design",
          icon: <Wand2 className="w-5 h-5" />,
          path: "/design",
        },
        {
          id: "play",
          label: "Play",
          icon: <Swords className="w-5 h-5" />,
          path: "/play",
        },
        {
          id: "publish",
          label: "Publish",
          icon: <Radio className="w-5 h-5" />,
          path: "/publish",
        },
      ]
    : [
        {
          id: "play",
          label: "Play",
          icon: <Swords className="w-5 h-5" />,
          path: "/play",
        },
        {
          id: "my-decks",
          label: "Decks",
          icon: <ListChecks className="w-5 h-5" />,
          path: "/my-decks",
        },
        {
          id: "how-to-play",
          label: "Rules",
          icon: <HelpCircle className="w-5 h-5" />,
          path: "/how-to-play",
        },
      ];

  function isActive(path: string): boolean {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t"
      style={{
        background: "oklch(var(--sidebar))",
        borderColor: "oklch(var(--sidebar-border))",
      }}
      aria-label="Mobile navigation"
      data-ocid="app.bottom_nav"
    >
      <ul className="flex">
        {mobileNav.map((item) => {
          const active = isActive(item.path);
          return (
            <li key={item.id} className="flex-1">
              <Link
                to={item.path}
                data-ocid={`bottom_nav.${item.id}_link`}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-1",
                  "text-[var(--sidebar-foreground)] transition-opacity duration-150",
                  active ? "opacity-100" : "opacity-50",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
