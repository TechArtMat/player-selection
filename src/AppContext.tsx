import React, { createContext, useContext, useState } from "react";
import { PlayerData } from "./types/PlayerData";

type ShuffleCriterion = "kdTrials" | "kdCrucible";

interface AppState {
  availablePlayers: PlayerData[];
  currentTeamA: PlayerData[];
  currentTeamB: PlayerData[];
  previousTeamA: PlayerData[];
  previousTeamB: PlayerData[];

  // setAvailablePlayers: (players: PlayerData[]) => void;
  setAvailablePlayers: React.Dispatch<React.SetStateAction<PlayerData[]>>;
  setCurrentTeamA: React.Dispatch<React.SetStateAction<PlayerData[]>>;
  setCurrentTeamB: React.Dispatch<React.SetStateAction<PlayerData[]>>;
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

  return (
    <AppContext.Provider
      value={{
        availablePlayers,
        currentTeamA,
        currentTeamB,
        previousTeamA,
        previousTeamB,

        setAvailablePlayers,
        setCurrentTeamA,
        setCurrentTeamB,
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
