import { Badge } from "@/components/ui/badge";
import type { PlayerGameState } from "@/types";

interface ResourcesBarProps {
  playerState: PlayerGameState;
  isMyTurn: boolean;
  label: "You" | "Opponent";
}

const RESOURCE_COLOURS: Record<string, string> = {
  Fire: "oklch(var(--card-threat))",
  Water: "oklch(var(--card-resource))",
  Earth: "oklch(var(--card-answer))",
  Air: "oklch(var(--card-utility))",
  Mana: "oklch(var(--primary))",
  Gold: "oklch(var(--card-draw))",
};

function resourceColour(name: string): string {
  return RESOURCE_COLOURS[name] ?? "oklch(var(--primary))";
}

export function ResourcesBar({
  playerState,
  isMyTurn,
  label,
}: ResourcesBarProps) {
  const maxHealth = 20n;
  const healthPct = Math.min(
    100,
    Number((playerState.health * 100n) / maxHealth),
  );
  const isLowHealth = playerState.health <= 4n;

  return (
    <div
      className="flex items-center gap-3 px-3 py-2"
      data-ocid={
        label === "You" ? "resources-bar.player" : "resources-bar.opponent"
      }
    >
      {/* Turn indicator */}
      <Badge
        className="shrink-0 text-[10px] px-2 py-0.5 h-5 font-mono"
        style={{
          background: isMyTurn
            ? label === "You"
              ? "oklch(var(--play-your-turn) / 0.15)"
              : "oklch(var(--play-opponent-turn) / 0.15)"
            : "transparent",
          color: isMyTurn
            ? label === "You"
              ? "oklch(var(--play-your-turn))"
              : "oklch(var(--play-opponent-turn))"
            : "oklch(var(--muted-foreground))",
          border: `1px solid ${isMyTurn ? (label === "You" ? "oklch(var(--play-your-turn) / 0.4)" : "oklch(var(--play-opponent-turn) / 0.4)") : "oklch(var(--border))"}`,
        }}
      >
        {isMyTurn
          ? label === "You"
            ? "YOUR TURN"
            : "OPP. TURN"
          : label.toUpperCase()}
      </Badge>

      {/* Health */}
      <div
        className="flex items-center gap-1.5 shrink-0"
        aria-label={`Health: ${playerState.health}`}
      >
        <span
          className="text-xl font-display font-bold tabular-nums leading-none"
          style={{
            color: isLowHealth
              ? "oklch(var(--danger))"
              : "oklch(var(--foreground))",
          }}
        >
          {Number(playerState.health)}
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] text-muted-foreground leading-none">
            HP
          </span>
          <div
            className="w-10 h-1.5 rounded-full overflow-hidden bg-muted"
            role="progressbar"
            tabIndex={0}
            aria-valuenow={Number(playerState.health)}
            aria-valuemin={0}
            aria-valuemax={Number(maxHealth)}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${healthPct}%`,
                background: isLowHealth
                  ? "oklch(var(--danger))"
                  : "oklch(var(--play-winner))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="flex items-center gap-2 flex-wrap">
        {playerState.resources.map(([name, amount]) => (
          <div
            key={name}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/50"
            title={`${name}: ${Number(amount)}`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: resourceColour(name) }}
            />
            <span className="text-[11px] font-mono tabular-nums text-foreground">
              {Number(amount)}
            </span>
            <span className="text-[10px] text-muted-foreground">{name}</span>
          </div>
        ))}
      </div>

      {/* Cards in hand */}
      <div className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground font-mono shrink-0">
        <span className="tabular-nums">{playerState.hand.length}</span>
        <span>cards</span>
      </div>
    </div>
  );
}
