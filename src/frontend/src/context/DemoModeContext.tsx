import { type ReactNode, createContext, useContext, useState } from "react";

export type DemoRole =
  | "Owner"
  | "CoDesigner"
  | "Playtester"
  | "Player"
  | "Spectator";

export interface DemoUser {
  name: string;
  principalMock: string;
  initials: string;
}

const DEMO_USERS: Record<DemoRole, DemoUser> = {
  Owner: {
    name: "Alex Designer",
    principalMock: "demo-owner-principal",
    initials: "AD",
  },
  CoDesigner: {
    name: "Sam Co-Designer",
    principalMock: "demo-codesigner-principal",
    initials: "SC",
  },
  Playtester: {
    name: "Jordan Tester",
    principalMock: "demo-playtester-principal",
    initials: "JT",
  },
  Player: {
    name: "Taylor Player",
    principalMock: "demo-player-principal",
    initials: "TP",
  },
  Spectator: {
    name: "Riley Watcher",
    principalMock: "demo-spectator-principal",
    initials: "RW",
  },
};

interface DemoModeContextValue {
  selectedRole: DemoRole;
  demoUser: DemoUser;
  setRole: (role: DemoRole) => void;
  isRoleSelected: true;
}

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [selectedRole, setSelectedRole] = useState<DemoRole>("Owner");

  const demoUser = DEMO_USERS[selectedRole];

  function setRole(role: DemoRole) {
    setSelectedRole(role);
  }

  return (
    <DemoModeContext.Provider
      value={{
        selectedRole,
        demoUser,
        setRole,
        isRoleSelected: true,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode(): DemoModeContextValue {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error("useDemoMode must be used inside DemoModeProvider");
  return ctx;
}
