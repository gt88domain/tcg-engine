import { createActor } from "@/backend";
import { Role } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AlertCircle, LogIn, Swords, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function JoinPage() {
  const { code } = useParams({ strict: false }) as { code: string };
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated, principal, login } = useAuth();
  const { game } = useGame();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [joiningAsGuest, setJoiningAsGuest] = useState(false);

  const {
    data: inviteLink,
    isLoading,
    error: linkError,
  } = useQuery({
    queryKey: ["invite-link", code],
    queryFn: async () => {
      if (!actor || !code) return null;
      return actor.getInviteLink(code);
    },
    enabled: !!actor && !isFetching && !!code,
    retry: false,
  });

  const joinMutation = useMutation({
    mutationFn: async ({ asGuest }: { asGuest: boolean }) => {
      if (!actor) throw new Error("Not connected");
      // biome-ignore lint/correctness/useHookAtTopLevel: actor method, not a React hook
      const useResult = await actor.useInviteLink(code);
      if (useResult.__kind__ === "err") throw new Error(useResult.err);
      if (principal && game) {
        const name = asGuest ? null : username.trim() || null;
        await actor.registerPlayer(principal, game.id, Role.Player, name);
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player"] });
      toast.success("Welcome! You've joined the game.");
      navigate({ to: "/play" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const isExpired =
    inviteLink?.expiresAt !== undefined &&
    inviteLink.expiresAt < BigInt(Date.now() * 1_000_000);

  const linkInvalid = !isLoading && (!inviteLink || isExpired);

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full mx-auto px-6 space-y-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>
    );
  }

  if (linkInvalid || linkError) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] px-6"
        data-ocid="join.error_state"
      >
        <AlertCircle
          className="w-12 h-12 mb-4"
          style={{ color: "oklch(var(--danger))" }}
        />
        <h1 className="text-lg font-display font-semibold text-foreground">
          Invalid or Expired Link
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-sm">
          This invite link is no longer valid. Ask the game owner for a new one.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="max-w-md w-full mx-auto space-y-5" data-ocid="join.page">
        <div
          className="rounded-2xl border border-border p-8 text-center"
          style={{ background: "oklch(var(--card))" }}
          data-ocid="join.game_card"
        >
          <Swords
            className="w-10 h-10 mx-auto mb-4"
            style={{ color: "oklch(var(--primary))" }}
            aria-hidden
          />
          <h1 className="text-2xl font-display font-bold text-foreground">
            {game?.name ?? "Join Game"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            You've been invited to play
          </p>
          <div
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "oklch(var(--primary)/0.1)" }}
          >
            <span
              className="text-xs font-mono font-semibold"
              style={{ color: "oklch(var(--primary))" }}
            >
              Code: {code}
            </span>
          </div>
        </div>

        {isAuthenticated ? (
          <div
            className="rounded-xl border border-border p-6 space-y-4"
            style={{ background: "oklch(var(--card))" }}
            data-ocid="join.auth_join_form"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "oklch(var(--primary)/0.12)" }}
              >
                <User
                  className="w-4 h-4"
                  style={{ color: "oklch(var(--primary))" }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold">Joining as</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {principal?.toText().slice(0, 12)}…
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="join-username" className="text-xs font-medium">
                Display name{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="join-username"
                type="text"
                placeholder="Enter a display name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-ocid="join.username_input"
                maxLength={32}
              />
            </div>

            <Button
              type="button"
              className="w-full gap-2"
              onClick={() => joinMutation.mutate({ asGuest: false })}
              disabled={joinMutation.isPending}
              data-ocid="join.join_button"
              style={{
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))",
              }}
            >
              {joinMutation.isPending ? "Joining…" : "Join Game"}
            </Button>
          </div>
        ) : (
          <div
            className="rounded-xl border border-border p-6 space-y-4"
            style={{ background: "oklch(var(--card))" }}
            data-ocid="join.unauthenticated_form"
          >
            <p className="text-sm text-muted-foreground text-center">
              Sign in to save your progress and track your record.
            </p>
            <Button
              type="button"
              className="w-full gap-2"
              onClick={() => login()}
              data-ocid="join.login_button"
              style={{
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))",
              }}
            >
              <LogIn className="w-4 h-4" />
              Sign in with Internet Identity
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                setJoiningAsGuest(true);
                login();
              }}
              data-ocid="join.guest_button"
            >
              Continue as Guest
            </Button>
            {joiningAsGuest && (
              <p className="text-xs text-muted-foreground text-center">
                Guest sessions are not tracked across visits.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
