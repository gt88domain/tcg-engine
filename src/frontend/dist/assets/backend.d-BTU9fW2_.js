var GamePhase = /* @__PURE__ */ ((GamePhase2) => {
  GamePhase2["End"] = "End";
  GamePhase2["Start"] = "Start";
  GamePhase2["Draw"] = "Draw";
  GamePhase2["Main"] = "Main";
  GamePhase2["Combat"] = "Combat";
  return GamePhase2;
})(GamePhase || {});
var GameVisibility = /* @__PURE__ */ ((GameVisibility2) => {
  GameVisibility2["Open"] = "Open";
  GameVisibility2["Private"] = "Private";
  GameVisibility2["InviteOnly"] = "InviteOnly";
  return GameVisibility2;
})(GameVisibility || {});
var Role = /* @__PURE__ */ ((Role2) => {
  Role2["CoDesigner"] = "CoDesigner";
  Role2["Playtester"] = "Playtester";
  Role2["Player"] = "Player";
  Role2["Spectator"] = "Spectator";
  Role2["Owner"] = "Owner";
  return Role2;
})(Role || {});
export {
  GamePhase as G,
  Role as R,
  GameVisibility as a
};
