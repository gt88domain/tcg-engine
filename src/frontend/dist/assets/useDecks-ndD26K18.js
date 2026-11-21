import { b as useActor, c as useQuery, a0 as useQueryClient, a1 as useMutation, a4 as ue, e as createActor } from "./index-Ch41Ib91.js";
function useCardLibrary(gameId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["cards", gameId == null ? void 0 : gameId.toString()],
    queryFn: async () => {
      if (!actor || !gameId) return [];
      return actor.listCards(gameId);
    },
    enabled: !!actor && !isFetching && !!gameId,
    staleTime: 3e4
  });
}
function useDecks(gameId, ownerId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["decks", gameId == null ? void 0 : gameId.toString(), ownerId == null ? void 0 : ownerId.toText()],
    queryFn: async () => {
      if (!actor || !gameId) return [];
      return actor.listDecks(ownerId ?? null, gameId);
    },
    enabled: !!actor && !isFetching && !!gameId,
    staleTime: 1e4
  });
}
function useCreateDeck() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      gameId,
      name,
      cards
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createDeck(gameId, name, cards);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["decks"] });
      ue.success("Deck created");
    },
    onError: (err) => ue.error(err.message)
  });
}
function useUpdateDeck() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      cards
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateDeck(id, name ?? null, cards ?? null);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (deck) => {
      qc.invalidateQueries({ queryKey: ["decks"] });
      qc.invalidateQueries({ queryKey: ["deck", deck.id.toString()] });
      ue.success("Deck saved");
    },
    onError: (err) => ue.error(err.message)
  });
}
function useDeleteDeck() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteDeck(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["decks"] });
      ue.success("Deck deleted");
    },
    onError: (err) => ue.error(err.message)
  });
}
function useSetStarterDeck() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.setStarterDeck(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["decks"] });
      ue.success("Starter deck updated");
    },
    onError: (err) => ue.error(err.message)
  });
}
const DEFAULT_MIN = 20;
const DEFAULT_MAX = 60;
const DEFAULT_MAX_COPIES = 4;
function validateDeckLocal(entries, minSize = DEFAULT_MIN, maxSize = DEFAULT_MAX, maxCopies = DEFAULT_MAX_COPIES) {
  const errors = [];
  const total = entries.reduce((s, e) => s + e.count, 0);
  if (total < minSize)
    errors.push(`Deck has ${total} cards — minimum is ${minSize}.`);
  if (total > maxSize)
    errors.push(`Deck has ${total} cards — maximum is ${maxSize}.`);
  for (const entry of entries) {
    if (entry.count > maxCopies)
      errors.push(
        `Card ${entry.cardId} exceeds the ${maxCopies}-copy limit (has ${entry.count}).`
      );
  }
  return {
    isValid: errors.length === 0,
    errors,
    deckSize: BigInt(total)
  };
}
export {
  useCreateDeck as a,
  useUpdateDeck as b,
  useDeleteDeck as c,
  useSetStarterDeck as d,
  useDecks as e,
  useCardLibrary as u,
  validateDeckLocal as v
};
