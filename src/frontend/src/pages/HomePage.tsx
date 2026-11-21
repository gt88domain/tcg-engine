import { createActor } from "@/backend";
import { GameVisibility } from "@/backend.d";
import { Shell } from "@/components/Shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { usePlayerRole } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Layers,
  ListChecks,
  Radio,
  Swords,
  TrendingUp,
  Users,
  Wand2,
} from "lucide-react";

function VisibilityIcon({ v }: { v: GameVisibility }) {
  if (v === GameVisibility.Open)
    return <Globe className="w-4 h-4" aria-hidden />;
  if (v === GameVisibility.InviteOnly)
    return <Users className="w-4 h-4" aria-hidden />;
  return <EyeOff className="w-4 h-4" aria-hidden />;
}

function VisibilityLabel({ v }: { v: GameVisibility }) {
  if (v === GameVisibility.Open) return <>Open</>;
  if (v === GameVisibility.InviteOnly) return <>Invite-Only</>;
  return <>Private</>;
}

function QuickLinkCard({
  icon,
  label,
  description,
  to,
  ocid,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  to: string;
  ocid: string;
}) {
  return (
    <Link
      to={to}
      data-ocid={ocid}
      className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors duration-150 group"
    >
      <span
        className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: "oklch(var(--primary)/0.12)",
          color: "oklch(var(--primary))",
        }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-150">
          {label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {description}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
    </Link>
  );
}

function OwnerUnpublishedView({
  cardCount,
  deckCount,
}: { cardCount: number; deckCount: number }) {
  const readyToPublish = cardCount >= 5 && deckCount >= 1;
  return (
    <div
      className="p-6 max-w-3xl mx-auto space-y-6"
      data-ocid="home.owner_unpublished_section"
    >
      {/* Status card */}
      <div
        className="rounded-2xl border border-border p-6"
        style={{ background: "oklch(var(--card))" }}
        data-ocid="home.game_status_card"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Game Status
            </p>
            <Badge
              variant="outline"
              className="text-sm font-semibold"
              style={{
                color: "oklch(var(--status-draft))",
                borderColor: "oklch(var(--status-draft)/0.4)",
              }}
            >
              In Development
            </Badge>
          </div>
          <Link to="/publish" data-ocid="home.publish_cta_button">
            <Button
              type="button"
              className="gap-2"
              style={{
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))",
              }}
            >
              <Radio className="w-4 h-4" />
              Publish Game
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="text-center rounded-xl bg-muted/40 py-4">
            <p
              className="text-2xl font-display font-bold tabular-nums"
              style={{ color: "oklch(var(--primary))" }}
            >
              {cardCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Cards Created</p>
          </div>
          <div className="text-center rounded-xl bg-muted/40 py-4">
            <p
              className="text-2xl font-display font-bold tabular-nums"
              style={{ color: "oklch(var(--primary))" }}
            >
              {deckCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Decks Built</p>
          </div>
          <div
            className="col-span-2 sm:col-span-1 flex items-center justify-center rounded-xl py-4"
            style={{
              background: readyToPublish
                ? "oklch(var(--status-published)/0.1)"
                : "oklch(var(--status-draft)/0.1)",
            }}
          >
            <div className="text-center">
              <p
                className="text-sm font-semibold"
                style={{
                  color: readyToPublish
                    ? "oklch(var(--status-published))"
                    : "oklch(var(--status-draft))",
                }}
              >
                {readyToPublish ? "Ready to publish" : "Keep building"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {readyToPublish
                  ? "5+ cards, 1+ deck ✓"
                  : `Need ${Math.max(0, 5 - cardCount)} more cards`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Design Workspace
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickLinkCard
            icon={<BookOpen className="w-4 h-4" />}
            label="Game Rules"
            description="Define mechanics, win conditions, turn structure"
            to="/design/game-rules"
            ocid="home.game_rules_link"
          />
          <QuickLinkCard
            icon={<Layers className="w-4 h-4" />}
            label="Card Library"
            description="Create and manage your game's cards"
            to="/design/cards"
            ocid="home.cards_link"
          />
          <QuickLinkCard
            icon={<ListChecks className="w-4 h-4" />}
            label="Decks"
            description="Build decks and validate card selections"
            to="/design/decks"
            ocid="home.decks_link"
          />
          <QuickLinkCard
            icon={<Radio className="w-4 h-4" />}
            label="Publish & Visibility"
            description="Make your game available to players"
            to="/publish"
            ocid="home.publish_link"
          />
        </div>
      </div>
    </div>
  );
}

function OwnerPublishedView({
  game,
  cardCount,
  deckCount,
}: {
  game: import("@/types").GameDefinition;
  cardCount: number;
  deckCount: number;
}) {
  return (
    <div
      className="p-6 max-w-3xl mx-auto space-y-6"
      data-ocid="home.owner_published_section"
    >
      {/* Hero row */}
      <div
        className="rounded-2xl border border-border p-6"
        style={{ background: "oklch(var(--card))" }}
        data-ocid="home.owner_dashboard_card"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Game Status
            </p>
            <Badge
              variant="outline"
              className="text-sm font-semibold"
              style={{
                color: "oklch(var(--status-published))",
                borderColor: "oklch(var(--status-published)/0.4)",
              }}
            >
              Published
            </Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/play/new" data-ocid="home.play_now_button">
              <Button
                type="button"
                className="gap-2"
                style={{
                  background: "oklch(var(--primary))",
                  color: "oklch(var(--primary-foreground))",
                }}
              >
                <Swords className="w-4 h-4" />
                Play
              </Button>
            </Link>
            <Link to="/design" data-ocid="home.edit_game_button">
              <Button type="button" variant="outline" className="gap-2">
                <Wand2 className="w-4 h-4" />
                Edit Game
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center rounded-xl bg-muted/40 py-4">
            <p
              className="text-2xl font-display font-bold tabular-nums"
              style={{ color: "oklch(var(--primary))" }}
            >
              {cardCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Cards</p>
          </div>
          <div className="text-center rounded-xl bg-muted/40 py-4">
            <p
              className="text-2xl font-display font-bold tabular-nums"
              style={{ color: "oklch(var(--primary))" }}
            >
              {deckCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Decks</p>
          </div>
          <div
            className="text-center rounded-xl py-4"
            style={{ background: "oklch(var(--primary)/0.08)" }}
          >
            <div
              className="flex items-center justify-center gap-1.5 text-sm font-semibold"
              style={{ color: "oklch(var(--primary))" }}
            >
              <VisibilityIcon v={game.visibility} />
              <VisibilityLabel v={game.visibility} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Visibility</p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickLinkCard
            icon={<Layers className="w-4 h-4" />}
            label="Card Library"
            description="Add or refine cards in your game"
            to="/design/cards"
            ocid="home.cards_link"
          />
          <QuickLinkCard
            icon={<Users className="w-4 h-4" />}
            label="Players"
            description="See who's playing your game"
            to="/players"
            ocid="home.players_link"
          />
          <QuickLinkCard
            icon={<Radio className="w-4 h-4" />}
            label="Publish & Visibility"
            description="Manage invite links and visibility"
            to="/publish"
            ocid="home.publish_link"
          />
          <QuickLinkCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="Decks"
            description="Manage starter and recommended decks"
            to="/design/decks"
            ocid="home.decks_link"
          />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { game, isLoading, isPublished, isOwner } = useGame();
  const { isAuthenticated } = useAuth();
  const { actor, isFetching } = useActor(createActor);

  const { data: cards = [] } = useQuery({
    queryKey: ["cards", game?.id?.toString()],
    queryFn: async () => {
      if (!actor || !game) return [];
      return actor.listCards(game.id);
    },
    enabled: !!actor && !isFetching && !!game,
  });

  const { data: decks = [] } = useQuery({
    queryKey: ["decks", game?.id?.toString()],
    queryFn: async () => {
      if (!actor || !game) return [];
      return actor.listDecks(null, game.id);
    },
    enabled: !!actor && !isFetching && !!game,
  });

  if (isLoading) {
    return (
      <Shell>
        <div className="p-6 max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-40 rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </Shell>
    );
  }

  // Owner: game unpublished → design landing
  if (isOwner && !isPublished) {
    return (
      <Shell>
        <OwnerUnpublishedView
          cardCount={cards.length}
          deckCount={decks.length}
        />
      </Shell>
    );
  }

  // Owner: game published → dashboard
  if (isOwner && isPublished && game) {
    return (
      <Shell>
        <OwnerPublishedView
          game={game}
          cardCount={cards.length}
          deckCount={decks.length}
        />
      </Shell>
    );
  }

  // Player / guest / unauthenticated → redirect to Play Home
  // Handled by router; render PlayHomePage content inline here for unauthenticated
  if (isPublished) {
    return (
      <Shell>
        <PlayerHomeContent game={game} isAuthenticated={isAuthenticated} />
      </Shell>
    );
  }

  // Game not published, not owner → holding message
  return (
    <Shell>
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6"
        data-ocid="home.not_available_section"
      >
        <Eye className="w-12 h-12 text-muted-foreground mb-4 opacity-40" />
        <h1 className="text-lg font-display font-semibold text-foreground">
          Game Not Available
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-sm">
          This game is still in development. Check back when the designer
          publishes it.
        </p>
      </div>
    </Shell>
  );
}

function PlayerHomeContent({
  game,
  isAuthenticated,
}: {
  game: import("@/types").GameDefinition | null;
  isAuthenticated: boolean;
}) {
  const { login } = useAuth();
  return (
    <div
      className="p-6 max-w-2xl mx-auto space-y-6"
      data-ocid="home.player_home_section"
    >
      <div
        className="rounded-2xl border border-border p-8 text-center"
        style={{ background: "oklch(var(--card))" }}
      >
        <h1 className="text-3xl font-display font-bold text-foreground">
          {game?.name ?? "Play Now"}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          A trading card game
        </p>
        <div className="flex gap-3 justify-center mt-6 flex-wrap">
          <Link to="/play/new" data-ocid="home.play_now_button">
            <Button
              type="button"
              className="gap-2 px-6"
              style={{
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))",
              }}
            >
              <Swords className="w-4 h-4" />
              Play Now
            </Button>
          </Link>
          {!isAuthenticated && (
            <Button
              type="button"
              variant="outline"
              className="gap-2 px-6"
              onClick={() => login()}
              data-ocid="home.login_prompt_button"
            >
              Sign in to save progress
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
