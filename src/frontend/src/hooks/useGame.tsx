import { createActor } from "@/backend";
import type {
  CardTypeDefinition,
  GameDefinition,
  GameVersionSnapshot,
  GameVisibility,
  KeywordDefinition,
  ResourceSystem,
  TurnPhase,
  WinCondition,
} from "@/backend";
import { usePlayerRole } from "@/hooks/useAuth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGameDefinition() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GameDefinition | null>({
    queryKey: ["game"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getGame();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

/** Legacy alias used by existing consumers */
export function useGame() {
  const result = useGameDefinition();
  const game = result.data ?? null;
  const { isOwner } = usePlayerRole();

  return {
    game,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch,
    isPublished: !!game?.publishedAt,
    gameName: game?.gameName ?? game?.name ?? "My TCG",
    isOwner,
  };
}

export type UpdateGameReq = {
  resourceSystem?: ResourceSystem;
  gameName?: string;
  gameDescription?: string;
  themeColor?: string;
  cardTypeDefinitions?: CardTypeDefinition[];
  winConditions?: WinCondition[];
  turnPhases?: TurnPhase[];
  keywords?: KeywordDefinition[];
  wizardStep?: bigint;
  gameIcon?: string;
};

export function useCreateGame() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, theme }: { name: string; theme: string }) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.createGame(name, theme);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["game"] }),
  });
}

export function useUpdateGame() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: UpdateGameReq) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.updateGame(updates);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["game"] }),
  });
}

export function useSaveGameVersion() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (description: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.saveGameVersion(description);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["game-version-history"] }),
  });
}

export function useGameVersionHistory() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GameVersionSnapshot[]>({
    queryKey: ["game-version-history"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGameVersionHistory();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function usePublishGame() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (visibility: GameVisibility) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.publishGame(visibility);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["game"] }),
  });
}

export function useUnpublishGame() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.unpublishGame();
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["game"] }),
  });
}
