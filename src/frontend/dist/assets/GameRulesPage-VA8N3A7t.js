import { u as useGame, h as useUpdateGame, r as reactExports, G as GamePhase, j as jsxRuntimeExports, d as Skeleton, i as useCreateGame } from "./index-Ch41Ib91.js";
import { B as Badge } from "./badge-UtblI1Uf.js";
import { B as Button } from "./button-BHF8-SKr.js";
import { I as Input } from "./input-CV14CozU.js";
import "./index-CyXusObr.js";
const ALL_PHASES = [
  GamePhase.Start,
  GamePhase.Draw,
  GamePhase.Main,
  GamePhase.Combat,
  GamePhase.End
];
const PHASE_LABELS = {
  [GamePhase.Start]: "Start",
  [GamePhase.Draw]: "Draw",
  [GamePhase.Main]: "Main",
  [GamePhase.Combat]: "Combat",
  [GamePhase.End]: "End"
};
const PHASE_DESCRIPTIONS = {
  [GamePhase.Start]: "Untap and refresh",
  [GamePhase.Draw]: "Draw a card",
  [GamePhase.Main]: "Play cards and use abilities",
  [GamePhase.Combat]: "Attack with your creatures",
  [GamePhase.End]: "Discard to hand size"
};
function AccordionSection({
  title,
  open,
  onToggle,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border rounded-xl overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "w-full flex items-center justify-between px-5 py-3.5 bg-card hover:bg-muted/30 transition-colors duration-150 text-left",
        onClick: onToggle,
        "aria-expanded": open,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-display font-semibold text-foreground", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-muted-foreground transition-transform duration-150 ${open ? "rotate-180" : "rotate-0"}`,
              children: "▾"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-t border-border bg-background", children }) })
      }
    )
  ] });
}
function FirstRunWizard({ onCreated }) {
  const createGame = useCreateGame();
  const [name, setName] = reactExports.useState("");
  const [theme, setTheme] = reactExports.useState("fantasy");
  const [error, setError] = reactExports.useState(null);
  async function handleCreate() {
    if (!name.trim()) {
      setError("Please enter a game name.");
      return;
    }
    setError(null);
    try {
      await createGame.mutateAsync({ name: name.trim(), theme });
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create game.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center min-h-[60vh] gap-8",
      "data-ocid": "game-rules.wizard.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-foreground", children: "Start by naming your game" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-md", children: "Give your game a name and choose how resources work — every card and deck rule builds from here." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm space-y-4 bg-card border border-border rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                htmlFor: "game-name",
                children: "Game Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "game-name",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "e.g. Realms of Etherion",
                className: "mt-1",
                "data-ocid": "game-rules.wizard.name.input",
                onKeyDown: (e) => {
                  if (e.key === "Enter") handleCreate();
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                htmlFor: "game-theme",
                children: "Theme / Setting"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "game-theme",
                value: theme,
                onChange: (e) => setTheme(e.target.value),
                placeholder: "e.g. fantasy, sci-fi, steampunk",
                className: "mt-1",
                "data-ocid": "game-rules.wizard.theme.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-lg px-4 py-3 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "⚔️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-display font-semibold text-foreground", children: "Resource + Combat" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Collect resources, play creatures and spells, defeat your opponent." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: "ml-auto shrink-0 text-[10px]",
                style: {
                  background: "oklch(var(--primary)/0.15)",
                  color: "oklch(var(--primary))",
                  border: "1px solid oklch(var(--primary)/0.3)"
                },
                children: "Selected"
              }
            )
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "game-rules.wizard.error_state",
              children: error
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              className: "w-full",
              onClick: handleCreate,
              disabled: createGame.isPending || !name.trim(),
              "data-ocid": "game-rules.wizard.create.submit_button",
              children: createGame.isPending ? "Creating…" : "Create Your Game"
            }
          )
        ] })
      ]
    }
  );
}
function GameRulesPage() {
  var _a, _b;
  const { game, isLoading } = useGame();
  const updateGame = useUpdateGame();
  const [refreshKey, setRefreshKey] = reactExports.useState(0);
  const [openSections, setOpenSections] = reactExports.useState({
    identity: true,
    resources: true,
    cardTypes: true,
    winCondition: true,
    turnStructure: true,
    formatRules: true
  });
  const [gameName, setGameName] = reactExports.useState((game == null ? void 0 : game.name) ?? "");
  const [gameDesc, setGameDesc] = reactExports.useState("");
  const [resources, setResources] = reactExports.useState(
    (game == null ? void 0 : game.resourceSystem) ?? {
      resourceName: "Mana",
      resourcesPerTurn: 1n,
      startingLife: 20n,
      maxHandSize: 7n,
      deckSizeMin: 20n,
      deckSizeMax: 60n,
      copiesPerCardLimit: 3n
    }
  );
  const [cardTypes, setCardTypes] = reactExports.useState((game == null ? void 0 : game.cardTypes) ?? []);
  const [winCondition, setWinCondition] = reactExports.useState(
    ((_a = game == null ? void 0 : game.winConditions) == null ? void 0 : _a[0]) ?? { __kind__: "LifeToZero", LifeToZero: null }
  );
  const [phases, setPhases] = reactExports.useState(ALL_PHASES);
  const [formatRules, setFormatRules] = reactExports.useState({
    minDeckSize: 40,
    maxDeckSize: 60,
    maxCopies: 4,
    startingHandSize: 7
  });
  const [saving, setSaving] = reactExports.useState(false);
  const [saved, setSaved] = reactExports.useState(false);
  if (game && gameName === "" && refreshKey === 0) {
    setGameName(game.gameName ?? game.name);
    setResources(game.resourceSystem);
    setCardTypes(game.cardTypes);
    setWinCondition(
      ((_b = game.winConditions) == null ? void 0 : _b[0]) ?? { __kind__: "LifeToZero", LifeToZero: null }
    );
    setRefreshKey(1);
  }
  const isHealthBased = winCondition.__kind__ === "LifeToZero";
  const isScoreBased = winCondition.__kind__ === "Custom";
  function toggleSection(key) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }
  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateGame.mutateAsync({
        gameName,
        resourceSystem: resources,
        winConditions: [winCondition]
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", "data-ocid": "game-rules.loading_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" })
    ] });
  }
  if (!game) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FirstRunWizard, { onCreated: () => setRefreshKey((k) => k + 1) });
  }
  const isPublished = !!game.publishedAt;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "game-rules.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-6 py-3 border-b border-border bg-card/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: "text-[10px] px-2 py-0.5 h-5 font-mono",
            style: {
              background: isPublished ? "oklch(var(--status-published)/0.15)" : "oklch(var(--status-draft)/0.15)",
              color: isPublished ? "oklch(var(--status-published))" : "oklch(var(--status-draft))",
              border: `1px solid ${isPublished ? "oklch(var(--status-published)/0.3)" : "oklch(var(--status-draft)/0.3)"}`
            },
            children: isPublished ? "Published" : "Draft"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            className: "text-[10px] px-2 py-0.5 h-5 font-mono",
            variant: "secondary",
            children: [
              "v",
              Number(game.version)
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono ml-auto", children: [
        "Last updated",
        " ",
        new Date(Number(game.updatedAt / 1000000n)).toLocaleDateString()
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccordionSection,
        {
          title: "Game Identity",
          open: openSections.identity,
          onToggle: () => toggleSection("identity"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                  htmlFor: "rule-name",
                  children: "Game Name"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "rule-name",
                  value: gameName,
                  onChange: (e) => setGameName(e.target.value),
                  className: "mt-1",
                  "data-ocid": "game-rules.identity.name.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                  htmlFor: "rule-desc",
                  children: "Description"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  id: "rule-desc",
                  value: gameDesc,
                  onChange: (e) => setGameDesc(e.target.value),
                  rows: 3,
                  placeholder: "Briefly describe your game…",
                  className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring",
                  "data-ocid": "game-rules.identity.description.textarea"
                }
              )
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccordionSection,
        {
          title: "Resource System",
          open: openSections.resources,
          onToggle: () => toggleSection("resources"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Define the core resource for your game. Players generate this resource each turn to pay for cards." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 max-w-md", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                    htmlFor: "res-name",
                    children: "Resource Name"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "res-name",
                    value: resources.resourceName,
                    onChange: (e) => setResources((prev) => ({
                      ...prev,
                      resourceName: e.target.value
                    })),
                    className: "mt-1 h-8 text-sm",
                    "data-ocid": "game-rules.resources.name.input.1"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                    htmlFor: "res-per-turn",
                    children: "Resources / Turn"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "res-per-turn",
                    type: "number",
                    min: "1",
                    value: String(Number(resources.resourcesPerTurn)),
                    onChange: (e) => setResources((prev) => ({
                      ...prev,
                      resourcesPerTurn: BigInt(e.target.value || "1")
                    })),
                    className: "mt-1 h-8 text-sm",
                    "data-ocid": "game-rules.resources.per-turn.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                    htmlFor: "res-life",
                    children: "Starting Life"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "res-life",
                    type: "number",
                    min: "1",
                    value: String(Number(resources.startingLife)),
                    onChange: (e) => setResources((prev) => ({
                      ...prev,
                      startingLife: BigInt(e.target.value || "20")
                    })),
                    className: "mt-1 h-8 text-sm",
                    "data-ocid": "game-rules.resources.starting-life.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                    htmlFor: "res-hand",
                    children: "Max Hand Size"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "res-hand",
                    type: "number",
                    min: "1",
                    value: String(Number(resources.maxHandSize)),
                    onChange: (e) => setResources((prev) => ({
                      ...prev,
                      maxHandSize: BigInt(e.target.value || "7")
                    })),
                    className: "mt-1 h-8 text-sm",
                    "data-ocid": "game-rules.resources.hand-size.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                    htmlFor: "res-deck-min",
                    children: "Deck Size Min"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "res-deck-min",
                    type: "number",
                    min: "1",
                    value: String(Number(resources.deckSizeMin)),
                    onChange: (e) => setResources((prev) => ({
                      ...prev,
                      deckSizeMin: BigInt(e.target.value || "20")
                    })),
                    className: "mt-1 h-8 text-sm",
                    "data-ocid": "game-rules.resources.deck-min.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                    htmlFor: "res-deck-max",
                    children: "Deck Size Max"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "res-deck-max",
                    type: "number",
                    min: "1",
                    value: String(Number(resources.deckSizeMax)),
                    onChange: (e) => setResources((prev) => ({
                      ...prev,
                      deckSizeMax: BigInt(e.target.value || "60")
                    })),
                    className: "mt-1 h-8 text-sm",
                    "data-ocid": "game-rules.resources.deck-max.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                    htmlFor: "res-copies",
                    children: "Copies per Card"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "res-copies",
                    type: "number",
                    min: "1",
                    value: String(Number(resources.copiesPerCardLimit)),
                    onChange: (e) => setResources((prev) => ({
                      ...prev,
                      copiesPerCardLimit: BigInt(e.target.value || "3")
                    })),
                    className: "mt-1 h-8 text-sm",
                    "data-ocid": "game-rules.resources.copies.input"
                  }
                )
              ] })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccordionSection,
        {
          title: "Card Types",
          open: openSections.cardTypes,
          onToggle: () => toggleSection("cardTypes"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: cardTypes.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1 px-2 py-1 bg-muted/50 border border-border rounded-lg text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-mono text-xs", children: t }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "text-muted-foreground hover:text-destructive text-xs leading-none",
                      onClick: () => setCardTypes(cardTypes.filter((_, j) => j !== i)),
                      "aria-label": `Remove ${t}`,
                      "data-ocid": `game-rules.card-types.delete_button.${i + 1}`,
                      children: "×"
                    }
                  )
                ]
              },
              i
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. Creature, Spell, Artifact",
                  className: "h-8 text-sm max-w-xs",
                  "data-ocid": "game-rules.card-types.new.input",
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      const val = e.currentTarget.value.trim();
                      if (val && !cardTypes.includes(val)) {
                        setCardTypes([...cardTypes, val]);
                        e.currentTarget.value = "";
                      }
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "h-8 text-xs shrink-0",
                  "data-ocid": "game-rules.card-types.add.button",
                  onClick: (e) => {
                    const input = e.currentTarget.previousSibling;
                    const val = input.value.trim();
                    if (val && !cardTypes.includes(val)) {
                      setCardTypes([...cardTypes, val]);
                      input.value = "";
                    }
                  },
                  children: "Add"
                }
              )
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccordionSection,
        {
          title: "Win Condition",
          open: openSections.winCondition,
          onToggle: () => toggleSection("winCondition"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "radio",
                    name: "win-condition",
                    checked: isHealthBased,
                    onChange: () => setWinCondition({
                      __kind__: "LifeToZero",
                      LifeToZero: null
                    }),
                    className: "accent-primary",
                    "data-ocid": "game-rules.win-condition.health-based.radio"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: "Reduce opponent life to 0" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "radio",
                    name: "win-condition",
                    checked: winCondition.__kind__ === "DeckOut",
                    onChange: () => setWinCondition({ __kind__: "DeckOut", DeckOut: null }),
                    className: "accent-primary",
                    "data-ocid": "game-rules.win-condition.deck-out.radio"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: "Opponent decks out" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "radio",
                    name: "win-condition",
                    checked: isScoreBased,
                    onChange: () => setWinCondition({
                      __kind__: "Custom",
                      Custom: "Reach 10 points"
                    }),
                    className: "accent-primary",
                    "data-ocid": "game-rules.win-condition.score-based.radio"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: "Custom condition" })
              ] })
            ] }),
            isScoreBased && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                  htmlFor: "custom-condition",
                  children: "Condition description"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "custom-condition",
                  value: winCondition.__kind__ === "Custom" ? winCondition.Custom : "",
                  onChange: (e) => setWinCondition({
                    __kind__: "Custom",
                    Custom: e.target.value
                  }),
                  placeholder: "e.g. Reach 10 points",
                  className: "mt-1 w-full max-w-xs",
                  "data-ocid": "game-rules.win-condition.custom.input"
                }
              )
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccordionSection,
        {
          title: "Turn Structure",
          open: openSections.turnStructure,
          onToggle: () => toggleSection("turnStructure"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono mb-2", children: "Reorder phases with the arrows. Add or remove phases inline." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: phases.map((phase, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 px-3 py-2 bg-muted/30 rounded-lg border border-border/60",
                "data-ocid": `game-rules.phases.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 font-mono text-xs w-4 text-right shrink-0", children: i + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-foreground", children: PHASE_LABELS[phase] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground truncate", children: PHASE_DESCRIPTIONS[phase] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        disabled: i === 0,
                        className: "text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs px-1",
                        onClick: () => {
                          const next = [...phases];
                          [next[i - 1], next[i]] = [next[i], next[i - 1]];
                          setPhases(next);
                        },
                        "aria-label": "Move up",
                        "data-ocid": `game-rules.phases.move-up.button.${i + 1}`,
                        children: "▲"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        disabled: i === phases.length - 1,
                        className: "text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs px-1",
                        onClick: () => {
                          const next = [...phases];
                          [next[i], next[i + 1]] = [next[i + 1], next[i]];
                          setPhases(next);
                        },
                        "aria-label": "Move down",
                        "data-ocid": `game-rules.phases.move-down.button.${i + 1}`,
                        children: "▼"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "text-muted-foreground hover:text-destructive text-xs px-1 ml-1",
                        onClick: () => setPhases(phases.filter((_, j) => j !== i)),
                        "aria-label": `Remove ${PHASE_LABELS[phase]}`,
                        "data-ocid": `game-rules.phases.delete_button.${i + 1}`,
                        children: "×"
                      }
                    )
                  ] })
                ]
              },
              phase
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "new-phase-name",
                  placeholder: "Phase name",
                  className: "h-8 text-sm max-w-xs",
                  "data-ocid": "game-rules.phases.new.input",
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      const val = e.currentTarget.value.trim();
                      if (val && !phases.includes(val)) {
                        setPhases([...phases, val]);
                        e.currentTarget.value = "";
                      }
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "h-8 text-xs shrink-0",
                  "data-ocid": "game-rules.phases.add.button",
                  onClick: () => {
                    const input = document.getElementById(
                      "new-phase-name"
                    );
                    const val = input.value.trim();
                    if (val && !phases.includes(val)) {
                      setPhases([...phases, val]);
                      input.value = "";
                    }
                  },
                  children: "Add Phase"
                }
              )
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccordionSection,
        {
          title: "Format Rules",
          open: openSections.formatRules,
          onToggle: () => toggleSection("formatRules"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "These rules are used to validate decks. They are stored locally for now and will sync to the server in a future update." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 max-w-md", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                    htmlFor: "format-min-deck",
                    children: "Minimum deck size"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "format-min-deck",
                    type: "number",
                    min: "1",
                    value: formatRules.minDeckSize,
                    onChange: (e) => setFormatRules((prev) => ({
                      ...prev,
                      minDeckSize: Number(e.target.value) || 1
                    })),
                    className: "mt-1 w-24",
                    "data-ocid": "game-rules.format.min-deck.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                    htmlFor: "format-max-deck",
                    children: "Maximum deck size"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "format-max-deck",
                    type: "number",
                    min: "1",
                    value: formatRules.maxDeckSize,
                    onChange: (e) => setFormatRules((prev) => ({
                      ...prev,
                      maxDeckSize: Number(e.target.value) || 1
                    })),
                    className: "mt-1 w-24",
                    "data-ocid": "game-rules.format.max-deck.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                    htmlFor: "format-max-copies",
                    children: "Max copies of any card"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "format-max-copies",
                    type: "number",
                    min: "1",
                    value: formatRules.maxCopies,
                    onChange: (e) => setFormatRules((prev) => ({
                      ...prev,
                      maxCopies: Number(e.target.value) || 1
                    })),
                    className: "mt-1 w-24",
                    "data-ocid": "game-rules.format.max-copies.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
                    htmlFor: "format-hand-size",
                    children: "Starting hand size"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "format-hand-size",
                    type: "number",
                    min: "1",
                    value: formatRules.startingHandSize,
                    onChange: (e) => setFormatRules((prev) => ({
                      ...prev,
                      startingHandSize: Number(e.target.value) || 1
                    })),
                    className: "mt-1 w-24",
                    "data-ocid": "game-rules.format.hand-size.input"
                  }
                )
              ] })
            ] })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 px-6 py-3 border-t border-border bg-card/50",
        "data-ocid": "game-rules.save-bar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleSave,
              disabled: saving,
              "data-ocid": "game-rules.save.submit_button",
              children: saving ? "Saving…" : saved ? "Saved ✓" : "Save Game Rules"
            }
          ),
          saved && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-mono text-[oklch(var(--success))]",
              "data-ocid": "game-rules.save.success_state",
              children: "Saved ✓"
            }
          )
        ]
      }
    )
  ] });
}
export {
  GameRulesPage as default
};
