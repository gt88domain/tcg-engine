import { createActor } from "@/backend";
import { GameVisibility } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGame } from "@/hooks/useGame";
import type { InviteLink } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Clock,
  Copy,
  EyeOff,
  Globe,
  Link2,
  Plus,
  Radio,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const VISIBILITY_OPTIONS: {
  value: GameVisibility;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: GameVisibility.Private,
    label: "Private",
    description: "Only you and invited collaborators can access.",
    icon: <EyeOff className="w-4 h-4" />,
  },
  {
    value: GameVisibility.InviteOnly,
    label: "Invite-Only",
    description: "Anyone with an invite link or join code can play.",
    icon: <Users className="w-4 h-4" />,
  },
  {
    value: GameVisibility.Open,
    label: "Open",
    description: "Anyone who finds the link can join and play.",
    icon: <Globe className="w-4 h-4" />,
  },
];

function CopyButton({ text, ocid }: { text: string; ocid: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      data-ocid={ocid}
      aria-label="Copy to clipboard"
      className="p-1.5 rounded-md hover:bg-muted transition-colors duration-150 text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function InviteLinkRow({ link, index }: { link: InviteLink; index: number }) {
  const joinUrl = `${window.location.origin}/join/${link.code}`;
  const isExpired =
    link.expiresAt !== undefined &&
    link.expiresAt < BigInt(Date.now() * 1_000_000);
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card"
      data-ocid={`publish.invite_link_item.${index}`}
    >
      <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <code
            className="text-sm font-mono font-semibold tracking-wider"
            style={{ color: "oklch(var(--primary))" }}
          >
            {link.code}
          </code>
          {isExpired && (
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                color: "oklch(var(--danger))",
                borderColor: "oklch(var(--danger)/0.4)",
              }}
            >
              Expired
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {joinUrl}
        </p>
        <p className="text-xs text-muted-foreground">
          Used by {link.usedBy.length} player
          {link.usedBy.length !== 1 ? "s" : ""}
          {link.expiresAt !== undefined && (
            <span className="ml-2 inline-flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              Expires{" "}
              {new Date(
                Number(link.expiresAt) / 1_000_000,
              ).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>
      <CopyButton text={joinUrl} ocid={`publish.copy_link_button.${index}`} />
    </div>
  );
}

export default function PublishSettingsPage() {
  const { game, isLoading, isPublished, isOwner, refetch } = useGame();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);
  const [selectedVisibility, setSelectedVisibility] =
    useState<GameVisibility | null>(null);

  const currentVisibility =
    selectedVisibility ?? game?.visibility ?? GameVisibility.Private;

  const {
    data: inviteLinks = [],
    isLoading: linksLoading,
    refetch: refetchLinks,
  } = useQuery({
    queryKey: ["invite-links", game?.id?.toString()],
    queryFn: async () => {
      if (!actor || !game) return [];
      return actor.listInviteLinks(game.id);
    },
    enabled: !!actor && !isFetching && !!game,
  });

  const publishMutation = useMutation({
    mutationFn: async (visibility: GameVisibility) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.publishGame(visibility);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game"] });
      toast.success("Game published!");
      refetch();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const unpublishMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.unpublishGame();
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game"] });
      toast.success("Game unpublished.");
      setConfirmUnpublish(false);
      refetch();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const createLinkMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !game) throw new Error("Not connected");
      return actor.createInviteLink(game.id);
    },
    onSuccess: () => {
      refetchLinks();
      toast.success("Invite link created!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!isOwner) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="publish.access_denied"
      >
        <p className="text-muted-foreground text-sm">
          Only the game owner can manage publish settings.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6" data-ocid="publish.page">
      {/* Publish Status */}
      <section
        className="rounded-2xl border border-border p-6"
        style={{ background: "oklch(var(--card))" }}
        aria-label="Publish status"
        data-ocid="publish.status_section"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Status
            </p>
            <Badge
              className="text-sm font-semibold px-3 py-1"
              variant="outline"
              style={{
                color: isPublished
                  ? "oklch(var(--status-published))"
                  : "oklch(var(--status-draft))",
                borderColor: isPublished
                  ? "oklch(var(--status-published)/0.4)"
                  : "oklch(var(--status-draft)/0.4)",
              }}
            >
              <Radio className="w-3.5 h-3.5 mr-1.5" />
              {isPublished ? "Published" : "Unpublished"}
            </Badge>
            {game?.publishedAt !== undefined && (
              <p className="text-xs text-muted-foreground mt-1.5">
                Published{" "}
                {new Date(
                  Number(game.publishedAt) / 1_000_000,
                ).toLocaleString()}
                {" · "}
                Version {game.version.toString()}
              </p>
            )}
          </div>

          {!isPublished ? (
            <Button
              type="button"
              onClick={() => publishMutation.mutate(currentVisibility)}
              disabled={publishMutation.isPending}
              data-ocid="publish.publish_button"
              style={{
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))",
              }}
              className="gap-2"
            >
              <Radio className="w-4 h-4" />
              {publishMutation.isPending ? "Publishing…" : "Publish Game"}
            </Button>
          ) : (
            <div className="flex flex-col items-end gap-2">
              {!confirmUnpublish ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirmUnpublish(true)}
                  data-ocid="publish.unpublish_button"
                  className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                >
                  Unpublish
                </Button>
              ) : (
                <div
                  className="flex items-center gap-2 p-3 rounded-xl border border-destructive/30 bg-destructive/5"
                  data-ocid="publish.unpublish_confirm_row"
                >
                  <AlertTriangle
                    className="w-4 h-4 shrink-0"
                    style={{ color: "oklch(var(--danger))" }}
                  />
                  <p className="text-xs text-foreground">
                    Players can no longer start new games.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => unpublishMutation.mutate()}
                    disabled={unpublishMutation.isPending}
                    data-ocid="publish.unpublish_confirm_button"
                  >
                    {unpublishMutation.isPending ? "Unpublishing…" : "Confirm"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmUnpublish(false)}
                    data-ocid="publish.unpublish_cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Visibility */}
      <section
        className="rounded-2xl border border-border p-6"
        style={{ background: "oklch(var(--card))" }}
        aria-label="Visibility settings"
        data-ocid="publish.visibility_section"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Visibility
        </p>
        <div className="space-y-2">
          {VISIBILITY_OPTIONS.map((opt) => {
            const active = currentVisibility === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setSelectedVisibility(opt.value);
                  if (isPublished) publishMutation.mutate(opt.value);
                }}
                data-ocid={`publish.visibility_option_${opt.value.toLowerCase()}`}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors duration-150 text-left"
                style={{
                  borderColor: active
                    ? "oklch(var(--primary)/0.6)"
                    : "oklch(var(--border))",
                  background: active
                    ? "oklch(var(--primary)/0.07)"
                    : "transparent",
                }}
              >
                <span
                  className="shrink-0"
                  style={{
                    color: active
                      ? "oklch(var(--primary))"
                      : "oklch(var(--muted-foreground))",
                  }}
                >
                  {opt.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {opt.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {opt.description}
                  </p>
                </div>
                {active && (
                  <ChevronRight
                    className="w-4 h-4 shrink-0"
                    style={{ color: "oklch(var(--primary))" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Invite Links */}
      <section
        className="rounded-2xl border border-border p-6"
        style={{ background: "oklch(var(--card))" }}
        aria-label="Invite links"
        data-ocid="publish.invite_links_section"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Invite Links
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => createLinkMutation.mutate()}
            disabled={createLinkMutation.isPending}
            data-ocid="publish.create_invite_link_button"
            className="gap-1.5 h-8 text-xs"
            style={{
              background: "oklch(var(--primary))",
              color: "oklch(var(--primary-foreground))",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            {createLinkMutation.isPending ? "Creating…" : "New Link"}
          </Button>
        </div>

        {linksLoading ? (
          <div className="space-y-2">
            {[1, 2].map((n) => (
              <Skeleton key={n} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : inviteLinks.length === 0 ? (
          <div
            className="text-center py-8"
            data-ocid="publish.invite_links_empty_state"
          >
            <Link2 className="w-8 h-8 mx-auto text-muted-foreground opacity-40 mb-2" />
            <p className="text-sm text-muted-foreground">
              No invite links yet.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Create one to share with players.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {inviteLinks.map((link, i) => (
              <InviteLinkRow key={link.code} link={link} index={i + 1} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
