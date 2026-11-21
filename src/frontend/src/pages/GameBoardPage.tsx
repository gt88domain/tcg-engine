import { GameStatus } from "@/backend";
import type { Card } from "@/backend";
import { GameBoard } from "@/components/GameBoard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useCardLibrary } from "@/hooks/useCards";
import { useGame } from "@/hooks/useGame";
import { useGameSession } from "@/hooks/useGameSession";
import { useParams } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

function BoardSkeleton() {
  return (
    <div className="h-screen flex flex-col gap-2 p-4 bg-background">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-8 w-full" />
      <div className="flex-1 flex gap-4">
        <Skeleton className="flex-1" />
        <Skeleton className="w-24" />
      </div>
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

export default function GameBoardPage() {
  const { sessionId: sessionIdStr } = useParams({ strict: false }) as {
    sessionId: string;
  };
  const sessionId = BigInt(sessionIdStr ?? "0");
  const navigate = useNavigate();

  const { principal } = useAuth();
  const { game } = useGame();

  const { session, isLoading, error, actions } = useGameSession(sessionId);

  const { data: cardsArray } = useCardLibrary(game?.id);
  const cardLibrary = new Map<bigint, Card>(
    (cardsArray ?? []).map((c) => [c.id, c]),
  );

  const [newlyDrawnCardId, setNewlyDrawnCardId] = useState<bigint | null>(null);
  const [reconnectError, setReconnectError] = useState(false);

  useEffect(() => {
    if (error) setReconnectError(true);
    else setReconnectError(false);
  }, [error]);

  const myPlayerId = principal?.toText() ?? "";

  async function handleDrawCard() {
    const res = await actions.drawCard.mutateAsync();
    const myState = res.state.playerStates.find(
      (ps) => ps.playerId.toText() === myPlayerId,
    );
    const lastCard = myState?.hand.at(-1);
    if (lastCard !== undefined) {
      setNewlyDrawnCardId(lastCard);
      setTimeout(() => setNewlyDrawnCardId(null), 600);
    }
  }

  // Suppress unused var warning — draw is triggered by phase auto-draw
  void handleDrawCard;

  if (isLoading && !session) return <BoardSkeleton />;

  if (!session) {
    return (
      <div className="context-play h-screen flex items-center justify-center bg-background">
        <div
          className="text-center space-y-4"
          data-ocid="game-board.error_state"
        >
          <p className="text-muted-foreground font-mono">Session not found.</p>
          <Button
            type="button"
            onClick={() => navigate({ to: "/play" })}
            data-ocid="game-board.return-home.button"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const status = session.state.status;

  if (status === GameStatus.WaitingForPlayer) {
    return (
      <div
        className="context-play h-screen flex flex-col items-center justify-center gap-6 bg-background"
        data-ocid="game-board.waiting.section"
      >
        {reconnectError && (
          <div
            className="fixed top-0 left-0 right-0 bg-[oklch(var(--warning)/0.15)] border-b border-[oklch(var(--warning)/0.3)] px-4 py-2 flex items-center gap-2"
            data-ocid="game-board.reconnecting.loading_state"
          >
            <span className="animate-pulse w-2 h-2 rounded-full bg-[oklch(var(--warning))]" />
            <span className="text-xs font-mono text-[oklch(var(--warning))]">
              Reconnecting…
            </span>
          </div>
        )}
        <div className="text-center space-y-2">
          <Badge
            className="text-sm px-4 py-1"
            style={{
              background: "oklch(var(--play-current-phase) / 0.15)",
              color: "oklch(var(--play-current-phase))",
              border: "1px solid oklch(var(--play-current-phase) / 0.3)",
            }}
          >
            Waiting for opponent
          </Badge>
          <p className="text-muted-foreground text-sm font-mono">
            Share your invite code to start the game.
          </p>
        </div>
        <div
          className="bg-card border border-border rounded-xl px-8 py-5 flex flex-col items-center gap-3"
          data-ocid="game-board.invite-code.card"
        >
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Invite Code
          </p>
          <p className="text-4xl font-display font-bold tracking-widest text-foreground select-all">
            {session.inviteCode}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="text-xs font-mono"
            onClick={() => navigator.clipboard.writeText(session.inviteCode)}
            data-ocid="game-board.copy-code.button"
          >
            Copy code
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground font-mono text-sm"
          onClick={() => navigate({ to: "/play" })}
          data-ocid="game-board.return-home.button"
        >
          Cancel
        </Button>
      </div>
    );
  }

  if (status === GameStatus.Completed && session.result) {
    const didWin = session.result.winnerId.toText() === myPlayerId;
    const finalTurn = Number(session.result.finalTurn);
    return (
      <div
        className="context-play h-screen flex flex-col items-center justify-center gap-6 bg-background"
        data-ocid="game-board.result.section"
      >
        <div className="text-center space-y-3">
          <div
            className="text-6xl font-display font-bold"
            style={{
              color: didWin
                ? "oklch(var(--play-winner))"
                : "oklch(var(--danger))",
            }}
            data-ocid="game-board.result.card"
          >
            {didWin ? "Victory" : "Defeat"}
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            Game ended on turn {finalTurn}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => navigate({ to: "/play/new" })}
            data-ocid="game-board.play-again.button"
          >
            Play Again
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/play" })}
            data-ocid="game-board.return-home.button"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  if (status === GameStatus.Abandoned) {
    return (
      <div
        className="context-play h-screen flex flex-col items-center justify-center gap-4 bg-background"
        data-ocid="game-board.abandoned.section"
      >
        <p className="text-muted-foreground font-mono">
          This game was abandoned.
        </p>
        <Button
          type="button"
          onClick={() => navigate({ to: "/play" })}
          data-ocid="game-board.return-home.button"
        >
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="context-play" data-ocid="game-board.page">
      {reconnectError && (
        <div
          className="fixed top-0 left-0 right-0 z-50 bg-[oklch(var(--warning)/0.15)] border-b border-[oklch(var(--warning)/0.3)] px-4 py-2 flex items-center gap-2"
          data-ocid="game-board.reconnecting.loading_state"
        >
          <span className="animate-pulse w-2 h-2 rounded-full bg-[oklch(var(--warning))]" />
          <span className="text-xs font-mono text-[oklch(var(--warning))]">
            Reconnecting…
          </span>
        </div>
      )}
      <GameBoard
        session={session}
        myPlayerId={myPlayerId}
        cardLibrary={cardLibrary}
        onEndPhase={() => actions.endPhase.mutate()}
        onDeclareAttackers={(attackerIndices) =>
          actions.declareAttackers.mutate(attackerIndices)
        }
        onAssignBlockers={(blockingInstanceIds) =>
          actions.assignBlockers.mutate(blockingInstanceIds)
        }
        onTakeMulligan={() => actions.takeMulligan.mutate()}
        onDiscardCard={(handIndex) => actions.discardCard.mutate(handIndex)}
        onConcede={() => actions.concede.mutate()}
        onPlayCard={(cardId, card) => actions.playCard.mutate({ cardId, card })}
        onUseAbility={(sourceId, abilityId, targetId) =>
          actions.useAbility.mutate({
            sourceInstanceId: sourceId,
            abilityId,
            targetInstanceId: targetId,
            effects: [],
          })
        }
        newlyDrawnCardId={newlyDrawnCardId}
      />
    </div>
  );
}
