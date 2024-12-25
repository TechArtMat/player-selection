import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PlayersList } from "./PlayersList";
import { Teams } from "./Teams";
import { AppProvider } from "./AppContext";

test("App renders PlayersList and Teams components", () => {
  render(
    <AppProvider>
      <PlayersList />
      <Teams />
    </AppProvider>,
  );

  const playersList = screen.getByTestId("available-players-list");
  const teams = screen.getByTestId("teams-wrapper");

  expect(playersList).not.toBe(null);
  expect(teams).not.toBe(null);
});
