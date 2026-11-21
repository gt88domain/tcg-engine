import type {
  Ability,
  AbilityEffect,
  AbilityTarget,
  AbilityTrigger,
  Card,
  CardId,
  CardInPlay,
  CardTypeDefinition,
  Deck,
  DeckEntry,
  DeckId,
  DeckValidation,
  EndCondition,
  GameDefinition,
  GameId,
  GameLogEntry,
  GamePhase,
  GameResult,
  GameSession,
  GameSessionId,
  GameState,
  GameStatus,
  GameVersionSnapshot,
  GameVisibility,
  InviteLink,
  KeywordDefinition,
  PlayerAccount,
  PlayerGameState,
  PlayerRecord,
  ResourceSystem,
  Role,
  Timestamp,
  TurnPhase,
  TurnStructure,
  UserId,
  Variant_freeform_structured,
  WinCondition,
} from "./backend.d";

export type {
  Ability,
  AbilityEffect,
  AbilityTarget,
  AbilityTrigger,
  Card,
  CardId,
  CardInPlay,
  CardTypeDefinition,
  Deck,
  DeckEntry,
  DeckId,
  DeckValidation,
  EndCondition,
  GameDefinition,
  GameId,
  GameLogEntry,
  GamePhase,
  GameResult,
  GameSession,
  GameSessionId,
  GameState,
  GameStatus,
  GameVersionSnapshot,
  GameVisibility,
  InviteLink,
  KeywordDefinition,
  PlayerAccount,
  PlayerGameState,
  PlayerRecord,
  ResourceSystem,
  Role,
  Timestamp,
  TurnPhase,
  TurnStructure,
  UserId,
  Variant_freeform_structured,
  WinCondition,
};

/** Deck enriched with resolved Card objects for analysis and display */
export interface DeckWithCards {
  deck: Deck;
  cards: Card[];
  cardMap: Map<CardId, Card>;
}

/** GameSession with display-friendly metadata derived for the UI */
export interface GameSessionView {
  session: GameSession;
  opponentId: UserId | null;
  isHost: boolean;
  myPlayerState: PlayerGameState | null;
  opponentPlayerState: PlayerGameState | null;
  isMyTurn: boolean;
  phase: GamePhase;
  turnNumber: number;
}

/** Sidebar context: which interface context is active */
export type InterfaceContext = "design" | "play" | "browse";

/** Sidebar navigation items */
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  children?: NavItem[];
}

/** Analysis flag severity */
export type AnalysisSeverity = "good" | "warning" | "critical";

/** Card cost curve data point for analysis */
export interface CostCurvePoint {
  cost: number;
  count: number;
}

/** Type distribution data for analysis */
export interface TypeDistribution {
  type: string;
  count: number;
  percentage: number;
}
