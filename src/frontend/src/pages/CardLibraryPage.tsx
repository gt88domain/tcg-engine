import type { Card } from "@/backend";
import { CardEditorPanel } from "@/components/CardEditorPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCardLibrary,
  useCreateCard,
  useDeleteCard,
  useUpdateCard,
} from "@/hooks/useCards";
import { useGame } from "@/hooks/useGame";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

// ---- Card thumbnail -------------------------------------------------------
function CardThumbnail({
  card,
  selected,
  onSelect,
  selectMode,
  checked,
  onToggleCheck,
}: {
  card: Card;
  selected: boolean;
  onSelect: (card: Card) => void;
  selectMode: boolean;
  checked: boolean;
  onToggleCheck: (
    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(card)}
      data-ocid={`card-library.card.${Number(card.id)}`}
      className={cn(
        "relative w-full aspect-[2/3] rounded-xl border-2 flex flex-col items-start justify-between p-2 text-left",
        "transition-all duration-150 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
        selected
          ? "border-primary shadow-[0_0_0_2px_oklch(var(--primary)/0.3)]"
          : "border-border hover:border-primary/50 hover:shadow-md",
      )}
      style={{ background: "oklch(var(--card))" }}
    >
      {selectMode && (
        <label className="absolute top-1.5 left-1.5 z-20 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              e.stopPropagation();
              onToggleCheck(e);
            }}
            className="w-4 h-4 accent-primary cursor-pointer"
            data-ocid={`card-library.checkbox.${Number(card.id)}`}
          />
        </label>
      )}
      {card.artUrl && (
        <img
          src={card.artUrl}
          alt={card.name}
          className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-25"
        />
      )}
      <div className="relative z-10 w-full flex items-start justify-between gap-1">
        <span className="text-[11px] font-mono font-bold tabular-nums text-foreground">
          {Number(card.cost)}
        </span>
        <Badge className="text-[9px] px-1.5 py-0 h-4 font-mono truncate max-w-[80px]">
          {card.cardType}
        </Badge>
      </div>
      <div className="relative z-10 w-full">
        <p className="text-xs font-display font-semibold text-foreground leading-tight line-clamp-2">
          {card.name}
        </p>
        {card.rulesText && (
          <p className="text-[9px] text-muted-foreground leading-snug line-clamp-2 mt-0.5">
            {card.rulesText}
          </p>
        )}
      </div>
      {(card.attack !== undefined || card.defense !== undefined) && (
        <div className="relative z-10 w-full flex justify-between">
          {card.attack !== undefined && (
            <span
              className="text-[10px] font-mono tabular-nums"
              style={{ color: "oklch(var(--card-threat))" }}
            >
              {Number(card.attack)}
            </span>
          )}
          {card.defense !== undefined && (
            <span
              className="text-[10px] font-mono tabular-nums"
              style={{ color: "oklch(var(--card-defense))" }}
            >
              {Number(card.defense)}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

// ---- Card list row -------------------------------------------------------
function CardListRow({
  card,
  selected,
  onSelect,
  selectMode,
  checked,
  onToggleCheck,
}: {
  card: Card;
  selected: boolean;
  onSelect: (card: Card) => void;
  selectMode: boolean;
  checked: boolean;
  onToggleCheck: (
    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(card)}
      data-ocid={`card-library.list-item.${Number(card.id)}`}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150",
        "border-b border-border/50 hover:bg-muted/40",
        selected ? "bg-primary/5 border-l-2 border-l-primary" : "",
      )}
    >
      {selectMode && (
        <label className="cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              e.stopPropagation();
              onToggleCheck(e);
            }}
            className="w-4 h-4 accent-primary cursor-pointer"
            data-ocid={`card-library.checkbox.${Number(card.id)}`}
          />
        </label>
      )}
      <span className="w-8 text-xs font-mono tabular-nums text-muted-foreground text-right shrink-0">
        {Number(card.cost)}
      </span>
      <span className="flex-1 min-w-0">
        <span className="text-sm font-display font-medium text-foreground truncate block">
          {card.name}
        </span>
        <span className="text-[11px] text-muted-foreground font-mono">
          {card.cardType}
        </span>
      </span>
      {card.attack !== undefined && (
        <span
          className="text-xs font-mono tabular-nums"
          style={{ color: "oklch(var(--card-threat))" }}
        >
          {Number(card.attack)}
        </span>
      )}
      {card.defense !== undefined && (
        <span
          className="text-xs font-mono tabular-nums"
          style={{ color: "oklch(var(--card-defense))" }}
        >
          {Number(card.defense)}
        </span>
      )}
    </button>
  );
}

// ---- Main page -------------------------------------------------------
type SortOption =
  | "name-asc"
  | "name-desc"
  | "cost-asc"
  | "cost-desc"
  | "type"
  | "date";

export default function CardLibraryPage() {
  const { game } = useGame();
  const { data: cards = [], isLoading } = useCardLibrary(game?.id);
  const _createCard = useCreateCard();
  const _updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();

  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(10);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [hasAbilityFilter, setHasAbilityFilter] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<bigint>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [bulkDeleteSuccess, setBulkDeleteSuccess] = useState(false);

  const cardTypes = game?.cardTypes ?? [];
  const maxCardCost = Math.max(10, ...cards.map((c) => Number(c.cost)));

  const filtered = useMemo(() => {
    let result = cards.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (activeType && c.cardType !== activeType) return false;
      const cost = Number(c.cost);
      if (cost < minCost || cost > maxCost) return false;
      if (hasAbilityFilter && c.abilities.length === 0) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "cost-asc":
          return Number(a.cost) - Number(b.cost);
        case "cost-desc":
          return Number(b.cost) - Number(a.cost);
        case "type":
          return (
            a.cardType.localeCompare(b.cardType) || a.name.localeCompare(b.name)
          );
        case "date":
          return Number(b.createdAt) - Number(a.createdAt);
        default:
          return 0;
      }
    });

    return result;
  }, [cards, search, activeType, minCost, maxCost, sortBy, hasAbilityFilter]);

  const showEditor = selectedCard !== null || isCreating;
  const editorCard = isCreating ? null : selectedCard;

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id));

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const c of filtered) next.delete(c.id);
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const c of filtered) next.add(c.id);
        return next;
      });
    }
  }

  function toggleCardCheck(id: bigint) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    const ids = Array.from(selectedIds);
    await Promise.all(ids.map((id) => deleteCard.mutateAsync(id)));
    setSelectedIds(new Set());
    setShowBulkDeleteConfirm(false);
    setSelectMode(false);
    setBulkDeleteSuccess(true);
    setTimeout(() => setBulkDeleteSuccess(false), 3000);
  }

  return (
    <div className="flex h-full" data-ocid="card-library.page">
      {/* Main panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-card/50 flex-wrap">
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Input
              placeholder="Search cards…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-sm h-8"
              data-ocid="card-library.search.search_input"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              🔍
            </span>
          </div>

          {/* Type filter chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveType(null)}
              data-ocid="card-library.filter.all.toggle"
              className={cn(
                "text-[11px] font-mono px-2.5 py-1 rounded-full border transition-colors duration-150",
                activeType === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50",
              )}
            >
              All
            </button>
            {cardTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveType(t === activeType ? null : t)}
                data-ocid={`card-library.filter.${t.toLowerCase()}.toggle`}
                className={cn(
                  "text-[11px] font-mono px-2.5 py-1 rounded-full border transition-colors duration-150",
                  activeType === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/50",
                )}
              >
                {t}
              </button>
            ))}
            {/* Has Ability filter */}
            <button
              type="button"
              onClick={() => setHasAbilityFilter((v) => !v)}
              data-ocid="card-library.filter.has-ability.toggle"
              className={cn(
                "text-[11px] font-mono px-2.5 py-1 rounded-full border transition-colors duration-150",
                hasAbilityFilter
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50",
              )}
            >
              Has Ability
            </button>
          </div>

          {/* Cost range */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
            <span>Cost</span>
            <input
              type="range"
              min={0}
              max={maxCardCost}
              value={minCost}
              onChange={(e) => setMinCost(Number(e.target.value))}
              className="w-16 accent-primary"
              aria-label="Min cost"
            />
            <span className="tabular-nums">
              {minCost}–{maxCost}
            </span>
            <input
              type="range"
              min={0}
              max={maxCardCost}
              value={maxCost}
              onChange={(e) => setMaxCost(Number(e.target.value))}
              className="w-16 accent-primary"
              aria-label="Max cost"
            />
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-8 text-[11px] font-mono rounded-md border border-input bg-background px-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            data-ocid="card-library.sort.select"
          >
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="cost-asc">Cost: Low–High</option>
            <option value="cost-desc">Cost: High–Low</option>
            <option value="type">Type</option>
            <option value="date">Date Created</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center gap-1 border border-border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              data-ocid="card-library.view-grid.toggle"
              className={cn(
                "px-2.5 py-1 text-[11px] font-mono transition-colors duration-150",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
              aria-label="Grid view"
            >
              ⋯⋯
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              data-ocid="card-library.view-list.toggle"
              className={cn(
                "px-2.5 py-1 text-[11px] font-mono transition-colors duration-150",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
              aria-label="List view"
            >
              ≡
            </button>
          </div>

          {/* Select mode toggle */}
          <button
            type="button"
            onClick={() => {
              setSelectMode((v) => !v);
              setSelectedIds(new Set());
              setShowBulkDeleteConfirm(false);
            }}
            data-ocid="card-library.select-mode.toggle"
            className={cn(
              "h-8 text-[11px] font-mono px-3 rounded-md border transition-colors duration-150",
              selectMode
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:border-primary/50",
            )}
          >
            {selectMode ? "Done" : "Select"}
          </button>

          <Button
            type="button"
            size="sm"
            onClick={() => {
              setSelectedCard(null);
              setIsCreating(true);
            }}
            data-ocid="card-library.new-card.button"
            className="h-8 text-xs"
          >
            + New Card
          </Button>
        </div>

        {/* Bulk action bar */}
        {selectMode && (
          <div className="flex items-center gap-3 px-6 py-2 border-b border-border/50 bg-muted/30">
            <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={allFilteredSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-primary"
                data-ocid="card-library.select-all.checkbox"
              />
              Select All
            </label>
            {selectedIds.size > 0 && !showBulkDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowBulkDeleteConfirm(true)}
                className="flex items-center gap-1.5 text-xs font-mono text-destructive hover:text-destructive/80 transition-colors"
                data-ocid="card-library.bulk-delete.button"
              >
                <Trash2 size={13} />
                Delete {selectedIds.size} card{selectedIds.size > 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}

        {/* Bulk delete confirmation bar */}
        {showBulkDeleteConfirm && (
          <div
            className="flex items-center gap-3 px-6 py-2.5 border-b border-destructive/30 bg-destructive/5"
            data-ocid="card-library.bulk-delete.confirm_bar"
          >
            <span className="text-xs text-destructive font-medium">
              Delete {selectedIds.size} card{selectedIds.size > 1 ? "s" : ""}?
              This cannot be undone.
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-7 text-xs"
                onClick={handleBulkDelete}
                disabled={deleteCard.isPending}
                data-ocid="card-library.bulk-delete.confirm_button"
              >
                {deleteCard.isPending ? "Deleting…" : "Delete"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setShowBulkDeleteConfirm(false)}
                data-ocid="card-library.bulk-delete.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Success message */}
        {bulkDeleteSuccess && (
          <div className="flex items-center gap-2 px-6 py-2 border-b border-success/30 bg-success/5">
            <span className="text-xs text-success font-medium">
              Cards deleted successfully.
            </span>
          </div>
        )}

        {/* Card count header */}
        <div className="px-6 py-2 text-xs text-muted-foreground font-mono border-b border-border/50 flex items-center justify-between">
          <span>
            <Badge variant="secondary" className="text-[10px] font-mono mr-2">
              {filtered.length} card{filtered.length !== 1 ? "s" : ""}
            </Badge>
            of {cards.length} total
          </span>
        </div>

        {/* Card grid / list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 p-6">
              {Array.from({ length: 12 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional skeleton
                <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-64 gap-4"
              data-ocid="card-library.empty_state"
            >
              <div className="text-4xl">🃏</div>
              <div className="text-center">
                <p className="text-sm font-display font-semibold text-foreground">
                  {cards.length === 0
                    ? "Design Your First Card"
                    : "No cards match your filters"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {cards.length === 0
                    ? "Cards must follow the rules you defined. Start with your resource cards and creatures."
                    : "Try adjusting your search or filters."}
                </p>
              </div>
              {cards.length === 0 && (
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedCard(null);
                    setIsCreating(true);
                  }}
                  data-ocid="card-library.empty-new-card.button"
                >
                  + New Card
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 p-6">
              {filtered.map((card) => (
                <CardThumbnail
                  key={Number(card.id)}
                  card={card}
                  selected={selectedCard?.id === card.id}
                  onSelect={(c) => {
                    setSelectedCard(c);
                    setIsCreating(false);
                  }}
                  selectMode={selectMode}
                  checked={selectedIds.has(card.id)}
                  onToggleCheck={() => toggleCardCheck(card.id)}
                />
              ))}
            </div>
          ) : (
            <div
              className="divide-y divide-border/50"
              data-ocid="card-library.list"
            >
              {filtered.map((card) => (
                <CardListRow
                  key={Number(card.id)}
                  card={card}
                  selected={selectedCard?.id === card.id}
                  onSelect={(c) => {
                    setSelectedCard(c);
                    setIsCreating(false);
                  }}
                  selectMode={selectMode}
                  checked={selectedIds.has(card.id)}
                  onToggleCheck={() => toggleCardCheck(card.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor panel */}
      {showEditor && (
        <div className="w-80 xl:w-96 shrink-0 border-l border-border flex flex-col">
          <CardEditorPanel
            card={editorCard}
            gameDefinition={game ?? undefined}
            onClose={() => {
              setSelectedCard(null);
              setIsCreating(false);
            }}
            onSaved={() => {
              setSelectedCard(null);
              setIsCreating(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
