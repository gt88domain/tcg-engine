import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Deck } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Layers, PenSquare } from "lucide-react";

const DECK_DESCRIPTIONS: Record<string, string> = {
  "Starter Deck":
    "Balanced introduction to Aura TCG. All card types represented, low variance.",
  "Aggro Rush":
    "Flood the board fast with low-cost threats and burn spells. Win by turn 8.",
  "Control Wall":
    "High-defense creatures and counter-spells. Outlast the opponent and win with card advantage.",
  "Midrange Value":
    "Efficient creatures backed by targeted removal. Strong at every stage of the game.",
  "Burn Storm":
    "Direct damage from hand. Your opponent's life total is the only resource that matters.",
  "Ramp Titan":
    "Accelerate mana early, drop enormous threats late. Unstoppable after turn 6.",
};

function DeckCard({ deck, index }: { deck: Deck; index: number }) {
  const totalCards = deck.cards.reduce((s, e) => s + Number(e.count), 0);
  const updatedDate = new Date(
    Number(deck.updatedAt) / 1_000_000,
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const description =
    DECK_DESCRIPTIONS[deck.name] ?? "A custom deck for Aura TCG.";

  return (
    <Card
      className="border-border bg-card flex flex-col"
      data-ocid={`my_decks.deck_card.${index}`}
    >
      <CardContent className="p-5 flex flex-col gap-3 h-full">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "oklch(var(--primary)/0.12)" }}
            >
              <Layers
                className="w-4 h-4"
                style={{ color: "oklch(var(--primary))" }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{deck.name}</p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {totalCards} cards
              </p>
            </div>
          </div>
          {deck.isStarterDeck && (
            <Badge
              className="text-xs shrink-0"
              style={{
                background: "oklch(var(--info)/0.15)",
                color: "oklch(var(--info))",
                border: "none",
              }}
            >
              Starter
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed flex-1">
          {description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            Updated {updatedDate}
          </span>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            data-ocid={`my_decks.edit_button.${index}`}
          >
            <Link to="/design/decks">
              <PenSquare className="w-3 h-3 mr-1.5" />
              Edit
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyDecksPage() {
  const { actor, isFetching } = useActor(createActor);

  const { data: decks = [], isLoading } = useQuery({
    queryKey: ["my-decks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDecks(null, BigInt(1));
    },
    enabled: !!actor && !isFetching,
  });

  return (
    <div className="p-6 max-w-5xl" data-ocid="my_decks.page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-bold">My Decks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading
              ? "Loading…"
              : `${decks.length} deck${decks.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button
          asChild
          style={{
            background: "oklch(var(--primary))",
            color: "oklch(var(--primary-foreground))",
          }}
          data-ocid="my_decks.new_deck_button"
        >
          <Link to="/design/decks">
            <Layers className="w-4 h-4 mr-2" />
            New Deck
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Skeleton key={n} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : decks.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-border"
          style={{ background: "oklch(var(--card))" }}
          data-ocid="my_decks.empty_state"
        >
          <Layers className="w-10 h-10 text-muted-foreground opacity-30 mb-3" />
          <p className="text-sm font-medium">No decks yet</p>
          <p className="text-xs text-muted-foreground mt-1 text-center max-w-xs">
            Build your first deck from cards in the Card Library.
          </p>
          <Button
            asChild
            size="sm"
            className="mt-4"
            style={{
              background: "oklch(var(--primary))",
              color: "oklch(var(--primary-foreground))",
            }}
          >
            <Link to="/design/cards">Go to Card Library</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck, i) => (
            <DeckCard key={String(deck.id)} deck={deck} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
