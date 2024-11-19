import React, { createContext, useContext, useState } from "react";
import { PlayerData } from "./types/PlayerData";

interface AppState {
  availablePlayers: PlayerData[];
  currentTeamA: PlayerData[];
  currentTeamB: PlayerData[];
  previousTeamA: PlayerData[];
  previousTeamB: PlayerData[];
  rerollAttempts: number;

  setAvailablePlayers: (players: PlayerData[]) => void;
  // setAvailablePlayers: React.Dispatch<React.SetStateAction<PlayerData[]>>;
  setCurrentTeamA: (team: PlayerData[]) => void;
  setCurrentTeamB: (team: PlayerData[]) => void;
  incrementRerollAttempts: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [availablePlayers, setAvailablePlayers] = useState<PlayerData[]>([]);
  const [currentTeamA, setCurrentTeamA] = useState<PlayerData[]>([]);
  const [currentTeamB, setCurrentTeamB] = useState<PlayerData[]>([]);
  const [previousTeamA, setPreviousTeamA] = useState<PlayerData[]>([]);
  const [previousTeamB, setPreviousTeamB] = useState<PlayerData[]>([]);
  const [rerollAttempts, setRerollAttempts] = useState<number>(0);

  const incrementRerollAttempts = () => setRerollAttempts((prev) => prev + 1);

  return (
    <AppContext.Provider
      value={{
        availablePlayers,
        currentTeamA,
        currentTeamB,
        previousTeamA,
        previousTeamB,
        rerollAttempts,
        setAvailablePlayers,
        setCurrentTeamA,
        setCurrentTeamB,
        incrementRerollAttempts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
