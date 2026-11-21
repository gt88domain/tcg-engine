import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/useGame";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Layers, ListChecks, Wand2 } from "lucide-react";

const sections = [
  {
    id: "game-rules",
    label: "Game Rules",
    desc: "Define resource system, card types, win conditions, and turn structure.",
    icon: <BookOpen className="w-5 h-5" />,
    path: "/design/game-rules",
  },
  {
    id: "cards",
    label: "Card Library",
    desc: "Create and manage all cards in your game with the structured ability builder.",
    icon: <Layers className="w-5 h-5" />,
    path: "/design/cards",
  },
  {
    id: "decks",
    label: "Decks",
    desc: "Build starter and preconstructed decks with live cost-curve analysis.",
    icon: <ListChecks className="w-5 h-5" />,
    path: "/design/decks",
  },
];

export default function DesignWorkspacePage() {
  const { gameName } = useGame();
  return (
    <div className="p-6 space-y-6 max-w-3xl" data-ocid="design.workspace_page">
      <div className="flex items-center gap-3">
        <Wand2 className="w-5 h-5" style={{ color: "oklch(var(--primary))" }} />
        <h1 className="text-lg font-display font-bold">
          {gameName} — Design Workspace
        </h1>
      </div>
      <p className="text-muted-foreground text-sm">
        Build your game from the ground up. Define the rules, create cards, and
        assemble decks.
      </p>
      <div className="grid gap-4">
        {sections.map((s) => (
          <Link key={s.id} to={s.path} data-ocid={`design.${s.id}_link`}>
            <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-[oklch(var(--primary))] transition-colors duration-150 group cursor-pointer">
              <div
                className="p-2 rounded-lg shrink-0"
                style={{ background: "oklch(var(--primary) / 0.15)" }}
              >
                <span style={{ color: "oklch(var(--primary))" }}>{s.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{s.label}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
