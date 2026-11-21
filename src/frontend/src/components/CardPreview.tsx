import type { Ability, Card } from "@/backend";
import { cn } from "@/lib/utils";

function cardTypeToToken(cardType: string): string {
  const map: Record<string, string> = {
    threat: "threat",
    answer: "answer",
    draw: "draw",
    resource: "resource",
    disruption: "disruption",
    defense: "defense",
    utility: "utility",
    finisher: "finisher",
  };
  return map[cardType?.toLowerCase()] ?? "resource";
}

type Rarity = "common" | "uncommon" | "rare" | "mythic" | "legendary";

const RARITY_LABELS: Record<Rarity, string> = {
  common: "C",
  uncommon: "U",
  rare: "R",
  mythic: "M",
  legendary: "L",
};

function rarityFromCost(cost: number): Rarity {
  if (cost >= 7) return "mythic";
  if (cost >= 5) return "rare";
  if (cost >= 3) return "uncommon";
  return "common";
}

function rarityFromTags(tags: string[] | undefined): Rarity | null {
  if (!tags) return null;
  const r = tags.find((t) => t.startsWith("rarity:"));
  if (!r) return null;
  const val = r.replace("rarity:", "");
  if (["common", "uncommon", "rare", "legendary"].includes(val)) {
    return val === "legendary" ? "mythic" : (val as Rarity);
  }
  return null;
}

interface CardPreviewData {
  name?: string;
  cost?: number;
  cardType?: string;
  attack?: number;
  defense?: number;
  rulesText?: string;
  flavourText?: string;
  artUrl?: string;
  abilities?: Ability[];
  tags?: string[];
}

interface CardPreviewProps {
  card: CardPreviewData;
  size?: "thumb" | "full";
  selected?: boolean;
  onClick?: () => void;
}

export function CardPreview({
  card,
  size = "full",
  selected,
  onClick,
}: CardPreviewProps) {
  const typeToken = cardTypeToToken(card.cardType ?? "");
  const cost = card.cost ?? 0;
  const explicitRarity = rarityFromTags(card.tags);
  const rarity = explicitRarity ?? rarityFromCost(cost);

  return (
    <article
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      tabIndex={onClick ? 0 : undefined}
      data-ocid="card-preview.card"
      className={cn(
        "relative flex flex-col overflow-hidden font-body select-none bg-card border rounded-lg",
        size === "thumb" &&
          "w-full aspect-[3/4] cursor-pointer transition-transform duration-150 hover:scale-[1.02]",
        size === "full" && "w-full max-w-[260px] aspect-[3/4]",
        selected && "ring-2 ring-primary",
        onClick && "cursor-pointer",
      )}
      style={{
        borderColor: `oklch(var(--card-${typeToken}) / 0.6)`,
        boxShadow: `0 0 0 1px oklch(var(--card-${typeToken}) / 0.15)`,
      }}
    >
      {/* Art zone */}
      <div
        className="relative flex-[1.8] overflow-hidden"
        style={{ background: `oklch(var(--card-${typeToken}) / 0.12)` }}
      >
        {card.artUrl ? (
          <img
            src={card.artUrl}
            alt={card.name ?? "card art"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-30">🃏</span>
          </div>
        )}
        <span
          className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-white shadow"
          style={{ background: `oklch(var(--rarity-${rarity}))` }}
          title={rarity}
        >
          {RARITY_LABELS[rarity]}
        </span>
        <span
          className="absolute top-1.5 right-1.5 min-w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-mono font-bold text-white shadow tabular-nums"
          style={{ background: `oklch(var(--card-${typeToken}))` }}
        >
          {cost}
        </span>
      </div>

      {/* Name band */}
      <div
        className="px-2 py-1 flex items-center justify-between gap-1"
        style={{ background: `oklch(var(--card-${typeToken}) / 0.18)` }}
      >
        <span
          className={cn(
            "font-display font-semibold truncate min-w-0",
            size === "thumb" ? "text-[11px]" : "text-sm",
          )}
        >
          {card.name || <span className="opacity-40">Card Name</span>}
        </span>
        <span
          className="shrink-0 text-[9px] font-mono uppercase tracking-wide px-1 rounded"
          style={{
            color: `oklch(var(--card-${typeToken}))`,
            background: `oklch(var(--card-${typeToken}) / 0.15)`,
          }}
        >
          {card.cardType || "—"}
        </span>
      </div>

      {/* Body */}
      <div className="flex-[2] px-2 py-1.5 overflow-hidden flex flex-col gap-1">
        {(card.abilities?.length ?? 0) > 0 && (
          <div className="flex flex-col gap-0.5">
            {(card.abilities ?? []).slice(0, 2).map((ab, i) => (
              <p
                key={ab.name ? `${ab.name}-${i}` : i}
                className="text-[9px] leading-tight text-foreground/70"
              >
                <span className="font-semibold">{ab.name}:</span>{" "}
                {ab.rulesText ?? "structured ability"}
              </p>
            ))}
          </div>
        )}
        {card.rulesText && (
          <p className="text-[9px] leading-tight text-foreground/80 italic line-clamp-3">
            {card.rulesText}
          </p>
        )}
        {card.flavourText && (
          <p className="text-[8px] leading-tight text-muted-foreground italic line-clamp-2 mt-auto">
            "{card.flavourText}"
          </p>
        )}
      </div>

      {/* Stats footer */}
      {(card.attack !== undefined || card.defense !== undefined) && (
        <div
          className="flex items-center justify-end gap-3 px-2 py-1 border-t"
          style={{
            borderColor: `oklch(var(--card-${typeToken}) / 0.3)`,
            background: `oklch(var(--card-${typeToken}) / 0.08)`,
          }}
        >
          {card.attack !== undefined && (
            <span className="text-[10px] font-mono font-bold tabular-nums">
              ⚔️ {card.attack}
            </span>
          )}
          {card.defense !== undefined && (
            <span className="text-[10px] font-mono font-bold tabular-nums">
              🛡 {card.defense}
            </span>
          )}
        </div>
      )}
    </article>
  );
}

export function cardToPreviewData(card: Card): CardPreviewData {
  return {
    name: card.name,
    cost: Number(card.cost),
    cardType: card.cardType,
    attack: card.attack !== undefined ? Number(card.attack) : undefined,
    defense: card.defense !== undefined ? Number(card.defense) : undefined,
    rulesText: card.rulesText,
    flavourText: card.flavourText,
    artUrl: card.artUrl,
    abilities: card.abilities,
    tags: card.tags,
  };
}
