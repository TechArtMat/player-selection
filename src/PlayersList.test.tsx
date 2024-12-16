import { beforeEach, expect, test } from "vitest";
import { PlayersList } from "./PlayersList";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AppProvider } from "./AppContext";
import { Teams } from "./Teams";

beforeEach(() => {
  cleanup();
});

test("render playersList without troubles", async () => {
  render(
    <AppProvider>
      <PlayersList />
    </AppProvider>,
  );
  expect((await screen.findAllByTestId("player-row")).length > 20).toBe(true);
});

test("add players", async () => {
  render(
    <AppProvider>
      <PlayersList />
      <Teams />
    </AppProvider>,
  );
});

test("add a player through the form without space and special symbols", async () => {
  render(
    <AppProvider>
      <PlayersList />
    </AppProvider>,
  );

  const nameInput = screen.getByTestId("name-input");
  const clanTagInput = screen.getByTestId("clanTag-input");
  const kdTrialsInput = screen.getByTestId("kdTrials-input");
  const kdCrucibleInput = screen.getByTestId("kdCrucible-input");
  const submitButton = screen.getByTestId("submit-button");

  fireEvent.change(nameInput, { target: { value: "TestPlayer#1234" } });
  fireEvent.change(clanTagInput, { target: { value: "TestClan" } });
  fireEvent.change(kdTrialsInput, { target: { value: "1.5" } });
  fireEvent.change(kdCrucibleInput, { target: { value: "2.0" } });

  fireEvent.click(submitButton);

  const rows = await screen.findAllByTestId("player-row");
  const newPlayerRow = rows.find((row) =>
    row.textContent?.includes("TestPlayer#1234"),
  );

  expect(newPlayerRow).toBeTruthy();
});

test("add a player through the form with space and special symbols", async () => {
  render(
    <AppProvider>
      <PlayersList />
    </AppProvider>,
  );

  const nameInput = screen.getByTestId("name-input");
  const clanTagInput = screen.getByTestId("clanTag-input");
  const kdTrialsInput = screen.getByTestId("kdTrials-input");
  const kdCrucibleInput = screen.getByTestId("kdCrucible-input");
  const submitButton = screen.getByTestId("submit-button");

  fireEvent.change(nameInput, { target: { value: "Test P/la.yer#1234" } });
  fireEvent.change(clanTagInput, { target: { value: "TestClan" } });
  fireEvent.change(kdTrialsInput, { target: { value: "1.5" } });
  fireEvent.change(kdCrucibleInput, { target: { value: "2.0" } });

  fireEvent.click(submitButton);

  const rows = await screen.findAllByTestId("player-row");
  const newPlayerRow = rows.find((row) =>
    row.textContent?.includes("Test P/la.yer#1234"),
  );

  expect(newPlayerRow).toBeTruthy();
});

test("add a player through the form and filter by search", async () => {
  render(
    <AppProvider>
      <PlayersList />
    </AppProvider>,
  );

  const nameInput = screen.getByTestId("name-input");
  const clanTagInput = screen.getByTestId("clanTag-input");
  const kdTrialsInput = screen.getByTestId("kdTrials-input");
  const kdCrucibleInput = screen.getByTestId("kdCrucible-input");
  const submitButton = screen.getByTestId("submit-button");

  fireEvent.change(nameInput, { target: { value: "Test Player#1234" } });
  fireEvent.change(clanTagInput, { target: { value: "TestClan" } });
  fireEvent.change(kdTrialsInput, { target: { value: "1.5" } });
  fireEvent.change(kdCrucibleInput, { target: { value: "2.0" } });

  fireEvent.click(submitButton);

  const rows = await screen.findAllByTestId("player-row");
  const newPlayerRow = rows.find((row) =>
    row.textContent?.includes("Test Player#1234"),
  );
  expect(newPlayerRow).toBeTruthy();

  const searchInput = screen
    .getByTestId("search-players-input")
    .querySelector("input");
  fireEvent.change(searchInput!, { target: { value: "Test Player#1234" } });

  const filteredRows = screen.getAllByTestId("player-row");
  expect(filteredRows.length).toBe(1);

  expect(filteredRows[0].textContent).toContain("Test Player#1234");
});

test("should correctly import players and update availablePlayers", async () => {
  render(
    <AppProvider>
      <PlayersList />
    </AppProvider>,
  );

  const playerBaseInput = screen.getByTestId("players-base-input");
  fireEvent.change(playerBaseInput, {
    target: { value: "TestPlayer1#1234 Tag 1 1\nTestPlayer2#1234 Tag 2 2" },
  });

  const playerBaseSubmitButton = screen.getByTestId(
    "players-base-submit-button",
  );
  fireEvent.click(playerBaseSubmitButton);
  const availablePlayers = screen.getAllByTestId(/player-/i);

  expect(
    availablePlayers.find((row) =>
      row.textContent?.includes("TestPlayer1#1234"),
    ),
  ).toBeTruthy();

  expect(
    availablePlayers.find((row) =>
      row.textContent?.includes("TestPlayer2#1234"),
    ),
  ).toBeTruthy();
});
