import { j as jsxRuntimeExports, r as reactExports, G as GamePhase, $ as GameStatus, M as AbilityTarget, b as useActor, a as useAuth, a0 as useQueryClient, c as useQuery, a1 as useMutation, e as createActor, a2 as useParams, Y as useNavigate, u as useGame, d as Skeleton } from "./index-Ch41Ib91.js";
import { B as Badge } from "./badge-UtblI1Uf.js";
import { S as ScrollArea } from "./scroll-area-CZFYwshx.js";
import { B as Button } from "./button-BHF8-SKr.js";
import { c as useCardLibrary } from "./useCards-v-tHgnVD.js";
import { G as GamePhase$1 } from "./backend.d-BTU9fW2_.js";
import "./index-CyXusObr.js";
import "./index-rFnOFFTx.js";
function formatTimestamp(ts) {
  const ms = Number(ts / 1000000n);
  const d = new Date(ms);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function GameLog({ entries }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "game-log.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 border-b border-border flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider", children: "Game Log" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] px-1.5 py-0 h-4", children: entries.length })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 flex flex-col gap-0.5", children: [
      entries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-4 font-mono", children: "Game log is empty." }),
      entries.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": `game-log.item.${i + 1}`,
          className: "rounded px-2 py-1.5 text-[11px] font-mono leading-relaxed hover:bg-muted/40 transition-colors duration-150",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 shrink-0 tabular-nums", children: formatTimestamp(entry.timestamp) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 min-w-0 text-foreground break-words", children: entry.description }),
            entry.actionType === "manual" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "shrink-0 text-[9px] px-1 py-0 h-3.5 border-[oklch(var(--warning))] text-[oklch(var(--warning))]",
                children: "MANUAL"
              }
            )
          ] })
        },
        `${String(entry.timestamp)}-${entry.actorId ?? i}`
      ))
    ] }) })
  ] });
}
function canAffordCard(card, resources) {
  const totalAvailable = resources.reduce((sum, [, amount]) => sum + amount, 0);
  return totalAvailable >= Number(card.cost);
}
function HandCard({
  cardId,
  card,
  isPlayable,
  isNewlyDrawn,
  onPlay
}) {
  const [hovered, setHovered] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative flex flex-col items-center",
      style: { zIndex: hovered ? 10 : 1 },
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "aria-label": (card == null ? void 0 : card.name) ?? `Card ${Number(cardId)}`,
            onClick: () => {
              if (isPlayable && card && onPlay) onPlay(cardId, card);
            },
            "data-ocid": `hand.card.${Number(cardId)}`,
            className: [
              "relative w-16 h-24 md:w-20 md:h-28 rounded-lg border-2 flex flex-col items-center justify-between p-1.5",
              "transition-all duration-150 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
              isNewlyDrawn ? "card-flip-animation" : "",
              isPlayable ? "border-[oklch(var(--play-your-turn))] shadow-[0_0_8px_oklch(var(--play-your-turn)/0.5)] cursor-pointer hover:-translate-y-3 hover:shadow-lg" : "border-border cursor-default"
            ].join(" "),
            style: { background: "oklch(var(--card))" },
            children: [
              (card == null ? void 0 : card.artUrl) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: card.artUrl,
                  alt: card == null ? void 0 : card.name,
                  className: "absolute inset-0 w-full h-full object-cover rounded-lg opacity-30"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full flex justify-between items-start", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono font-bold text-foreground tabular-nums", children: card ? Number(card.cost) : "?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-muted-foreground truncate max-w-[36px]", children: (card == null ? void 0 : card.cardType) ?? "" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 text-center px-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-display font-semibold text-foreground leading-tight line-clamp-2", children: (card == null ? void 0 : card.name) ?? `#${Number(cardId)}` }) }),
              (card == null ? void 0 : card.attack) !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[oklch(var(--card-threat))] tabular-nums", children: Number(card.attack) }),
                card.defense !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[oklch(var(--card-defense))] tabular-nums", children: Number(card.defense) })
              ] })
            ]
          }
        ),
        hovered && isPlayable && card && onPlay && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            className: "absolute -bottom-8 z-20 h-6 text-xs px-2 shadow-md",
            onClick: () => onPlay(cardId, card),
            "data-ocid": `hand.play-button.${Number(cardId)}`,
            children: "Play"
          }
        )
      ]
    }
  );
}
function HandZone({
  cardIds,
  cardLibrary,
  isMyTurn,
  isMainPhase,
  playerResources,
  onPlayCard,
  newlyDrawnCardId
}) {
  const canPlay = isMyTurn && isMainPhase;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: "flex items-end justify-center gap-1 md:gap-2 py-2 overflow-x-auto overflow-y-visible scrollbar-none pb-8",
      "data-ocid": "hand.zone",
      "aria-label": "Your hand",
      children: cardIds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-muted-foreground font-mono py-4",
          "data-ocid": "hand.empty_state",
          children: "No cards in hand"
        }
      ) : cardIds.map((cardId, i) => {
        const card = cardLibrary.get(cardId);
        const isPlayable = canPlay && !!card && canAffordCard(card, playerResources);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          HandCard,
          {
            cardId,
            card,
            isPlayable,
            isNewlyDrawn: newlyDrawnCardId === cardId,
            onPlay: canPlay ? onPlayCard : void 0
          },
          `${Number(cardId)}-${i}`
        );
      })
    }
  );
}
function CardInPlayTile({
  cardInPlay,
  card,
  isActive,
  isMyArea,
  isSelectedAttacker,
  onSelectAttacker,
  onUseAbility
}) {
  const [showActions, setShowActions] = reactExports.useState(false);
  const atk = Number(cardInPlay.baseAttack + cardInPlay.tempBuffAttack);
  const def = Number(cardInPlay.baseDefense + cardInPlay.tempBuffDefense);
  const canInteract = isActive && isMyArea && !cardInPlay.summonSick && !cardInPlay.tapped;
  const hasAbilities = ((card == null ? void 0 : card.abilities) ?? []).length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", onBlur: () => setShowActions(false), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => {
          if (!canInteract) return;
          setShowActions((v) => !v);
        },
        "aria-label": (card == null ? void 0 : card.name) ?? "Card in play",
        "data-ocid": `play-area.card.${Number(cardInPlay.instanceId)}`,
        className: [
          "relative w-16 h-24 md:w-20 md:h-28 rounded-lg border-2 cursor-pointer select-none",
          "flex flex-col items-center justify-between p-1.5 transition-all duration-150",
          "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
          cardInPlay.tapped ? "rotate-90 origin-center" : "",
          cardInPlay.summonSick ? "opacity-50" : "",
          isSelectedAttacker ? "border-[oklch(var(--play-your-turn))] shadow-[0_0_0_2px_oklch(var(--play-your-turn)/0.4)]" : canInteract ? "border-border hover:border-primary hover:shadow-md" : "border-border",
          !canInteract && isMyArea ? "cursor-default" : ""
        ].join(" "),
        style: {
          background: "oklch(var(--card))"
        },
        children: [
          (card == null ? void 0 : card.artUrl) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: card.artUrl,
              alt: card.name,
              className: "absolute inset-0 w-full h-full object-cover rounded-lg opacity-40"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[9px] font-mono text-muted-foreground truncate", children: (card == null ? void 0 : card.cardType) ?? "?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-display font-semibold text-foreground leading-tight line-clamp-2", children: (card == null ? void 0 : card.name) ?? `#${Number(cardInPlay.cardId)}` }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[oklch(var(--card-threat))] tabular-nums", children: atk }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[oklch(var(--card-defense))] tabular-nums", children: def })
          ] }),
          cardInPlay.summonSick && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-muted/40 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-muted-foreground", children: "Sick" }) })
        ]
      }
    ),
    showActions && canInteract && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-50 bg-popover border border-border rounded-lg shadow-lg p-1.5 flex flex-col gap-1 min-w-[120px]",
        "data-ocid": `play-area.popover.${Number(cardInPlay.instanceId)}`,
        children: [
          onSelectAttacker && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: isSelectedAttacker ? "default" : "outline",
              className: "text-xs h-7 w-full",
              onClick: () => {
                onSelectAttacker(cardInPlay.instanceId);
                setShowActions(false);
              },
              "data-ocid": `play-area.attack-toggle.${Number(cardInPlay.instanceId)}`,
              children: isSelectedAttacker ? "Deselect" : "Attack"
            }
          ),
          hasAbilities && card.abilities.map((ability) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              className: "text-xs h-7 w-full truncate",
              onClick: () => {
                onUseAbility == null ? void 0 : onUseAbility(cardInPlay.instanceId, ability.id);
                setShowActions(false);
              },
              "data-ocid": `play-area.ability.${Number(cardInPlay.instanceId)}.${Number(ability.id)}`,
              children: ability.name
            },
            Number(ability.id)
          ))
        ]
      }
    )
  ] });
}
function PlayArea({
  cards,
  cardLibrary,
  isActive,
  isMyArea,
  selectedAttackers,
  onSelectAttacker,
  onUseAbility
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex-1 flex items-center justify-center min-h-[120px]",
      "data-ocid": isMyArea ? "play-area.player" : "play-area.opponent",
      children: cards.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "border-2 border-dashed border-border/50 rounded-xl px-8 py-4 text-xs text-muted-foreground font-mono",
          "data-ocid": isMyArea ? "play-area.player.empty_state" : "play-area.opponent.empty_state",
          children: "No cards in play"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3 items-center justify-center p-2", children: cards.map((cip) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CardInPlayTile,
        {
          cardInPlay: cip,
          card: cardLibrary.get(cip.cardId),
          isActive,
          isMyArea,
          isSelectedAttacker: selectedAttackers.includes(cip.instanceId),
          onSelectAttacker: isMyArea ? onSelectAttacker : void 0,
          onUseAbility: isMyArea ? onUseAbility : void 0
        },
        Number(cip.instanceId)
      )) })
    }
  );
}
const RESOURCE_COLOURS = {
  Fire: "oklch(var(--card-threat))",
  Water: "oklch(var(--card-resource))",
  Earth: "oklch(var(--card-answer))",
  Air: "oklch(var(--card-utility))",
  Mana: "oklch(var(--primary))",
  Gold: "oklch(var(--card-draw))"
};
function resourceColour(name) {
  return RESOURCE_COLOURS[name] ?? "oklch(var(--primary))";
}
function ResourcesBar({
  playerState,
  isMyTurn,
  label
}) {
  const maxHealth = 20n;
  const healthPct = Math.min(
    100,
    Number(playerState.health * 100n / maxHealth)
  );
  const isLowHealth = playerState.health <= 4n;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 px-3 py-2",
      "data-ocid": label === "You" ? "resources-bar.player" : "resources-bar.opponent",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: "shrink-0 text-[10px] px-2 py-0.5 h-5 font-mono",
            style: {
              background: isMyTurn ? label === "You" ? "oklch(var(--play-your-turn) / 0.15)" : "oklch(var(--play-opponent-turn) / 0.15)" : "transparent",
              color: isMyTurn ? label === "You" ? "oklch(var(--play-your-turn))" : "oklch(var(--play-opponent-turn))" : "oklch(var(--muted-foreground))",
              border: `1px solid ${isMyTurn ? label === "You" ? "oklch(var(--play-your-turn) / 0.4)" : "oklch(var(--play-opponent-turn) / 0.4)" : "oklch(var(--border))"}`
            },
            children: isMyTurn ? label === "You" ? "YOUR TURN" : "OPP. TURN" : label.toUpperCase()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1.5 shrink-0",
            "aria-label": `Health: ${playerState.health}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xl font-display font-bold tabular-nums leading-none",
                  style: {
                    color: isLowHealth ? "oklch(var(--danger))" : "oklch(var(--foreground))"
                  },
                  children: Number(playerState.health)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground leading-none", children: "HP" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-10 h-1.5 rounded-full overflow-hidden bg-muted",
                    role: "progressbar",
                    tabIndex: 0,
                    "aria-valuenow": Number(playerState.health),
                    "aria-valuemin": 0,
                    "aria-valuemax": Number(maxHealth),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full transition-all duration-300",
                        style: {
                          width: `${healthPct}%`,
                          background: isLowHealth ? "oklch(var(--danger))" : "oklch(var(--play-winner))"
                        }
                      }
                    )
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-wrap", children: playerState.resources.map(([name, amount]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/50",
            title: `${name}: ${Number(amount)}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-2 h-2 rounded-full shrink-0",
                  style: { background: resourceColour(name) }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-mono tabular-nums text-foreground", children: Number(amount) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: name })
            ]
          },
          name
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1 text-[11px] text-muted-foreground font-mono shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: playerState.hand.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "cards" })
        ] })
      ]
    }
  );
}
const PHASE_LABELS = {
  [GamePhase.Start]: "Start",
  [GamePhase.Draw]: "Draw",
  [GamePhase.Main]: "Main",
  [GamePhase.Combat]: "Combat",
  [GamePhase.End]: "End"
};
function GameBoard({
  session,
  myPlayerId,
  cardLibrary,
  onEndPhase,
  onDeclareAttackers,
  onAssignBlockers,
  onConcede,
  onPlayCard,
  onUseAbility,
  onTakeMulligan,
  onDiscardCard,
  newlyDrawnCardId
}) {
  const [logOpen, setLogOpen] = reactExports.useState(false);
  const [concedeConfirm, setConcedeConfirm] = reactExports.useState(false);
  const [selectedAttackers, setSelectedAttackers] = reactExports.useState([]);
  const [selectedBlockers, setSelectedBlockers] = reactExports.useState([]);
  const [discardSelection, setDiscardSelection] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [targetPicker, setTargetPicker] = reactExports.useState(null);
  const { state } = session;
  const isMyTurn = state.activePlayerId.toText() === myPlayerId;
  const phase = state.phase;
  const isCombat = phase === GamePhase.Combat;
  const isMain = phase === GamePhase.Main;
  const combatSubPhase = state.combatSubPhase;
  const isDeclaringAttackers = combatSubPhase.__kind__ === "DeclaringAttackers";
  const isAssigningBlockers = combatSubPhase.__kind__ === "AssigningBlockers";
  const attackerIds = isAssigningBlockers ? combatSubPhase.AssigningBlockers.attackers : [];
  const myState = state.playerStates.find(
    (ps) => ps.playerId.toText() === myPlayerId
  );
  const oppState = state.playerStates.find(
    (ps) => ps.playerId.toText() !== myPlayerId
  );
  const [discardRequired, setDiscardRequired] = reactExports.useState(false);
  const [discardCount, _setDiscardCount] = reactExports.useState(0);
  function toggleAttacker(instanceId) {
    setSelectedAttackers(
      (prev) => prev.includes(instanceId) ? prev.filter((id) => id !== instanceId) : [...prev, instanceId]
    );
  }
  function toggleBlocker(instanceId) {
    setSelectedBlockers(
      (prev) => prev.includes(instanceId) ? prev.filter((id) => id !== instanceId) : [...prev, instanceId]
    );
  }
  function handleDeclareAttackers() {
    onDeclareAttackers(selectedAttackers);
    setSelectedAttackers([]);
  }
  function handleAssignBlockers() {
    onAssignBlockers(selectedBlockers);
    setSelectedBlockers([]);
  }
  function handleEndPhase() {
    onEndPhase();
    setSelectedAttackers([]);
    setSelectedBlockers([]);
  }
  function toggleDiscard(index) {
    setDiscardSelection((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }
  function confirmDiscard() {
    const indices = Array.from(discardSelection).sort((a, b) => b - a);
    for (const idx of indices) {
      onDiscardCard(BigInt(idx));
    }
    setDiscardSelection(/* @__PURE__ */ new Set());
    setDiscardRequired(false);
  }
  function startTargetPicker(sourceInstanceId, abilityId) {
    const cardInPlay = myState == null ? void 0 : myState.playArea.find(
      (c) => c.instanceId === sourceInstanceId
    );
    const card = cardInPlay ? cardLibrary.get(cardInPlay.cardId) : void 0;
    const ability = card == null ? void 0 : card.abilities.find((a) => a.id === abilityId);
    if (!ability) return;
    const validTargets = [];
    for (const target of ability.targets) {
      if (target === AbilityTarget.TargetCreature || target === AbilityTarget.AllOpponentCreatures) {
        for (const c of (oppState == null ? void 0 : oppState.playArea) ?? []) {
          validTargets.push(c.instanceId);
        }
      }
      if (target === AbilityTarget.TargetCreature || target === AbilityTarget.AllYourCreatures) {
        for (const c of (myState == null ? void 0 : myState.playArea) ?? []) {
          validTargets.push(c.instanceId);
        }
      }
      if (target === AbilityTarget.Opponent) ;
    }
    if (validTargets.length === 0 && ability.targets.includes(AbilityTarget.Opponent)) {
      onUseAbility(sourceInstanceId, abilityId, null);
      return;
    }
    if (validTargets.length === 0) {
      onUseAbility(sourceInstanceId, abilityId, null);
      return;
    }
    setTargetPicker({ sourceInstanceId, abilityId, validTargets });
  }
  function selectTarget(targetId) {
    if (!targetPicker) return;
    onUseAbility(
      targetPicker.sourceInstanceId,
      targetPicker.abilityId,
      targetId
    );
    setTargetPicker(null);
  }
  const isMulliganPhase = state.status === GameStatus.WaitingForPlayer;
  const canMulligan = (myState == null ? void 0 : myState.mulliganState) && !myState.mulliganState.taken;
  const combatPhaseColor = isDeclaringAttackers ? "oklch(var(--combat-declare))" : isAssigningBlockers ? "oklch(var(--combat-block))" : "oklch(var(--combat-resolve))";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-screen flex overflow-hidden bg-background",
      "data-ocid": "game-board.canvas_target",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: [
              "fixed left-0 top-0 h-full w-72 bg-card border-r border-border z-40 flex flex-col",
              "transition-transform duration-200 ease-in-out",
              logOpen ? "translate-x-0" : "-translate-x-full"
            ].join(" "),
            "aria-label": "Game Log",
            role: "complementary",
            "data-ocid": "game-board.game-log.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GameLog, { entries: session.log }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "absolute -right-8 top-4 w-8 h-8 bg-card border border-border rounded-r-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150",
                  onClick: () => setLogOpen(false),
                  "aria-label": "Close game log",
                  "data-ocid": "game-board.game-log.close_button",
                  children: "✕"
                }
              )
            ]
          }
        ),
        logOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed inset-0 z-30 bg-background/40",
            onClick: () => setLogOpen(false),
            onKeyDown: (e) => {
              if (e.key === "Escape") setLogOpen(false);
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "border-b border-border/50 bg-card/30",
              "data-ocid": "game-board.opponent.section",
              children: [
                oppState ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ResourcesBar,
                  {
                    playerState: oppState,
                    isMyTurn: !isMyTurn,
                    label: "Opponent"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 flex items-center px-4 text-sm text-muted-foreground font-mono", children: "Waiting for opponent..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 px-4 py-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground font-mono", children: oppState ? `${oppState.hand.length} cards in hand` : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                    Array.from({
                      length: Math.min((oppState == null ? void 0 : oppState.hand.length) ?? 0, 8)
                    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-7 h-10 md:w-8 md:h-12 rounded border border-border bg-muted/60 flex items-center justify-center",
                        "aria-hidden": "true"
                      },
                      `opp-hand-card-${i}`
                    )),
                    ((oppState == null ? void 0 : oppState.hand.length) ?? 0) > 8 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-mono self-end pb-1", children: [
                      "+",
                      ((oppState == null ? void 0 : oppState.hand.length) ?? 0) - 8
                    ] })
                  ] })
                ] }),
                oppState && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "text-[11px] uppercase tracking-wider font-semibold bg-white/10 text-white/70 rounded px-2 py-0.5 inline-flex items-center gap-1.5 mb-2",
                      "data-ocid": "game-board.phase-badge",
                      children: [
                        PHASE_LABELS[phase],
                        " PHASE"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PlayArea,
                    {
                      cards: oppState.playArea,
                      cardLibrary,
                      isActive: false,
                      isMyArea: false,
                      selectedAttackers: attackerIds,
                      highlightTargets: (targetPicker == null ? void 0 : targetPicker.validTargets) ?? [],
                      onSelectTarget: targetPicker ? selectTarget : void 0
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between gap-3 px-4 py-1.5 bg-muted/20 border-y border-border/40 text-xs font-mono",
              "data-ocid": "game-board.phase-indicator",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-150",
                    onClick: () => setLogOpen((v) => !v),
                    "aria-label": "Toggle game log",
                    "data-ocid": "game-board.log-toggle.toggle",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "☰" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: "Log" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: [
                  GamePhase.Start,
                  GamePhase.Draw,
                  GamePhase.Main,
                  GamePhase.Combat,
                  GamePhase.End
                ].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: "text-[10px] px-1.5 py-0 h-5 font-mono transition-all duration-150",
                    style: {
                      background: p === phase ? isCombat ? `${combatPhaseColor} / 0.18` : "oklch(var(--play-current-phase) / 0.18)" : "transparent",
                      color: p === phase ? isCombat ? combatPhaseColor : "oklch(var(--play-current-phase))" : "oklch(var(--muted-foreground))",
                      border: p === phase ? isCombat ? `1px solid ${combatPhaseColor} / 0.4` : "1px solid oklch(var(--play-current-phase) / 0.4)" : "1px solid transparent"
                    },
                    children: PHASE_LABELS[p]
                  },
                  p
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    "Turn ",
                    Number(state.turn)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: "text-[10px] px-2 py-0 h-5 font-mono",
                      style: {
                        background: isMyTurn ? "oklch(var(--play-your-turn) / 0.15)" : "oklch(var(--play-opponent-turn) / 0.15)",
                        color: isMyTurn ? "oklch(var(--play-your-turn))" : "oklch(var(--play-opponent-turn))",
                        border: `1px solid ${isMyTurn ? "oklch(var(--play-your-turn) / 0.4)" : "oklch(var(--play-opponent-turn) / 0.4)"}`
                      },
                      children: isMyTurn ? "YOUR TURN" : "OPP. TURN"
                    }
                  )
                ] })
              ]
            }
          ),
          isCombat && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-1 text-center text-xs font-mono font-semibold",
              style: {
                background: `${combatPhaseColor} / 0.1`,
                color: combatPhaseColor
              },
              "data-ocid": "game-board.combat-subphase",
              children: [
                isDeclaringAttackers && "Declare Attackers",
                isAssigningBlockers && "Assign Blockers",
                combatSubPhase.__kind__ === "Idle" && "Combat Resolve"
              ]
            }
          ),
          isMulliganPhase && canMulligan && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-3 bg-muted/30 border-y border-border/40 flex items-center justify-center gap-3",
              "data-ocid": "game-board.mulligan.prompt",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Keep this hand?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "default",
                    onClick: () => {
                    },
                    "data-ocid": "game-board.mulligan.keep_button",
                    children: "Keep Hand"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    onClick: onTakeMulligan,
                    "data-ocid": "game-board.mulligan.mulligan_button",
                    children: "Mulligan"
                  }
                )
              ]
            }
          ),
          discardRequired && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-3 bg-destructive/5 border-y border-destructive/20 flex items-center justify-between gap-3",
              "data-ocid": "game-board.discard.prompt",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
                  "Discard ",
                  discardCount,
                  " card",
                  discardCount !== 1 ? "s" : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "destructive",
                    disabled: discardSelection.size !== discardCount,
                    onClick: confirmDiscard,
                    "data-ocid": "game-board.discard.confirm_button",
                    children: [
                      "Confirm Discard (",
                      discardSelection.size,
                      "/",
                      discardCount,
                      ")"
                    ]
                  }
                )
              ]
            }
          ),
          targetPicker && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-2 bg-primary/5 border-y border-primary/20 text-center text-sm",
              "data-ocid": "game-board.target-picker.banner",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(var(--target-highlight))" }, children: "Select a target..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "ml-3 text-xs text-muted-foreground hover:text-foreground underline",
                    onClick: () => setTargetPicker(null),
                    "data-ocid": "game-board.target-picker.cancel",
                    children: "Cancel"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-h-0", children: [
            myState && /* @__PURE__ */ jsxRuntimeExports.jsx(
              PlayArea,
              {
                cards: myState.playArea,
                cardLibrary,
                isActive: isMyTurn,
                isMyArea: true,
                selectedAttackers,
                highlightTargets: (targetPicker == null ? void 0 : targetPicker.validTargets) ?? [],
                onSelectAttacker: isCombat && isMyTurn && isDeclaringAttackers ? toggleAttacker : void 0,
                onSelectBlocker: isCombat && !isMyTurn && isAssigningBlockers ? toggleBlocker : void 0,
                onSelectTarget: targetPicker ? selectTarget : void 0,
                onUseAbility: (instanceId, abilityId) => startTargetPicker(instanceId, abilityId)
              }
            ),
            myState && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-1", "data-ocid": "game-board.turn-indicator", children: isMyTurn ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-sm font-semibold",
                style: { color: "oklch(var(--info))" },
                children: "Your Turn"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-sm",
                style: { color: "oklch(var(--text-tertiary))" },
                children: "Opponent's Turn"
              }
            ) }),
            myState && /* @__PURE__ */ jsxRuntimeExports.jsx(
              HandZone,
              {
                cardIds: myState.hand,
                cardLibrary,
                isMyTurn,
                isMainPhase: isMain,
                playerResources: myState.resources.map(
                  ([name, amt]) => [name, Number(amt)]
                ),
                onPlayCard,
                newlyDrawnCardId,
                discardMode: discardRequired,
                discardSelection,
                onToggleDiscard: toggleDiscard
              }
            ),
            myState && /* @__PURE__ */ jsxRuntimeExports.jsx(
              ResourcesBar,
              {
                playerState: myState,
                isMyTurn,
                label: "You"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-20 md:w-28 flex flex-col items-stretch gap-2 p-2 border-l border-border/50 bg-card/20",
            "data-ocid": "game-board.actions.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "default",
                  className: "w-full text-xs h-9 font-mono",
                  onClick: handleEndPhase,
                  disabled: !isMyTurn,
                  "data-ocid": "game-board.end-phase.button",
                  children: "End Phase"
                }
              ),
              isCombat && isMyTurn && isDeclaringAttackers && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "secondary",
                  className: "w-full text-xs h-9 font-mono",
                  style: {
                    background: "oklch(var(--combat-declare) / 0.15)",
                    color: "oklch(var(--combat-declare))",
                    border: "1px solid oklch(var(--combat-declare) / 0.4)"
                  },
                  onClick: handleDeclareAttackers,
                  disabled: selectedAttackers.length === 0,
                  "data-ocid": "game-board.declare-attackers.button",
                  children: [
                    "Declare",
                    selectedAttackers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 tabular-nums", children: [
                      "(",
                      selectedAttackers.length,
                      ")"
                    ] })
                  ]
                }
              ),
              isCombat && !isMyTurn && isAssigningBlockers && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "secondary",
                  className: "w-full text-xs h-9 font-mono",
                  style: {
                    background: "oklch(var(--combat-block) / 0.15)",
                    color: "oklch(var(--combat-block))",
                    border: "1px solid oklch(var(--combat-block) / 0.4)"
                  },
                  onClick: handleAssignBlockers,
                  "data-ocid": "game-board.assign-blockers.button",
                  children: [
                    "Block",
                    selectedBlockers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 tabular-nums", children: [
                      "(",
                      selectedBlockers.length,
                      ")"
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
              !concedeConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  className: "w-full text-xs h-9 font-mono text-muted-foreground hover:text-destructive",
                  onClick: () => setConcedeConfirm(true),
                  "data-ocid": "game-board.concede.button",
                  children: "Concede"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col gap-1",
                  "data-ocid": "game-board.concede-confirm.panel",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground text-center font-mono", children: "Sure?" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        size: "sm",
                        variant: "destructive",
                        className: "w-full text-xs h-7",
                        onClick: () => {
                          onConcede();
                          setConcedeConfirm(false);
                        },
                        "data-ocid": "game-board.concede.confirm_button",
                        children: "Yes"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        size: "sm",
                        variant: "ghost",
                        className: "w-full text-xs h-7",
                        onClick: () => setConcedeConfirm(false),
                        "data-ocid": "game-board.concede.cancel_button",
                        children: "No"
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function useGameSession(sessionId) {
  const { actor, isFetching } = useActor(createActor);
  const { principal } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["gameSession", sessionId.toString()];
  const {
    data: session,
    error,
    isLoading
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getGameSession(sessionId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2e3,
    staleTime: 0
  });
  const invalidate = () => queryClient.invalidateQueries({ queryKey });
  const myPrincipalText = principal == null ? void 0 : principal.toText();
  const myState = (session == null ? void 0 : session.state.playerStates.find(
    (ps) => ps.playerId.toText() === myPrincipalText
  )) ?? null;
  const opponentState = (session == null ? void 0 : session.state.playerStates.find(
    (ps) => ps.playerId.toText() !== myPrincipalText
  )) ?? null;
  const isMyTurn = !!session && !!myPrincipalText && session.state.activePlayerId.toText() === myPrincipalText;
  const currentPhase = (session == null ? void 0 : session.state.phase) ?? GamePhase$1.Start;
  const drawCardMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.drawCard(sessionId);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate()
  });
  const playCardMutation = useMutation({
    mutationFn: async ({
      cardId,
      card
    }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.playCard(sessionId, cardId, card);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate()
  });
  const declareAttackersMutation = useMutation({
    mutationFn: async (attackerIndices) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.declareAttackers(sessionId, attackerIndices);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate()
  });
  const assignBlockersMutation = useMutation({
    mutationFn: async (blockingInstanceIds) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.assignBlockers(sessionId, blockingInstanceIds);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate()
  });
  const takeMulliganMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.takeMulligan(sessionId);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate()
  });
  const discardCardMutation = useMutation({
    mutationFn: async (handIndex) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.discardCard(sessionId, handIndex);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate()
  });
  const useAbilityMutation = useMutation({
    mutationFn: async ({
      sourceInstanceId,
      abilityId,
      targetInstanceId,
      effects
    }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.useAbility(
        sessionId,
        sourceInstanceId,
        abilityId,
        targetInstanceId,
        effects
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate()
  });
  const endPhaseMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.endPhase(sessionId);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate()
  });
  const concedeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.concedeGame(sessionId);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => invalidate()
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
      concede: concedeMutation
    }
  };
}
function BoardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen flex flex-col gap-2 p-4 bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "flex-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-24" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" })
  ] });
}
function GameBoardPage() {
  const { sessionId: sessionIdStr } = useParams({ strict: false });
  const sessionId = BigInt(sessionIdStr ?? "0");
  const navigate = useNavigate();
  const { principal } = useAuth();
  const { game } = useGame();
  const { session, isLoading, error, actions } = useGameSession(sessionId);
  const { data: cardsArray } = useCardLibrary(game == null ? void 0 : game.id);
  const cardLibrary = new Map(
    (cardsArray ?? []).map((c) => [c.id, c])
  );
  const [newlyDrawnCardId, setNewlyDrawnCardId] = reactExports.useState(null);
  const [reconnectError, setReconnectError] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (error) setReconnectError(true);
    else setReconnectError(false);
  }, [error]);
  const myPlayerId = (principal == null ? void 0 : principal.toText()) ?? "";
  if (isLoading && !session) return /* @__PURE__ */ jsxRuntimeExports.jsx(BoardSkeleton, {});
  if (!session) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "context-play h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center space-y-4",
        "data-ocid": "game-board.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-mono", children: "Session not found." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: () => navigate({ to: "/play" }),
              "data-ocid": "game-board.return-home.button",
              children: "Return Home"
            }
          )
        ]
      }
    ) });
  }
  const status = session.state.status;
  if (status === GameStatus.WaitingForPlayer) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "context-play h-screen flex flex-col items-center justify-center gap-6 bg-background",
        "data-ocid": "game-board.waiting.section",
        children: [
          reconnectError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "fixed top-0 left-0 right-0 bg-[oklch(var(--warning)/0.15)] border-b border-[oklch(var(--warning)/0.3)] px-4 py-2 flex items-center gap-2",
              "data-ocid": "game-board.reconnecting.loading_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse w-2 h-2 rounded-full bg-[oklch(var(--warning))]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-[oklch(var(--warning))]", children: "Reconnecting…" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: "text-sm px-4 py-1",
                style: {
                  background: "oklch(var(--play-current-phase) / 0.15)",
                  color: "oklch(var(--play-current-phase))",
                  border: "1px solid oklch(var(--play-current-phase) / 0.3)"
                },
                children: "Waiting for opponent"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-mono", children: "Share your invite code to start the game." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-xl px-8 py-5 flex flex-col items-center gap-3",
              "data-ocid": "game-board.invite-code.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono uppercase tracking-wider", children: "Invite Code" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-display font-bold tracking-widest text-foreground select-all", children: session.inviteCode }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "text-xs font-mono",
                    onClick: () => navigator.clipboard.writeText(session.inviteCode),
                    "data-ocid": "game-board.copy-code.button",
                    children: "Copy code"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              className: "text-muted-foreground font-mono text-sm",
              onClick: () => navigate({ to: "/play" }),
              "data-ocid": "game-board.return-home.button",
              children: "Cancel"
            }
          )
        ]
      }
    );
  }
  if (status === GameStatus.Completed && session.result) {
    const didWin = session.result.winnerId.toText() === myPlayerId;
    const finalTurn = Number(session.result.finalTurn);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "context-play h-screen flex flex-col items-center justify-center gap-6 bg-background",
        "data-ocid": "game-board.result.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-6xl font-display font-bold",
                style: {
                  color: didWin ? "oklch(var(--play-winner))" : "oklch(var(--danger))"
                },
                "data-ocid": "game-board.result.card",
                children: didWin ? "Victory" : "Defeat"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground font-mono text-sm", children: [
              "Game ended on turn ",
              finalTurn
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: () => navigate({ to: "/play/new" }),
                "data-ocid": "game-board.play-again.button",
                children: "Play Again"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => navigate({ to: "/play" }),
                "data-ocid": "game-board.return-home.button",
                children: "Return Home"
              }
            )
          ] })
        ]
      }
    );
  }
  if (status === GameStatus.Abandoned) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "context-play h-screen flex flex-col items-center justify-center gap-4 bg-background",
        "data-ocid": "game-board.abandoned.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-mono", children: "This game was abandoned." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: () => navigate({ to: "/play" }),
              "data-ocid": "game-board.return-home.button",
              children: "Return Home"
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "context-play", "data-ocid": "game-board.page", children: [
    reconnectError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed top-0 left-0 right-0 z-50 bg-[oklch(var(--warning)/0.15)] border-b border-[oklch(var(--warning)/0.3)] px-4 py-2 flex items-center gap-2",
        "data-ocid": "game-board.reconnecting.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse w-2 h-2 rounded-full bg-[oklch(var(--warning))]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-[oklch(var(--warning))]", children: "Reconnecting…" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      GameBoard,
      {
        session,
        myPlayerId,
        cardLibrary,
        onEndPhase: () => actions.endPhase.mutate(),
        onDeclareAttackers: (attackerIndices) => actions.declareAttackers.mutate(attackerIndices),
        onAssignBlockers: (blockingInstanceIds) => actions.assignBlockers.mutate(blockingInstanceIds),
        onTakeMulligan: () => actions.takeMulligan.mutate(),
        onDiscardCard: (handIndex) => actions.discardCard.mutate(handIndex),
        onConcede: () => actions.concede.mutate(),
        onPlayCard: (cardId, card) => actions.playCard.mutate({ cardId, card }),
        onUseAbility: (sourceId, abilityId, targetId) => actions.useAbility.mutate({
          sourceInstanceId: sourceId,
          abilityId,
          targetInstanceId: targetId,
          effects: []
        }),
        newlyDrawnCardId
      }
    )
  ] });
}
export {
  GameBoardPage as default
};
