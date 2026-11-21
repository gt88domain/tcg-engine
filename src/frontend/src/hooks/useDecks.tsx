import { createActor } from "@/backend";
import type {
  Card,
  CardId,
  Deck,
  DeckEntry,
  DeckId,
  DeckValidation,
  GameId,
  UserId,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ─── Card Library ─────────────────────────────────────────────────────────────

export function useCardLibrary(gameId: GameId | undefined) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Card[]>({
    queryKey: ["cards", gameId?.toString()],
    queryFn: async () => {
      if (!actor || !gameId) return [];
      return actor.listCards(gameId);
    },
    enabled: !!actor && !isFetching && !!gameId,
    staleTime: 30_000,
  });
}

// ─── Deck List ────────────────────────────────────────────────────────────────

export function useDecks(gameId: GameId | undefined, ownerId?: UserId) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Deck[]>({
    queryKey: ["decks", gameId?.toString(), ownerId?.toText()],
    queryFn: async () => {
      if (!actor || !gameId) return [];
      return actor.listDecks(ownerId ?? null, gameId);
    },
    enabled: !!actor && !isFetching && !!gameId,
    staleTime: 10_000,
  });
}

// ─── Single Deck with Resolved Cards ─────────────────────────────────────────

export function useDeck(
  deckId: DeckId | undefined,
  _cardMap: Map<CardId, Card>,
) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Deck | null>({
    queryKey: ["deck", deckId?.toString()],
    queryFn: async () => {
      if (!actor || !deckId) return null;
      return actor.getDeck(deckId);
    },
    enabled: !!actor && !isFetching && !!deckId,
    staleTime: 10_000,
    select: (deck) => deck,
  });
}

// ─── Deck Mutations ───────────────────────────────────────────────────────────

export function useCreateDeck() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gameId,
      name,
      cards,
    }: {
      gameId: GameId;
      name: string;
      cards: DeckEntry[];
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createDeck(gameId, name, cards);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["decks"] });
      toast.success("Deck created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateDeck() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      cards,
    }: {
      id: DeckId;
      name?: string;
      cards?: DeckEntry[];
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateDeck(id, name ?? null, cards ?? null);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (deck) => {
      qc.invalidateQueries({ queryKey: ["decks"] });
      qc.invalidateQueries({ queryKey: ["deck", deck.id.toString()] });
      toast.success("Deck saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteDeck() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: DeckId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteDeck(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["decks"] });
      toast.success("Deck deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSetStarterDeck() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: DeckId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.setStarterDeck(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["decks"] });
      toast.success("Starter deck updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── Validate Deck (backend) ─────────────────────────────────────────────────

export function useValidateDeck() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gameId,
      cards,
    }: {
      gameId: GameId;
      cards: DeckEntry[];
    }): Promise<DeckValidation> => {
      if (!actor) throw new Error("Not connected");
      return actor.validateDeck(gameId, cards);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["decks"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── Client-side Validation ───────────────────────────────────────────────────

const DEFAULT_MIN = 20;
const DEFAULT_MAX = 60;
const DEFAULT_MAX_COPIES = 4;

export interface DeckEntryLocal {
  cardId: CardId;
  count: number;
}

export function validateDeckLocal(
  entries: DeckEntryLocal[],
  minSize = DEFAULT_MIN,
  maxSize = DEFAULT_MAX,
  maxCopies = DEFAULT_MAX_COPIES,
): DeckValidation {
  const errors: string[] = [];
  const total = entries.reduce((s, e) => s + e.count, 0);

  if (total < minSize)
    errors.push(`Deck has ${total} cards — minimum is ${minSize}.`);
  if (total > maxSize)
    errors.push(`Deck has ${total} cards — maximum is ${maxSize}.`);

  for (const entry of entries) {
    if (entry.count > maxCopies)
      errors.push(
        `Card ${entry.cardId} exceeds the ${maxCopies}-copy limit (has ${entry.count}).`,
      );
  }

  return {
    isValid: errors.length === 0,
    errors,
    deckSize: BigInt(total),
  };
}
