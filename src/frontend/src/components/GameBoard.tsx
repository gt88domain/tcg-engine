import { AbilityTarget, GamePhase, GameStatus } from "@/backend";
import type { Card, GameSession, PlayerGameState } from "@/backend";
import { GameLog } from "@/components/GameLog";
import { HandZone } from "@/components/HandZone";
import { PlayArea } from "@/components/PlayArea";
import { ResourcesBar } from "@/components/ResourcesBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const PHASE_LABELS: Record<GamePhase, string> = {
  [GamePhase.Start]: "Start",
  [GamePhase.Draw]: "Draw",
  [GamePhase.Main]: "Main",
  [GamePhase.Combat]: "Combat",
  [GamePhase.End]: "End",
};

export function GameBoard({
  session,
  myPlayerId,
  cardLibrary,
  onEndPhase,
  onDeclareAttackers,
  onAssignBlockers,
  onConcede,
  onPlayCard,
  onUseAbility,
  onTakeMulligan,
  onDiscardCard,
  newlyDrawnCardId,
}: {
  session: GameSession;
  myPlayerId: string;
  cardLibrary: Map<bigint, Card>;
  onEndPhase: () => void;
  onDeclareAttackers: (attackerIndices: bigint[]) => void;
  onAssignBlockers: (blockingInstanceIds: bigint[]) => void;
  onConcede: () => void;
  onPlayCard: (cardId: bigint, card: Card) => void;
  onUseAbility: (
    sourceId: bigint,
    abilityId: bigint,
    targetId: bigint | null,
  ) => void;
  onTakeMulligan: () => void;
  onDiscardCard: (handIndex: bigint) => void;
  newlyDrawnCardId?: bigint | null;
}) {
  const [logOpen, setLogOpen] = useState(false);
  const [concedeConfirm, setConcedeConfirm] = useState(false);
  const [selectedAttackers, setSelectedAttackers] = useState<bigint[]>([]);
  const [selectedBlockers, setSelectedBlockers] = useState<bigint[]>([]);
  const [discardSelection, setDiscardSelection] = useState<Set<number>>(
    new Set(),
  );
  const [targetPicker, setTargetPicker] = useState<{
    sourceInstanceId: bigint;
    abilityId: bigint;
    validTargets: bigint[];
  } | null>(null);

  const { state } = session;
  const isMyTurn = state.activePlayerId.toText() === myPlayerId;
  const phase = state.phase;
  const isCombat = phase === GamePhase.Combat;
  const isMain = phase === GamePhase.Main;

  const combatSubPhase = state.combatSubPhase;
  const isDeclaringAttackers = combatSubPhase.__kind__ === "DeclaringAttackers";
  const isAssigningBlockers = combatSubPhase.__kind__ === "AssigningBlockers";
  const attackerIds = isAssigningBlockers
    ? (combatSubPhase as { AssigningBlockers: { attackers: bigint[] } })
        .AssigningBlockers.attackers
    : [];

  const myState: PlayerGameState | undefined = state.playerStates.find(
    (ps) => ps.playerId.toText() === myPlayerId,
  );
  const oppState: PlayerGameState | undefined = state.playerStates.find(
    (ps) => ps.playerId.toText() !== myPlayerId,
  );

  // Check for discard required
  const [discardRequired, setDiscardRequired] = useState(false);
  const [discardCount, _setDiscardCount] = useState(0);

  function toggleAttacker(instanceId: bigint) {
    setSelectedAttackers((prev) =>
      prev.includes(instanceId)
        ? prev.filter((id) => id !== instanceId)
        : [...prev, instanceId],
    );
  }

  function toggleBlocker(instanceId: bigint) {
    setSelectedBlockers((prev) =>
      prev.includes(instanceId)
        ? prev.filter((id) => id !== instanceId)
        : [...prev, instanceId],
    );
  }

  function handleDeclareAttackers() {
    onDeclareAttackers(selectedAttackers);
    setSelectedAttackers([]);
  }

  function handleAssignBlockers() {
    onAssignBlockers(selectedBlockers);
    setSelectedBlockers([]);
  }

  function handleEndPhase() {
    onEndPhase();
    setSelectedAttackers([]);
    setSelectedBlockers([]);
  }

  function toggleDiscard(index: number) {
    setDiscardSelection((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function confirmDiscard() {
    const indices = Array.from(discardSelection).sort((a, b) => b - a);
    for (const idx of indices) {
      onDiscardCard(BigInt(idx));
    }
    setDiscardSelection(new Set());
    setDiscardRequired(false);
  }

  function startTargetPicker(sourceInstanceId: bigint, abilityId: bigint) {
    // Determine valid targets from ability
    const cardInPlay = myState?.playArea.find(
      (c) => c.instanceId === sourceInstanceId,
    );
    const card = cardInPlay ? cardLibrary.get(cardInPlay.cardId) : undefined;
    const ability = card?.abilities.find((a) => a.id === abilityId);
    if (!ability) return;

    const validTargets: bigint[] = [];
    // Check ability targets using PascalCase enum values
    for (const target of ability.targets) {
      if (
        target === AbilityTarget.TargetCreature ||
        target === AbilityTarget.AllOpponentCreatures
      ) {
        for (const c of oppState?.playArea ?? []) {
          validTargets.push(c.instanceId);
        }
      }
      if (
        target === AbilityTarget.TargetCreature ||
        target === AbilityTarget.AllYourCreatures
      ) {
        for (const c of myState?.playArea ?? []) {
          validTargets.push(c.instanceId);
        }
      }
      if (target === AbilityTarget.Opponent) {
        // opponent player as target — handled separately
      }
    }

    if (
      validTargets.length === 0 &&
      ability.targets.includes(AbilityTarget.Opponent)
    ) {
      // No card targets, just use opponent
      onUseAbility(sourceInstanceId, abilityId, null);
      return;
    }

    if (validTargets.length === 0) {
      onUseAbility(sourceInstanceId, abilityId, null);
      return;
    }

    setTargetPicker({ sourceInstanceId, abilityId, validTargets });
  }

  function selectTarget(targetId: bigint) {
    if (!targetPicker) return;
    onUseAbility(
      targetPicker.sourceInstanceId,
      targetPicker.abilityId,
      targetId,
    );
    setTargetPicker(null);
  }

  const isMulliganPhase = state.status === GameStatus.WaitingForPlayer;
  const canMulligan = myState?.mulliganState && !myState.mulliganState.taken;

  const combatPhaseColor = isDeclaringAttackers
    ? "oklch(var(--combat-declare))"
    : isAssigningBlockers
      ? "oklch(var(--combat-block))"
      : "oklch(var(--combat-resolve))";

  return (
    <div
      className="h-screen flex overflow-hidden bg-background"
      data-ocid="game-board.canvas_target"
    >
      {/* Slide-in game log */}
      <div
        className={[
          "fixed left-0 top-0 h-full w-72 bg-card border-r border-border z-40 flex flex-col",
          "transition-transform duration-200 ease-in-out",
          logOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Game Log"
        role="complementary"
        data-ocid="game-board.game-log.panel"
      >
        <GameLog entries={session.log} />
        <button
          type="button"
          className="absolute -right-8 top-4 w-8 h-8 bg-card border border-border rounded-r-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150"
          onClick={() => setLogOpen(false)}
          aria-label="Close game log"
          data-ocid="game-board.game-log.close_button"
        >
          ✕
        </button>
      </div>

      {/* Backdrop */}
      {logOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/40"
          onClick={() => setLogOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setLogOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      {/* Main board */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Opponent zone */}
        <div
          className="border-b border-border/50 bg-card/30"
          data-ocid="game-board.opponent.section"
        >
          {oppState ? (
            <ResourcesBar
              playerState={oppState}
              isMyTurn={!isMyTurn}
              label="Opponent"
            />
          ) : (
            <div className="h-12 flex items-center px-4 text-sm text-muted-foreground font-mono">
              Waiting for opponent...
            </div>
          )}
          <div className="flex items-center justify-center gap-2 px-4 py-1">
            <span className="text-[11px] text-muted-foreground font-mono">
              {oppState ? `${oppState.hand.length} cards in hand` : "—"}
            </span>
            {/* Face-down hand cards */}
            <div className="flex gap-1">
              {Array.from({
                length: Math.min(oppState?.hand.length ?? 0, 8),
              }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder divs
                  key={`opp-hand-card-${i}`}
                  className="w-7 h-10 md:w-8 md:h-12 rounded border border-border bg-muted/60 flex items-center justify-center"
                  aria-hidden="true"
                />
              ))}
              {(oppState?.hand.length ?? 0) > 8 && (
                <span className="text-[10px] text-muted-foreground font-mono self-end pb-1">
                  +{(oppState?.hand.length ?? 0) - 8}
                </span>
              )}
            </div>
          </div>
          {oppState && (
            <div>
              <div className="px-4 pt-1">
                <div
                  className="text-[11px] uppercase tracking-wider font-semibold bg-white/10 text-white/70 rounded px-2 py-0.5 inline-flex items-center gap-1.5 mb-2"
                  data-ocid="game-board.phase-badge"
                >
                  {PHASE_LABELS[phase]} PHASE
                </div>
              </div>
              <PlayArea
                cards={oppState.playArea}
                cardLibrary={cardLibrary}
                isActive={false}
                isMyArea={false}
                selectedAttackers={attackerIds}
                highlightTargets={targetPicker?.validTargets ?? []}
                onSelectTarget={targetPicker ? selectTarget : undefined}
              />
            </div>
          )}
        </div>

        {/* Phase / turn divider */}
        <div
          className="flex items-center justify-between gap-3 px-4 py-1.5 bg-muted/20 border-y border-border/40 text-xs font-mono"
          data-ocid="game-board.phase-indicator"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-150"
              onClick={() => setLogOpen((v) => !v)}
              aria-label="Toggle game log"
              data-ocid="game-board.log-toggle.toggle"
            >
              <span className="text-sm">☰</span>
              <span className="hidden md:inline">Log</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {(
              [
                GamePhase.Start,
                GamePhase.Draw,
                GamePhase.Main,
                GamePhase.Combat,
                GamePhase.End,
              ] as GamePhase[]
            ).map((p) => (
              <Badge
                key={p}
                className="text-[10px] px-1.5 py-0 h-5 font-mono transition-all duration-150"
                style={{
                  background:
                    p === phase
                      ? isCombat
                        ? `${combatPhaseColor} / 0.18`
                        : "oklch(var(--play-current-phase) / 0.18)"
                      : "transparent",
                  color:
                    p === phase
                      ? isCombat
                        ? combatPhaseColor
                        : "oklch(var(--play-current-phase))"
                      : "oklch(var(--muted-foreground))",
                  border:
                    p === phase
                      ? isCombat
                        ? `1px solid ${combatPhaseColor} / 0.4`
                        : "1px solid oklch(var(--play-current-phase) / 0.4)"
                      : "1px solid transparent",
                }}
              >
                {PHASE_LABELS[p]}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Turn {Number(state.turn)}
            </span>
            <Badge
              className="text-[10px] px-2 py-0 h-5 font-mono"
              style={{
                background: isMyTurn
                  ? "oklch(var(--play-your-turn) / 0.15)"
                  : "oklch(var(--play-opponent-turn) / 0.15)",
                color: isMyTurn
                  ? "oklch(var(--play-your-turn))"
                  : "oklch(var(--play-opponent-turn))",
                border: `1px solid ${isMyTurn ? "oklch(var(--play-your-turn) / 0.4)" : "oklch(var(--play-opponent-turn) / 0.4)"}`,
              }}
            >
              {isMyTurn ? "YOUR TURN" : "OPP. TURN"}
            </Badge>
          </div>
        </div>

        {/* Combat sub-phase indicator */}
        {isCombat && (
          <div
            className="px-4 py-1 text-center text-xs font-mono font-semibold"
            style={{
              background: `${combatPhaseColor} / 0.1`,
              color: combatPhaseColor,
            }}
            data-ocid="game-board.combat-subphase"
          >
            {isDeclaringAttackers && "Declare Attackers"}
            {isAssigningBlockers && "Assign Blockers"}
            {combatSubPhase.__kind__ === "Idle" && "Combat Resolve"}
          </div>
        )}

        {/* Mulligan prompt */}
        {isMulliganPhase && canMulligan && (
          <div
            className="px-4 py-3 bg-muted/30 border-y border-border/40 flex items-center justify-center gap-3"
            data-ocid="game-board.mulligan.prompt"
          >
            <span className="text-sm font-medium">Keep this hand?</span>
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={() => {
                /* keep hand — just proceed */
              }}
              data-ocid="game-board.mulligan.keep_button"
            >
              Keep Hand
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onTakeMulligan}
              data-ocid="game-board.mulligan.mulligan_button"
            >
              Mulligan
            </Button>
          </div>
        )}

        {/* Discard prompt */}
        {discardRequired && (
          <div
            className="px-4 py-3 bg-destructive/5 border-y border-destructive/20 flex items-center justify-between gap-3"
            data-ocid="game-board.discard.prompt"
          >
            <span className="text-sm">
              Discard {discardCount} card{discardCount !== 1 ? "s" : ""}
            </span>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={discardSelection.size !== discardCount}
              onClick={confirmDiscard}
              data-ocid="game-board.discard.confirm_button"
            >
              Confirm Discard ({discardSelection.size}/{discardCount})
            </Button>
          </div>
        )}

        {/* Target picker indicator */}
        {targetPicker && (
          <div
            className="px-4 py-2 bg-primary/5 border-y border-primary/20 text-center text-sm"
            data-ocid="game-board.target-picker.banner"
          >
            <span style={{ color: "oklch(var(--target-highlight))" }}>
              Select a target...
            </span>
            <button
              type="button"
              className="ml-3 text-xs text-muted-foreground hover:text-foreground underline"
              onClick={() => setTargetPicker(null)}
              data-ocid="game-board.target-picker.cancel"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Player zone */}
        <div className="flex-1 flex flex-col min-h-0">
          {myState && (
            <PlayArea
              cards={myState.playArea}
              cardLibrary={cardLibrary}
              isActive={isMyTurn}
              isMyArea={true}
              selectedAttackers={selectedAttackers}
              highlightTargets={targetPicker?.validTargets ?? []}
              onSelectAttacker={
                isCombat && isMyTurn && isDeclaringAttackers
                  ? toggleAttacker
                  : undefined
              }
              onSelectBlocker={
                isCombat && !isMyTurn && isAssigningBlockers
                  ? toggleBlocker
                  : undefined
              }
              onSelectTarget={targetPicker ? selectTarget : undefined}
              onUseAbility={(instanceId, abilityId) =>
                startTargetPicker(instanceId, abilityId)
              }
            />
          )}
          {myState && (
            <div className="px-4 pt-1" data-ocid="game-board.turn-indicator">
              {isMyTurn ? (
                <div
                  className="text-sm font-semibold"
                  style={{ color: "oklch(var(--info))" }}
                >
                  Your Turn
                </div>
              ) : (
                <div
                  className="text-sm"
                  style={{ color: "oklch(var(--text-tertiary))" }}
                >
                  Opponent's Turn
                </div>
              )}
            </div>
          )}
          {myState && (
            <HandZone
              cardIds={myState.hand}
              cardLibrary={cardLibrary}
              isMyTurn={isMyTurn}
              isMainPhase={isMain}
              playerResources={myState.resources.map(
                ([name, amt]) => [name, Number(amt)] as [string, number],
              )}
              onPlayCard={onPlayCard}
              newlyDrawnCardId={newlyDrawnCardId}
              discardMode={discardRequired}
              discardSelection={discardSelection}
              onToggleDiscard={toggleDiscard}
            />
          )}
          {myState && (
            <ResourcesBar
              playerState={myState}
              isMyTurn={isMyTurn}
              label="You"
            />
          )}
        </div>
      </div>

      {/* Right action panel */}
      <div
        className="w-20 md:w-28 flex flex-col items-stretch gap-2 p-2 border-l border-border/50 bg-card/20"
        data-ocid="game-board.actions.panel"
      >
        <Button
          type="button"
          size="sm"
          variant="default"
          className="w-full text-xs h-9 font-mono"
          onClick={handleEndPhase}
          disabled={!isMyTurn}
          data-ocid="game-board.end-phase.button"
        >
          End Phase
        </Button>

        {isCombat && isMyTurn && isDeclaringAttackers && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="w-full text-xs h-9 font-mono"
            style={{
              background: "oklch(var(--combat-declare) / 0.15)",
              color: "oklch(var(--combat-declare))",
              border: "1px solid oklch(var(--combat-declare) / 0.4)",
            }}
            onClick={handleDeclareAttackers}
            disabled={selectedAttackers.length === 0}
            data-ocid="game-board.declare-attackers.button"
          >
            Declare
            {selectedAttackers.length > 0 && (
              <span className="ml-1 tabular-nums">
                ({selectedAttackers.length})
              </span>
            )}
          </Button>
        )}

        {isCombat && !isMyTurn && isAssigningBlockers && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="w-full text-xs h-9 font-mono"
            style={{
              background: "oklch(var(--combat-block) / 0.15)",
              color: "oklch(var(--combat-block))",
              border: "1px solid oklch(var(--combat-block) / 0.4)",
            }}
            onClick={handleAssignBlockers}
            data-ocid="game-board.assign-blockers.button"
          >
            Block
            {selectedBlockers.length > 0 && (
              <span className="ml-1 tabular-nums">
                ({selectedBlockers.length})
              </span>
            )}
          </Button>
        )}

        <div className="flex-1" />

        {!concedeConfirm ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="w-full text-xs h-9 font-mono text-muted-foreground hover:text-destructive"
            onClick={() => setConcedeConfirm(true)}
            data-ocid="game-board.concede.button"
          >
            Concede
          </Button>
        ) : (
          <div
            className="flex flex-col gap-1"
            data-ocid="game-board.concede-confirm.panel"
          >
            <p className="text-[10px] text-muted-foreground text-center font-mono">
              Sure?
            </p>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="w-full text-xs h-7"
              onClick={() => {
                onConcede();
                setConcedeConfirm(false);
              }}
              data-ocid="game-board.concede.confirm_button"
            >
              Yes
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="w-full text-xs h-7"
              onClick={() => setConcedeConfirm(false)}
              data-ocid="game-board.concede.cancel_button"
            >
              No
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
