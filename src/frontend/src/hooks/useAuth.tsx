import type { PlayerAccount } from "@/backend";
import { Role } from "@/backend";
import { type DemoRole, useDemoMode } from "@/context/DemoModeContext";
import { Principal } from "@dfinity/principal";

// Stable mock principal for demo mode (anonymous principal — valid parseable value)
const MOCK_PRINCIPAL = Principal.fromText("2vxsx-fae");

function demoRoleToBackendRole(demoRole: DemoRole): Role {
  switch (demoRole) {
    case "Owner":
      return Role.Owner;
    case "CoDesigner":
      return Role.CoDesigner;
    case "Playtester":
      return Role.Playtester;
    case "Player":
      return Role.Player;
    case "Spectator":
      return Role.Spectator;
  }
}

export function useAuth() {
  const { demoUser } = useDemoMode();

  return {
    identity: undefined,
    principal: MOCK_PRINCIPAL,
    isAuthenticated: demoUser !== null,
    login: () => {},
    logout: () => {},
    loginStatus: demoUser ? "success" : "idle",
  };
}

export function usePlayerRole(): {
  role: Role | null;
  isOwner: boolean;
  player: PlayerAccount | null;
  isLoading: boolean;
} {
  const { selectedRole } = useDemoMode();

  if (!selectedRole) {
    return { role: null, isOwner: false, player: null, isLoading: false };
  }

  const role = demoRoleToBackendRole(selectedRole);
  const isOwner = selectedRole === "Owner";

  return { role, isOwner, player: null, isLoading: false };
}
