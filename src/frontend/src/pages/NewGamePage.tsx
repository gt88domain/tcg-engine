import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import type { Deck } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Check,
  Copy,
  Link2,
  Loader2,
  Swords,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function CopyField({ value, ocid }: { value: string; ocid: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied!");
  }
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm font-mono truncate"
        style={{ color: "oklch(var(--foreground))" }}
      >
        {value}
      </div>
      <button
        type="button"
        onClick={handleCopy}
        data-ocid={ocid}
        aria-label="Copy"
        className="p-2 rounded-lg border border-border hover:bg-muted transition-colors duration-150"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

type GameMode = "private" | "practice";

export default function NewGamePage() {
  const { game, isLoading: gameLoading } = useGame();
  const { actor, isFetching } = useActor(createActor);
  const { principal } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [mode, setMode] = useState<GameMode | null>(null);
  const [selectedDeckId, setSelectedDeckId] = useState<bigint | null>(null);
  const [waitingSession, setWaitingSession] = useState<{
    inviteCode: string;
    sessionId: string;
  } | null>(null);

  const { data: myDecks = [], isLoading: decksLoading } = useQuery({
    queryKey: ["decks", "mine", principal?.toText()],
    queryFn: async () => {
      if (!actor || !game || !principal) return [];
      return actor.listDecks(principal, game.id);
    },
    enabled: !!actor && !isFetching && !!game && !!principal,
  });

  const { data: starterDecks = [] } = useQuery({
    queryKey: ["decks", "starter", game?.id?.toString()],
    queryFn: async () => {
      if (!actor || !game) return [];
      const all = await actor.listDecks(null, game.id);
      return all.filter((d) => d.isStarterDeck);
    },
    enabled: !!actor && !isFetching && !!game,
  });

  const allDecks: Deck[] = [
    ...starterDecks.filter((s) => !myDecks.some((m) => m.id === s.id)),
    ...myDecks,
  ];

  const startMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !game) throw new Error("Not connected");
      const code =
        mode === "private"
          ? generateInviteCode()
          : `BOT-${generateInviteCode()}`;
      const session = await actor.createGameSession(game.id, code);
      return session;
    },
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ["game-sessions"] });
      if (mode === "practice") {
        toast.success("Practice session started!");
        navigate({
          to: "/play/game/$sessionId",
          params: { sessionId: session.id.toString() },
        });
      } else {
        setWaitingSession({
          inviteCode: session.inviteCode,
          sessionId: session.id.toString(),
        });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelSession = () => {
    setWaitingSession(null);
    setMode(null);
  };

  if (gameLoading) {
    return (
      <div className="p-6 max-w-xl mx-auto space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    );
  }

  if (waitingSession) {
    const joinUrl = `${window.location.origin}/join/${waitingSession.inviteCode}`;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div
          className="max-w-md w-full mx-auto rounded-2xl border border-border p-8 space-y-5"
          style={{ background: "oklch(var(--card))" }}
          data-ocid="new_game.waiting_panel"
        >
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "oklch(var(--primary)/0.12)" }}
            >
              <Loader2
                className="w-6 h-6 animate-spin"
                style={{ color: "oklch(var(--primary))" }}
              />
            </div>
            <h2 className="text-lg font-display font-semibold">
              Waiting for Opponent…
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Share the code or link below
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                Join Code
              </p>
              <div
                className="text-center py-3 rounded-xl"
                style={{ background: "oklch(var(--primary)/0.08)" }}
              >
                <span
                  className="text-3xl font-display font-bold tracking-[0.15em]"
                  style={{ color: "oklch(var(--primary))" }}
                >
                  {waitingSession.inviteCode}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
                Invite Link
              </p>
              <CopyField value={joinUrl} ocid="new_game.copy_link_button" />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={cancelSession}
            data-ocid="new_game.cancel_button"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6" data-ocid="new_game.page">
      <section data-ocid="new_game.mode_section">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Choose Mode
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode("private")}
            data-ocid="new_game.private_mode_button"
            className="flex flex-col items-start gap-3 p-5 rounded-xl border transition-colors duration-150 text-left"
            style={{
              borderColor:
                mode === "private"
                  ? "oklch(var(--primary)/0.6)"
                  : "oklch(var(--border))",
              background:
                mode === "private"
                  ? "oklch(var(--primary)/0.07)"
                  : "oklch(var(--card))",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "oklch(var(--primary)/0.12)",
                color: "oklch(var(--primary))",
              }}
            >
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Private Game</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Invite a specific opponent via link or code
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode("practice")}
            data-ocid="new_game.practice_mode_button"
            className="flex flex-col items-start gap-3 p-5 rounded-xl border transition-colors duration-150 text-left"
            style={{
              borderColor:
                mode === "practice"
                  ? "oklch(var(--primary)/0.6)"
                  : "oklch(var(--border))",
              background:
                mode === "practice"
                  ? "oklch(var(--primary)/0.07)"
                  : "oklch(var(--card))",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "oklch(var(--primary)/0.12)",
                color: "oklch(var(--primary))",
              }}
            >
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Practice Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Play solo against a scripted opponent
              </p>
            </div>
          </button>
        </div>
      </section>

      <section data-ocid="new_game.deck_section">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Select Deck
        </p>
        {decksLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : allDecks.length === 0 ? (
          <div
            className="py-8 text-center rounded-xl border border-border"
            data-ocid="new_game.decks_empty_state"
          >
            <p className="text-sm text-muted-foreground">
              No decks available. Build one first.
            </p>
          </div>
        ) : (
          <div
            className="space-y-2"
            role="radiogroup"
            aria-label="Deck selection"
          >
            {allDecks.map((deck, i) => {
              const selected = selectedDeckId === deck.id;
              return (
                <button
                  key={deck.id.toString()}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedDeckId(deck.id)}
                  data-ocid={`new_game.deck_item.${i + 1}`}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-colors duration-150 text-left"
                  style={{
                    borderColor: selected
                      ? "oklch(var(--primary)/0.6)"
                      : "oklch(var(--border))",
                    background: selected
                      ? "oklch(var(--primary)/0.07)"
                      : "oklch(var(--card))",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Link2
                      className="w-4 h-4"
                      style={{
                        color: selected
                          ? "oklch(var(--primary))"
                          : "oklch(var(--muted-foreground))",
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold">{deck.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {deck.cards.reduce((s, e) => s + Number(e.count), 0)}{" "}
                          cards
                        </span>
                        {deck.isStarterDeck && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                          >
                            Starter
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {selected && (
                    <Check
                      className="w-4 h-4 shrink-0"
                      style={{ color: "oklch(var(--primary))" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <Button
        type="button"
        className="w-full gap-2"
        disabled={
          !mode ||
          startMutation.isPending ||
          (allDecks.length > 0 && selectedDeckId === null)
        }
        onClick={() => startMutation.mutate()}
        data-ocid="new_game.start_button"
        style={{
          background: "oklch(var(--primary))",
          color: "oklch(var(--primary-foreground))",
        }}
      >
        {startMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Starting…
          </>
        ) : (
          <>
            <Swords className="w-4 h-4" />
            {mode === "practice"
              ? "Start Practice"
              : mode === "private"
                ? "Create Game"
                : "Start Game"}
            <ArrowRight className="w-4 h-4 ml-auto" />
          </>
        )}
      </Button>
    </div>
  );
}
