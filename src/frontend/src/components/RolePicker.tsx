import { type DemoRole, useDemoMode } from "@/context/DemoModeContext";
import { cn } from "@/lib/utils";
import { Crown, Eye, FlaskConical, Pencil, Swords } from "lucide-react";

interface RoleOption {
  role: DemoRole;
  label: string;
  description: string;
  icon: React.ReactNode;
  badgeClass: string;
  cardClass: string;
  primary?: boolean;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "Owner",
    label: "Owner",
    description: "Design cards, define rules, manage the game, and publish.",
    icon: <Crown className="w-5 h-5" />,
    badgeClass: "bg-amber-100 text-amber-700 border border-amber-200",
    cardClass:
      "border-amber-300 bg-amber-50 hover:border-amber-400 hover:bg-amber-50/80 ring-amber-200",
    primary: true,
  },
  {
    role: "CoDesigner",
    label: "Co-Designer",
    description:
      "Help design cards and decks — cannot publish or change settings.",
    icon: <Pencil className="w-5 h-5" />,
    badgeClass: "bg-sky-100 text-sky-700 border border-sky-200",
    cardClass:
      "border-sky-200 bg-sky-50/50 hover:border-sky-300 hover:bg-sky-50 ring-sky-200",
  },
  {
    role: "Playtester",
    label: "Playtester",
    description:
      "Play the game and leave structured feedback for the designer.",
    icon: <FlaskConical className="w-5 h-5" />,
    badgeClass: "bg-violet-100 text-violet-700 border border-violet-200",
    cardClass:
      "border-violet-200 bg-violet-50/50 hover:border-violet-300 hover:bg-violet-50 ring-violet-200",
  },
  {
    role: "Player",
    label: "Player",
    description: "Build decks and play the published game. No design access.",
    icon: <Swords className="w-5 h-5" />,
    badgeClass: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    cardClass:
      "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300 hover:bg-emerald-50 ring-emerald-200",
  },
  {
    role: "Spectator",
    label: "Spectator",
    description: "Watch live games and observe without participating.",
    icon: <Eye className="w-5 h-5" />,
    badgeClass: "bg-slate-100 text-slate-600 border border-slate-200",
    cardClass:
      "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 ring-slate-200",
  },
];

export function RolePicker() {
  const { setRole } = useDemoMode();

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12"
      data-ocid="role_picker.page"
    >
      {/* Game identity */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(var(--primary))" }}
          >
            <Crown className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold font-display text-foreground">
            TCG Engine
          </span>
        </div>
        <h1 className="text-3xl font-bold font-display text-foreground tracking-tight mb-2">
          Choose your role
        </h1>
        <p className="text-muted-foreground text-base max-w-sm mx-auto">
          You're in demo mode. Select a role to explore the app from that
          perspective.
        </p>
      </div>

      {/* Role cards */}
      <div className="w-full max-w-xl space-y-3" data-ocid="role_picker.list">
        {ROLE_OPTIONS.map((opt, i) => (
          <button
            key={opt.role}
            type="button"
            onClick={() => setRole(opt.role)}
            data-ocid={`role_picker.item.${i + 1}`}
            className={cn(
              "w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border-2",
              "transition-all duration-150 cursor-pointer select-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              opt.cardClass,
              opt.primary && "shadow-sm",
            )}
          >
            {/* Icon circle */}
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                opt.badgeClass,
              )}
            >
              {opt.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-foreground">
                  {opt.label}
                </span>
                {opt.primary && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-200 text-amber-800">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                {opt.description}
              </p>
            </div>

            {/* Badge */}
            <span
              className={cn(
                "text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 hidden sm:inline-block",
                opt.badgeClass,
              )}
            >
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted-foreground/60 text-center">
        Demo mode — no sign-in required. You can switch roles at any time from
        the sidebar.
      </p>
    </div>
  );
}
