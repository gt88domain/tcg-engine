import { createActor } from "@/backend";
import type { Ability, Card, CardId, GameId } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCardLibrary(gameId: GameId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Card[]>({
    queryKey: ["cards", gameId?.toString()],
    queryFn: async () => {
      if (!actor || gameId === undefined) return [];
      return actor.listCards(gameId);
    },
    enabled: !!actor && !isFetching && gameId !== undefined,
  });
}

export function useCard(cardId: CardId | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Card | null>({
    queryKey: ["card", cardId?.toString()],
    queryFn: async () => {
      if (!actor || cardId === undefined) return null;
      return actor.getCard(cardId);
    },
    enabled: !!actor && !isFetching && cardId !== undefined,
  });
}

export type CreateCardReq = {
  cardType: string;
  cost: bigint;
  name: string;
  tags: string[];
  flavourText?: string;
  rulesText?: string;
  defense?: bigint;
  artUrl?: string;
  abilities: Ability[];
  attack?: bigint;
};

export type UpdateCardReq = {
  id: CardId;
  cardType?: string;
  cost?: bigint;
  name?: string;
  tags?: string[];
  flavourText?: string | null;
  rulesText?: string | null;
  defense?: bigint | null;
  artUrl?: string | null;
  abilities?: Ability[];
  attack?: bigint | null;
};

export function useCreateCard() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateCardReq) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.createCard(req);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useUpdateCard() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...req }: UpdateCardReq) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.updateCard(id, req);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (card) => {
      qc.invalidateQueries({ queryKey: ["cards"] });
      qc.invalidateQueries({ queryKey: ["card", card.id.toString()] });
    },
  });
}

export function useDeleteCard() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: CardId) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.deleteCard(id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}
