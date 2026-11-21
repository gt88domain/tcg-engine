import type { Card, CardInPlay } from "@/types";
import { useState } from "react";

interface GraveyardPanelProps {
  graveyard: CardInPlay[];
  cardLibrary: Map<bigint, Card>;
}

export function GraveyardPanel({
  graveyard,
  cardLibrary,
}: GraveyardPanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (graveyard.length === 0) return null;

  return (
    <div
      className="rounded-lg border border-border overflow-hidden"
      style={{ background: "oklch(var(--graveyard-bg))" }}
      data-ocid="graveyard.panel"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        data-ocid="graveyard.toggle"
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors duration-150"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
          Graveyard
        </span>
        <span className="tabular-nums">{graveyard.length}</span>
      </button>

      {expanded && (
        <div className="px-3 pb-2 space-y-1">
          {graveyard.map((cip, i) => {
            const card = cardLibrary.get(cip.cardId);
            return (
              <div
                key={`${Number(cip.instanceId)}-${i}`}
                className="flex items-center justify-between text-xs py-1 border-b border-border/30 last:border-0"
                data-ocid={`graveyard.item.${i + 1}`}
              >
                <span className="truncate text-foreground">
                  {card?.name ?? `Card #${Number(cip.cardId)}`}
                </span>
                <span className="text-muted-foreground tabular-nums shrink-0 ml-2">
                  {card ? `${Number(card.cost)}` : "?"} ·{" "}
                  {card?.cardType ?? "?"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
