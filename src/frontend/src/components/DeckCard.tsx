import { CostCurveSparkline } from "@/components/DeckAnalysisPanel";
import { Badge } from "@/components/ui/badge";
import type { DeckEntryLocal } from "@/hooks/useDecks";
import { cn } from "@/lib/utils";
import type { Card, Deck } from "@/types";
import { Layers, Star } from "lucide-react";
import { useMemo } from "react";

interface DeckCardProps {
  deck: Deck;
  cardMap: Map<bigint, Card>;
  isSelected?: boolean;
  onClick?: () => void;
}

export function DeckCard({
  deck,
  cardMap,
  isSelected,
  onClick,
}: DeckCardProps) {
  const entries: DeckEntryLocal[] = deck.cards.map((e) => ({
    cardId: e.cardId,
    count: Number(e.count),
  }));

  const cards = useMemo(() => {
    const result: Card[] = [];
    for (const e of entries) {
      const card = cardMap.get(e.cardId);
      if (card) {
        for (let i = 0; i < e.count; i++) result.push(card);
      }
    }
    return result;
  }, [entries, cardMap]);

  const totalCards = cards.length;

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of cards) {
      counts[c.cardType] = (counts[c.cardType] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [cards]);

  const avgCost =
    cards.length > 0
      ? (cards.reduce((s, c) => s + Number(c.cost), 0) / cards.length).toFixed(
          1,
        )
      : "—";

  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid="deck.card"
      className={cn(
        "group w-full text-left rounded-lg border bg-card p-4 transition-colors duration-150",
        "hover:border-primary/60 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected && "border-primary bg-accent/15",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Layers className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="font-semibold text-sm text-foreground truncate">
            {deck.name}
          </span>
        </div>
        {deck.isStarterDeck && (
          <Badge
            variant="secondary"
            className="shrink-0 gap-1 text-[10px] py-0"
          >
            <Star className="w-2.5 h-2.5" />
            Starter
          </Badge>
        )}
      </div>

      {/* Sparkline */}
      <div className="mb-2">
        <CostCurveSparkline cards={cards} />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="tabular-nums font-mono">
          <span className="text-foreground font-medium">{totalCards}</span>{" "}
          cards
        </span>
        <span className="tabular-nums font-mono">
          avg <span className="text-foreground font-medium">{avgCost}</span>
        </span>
        {typeData.length > 0 && (
          <div className="flex gap-1 ml-auto">
            {typeData.map(([type]) => (
              <span
                key={type}
                className="rounded px-1 py-0.5 bg-muted text-muted-foreground text-[10px] capitalize"
              >
                {type}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
