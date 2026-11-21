import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { usePlayerRole } from "@/hooks/useAuth";
import { useDecks } from "@/hooks/useDecks";
import { useGame, useGameDefinition } from "@/hooks/useGame";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpen, ListChecks, Swords, Trophy, User } from "lucide-react";

function RecordBadge({
  wins,
  losses,
  gamesPlayed,
}: { wins: number; losses: number; gamesPlayed: number }) {
  if (gamesPlayed === 0) {
    return <span className="text-xs text-muted-foreground">No games yet</span>;
  }
  const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span
        className="font-semibold tabular-nums"
        style={{ color: "oklch(var(--status-published))" }}
      >
        {wins}W
      </span>
      <span
        className="font-semibold tabular-nums"
        style={{ color: "oklch(var(--danger))" }}
      >
        {losses}L
      </span>
      <span className="text-muted-foreground tabular-nums">{winRate}%</span>
    </div>
  );
}

export default function PlayHomePage() {
  const { game, isLoading, gameName } = useGame();
  const { isAuthenticated, principal } = useAuth();
  const { player, isLoading: roleLoading } = usePlayerRole();
  const { actor, isFetching } = useActor(createActor);

  const { data: myDecks = [], isLoading: decksLoading } = useDecks(
    game?.id,
    principal ?? undefined,
  );

  const { data: playerAccount, isLoading: playerLoading } = useQuery({
    queryKey: ["player", principal?.toText()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getPlayer(principal);
    },
    enabled: !!actor && !isFetching && !!principal && isAuthenticated,
  });

  const record = playerAccount?.record ?? player?.record;

  if (isLoading || roleLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5" data-ocid="play_home.page">
      {/* Game Identity */}
      <div
        className="rounded-2xl border border-border p-8"
        style={{ background: "oklch(var(--card))" }}
        data-ocid="play_home.identity_card"
      >
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
            {gameName}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Welcome to {gameName}. Build your deck and challenge other players.
          </p>
          {game && (
            <p className="text-xs text-muted-foreground mt-1">
              Designed by{" "}
              <span className="font-mono text-xs">
                {game.designerPrincipal.toText().slice(0, 8)}…
              </span>
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center mt-6 flex-wrap">
          <Link to="/play/new" data-ocid="play_home.play_now_button">
            <Button
              type="button"
              className="gap-2 px-8"
              style={{
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))",
              }}
            >
              <Swords className="w-4 h-4" />
              Play Now
            </Button>
          </Link>
          <Link to="/how-to-play" data-ocid="play_home.how_to_play_link">
            <Button type="button" variant="outline" className="gap-2">
              <BookOpen className="w-4 h-4" />
              How To Play
            </Button>
          </Link>
        </div>
      </div>

      {/* My Record */}
      {isAuthenticated && (
        <div
          className="rounded-xl border border-border p-5 flex items-center justify-between gap-4"
          style={{ background: "oklch(var(--card))" }}
          data-ocid="play_home.my_record_card"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "oklch(var(--primary)/0.12)" }}
            >
              <Trophy
                className="w-4 h-4"
                style={{ color: "oklch(var(--primary))" }}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                My Record
              </p>
              {playerLoading ? (
                <Skeleton className="h-4 w-24 mt-1" />
              ) : record ? (
                <RecordBadge
                  wins={Number(record.wins)}
                  losses={Number(record.losses)}
                  gamesPlayed={Number(record.gamesPlayed)}
                />
              ) : (
                <p className="text-xs text-muted-foreground">No games yet</p>
              )}
            </div>
          </div>
          <Link to="/profile" data-ocid="play_home.profile_link">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <User className="w-3.5 h-3.5" />
              Profile
            </Button>
          </Link>
        </div>
      )}

      {/* My Decks */}
      <div
        className="rounded-xl border border-border p-5"
        style={{ background: "oklch(var(--card))" }}
        data-ocid="play_home.my_decks_section"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold flex items-center gap-2">
            <ListChecks
              className="w-4 h-4"
              style={{ color: "oklch(var(--primary))" }}
            />
            My Decks
          </p>
          <Link to="/my-decks" data-ocid="play_home.view_decks_link">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs h-7"
            >
              View All
            </Button>
          </Link>
        </div>

        {decksLoading ? (
          <div className="space-y-2">
            {[1, 2].map((n) => (
              <Skeleton key={n} className="h-8 rounded-lg" />
            ))}
          </div>
        ) : myDecks.length === 0 ? (
          <div
            className="text-center py-4"
            data-ocid="play_home.decks_empty_state"
          >
            <p className="text-sm text-muted-foreground">No decks yet.</p>
            <Link to="/my-decks" data-ocid="play_home.build_deck_link">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-xs mt-1"
              >
                Build your first deck
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {myDecks.slice(0, 3).map((deck, i) => (
              <li
                key={deck.id.toString()}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30"
                data-ocid={`play_home.deck_item.${i + 1}`}
              >
                <span className="text-sm font-medium truncate">
                  {deck.name}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0 ml-2">
                  {deck.cards.reduce((s, e) => s + Number(e.count), 0)} cards
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
