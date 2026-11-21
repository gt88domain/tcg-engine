import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GameLogEntry } from "@/types";

interface GameLogProps {
  entries: GameLogEntry[];
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const d = new Date(ms);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function GameLog({ entries }: GameLogProps) {
  return (
    <div className="flex flex-col h-full" data-ocid="game-log.panel">
      <div className="px-3 py-2 border-b border-border flex items-center gap-2">
        <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
          Game Log
        </span>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
          {entries.length}
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 flex flex-col gap-0.5">
          {entries.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4 font-mono">
              Game log is empty.
            </p>
          )}
          {entries.map((entry, i) => (
            <div
              key={`${String(entry.timestamp)}-${entry.actorId ?? i}`}
              data-ocid={`game-log.item.${i + 1}`}
              className="rounded px-2 py-1.5 text-[11px] font-mono leading-relaxed hover:bg-muted/40 transition-colors duration-150"
            >
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground/60 shrink-0 tabular-nums">
                  {formatTimestamp(entry.timestamp)}
                </span>
                <span className="flex-1 min-w-0 text-foreground break-words">
                  {entry.description}
                </span>
                {entry.actionType === "manual" && (
                  <Badge
                    variant="outline"
                    className="shrink-0 text-[9px] px-1 py-0 h-3.5 border-[oklch(var(--warning))] text-[oklch(var(--warning))]"
                  >
                    MANUAL
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
