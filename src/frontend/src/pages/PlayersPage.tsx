import { createActor } from "@/backend";
import { Role } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGame } from "@/hooks/useGame";
import type { PlayerAccount } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, ChevronDown, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: Role.Player, label: "Player" },
  { value: Role.CoDesigner, label: "Co-Designer" },
  { value: Role.Playtester, label: "Playtester" },
  { value: Role.Spectator, label: "Spectator" },
];

function roleColor(role: Role): string {
  switch (role) {
    case Role.Owner:
      return "oklch(var(--primary))";
    case Role.CoDesigner:
      return "oklch(var(--status-playtesting))";
    case Role.Playtester:
      return "oklch(var(--info))";
    case Role.Player:
      return "oklch(var(--status-published))";
    default:
      return "oklch(var(--muted-foreground))";
  }
}

function RoleSelect({
  player,
  onChange,
  isPending,
}: {
  player: PlayerAccount;
  onChange: (role: Role) => void;
  isPending: boolean;
}) {
  if (player.role === Role.Owner) {
    return (
      <Badge
        variant="outline"
        className="text-xs"
        style={{
          color: roleColor(Role.Owner),
          borderColor: "oklch(var(--primary)/0.4)",
        }}
      >
        Owner
      </Badge>
    );
  }

  return (
    <div className="relative">
      <select
        value={player.role}
        onChange={(e) => onChange(e.target.value as Role)}
        disabled={isPending}
        data-ocid={`players.role_select.${player.principal.toText().slice(0, 8)}`}
        className="appearance-none text-xs font-medium pr-6 pl-2 py-1 rounded-md border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        style={{ color: roleColor(player.role) }}
        aria-label="Change player role"
      >
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-foreground">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
        style={{ color: roleColor(player.role) }}
      />
    </div>
  );
}

function PlayerRow({
  player,
  index,
  onRoleChange,
  pendingPrincipal,
}: {
  player: PlayerAccount;
  index: number;
  onRoleChange: (principal: string, role: Role) => void;
  pendingPrincipal: string | null;
}) {
  const record = player.record;
  const joinDate = new Date(
    Number(player.joinedAt) / 1_000_000,
  ).toLocaleDateString();
  const isPending = pendingPrincipal === player.principal.toText();

  return (
    <div
      className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-border bg-card"
      data-ocid={`players.player_item.${index}`}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{
          background: "oklch(var(--primary)/0.12)",
          color: "oklch(var(--primary))",
        }}
      >
        {(player.username ?? player.principal.toText())[0].toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate">
            {player.username ?? (
              <span className="font-mono text-xs text-muted-foreground">
                {player.principal.toText().slice(0, 12)}…
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-muted-foreground">
            Joined {joinDate}
          </span>
          {Number(record.gamesPlayed) > 0 && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {record.wins.toString()}W / {record.losses.toString()}L
            </span>
          )}
        </div>
      </div>

      <RoleSelect
        player={player}
        onChange={(role) => onRoleChange(player.principal.toText(), role)}
        isPending={isPending}
      />
    </div>
  );
}

export default function PlayersPage() {
  const { game, isOwner, isLoading: gameLoading } = useGame();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [pendingPrincipal, setPendingPrincipal] = useState<string | null>(null);

  const { data: players = [], isLoading: playersLoading } = useQuery({
    queryKey: ["players", game?.id?.toString()],
    queryFn: async () => {
      if (!actor || !game) return [];
      return actor.listPlayers(game.id);
    },
    enabled: !!actor && !isFetching && !!game,
  });

  const roleChangeMutation = useMutation({
    mutationFn: async ({
      principalText,
      role,
    }: { principalText: string; role: Role }) => {
      if (!actor) throw new Error("Not connected");
      const player = players.find(
        (p) => p.principal.toText() === principalText,
      );
      if (!player) throw new Error("Player not found");
      const result = await actor.updatePlayerRole(player.principal, role);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onMutate: ({ principalText }) => setPendingPrincipal(principalText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Role updated.");
    },
    onError: (e: Error) => toast.error(e.message),
    onSettled: () => setPendingPrincipal(null),
  });

  if (!isOwner && !gameLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="players.access_denied"
      >
        <p className="text-sm text-muted-foreground">
          Only the game owner can view player management.
        </p>
      </div>
    );
  }

  const isLoading = gameLoading || playersLoading;

  const playerCount = players.filter((p) => p.role === Role.Player).length;
  const totalGames = players.reduce(
    (s, p) => s + Number(p.record.gamesPlayed),
    0,
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6" data-ocid="players.page">
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Players",
            value: players.length,
            icon: <Users className="w-4 h-4" />,
          },
          {
            label: "Active Players",
            value: playerCount,
            icon: <UserCheck className="w-4 h-4" />,
          },
          {
            label: "Games Played",
            value: totalGames,
            icon: <Activity className="w-4 h-4" />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border p-4 text-center"
            style={{ background: "oklch(var(--card))" }}
          >
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
              {stat.icon}
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-8 mx-auto" />
            ) : (
              <p
                className="text-xl font-display font-bold tabular-nums"
                style={{ color: "oklch(var(--primary))" }}
              >
                {stat.value}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <section data-ocid="players.list_section">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Players
        </p>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : players.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl border border-border"
            style={{ background: "oklch(var(--card))" }}
            data-ocid="players.empty_state"
          >
            <Users className="w-10 h-10 text-muted-foreground opacity-30 mb-3" />
            <p className="text-sm font-medium text-foreground">
              No players yet
            </p>
            <p className="text-xs text-muted-foreground mt-1 text-center max-w-xs">
              Invite players to your game using the Publish &amp; Visibility
              settings.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {players.map((player, i) => (
              <PlayerRow
                key={player.principal.toText()}
                player={player}
                index={i + 1}
                onRoleChange={(principalText, role) =>
                  roleChangeMutation.mutate({ principalText, role })
                }
                pendingPrincipal={pendingPrincipal}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
