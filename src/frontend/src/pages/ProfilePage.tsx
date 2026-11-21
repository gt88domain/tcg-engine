import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, usePlayerRole } from "@/hooks/useAuth";
import { useDecks } from "@/hooks/useDecks";
import { useGame } from "@/hooks/useGame";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Swords, Trophy, User } from "lucide-react";

export default function ProfilePage() {
  const { game } = useGame();
  const { isAuthenticated, principal } = useAuth();
  const { player, isLoading: roleLoading } = usePlayerRole();
  const { actor, isFetching } = useActor(createActor);

  const { data: playerAccount, isLoading: playerLoading } = useQuery({
    queryKey: ["player", principal?.toText()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getPlayer(principal);
    },
    enabled: !!actor && !isFetching && !!principal && isAuthenticated,
  });

  const { data: myDecks = [], isLoading: decksLoading } = useDecks(
    game?.id,
    principal ?? undefined,
  );

  const record = playerAccount?.record;
  const wins = Number(record?.wins ?? 0);
  const losses = Number(record?.losses ?? 0);
  const gamesPlayed = Number(record?.gamesPlayed ?? 0);
  const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;

  const displayName = playerAccount?.username ?? "Player";
  const roleLabel = player?.role ?? "Player";

  if (roleLoading || playerLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5" data-ocid="profile.page">
      {/* Profile Header */}
      <div
        className="rounded-2xl border border-border p-6"
        style={{ background: "oklch(var(--card))" }}
        data-ocid="profile.header_card"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "oklch(var(--primary)/0.12)" }}
          >
            <User
              className="w-7 h-7"
              style={{ color: "oklch(var(--primary))" }}
            />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold">{displayName}</h1>
            <p className="text-xs text-muted-foreground capitalize">
              {roleLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className="rounded-xl border border-border p-5"
        style={{ background: "oklch(var(--card))" }}
        data-ocid="profile.stats_card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Trophy
            className="w-4 h-4"
            style={{ color: "oklch(var(--primary))" }}
          />
          <p className="text-sm font-semibold">Match Record</p>
        </div>

        {gamesPlayed === 0 ? (
          <div
            className="text-center py-4"
            data-ocid="profile.record_empty_state"
          >
            <p className="text-sm text-muted-foreground">
              No matches played yet.
            </p>
            <Link to="/play/new" data-ocid="profile.play_now_link">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-xs mt-1 gap-1"
              >
                <Swords className="w-3.5 h-3.5" />
                Play your first game
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p
                className="text-2xl font-display font-bold tabular-nums"
                style={{ color: "oklch(var(--status-published))" }}
              >
                {wins}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Wins</p>
            </div>
            <div className="text-center">
              <p
                className="text-2xl font-display font-bold tabular-nums"
                style={{ color: "oklch(var(--danger))" }}
              >
                {losses}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Losses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold tabular-nums text-foreground">
                {winRate}%
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Win Rate</p>
            </div>
          </div>
        )}
      </div>

      {/* Decks */}
      <div
        className="rounded-xl border border-border p-5"
        style={{ background: "oklch(var(--card))" }}
        data-ocid="profile.decks_section"
      >
        <p className="text-sm font-semibold mb-3">My Decks</p>
        {decksLoading ? (
          <div className="space-y-2">
            {[1, 2].map((n) => (
              <Skeleton key={n} className="h-8 rounded-lg" />
            ))}
          </div>
        ) : myDecks.length === 0 ? (
          <div
            className="text-center py-4"
            data-ocid="profile.decks_empty_state"
          >
            <p className="text-sm text-muted-foreground">No decks yet.</p>
            <Link to="/my-decks" data-ocid="profile.build_deck_link">
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
            {myDecks.map((deck, i) => (
              <li
                key={deck.id.toString()}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30"
                data-ocid={`profile.deck_item.${i + 1}`}
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
