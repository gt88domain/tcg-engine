import { b as useActor, c as useQuery, a0 as useQueryClient, a1 as useMutation, e as createActor } from "./index-Ch41Ib91.js";
function useCardLibrary(gameId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["cards", gameId == null ? void 0 : gameId.toString()],
    queryFn: async () => {
      if (!actor || gameId === void 0) return [];
      return actor.listCards(gameId);
    },
    enabled: !!actor && !isFetching && gameId !== void 0
  });
}
function useCreateCard() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.createCard(req);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
    }
  });
}
function useUpdateCard() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...req }) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.updateCard(id, req);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (card) => {
      qc.invalidateQueries({ queryKey: ["cards"] });
      qc.invalidateQueries({ queryKey: ["card", card.id.toString()] });
    }
  });
}
function useDeleteCard() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await actor.deleteCard(id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cards"] });
    }
  });
}
export {
  useUpdateCard as a,
  useDeleteCard as b,
  useCardLibrary as c,
  useCreateCard as u
};
