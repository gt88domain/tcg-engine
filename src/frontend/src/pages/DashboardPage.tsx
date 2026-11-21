import { createActor } from "@/backend";
import type { CardUsageStat, GameResult } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { usePlayerRole } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Layers,
  Plus,
  Radio,
  Swords,
  Users,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon,
  loading,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="flex items-start gap-4 p-5">
        <div
          className="p-2 rounded-lg shrink-0"
          style={{ background: "oklch(var(--primary) / 0.15)" }}
        >
          <span style={{ color: "oklch(var(--primary))" }}>{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="h-6 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-display font-bold tabular-nums mt-0.5">
              {value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CardWinRateRow({
  stat,
  cardName,
  index,
}: { stat: CardUsageStat; cardName: string; index: number }) {
  const winRate =
    Number(stat.uses) > 0
      ? Math.round((Number(stat.wins) / Number(stat.uses)) * 100)
      : 0;
  return (
    <div
      className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30"
      data-ocid={`dashboard.card_winrate.item.${index}`}
    >
      <span className="text-sm font-medium">{cardName}</span>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-muted-foreground tabular-nums">
          {stat.uses.toString()} uses
        </span>
        <span
          className="font-semibold tabular-nums"
          style={{
            color:
              winRate >= 60
                ? "oklch(var(--analysis-good))"
                : winRate >= 40
                  ? "oklch(var(--analysis-warning))"
                  : "oklch(var(--analysis-critical))",
          }}
        >
          {winRate}%
        </span>
      </div>
    </div>
  );
}

function RecentGameRow({ game, index }: { game: GameResult; index: number }) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30"
      data-ocid={`dashboard.recent_game.item.${index}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{
            background: "oklch(var(--status-published))",
          }}
        />
        <span className="text-sm truncate">
          Turn {game.finalTurn.toString()} ·{" "}
          {game.endCondition === "HealthZero"
            ? "Health Zero"
            : game.endCondition === "Forfeit"
              ? "Forfeit"
              : "Concede"}
        </span>
      </div>
      <span className="text-xs text-muted-foreground tabular-nums shrink-0 ml-2">
        {new Date(Number(game.completedAt) / 1_000_000).toLocaleDateString()}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const { game, isLoading, isPublished, isOwner } = useGame();
  const { isAuthenticated, login } = useAuth();
  const { actor, isFetching } = useActor(createActor);

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardData();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: allCards = [] } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCards(game?.id ?? BigInt(1));
    },
    enabled: !!actor && !isFetching,
  });

  const cardNameMap = new Map(allCards.map((c) => [c.id.toString(), c.name]));

  const stats = dashboardData?.stats;
  const cardWinRates = stats?.cardWinRates ?? [];
  const recentGames = stats?.recentGames ?? [];
  const gamesPlayed = Number(stats?.gamesPlayed ?? 0);
  const activePlayers = Number(stats?.activePlayers ?? 0);

  const sortedWinRates = [...cardWinRates].sort(
    (a, b) => Number(b.uses) - Number(a.uses),
  );

  if (!isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center"
        data-ocid="dashboard.unauthenticated"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "oklch(var(--primary) / 0.15)" }}
        >
          <Swords
            className="w-8 h-8"
            style={{ color: "oklch(var(--primary))" }}
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-display font-bold">
            Welcome to your TCG
          </h1>
          <p className="text-muted-foreground max-w-sm">
            Sign in with Internet Identity to design your game or start playing.
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          onClick={() => login()}
          data-ocid="dashboard.login_button"
          style={{
            background: "oklch(var(--primary))",
            color: "oklch(var(--primary-foreground))",
          }}
        >
          Sign in to get started
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: positional skeleton
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!game && isOwner === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <AlertCircle className="w-10 h-10 text-muted-foreground" />
        <p className="text-muted-foreground">
          No game found for this instance.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl" data-ocid="dashboard.page">
      {/* Status banner */}
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-xl font-display font-bold">
          {game?.name ?? "Your Game"}
        </h1>
        <Badge
          className="text-xs"
          style={{
            background: isPublished
              ? "oklch(var(--status-published) / 0.2)"
              : "oklch(var(--status-draft) / 0.2)",
            color: isPublished
              ? "oklch(var(--status-published))"
              : "oklch(var(--status-draft))",
            border: "none",
          }}
        >
          {isPublished ? "Published" : "In Development"}
        </Badge>
        {game && (
          <span className="text-xs text-muted-foreground">
            v{game.version.toString()}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Games Played"
          value={dashboardLoading ? "…" : gamesPlayed}
          icon={<Swords className="w-5 h-5" />}
          loading={dashboardLoading}
        />
        <StatCard
          label="Active Players"
          value={dashboardLoading ? "…" : activePlayers}
          icon={<Users className="w-5 h-5" />}
          loading={dashboardLoading}
        />
        <StatCard
          label="Status"
          value={isPublished ? "Live" : "Draft"}
          icon={<Radio className="w-5 h-5" />}
        />
        <StatCard
          label="Card Types"
          value={game?.cardTypes?.length ?? 0}
          icon={<BookOpen className="w-5 h-5" />}
        />
      </div>

      {/* Card Win Rates */}
      <div data-ocid="dashboard.card_winrates_section">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Card Win Rates
        </h2>
        {dashboardLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-10 rounded-lg" />
            ))}
          </div>
        ) : sortedWinRates.length === 0 ? (
          <div
            className="text-center py-6 rounded-xl border border-border bg-card"
            data-ocid="dashboard.card_winrates_empty_state"
          >
            <p className="text-sm text-muted-foreground">
              No games played yet. Win rates will appear here once players start
              playing.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {sortedWinRates.slice(0, 6).map((stat, i) => (
              <CardWinRateRow
                key={String(stat.cardId)}
                stat={stat}
                cardName={
                  cardNameMap.get(stat.cardId.toString()) ??
                  `Card #${stat.cardId}`
                }
                index={i + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Games */}
      <div data-ocid="dashboard.recent_games_section">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Recent Games
        </h2>
        {dashboardLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-10 rounded-lg" />
            ))}
          </div>
        ) : recentGames.length === 0 ? (
          <div
            className="text-center py-6 rounded-xl border border-border bg-card"
            data-ocid="dashboard.recent_games_empty_state"
          >
            <p className="text-sm text-muted-foreground">
              No games played yet.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {recentGames.slice(0, 5).map((game, i) => (
              <RecentGameRow
                key={String(game.completedAt)}
                game={game}
                index={i + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      {isOwner && (
        <div data-ocid="dashboard.quick_actions">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link to="/design/cards" data-ocid="dashboard.new_card_link">
              <Card className="bg-card border-border hover:border-[oklch(var(--primary))] transition-colors duration-150 cursor-pointer group">
                <CardContent className="flex items-center gap-3 p-4">
                  <Plus
                    className="w-4 h-4"
                    style={{ color: "oklch(var(--primary))" }}
                  />
                  <span className="text-sm font-medium">New Card</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                </CardContent>
              </Card>
            </Link>
            <Link to="/design/game-rules" data-ocid="dashboard.edit_rules_link">
              <Card className="bg-card border-border hover:border-[oklch(var(--primary))] transition-colors duration-150 cursor-pointer group">
                <CardContent className="flex items-center gap-3 p-4">
                  <BookOpen
                    className="w-4 h-4"
                    style={{ color: "oklch(var(--primary))" }}
                  />
                  <span className="text-sm font-medium">Edit Rules</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                </CardContent>
              </Card>
            </Link>
            <Link to="/publish" data-ocid="dashboard.publish_link">
              <Card className="bg-card border-border hover:border-[oklch(var(--primary))] transition-colors duration-150 cursor-pointer group">
                <CardContent className="flex items-center gap-3 p-4">
                  <Radio
                    className="w-4 h-4"
                    style={{ color: "oklch(var(--primary))" }}
                  />
                  <span className="text-sm font-medium">
                    {isPublished ? "Manage Visibility" : "Publish Game"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}

      {/* Player quick actions */}
      {!isOwner && (
        <div className="flex gap-3" data-ocid="dashboard.player_actions">
          <Button
            asChild
            style={{
              background: "oklch(var(--primary))",
              color: "oklch(var(--primary-foreground))",
            }}
          >
            <Link to="/play" data-ocid="dashboard.play_now_button">
              <Swords className="w-4 h-4 mr-2" />
              Play Now
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/my-decks" data-ocid="dashboard.my_decks_button">
              My Decks
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
