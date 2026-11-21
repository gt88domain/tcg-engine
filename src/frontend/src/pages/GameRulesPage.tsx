import type {
  GamePhase as GamePhaseType,
  ResourceSystem,
  WinCondition,
} from "@/backend";
import { GamePhase, GameVisibility } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateGame, useGame, useUpdateGame } from "@/hooks/useGame";
import { useState } from "react";

const ALL_PHASES: GamePhaseType[] = [
  GamePhase.Start,
  GamePhase.Draw,
  GamePhase.Main,
  GamePhase.Combat,
  GamePhase.End,
];

const PHASE_LABELS: Record<string, string> = {
  [GamePhase.Start]: "Start",
  [GamePhase.Draw]: "Draw",
  [GamePhase.Main]: "Main",
  [GamePhase.Combat]: "Combat",
  [GamePhase.End]: "End",
};

const PHASE_DESCRIPTIONS: Record<string, string> = {
  [GamePhase.Start]: "Untap and refresh",
  [GamePhase.Draw]: "Draw a card",
  [GamePhase.Main]: "Play cards and use abilities",
  [GamePhase.Combat]: "Attack with your creatures",
  [GamePhase.End]: "Discard to hand size",
};

// ---- Accordion section -------------------------------------------------------
function AccordionSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-3.5 bg-card hover:bg-muted/30 transition-colors duration-150 text-left"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="text-sm font-display font-semibold text-foreground">
          {title}
        </span>
        <span
          className={`text-muted-foreground transition-transform duration-150 ${open ? "rotate-180" : "rotate-0"}`}
        >
          ▾
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 py-4 border-t border-border bg-background">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- First-run wizard -------------------------------------------------------
function FirstRunWizard({ onCreated }: { onCreated: () => void }) {
  const createGame = useCreateGame();
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("fantasy");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!name.trim()) {
      setError("Please enter a game name.");
      return;
    }
    setError(null);
    try {
      await createGame.mutateAsync({ name: name.trim(), theme });
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create game.");
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] gap-8"
      data-ocid="game-rules.wizard.section"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Start by naming your game
        </h2>
        <p className="text-muted-foreground text-sm max-w-md">
          Give your game a name and choose how resources work — every card and
          deck rule builds from here.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4 bg-card border border-border rounded-2xl p-6">
        <div>
          <label
            className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
            htmlFor="game-name"
          >
            Game Name
          </label>
          <Input
            id="game-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Realms of Etherion"
            className="mt-1"
            data-ocid="game-rules.wizard.name.input"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />
        </div>
        <div>
          <label
            className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
            htmlFor="game-theme"
          >
            Theme / Setting
          </label>
          <Input
            id="game-theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g. fantasy, sci-fi, steampunk"
            className="mt-1"
            data-ocid="game-rules.wizard.theme.input"
          />
        </div>
        <div className="bg-muted/40 rounded-lg px-4 py-3 flex items-center gap-3">
          <span className="text-xl">⚔️</span>
          <div>
            <p className="text-xs font-display font-semibold text-foreground">
              Resource + Combat
            </p>
            <p className="text-[11px] text-muted-foreground">
              Collect resources, play creatures and spells, defeat your
              opponent.
            </p>
          </div>
          <Badge
            className="ml-auto shrink-0 text-[10px]"
            style={{
              background: "oklch(var(--primary)/0.15)",
              color: "oklch(var(--primary))",
              border: "1px solid oklch(var(--primary)/0.3)",
            }}
          >
            Selected
          </Badge>
        </div>
        {error && (
          <p
            className="text-xs text-destructive"
            data-ocid="game-rules.wizard.error_state"
          >
            {error}
          </p>
        )}
        <Button
          type="button"
          className="w-full"
          onClick={handleCreate}
          disabled={createGame.isPending || !name.trim()}
          data-ocid="game-rules.wizard.create.submit_button"
        >
          {createGame.isPending ? "Creating…" : "Create Your Game"}
        </Button>
      </div>
    </div>
  );
}

// ---- Main page -------------------------------------------------------
export default function GameRulesPage() {
  const { game, isLoading } = useGame();
  const updateGame = useUpdateGame();

  const [refreshKey, setRefreshKey] = useState(0);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    identity: true,
    resources: true,
    cardTypes: true,
    winCondition: true,
    turnStructure: true,
    formatRules: true,
  });

  // Editable state (initialised from game when it loads)
  const [gameName, setGameName] = useState(game?.name ?? "");
  const [gameDesc, setGameDesc] = useState("");
  const [resources, setResources] = useState<ResourceSystem>(
    game?.resourceSystem ?? {
      resourceName: "Mana",
      resourcesPerTurn: 1n,
      startingLife: 20n,
      maxHandSize: 7n,
      deckSizeMin: 20n,
      deckSizeMax: 60n,
      copiesPerCardLimit: 3n,
    },
  );
  const [cardTypes, setCardTypes] = useState<string[]>(game?.cardTypes ?? []);
  const [winCondition, setWinCondition] = useState<WinCondition>(
    game?.winConditions?.[0] ?? { __kind__: "LifeToZero", LifeToZero: null },
  );
  const [phases, setPhases] = useState<GamePhaseType[]>(ALL_PHASES);

  // Format rules — local state only (not in backend yet)
  const [formatRules, setFormatRules] = useState({
    minDeckSize: 40,
    maxDeckSize: 60,
    maxCopies: 4,
    startingHandSize: 7,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync state when game loads
  if (game && gameName === "" && refreshKey === 0) {
    setGameName(game.gameName ?? game.name);
    setResources(game.resourceSystem);
    setCardTypes(game.cardTypes);
    setWinCondition(
      game.winConditions?.[0] ?? { __kind__: "LifeToZero", LifeToZero: null },
    );
    setRefreshKey(1);
  }

  // Helper: get win condition kind
  const isHealthBased = winCondition.__kind__ === "LifeToZero";
  const isScoreBased = winCondition.__kind__ === "Custom";

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateGame.mutateAsync({
        gameName: gameName,
        resourceSystem: resources,
        winConditions: [winCondition],
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4" data-ocid="game-rules.loading_state">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!game) {
    return <FirstRunWizard onCreated={() => setRefreshKey((k) => k + 1)} />;
  }

  const isPublished = !!game.publishedAt;

  return (
    <div className="flex flex-col h-full" data-ocid="game-rules.page">
      {/* Header area */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          <Badge
            className="text-[10px] px-2 py-0.5 h-5 font-mono"
            style={{
              background: isPublished
                ? "oklch(var(--status-published)/0.15)"
                : "oklch(var(--status-draft)/0.15)",
              color: isPublished
                ? "oklch(var(--status-published))"
                : "oklch(var(--status-draft))",
              border: `1px solid ${isPublished ? "oklch(var(--status-published)/0.3)" : "oklch(var(--status-draft)/0.3)"}`,
            }}
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
          <Badge
            className="text-[10px] px-2 py-0.5 h-5 font-mono"
            variant="secondary"
          >
            v{Number(game.version)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground font-mono ml-auto">
          Last updated{" "}
          {new Date(Number(game.updatedAt / 1_000_000n)).toLocaleDateString()}
        </p>
      </div>

      {/* Accordion editor */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {/* Identity */}
        <AccordionSection
          title="Game Identity"
          open={openSections.identity}
          onToggle={() => toggleSection("identity")}
        >
          <div className="space-y-3">
            <div>
              <label
                className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                htmlFor="rule-name"
              >
                Game Name
              </label>
              <Input
                id="rule-name"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="mt-1"
                data-ocid="game-rules.identity.name.input"
              />
            </div>
            <div>
              <label
                className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                htmlFor="rule-desc"
              >
                Description
              </label>
              <textarea
                id="rule-desc"
                value={gameDesc}
                onChange={(e) => setGameDesc(e.target.value)}
                rows={3}
                placeholder="Briefly describe your game…"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="game-rules.identity.description.textarea"
              />
            </div>
          </div>
        </AccordionSection>

        {/* Resource System */}
        <AccordionSection
          title="Resource System"
          open={openSections.resources}
          onToggle={() => toggleSection("resources")}
        >
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Define the core resource for your game. Players generate this
              resource each turn to pay for cards.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <label
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                  htmlFor="res-name"
                >
                  Resource Name
                </label>
                <Input
                  id="res-name"
                  value={resources.resourceName}
                  onChange={(e) =>
                    setResources((prev) => ({
                      ...prev,
                      resourceName: e.target.value,
                    }))
                  }
                  className="mt-1 h-8 text-sm"
                  data-ocid="game-rules.resources.name.input.1"
                />
              </div>
              <div>
                <label
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                  htmlFor="res-per-turn"
                >
                  Resources / Turn
                </label>
                <Input
                  id="res-per-turn"
                  type="number"
                  min="1"
                  value={String(Number(resources.resourcesPerTurn))}
                  onChange={(e) =>
                    setResources((prev) => ({
                      ...prev,
                      resourcesPerTurn: BigInt(e.target.value || "1"),
                    }))
                  }
                  className="mt-1 h-8 text-sm"
                  data-ocid="game-rules.resources.per-turn.input"
                />
              </div>
              <div>
                <label
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                  htmlFor="res-life"
                >
                  Starting Life
                </label>
                <Input
                  id="res-life"
                  type="number"
                  min="1"
                  value={String(Number(resources.startingLife))}
                  onChange={(e) =>
                    setResources((prev) => ({
                      ...prev,
                      startingLife: BigInt(e.target.value || "20"),
                    }))
                  }
                  className="mt-1 h-8 text-sm"
                  data-ocid="game-rules.resources.starting-life.input"
                />
              </div>
              <div>
                <label
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                  htmlFor="res-hand"
                >
                  Max Hand Size
                </label>
                <Input
                  id="res-hand"
                  type="number"
                  min="1"
                  value={String(Number(resources.maxHandSize))}
                  onChange={(e) =>
                    setResources((prev) => ({
                      ...prev,
                      maxHandSize: BigInt(e.target.value || "7"),
                    }))
                  }
                  className="mt-1 h-8 text-sm"
                  data-ocid="game-rules.resources.hand-size.input"
                />
              </div>
              <div>
                <label
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                  htmlFor="res-deck-min"
                >
                  Deck Size Min
                </label>
                <Input
                  id="res-deck-min"
                  type="number"
                  min="1"
                  value={String(Number(resources.deckSizeMin))}
                  onChange={(e) =>
                    setResources((prev) => ({
                      ...prev,
                      deckSizeMin: BigInt(e.target.value || "20"),
                    }))
                  }
                  className="mt-1 h-8 text-sm"
                  data-ocid="game-rules.resources.deck-min.input"
                />
              </div>
              <div>
                <label
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                  htmlFor="res-deck-max"
                >
                  Deck Size Max
                </label>
                <Input
                  id="res-deck-max"
                  type="number"
                  min="1"
                  value={String(Number(resources.deckSizeMax))}
                  onChange={(e) =>
                    setResources((prev) => ({
                      ...prev,
                      deckSizeMax: BigInt(e.target.value || "60"),
                    }))
                  }
                  className="mt-1 h-8 text-sm"
                  data-ocid="game-rules.resources.deck-max.input"
                />
              </div>
              <div>
                <label
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                  htmlFor="res-copies"
                >
                  Copies per Card
                </label>
                <Input
                  id="res-copies"
                  type="number"
                  min="1"
                  value={String(Number(resources.copiesPerCardLimit))}
                  onChange={(e) =>
                    setResources((prev) => ({
                      ...prev,
                      copiesPerCardLimit: BigInt(e.target.value || "3"),
                    }))
                  }
                  className="mt-1 h-8 text-sm"
                  data-ocid="game-rules.resources.copies.input"
                />
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Card Types */}
        <AccordionSection
          title="Card Types"
          open={openSections.cardTypes}
          onToggle={() => toggleSection("cardTypes")}
        >
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {cardTypes.map((t, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: positional type badges
                  key={i}
                  className="flex items-center gap-1 px-2 py-1 bg-muted/50 border border-border rounded-lg text-sm"
                >
                  <span className="text-foreground font-mono text-xs">{t}</span>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive text-xs leading-none"
                    onClick={() =>
                      setCardTypes(cardTypes.filter((_, j) => j !== i))
                    }
                    aria-label={`Remove ${t}`}
                    data-ocid={`game-rules.card-types.delete_button.${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="e.g. Creature, Spell, Artifact"
                className="h-8 text-sm max-w-xs"
                data-ocid="game-rules.card-types.new.input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (
                      e.currentTarget as HTMLInputElement
                    ).value.trim();
                    if (val && !cardTypes.includes(val)) {
                      setCardTypes([...cardTypes, val]);
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs shrink-0"
                data-ocid="game-rules.card-types.add.button"
                onClick={(e) => {
                  const input = e.currentTarget
                    .previousSibling as HTMLInputElement;
                  const val = input.value.trim();
                  if (val && !cardTypes.includes(val)) {
                    setCardTypes([...cardTypes, val]);
                    input.value = "";
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </AccordionSection>

        {/* Win Condition */}
        <AccordionSection
          title="Win Condition"
          open={openSections.winCondition}
          onToggle={() => toggleSection("winCondition")}
        >
          <div className="space-y-3">
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="win-condition"
                  checked={isHealthBased}
                  onChange={() =>
                    setWinCondition({
                      __kind__: "LifeToZero",
                      LifeToZero: null,
                    })
                  }
                  className="accent-primary"
                  data-ocid="game-rules.win-condition.health-based.radio"
                />
                <span className="text-sm text-foreground">
                  Reduce opponent life to 0
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="win-condition"
                  checked={winCondition.__kind__ === "DeckOut"}
                  onChange={() =>
                    setWinCondition({ __kind__: "DeckOut", DeckOut: null })
                  }
                  className="accent-primary"
                  data-ocid="game-rules.win-condition.deck-out.radio"
                />
                <span className="text-sm text-foreground">
                  Opponent decks out
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="win-condition"
                  checked={isScoreBased}
                  onChange={() =>
                    setWinCondition({
                      __kind__: "Custom",
                      Custom: "Reach 10 points",
                    })
                  }
                  className="accent-primary"
                  data-ocid="game-rules.win-condition.score-based.radio"
                />
                <span className="text-sm text-foreground">
                  Custom condition
                </span>
              </label>
            </div>
            {isScoreBased && (
              <div>
                <label
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                  htmlFor="custom-condition"
                >
                  Condition description
                </label>
                <Input
                  id="custom-condition"
                  value={
                    winCondition.__kind__ === "Custom"
                      ? winCondition.Custom
                      : ""
                  }
                  onChange={(e) =>
                    setWinCondition({
                      __kind__: "Custom",
                      Custom: e.target.value,
                    })
                  }
                  placeholder="e.g. Reach 10 points"
                  className="mt-1 w-full max-w-xs"
                  data-ocid="game-rules.win-condition.custom.input"
                />
              </div>
            )}
          </div>
        </AccordionSection>

        {/* Turn Structure */}
        <AccordionSection
          title="Turn Structure"
          open={openSections.turnStructure}
          onToggle={() => toggleSection("turnStructure")}
        >
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-mono mb-2">
              Reorder phases with the arrows. Add or remove phases inline.
            </p>
            <div className="space-y-1.5">
              {phases.map((phase, i) => (
                <div
                  key={phase}
                  className="flex items-center gap-3 px-3 py-2 bg-muted/30 rounded-lg border border-border/60"
                  data-ocid={`game-rules.phases.item.${i + 1}`}
                >
                  <span className="text-muted-foreground/50 font-mono text-xs w-4 text-right shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-mono text-foreground">
                      {PHASE_LABELS[phase]}
                    </span>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {PHASE_DESCRIPTIONS[phase]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={i === 0}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs px-1"
                      onClick={() => {
                        const next = [...phases];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        setPhases(next);
                      }}
                      aria-label="Move up"
                      data-ocid={`game-rules.phases.move-up.button.${i + 1}`}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={i === phases.length - 1}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs px-1"
                      onClick={() => {
                        const next = [...phases];
                        [next[i], next[i + 1]] = [next[i + 1], next[i]];
                        setPhases(next);
                      }}
                      aria-label="Move down"
                      data-ocid={`game-rules.phases.move-down.button.${i + 1}`}
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-destructive text-xs px-1 ml-1"
                      onClick={() =>
                        setPhases(phases.filter((_, j) => j !== i))
                      }
                      aria-label={`Remove ${PHASE_LABELS[phase]}`}
                      data-ocid={`game-rules.phases.delete_button.${i + 1}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center pt-1">
              <Input
                id="new-phase-name"
                placeholder="Phase name"
                className="h-8 text-sm max-w-xs"
                data-ocid="game-rules.phases.new.input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (
                      e.currentTarget as HTMLInputElement
                    ).value.trim();
                    if (val && !phases.includes(val as GamePhaseType)) {
                      setPhases([...phases, val as GamePhaseType]);
                      (e.currentTarget as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs shrink-0"
                data-ocid="game-rules.phases.add.button"
                onClick={() => {
                  const input = document.getElementById(
                    "new-phase-name",
                  ) as HTMLInputElement;
                  const val = input.value.trim();
                  if (val && !phases.includes(val as GamePhaseType)) {
                    setPhases([...phases, val as GamePhaseType]);
                    input.value = "";
                  }
                }}
              >
                Add Phase
              </Button>
            </div>
          </div>
        </AccordionSection>

        {/* Format Rules */}
        <AccordionSection
          title="Format Rules"
          open={openSections.formatRules}
          onToggle={() => toggleSection("formatRules")}
        >
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              These rules are used to validate decks. They are stored locally
              for now and will sync to the server in a future update.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <label
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                  htmlFor="format-min-deck"
                >
                  Minimum deck size
                </label>
                <Input
                  id="format-min-deck"
                  type="number"
                  min="1"
                  value={formatRules.minDeckSize}
                  onChange={(e) =>
                    setFormatRules((prev) => ({
                      ...prev,
                      minDeckSize: Number(e.target.value) || 1,
                    }))
                  }
                  className="mt-1 w-24"
                  data-ocid="game-rules.format.min-deck.input"
                />
              </div>
              <div>
                <label
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                  htmlFor="format-max-deck"
                >
                  Maximum deck size
                </label>
                <Input
                  id="format-max-deck"
                  type="number"
                  min="1"
                  value={formatRules.maxDeckSize}
                  onChange={(e) =>
                    setFormatRules((prev) => ({
                      ...prev,
                      maxDeckSize: Number(e.target.value) || 1,
                    }))
                  }
                  className="mt-1 w-24"
                  data-ocid="game-rules.format.max-deck.input"
                />
              </div>
              <div>
                <label
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                  htmlFor="format-max-copies"
                >
                  Max copies of any card
                </label>
                <Input
                  id="format-max-copies"
                  type="number"
                  min="1"
                  value={formatRules.maxCopies}
                  onChange={(e) =>
                    setFormatRules((prev) => ({
                      ...prev,
                      maxCopies: Number(e.target.value) || 1,
                    }))
                  }
                  className="mt-1 w-24"
                  data-ocid="game-rules.format.max-copies.input"
                />
              </div>
              <div>
                <label
                  className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
                  htmlFor="format-hand-size"
                >
                  Starting hand size
                </label>
                <Input
                  id="format-hand-size"
                  type="number"
                  min="1"
                  value={formatRules.startingHandSize}
                  onChange={(e) =>
                    setFormatRules((prev) => ({
                      ...prev,
                      startingHandSize: Number(e.target.value) || 1,
                    }))
                  }
                  className="mt-1 w-24"
                  data-ocid="game-rules.format.hand-size.input"
                />
              </div>
            </div>
          </div>
        </AccordionSection>
      </div>

      {/* Save bar */}
      <div
        className="flex items-center gap-3 px-6 py-3 border-t border-border bg-card/50"
        data-ocid="game-rules.save-bar"
      >
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          data-ocid="game-rules.save.submit_button"
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save Game Rules"}
        </Button>
        {saved && (
          <span
            className="text-xs font-mono text-[oklch(var(--success))]"
            data-ocid="game-rules.save.success_state"
          >
            Saved ✓
          </span>
        )}
      </div>
    </div>
  );
}
