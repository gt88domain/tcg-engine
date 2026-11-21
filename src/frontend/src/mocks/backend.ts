import type { backendInterface } from "../backend";
import {
  AbilityTarget,
  AbilityTrigger,
  EndCondition,
  GamePhase,
  GameStatus,
  GameVisibility,
  Role,
  Variant_freeform_structured,
} from "../backend";
import { Principal } from "@icp-sdk/core/principal";

const NOW = BigInt(Date.now()) * BigInt(1_000_000);
const DAY = BigInt(86_400_000_000_000);
const GAME_ID = BigInt(1);
const OWNER_PRINCIPAL = Principal.fromText("2vxsx-fae");
const P2 = Principal.fromText("aaaaa-aa");
const P3 = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
const P4 = Principal.fromText("r7inp-6aaaa-aaaaa-aaabq-cai");
const P5 = Principal.fromText("rno2w-sqaaa-aaaaa-aaacq-cai");
const P6 = Principal.fromText("renrk-eyaaa-aaaaa-aaada-cai");

// ---------------------------------------------------------------------------
// GAME DEFINITION
// ---------------------------------------------------------------------------
const MOCK_GAME = {
  id: GAME_ID,
  name: "Aura TCG",
  gameName: "Aura TCG",
  gameDescription: "A strategic card game of elemental power and tactical combat.",
  themeColor: "#0d9488",
  gameIcon: "",
  wizardStep: BigInt(0),
  designerPrincipal: OWNER_PRINCIPAL,
  resourceSystem: {
    resourceName: "Mana",
    resourcesPerTurn: BigInt(2),
    startingLife: BigInt(20),
    maxHandSize: BigInt(7),
    deckSizeMin: BigInt(20),
    deckSizeMax: BigInt(60),
    copiesPerCardLimit: BigInt(3),
  },
  cardTypes: ["Creature", "Spell", "Artifact"],
  cardTypeDefinitions: [
    { id: "creature", name: "Creature", staysInPlay: true },
    { id: "spell", name: "Spell", staysInPlay: false },
    { id: "artifact", name: "Artifact", staysInPlay: true },
  ],
  keywords: [
    { id: "flying", name: "Flying", rulesDescription: "This creature can only be blocked by creatures with Flying." },
    { id: "defender", name: "Defender", rulesDescription: "This creature cannot attack." },
    { id: "haste", name: "Haste", rulesDescription: "This creature can attack the turn it enters play." },
    { id: "trample", name: "Trample", rulesDescription: "Excess combat damage is dealt to the opponent." },
    { id: "lifesteal", name: "Lifesteal", rulesDescription: "Damage dealt by this creature heals you for the same amount." },
  ],
  turnPhases: [
    { id: "draw", name: "Draw", description: "Draw a card", order: BigInt(0) },
    { id: "main", name: "Main", description: "Play cards and abilities", order: BigInt(1) },
    { id: "combat", name: "Combat", description: "Attack with creatures", order: BigInt(2) },
    { id: "end", name: "End", description: "End your turn", order: BigInt(3) },
  ],
  version: BigInt(1),
  createdAt: NOW - BigInt(86_400_000_000_000),
  updatedAt: NOW,
  publishedAt: NOW - BigInt(3_600_000_000_000),
  turnStructure: {
    phases: [GamePhase.Start, GamePhase.Draw, GamePhase.Main, GamePhase.Combat, GamePhase.End],
  },
  winConditions: [{ __kind__: "LifeToZero" as const, LifeToZero: null }],
  visibility: GameVisibility.InviteOnly,
};

// ---------------------------------------------------------------------------
// CARD LIBRARY — 24 cards covering the full Resource+Combat design space
// ---------------------------------------------------------------------------
const T = (n: number) => NOW - BigInt(n) * DAY;

const MOCK_CARDS = [
  // ── CREATURES COST 1 ──
  {
    id: BigInt(1), gameId: GAME_ID, cardType: "Creature",
    name: "Emberveil Sprite", cost: BigInt(1), attack: BigInt(1), defense: BigInt(1),
    rulesText: "Haste. Deal 1 damage to opponent when this attacks.",
    flavourText: "Small but furious — blink and it's already through.",
    abilities: [{ id: BigInt(101), name: "Ember Sting", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.Attacks, effects: [{ __kind__: "DealDamage" as const, DealDamage: BigInt(1) }],
      targets: [AbilityTarget.Opponent], rulesText: "Deal 1 damage to opponent when attacking." }],
    tags: ["Haste", "Aggro"], artUrl: "https://picsum.photos/seed/aura01/300/400", createdAt: T(30), updatedAt: T(5),
  },
  {
    id: BigInt(2), gameId: GAME_ID, cardType: "Creature",
    name: "Thornback Scout", cost: BigInt(1), attack: BigInt(2), defense: BigInt(1),
    rulesText: "When this enters play, draw a card if you control 3 or fewer creatures.",
    flavourText: "First into the breach, sharpest eyes on the field.",
    abilities: [{ id: BigInt(102), name: "Scout Ahead", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay, effects: [{ __kind__: "DrawCards" as const, DrawCards: BigInt(1) }],
      targets: [AbilityTarget.You], rulesText: "Draw 1 card on enter.", conditionText: "If you control 3 or fewer creatures" }],
    tags: ["Aggro", "Draw"], artUrl: "https://picsum.photos/seed/aura02/300/400", createdAt: T(28), updatedAt: T(4),
  },
  // ── CREATURES COST 2 ──
  {
    id: BigInt(3), gameId: GAME_ID, cardType: "Creature",
    name: "Verdant Healer", cost: BigInt(2), attack: BigInt(1), defense: BigInt(3),
    rulesText: "At the start of your turn, gain 2 life.",
    flavourText: "Life blooms where she walks.",
    abilities: [{ id: BigInt(103), name: "Life Bloom", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.StartOfTurn, effects: [{ __kind__: "HealLife" as const, HealLife: BigInt(2) }],
      targets: [AbilityTarget.You], rulesText: "Gain 2 life at start of your turn." }],
    tags: ["Heal", "Defense"], artUrl: "https://picsum.photos/seed/aura03/300/400", createdAt: T(25), updatedAt: T(3),
  },
  {
    id: BigInt(4), gameId: GAME_ID, cardType: "Creature",
    name: "Shadowmere Drake", cost: BigInt(2), attack: BigInt(2), defense: BigInt(2),
    rulesText: "Flying. When this enters play, deal 1 damage to target creature.",
    flavourText: "The dusk carries its wings across the endless sky.",
    abilities: [{ id: BigInt(104), name: "Dusk Strike", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay, effects: [{ __kind__: "DealDamage" as const, DealDamage: BigInt(1) }],
      targets: [AbilityTarget.TargetCreature], rulesText: "Deal 1 damage to target creature." }],
    tags: ["Flying", "Midrange"], artUrl: "https://picsum.photos/seed/aura04/300/400", createdAt: T(24), updatedAt: T(3),
  },
  // ── CREATURES COST 3 ──
  {
    id: BigInt(5), gameId: GAME_ID, cardType: "Creature",
    name: "Iron Warden", cost: BigInt(3), attack: BigInt(2), defense: BigInt(5),
    rulesText: "Defender. Other friendly creatures gain +0/+1 while this is in play.",
    flavourText: "It does not move. It does not need to.",
    abilities: [{ id: BigInt(105), name: "Stalwart Aura", abilityType: Variant_freeform_structured.freeform,
      trigger: AbilityTrigger.Passive, effects: [{ __kind__: "StatBoostUntilEOT" as const, StatBoostUntilEOT: [BigInt(0), BigInt(1)] as [bigint, bigint] }],
      targets: [AbilityTarget.AllYourCreatures], rulesText: "Friendly creatures gain +0/+1." }],
    tags: ["Defender", "Control"], artUrl: "https://picsum.photos/seed/aura05/300/400", createdAt: T(22), updatedAt: T(2),
  },
  {
    id: BigInt(6), gameId: GAME_ID, cardType: "Creature",
    name: "Galewind Hawk", cost: BigInt(3), attack: BigInt(3), defense: BigInt(2),
    rulesText: "Flying. When this deals combat damage to opponent, draw a card.",
    flavourText: "The wind is its weapon; the sky, its reward.",
    abilities: [{ id: BigInt(106), name: "Gale Sight", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.DealsDamage, effects: [{ __kind__: "DrawCards" as const, DrawCards: BigInt(1) }],
      targets: [AbilityTarget.You], rulesText: "Draw 1 card when dealing combat damage to opponent." }],
    tags: ["Flying", "Draw", "Threat"], artUrl: "https://picsum.photos/seed/aura06/300/400", createdAt: T(20), updatedAt: T(2),
  },
  {
    id: BigInt(7), gameId: GAME_ID, cardType: "Creature",
    name: "Molten Brute", cost: BigInt(3), attack: BigInt(4), defense: BigInt(1),
    rulesText: "Haste. Trample. Dies at end of turn if it attacked this turn.",
    flavourText: "All fury, no regret.",
    abilities: [{ id: BigInt(107), name: "Burning Charge", abilityType: Variant_freeform_structured.freeform,
      trigger: AbilityTrigger.Attacks, effects: [{ __kind__: "DealDamage" as const, DealDamage: BigInt(1) }],
      targets: [AbilityTarget.Opponent], rulesText: "Trample: excess damage hits opponent." }],
    tags: ["Haste", "Trample", "Aggro"], artUrl: "https://picsum.photos/seed/aura07/300/400", createdAt: T(19), updatedAt: T(1),
  },
  // ── CREATURES COST 4 ──
  {
    id: BigInt(8), gameId: GAME_ID, cardType: "Creature",
    name: "Duskblade Assassin", cost: BigInt(4), attack: BigInt(4), defense: BigInt(3),
    rulesText: "When this enters play, destroy target creature with 2 or less attack.",
    flavourText: "She counts no witnesses among her clients.",
    abilities: [{ id: BigInt(108), name: "Backstab", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay, effects: [{ __kind__: "Destroy" as const, Destroy: null }],
      targets: [AbilityTarget.TargetCreature], rulesText: "Destroy target creature with 2 or less attack.", conditionText: "Target has 2 or less attack" }],
    tags: ["Removal", "Midrange"], artUrl: "https://picsum.photos/seed/aura08/300/400", createdAt: T(18), updatedAt: T(1),
  },
  {
    id: BigInt(9), gameId: GAME_ID, cardType: "Creature",
    name: "Aether Sphinx", cost: BigInt(4), attack: BigInt(3), defense: BigInt(4),
    rulesText: "Flying. When this attacks, you may draw a card then discard a card.",
    flavourText: "It reads your question before you speak it.",
    abilities: [{ id: BigInt(109), name: "Riddle Draw", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.Attacks, effects: [{ __kind__: "DrawCards" as const, DrawCards: BigInt(1) }],
      targets: [AbilityTarget.You], rulesText: "Draw 1, discard 1 when attacking." }],
    tags: ["Flying", "Draw", "Control"], artUrl: "https://picsum.photos/seed/aura09/300/400", createdAt: T(17), updatedAt: T(1),
  },
  // ── CREATURES COST 5 ──
  {
    id: BigInt(10), gameId: GAME_ID, cardType: "Creature",
    name: "Crystal Golem", cost: BigInt(5), attack: BigInt(3), defense: BigInt(6),
    rulesText: "Defender. Whenever this blocks, gain 2 Mana next turn.",
    flavourText: "Forged in the deepest mines, its heart pulses with raw power.",
    abilities: [{ id: BigInt(110), name: "Crystal Shell", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.Attacks, effects: [{ __kind__: "GainResources" as const, GainResources: BigInt(2) }],
      targets: [AbilityTarget.You], rulesText: "Gain 2 Mana when blocking." }],
    tags: ["Defender", "Resource", "Control"], artUrl: "https://picsum.photos/seed/aura10/300/400", createdAt: T(16), updatedAt: T(1),
  },
  {
    id: BigInt(11), gameId: GAME_ID, cardType: "Creature",
    name: "Stormcaller Elemental", cost: BigInt(5), attack: BigInt(4), defense: BigInt(4),
    rulesText: "When this enters play, deal 2 damage to all opponent creatures.",
    flavourText: "The clouds gathered. Then the screaming started.",
    abilities: [{ id: BigInt(111), name: "Storm Burst", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay, effects: [{ __kind__: "DealDamage" as const, DealDamage: BigInt(2) }],
      targets: [AbilityTarget.AllOpponentCreatures], rulesText: "Deal 2 damage to all opponent creatures." }],
    tags: ["Removal", "Midrange", "Finisher"], artUrl: "https://picsum.photos/seed/aura11/300/400", createdAt: T(15), updatedAt: T(1),
  },
  // ── CREATURES COST 6 ──
  {
    id: BigInt(12), gameId: GAME_ID, cardType: "Creature",
    name: "Void Reaper", cost: BigInt(6), attack: BigInt(6), defense: BigInt(4),
    rulesText: "Haste. When this attacks, destroy target creature with defense 3 or less.",
    flavourText: "Nothing escapes its blade — not even silence.",
    abilities: [{ id: BigInt(112), name: "Void Slash", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.Attacks, effects: [{ __kind__: "Destroy" as const, Destroy: null }],
      targets: [AbilityTarget.TargetCreature], rulesText: "Destroy target creature with defense ≤3." }],
    tags: ["Haste", "Removal", "Finisher"], artUrl: "https://picsum.photos/seed/aura12/300/400", createdAt: T(14), updatedAt: T(1),
  },
  {
    id: BigInt(13), gameId: GAME_ID, cardType: "Creature",
    name: "Titan of the Deep", cost: BigInt(6), attack: BigInt(5), defense: BigInt(7),
    rulesText: "Lifesteal. When this damages a creature, heal that much life.",
    flavourText: "From the abyss it rose, and the sea itself gave way.",
    abilities: [{ id: BigInt(113), name: "Life Drain", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.DealsDamage, effects: [{ __kind__: "HealLife" as const, HealLife: BigInt(3) }],
      targets: [AbilityTarget.You], rulesText: "Heal 3 life when dealing damage." }],
    tags: ["Lifesteal", "Finisher", "Midrange"], artUrl: "https://picsum.photos/seed/aura13/300/400", createdAt: T(13), updatedAt: T(1),
  },
  // ── SPELLS — DAMAGE ──
  {
    id: BigInt(14), gameId: GAME_ID, cardType: "Spell",
    name: "Cinder Bolt", cost: BigInt(1),
    rulesText: "Deal 2 damage to target creature or player.",
    flavourText: "Quick and efficient. Like a tax.",
    abilities: [{ id: BigInt(114), name: "Cinder", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay, effects: [{ __kind__: "DealDamage" as const, DealDamage: BigInt(2) }],
      targets: [AbilityTarget.TargetCreature], rulesText: "Deal 2 damage to target creature or player." }],
    tags: ["Damage", "Burn"], artUrl: "https://picsum.photos/seed/aura14/300/400", createdAt: T(12), updatedAt: T(1),
  },
  {
    id: BigInt(15), gameId: GAME_ID, cardType: "Spell",
    name: "Arc Lightning", cost: BigInt(2),
    rulesText: "Deal 3 damage to target creature. Draw 1 card.",
    flavourText: "The storm answers to those who know its name.",
    abilities: [{ id: BigInt(115), name: "Arc Bolt", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay,
      effects: [{ __kind__: "DealDamage" as const, DealDamage: BigInt(3) }, { __kind__: "DrawCards" as const, DrawCards: BigInt(1) }],
      targets: [AbilityTarget.TargetCreature], rulesText: "Deal 3 damage to target, draw 1." }],
    tags: ["Damage", "Draw"], artUrl: "https://picsum.photos/seed/aura15/300/400", createdAt: T(11), updatedAt: T(1),
  },
  {
    id: BigInt(16), gameId: GAME_ID, cardType: "Spell",
    name: "Inferno Wave", cost: BigInt(4),
    rulesText: "Deal 3 damage to all opponent creatures.",
    flavourText: "Leave nothing behind but the scent of regret.",
    abilities: [{ id: BigInt(116), name: "Inferno", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay, effects: [{ __kind__: "DealDamage" as const, DealDamage: BigInt(3) }],
      targets: [AbilityTarget.AllOpponentCreatures], rulesText: "Deal 3 damage to all opponent creatures." }],
    tags: ["Damage", "Removal", "Sweeper"], artUrl: "https://picsum.photos/seed/aura16/300/400", createdAt: T(10), updatedAt: T(1),
  },
  // ── SPELLS — DRAW ──
  {
    id: BigInt(17), gameId: GAME_ID, cardType: "Spell",
    name: "Omen Scroll", cost: BigInt(2),
    rulesText: "Draw 2 cards.",
    flavourText: "The words rearrange themselves for each reader.",
    abilities: [{ id: BigInt(117), name: "Deep Read", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay, effects: [{ __kind__: "DrawCards" as const, DrawCards: BigInt(2) }],
      targets: [AbilityTarget.You], rulesText: "Draw 2 cards." }],
    tags: ["Draw", "Utility"], artUrl: "https://picsum.photos/seed/aura17/300/400", createdAt: T(9), updatedAt: T(1),
  },
  {
    id: BigInt(18), gameId: GAME_ID, cardType: "Spell",
    name: "Prophet's Vision", cost: BigInt(3),
    rulesText: "Draw 3 cards. Discard 1 card.",
    flavourText: "She saw every future. She chose the worst one to share.",
    abilities: [{ id: BigInt(118), name: "Foresight", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay, effects: [{ __kind__: "DrawCards" as const, DrawCards: BigInt(3) }],
      targets: [AbilityTarget.You], rulesText: "Draw 3, discard 1." }],
    tags: ["Draw", "Control"], artUrl: "https://picsum.photos/seed/aura18/300/400", createdAt: T(8), updatedAt: T(1),
  },
  // ── SPELLS — BUFF/DEBUFF ──
  {
    id: BigInt(19), gameId: GAME_ID, cardType: "Spell",
    name: "Iron Blessing", cost: BigInt(2),
    rulesText: "Give target creature +2/+2 until end of turn.",
    flavourText: "Even stone can be made sharper with the right prayer.",
    abilities: [{ id: BigInt(119), name: "Bless", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay, effects: [{ __kind__: "StatBoostUntilEOT" as const, StatBoostUntilEOT: [BigInt(2), BigInt(2)] as [bigint, bigint] }],
      targets: [AbilityTarget.TargetCreature], rulesText: "Give target creature +2/+2 until end of turn." }],
    tags: ["Buff", "Combat"], artUrl: "https://picsum.photos/seed/aura19/300/400", createdAt: T(7), updatedAt: T(1),
  },
  {
    id: BigInt(20), gameId: GAME_ID, cardType: "Spell",
    name: "Wither Curse", cost: BigInt(2),
    rulesText: "Give target creature -2/-2 until end of turn.",
    flavourText: "It felt like a century. It lasted only an instant.",
    abilities: [{ id: BigInt(120), name: "Wither", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay, effects: [{ __kind__: "StatReduceUntilEOT" as const, StatReduceUntilEOT: [BigInt(2), BigInt(2)] as [bigint, bigint] }],
      targets: [AbilityTarget.TargetCreature], rulesText: "Give target creature -2/-2 until end of turn." }],
    tags: ["Debuff", "Removal", "Answer"], artUrl: "https://picsum.photos/seed/aura20/300/400", createdAt: T(6), updatedAt: T(1),
  },
  // ── RESOURCE ACCELERATION ──
  {
    id: BigInt(21), gameId: GAME_ID, cardType: "Artifact",
    name: "Mana Siphon", cost: BigInt(1),
    rulesText: "Gain 3 Mana.",
    flavourText: "The machine was hungry. So was its owner.",
    abilities: [{ id: BigInt(121), name: "Siphon", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay, effects: [{ __kind__: "GainResources" as const, GainResources: BigInt(3) }],
      targets: [AbilityTarget.You], rulesText: "Gain 3 Mana." }],
    tags: ["Resource", "Ramp"], artUrl: "https://picsum.photos/seed/aura21/300/400", createdAt: T(5), updatedAt: T(1),
  },
  {
    id: BigInt(22), gameId: GAME_ID, cardType: "Artifact",
    name: "Leyline Conduit", cost: BigInt(2),
    rulesText: "Gain 2 Mana each turn this stays in play.",
    flavourText: "Tap it once and the current becomes yours.",
    abilities: [{ id: BigInt(122), name: "Conduit Flow", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.StartOfTurn, effects: [{ __kind__: "GainResources" as const, GainResources: BigInt(2) }],
      targets: [AbilityTarget.You], rulesText: "Gain 2 Mana at start of your turn." }],
    tags: ["Resource", "Ramp", "Utility"], artUrl: "https://picsum.photos/seed/aura22/300/400", createdAt: T(4), updatedAt: T(1),
  },
  // ── DEFENSIVE / UTILITY ──
  {
    id: BigInt(23), gameId: GAME_ID, cardType: "Spell",
    name: "Mirror Ward", cost: BigInt(3),
    rulesText: "Negate target ability. The source creature returns to its owner's hand.",
    flavourText: "The best counter-spell is a polite refusal.",
    abilities: [{ id: BigInt(123), name: "Negate", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay, effects: [{ __kind__: "Counter" as const, Counter: null }, { __kind__: "ReturnToHand" as const, ReturnToHand: null }],
      targets: [AbilityTarget.TargetCreature], rulesText: "Counter target ability; return source to hand." }],
    tags: ["Counter", "Control", "Answer"], artUrl: "https://picsum.photos/seed/aura23/300/400", createdAt: T(3), updatedAt: T(1),
  },
  {
    id: BigInt(24), gameId: GAME_ID, cardType: "Spell",
    name: "Ancestral Recall", cost: BigInt(3),
    rulesText: "Return target creature from your graveyard to your hand. Gain 2 life.",
    flavourText: "Nothing truly dies. It simply waits.",
    abilities: [{ id: BigInt(124), name: "Reclaim", abilityType: Variant_freeform_structured.structured,
      trigger: AbilityTrigger.EnterPlay,
      effects: [{ __kind__: "ReturnToHand" as const, ReturnToHand: null }, { __kind__: "HealLife" as const, HealLife: BigInt(2) }],
      targets: [AbilityTarget.TargetCreature], rulesText: "Return creature from graveyard to hand; gain 2 life." }],
    tags: ["Recursion", "Heal", "Utility"], artUrl: "https://picsum.photos/seed/aura24/300/400", createdAt: T(2), updatedAt: T(1),
  },
];

// ---------------------------------------------------------------------------
// DECKS — 6 decks total
// ---------------------------------------------------------------------------
const MOCK_DECKS: import("../backend").Deck[] = [
  {
    id: BigInt(1), gameId: GAME_ID, name: "Starter Deck",
    ownerId: OWNER_PRINCIPAL, isStarterDeck: true, isPublished: true,
    cards: [
      { cardId: BigInt(1), count: BigInt(3) }, { cardId: BigInt(3), count: BigInt(3) },
      { cardId: BigInt(4), count: BigInt(3) }, { cardId: BigInt(14), count: BigInt(3) },
      { cardId: BigInt(15), count: BigInt(3) }, { cardId: BigInt(17), count: BigInt(3) },
      { cardId: BigInt(21), count: BigInt(3) }, { cardId: BigInt(10), count: BigInt(3) },
    ],
    createdAt: T(30), updatedAt: T(2),
  },
  {
    id: BigInt(2), gameId: GAME_ID, name: "Aggro Rush",
    ownerId: OWNER_PRINCIPAL, isStarterDeck: false, isPublished: true,
    cards: [
      { cardId: BigInt(1), count: BigInt(3) }, { cardId: BigInt(2), count: BigInt(3) },
      { cardId: BigInt(7), count: BigInt(3) }, { cardId: BigInt(14), count: BigInt(3) },
      { cardId: BigInt(15), count: BigInt(2) }, { cardId: BigInt(19), count: BigInt(3) },
      { cardId: BigInt(21), count: BigInt(3) },
    ],
    createdAt: T(20), updatedAt: T(5),
  },
  {
    id: BigInt(3), gameId: GAME_ID, name: "Control Wall",
    ownerId: OWNER_PRINCIPAL, isStarterDeck: false, isPublished: true,
    cards: [
      { cardId: BigInt(5), count: BigInt(3) }, { cardId: BigInt(10), count: BigInt(3) },
      { cardId: BigInt(16), count: BigInt(2) }, { cardId: BigInt(17), count: BigInt(3) },
      { cardId: BigInt(18), count: BigInt(3) }, { cardId: BigInt(20), count: BigInt(3) },
      { cardId: BigInt(23), count: BigInt(3) }, { cardId: BigInt(22), count: BigInt(2) },
      { cardId: BigInt(24), count: BigInt(2) },
    ],
    createdAt: T(18), updatedAt: T(4),
  },
  {
    id: BigInt(4), gameId: GAME_ID, name: "Midrange Value",
    ownerId: OWNER_PRINCIPAL, isStarterDeck: false, isPublished: true,
    cards: [
      { cardId: BigInt(2), count: BigInt(2) }, { cardId: BigInt(4), count: BigInt(3) },
      { cardId: BigInt(6), count: BigInt(3) }, { cardId: BigInt(8), count: BigInt(3) },
      { cardId: BigInt(9), count: BigInt(2) }, { cardId: BigInt(11), count: BigInt(2) },
      { cardId: BigInt(15), count: BigInt(3) }, { cardId: BigInt(17), count: BigInt(2) },
      { cardId: BigInt(21), count: BigInt(2) },
    ],
    createdAt: T(15), updatedAt: T(3),
  },
  {
    id: BigInt(5), gameId: GAME_ID, name: "Burn Storm",
    ownerId: OWNER_PRINCIPAL, isStarterDeck: false, isPublished: true,
    cards: [
      { cardId: BigInt(14), count: BigInt(3) }, { cardId: BigInt(15), count: BigInt(3) },
      { cardId: BigInt(16), count: BigInt(3) }, { cardId: BigInt(17), count: BigInt(3) },
      { cardId: BigInt(20), count: BigInt(3) }, { cardId: BigInt(1), count: BigInt(2) },
      { cardId: BigInt(7), count: BigInt(3) },
    ],
    createdAt: T(12), updatedAt: T(2),
  },
  {
    id: BigInt(6), gameId: GAME_ID, name: "Ramp Titan",
    ownerId: OWNER_PRINCIPAL, isStarterDeck: false, isPublished: true,
    cards: [
      { cardId: BigInt(21), count: BigInt(3) }, { cardId: BigInt(22), count: BigInt(3) },
      { cardId: BigInt(3), count: BigInt(2) }, { cardId: BigInt(11), count: BigInt(3) },
      { cardId: BigInt(12), count: BigInt(3) }, { cardId: BigInt(13), count: BigInt(3) },
      { cardId: BigInt(17), count: BigInt(3) },
    ],
    createdAt: T(10), updatedAt: T(1),
  },
];
const MOCK_DECK = MOCK_DECKS[0];

// ---------------------------------------------------------------------------
// PLAYERS — 6 profiles
// ---------------------------------------------------------------------------
const MOCK_PLAYERS: import("../backend").PlayerAccount[] = [
  { principal: OWNER_PRINCIPAL, gameId: GAME_ID, role: Role.Owner, username: "Alex R.",
    joinedAt: T(60), record: { gamesPlayed: BigInt(42), wins: BigInt(28), losses: BigInt(14) } },
  { principal: P2, gameId: GAME_ID, role: Role.Player, username: "Orion",
    joinedAt: T(45), record: { gamesPlayed: BigInt(31), wins: BigInt(19), losses: BigInt(12) } },
  { principal: P3, gameId: GAME_ID, role: Role.Player, username: "Mira Voss",
    joinedAt: T(38), record: { gamesPlayed: BigInt(24), wins: BigInt(11), losses: BigInt(13) } },
  { principal: P4, gameId: GAME_ID, role: Role.Player, username: "Dax",
    joinedAt: T(21), record: { gamesPlayed: BigInt(9), wins: BigInt(4), losses: BigInt(5) } },
  { principal: P5, gameId: GAME_ID, role: Role.Playtester, username: "Nova (Tester)",
    joinedAt: T(14), record: { gamesPlayed: BigInt(17), wins: BigInt(10), losses: BigInt(7) } },
  { principal: P6, gameId: GAME_ID, role: Role.CoDesigner, username: "Elara C.",
    joinedAt: T(55), record: { gamesPlayed: BigInt(8), wins: BigInt(5), losses: BigInt(3) } },
];
const MOCK_PLAYER = MOCK_PLAYERS[0];
const MOCK_PLAYER_2 = MOCK_PLAYERS[1];

// ---------------------------------------------------------------------------
// COMPLETED GAMES — 8 results for dashboard / history / leaderboard
// ---------------------------------------------------------------------------
const MOCK_COMPLETED_GAMES: import("../backend").GameResult[] = [
  { winnerId: OWNER_PRINCIPAL, loserId: P2, endCondition: EndCondition.HealthZero, finalTurn: BigInt(18), completedAt: T(1) },
  { winnerId: P2, loserId: P3, endCondition: EndCondition.HealthZero, finalTurn: BigInt(22), completedAt: T(3) },
  { winnerId: OWNER_PRINCIPAL, loserId: P3, endCondition: EndCondition.Concede, finalTurn: BigInt(14), completedAt: T(5) },
  { winnerId: P3, loserId: P4, endCondition: EndCondition.HealthZero, finalTurn: BigInt(25), completedAt: T(7) },
  { winnerId: P5, loserId: OWNER_PRINCIPAL, endCondition: EndCondition.HealthZero, finalTurn: BigInt(20), completedAt: T(9) },
  { winnerId: P4, loserId: P2, endCondition: EndCondition.Forfeit, finalTurn: BigInt(11), completedAt: T(12) },
  { winnerId: P2, loserId: P5, endCondition: EndCondition.HealthZero, finalTurn: BigInt(17), completedAt: T(15) },
  { winnerId: OWNER_PRINCIPAL, loserId: P6, endCondition: EndCondition.HealthZero, finalTurn: BigInt(19), completedAt: T(20) },
];

// Card win rate stats derived from completed games (top 5 most played cards)
const CARD_WIN_RATES: import("../backend").CardUsageStat[] = [
  { cardId: BigInt(15), uses: BigInt(24), wins: BigInt(16) },  // Arc Lightning — high use, solid win rate
  { cardId: BigInt(4), uses: BigInt(22), wins: BigInt(13) },   // Shadowmere Drake
  { cardId: BigInt(11), uses: BigInt(19), wins: BigInt(14) },  // Stormcaller Elemental — strong
  { cardId: BigInt(21), uses: BigInt(18), wins: BigInt(9) },   // Mana Siphon — average
  { cardId: BigInt(14), uses: BigInt(16), wins: BigInt(7) },   // Cinder Bolt — underperforming
];

const MOCK_INVITE_LINK: import("../backend").InviteLink = {
  code: "AURA-7742",
  gameId: GAME_ID,
  createdBy: OWNER_PRINCIPAL,
  usedBy: [],
};

// ---------------------------------------------------------------------------
// GAME SESSION — Turn 5, Combat phase, vivid mid-game state
// ---------------------------------------------------------------------------
const MOCK_GAME_SESSION: import("../backend").GameSession = {
  id: BigInt(1),
  gameId: GAME_ID,
  hostId: OWNER_PRINCIPAL,
  guestId: P2,
  inviteCode: "AURA-7742",
  startedAt: NOW - BigInt(900_000_000_000),
  log: [
    { actionType: "draw", description: "Alex drew Shadowmere Drake", actorId: OWNER_PRINCIPAL.toText(), timestamp: NOW - BigInt(800_000_000_000) },
    { actionType: "play", description: "Alex played Mana Siphon", actorId: OWNER_PRINCIPAL.toText(), timestamp: NOW - BigInt(750_000_000_000) },
    { actionType: "draw", description: "Orion drew Arc Lightning", actorId: P2.toText(), timestamp: NOW - BigInt(700_000_000_000) },
    { actionType: "play", description: "Orion played Thornback Scout", actorId: P2.toText(), timestamp: NOW - BigInt(650_000_000_000) },
    { actionType: "play", description: "Alex played Shadowmere Drake", actorId: OWNER_PRINCIPAL.toText(), timestamp: NOW - BigInt(600_000_000_000) },
    { actionType: "combat", description: "Shadowmere Drake attacked — dealt 2 damage", actorId: OWNER_PRINCIPAL.toText(), timestamp: NOW - BigInt(550_000_000_000) },
    { actionType: "play", description: "Orion played Verdant Healer", actorId: P2.toText(), timestamp: NOW - BigInt(500_000_000_000) },
    { actionType: "play", description: "Alex played Galewind Hawk", actorId: OWNER_PRINCIPAL.toText(), timestamp: NOW - BigInt(450_000_000_000) },
    { actionType: "play", description: "Orion played Iron Warden", actorId: P2.toText(), timestamp: NOW - BigInt(400_000_000_000) },
    { actionType: "combat", description: "Galewind Hawk attacked — Orion blocked with Thornback Scout", actorId: OWNER_PRINCIPAL.toText(), timestamp: NOW - BigInt(350_000_000_000) },
  ],
  state: {
    status: GameStatus.InProgress,
    turn: BigInt(5),
    activePlayerId: OWNER_PRINCIPAL,
    phase: GamePhase.Combat,
    combatSubPhase: { __kind__: "DeclaringAttackers" as const, DeclaringAttackers: null },
    playerStates: [
      {
        playerId: OWNER_PRINCIPAL,
        hand: [BigInt(15), BigInt(21), BigInt(19)],
        playArea: [
          { instanceId: BigInt(1), cardId: BigInt(4), baseAttack: BigInt(2), baseDefense: BigInt(2), tempBuffAttack: BigInt(0), tempBuffDefense: BigInt(0), tapped: false, summonSick: false },
          { instanceId: BigInt(2), cardId: BigInt(6), baseAttack: BigInt(3), baseDefense: BigInt(2), tempBuffAttack: BigInt(0), tempBuffDefense: BigInt(0), tapped: false, summonSick: false },
          { instanceId: BigInt(3), cardId: BigInt(8), baseAttack: BigInt(4), baseDefense: BigInt(3), tempBuffAttack: BigInt(0), tempBuffDefense: BigInt(0), tapped: false, summonSick: true },
        ],
        library: [BigInt(12), BigInt(17), BigInt(11), BigInt(23), BigInt(16)],
        graveyard: [
          { instanceId: BigInt(10), cardId: BigInt(14), baseAttack: BigInt(0), baseDefense: BigInt(0), tempBuffAttack: BigInt(0), tempBuffDefense: BigInt(0), tapped: false, summonSick: false },
          { instanceId: BigInt(11), cardId: BigInt(21), baseAttack: BigInt(0), baseDefense: BigInt(0), tempBuffAttack: BigInt(0), tempBuffDefense: BigInt(0), tapped: false, summonSick: false },
        ],
        resources: [["Mana", BigInt(3)]],
        health: BigInt(15),
        hasPlayedResource: false,
        mulliganState: { taken: false },
      },
      {
        playerId: P2,
        hand: [BigInt(15), BigInt(17), BigInt(20), BigInt(18)],
        playArea: [
          { instanceId: BigInt(4), cardId: BigInt(3), baseAttack: BigInt(1), baseDefense: BigInt(3), tempBuffAttack: BigInt(0), tempBuffDefense: BigInt(0), tapped: true, summonSick: false },
          { instanceId: BigInt(5), cardId: BigInt(5), baseAttack: BigInt(2), baseDefense: BigInt(5), tempBuffAttack: BigInt(0), tempBuffDefense: BigInt(1), tapped: false, summonSick: false },
          { instanceId: BigInt(6), cardId: BigInt(2), baseAttack: BigInt(2), baseDefense: BigInt(2), tempBuffAttack: BigInt(0), tempBuffDefense: BigInt(0), tapped: false, summonSick: false },
        ],
        library: [BigInt(10), BigInt(9), BigInt(22), BigInt(24)],
        graveyard: [
          { instanceId: BigInt(12), cardId: BigInt(19), baseAttack: BigInt(0), baseDefense: BigInt(0), tempBuffAttack: BigInt(0), tempBuffDefense: BigInt(0), tapped: false, summonSick: false },
          { instanceId: BigInt(13), cardId: BigInt(2), baseAttack: BigInt(2), baseDefense: BigInt(2), tempBuffAttack: BigInt(0), tempBuffDefense: BigInt(0), tapped: false, summonSick: false },
          { instanceId: BigInt(14), cardId: BigInt(14), baseAttack: BigInt(0), baseDefense: BigInt(0), tempBuffAttack: BigInt(0), tempBuffDefense: BigInt(0), tapped: false, summonSick: false },
        ],
        resources: [["Mana", BigInt(2)]],
        health: BigInt(12),
        hasPlayedResource: true,
        mulliganState: { taken: true },
      },
    ],
  },
};

export const mockBackend: backendInterface = {
  concedeGame: async () => ({
    __kind__: "ok",
    ok: MOCK_GAME_SESSION,
  }),

  createCard: async (req) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(Math.floor(Math.random() * 1000) + 100),
      gameId: GAME_ID,
      name: req.name,
      cardType: req.cardType,
      cost: req.cost,
      attack: req.attack,
      defense: req.defense,
      rulesText: req.rulesText,
      flavourText: req.flavourText,
      abilities: req.abilities,
      tags: req.tags,
      artUrl: req.artUrl,
      createdAt: NOW,
      updatedAt: NOW,
    },
  }),

  createDeck: async (gameId, name, cards) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(Math.floor(Math.random() * 1000) + 10),
      gameId,
      name,
      cards,
      ownerId: OWNER_PRINCIPAL,
      isStarterDeck: false,
      isPublished: false,
      createdAt: NOW,
      updatedAt: NOW,
    },
  }),

  createGame: async (name) => ({
    __kind__: "ok",
    ok: { ...MOCK_GAME, name },
  }),

  createGameSession: async () => MOCK_GAME_SESSION,

  createInviteLink: async () => MOCK_INVITE_LINK,

  assignBlockers: async () => ({ __kind__: "ok", ok: MOCK_GAME_SESSION }),

  declareAttackers: async () => ({ __kind__: "ok", ok: MOCK_GAME_SESSION }),

  discardCard: async () => ({ __kind__: "ok", ok: MOCK_GAME_SESSION }),

  deleteCard: async () => ({ __kind__: "ok", ok: null }),

  deleteDeck: async () => ({ __kind__: "ok", ok: null }),

  drawCard: async () => ({ __kind__: "ok", ok: MOCK_GAME_SESSION }),

  endPhase: async () => ({ __kind__: "ok", ok: MOCK_GAME_SESSION }),

  getCard: async (id) => MOCK_CARDS.find((c) => c.id === id) ?? null,

  getDeck: async (id) => MOCK_DECKS.find((d) => d.id === id) ?? null,

  getGame: async () => MOCK_GAME,

  getGameLog: async () => MOCK_GAME_SESSION.log,

  getDashboardData: async () => ({
    playerCount: BigInt(MOCK_PLAYERS.length),
    cardCount: BigInt(MOCK_CARDS.length),
    stats: {
      gamesPlayed: BigInt(MOCK_COMPLETED_GAMES.length),
      activePlayers: BigInt(4),
      cardWinRates: CARD_WIN_RATES,
      recentGames: MOCK_COMPLETED_GAMES.slice(0, 5),
    },
  }),

  getGameSession: async () => MOCK_GAME_SESSION,

  getGameStats: async () => ({
    gamesPlayed: BigInt(MOCK_COMPLETED_GAMES.length),
    activePlayers: BigInt(4),
    cardWinRates: CARD_WIN_RATES,
    recentGames: MOCK_COMPLETED_GAMES.slice(0, 5),
  }),

  getInviteLink: async () => MOCK_INVITE_LINK,

  getPlayer: async () => MOCK_PLAYER,

  initGameState: async () => MOCK_GAME_SESSION,

  joinGameSession: async () => ({ __kind__: "ok", ok: MOCK_GAME_SESSION }),

  listCards: async () => MOCK_CARDS,

  listDecks: async () => MOCK_DECKS,

  listInviteLinks: async () => [MOCK_INVITE_LINK],

  listPlayers: async () => MOCK_PLAYERS,

  playCard: async () => ({ __kind__: "ok", ok: MOCK_GAME_SESSION }),

  publishGame: async (visibility) => ({
    __kind__: "ok",
    ok: { ...MOCK_GAME, visibility },
  }),

  registerPlayer: async (principal, gameId, role, username) => ({
    principal,
    gameId,
    role,
    username: username ?? undefined,
    joinedAt: NOW,
    record: { gamesPlayed: BigInt(0), wins: BigInt(0), losses: BigInt(0) },
  }),

  setStarterDeck: async () => ({ __kind__: "ok", ok: null }),

  takeMulligan: async () => ({ __kind__: "ok", ok: MOCK_GAME_SESSION }),

  unpublishGame: async () => ({
    __kind__: "ok",
    ok: { ...MOCK_GAME, publishedAt: undefined },
  }),

  updateCard: async (id, req) => {
    const card = MOCK_CARDS.find((c) => c.id === id);
    if (!card) return { __kind__: "err", err: "Card not found" };
    return {
      __kind__: "ok",
      ok: {
        ...card,
        ...Object.fromEntries(
          Object.entries(req).filter(([, v]) => v !== undefined && v !== null)
        ),
        updatedAt: NOW,
      },
    };
  },

  updateDeck: async (id, name, cards) => ({
    __kind__: "ok",
    ok: {
      ...MOCK_DECK,
      id,
      name: name ?? MOCK_DECK.name,
      cards: cards ?? MOCK_DECK.cards,
      updatedAt: NOW,
    },
  }),

  updateGame: async (updates) => ({
    __kind__: "ok",
    ok: { ...MOCK_GAME, ...updates, updatedAt: NOW },
  }),

  updatePlayerRecord: async () => undefined,

  updatePlayerRole: async (targetPrincipal, newRole) => ({
    __kind__: "ok",
    ok: { ...MOCK_PLAYER, principal: targetPrincipal, role: newRole },
  }),

  updateWizardStep: async (_step) => ({ __kind__: "ok", ok: null }),

  saveGameVersion: async (_description) => undefined,

  getGameVersionHistory: async () => [
    {
      timestamp: NOW - BigInt(3_600_000_000_000),
      description: "Initial version",
      gameDefinition: MOCK_GAME,
    },
  ],

  useAbility: async () => ({ __kind__: "ok", ok: MOCK_GAME_SESSION }),

  useInviteLink: async (code) => ({ __kind__: "ok", ok: { ...MOCK_INVITE_LINK, code } }),

  validateDeck: async (_, cards) => ({
    deckSize: cards.reduce((acc, c) => acc + c.count, BigInt(0)),
    errors: [],
    isValid: true,
  }),
};
