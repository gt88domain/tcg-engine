import { DeckAnalysisPanel } from "@/components/DeckAnalysisPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import {
  type DeckEntryLocal,
  useCardLibrary,
  useCreateDeck,
  useDeleteDeck,
  useSetStarterDeck,
  useUpdateDeck,
  validateDeckLocal,
} from "@/hooks/useDecks";
import { useGame } from "@/hooks/useGame";
import { cn } from "@/lib/utils";
import type { Card, CardId, Deck, DeckEntry } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Library,
  Save,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Helpers ────────────────────────────────────────────────────────────────────────────

function entryToLocal(e: { cardId: CardId; count: bigint }): DeckEntryLocal {
  return { cardId: e.cardId, count: Number(e.count) };
}

function localToEntry(e: DeckEntryLocal): DeckEntry {
  return { cardId: e.cardId, count: BigInt(e.count) };
}

// ─── Library Card Tile ──────────────────────────────────────────────────────────────────

function LibraryCardTile({
  card,
  countInDeck,
  onAdd,
}: {
  card: Card;
  countInDeck: number;
  onAdd: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onAdd}
      data-ocid="deck.library_card"
      className={cn(
        "w-full text-left rounded border border-border bg-card p-2",
        "hover:border-primary/50 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="flex items-start justify-between gap-1 mb-0.5">
        <span className="text-xs font-medium text-foreground truncate leading-tight">
          {card.name}
        </span>
        <span className="tabular-nums font-mono text-xs font-bold text-primary shrink-0">
          {String(card.cost)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-muted-foreground capitalize">
          {card.cardType}
        </span>
        {countInDeck > 0 && (
          <Badge
            variant="secondary"
            className="ml-auto text-[9px] px-1 py-0 h-4 tabular-nums"
          >
            ×{countInDeck}
          </Badge>
        )}
      </div>
    </button>
  );
}

// ─── Deck Entry Row ────────────────────────────────────────────────────────────────────

function DeckEntryRow({
  card,
  count,
  maxCopies,
  onInc,
  onDec,
}: {
  card: Card;
  count: number;
  maxCopies: number;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <div
      data-ocid="deck.entry_row"
      className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-muted/40"
    >
      <span className="tabular-nums font-mono text-xs w-3 text-muted-foreground shrink-0">
        {String(card.cost)}
      </span>
      <span className="flex-1 text-sm text-foreground truncate min-w-0">
        {card.name}
      </span>
      <span className="text-xs text-muted-foreground capitalize shrink-0">
        {card.cardType}
      </span>
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={onDec}
          data-ocid="deck.entry_dec"
          className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Remove one"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
        <span
          className={cn(
            "tabular-nums font-mono text-sm font-semibold w-4 text-center",
            count >= maxCopies ? "text-warning" : "text-foreground",
          )}
        >
          {count}
        </span>
        <button
          type="button"
          onClick={onInc}
          data-ocid="deck.entry_inc"
          disabled={count >= maxCopies}
          className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Add one"
        >
          <ChevronUp className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────────────────

export default function DeckBuilderPage() {
  const { game } = useGame();
  const { principal } = useAuth();
  void principal;
  const navigate = useNavigate();
  const urlSearch = useSearch({ strict: false }) as Record<string, string>;
  const isNew = urlSearch.new === "1";

  const gameId = game?.id;
  const resourceSystem = game?.resourceSystem;
  const minSize = resourceSystem ? Number(resourceSystem.deckSizeMin) : 20;
  const maxSize = resourceSystem ? Number(resourceSystem.deckSizeMax) : 60;
  const maxCopies = resourceSystem
    ? Number(resourceSystem.copiesPerCardLimit)
    : 4;

  const { data: allCards = [], isLoading: cardsLoading } =
    useCardLibrary(gameId);
  const createDeck = useCreateDeck();
  const updateDeck = useUpdateDeck();
  const deleteDeck = useDeleteDeck();
  const setStarterDeckMutation = useSetStarterDeck();

  const [deckName, setDeckName] = useState("");
  const [entries, setEntries] = useState<DeckEntryLocal[]>([]);
  const [isStarter, setIsStarter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);

  const originalNameRef = useRef("");
  const originalEntriesRef = useRef<DeckEntryLocal[]>([]);

  const cardMap = useMemo(() => {
    const m = new Map<CardId, Card>();
    for (const c of allCards) m.set(c.id, c);
    return m;
  }, [allCards]);

  useEffect(() => {
    if (isNew) {
      setDeckName("New Deck");
      setEntries([]);
      setIsStarter(false);
      setActiveDeck(null);
      originalNameRef.current = "";
      originalEntriesRef.current = [];
    }
  }, [isNew]);

  useEffect(() => {
    if (activeDeck) {
      const local = activeDeck.cards.map(entryToLocal);
      setDeckName(activeDeck.name);
      setEntries(local);
      setIsStarter(activeDeck.isStarterDeck);
      originalNameRef.current = activeDeck.name;
      originalEntriesRef.current = local;
    }
  }, [activeDeck]);

  const isEditing = isNew || activeDeck !== null;

  const cardTypes = useMemo(() => {
    const s = new Set<string>();
    for (const c of allCards) s.add(c.cardType);
    return Array.from(s).sort();
  }, [allCards]);

  const filteredCards = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allCards.filter((c) => {
      if (typeFilter && c.cardType !== typeFilter) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allCards, searchQuery, typeFilter]);

  const countMap = useMemo(() => {
    const m = new Map<CardId, number>();
    for (const e of entries) m.set(e.cardId, e.count);
    return m;
  }, [entries]);

  const totalCount = useMemo(
    () => entries.reduce((s, e) => s + e.count, 0),
    [entries],
  );

  const validation = useMemo(
    () => validateDeckLocal(entries, minSize, maxSize, maxCopies),
    [entries, minSize, maxSize, maxCopies],
  );

  const addCard = useCallback(
    (cardId: CardId) => {
      setEntries((prev) => {
        const idx = prev.findIndex((e) => e.cardId === cardId);
        if (idx >= 0) {
          if (prev[idx].count >= maxCopies) return prev;
          return prev.map((e, i) =>
            i === idx ? { ...e, count: e.count + 1 } : e,
          );
        }
        return [...prev, { cardId, count: 1 }];
      });
    },
    [maxCopies],
  );

  const decEntry = useCallback((cardId: CardId) => {
    setEntries((prev) =>
      prev
        .map((e) => (e.cardId === cardId ? { ...e, count: e.count - 1 } : e))
        .filter((e) => e.count > 0),
    );
  }, []);

  const incEntry = useCallback(
    (cardId: CardId) => {
      setEntries((prev) =>
        prev.map((e) =>
          e.cardId === cardId && e.count < maxCopies
            ? { ...e, count: e.count + 1 }
            : e,
        ),
      );
    },
    [maxCopies],
  );

  const sortedEntries = useMemo(
    () =>
      [...entries].sort((a, b) => {
        const ca = cardMap.get(a.cardId);
        const cb = cardMap.get(b.cardId);
        if (!ca || !cb) return 0;
        if (Number(ca.cost) !== Number(cb.cost))
          return Number(ca.cost) - Number(cb.cost);
        return ca.name.localeCompare(cb.name);
      }),
    [entries, cardMap],
  );

  const handleBack = () => navigate({ to: "/design/decks" });

  const handleSave = async () => {
    if (!gameId) return;
    const deckEntries = entries.map(localToEntry);
    if (isNew && !activeDeck) {
      const newDeck = await createDeck.mutateAsync({
        gameId,
        name: deckName || "Untitled Deck",
        cards: deckEntries,
      });
      if (isStarter && newDeck) {
        await setStarterDeckMutation.mutateAsync(newDeck.id);
      }
      navigate({ to: "/design/decks" });
    } else if (activeDeck) {
      await updateDeck.mutateAsync({
        id: activeDeck.id,
        name: deckName,
        cards: deckEntries,
      });
      if (isStarter && !activeDeck.isStarterDeck) {
        await setStarterDeckMutation.mutateAsync(activeDeck.id);
      }
      originalNameRef.current = deckName;
      originalEntriesRef.current = entries.map((e) => ({ ...e }));
    }
  };

  const handleDelete = async () => {
    if (!activeDeck) return;
    await deleteDeck.mutateAsync(activeDeck.id);
    navigate({ to: "/design/decks" });
  };

  const isSaving =
    createDeck.isPending ||
    updateDeck.isPending ||
    setStarterDeckMutation.isPending;

  // ─── Gate: no cards ────────────────────────────────────────────────────────────────────────────
  if (isEditing && allCards.length === 0 && !cardsLoading) {
    return (
      <div data-ocid="deck.page" className="flex flex-col h-full bg-background">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-sm w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Library className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Create cards first
            </h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Decks are built from the cards in your library. Create cards in
              the Card Library before building a deck.
            </p>
            <Button
              type="button"
              onClick={() => navigate({ to: "/design/cards" })}
              data-ocid="deck.goto_library_button"
              className="gap-2"
            >
              <Library className="w-4 h-4" />
              Go to Card Library
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── 3-column Editor ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      data-ocid="deck.editor"
      className="flex h-full bg-background overflow-hidden"
    >
      {/* ── Left: Card Library (25%) ── */}
      <div className="w-[25%] min-w-48 max-w-72 shrink-0 flex flex-col border-r border-border bg-card">
        <div className="px-3 pt-3 pb-2 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Card Library
          </p>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards…"
              data-ocid="deck.library_search_input"
              className="pl-7 h-8 text-xs"
            />
          </div>
          {cardTypes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setTypeFilter("")}
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded border",
                  !typeFilter
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                All
              </button>
              {cardTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t === typeFilter ? "" : t)}
                  data-ocid={`deck.type_filter.${t.toLowerCase()}`}
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded border capitalize",
                    typeFilter === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          {cardsLoading ? (
            <div
              data-ocid="deck.library_loading_state"
              className="p-3 grid grid-cols-1 gap-1.5"
            >
              {[...Array(8)].map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional skeleton
                <Skeleton key={i} className="h-12 rounded" />
              ))}
            </div>
          ) : filteredCards.length === 0 ? (
            <div
              data-ocid="deck.library_empty_state"
              className="p-4 text-center"
            >
              <p className="text-xs text-muted-foreground">
                {allCards.length === 0
                  ? "No cards in the library"
                  : "No cards match"}
              </p>
            </div>
          ) : (
            <div className="p-2 grid grid-cols-1 gap-1">
              {filteredCards.map((card) => (
                <LibraryCardTile
                  key={card.id.toString()}
                  card={card}
                  countInDeck={countMap.get(card.id) ?? 0}
                  onAdd={() => addCard(card.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ── Center: Deck Contents (40%) ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-3 border-b border-border bg-card flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            data-ocid="deck.back_button"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Back to decks"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Decks
          </button>
          <Input
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="Deck name"
            data-ocid="deck.name_input"
            className="text-sm font-medium flex-1 h-8 border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 bg-transparent"
          />
          <span
            className={cn(
              "text-xs tabular-nums font-mono shrink-0",
              !validation.isValid
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {totalCount} / {maxSize}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {activeDeck && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                data-ocid="deck.delete_button"
                className="text-destructive hover:text-destructive h-7 px-2"
                aria-label="Delete deck"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !deckName.trim()}
              data-ocid="deck.save_button"
              className="h-7 px-3 text-xs gap-1"
            >
              <Save className="w-3 h-3" />
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>

        {/* Deck size bar */}
        <div className="px-4 py-2 border-b border-border bg-background">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {totalCount < minSize
                ? `${minSize - totalCount} more needed`
                : `${totalCount} cards`}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              min {minSize} — max {maxSize}
            </span>
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                totalCount < minSize ? "bg-destructive/60" : "bg-primary",
              )}
              style={{
                width: `${Math.min((totalCount / maxSize) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {entries.length === 0 ? (
            <div
              data-ocid="deck.composition_empty_state"
              className="flex items-center justify-center py-16 text-center px-6"
            >
              <p className="text-sm text-muted-foreground">
                Click cards in the library to add them to this deck.
              </p>
            </div>
          ) : (
            <div className="py-2 px-1">
              {sortedEntries.map((entry) => {
                const card = cardMap.get(entry.cardId);
                if (!card) return null;
                return (
                  <DeckEntryRow
                    key={entry.cardId.toString()}
                    card={card}
                    count={entry.count}
                    maxCopies={maxCopies}
                    onDec={() => decEntry(entry.cardId)}
                    onInc={() => incEntry(entry.cardId)}
                  />
                );
              })}
            </div>
          )}
        </ScrollArea>

        {!validation.isValid && (
          <div className="px-4 py-2 border-t border-destructive/20 bg-destructive/5">
            {validation.errors.map((err) => (
              <p
                key={err}
                data-ocid="deck.validation_error"
                className="text-xs text-destructive"
              >
                {err}
              </p>
            ))}
          </div>
        )}

        {/* Starter deck toggle */}
        <div className="px-4 py-3 border-t border-border bg-card flex items-center gap-3">
          <Star className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">Starter deck</p>
            <p className="text-[10px] text-muted-foreground">
              New players receive this deck automatically
            </p>
          </div>
          <Switch
            checked={isStarter}
            onCheckedChange={setIsStarter}
            data-ocid="deck.starter_toggle"
            aria-label="Set as starter deck"
          />
        </div>
      </div>

      {/* ── Right: Analysis Panel (35%) ── */}
      <DeckAnalysisPanel
        entries={entries}
        cardMap={cardMap}
        resourceSystem={resourceSystem}
        validation={validation}
        className="w-[35%] min-w-48 max-w-80 shrink-0"
      />
    </div>
  );
}
