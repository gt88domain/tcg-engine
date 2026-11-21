import { createActor } from "@/backend";
import { GamePhase as GamePhaseEnum } from "@/backend.d";
import { useAuth } from "@/hooks/useAuth";
import type {
  AbilityEffect,
  GamePhase,
  GameSession,
  GameSessionId,
  PlayerGameState,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGameSession(sessionId: bigint) {
  const { actor, isFetching } = useActor(createActor);
  const { principal } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = ["gameSession", sessionId.toString()];

  const {
    data: session,
    error,
    isLoading,
  } = useQuery<GameSession | null>({
    queryKey,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getGameSession(sessionId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000,
    staleTime: 0,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const myPrincipalText = principal?.toText();

  const myState: PlayerGameState | null =
    session?.state.playerStates.find(
      (ps) => ps.playerId.toText() === myPrincipalText,
    ) ?? null;

  const opponentState: PlayerGameState | null =
    session?.state.playerStates.find(
      (ps) => ps.playerId.toText() !== myPrincipalText,
    ) ?? null;

  const isMyTurn =
    !!session &&
    !!myPrincipalText &&
    session.state.activePlayerId.toText() === myPrincipalText;

  const currentPhase: GamePhase = session?.state.phase ?? GamePhaseEnum.Start;

  const drawCardMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.drawCard(sessionId);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate(),
  });

  const playCardMutation = useMutation({
    mutationFn: async ({
      cardId,
      card,
    }: { cardId: bigint; card: import("@/types").Card }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.playCard(sessionId, cardId, card);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate(),
  });

  const declareAttackersMutation = useMutation({
    mutationFn: async (attackerIndices: bigint[]) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.declareAttackers(sessionId, attackerIndices);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate(),
  });

  const assignBlockersMutation = useMutation({
    mutationFn: async (blockingInstanceIds: bigint[]) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.assignBlockers(sessionId, blockingInstanceIds);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate(),
  });

  const takeMulliganMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.takeMulligan(sessionId);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate(),
  });

  const discardCardMutation = useMutation({
    mutationFn: async (handIndex: bigint) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.discardCard(sessionId, handIndex);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate(),
  });

  const useAbilityMutation = useMutation({
    mutationFn: async ({
      sourceInstanceId,
      abilityId,
      targetInstanceId,
      effects,
    }: {
      sourceInstanceId: bigint;
      abilityId: bigint;
      targetInstanceId: bigint | null;
      effects: AbilityEffect[];
    }) => {
      if (!actor) throw new Error("No actor");
      // biome-ignore lint/correctness/useHookAtTopLevel: actor method not a React hook
      const res = await actor.useAbility(
        sessionId,
        sourceInstanceId,
        abilityId,
        targetInstanceId,
        effects,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate(),
  });

  const endPhaseMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.endPhase(sessionId);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate(),
  });

  const concedeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.concedeGame(sessionId);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate(),
  });

  return {
    session,
    myState,
    opponentState,
    isMyTurn,
    currentPhase,
    isLoading,
    error,
    actions: {
      drawCard: drawCardMutation,
      playCard: playCardMutation,
      declareAttackers: declareAttackersMutation,
      assignBlockers: assignBlockersMutation,
      takeMulligan: takeMulliganMutation,
      discardCard: discardCardMutation,
      useAbility: useAbilityMutation,
      endPhase: endPhaseMutation,
      concede: concedeMutation,
    },
  };
}
