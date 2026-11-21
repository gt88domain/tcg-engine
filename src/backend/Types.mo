module {

  // ── Primitive aliases ────────────────────────────────────────────────────────

  public type GameId            = Nat;
  public type CardId            = Nat;
  public type DeckId            = Nat;
  public type UserId            = Principal;
  public type GameSessionId     = Nat;
  public type Timestamp         = Int; // nanoseconds from Time.now()

  // ── Ability sub-types ────────────────────────────────────────────────────────

  public type AbilityTrigger = {
    #EnterPlay;
    #Attacks;
    #DealsDamage;
    #StartOfTurn;
    #EndOfTurn;
    #Destroyed;
    #Activated;
    #Passive;
  };

  public type AbilityTarget = {
    #TargetCreature;
    #TargetPlayer;
    #AllCreatures;
    #AllOpponentCreatures;
    #AllYourCreatures;
    #Opponent;
    #You;
    #ThisCard;
    #NoTarget;
  };

  public type AbilityEffect = {
    #DealDamage         : Nat;
    #HealLife           : Nat;
    #DrawCards          : Nat;
    #GainResources      : Nat;
    #StatBoostUntilEOT  : (Int, Int);
    #StatReduceUntilEOT : (Int, Int);
    #Destroy;
    #ReturnToHand;
    #Counter;
    #GiveKeyword        : Text;
    #CustomEffect       : Text;
  };

  public type Ability = {
    id            : Nat;
    name          : Text;
    abilityType   : { #structured; #freeform };
    trigger       : ?AbilityTrigger;
    targets       : [AbilityTarget];
    effects       : [AbilityEffect];
    conditionText : ?Text;
    rulesText     : ?Text;
  };

  // ── Card ─────────────────────────────────────────────────────────────────────

  public type Card = {
    id          : CardId;
    gameId      : GameId;
    name        : Text;
    cost        : Nat;
    attack      : ?Nat;
    defense     : ?Nat;
    cardType    : Text;
    tags        : [Text];
    abilities   : [Ability];
    rulesText   : ?Text;
    flavourText : ?Text;
    artUrl      : ?Text;
    createdAt   : Timestamp;
    updatedAt   : Timestamp;
  };

  // ── Deck ─────────────────────────────────────────────────────────────────────

  public type DeckEntry = {
    cardId : CardId;
    count  : Nat;
  };

  public type Deck = {
    id             : DeckId;
    gameId         : GameId;
    ownerId        : UserId;
    name           : Text;
    cards          : [DeckEntry];
    isStarterDeck  : Bool;
    isPublished    : Bool;
    createdAt      : Timestamp;
    updatedAt      : Timestamp;
  };

  public type DeckValidation = {
    isValid  : Bool;
    errors   : [Text];
    deckSize : Nat;
  };

  // ── Role & Player ─────────────────────────────────────────────────────────────

  public type Role = {
    #Owner;
    #CoDesigner;
    #Playtester;
    #Player;
    #Spectator;
  };

  public type PlayerRecord = {
    wins        : Nat;
    losses      : Nat;
    gamesPlayed : Nat;
  };

  public type PlayerAccount = {
    principal : UserId;
    gameId    : GameId;
    role      : Role;
    username  : ?Text;
    record    : PlayerRecord;
    joinedAt  : Timestamp;
  };

  // ── Game definition (Resource+Combat template) ────────────────────────────────────

  // Legacy resource type kept for backward compat with PlayEngine
  public type ResourceType = {
    name    : Text;
    genRate : Nat;
    cap     : Nat;
  };

  // New structured resource system
  public type ResourceSystem = {
    resourceName       : Text;
    resourcesPerTurn   : Nat;
    maxHandSize        : Nat;
    startingLife       : Nat;
    deckSizeMin        : Nat;
    deckSizeMax        : Nat;
    copiesPerCardLimit : Nat;
  };

  // Card type definition
  public type CardTypeDefinition = {
    id          : Text;
    name        : Text;
    staysInPlay : Bool;
  };

  // Keyword definition
  public type KeywordDefinition = {
    id               : Text;
    name             : Text;
    rulesDescription : Text;
  };

  // Turn phase
  public type TurnPhase = {
    id          : Text;
    name        : Text;
    description : Text;
    order       : Nat;
  };

  // Win condition
  public type WinCondition = {
    #LifeToZero;
    #DeckOut;
    #Custom : Text;
  };

  public type GamePhase = {
    #Start;
    #Draw;
    #Main;
    #Combat;
    #End;
  };

  public type TurnStructure = {
    phases : [GamePhase];
  };

  public type GameVisibility = {
    #Private;
    #InviteOnly;
    #Open;
  };

  public type GameDefinition = {
    id                  : GameId;
    // Game identity
    gameName            : Text;
    gameDescription     : Text;
    themeColor          : Text;
    gameIcon            : Text;
    // Legacy name field kept for backward compat
    name                : Text;
    designerPrincipal   : UserId;
    // New structured resource system
    resourceSystem      : ResourceSystem;
    // New card type definitions
    cardTypeDefinitions : [CardTypeDefinition];
    // Legacy card types list
    cardTypes           : [Text];
    // Keywords
    keywords            : [KeywordDefinition];
    // Win conditions (multiple)
    winConditions       : [WinCondition];
    // Turn phases
    turnPhases          : [TurnPhase];
    // Legacy turn structure
    turnStructure       : TurnStructure;
    visibility          : GameVisibility;
    publishedAt         : ?Timestamp;
    version             : Nat;
    // Wizard step: 0=not started, 5=complete
    wizardStep          : Nat;
    createdAt           : Timestamp;
    updatedAt           : Timestamp;
  };

  // Game version snapshot
  public type GameVersionSnapshot = {
    timestamp      : Timestamp;
    description    : Text;
    gameDefinition : GameDefinition;
  };

  /// Tracks which step of the two-phase combat we are in.
  public type CombatSubPhase = {
    #Idle;                           // not in combat
    #DeclaringAttackers;             // active player has committed attackers
    #AssigningBlockers : {
      attackers : [Nat];             // instanceIds committed by active player
    };
  };

  // ── Mulligan ─────────────────────────────────────────────────────────────────

  public type MulliganState = {
    taken : Bool;
  };

  // ── Game stats ───────────────────────────────────────────────────────────────

  public type CardUsageStat = {
    cardId : CardId;
    uses   : Nat;
    wins   : Nat;
  };

  public type GameStats = {
    gamesPlayed   : Nat;
    activePlayers : Nat;
    recentGames   : [GameResult];
    cardWinRates  : [CardUsageStat];
  };

  public type DashboardData = {
    stats        : GameStats;
    playerCount  : Nat;
    cardCount    : Nat;
  };

  // ── Live game session ─────────────────────────────────────────────────────────────

  public type CardInPlay = {
    instanceId       : Nat;
    cardId           : CardId;
    baseAttack       : Nat;   // snapshot of card.attack at time of play (0 if none)
    baseDefense      : Nat;   // snapshot of card.defense at time of play (0 if none)
    tapped           : Bool;
    summonSick       : Bool;
    tempBuffAttack   : Int;
    tempBuffDefense  : Int;
  };

  public type PlayerGameState = {
    playerId         : UserId;
    health           : Nat;
    resources        : [(Text, Nat)];
    hand             : [CardId];
    library          : [CardId];  // remaining draw pile; index 0 = top of deck
    playArea         : [CardInPlay];
    graveyard        : [CardInPlay]; // destroyed and discarded cards
    hasPlayedResource: Bool;
    mulliganState    : MulliganState;
  };

  public type GameStatus = {
    #WaitingForPlayer;
    #InProgress;
    #Completed;
    #Abandoned;
  };

  public type GameState = {
    phase           : GamePhase;
    activePlayerId  : UserId;
    turn            : Nat;
    playerStates    : [PlayerGameState];
    status          : GameStatus;
    combatSubPhase  : CombatSubPhase;
  };

  public type GameLogEntry = {
    timestamp     : Timestamp;
    actionType    : Text;
    actorId       : ?Text;
    targetId      : ?Text;
    description   : Text;
    phaseSnapshot : ?GamePhase;
  };

  public type EndCondition = {
    #HealthZero;
    #Concede;
    #Forfeit;
  };

  public type GameResult = {
    winnerId     : UserId;
    loserId      : UserId;
    endCondition : EndCondition;
    finalTurn    : Nat;
    completedAt  : Timestamp;
  };

  public type GameSession = {
    id          : GameSessionId;
    gameId      : GameId;
    hostId      : UserId;
    guestId     : ?UserId;
    state       : GameState;
    inviteCode  : Text;
    startedAt   : ?Timestamp;
    endedAt     : ?Timestamp;
    result      : ?GameResult;
    log         : [GameLogEntry];
  };

  // ── Invite links ─────────────────────────────────────────────────────────────

  public type InviteLink = {
    code      : Text;
    gameId    : GameId;
    createdBy : UserId;
    expiresAt : ?Timestamp;
    usedBy    : [Text];  // principals as text for shareability
  };

};
