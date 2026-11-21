import Runtime "mo:core/Runtime";
import Types "Types";
import GS "GameStorage";
import PlayEngine "PlayEngine";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Array "mo:core/Array";




actor {

  let state : GS.State = GS.newState();

  // ── Game Session State ─────────────────────────────────────────────────

  let gameSessions : Map.Map<Types.GameSessionId, Types.GameSession> = Map.empty();
  let sessionState = { var nextSessionId : Nat = 0 };

  // ── Internal session helpers ───────────────────────────────────────────

  func requireSession(sessionId : Types.GameSessionId) : Types.GameSession {
    switch (gameSessions.get(sessionId)) {
      case (?s)  s;
      case null  Runtime.trap("Session not found");
    };
  };

  func requireGameDef() : Types.GameDefinition {
    switch (GS.getGame(state)) {
      case (?g) g;
      case null Runtime.trap("Game definition not found");
    };
  };

  let cardUseLog : Map.Map<Types.CardId, (Nat, Nat)> = Map.empty();
  let completedResults : List.List<Types.GameResult> = List.empty();

  func _recordCardUsage(cardId : Types.CardId, winnerUsed : Bool) {
    let (uses, wins) = switch (cardUseLog.get(cardId)) {
      case (?v) v;
      case null (0, 0);
    };
    cardUseLog.add(cardId, (uses + 1, if (winnerUsed) wins + 1 else wins));
  };

  func saveSession(session : Types.GameSession) {
    gameSessions.add(session.id, session);
  };

  func isParticipant(session : Types.GameSession, caller : Principal) : Bool {
    Principal.equal(session.hostId, caller) or
    (switch (session.guestId) { case (?g) Principal.equal(g, caller); case null false });
  };

  // ── Game Definition ─────────────────────────────────────────────────────

  public shared ({ caller }) func createGame(
    name  : Text,
    theme : Text,
  ) : async {#ok: Types.GameDefinition; #err: Text} {
    GS.createGame(state, caller, name, theme)
  };

  public query func getGame() : async ?Types.GameDefinition {
    GS.getGame(state)
  };

  public shared ({ caller }) func updateGame(
    updates : {
      gameName            : ?Text;
      gameDescription     : ?Text;
      themeColor          : ?Text;
      gameIcon            : ?Text;
      resourceSystem      : ?Types.ResourceSystem;
      cardTypeDefinitions : ?[Types.CardTypeDefinition];
      keywords            : ?[Types.KeywordDefinition];
      winConditions       : ?[Types.WinCondition];
      turnPhases          : ?[Types.TurnPhase];
      wizardStep          : ?Nat;
    }
  ) : async {#ok: Types.GameDefinition; #err: Text} {
    GS.updateGame(state, caller, updates)
  };

  public shared ({ caller }) func updateWizardStep(
    step : Nat
  ) : async {#ok: (); #err: Text} {
    GS.updateWizardStep(state, caller, step)
  };

  public shared ({ caller }) func saveGameVersion(
    description : Text
  ) : async () {
    GS.saveGameVersion(state, caller, description)
  };

  public query func getGameVersionHistory() : async [Types.GameVersionSnapshot] {
    GS.getGameVersionHistory(state)
  };

  public shared ({ caller }) func publishGame(
    visibility : Types.GameVisibility
  ) : async {#ok: Types.GameDefinition; #err: Text} {
    GS.publishGame(state, caller, visibility)
  };

  public shared ({ caller }) func unpublishGame() : async {#ok: Types.GameDefinition; #err: Text} {
    GS.unpublishGame(state, caller)
  };

  // ── Card Library ───────────────────────────────────────────────────────

  public shared ({ caller }) func createCard(
    req : {
      name        : Text;
      cost        : Nat;
      attack      : ?Nat;
      defense     : ?Nat;
      cardType    : Text;
      tags        : [Text];
      abilities   : [Types.Ability];
      rulesText   : ?Text;
      flavourText : ?Text;
      artUrl      : ?Text;
    }
  ) : async {#ok: Types.Card; #err: Text} {
    GS.createCard(state, caller, req)
  };

  public query func getCard(id : Types.CardId) : async ?Types.Card {
    GS.getCard(state, id)
  };

  public query func listCards(gameId : Types.GameId) : async [Types.Card] {
    GS.listCards(state, gameId)
  };

  public shared ({ caller }) func updateCard(
    id  : Types.CardId,
    req : {
      name        : ?Text;
      cost        : ?Nat;
      attack      : ??Nat;
      defense     : ??Nat;
      cardType    : ?Text;
      tags        : ?[Text];
      abilities   : ?[Types.Ability];
      rulesText   : ??Text;
      flavourText : ??Text;
      artUrl      : ??Text;
    }
  ) : async {#ok: Types.Card; #err: Text} {
    GS.updateCard(state, caller, id, req)
  };

  public shared ({ caller }) func deleteCard(id : Types.CardId) : async {#ok: (); #err: Text} {
    GS.deleteCard(state, caller, id)
  };

  // ── Deck Storage ────────────────────────────────────────────────────────

  public shared ({ caller }) func createDeck(
    gameId : Types.GameId,
    name   : Text,
    cards  : [Types.DeckEntry],
  ) : async {#ok: Types.Deck; #err: Text} {
    GS.createDeck(state, caller, gameId, name, cards)
  };

  public query func getDeck(id : Types.DeckId) : async ?Types.Deck {
    GS.getDeck(state, id)
  };

  public query func listDecks(
    ownerId : ?Types.UserId,
    gameId  : Types.GameId,
  ) : async [Types.Deck] {
    GS.listDecks(state, ownerId, gameId)
  };

  public shared ({ caller }) func updateDeck(
    id    : Types.DeckId,
    name  : ?Text,
    cards : ?[Types.DeckEntry],
  ) : async {#ok: Types.Deck; #err: Text} {
    GS.updateDeck(state, caller, id, name, cards)
  };

  public shared ({ caller }) func deleteDeck(id : Types.DeckId) : async {#ok: (); #err: Text} {
    GS.deleteDeck(state, caller, id)
  };

  public query func validateDeck(
    gameId : Types.GameId,
    cards  : [Types.DeckEntry],
  ) : async Types.DeckValidation {
    GS.validateDeck(state, gameId, cards)
  };

  public shared ({ caller }) func setStarterDeck(id : Types.DeckId) : async {#ok: (); #err: Text} {
    GS.setStarterDeck(state, caller, id)
  };

  // ── Player Accounts ────────────────────────────────────────────────────

  public shared ({ caller = _ }) func registerPlayer(
    principal : Principal,
    gameId    : Types.GameId,
    role      : Types.Role,
    username  : ?Text,
  ) : async Types.PlayerAccount {
    GS.registerPlayer(state, principal, gameId, role, username)
  };

  public query func getPlayer(principal : Principal) : async ?Types.PlayerAccount {
    GS.getPlayer(state, principal)
  };

  public query func listPlayers(gameId : Types.GameId) : async [Types.PlayerAccount] {
    GS.listPlayers(state, gameId)
  };

  public shared ({ caller }) func updatePlayerRole(
    targetPrincipal : Principal,
    newRole         : Types.Role,
  ) : async {#ok: Types.PlayerAccount; #err: Text} {
    GS.updatePlayerRole(state, caller, targetPrincipal, newRole)
  };

  // Internal function for game engine to update player records
  public shared ({ caller = _ }) func updatePlayerRecord(
    principal : Principal,
    won       : Bool,
  ) : async () {
    GS.updatePlayerRecord(state, principal, won)
  };

  // ── Invite Links ─────────────────────────────────────────────────────

  public shared ({ caller }) func createInviteLink(gameId : Types.GameId) : async Types.InviteLink {
    GS.createInviteLink(state, caller, gameId)
  };

  public query func getInviteLink(code : Text) : async ?Types.InviteLink {
    GS.getInviteLink(state, code)
  };

  public shared ({ caller }) func useInviteLink(code : Text) : async {#ok: Types.InviteLink; #err: Text} {
    GS.useInviteLink(state, code, caller)
  };

  public query func listInviteLinks(gameId : Types.GameId) : async [Types.InviteLink] {
    GS.listInviteLinks(state, gameId)
  };

  // ── Game Sessions ──────────────────────────────────────────────────────

  public shared ({ caller }) func createGameSession(
    gameId     : Types.GameId,
    inviteCode : Text
  ) : async Types.GameSession {
    if (caller.isAnonymous()) Runtime.trap("Anonymous callers cannot create sessions");
    let id      = sessionState.nextSessionId;
    sessionState.nextSessionId += 1;
    let session = PlayEngine.createSession(id, caller, gameId, inviteCode);
    saveSession(session);
    session;
  };

  public shared ({ caller }) func joinGameSession(
    sessionId : Types.GameSessionId
  ) : async {#ok: Types.GameSession; #err: Text} {
    if (caller.isAnonymous()) return #err("Anonymous callers cannot join sessions");
    let session = requireSession(sessionId);
    switch (PlayEngine.joinSession(session, caller)) {
      case (#err(e))      #err(e);
      case (#ok(updated)) { saveSession(updated); #ok(updated) };
    };
  };

  public shared ({ caller }) func initGameState(
    sessionId      : Types.GameSessionId,
    hostDeckCards  : [Types.Card],
    guestDeckCards : [Types.Card],
    gameDefinition : Types.GameDefinition
  ) : async Types.GameSession {
    let session = requireSession(sessionId);
    if (not Principal.equal(session.hostId, caller)) Runtime.trap("Only the host can initialize the game");
    let updated = PlayEngine.initializeGameState(session, hostDeckCards, guestDeckCards, gameDefinition);
    saveSession(updated);
    updated;
  };

  public query func getGameSession(
    sessionId : Types.GameSessionId
  ) : async ?Types.GameSession {
    gameSessions.get(sessionId);
  };

  public shared ({ caller }) func drawCard(
    sessionId : Types.GameSessionId
  ) : async {#ok: Types.GameSession; #err: Text} {
    let session = requireSession(sessionId);
    if (not isParticipant(session, caller)) return #err("Not a participant");
    switch (PlayEngine.drawCard(session, caller)) {
      case (#err(e))      #err(e);
      case (#ok(updated)) { saveSession(updated); #ok(updated) };
    };
  };

  public shared ({ caller }) func playCard(
    sessionId : Types.GameSessionId,
    cardId    : Types.CardId,
    card      : Types.Card
  ) : async {#ok: Types.GameSession; #err: Text} {
    let session = requireSession(sessionId);
    if (not isParticipant(session, caller)) return #err("Not a participant");
    switch (PlayEngine.playCard(session, caller, cardId, card)) {
      case (#err(e))      #err(e);
      case (#ok(updated)) { saveSession(updated); #ok(updated) };
    };
  };

  public shared ({ caller }) func declareAttackers(
    sessionId       : Types.GameSessionId,
    attackerIndices : [Nat]
  ) : async {#ok: Types.GameSession; #err: Text} {
    let session = requireSession(sessionId);
    if (not isParticipant(session, caller)) return #err("Not a participant");
    switch (PlayEngine.declareAttackers(session, caller, attackerIndices)) {
      case (#err(e))      #err(e);
      case (#ok(updated)) { saveSession(updated); #ok(updated) };
    };
  };

  public shared ({ caller }) func assignBlockers(
    sessionId           : Types.GameSessionId,
    blockingInstanceIds : [Nat]
  ) : async {#ok: Types.GameSession; #err: Text} {
    let session = requireSession(sessionId);
    if (not isParticipant(session, caller)) return #err("Not a participant");
    switch (PlayEngine.assignBlockers(session, caller, blockingInstanceIds)) {
      case (#err(e))      #err(e);
      case (#ok(updated)) { saveSession(updated); #ok(updated) };
    };
  };

  public shared ({ caller }) func useAbility(
    sessionId        : Types.GameSessionId,
    sourceInstanceId : Nat,
    abilityId        : Nat,
    targetInstanceId : ?Nat,
    effects          : [Types.AbilityEffect]
  ) : async {#ok: Types.GameSession; #err: Text} {
    let session = requireSession(sessionId);
    if (not isParticipant(session, caller)) return #err("Not a participant");
    switch (PlayEngine.useAbility(session, caller, sourceInstanceId, abilityId, targetInstanceId)) {
      case (#err(e))      #err(e);
      case (#ok(logged))  {
        let resolved = PlayEngine.resolveAbilityEffects(logged, caller, effects, targetInstanceId);
        saveSession(resolved);
        #ok(resolved);
      };
    };
  };

  public shared ({ caller }) func endPhase(
    sessionId : Types.GameSessionId
  ) : async {#ok: Types.GameSession; #err: Text} {
    let session = requireSession(sessionId);
    if (not isParticipant(session, caller)) return #err("Not a participant");
    switch (PlayEngine.endPhase(session, caller, requireGameDef())) {
      case (#err(e))      #err(e);
      case (#ok(updated)) {
        switch (updated.result) {
          case (?res) {
            switch (session.result) {
              case null { completedResults.add(res) };
              case _ {};
            };
          };
          case null {};
        };
        saveSession(updated); #ok(updated)
      };
    };
  };

  public shared ({ caller }) func takeMulligan(
    sessionId : Types.GameSessionId
  ) : async {#ok: Types.GameSession; #err: Text} {
    let session = requireSession(sessionId);
    if (not isParticipant(session, caller)) return #err("Not a participant");
    switch (PlayEngine.takeMulligan(session, caller)) {
      case (#err(e))      #err(e);
      case (#ok(updated)) { saveSession(updated); #ok(updated) };
    };
  };

  public shared ({ caller }) func discardCard(
    sessionId : Types.GameSessionId,
    handIndex : Nat
  ) : async {#ok: Types.GameSession; #err: Text} {
    let session = requireSession(sessionId);
    if (not isParticipant(session, caller)) return #err("Not a participant");
    // Look up caller's player state directly from session
    let psOpt = session.state.playerStates.find(
      func(ps) { Principal.equal(ps.playerId, caller) }
    );
    let ps = switch (psOpt) {
      case (?p) p;
      case null return #err("Player state not found");
    };
    if (handIndex >= ps.hand.size()) return #err("Invalid hand index");
    let cardId = ps.hand[handIndex];
    switch (PlayEngine.discardCard(session, caller, cardId)) {
      case (#err(e))      #err(e);
      case (#ok(updated)) { saveSession(updated); #ok(updated) };
    };
  };

  public shared ({ caller }) func concedeGame(
    sessionId : Types.GameSessionId
  ) : async {#ok: Types.GameSession; #err: Text} {
    let session = requireSession(sessionId);
    if (not isParticipant(session, caller)) return #err("Not a participant");
    switch (PlayEngine.concede(session, caller)) {
      case (#err(e))      #err(e);
      case (#ok(updated)) { saveSession(updated); #ok(updated) };
    };
  };

  public query func getGameStats() : async Types.GameStats {
    let results = completedResults.toArray();
    var activeCount : Nat = 0;
    for ((_, s) in gameSessions.entries()) {
      if (s.state.status == #InProgress) activeCount += 1;
    };
    let cardRates = cardUseLog.entries().map(
      func((id, (uses, wins)) : (Types.CardId, (Nat, Nat))) : Types.CardUsageStat {
        { cardId = id; uses; wins }
      }
    ).toArray();
    let recentGames : [Types.GameResult] = if (results.size() <= 10) results
                     else results.sliceToArray((results.size() - 10 : Nat), results.size());
    {
      gamesPlayed  = results.size();
      activePlayers = activeCount;
      recentGames;
      cardWinRates = cardRates;
    };
  };

  public query func getDashboardData() : async Types.DashboardData {
    let results = completedResults.toArray();
    var activeCount : Nat = 0;
    for ((_, s) in gameSessions.entries()) {
      if (s.state.status == #InProgress) activeCount += 1;
    };
    let cardRates = cardUseLog.entries().map(
      func((id, (uses, wins)) : (Types.CardId, (Nat, Nat))) : Types.CardUsageStat {
        { cardId = id; uses; wins }
      }
    ).toArray();
    let recentGames : [Types.GameResult] = if (results.size() <= 10) results
                     else results.sliceToArray((results.size() - 10 : Nat), results.size());
    let gameStats : Types.GameStats = {
      gamesPlayed  = results.size();
      activePlayers = activeCount;
      recentGames;
      cardWinRates = cardRates;
    };
    let gDef = GS.getGame(state);
    let playerCount = GS.listPlayers(state, switch (gDef) {
      case (?g) g.id; case null 0
    }).size();
    let cardCount = switch (gDef) {
      case (?g) GS.listCards(state, g.id).size();
      case null 0;
    };
    { stats = gameStats; playerCount; cardCount };
  };

  public query func getGameLog(
    sessionId : Types.GameSessionId
  ) : async [Types.GameLogEntry] {
    switch (gameSessions.get(sessionId)) {
      case (?s)  s.log;
      case null  [];
    };
  };
};

