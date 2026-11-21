import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlayerRole } from "@/hooks/useAuth";
import { useGame, useUpdateGame } from "@/hooks/useGame";
import { Lock, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { game, isLoading, isOwner } = useGame();
  const { isLoading: roleLoading } = usePlayerRole();
  const updateGame = useUpdateGame();

  const [name, setName] = useState(game?.name ?? "");
  const [description, setDescription] = useState("");
  const [handSize, setHandSize] = useState<number>(7);
  const [resourceCap, setResourceCap] = useState<number>(10);

  const isMutating = updateGame.isPending;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!isOwner) return;
    try {
      await updateGame.mutateAsync({
        gameName: name || undefined,
      });
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  }

  if (isLoading || roleLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="settings.access_denied"
      >
        <div className="text-center space-y-2">
          <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Only the game owner can change settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6" data-ocid="settings.page">
      <h1 className="text-xl font-display font-bold">Game Settings</h1>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Game Identity */}
        <div
          className="rounded-xl border border-border p-5 space-y-4"
          style={{ background: "oklch(var(--card))" }}
          data-ocid="settings.identity_section"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Identity
          </p>
          <div className="space-y-2">
            <Label htmlFor="game-name" className="text-sm">
              Game Name
            </Label>
            <Input
              id="game-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Trading Card Game"
              className="bg-background"
              data-ocid="settings.name_input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="game-desc" className="text-sm">
              Description
            </Label>
            <Input
              id="game-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of your game"
              className="bg-background"
              data-ocid="settings.description_input"
            />
          </div>
        </div>

        {/* Rules */}
        <div
          className="rounded-xl border border-border p-5 space-y-4"
          style={{ background: "oklch(var(--card))" }}
          data-ocid="settings.rules_section"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Rules
          </p>
          <div className="space-y-2">
            <Label htmlFor="hand-size" className="text-sm">
              Hand Size Limit
            </Label>
            <Input
              id="hand-size"
              type="number"
              min={1}
              max={20}
              value={handSize}
              onChange={(e) => setHandSize(Number(e.target.value))}
              className="bg-background w-32"
              data-ocid="settings.hand_size_input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resource-cap" className="text-sm">
              Resource Cap
            </Label>
            <Input
              id="resource-cap"
              type="number"
              min={1}
              max={99}
              value={resourceCap}
              onChange={(e) => setResourceCap(Number(e.target.value))}
              className="bg-background w-32"
              data-ocid="settings.resource_cap_input"
            />
          </div>
        </div>

        {/* Template (read-only) */}
        <div
          className="rounded-xl border border-border p-5 space-y-2"
          style={{ background: "oklch(var(--card))" }}
          data-ocid="settings.template_section"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Template
          </p>
          <p className="text-sm text-foreground">Resource + Combat</p>
          <p className="text-xs text-muted-foreground">
            The game template cannot be changed after creation.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isMutating}
          className="gap-2"
          data-ocid="settings.save_button"
          style={{
            background: "oklch(var(--primary))",
            color: "oklch(var(--primary-foreground))",
          }}
        >
          <Save className="w-4 h-4" />
          {isMutating ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
