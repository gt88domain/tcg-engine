import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type DeckId = bigint;
export type Timestamp = bigint;
export interface Card {
    id: CardId;
    cardType: string;
    cost: bigint;
    name: string;
    createdAt: Timestamp;
    tags: Array<string>;
    gameId: GameId;
    flavourText?: string;
    rulesText?: string;
    updatedAt: Timestamp;
    defense?: bigint;
    artUrl?: string;
    abilities: Array<Ability>;
    attack?: bigint;
}
export interface MulliganState {
    taken: boolean;
}
export interface GameVersionSnapshot {
    description: string;
    gameDefinition: GameDefinition;
    timestamp: Timestamp;
}
export interface CardInPlay {
    tempBuffDefense: bigint;
    instanceId: bigint;
    tapped: boolean;
    tempBuffAttack: bigint;
    baseAttack: bigint;
    cardId: CardId;
    summonSick: boolean;
    baseDefense: bigint;
}
export type WinCondition = {
    __kind__: "Custom";
    Custom: string;
} | {
    __kind__: "LifeToZero";
    LifeToZero: null;
} | {
    __kind__: "DeckOut";
    DeckOut: null;
};
export interface TurnStructure {
    phases: Array<GamePhase>;
}
export interface GameStats {
    gamesPlayed: bigint;
    cardWinRates: Array<CardUsageStat>;
    activePlayers: bigint;
    recentGames: Array<GameResult>;
}
export interface CardTypeDefinition {
    id: string;
    name: string;
    staysInPlay: boolean;
}
export interface ResourceSystem {
    resourcesPerTurn: bigint;
    startingLife: bigint;
    maxHandSize: bigint;
    resourceName: string;
    deckSizeMax: bigint;
    deckSizeMin: bigint;
    copiesPerCardLimit: bigint;
}
export type GameId = bigint;
export interface CardUsageStat {
    uses: bigint;
    wins: bigint;
    cardId: CardId;
}
export type AbilityEffect = {
    __kind__: "CustomEffect";
    CustomEffect: string;
} | {
    __kind__: "StatReduceUntilEOT";
    StatReduceUntilEOT: [bigint, bigint];
} | {
    __kind__: "ReturnToHand";
    ReturnToHand: null;
} | {
    __kind__: "GainResources";
    GainResources: bigint;
} | {
    __kind__: "HealLife";
    HealLife: bigint;
} | {
    __kind__: "DrawCards";
    DrawCards: bigint;
} | {
    __kind__: "StatBoostUntilEOT";
    StatBoostUntilEOT: [bigint, bigint];
} | {
    __kind__: "DealDamage";
    DealDamage: bigint;
} | {
    __kind__: "Counter";
    Counter: null;
} | {
    __kind__: "Destroy";
    Destroy: null;
} | {
    __kind__: "GiveKeyword";
    GiveKeyword: string;
};
export interface Deck {
    id: DeckId;
    isPublished: boolean;
    ownerId: UserId;
    cards: Array<DeckEntry>;
    name: string;
    createdAt: Timestamp;
    gameId: GameId;
    isStarterDeck: boolean;
    updatedAt: Timestamp;
}
export type GameSessionId = bigint;
export interface GameSession {
    id: GameSessionId;
    log: Array<GameLogEntry>;
    result?: GameResult;
    startedAt?: Timestamp;
    endedAt?: Timestamp;
    gameId: GameId;
    state: GameState;
    inviteCode: string;
    hostId: UserId;
    guestId?: UserId;
}
export interface Ability {
    id: bigint;
    trigger?: AbilityTrigger;
    effects: Array<AbilityEffect>;
    name: string;
    conditionText?: string;
    abilityType: Variant_freeform_structured;
    rulesText?: string;
    targets: Array<AbilityTarget>;
}
export interface PlayerGameState {
    playArea: Array<CardInPlay>;
    resources: Array<[string, bigint]>;
    library: Array<CardId>;
    hand: Array<CardId>;
    playerId: UserId;
    mulliganState: MulliganState;
    graveyard: Array<CardInPlay>;
    hasPlayedResource: boolean;
    health: bigint;
}
export interface DeckValidation {
    deckSize: bigint;
    errors: Array<string>;
    isValid: boolean;
}
export interface TurnPhase {
    id: string;
    order: bigint;
    name: string;
    description: string;
}
export type CombatSubPhase = {
    __kind__: "AssigningBlockers";
    AssigningBlockers: {
        attackers: Array<bigint>;
    };
} | {
    __kind__: "Idle";
    Idle: null;
} | {
    __kind__: "DeclaringAttackers";
    DeclaringAttackers: null;
};
export interface DashboardData {
    playerCount: bigint;
    stats: GameStats;
    cardCount: bigint;
}
export interface DeckEntry {
    count: bigint;
    cardId: CardId;
}
export interface GameLogEntry {
    actionType: string;
    description: string;
    actorId?: string;
    phaseSnapshot?: GamePhase;
    timestamp: Timestamp;
    targetId?: string;
}
export interface GameState {
    playerStates: Array<PlayerGameState>;
    status: GameStatus;
    turn: bigint;
    combatSubPhase: CombatSubPhase;
    activePlayerId: UserId;
    phase: GamePhase;
}
export interface PlayerAccount {
    principal: UserId;
    username?: string;
    joinedAt: Timestamp;
    role: Role;
    gameId: GameId;
    record: PlayerRecord;
}
export interface InviteLink {
    expiresAt?: Timestamp;
    code: string;
    usedBy: Array<string>;
    createdBy: UserId;
    gameId: GameId;
}
export interface KeywordDefinition {
    id: string;
    rulesDescription: string;
    name: string;
}
export type UserId = Principal;
export interface GameDefinition {
    id: GameId;
    designerPrincipal: UserId;
    resourceSystem: ResourceSystem;
    name: string;
    createdAt: Timestamp;
    wizardStep: bigint;
    publishedAt?: Timestamp;
    themeColor: string;
    winConditions: Array<WinCondition>;
    cardTypes: Array<string>;
    version: bigint;
    keywords: Array<KeywordDefinition>;
    updatedAt: Timestamp;
    turnStructure: TurnStructure;
    gameDescription: string;
    gameIcon: string;
    gameName: string;
    visibility: GameVisibility;
    cardTypeDefinitions: Array<CardTypeDefinition>;
    turnPhases: Array<TurnPhase>;
}
export interface PlayerRecord {
    gamesPlayed: bigint;
    wins: bigint;
    losses: bigint;
}
export interface GameResult {
    completedAt: Timestamp;
    endCondition: EndCondition;
    winnerId: UserId;
    loserId: UserId;
    finalTurn: bigint;
}
export type CardId = bigint;
export enum AbilityTarget {
    You = "You",
    ThisCard = "ThisCard",
    AllCreatures = "AllCreatures",
    NoTarget = "NoTarget",
    AllOpponentCreatures = "AllOpponentCreatures",
    TargetPlayer = "TargetPlayer",
    AllYourCreatures = "AllYourCreatures",
    Opponent = "Opponent",
    TargetCreature = "TargetCreature"
}
export enum AbilityTrigger {
    DealsDamage = "DealsDamage",
    EndOfTurn = "EndOfTurn",
    Passive = "Passive",
    EnterPlay = "EnterPlay",
    Destroyed = "Destroyed",
    StartOfTurn = "StartOfTurn",
    Activated = "Activated",
    Attacks = "Attacks"
}
export enum EndCondition {
    HealthZero = "HealthZero",
    Forfeit = "Forfeit",
    Concede = "Concede"
}
export enum GamePhase {
    End = "End",
    Start = "Start",
    Draw = "Draw",
    Main = "Main",
    Combat = "Combat"
}
export enum GameStatus {
    Abandoned = "Abandoned",
    WaitingForPlayer = "WaitingForPlayer",
    InProgress = "InProgress",
    Completed = "Completed"
}
export enum GameVisibility {
    Open = "Open",
    Private = "Private",
    InviteOnly = "InviteOnly"
}
export enum Role {
    CoDesigner = "CoDesigner",
    Playtester = "Playtester",
    Player = "Player",
    Spectator = "Spectator",
    Owner = "Owner"
}
export enum Variant_freeform_structured {
    freeform = "freeform",
    structured = "structured"
}
export interface backendInterface {
    assignBlockers(sessionId: GameSessionId, blockingInstanceIds: Array<bigint>): Promise<{
        __kind__: "ok";
        ok: GameSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
    concedeGame(sessionId: GameSessionId): Promise<{
        __kind__: "ok";
        ok: GameSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createCard(req: {
        cardType: string;
        cost: bigint;
        name: string;
        tags: Array<string>;
        flavourText?: string;
        rulesText?: string;
        defense?: bigint;
        artUrl?: string;
        abilities: Array<Ability>;
        attack?: bigint;
    }): Promise<{
        __kind__: "ok";
        ok: Card;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createDeck(gameId: GameId, name: string, cards: Array<DeckEntry>): Promise<{
        __kind__: "ok";
        ok: Deck;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createGame(name: string, theme: string): Promise<{
        __kind__: "ok";
        ok: GameDefinition;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createGameSession(gameId: GameId, inviteCode: string): Promise<GameSession>;
    createInviteLink(gameId: GameId): Promise<InviteLink>;
    declareAttackers(sessionId: GameSessionId, attackerIndices: Array<bigint>): Promise<{
        __kind__: "ok";
        ok: GameSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteCard(id: CardId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteDeck(id: DeckId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    discardCard(sessionId: GameSessionId, handIndex: bigint): Promise<{
        __kind__: "ok";
        ok: GameSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
    drawCard(sessionId: GameSessionId): Promise<{
        __kind__: "ok";
        ok: GameSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
    endPhase(sessionId: GameSessionId): Promise<{
        __kind__: "ok";
        ok: GameSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCard(id: CardId): Promise<Card | null>;
    getDashboardData(): Promise<DashboardData>;
    getDeck(id: DeckId): Promise<Deck | null>;
    getGame(): Promise<GameDefinition | null>;
    getGameLog(sessionId: GameSessionId): Promise<Array<GameLogEntry>>;
    getGameSession(sessionId: GameSessionId): Promise<GameSession | null>;
    getGameStats(): Promise<GameStats>;
    getGameVersionHistory(): Promise<Array<GameVersionSnapshot>>;
    getInviteLink(code: string): Promise<InviteLink | null>;
    getPlayer(principal: Principal): Promise<PlayerAccount | null>;
    initGameState(sessionId: GameSessionId, hostDeckCards: Array<Card>, guestDeckCards: Array<Card>, gameDefinition: GameDefinition): Promise<GameSession>;
    joinGameSession(sessionId: GameSessionId): Promise<{
        __kind__: "ok";
        ok: GameSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
    listCards(gameId: GameId): Promise<Array<Card>>;
    listDecks(ownerId: UserId | null, gameId: GameId): Promise<Array<Deck>>;
    listInviteLinks(gameId: GameId): Promise<Array<InviteLink>>;
    listPlayers(gameId: GameId): Promise<Array<PlayerAccount>>;
    playCard(sessionId: GameSessionId, cardId: CardId, card: Card): Promise<{
        __kind__: "ok";
        ok: GameSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
    publishGame(visibility: GameVisibility): Promise<{
        __kind__: "ok";
        ok: GameDefinition;
    } | {
        __kind__: "err";
        err: string;
    }>;
    registerPlayer(principal: Principal, gameId: GameId, role: Role, username: string | null): Promise<PlayerAccount>;
    saveGameVersion(description: string): Promise<void>;
    setStarterDeck(id: DeckId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    takeMulligan(sessionId: GameSessionId): Promise<{
        __kind__: "ok";
        ok: GameSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
    unpublishGame(): Promise<{
        __kind__: "ok";
        ok: GameDefinition;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateCard(id: CardId, req: {
        cardType?: string;
        cost?: bigint;
        name?: string;
        tags?: Array<string>;
        flavourText?: string | null;
        rulesText?: string | null;
        defense?: bigint | null;
        artUrl?: string | null;
        abilities?: Array<Ability>;
        attack?: bigint | null;
    }): Promise<{
        __kind__: "ok";
        ok: Card;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateDeck(id: DeckId, name: string | null, cards: Array<DeckEntry> | null): Promise<{
        __kind__: "ok";
        ok: Deck;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateGame(updates: {
        resourceSystem?: ResourceSystem;
        wizardStep?: bigint;
        themeColor?: string;
        winConditions?: Array<WinCondition>;
        keywords?: Array<KeywordDefinition>;
        gameDescription?: string;
        gameIcon?: string;
        gameName?: string;
        cardTypeDefinitions?: Array<CardTypeDefinition>;
        turnPhases?: Array<TurnPhase>;
    }): Promise<{
        __kind__: "ok";
        ok: GameDefinition;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updatePlayerRecord(principal: Principal, won: boolean): Promise<void>;
    updatePlayerRole(targetPrincipal: Principal, newRole: Role): Promise<{
        __kind__: "ok";
        ok: PlayerAccount;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateWizardStep(step: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    useAbility(sessionId: GameSessionId, sourceInstanceId: bigint, abilityId: bigint, targetInstanceId: bigint | null, effects: Array<AbilityEffect>): Promise<{
        __kind__: "ok";
        ok: GameSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
    useInviteLink(code: string): Promise<{
        __kind__: "ok";
        ok: InviteLink;
    } | {
        __kind__: "err";
        err: string;
    }>;
    validateDeck(gameId: GameId, cards: Array<DeckEntry>): Promise<DeckValidation>;
}
