import Types "Types";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";

/// Pure game-state machine for the Resource+Combat template.
/// All functions are pure: they take state in, return new state + log entries out.
/// No actor state lives here — state is owned by main.mo.
module {

  // ── Helpers ────────────────────────────────────────────────────────────────

  func botPrincipal() : Principal { Principal.fromText("aaaaa-aa") };

  func logEntry(
    actionType : Text,
    actorId    : ?Text,
    targetId   : ?Text,
    description: Text,
    phase      : ?Types.GamePhase
  ) : Types.GameLogEntry {
    {
      timestamp     = Time.now();
      actionType;
      actorId;
      targetId;
      description;
      phaseSnapshot = phase;
    };
  };

  /// Return the PlayerGameState for `playerId`, trapping if not found.
  func getPlayerState(
    playerStates : [Types.PlayerGameState],
    playerId     : Types.UserId
  ) : Types.PlayerGameState {
    switch (playerStates.find(func(ps) { Principal.equal(ps.playerId, playerId) })) {
      case (?ps) ps;
      case null  Runtime.trap("Player not found in session");
    };
  };

  /// Return the opponent's PlayerGameState, trapping if not found.
  func getOpponentState(
    playerStates : [Types.PlayerGameState],
    playerId     : Types.UserId
  ) : Types.PlayerGameState {
    switch (playerStates.find(func(ps) { not Principal.equal(ps.playerId, playerId) })) {
      case (?ps) ps;
      case null  Runtime.trap("Opponent not found in session");
    };
  };

  /// Replace a single PlayerGameState in the array.
  func replacePlayerState(
    playerStates : [Types.PlayerGameState],
    updated      : Types.PlayerGameState
  ) : [Types.PlayerGameState] {
    playerStates.map(func(ps) {
      if (Principal.equal(ps.playerId, updated.playerId)) updated else ps
    });
  };

  /// Replace both player states at once.
  func replaceAllPlayerStates(
    playerStates : [Types.PlayerGameState],
    updated1     : Types.PlayerGameState,
    updated2     : Types.PlayerGameState
  ) : [Types.PlayerGameState] {
    playerStates.map<Types.PlayerGameState, Types.PlayerGameState>(func(ps) {
      if      (Principal.equal(ps.playerId, updated1.playerId)) updated1
      else if (Principal.equal(ps.playerId, updated2.playerId)) updated2
      else ps
    });
  };

  /// Get a resource amount by name from the resources array.
  func getResource(resources : [(Text, Nat)], name : Text) : Nat {
    switch (resources.find<(Text, Nat)>(func(kv) { kv.0 == name })) {
      case (?(_, v)) v;
      case null      0;
    };
  };

  /// Set a resource by name (upsert).
  func setResource(resources : [(Text, Nat)], name : Text, value : Nat) : [(Text, Nat)] {
    let exists = resources.any(func(kv) { kv.0 == name });
    if (exists) {
      resources.map<(Text, Nat), (Text, Nat)>(func(kv) {
        if (kv.0 == name) (kv.0, value) else kv
      });
    } else {
      resources.concat<(Text, Nat)>([(name, value)]);
    };
  };

  /// Find a CardInPlay by instanceId.
  func findCardInPlay(playArea : [Types.CardInPlay], instanceId : Nat) : ?Types.CardInPlay {
    playArea.find<Types.CardInPlay>(func(c) { c.instanceId == instanceId });
  };

  /// Remove a CardInPlay by instanceId.
  func removeCardFromPlay(playArea : [Types.CardInPlay], instanceId : Nat) : [Types.CardInPlay] {
    playArea.filter<Types.CardInPlay>(func(c) { c.instanceId != instanceId });
  };

  /// Remove first occurrence of a CardId from hand.
  func removeFromHand(hand : [Types.CardId], cardId : Types.CardId) : [Types.CardId] {
    var removed = false;
    hand.filter<Types.CardId>(func(id) {
      if (not removed and id == cardId) { removed := true; false }
      else true
    });
  };

  /// Generate a new instanceId across all player areas.
  func nextInstanceId(playerStates : [Types.PlayerGameState]) : Nat {
    var maxId : Nat = 0;
    for (ps in playerStates.values()) {
      for (c in ps.playArea.values()) {
        if (c.instanceId >= maxId) { maxId := c.instanceId + 1 };
      };
    };
    maxId;
  };

  /// Effective attack: base + temporary buff.
  func effectiveAttack(cip : Types.CardInPlay) : Nat {
    let buff = cip.tempBuffAttack;
    if (buff >= 0) cip.baseAttack + Int.abs(buff)
    else if (Int.abs(buff) >= cip.baseAttack) 0
    else cip.baseAttack - Int.abs(buff);
  };

  /// Effective defense: base + temporary buff.
  func effectiveDefense(cip : Types.CardInPlay) : Nat {
    let buff = cip.tempBuffDefense;
    if (buff >= 0) cip.baseDefense + Int.abs(buff)
    else if (Int.abs(buff) >= cip.baseDefense) 0
    else cip.baseDefense - Int.abs(buff);
  };

  /// Apply buff to a CardInPlay instance in a playArea.
  func applyBuff(
    playArea   : [Types.CardInPlay],
    instanceId : Nat,
    atkBuff    : Int,
    defBuff    : Int
  ) : [Types.CardInPlay] {
    playArea.map<Types.CardInPlay, Types.CardInPlay>(func(c) {
      if (c.instanceId == instanceId) {
        { c with
          tempBuffAttack  = c.tempBuffAttack  + atkBuff;
          tempBuffDefense = c.tempBuffDefense + defBuff;
        }
      } else c
    });
  };

  /// Append a log entry to the session.
  func appendLog(session : Types.GameSession, entry : Types.GameLogEntry) : Types.GameSession {
    { session with log = session.log.concat<Types.GameLogEntry>([entry]) };
  };

  // ── Win condition ────────────────────────────────────────────────────────────

  public func checkWinCondition(
    session        : Types.GameSession,
    gameDefinition : Types.GameDefinition
  ) : ?Types.GameResult {
    let turn = session.state.turn;
    let ps   = session.state.playerStates;
    // Check LifeToZero
    let hasLifeToZero = gameDefinition.winConditions.any(func(wc) { wc == #LifeToZero });
    if (hasLifeToZero) {
      for (p in ps.values()) {
        if (p.health == 0) {
          let opp = getOpponentState(ps, p.playerId);
          return ?{
            winnerId     = opp.playerId;
            loserId      = p.playerId;
            endCondition = #HealthZero;
            finalTurn    = turn;
            completedAt  = Time.now();
          };
        };
      };
    };
    // Check DeckOut
    let hasDeckOut = gameDefinition.winConditions.any(func(wc) { wc == #DeckOut });
    if (hasDeckOut) {
      for (p in ps.values()) {
        if (p.library.size() == 0 and p.hand.size() == 0) {
          let opp = getOpponentState(ps, p.playerId);
          return ?{
            winnerId     = opp.playerId;
            loserId      = p.playerId;
            endCondition = #Forfeit;
            finalTurn    = turn;
            completedAt  = Time.now();
          };
        };
      };
    };
    null;
  };

  // ── Ability resolution ───────────────────────────────────────────────────────

  public func resolveAbilityEffects(
    session          : Types.GameSession,
    actorId          : Types.UserId,
    effects          : [Types.AbilityEffect],
    targetInstanceId : ?Nat
  ) : Types.GameSession {
    var s = session;
    for (effect in effects.values()) {
      let actorState = getPlayerState(s.state.playerStates, actorId);
      let oppState   = getOpponentState(s.state.playerStates, actorId);
      switch (effect) {
        case (#DealDamage amount) {
          let newOpp = { oppState with health = if (oppState.health >= amount) (oppState.health - amount : Nat) else 0 };
          let newPs  = replacePlayerState(s.state.playerStates, newOpp);
          s := { s with state = { s.state with playerStates = newPs } };
          s := appendLog(s, logEntry("dealDamage", ?actorId.toText(), null,
            "Dealt " # amount.toText() # " damage to " # oppState.playerId.toText(), ?s.state.phase));
        };
        case (#HealLife amount) {
          let newActor = { actorState with health = actorState.health + amount };
          let newPs    = replacePlayerState(s.state.playerStates, newActor);
          s := { s with state = { s.state with playerStates = newPs } };
          s := appendLog(s, logEntry("heal", ?actorId.toText(), null,
            "Healed " # amount.toText() # " health", ?s.state.phase));
        };
        case (#GainResources amount) {
          let resName  = "mana";
          let cur      = getResource(actorState.resources, resName);
          let newRes   = setResource(actorState.resources, resName, cur + amount);
          let newActor = { actorState with resources = newRes };
          let newPs    = replacePlayerState(s.state.playerStates, newActor);
          s := { s with state = { s.state with playerStates = newPs } };
          s := appendLog(s, logEntry("gainResource", ?actorId.toText(), null,
            "Gained " # amount.toText() # " resources", ?s.state.phase));
        };
        case (#DrawCards count) {
          var actorMut = actorState;
          for (_ in Nat.range(0, count)) {
            if (actorMut.library.size() > 0) {
              let drawn    = actorMut.library[0];
              let newLib   = actorMut.library.sliceToArray(1, actorMut.library.size());
              let newHand  = actorMut.hand.concat([drawn]);
              actorMut    := { actorMut with library = newLib; hand = newHand };
              s := appendLog(s, logEntry("drawCard", ?actorId.toText(), null,
                actorId.toText() # " drew a card via ability", ?s.state.phase));
            };
          };
          let newPs = replacePlayerState(s.state.playerStates, actorMut);
          s := { s with state = { s.state with playerStates = newPs } };
        };
        case (#Destroy) {
          switch (targetInstanceId) {
            case (?iid) {
              switch (findCardInPlay(oppState.playArea, iid)) {
                case (?cip) {
                  let newOppArea  = removeCardFromPlay(oppState.playArea, iid);
                  let newOppGrave = oppState.graveyard.concat([cip]);
                  let newOpp2     = { oppState with playArea = newOppArea; graveyard = newOppGrave };
                  let newPs       = replacePlayerState(s.state.playerStates, newOpp2);
                  s := { s with state = { s.state with playerStates = newPs } };
                  s := appendLog(s, logEntry("destroyCard", ?actorId.toText(), ?iid.toText(),
                    "Destroyed opponent's card instance " # iid.toText(), ?s.state.phase));
                };
                case null {
                  switch (findCardInPlay(actorState.playArea, iid)) {
                    case (?cip) {
                      let newActArea  = removeCardFromPlay(actorState.playArea, iid);
                      let newActGrave = actorState.graveyard.concat([cip]);
                      let newAct2     = { actorState with playArea = newActArea; graveyard = newActGrave };
                      let newPs       = replacePlayerState(s.state.playerStates, newAct2);
                      s := { s with state = { s.state with playerStates = newPs } };
                      s := appendLog(s, logEntry("destroyCard", ?actorId.toText(), ?iid.toText(),
                        "Destroyed own card instance " # iid.toText(), ?s.state.phase));
                    };
                    case null {};
                  };
                };
              };
            };
            case null {};
          };
        };
        case (#ReturnToHand) {
          switch (targetInstanceId) {
            case (?iid) {
              switch (findCardInPlay(oppState.playArea, iid)) {
                case (?cip) {
                  let newOppArea = removeCardFromPlay(oppState.playArea, iid);
                  let newOppHand = oppState.hand.concat([cip.cardId]);
                  let newOpp2    = { oppState with playArea = newOppArea; hand = newOppHand };
                  let newPs      = replacePlayerState(s.state.playerStates, newOpp2);
                  s := { s with state = { s.state with playerStates = newPs } };
                  s := appendLog(s, logEntry("returnToHand", ?actorId.toText(), ?iid.toText(),
                    "Returned card " # iid.toText() # " to opponent's hand", ?s.state.phase));
                };
                case null {};
              };
            };
            case null {};
          };
        };
        case (#Counter) {
          s := appendLog(s, logEntry("counter", ?actorId.toText(), null,
            "[COUNTER] Spell countered", ?s.state.phase));
        };
        case (#StatBoostUntilEOT(atkBuff, defBuff)) {
          switch (targetInstanceId) {
            case (?iid) {
              let newActArea = applyBuff(actorState.playArea, iid, atkBuff, defBuff);
              let newActor2  = { actorState with playArea = newActArea };
              let newPs      = replacePlayerState(s.state.playerStates, newActor2);
              s := { s with state = { s.state with playerStates = newPs } };
              s := appendLog(s, logEntry("statBoost", ?actorId.toText(), ?iid.toText(),
                "Stat boost +" # atkBuff.toText() # "/+" # defBuff.toText() # " until EOT", ?s.state.phase));
            };
            case null {};
          };
        };
        case (#StatReduceUntilEOT(atkReduce, defReduce)) {
          switch (targetInstanceId) {
            case (?iid) {
              let newActArea = applyBuff(actorState.playArea, iid, -atkReduce, -defReduce);
              let newActor2  = { actorState with playArea = newActArea };
              let newPs      = replacePlayerState(s.state.playerStates, newActor2);
              s := { s with state = { s.state with playerStates = newPs } };
              s := appendLog(s, logEntry("statReduce", ?actorId.toText(), ?iid.toText(),
                "Stat reduce -" # atkReduce.toText() # "/-" # defReduce.toText() # " until EOT", ?s.state.phase));
            };
            case null {};
          };
        };
        case (#GiveKeyword kw) {
          s := appendLog(s, logEntry("giveKeyword", ?actorId.toText(), null,
            "[MANUAL] Give keyword: " # kw, ?s.state.phase));
        };
        case (#CustomEffect text) {
          s := appendLog(s, logEntry("ability:manual", ?actorId.toText(), null,
            "[MANUAL] " # text, ?s.state.phase));
        };
      };
    };
    s;
  };

  // ── Session management ───────────────────────────────────────────────────────

  public func createSession(
    sessionId  : Types.GameSessionId,
    hostId     : Types.UserId,
    gameId     : Types.GameId,
    inviteCode : Text
  ) : Types.GameSession {
    let emptyState : Types.GameState = {
      phase           = #Start;
      activePlayerId  = hostId;
      turn            = 1;
      playerStates    = [];
      status          = #WaitingForPlayer;
      combatSubPhase  = #Idle;
    };
    {
      id         = sessionId;
      gameId;
      hostId;
      guestId    = null;
      state      = emptyState;
      inviteCode;
      startedAt  = null;
      endedAt    = null;
      result     = null;
      log        = [];
    };
  };

  public func joinSession(
    session : Types.GameSession,
    guestId : Types.UserId
  ) : {#ok: Types.GameSession; #err: Text} {
    if (session.state.status != #WaitingForPlayer) {
      return #err("Session is not waiting for a player");
    };
    switch (session.guestId) {
      case (?_) #err("Session already has a guest");
      case null {
        let updated = { session with
          guestId   = ?guestId;
          state     = { session.state with status = #InProgress };
          startedAt = ?Time.now();
        };
        #ok(appendLog(updated, logEntry("join", ?guestId.toText(), null,
          guestId.toText() # " joined the session", null)));
      };
    };
  };

  func drawOneCard(ps : Types.PlayerGameState) : ?Types.PlayerGameState {
    if (ps.library.size() == 0) return null;
    let drawn   = ps.library[0];
    let newLib  = ps.library.sliceToArray(1, ps.library.size());
    let newHand = ps.hand.concat([drawn]);
    ?(({ ps with library = newLib; hand = newHand }) : Types.PlayerGameState);
  };  /// Deterministic Fisher-Yates shuffle seeded by Time.now().
  func shuffle(cards : [Types.CardId]) : [Types.CardId] {
    let n   = cards.size();
    let arr = cards.toVarArray<Types.CardId>();
    var seed : Nat = (Int.abs(Time.now()) % 1_000_000_007) + 1;
    var i = n;
    while (i > 1) {
      i -= 1;
      seed := (seed * 6364136223846793005 + 1442695040888963407) % 18_446_744_073_709_551_615;
      let j = seed % (i + 1);
      let tmp = arr[i];
      arr[i]  := arr[j];
      arr[j]  := tmp;
    };
    Array.tabulate<Types.CardId>(n, func i = arr[i]);
  };

  public func initializeGameState(
    session        : Types.GameSession,
    hostDeckCards  : [Types.Card],
    guestDeckCards : [Types.Card],
    gameDefinition : Types.GameDefinition
  ) : Types.GameSession {
    let startingHealth = gameDefinition.resourceSystem.startingLife;
    let resName        = gameDefinition.resourceSystem.resourceName;
    let initResources : [(Text, Nat)] = [(resName, 0)];
    let hostCardIds    = hostDeckCards.map(func(c) { c.id });
    let guestCardIds   = guestDeckCards.map(func(c) { c.id });
    let hostShuffled   = shuffle(hostCardIds);
    let guestShuffled  = shuffle(guestCardIds);
    let handSize       = 5;
    let hostHand       = hostShuffled.sliceToArray(0, Nat.min(handSize, hostShuffled.size()));
    let hostLib        = hostShuffled.sliceToArray(Nat.min(handSize, hostShuffled.size()), hostShuffled.size());
    let guestHand      = guestShuffled.sliceToArray(0, Nat.min(handSize, guestShuffled.size()));
    let guestLib       = guestShuffled.sliceToArray(Nat.min(handSize, guestShuffled.size()), guestShuffled.size());
    let guestId = switch (session.guestId) {
      case (?id) id;
      case null  Runtime.trap("Guest must join before initializing game state");
    };
    let hostState : Types.PlayerGameState = {
      playerId          = session.hostId;
      health            = startingHealth;
      resources         = initResources;
      hand              = hostHand;
      library           = hostLib;
      playArea          = [];
      graveyard         = [];
      hasPlayedResource = false;
      mulliganState     = { taken = false };
    };
    let guestState : Types.PlayerGameState = {
      playerId          = guestId;
      health            = startingHealth;
      resources         = initResources;
      hand              = guestHand;
      library           = guestLib;
      playArea          = [];
      graveyard         = [];
      hasPlayedResource = false;
      mulliganState     = { taken = false };
    };
    let newState : Types.GameState = {
      phase           = #Start;
      activePlayerId  = session.hostId;
      turn            = 1;
      playerStates    = [hostState, guestState];
      status          = #InProgress;
      combatSubPhase  = #Idle;
    };
    appendLog({ session with state = newState },
      logEntry("gameStart", null, null, "Game initialized — Turn 1", ?#Start));
  };

  // ── Turn actions ─────────────────────────────────────────────────────────────

  public func drawCard(
    session  : Types.GameSession,
    playerId : Types.UserId
  ) : {#ok: Types.GameSession; #err: Text} {
    if (not Principal.equal(session.state.activePlayerId, playerId)) {
      return #err("Not your turn");
    };
    if (session.state.phase != #Draw) {
      return #err("Can only draw cards during the Draw phase");
    };
    let ps = getPlayerState(session.state.playerStates, playerId);
    if (ps.library.size() == 0) {
      let opp    = getOpponentState(session.state.playerStates, playerId);
      let result : Types.GameResult = {
        winnerId     = opp.playerId;
        loserId      = playerId;
        endCondition = #Forfeit;
        finalTurn    = session.state.turn;
        completedAt  = Time.now();
      };
      var s = { session with
        state   = { session.state with status = #Completed : Types.GameStatus };
        result  = ?result;
        endedAt = ?Time.now();
      };
      s := appendLog(s, logEntry("deckOut", ?playerId.toText(), null,
        playerId.toText() # " has no cards to draw — library empty", ?#Draw));
      return #ok(s);
    };
    switch (drawOneCard(ps)) {
      case null #err("Library empty");
      case (?newPs) {
        let newPsList = replacePlayerState(session.state.playerStates, newPs);
        var s = { session with state = { session.state with playerStates = newPsList } };
        s := appendLog(s, logEntry("drawCard", ?playerId.toText(), null,
          playerId.toText() # " drew a card", ?#Draw));
        #ok(s);
      };
    };
  };

  public func playCard(
    session  : Types.GameSession,
    playerId : Types.UserId,
    cardId   : Types.CardId,
    card     : Types.Card
  ) : {#ok: Types.GameSession; #err: Text} {
    if (not Principal.equal(session.state.activePlayerId, playerId)) {
      return #err("Not your turn");
    };
    if (session.state.phase != #Main) {
      return #err("Cards can only be played during the Main phase");
    };
    let ps = getPlayerState(session.state.playerStates, playerId);
    if (not ps.hand.any<Types.CardId>(func(id) { id == cardId })) {
      return #err("Card not in hand");
    };
    // Deduct cost from first resource with enough value
    let costCovered = ps.resources.any(func(kv) { kv.1 >= card.cost });
    if (not costCovered and card.cost > 0) {
      return #err("Insufficient resources to play this card");
    };
    let newResources : [(Text, Nat)] = switch (
      ps.resources.findIndex<(Text, Nat)>(func(kv) { kv.1 >= card.cost })
    ) {
      case (?idx) {
        ps.resources.mapEntries<(Text, Nat), (Text, Nat)>(func(kv, i) {
          if (i == idx) (kv.0, kv.1 - card.cost) else kv
        });
      };
      case null ps.resources;
    };
    let iid     = nextInstanceId(session.state.playerStates);
    let newCip : Types.CardInPlay = {
      instanceId      = iid;
      cardId;
      baseAttack      = switch (card.attack)  { case (?a) a; case null 0 };
      baseDefense     = switch (card.defense) { case (?d) d; case null 0 };
      tapped          = false;
      summonSick      = true;
      tempBuffAttack  = 0;
      tempBuffDefense = 0;
    };
    let newHand     = removeFromHand(ps.hand, cardId);
    let newPlayArea = ps.playArea.concat([newCip]);
    let newPs       = { ps with hand = newHand; playArea = newPlayArea; resources = newResources };
    let newPsList   = replacePlayerState(session.state.playerStates, newPs);
    var s = { session with state = { session.state with playerStates = newPsList } };
    s := appendLog(s, logEntry("playCard", ?playerId.toText(), ?cardId.toText(),
      playerId.toText() # " played " # card.name, ?#Main));
    // Trigger #onPlay abilities
    for (ability in card.abilities.values()) {
      switch (ability.abilityType) {
        case (#structured) {
          switch (ability.trigger) {
            case (?#EnterPlay) { s := resolveAbilityEffects(s, playerId, ability.effects, null) };
            case _ {};
          };
        };
        case (#freeform) {
          let rtext = switch (ability.rulesText) { case (?t) t; case null ability.name };
          s := appendLog(s, logEntry("ability:manual", ?playerId.toText(), ?cardId.toText(),
            "[MANUAL onPlay] " # rtext, ?#Main));
        };
      };
    };
    #ok(s);
  };

  /// Phase 1: Active player declares which of their cards are attacking.
  /// Advances combatSubPhase to #AssigningBlockers.
  public func declareAttackers(
    session              : Types.GameSession,
    attackerId           : Types.UserId,
    attackingInstanceIds : [Nat]
  ) : {#ok: Types.GameSession; #err: Text} {
    if (not Principal.equal(session.state.activePlayerId, attackerId)) {
      return #err("Not your turn");
    };
    if (session.state.phase != #Combat) {
      return #err("Combat can only be declared during the Combat phase");
    };
    if (session.state.combatSubPhase != #Idle) {
      return #err("Combat already in progress — use assignBlockers");
    };
    let atkPs = getPlayerState(session.state.playerStates, attackerId);
    for (iid in attackingInstanceIds.values()) {
      switch (findCardInPlay(atkPs.playArea, iid)) {
        case null     return #err("Attacking card " # iid.toText() # " not found");
        case (?cip) {
          if (cip.summonSick) return #err("Card " # iid.toText() # " has summoning sickness");
          if (cip.tapped)    return #err("Card " # iid.toText() # " is already tapped");
        };
      };
    };
    var s : Types.GameSession = { session with state = {
      session.state with combatSubPhase = #AssigningBlockers { attackers = attackingInstanceIds }
    }};
    s := appendLog(s, logEntry("declareAttackers", ?attackerId.toText(), null,
      attackerId.toText() # " declared " # attackingInstanceIds.size().toText() # " attacker(s)",
      ?#Combat));
    #ok(s);
  };

  /// Phase 2: Defending player assigns blockers, then combat resolves immediately.
  public func assignBlockers(
    session             : Types.GameSession,
    defenderId          : Types.UserId,
    blockingInstanceIds : [Nat]
  ) : {#ok: Types.GameSession; #err: Text} {
    if (Principal.equal(session.state.activePlayerId, defenderId)) {
      return #err("Active player cannot assign blockers — wait for your turn");
    };
    if (session.state.phase != #Combat) {
      return #err("Not in Combat phase");
    };
    let attackingInstanceIds = switch (session.state.combatSubPhase) {
      case (#AssigningBlockers { attackers }) attackers;
      case _ return #err("No attackers declared yet — call declareAttackers first");
    };
    let defPs = getPlayerState(session.state.playerStates, defenderId);
    for (iid in blockingInstanceIds.values()) {
      switch (findCardInPlay(defPs.playArea, iid)) {
        case null   return #err("Blocking card " # iid.toText() # " not in your play area");
        case (?cip) {
          if (cip.tapped) return #err("Card " # iid.toText() # " is already tapped and cannot block");
        };
      };
    };
    let attackerId = session.state.activePlayerId;
    var s : Types.GameSession = { session with state = { session.state with combatSubPhase = #Idle } };
    var atkPsMut = getPlayerState(s.state.playerStates, attackerId);
    var defPsMut = defPs;
    let pairs    = Nat.min(attackingInstanceIds.size(), blockingInstanceIds.size());
    var i        = 0;
    while (i < attackingInstanceIds.size()) {
      let atkIid = attackingInstanceIds[i];
      switch (findCardInPlay(atkPsMut.playArea, atkIid)) {
        case null { i += 1 };
        case (?atkCip) {
          let atkDmg = effectiveAttack(atkCip);
          if (i < pairs) {
            let blkIid = blockingInstanceIds[i];
            switch (findCardInPlay(defPsMut.playArea, blkIid)) {
              case null {
                            defPsMut := { defPsMut with health = if (defPsMut.health >= atkDmg) defPsMut.health - atkDmg else 0 };
                s := appendLog(s, logEntry("combat", ?attackerId.toText(), null,
                  "Attacker " # atkIid.toText() # " unblocked, deals " # atkDmg.toText() # " to face", ?#Combat));
              };
              case (?blkCip) {
                let blkDmg = effectiveAttack(blkCip);
                let atkDef = effectiveDefense(atkCip);
                let blkDef = effectiveDefense(blkCip);
                s := appendLog(s, logEntry("combat", ?attackerId.toText(), ?blkIid.toText(),
                  "Combat: " # atkIid.toText() # " (" # atkDmg.toText() # "/" # atkDef.toText() # ")"
                  # " vs " # blkIid.toText() # " (" # blkDmg.toText() # "/" # blkDef.toText() # ")",
                  ?#Combat));
                if (blkDmg >= atkDef and atkDef > 0 or blkDmg > 0 and atkDef == 0) {
                  atkPsMut := { atkPsMut with
                    playArea  = removeCardFromPlay(atkPsMut.playArea, atkIid);
                    graveyard = atkPsMut.graveyard.concat([atkCip]);
                  };
                  s := appendLog(s, logEntry("destroy", ?attackerId.toText(), ?atkIid.toText(),
                    "Attacker " # atkIid.toText() # " destroyed", ?#Combat));
                };
                if (atkDmg >= blkDef and blkDef > 0 or atkDmg > 0 and blkDef == 0) {
                  defPsMut := { defPsMut with
                    playArea  = removeCardFromPlay(defPsMut.playArea, blkIid);
                    graveyard = defPsMut.graveyard.concat([blkCip]);
                  };
                  s := appendLog(s, logEntry("destroy", ?attackerId.toText(), ?blkIid.toText(),
                    "Blocker " # blkIid.toText() # " destroyed", ?#Combat));
                  if (atkDmg > blkDef) {
                    let excess : Nat = atkDmg - blkDef;
                    defPsMut := { defPsMut with health = if (defPsMut.health >= excess) defPsMut.health - excess else 0 };
                    s := appendLog(s, logEntry("excessDamage", ?attackerId.toText(), null,
                      "Excess " # excess.toText() # " damage to opponent face", ?#Combat));
                  };
                };
              };
            };
          } else {
            defPsMut := { defPsMut with health = if (defPsMut.health >= atkDmg) defPsMut.health - atkDmg else 0 };
            s := appendLog(s, logEntry("combat", ?attackerId.toText(), null,
              "Attacker " # atkIid.toText() # " unblocked, deals " # atkDmg.toText() # " to face", ?#Combat));
          };
          atkPsMut := { atkPsMut with
            playArea = atkPsMut.playArea.map(func(c) {
              if (c.instanceId == atkIid) { { c with tapped = true } } else c
            });
          };
          i += 1;
        };
      };
    };
    let newPsList = replaceAllPlayerStates(s.state.playerStates, atkPsMut, defPsMut);
    s := { s with state = { s.state with playerStates = newPsList } };
    s := appendLog(s, logEntry("combatResolved", ?attackerId.toText(), null,
      "Combat resolved", ?#Combat));
    #ok(s);
  };

  /// Internal single-step combat used by the practice bot.
  func declareAttackInternal(
    session              : Types.GameSession,
    attackerId           : Types.UserId,
    attackingInstanceIds : [Nat]
  ) : {#ok: Types.GameSession; #err: Text} {
    switch (declareAttackers(session, attackerId, attackingInstanceIds)) {
      case (#err(e)) #err(e);
      case (#ok(s)) {
        let defId = getOpponentState(s.state.playerStates, attackerId).playerId;
        assignBlockers(s, defId, []);
      };
    };
  };

  public func useAbility(
    session          : Types.GameSession,
    playerId         : Types.UserId,
    sourceInstanceId : Nat,
    abilityId        : Nat,
    targetInstanceId : ?Nat
  ) : {#ok: Types.GameSession; #err: Text} {
    if (not Principal.equal(session.state.activePlayerId, playerId)) {
      return #err("Not your turn");
    };
    let ps = getPlayerState(session.state.playerStates, playerId);
    switch (findCardInPlay(ps.playArea, sourceInstanceId)) {
      case null return #err("Source card " # sourceInstanceId.toText() # " not in your play area");
      case (?_) {};
    };
    // The actor resolves the ability and calls resolveAbilityEffects directly.
    // This function validates ownership + records the event.
    ignore targetInstanceId;
    #ok(appendLog(session, logEntry("useAbility", ?playerId.toText(), ?sourceInstanceId.toText(),
      playerId.toText() # " uses ability " # abilityId.toText(), ?session.state.phase)));
  };

  // ── Mulligan ─────────────────────────────────────────────────────────────────

  public func takeMulligan(
    session  : Types.GameSession,
    playerId : Types.UserId
  ) : {#ok: Types.GameSession; #err: Text} {
    if (session.state.phase != #Start) {
      return #err("Mulligan can only be taken during the Start phase");
    };
    let ps = getPlayerState(session.state.playerStates, playerId);
    if (ps.mulliganState.taken) {
      return #err("You have already taken your mulligan this game");
    };
    let combined    = ps.hand.concat(ps.library);
    let reshuffled  = shuffle(combined);
    let newHandSize = Nat.min(7, reshuffled.size());
    let newHand     = reshuffled.sliceToArray(0, newHandSize);
    let newLib      = reshuffled.sliceToArray(newHandSize, reshuffled.size());
    let newPs : Types.PlayerGameState = {
      ps with
      hand          = newHand;
      library       = newLib;
      mulliganState = { taken = true };
    };
    let newPsList = replacePlayerState(session.state.playerStates, newPs);
    var s = { session with state = { session.state with playerStates = newPsList } };
    s := appendLog(s, logEntry("mulligan", ?playerId.toText(), null,
      playerId.toText() # " took a mulligan — redrawn " # newHandSize.toText() # " cards",
      ?#Start));
    #ok(s);
  };

  // ── Discard ──────────────────────────────────────────────────────────────────

  public func discardCard(
    session  : Types.GameSession,
    playerId : Types.UserId,
    cardId   : Types.CardId
  ) : {#ok: Types.GameSession; #err: Text} {
    let ps = getPlayerState(session.state.playerStates, playerId);
    if (not ps.hand.any<Types.CardId>(func(id) { id == cardId })) {
      return #err("Card not in hand");
    };
    let tombstone : Types.CardInPlay = {
      instanceId      = 0;
      cardId;
      baseAttack      = 0;
      baseDefense     = 0;
      tapped          = false;
      summonSick      = false;
      tempBuffAttack  = 0;
      tempBuffDefense = 0;
    };
    let newHand  = removeFromHand(ps.hand, cardId);
    let newGrave = ps.graveyard.concat([tombstone]);
    let newPs    = { ps with hand = newHand; graveyard = newGrave };
    let newPsList = replacePlayerState(session.state.playerStates, newPs);
    var s = { session with state = { session.state with playerStates = newPsList } };
    s := appendLog(s, logEntry("discard", ?playerId.toText(), ?cardId.toText(),
      playerId.toText() # " discarded card " # cardId.toText(), ?session.state.phase));
    #ok(s);
  };

  // ── Hand size limit ──────────────────────────────────────────────────────────

  let defaultHandSizeLimit : Nat = 7;

  public func getHandSizeLimit(gameDefinition : Types.GameDefinition) : Nat {
    ignore gameDefinition;
    defaultHandSizeLimit;
  };

  // ── Phase-entry helpers ───────────────────────────────────────────────────────

  func applyStartPhase(
    session        : Types.GameSession,
    gameDefinition : Types.GameDefinition
  ) : Types.GameSession {
    let playerId  = session.state.activePlayerId;
    let ps        = getPlayerState(session.state.playerStates, playerId);
    let resName   = gameDefinition.resourceSystem.resourceName;
    let rpt       = gameDefinition.resourceSystem.resourcesPerTurn;
    let cur       = getResource(ps.resources, resName);
    let newRes    = setResource(ps.resources, resName, cur + rpt);
    let newPs     = { ps with resources = newRes };
    let newPsList = replacePlayerState(session.state.playerStates, newPs);
    var s = { session with state = { session.state with playerStates = newPsList } };
    s := appendLog(s, logEntry("resourceGen", ?playerId.toText(), null,
      "Resources generated at start of turn", ?#Start));
    s;
  };

  func applyDrawPhase(session : Types.GameSession) : Types.GameSession {
    let playerId = session.state.activePlayerId;
    let ps       = getPlayerState(session.state.playerStates, playerId);
    if (ps.library.size() == 0) {
      let opp    = getOpponentState(session.state.playerStates, playerId);
      let result : Types.GameResult = {
        winnerId     = opp.playerId;
        loserId      = playerId;
        endCondition = #Forfeit;
        finalTurn    = session.state.turn;
        completedAt  = Time.now();
      };
      var s = { session with
        state   = { session.state with status = #Completed : Types.GameStatus };
        result  = ?result;
        endedAt = ?Time.now();
      };
      s := appendLog(s, logEntry("deckOut", ?playerId.toText(), null,
        playerId.toText() # " has no cards to draw — deck out", ?#Draw));
      return s;
    };
    switch (drawOneCard(ps)) {
      case null session;
      case (?newPs) {
        let newPsList = replacePlayerState(session.state.playerStates, newPs);
        var s = { session with state = {
          session.state with
          playerStates = newPsList;
          phase        = #Main : Types.GamePhase;
        }};
        s := appendLog(s, logEntry("autoDraw", ?playerId.toText(), null,
          playerId.toText() # " auto-drew on Draw phase — advanced to Main", ?#Draw));
        s;
      };
    };
  };

  public func endPhase(
    session        : Types.GameSession,
    playerId       : Types.UserId,
    gameDefinition : Types.GameDefinition
  ) : {#ok: Types.GameSession; #err: Text} {
    if (not Principal.equal(session.state.activePlayerId, playerId)) {
      return #err("Not your turn");
    };
    if (session.state.phase == #Combat) {
      switch (session.state.combatSubPhase) {
        case (#AssigningBlockers _) return #err("Opponent must assign blockers before advancing");
        case _ {};
      };
    };
    let nextPhaseOpt : ?Types.GamePhase = switch (session.state.phase) {
      case (#Start)  ?#Draw;
      case (#Draw)   ?#Main;
      case (#Main)   ?#Combat;
      case (#Combat) ?#End;
      case (#End)    null;
    };
    switch (nextPhaseOpt) {
      case (?nextPhase) {
        var s = { session with state = { session.state with phase = nextPhase } };
        s := appendLog(s, logEntry("phaseEnd", ?playerId.toText(), null,
          "Phase advanced to " # debug_show(nextPhase), ?nextPhase));
        if (nextPhase == #Draw) {
          s := applyDrawPhase(s);
        };
        #ok(s);
      };
      case null {
        let ps    = getPlayerState(session.state.playerStates, playerId);
        let limit = getHandSizeLimit(gameDefinition);
        if (ps.hand.size() > limit) {
          return #err("DiscardRequired:" # (ps.hand.size() - limit : Nat).toText());
        };
        let newArea = ps.playArea.map(func(c) {
          { c with tapped = false; summonSick = false }
        });
        let newPs     = { ps with playArea = newArea; hasPlayedResource = false };
        let newPsList = replacePlayerState(session.state.playerStates, newPs);
        let opp     = getOpponentState(session.state.playerStates, playerId);
        let newTurn = session.state.turn + 1;
        var s = { session with state = ({
          phase           = #Start : Types.GamePhase;
          activePlayerId  = opp.playerId;
          turn            = newTurn;
          playerStates    = newPsList;
          status          = session.state.status;
          combatSubPhase  = #Idle;
        } : Types.GameState)};
        s := appendLog(s, logEntry("turnEnd", ?playerId.toText(), null,
          "Turn " # session.state.turn.toText() # " ended — Turn " # newTurn.toText()
          # " begins for " # opp.playerId.toText(), ?#Start));
        s := applyStartPhase(s, gameDefinition);
        #ok(s);
      };
    };
  };

  public func concede(
    session  : Types.GameSession,
    playerId : Types.UserId
  ) : {#ok: Types.GameSession; #err: Text} {
    if (session.state.status != #InProgress) {
      return #err("Game is not in progress");
    };
    let opp    = getOpponentState(session.state.playerStates, playerId);
    let result : Types.GameResult = {
      winnerId     = opp.playerId;
      loserId      = playerId;
      endCondition = #Concede;
      finalTurn    = session.state.turn;
      completedAt  = Time.now();
    };
    var s = { session with
      state   = { session.state with status = #Completed : Types.GameStatus };
      result  = ?result;
      endedAt = ?Time.now();
    };
    s := appendLog(s, logEntry("concede", ?playerId.toText(), null,
      playerId.toText() # " conceded", null));
    #ok(s);
  };

  // ── Practice bot ─────────────────────────────────────────────────────────────

  public func practiceOpponent(
    session        : Types.GameSession,
    cardLookup     : [(Types.CardId, Types.Card)],
    gameDefinition : Types.GameDefinition
  ) : Types.GameSession {
    let botId = botPrincipal();
    if (not Principal.equal(session.state.activePlayerId, botId)) {
      // Check if bot needs to assign blockers as defender
      switch (session.state.combatSubPhase) {
        case (#AssigningBlockers _) {
          switch (assignBlockers(session, botId, [])) {
            case (#ok(s)) return s;
            case (#err(_)) return session;
          };
        };
        case _ {};
      };
      return session;
    };
    if (session.state.status != #InProgress) return session;
    switch (session.state.phase) {
      case (#Start) {
        switch (endPhase(session, botId, gameDefinition)) {
          case (#ok(s)) s;
          case (#err(_)) session;
        };
      };
      case (#Draw) {
        switch (endPhase(session, botId, gameDefinition)) {
          case (#ok(s)) s;
          case (#err(_)) session;
        };
      };
      case (#Main) {
        let ps = getPlayerState(session.state.playerStates, botId);
        let totalRes = ps.resources.foldLeft(0,
          func(acc, kv) { acc + kv.1 });
        let handCards = ps.hand.filterMap(func(id) {
          switch (cardLookup.find(func(kv) { kv.0 == id })) {
            case (?(_, c)) ?c;
            case null      null;
          };
        });
        let affordable = handCards.filter(func(c) { c.cost <= totalRes });
        let sorted = affordable.sort(func(a, b) { Nat.compare(a.cost, b.cost) });
        switch (sorted.find<Types.Card>(func(_) { true })) {
          case null {
            switch (endPhase(session, botId, gameDefinition)) {
              case (#ok(s)) s;
              case (#err(_)) session;
            };
          };
          case (?card) {
            switch (playCard(session, botId, card.id, card)) {
              case (#ok(s)) s;
              case (#err(_)) session;
            };
          };
        };
      };
      case (#Combat) {
        switch (session.state.combatSubPhase) {
          case (#Idle) {
            let ps = getPlayerState(session.state.playerStates, botId);
            let attackers = ps.playArea.filterMap(func(c) {
              if (not c.tapped and not c.summonSick) ?c.instanceId else null
            });
            if (attackers.size() == 0) {
              switch (endPhase(session, botId, gameDefinition)) {
                case (#ok(s)) s;
                case (#err(_)) session;
              };
            } else {
              switch (declareAttackInternal(session, botId, attackers)) {
                case (#ok(s)) s;
                case (#err(_)) session;
              };
            };
          };
          case (#AssigningBlockers _) {
            // Bot is defender here (shouldn't reach since handled above, but safe)
            switch (assignBlockers(session, botId, [])) {
              case (#ok(s)) s;
              case (#err(_)) session;
            };
          };
          case (#DeclaringAttackers) session;
        };
      };
      case (#End) {
        switch (endPhase(session, botId, gameDefinition)) {
          case (#ok(s)) s;
          case (#err(_)) session;
        };
      };
    };
  };

};
