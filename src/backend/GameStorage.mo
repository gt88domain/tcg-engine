import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Types "Types";
import Int "mo:core/Int";

module {

  // ── Shared mutable state ────────────────────────────────────────────────────

  public type State = {
    // One game per instance
    var gameDefinition : ?Types.GameDefinition;
    // Card library
    cards              : Map.Map<Types.CardId, Types.Card>;
    cardCounter        : { var next : Nat };
    // Decks
    decks              : Map.Map<Types.DeckId, Types.Deck>;
    deckCounter        : { var next : Nat };
    // Players keyed by Principal text
    players            : Map.Map<Text, Types.PlayerAccount>;
    // Invite links keyed by code
    inviteLinks        : Map.Map<Text, Types.InviteLink>;
    // Game version history (max 10)
    var gameVersionHistory : [Types.GameVersionSnapshot];
  };

  public func newState() : State {
    {
      var gameDefinition = null;
      cards              = Map.empty<Types.CardId, Types.Card>();
      cardCounter        = { var next = 1 };
      decks              = Map.empty<Types.DeckId, Types.Deck>();
      deckCounter        = { var next = 1 };
      players            = Map.empty<Text, Types.PlayerAccount>();
      inviteLinks        = Map.empty<Text, Types.InviteLink>();
      var gameVersionHistory = [];
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────

  func now() : Types.Timestamp { Time.now() };

  func isOwner(state : State, caller : Principal) : Bool {
    switch (state.gameDefinition) {
      case (?g) { Principal.equal(g.designerPrincipal, caller) };
      case null { false };
    }
  };

  /// Generate a 6-char uppercase alphanumeric code from a counter value.
  func genCode(seed : Nat) : Text {
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let charsArray = chars.toArray();
    let len = charsArray.size();
    var n = seed;
    var result = "";
    var i = 0;
    while (i < 6) {
      let idx = n % len;
      let ch = charsArray[idx];
      result := result # Text.fromChar(ch);
      n := n / len;
      i += 1;
    };
    result
  };

  // ── 1. Game Definition ──────────────────────────────────────────────────────

  public func createGame(
    state  : State,
    caller : Principal,
    name   : Text,
    theme  : Text,
  ) : {#ok: Types.GameDefinition; #err: Text} {
    switch (state.gameDefinition) {
      case (?_) { #err("A game already exists on this instance") };
      case null {
        let ts = now();
        let defaultResourceSystem : Types.ResourceSystem = {
          resourceName       = if (theme == "") "Mana" else theme;
          resourcesPerTurn   = 1;
          maxHandSize        = 7;
          startingLife       = 20;
          deckSizeMin        = 20;
          deckSizeMax        = 60;
          copiesPerCardLimit = 4;
        };
        let defaultCardTypes : [Types.CardTypeDefinition] = [
          { id = "creature"; name = "Creature"; staysInPlay = true  },
          { id = "spell";    name = "Spell";    staysInPlay = false },
          { id = "resource"; name = "Resource"; staysInPlay = true  },
        ];
        let defaultTurnPhases : [Types.TurnPhase] = [
          { id = "start";  name = "Start Phase";  description = "Start-of-turn effects trigger"; order = 0 },
          { id = "draw";   name = "Draw Phase";   description = "Draw a card from your library"; order = 1 },
          { id = "main";   name = "Main Phase";   description = "Play cards and abilities";       order = 2 },
          { id = "combat"; name = "Combat Phase"; description = "Attack with creatures";         order = 3 },
          { id = "end";    name = "End Phase";    description = "Discard to hand size, pass turn"; order = 4 },
        ];
        let g : Types.GameDefinition = {
          id                  = 1;
          gameName            = name;
          gameDescription     = "";
          themeColor          = "#0d9488";
          gameIcon            = "";
          name;
          designerPrincipal   = caller;
          resourceSystem      = defaultResourceSystem;
          cardTypeDefinitions = defaultCardTypes;
          cardTypes           = ["Creature", "Spell", "Resource"];
          keywords            = [];
          winConditions       = [#LifeToZero];
          turnPhases          = defaultTurnPhases;
          turnStructure       = { phases = [#Start, #Draw, #Main, #Combat, #End] };
          visibility          = #Private;
          publishedAt         = null;
          version             = 1;
          wizardStep          = 0;
          createdAt           = ts;
          updatedAt           = ts;
        };
        state.gameDefinition := ?g;
        #ok(g)
      };
    }
  };

  public func getGame(state : State) : ?Types.GameDefinition {
    state.gameDefinition
  };

  public func updateGame(
    state   : State,
    caller  : Principal,
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
    },
  ) : {#ok: Types.GameDefinition; #err: Text} {
    if (not isOwner(state, caller)) {
      return #err("Only the owner can update the game definition");
    };
    switch (state.gameDefinition) {
      case null { #err("No game exists yet") };
      case (?g) {
        let newGameName = switch (updates.gameName) { case (?v) v; case null g.gameName };
        let updated : Types.GameDefinition = {
          g with
          gameName            = newGameName;
          name                = newGameName;
          gameDescription     = switch (updates.gameDescription)     { case (?v) v; case null g.gameDescription };
          themeColor          = switch (updates.themeColor)          { case (?v) v; case null g.themeColor };
          gameIcon            = switch (updates.gameIcon)            { case (?v) v; case null g.gameIcon };
          resourceSystem      = switch (updates.resourceSystem)      { case (?v) v; case null g.resourceSystem };
          cardTypeDefinitions = switch (updates.cardTypeDefinitions) { case (?v) v; case null g.cardTypeDefinitions };
          keywords            = switch (updates.keywords)            { case (?v) v; case null g.keywords };
          winConditions       = switch (updates.winConditions)       { case (?v) v; case null g.winConditions };
          turnPhases          = switch (updates.turnPhases)          { case (?v) v; case null g.turnPhases };
          wizardStep          = switch (updates.wizardStep)          { case (?v) v; case null g.wizardStep };
          version             = g.version + 1;
          updatedAt           = now();
        };
        state.gameDefinition := ?updated;
        #ok(updated)
      };
    }
  };

  public func publishGame(
    state      : State,
    caller     : Principal,
    visibility : Types.GameVisibility,
  ) : {#ok: Types.GameDefinition; #err: Text} {
    if (not isOwner(state, caller)) {
      return #err("Only the owner can publish the game");
    };
    switch (state.gameDefinition) {
      case null { #err("No game exists yet") };
      case (?g) {
        let ts = now();
        let updated : Types.GameDefinition = {
          g with
          visibility;
          publishedAt = ?ts;
          updatedAt   = ts;
        };
        state.gameDefinition := ?updated;
        #ok(updated)
      };
    }
  };

  public func unpublishGame(
    state  : State,
    caller : Principal,
  ) : {#ok: Types.GameDefinition; #err: Text} {
    if (not isOwner(state, caller)) {
      return #err("Only the owner can unpublish the game");
    };
    switch (state.gameDefinition) {
      case null { #err("No game exists yet") };
      case (?g) {
        let updated : Types.GameDefinition = {
          g with
          visibility  = #Private;
          publishedAt = null;
          updatedAt   = now();
        };
        state.gameDefinition := ?updated;
        #ok(updated)
      };
    }
  };

  public func updateWizardStep(
    state  : State,
    caller : Principal,
    step   : Nat,
  ) : {#ok: (); #err: Text} {
    if (not isOwner(state, caller)) {
      return #err("Only the owner can update the wizard step");
    };
    switch (state.gameDefinition) {
      case null { #err("No game exists yet") };
      case (?g) {
        let updated : Types.GameDefinition = {
          g with
          wizardStep = step;
          updatedAt  = now();
        };
        state.gameDefinition := ?updated;
        #ok(())
      };
    }
  };

  public func saveGameVersion(
    state       : State,
    caller      : Principal,
    description : Text,
  ) {
    if (not isOwner(state, caller)) return;
    switch (state.gameDefinition) {
      case null {};
      case (?g) {
        let snapshot : Types.GameVersionSnapshot = {
          timestamp      = now();
          description;
          gameDefinition = g;
        };
        let history = state.gameVersionHistory;
        let newHistory : [Types.GameVersionSnapshot] = if (history.size() >= 10) {
          // Drop oldest, append new
          history.sliceToArray(1, history.size()).concat([snapshot])
        } else {
          history.concat([snapshot])
        };
        state.gameVersionHistory := newHistory;
      };
    }
  };

  public func getGameVersionHistory(state : State) : [Types.GameVersionSnapshot] {
    state.gameVersionHistory
  };

  // ── 2. Card Library ─────────────────────────────────────────────────────────

  func requireGame(state : State) : Types.GameId {
    switch (state.gameDefinition) {
      case (?g) { g.id };
      case null { Runtime.trap("No game exists on this instance") };
    }
  };

  public func createCard(
    state  : State,
    caller : Principal,
    req    : {
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
    },
  ) : {#ok: Types.Card; #err: Text} {
    if (not isOwner(state, caller)) {
      return #err("Only the owner or co-designer can create cards");
    };
    let gameId = requireGame(state);
    let id = state.cardCounter.next;
    state.cardCounter.next += 1;
    let ts = now();
    let card : Types.Card = {
      id;
      gameId;
      name        = req.name;
      cost        = req.cost;
      attack      = req.attack;
      defense     = req.defense;
      cardType    = req.cardType;
      tags        = req.tags;
      abilities   = req.abilities;
      rulesText   = req.rulesText;
      flavourText = req.flavourText;
      artUrl      = req.artUrl;
      createdAt   = ts;
      updatedAt   = ts;
    };
    state.cards.add(id, card);
    #ok(card)
  };

  public func getCard(state : State, id : Types.CardId) : ?Types.Card {
    state.cards.get(id)
  };

  public func listCards(state : State, gameId : Types.GameId) : [Types.Card] {
    let buf = List.empty<Types.Card>();
    for ((_, card) in state.cards.entries()) {
      if (card.gameId == gameId) { buf.add(card) };
    };
    buf.toArray()
  };

  public func updateCard(
    state  : State,
    caller : Principal,
    id     : Types.CardId,
    req    : {
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
    },
  ) : {#ok: Types.Card; #err: Text} {
    if (not isOwner(state, caller)) {
      return #err("Only the owner or co-designer can update cards");
    };
    switch (state.cards.get(id)) {
      case null { #err("Card not found") };
      case (?card) {
        let updated : Types.Card = {
          card with
          name        = switch (req.name)        { case (?v) v;    case null card.name };
          cost        = switch (req.cost)        { case (?v) v;    case null card.cost };
          attack      = switch (req.attack)      { case (?v) v;    case null card.attack };
          defense     = switch (req.defense)     { case (?v) v;    case null card.defense };
          cardType    = switch (req.cardType)    { case (?v) v;    case null card.cardType };
          tags        = switch (req.tags)        { case (?v) v;    case null card.tags };
          abilities   = switch (req.abilities)   { case (?v) v;    case null card.abilities };
          rulesText   = switch (req.rulesText)   { case (?v) v;    case null card.rulesText };
          flavourText = switch (req.flavourText) { case (?v) v;    case null card.flavourText };
          artUrl      = switch (req.artUrl)      { case (?v) v;    case null card.artUrl };
          updatedAt   = now();
        };
        state.cards.add(id, updated);
        #ok(updated)
      };
    }
  };

  public func deleteCard(
    state  : State,
    caller : Principal,
    id     : Types.CardId,
  ) : {#ok: (); #err: Text} {
    if (not isOwner(state, caller)) {
      return #err("Only the owner or co-designer can delete cards");
    };
    switch (state.cards.get(id)) {
      case null { #err("Card not found") };
      case (?_) {
        state.cards.remove(id);
        #ok(())
      };
    }
  };

  // ── 3. Deck Storage ─────────────────────────────────────────────────────────

  public func createDeck(
    state  : State,
    caller : Principal,
    gameId : Types.GameId,
    name   : Text,
    cards  : [Types.DeckEntry],
  ) : {#ok: Types.Deck; #err: Text} {
    let id = state.deckCounter.next;
    state.deckCounter.next += 1;
    let ts = now();
    let deck : Types.Deck = {
      id;
      gameId;
      ownerId       = caller;
      name;
      cards;
      isStarterDeck = false;
      isPublished   = false;
      createdAt     = ts;
      updatedAt     = ts;
    };
    state.decks.add(id, deck);
    #ok(deck)
  };

  public func getDeck(state : State, id : Types.DeckId) : ?Types.Deck {
    state.decks.get(id)
  };

  public func listDecks(
    state   : State,
    ownerId : ?Types.UserId,
    gameId  : Types.GameId,
  ) : [Types.Deck] {
    let buf = List.empty<Types.Deck>();
    for ((_, deck) in state.decks.entries()) {
      if (deck.gameId == gameId) {
        let ownerMatch = switch (ownerId) {
          case null  { true };
          case (?uid) { Principal.equal(deck.ownerId, uid) };
        };
        if (ownerMatch) { buf.add(deck) };
      };
    };
    buf.toArray()
  };

  public func updateDeck(
    state  : State,
    caller : Principal,
    id     : Types.DeckId,
    name   : ?Text,
    cards  : ?[Types.DeckEntry],
  ) : {#ok: Types.Deck; #err: Text} {
    switch (state.decks.get(id)) {
      case null { #err("Deck not found") };
      case (?deck) {
        if (not Principal.equal(deck.ownerId, caller) and not isOwner(state, caller)) {
          return #err("Only the deck owner or game owner can update this deck");
        };
        let updated : Types.Deck = {
          deck with
          name      = switch (name)  { case (?n) n; case null deck.name };
          cards     = switch (cards) { case (?c) c; case null deck.cards };
          updatedAt = now();
        };
        state.decks.add(id, updated);
        #ok(updated)
      };
    }
  };

  public func deleteDeck(
    state  : State,
    caller : Principal,
    id     : Types.DeckId,
  ) : {#ok: (); #err: Text} {
    switch (state.decks.get(id)) {
      case null { #err("Deck not found") };
      case (?deck) {
        if (not Principal.equal(deck.ownerId, caller) and not isOwner(state, caller)) {
          return #err("Only the deck owner or game owner can delete this deck");
        };
        state.decks.remove(id);
        #ok(())
      };
    }
  };

  public func validateDeck(
    state  : State,
    gameId : Types.GameId,
    cards  : [Types.DeckEntry],
  ) : Types.DeckValidation {
    let errors = List.empty<Text>();
    var deckSize = 0;

    // Check card existence and belong to this game
    for (entry in cards.values()) {
      deckSize += entry.count;
      switch (state.cards.get(entry.cardId)) {
        case null {
          errors.add("Card " # entry.cardId.toText() # " does not exist");
        };
        case (?card) {
          if (card.gameId != gameId) {
            errors.add("Card " # entry.cardId.toText() # " does not belong to this game");
          };
          if (entry.count == 0) {
            errors.add("Card " # entry.cardId.toText() # " has count 0");
          };
          if (entry.count > 4) {
            errors.add("Card " # entry.cardId.toText() # " exceeds max copies (4)");
          };
        };
      };
    };

    if (deckSize < 20) {
      errors.add("Deck must have at least 20 cards (has " # deckSize.toText() # ")");
    };
    if (deckSize > 60) {
      errors.add("Deck must have at most 60 cards (has " # deckSize.toText() # ")");
    };

    {
      isValid  = errors.size() == 0;
      errors   = errors.toArray();
      deckSize;
    }
  };

  public func setStarterDeck(
    state  : State,
    caller : Principal,
    id     : Types.DeckId,
  ) : {#ok: (); #err: Text} {
    if (not isOwner(state, caller)) {
      return #err("Only the owner can set the starter deck");
    };
    switch (state.decks.get(id)) {
      case null { #err("Deck not found") };
      case (?deck) {
        // Clear existing starter decks
        for ((did, d) in state.decks.entries()) {
          if (d.isStarterDeck) {
            state.decks.add(did, { d with isStarterDeck = false });
          };
        };
        state.decks.add(id, { deck with isStarterDeck = true });
        #ok(())
      };
    }
  };

  // ── 4. Player Account Storage ───────────────────────────────────────────────

  public func registerPlayer(
    state     : State,
    principal : Principal,
    gameId    : Types.GameId,
    role      : Types.Role,
    username  : ?Text,
  ) : Types.PlayerAccount {
    let key = principal.toText();
    switch (state.players.get(key)) {
      case (?existing) { existing };
      case null {
        let account : Types.PlayerAccount = {
          principal;
          gameId;
          role;
          username;
          record   = { wins = 0; losses = 0; gamesPlayed = 0 };
          joinedAt = now();
        };
        state.players.add(key, account);
        account
      };
    }
  };

  public func getPlayer(state : State, principal : Principal) : ?Types.PlayerAccount {
    state.players.get(principal.toText())
  };

  public func listPlayers(state : State, gameId : Types.GameId) : [Types.PlayerAccount] {
    let buf = List.empty<Types.PlayerAccount>();
    for ((_, p) in state.players.entries()) {
      if (p.gameId == gameId) { buf.add(p) };
    };
    buf.toArray()
  };

  public func updatePlayerRole(
    state           : State,
    caller          : Principal,
    targetPrincipal : Principal,
    newRole         : Types.Role,
  ) : {#ok: Types.PlayerAccount; #err: Text} {
    if (not isOwner(state, caller)) {
      return #err("Only the owner can change player roles");
    };
    let key = targetPrincipal.toText();
    switch (state.players.get(key)) {
      case null { #err("Player not found") };
      case (?p) {
        let updated : Types.PlayerAccount = { p with role = newRole };
        state.players.add(key, updated);
        #ok(updated)
      };
    }
  };

  public func updatePlayerRecord(
    state     : State,
    principal : Principal,
    won       : Bool,
  ) {
    let key = principal.toText();
    switch (state.players.get(key)) {
      case null {};
      case (?p) {
        let rec = p.record;
        let updated : Types.PlayerAccount = {
          p with
          record = {
            wins        = if (won) { rec.wins + 1 } else { rec.wins };
            losses      = if (won) { rec.losses } else { rec.losses + 1 };
            gamesPlayed = rec.gamesPlayed + 1;
          };
        };
        state.players.add(key, updated);
      };
    }
  };

  // ── 5. Invite Link Storage ───────────────────────────────────────────────────

  public func createInviteLink(
    state  : State,
    caller : Principal,
    gameId : Types.GameId,
  ) : Types.InviteLink {
    // Use current time + size as seed for code uniqueness
    let seed = state.inviteLinks.size() + (Int.abs(now()) % 99991);
    let code = genCode(seed);
    let link : Types.InviteLink = {
      code;
      gameId;
      createdBy = caller;
      expiresAt = null;
      usedBy    = [];
    };
    state.inviteLinks.add(code, link);
    link
  };

  public func getInviteLink(state : State, code : Text) : ?Types.InviteLink {
    state.inviteLinks.get(code)
  };

  public func useInviteLink(
    state     : State,
    code      : Text,
    principal : Principal,
  ) : {#ok: Types.InviteLink; #err: Text} {
    switch (state.inviteLinks.get(code)) {
      case null { #err("Invite link not found") };
      case (?link) {
        let principalText = principal.toText();
        // Check already used by this principal
        let alreadyUsed = link.usedBy.find(func(s : Text) : Bool { s == principalText });
        switch (alreadyUsed) {
          case (?_) { #ok(link) }; // idempotent
          case null {
            // Check expiry
            switch (link.expiresAt) {
              case (?exp) {
                if (now() > exp) { return #err("Invite link has expired") };
              };
              case null {};
            };
            let updated : Types.InviteLink = {
              link with
              usedBy = link.usedBy.concat([principalText]);
            };
            state.inviteLinks.add(code, updated);
            #ok(updated)
          };
        }
      };
    }
  };

  public func listInviteLinks(state : State, gameId : Types.GameId) : [Types.InviteLink] {
    let buf = List.empty<Types.InviteLink>();
    for ((_, link) in state.inviteLinks.entries()) {
      if (link.gameId == gameId) { buf.add(link) };
    };
    buf.toArray()
  };

};
