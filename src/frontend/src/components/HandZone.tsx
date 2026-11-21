import { GamePhase } from "@/backend.d";
import { Button } from "@/components/ui/button";
import type { Card } from "@/types";
import { useState } from "react";

interface HandZoneProps {
  cardIds: bigint[];
  cardLibrary: Map<bigint, Card>;
  isMyTurn: boolean;
  isMainPhase: boolean;
  playerResources: Array<[string, number]>;
  onPlayCard?: (cardId: bigint, card: Card) => void;
  newlyDrawnCardId?: bigint | null;
  discardMode?: boolean;
  discardSelection?: Set<number>;
  onToggleDiscard?: (index: number) => void;
}

function canAffordCard(
  card: Card,
  resources: Array<[string, number]>,
): boolean {
  const totalAvailable = resources.reduce((sum, [, amount]) => sum + amount, 0);
  return totalAvailable >= Number(card.cost);
}

function HandCard({
  cardId,
  card,
  isPlayable,
  isNewlyDrawn,
  onPlay,
}: {
  cardId: bigint;
  card: Card | undefined;
  isPlayable: boolean;
  isNewlyDrawn: boolean;
  onPlay?: (cardId: bigint, card: Card) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ zIndex: hovered ? 10 : 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        aria-label={card?.name ?? `Card ${Number(cardId)}`}
        onClick={() => {
          if (isPlayable && card && onPlay) onPlay(cardId, card);
        }}
        data-ocid={`hand.card.${Number(cardId)}`}
        className={[
          "relative w-16 h-24 md:w-20 md:h-28 rounded-lg border-2 flex flex-col items-center justify-between p-1.5",
          "transition-all duration-150 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
          isNewlyDrawn ? "card-flip-animation" : "",
          isPlayable
            ? "border-[oklch(var(--play-your-turn))] shadow-[0_0_8px_oklch(var(--play-your-turn)/0.5)] cursor-pointer hover:-translate-y-3 hover:shadow-lg"
            : "border-border cursor-default",
        ].join(" ")}
        style={{ background: "oklch(var(--card))" }}
      >
        {card?.artUrl && (
          <img
            src={card.artUrl}
            alt={card?.name}
            className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-30"
          />
        )}
        <div className="relative z-10 w-full flex justify-between items-start">
          <span className="text-[10px] font-mono font-bold text-foreground tabular-nums">
            {card ? Number(card.cost) : "?"}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground truncate max-w-[36px]">
            {card?.cardType ?? ""}
          </span>
        </div>
        <div className="relative z-10 text-center px-0.5">
          <p className="text-[10px] font-display font-semibold text-foreground leading-tight line-clamp-2">
            {card?.name ?? `#${Number(cardId)}`}
          </p>
        </div>
        {card?.attack !== undefined && (
          <div className="relative z-10 w-full flex justify-between">
            <span className="text-[10px] font-mono text-[oklch(var(--card-threat))] tabular-nums">
              {Number(card.attack)}
            </span>
            {card.defense !== undefined && (
              <span className="text-[10px] font-mono text-[oklch(var(--card-defense))] tabular-nums">
                {Number(card.defense)}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Play button on hover */}
      {hovered && isPlayable && card && onPlay && (
        <Button
          type="button"
          size="sm"
          className="absolute -bottom-8 z-20 h-6 text-xs px-2 shadow-md"
          onClick={() => onPlay(cardId, card)}
          data-ocid={`hand.play-button.${Number(cardId)}`}
        >
          Play
        </Button>
      )}
    </div>
  );
}

export function HandZone({
  cardIds,
  cardLibrary,
  isMyTurn,
  isMainPhase,
  playerResources,
  onPlayCard,
  newlyDrawnCardId,
}: HandZoneProps) {
  const canPlay = isMyTurn && isMainPhase;

  return (
    <section
      className="flex items-end justify-center gap-1 md:gap-2 py-2 overflow-x-auto overflow-y-visible scrollbar-none pb-8"
      data-ocid="hand.zone"
      aria-label="Your hand"
    >
      {cardIds.length === 0 ? (
        <p
          className="text-xs text-muted-foreground font-mono py-4"
          data-ocid="hand.empty_state"
        >
          No cards in hand
        </p>
      ) : (
        cardIds.map((cardId, i) => {
          const card = cardLibrary.get(cardId);
          const isPlayable =
            canPlay && !!card && canAffordCard(card, playerResources);

          return (
            <HandCard
              key={`${Number(cardId)}-${i}`}
              cardId={cardId}
              card={card}
              isPlayable={isPlayable}
              isNewlyDrawn={newlyDrawnCardId === cardId}
              onPlay={canPlay ? onPlayCard : undefined}
            />
          );
        })
      )}
    </section>
  );
}
