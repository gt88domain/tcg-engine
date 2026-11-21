import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Card, CardInPlay } from "@/types";
import { useState } from "react";

interface PlayAreaProps {
  cards: CardInPlay[];
  cardLibrary: Map<bigint, Card>;
  isActive: boolean;
  isMyArea: boolean;
  selectedAttackers: bigint[];
  highlightTargets?: bigint[];
  onSelectAttacker?: (instanceId: bigint) => void;
  onSelectBlocker?: (instanceId: bigint) => void;
  onSelectTarget?: (targetId: bigint) => void;
  onUseAbility?: (instanceId: bigint, abilityId: bigint) => void;
}

function CardInPlayTile({
  cardInPlay,
  card,
  isActive,
  isMyArea,
  isSelectedAttacker,
  onSelectAttacker,
  onUseAbility,
}: {
  cardInPlay: CardInPlay;
  card: Card | undefined;
  isActive: boolean;
  isMyArea: boolean;
  isSelectedAttacker: boolean;
  onSelectAttacker?: (id: bigint) => void;
  onUseAbility?: (instanceId: bigint, abilityId: bigint) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  const atk = Number(cardInPlay.baseAttack + cardInPlay.tempBuffAttack);
  const def = Number(cardInPlay.baseDefense + cardInPlay.tempBuffDefense);
  const canInteract =
    isActive && isMyArea && !cardInPlay.summonSick && !cardInPlay.tapped;
  const hasAbilities = (card?.abilities ?? []).length > 0;

  return (
    <div className="relative" onBlur={() => setShowActions(false)}>
      <button
        type="button"
        onClick={() => {
          if (!canInteract) return;
          setShowActions((v) => !v);
        }}
        aria-label={card?.name ?? "Card in play"}
        data-ocid={`play-area.card.${Number(cardInPlay.instanceId)}`}
        className={[
          "relative w-16 h-24 md:w-20 md:h-28 rounded-lg border-2 cursor-pointer select-none",
          "flex flex-col items-center justify-between p-1.5 transition-all duration-150",
          "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
          cardInPlay.tapped ? "rotate-90 origin-center" : "",
          cardInPlay.summonSick ? "opacity-50" : "",
          isSelectedAttacker
            ? "border-[oklch(var(--play-your-turn))] shadow-[0_0_0_2px_oklch(var(--play-your-turn)/0.4)]"
            : canInteract
              ? "border-border hover:border-primary hover:shadow-md"
              : "border-border",
          !canInteract && isMyArea ? "cursor-default" : "",
        ].join(" ")}
        style={{
          background: "oklch(var(--card))",
        }}
      >
        {card?.artUrl && (
          <img
            src={card.artUrl}
            alt={card.name}
            className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-40"
          />
        )}
        <div className="relative z-10 w-full">
          <span className="block text-[9px] font-mono text-muted-foreground truncate">
            {card?.cardType ?? "?"}
          </span>
        </div>
        <div className="relative z-10 text-center">
          <p className="text-[10px] font-display font-semibold text-foreground leading-tight line-clamp-2">
            {card?.name ?? `#${Number(cardInPlay.cardId)}`}
          </p>
        </div>
        <div className="relative z-10 w-full flex justify-between">
          <span className="text-[10px] font-mono text-[oklch(var(--card-threat))] tabular-nums">
            {atk}
          </span>
          <span className="text-[10px] font-mono text-[oklch(var(--card-defense))] tabular-nums">
            {def}
          </span>
        </div>

        {cardInPlay.summonSick && (
          <div className="absolute inset-0 bg-muted/40 rounded-lg flex items-center justify-center">
            <span className="text-[9px] font-mono text-muted-foreground">
              Sick
            </span>
          </div>
        )}
      </button>

      {/* Actions popover */}
      {showActions && canInteract && (
        <div
          className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-50 bg-popover border border-border rounded-lg shadow-lg p-1.5 flex flex-col gap-1 min-w-[120px]"
          data-ocid={`play-area.popover.${Number(cardInPlay.instanceId)}`}
        >
          {onSelectAttacker && (
            <Button
              type="button"
              size="sm"
              variant={isSelectedAttacker ? "default" : "outline"}
              className="text-xs h-7 w-full"
              onClick={() => {
                onSelectAttacker(cardInPlay.instanceId);
                setShowActions(false);
              }}
              data-ocid={`play-area.attack-toggle.${Number(cardInPlay.instanceId)}`}
            >
              {isSelectedAttacker ? "Deselect" : "Attack"}
            </Button>
          )}
          {hasAbilities &&
            card!.abilities.map((ability) => (
              <Button
                key={Number(ability.id)}
                type="button"
                size="sm"
                variant="outline"
                className="text-xs h-7 w-full truncate"
                onClick={() => {
                  onUseAbility?.(cardInPlay.instanceId, ability.id);
                  setShowActions(false);
                }}
                data-ocid={`play-area.ability.${Number(cardInPlay.instanceId)}.${Number(ability.id)}`}
              >
                {ability.name}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}

export function PlayArea({
  cards,
  cardLibrary,
  isActive,
  isMyArea,
  selectedAttackers,
  onSelectAttacker,
  onUseAbility,
}: PlayAreaProps) {
  return (
    <div
      className="flex-1 flex items-center justify-center min-h-[120px]"
      data-ocid={isMyArea ? "play-area.player" : "play-area.opponent"}
    >
      {cards.length === 0 ? (
        <div
          className="border-2 border-dashed border-border/50 rounded-xl px-8 py-4 text-xs text-muted-foreground font-mono"
          data-ocid={
            isMyArea
              ? "play-area.player.empty_state"
              : "play-area.opponent.empty_state"
          }
        >
          No cards in play
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 items-center justify-center p-2">
          {cards.map((cip) => (
            <CardInPlayTile
              key={Number(cip.instanceId)}
              cardInPlay={cip}
              card={cardLibrary.get(cip.cardId)}
              isActive={isActive}
              isMyArea={isMyArea}
              isSelectedAttacker={selectedAttackers.includes(cip.instanceId)}
              onSelectAttacker={isMyArea ? onSelectAttacker : undefined}
              onUseAbility={isMyArea ? onUseAbility : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
