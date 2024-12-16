import { beforeEach, expect, Mock, test, vi } from "vitest";
import { PlayersList } from "./PlayersList";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { AppProvider } from "./AppContext";
import { Teams } from "./Teams";
import html2canvas from "html2canvas";
import { write } from "fs";

beforeEach(() => {
  cleanup();
});

test("locked player stays in the same team after shuffling", () => {
  render(
    <AppProvider>
      <PlayersList />
      <Teams />
    </AppProvider>,
  );

  const availablePlayers = screen.getAllByTestId(/player-/i);
  const firstSixPlayers = availablePlayers.slice(0, 6);
  const teamB = screen.getByTestId("team-bravo");

  firstSixPlayers.forEach((player) => {
    fireEvent.click(player);
  });

  const lockedPlayer = firstSixPlayers[3];
  const playerName = lockedPlayer.textContent?.split(" ")[0];
  const lockButton = screen.getByTestId(
    `lock-player-button-${playerName?.replace(/\s/g, "-")}`,
  );
  fireEvent.click(lockButton);

  expect(lockButton.textContent).toBe("Unlock");

  const shuffleButton = screen.getByTestId("shuffle-teams-button");
  for (let i = 0; i < 10; i++) {
    fireEvent.click(shuffleButton);
    const shuffledTeamPlayers = teamB.querySelectorAll("li");

    const isPlayerInTeam = Array.from(shuffledTeamPlayers).some((player) =>
      player.textContent?.includes(playerName!),
    );
    expect(isPlayerInTeam).toBe(true);
  }
});

test("reset teams moves all players back to available players", async () => {
  render(
    <AppProvider>
      <PlayersList />
      <Teams />
    </AppProvider>,
  );

  const teamA = screen.getByTestId("team-alpha");
  const teamB = screen.getByTestId("team-bravo");
  const resetButton = screen.getByTestId("reset-teams-button");

  const availablePlayers = screen.getAllByTestId(/player-/i);
  const firstSixPlayers = availablePlayers.slice(0, 6);

  firstSixPlayers.forEach((player) => {
    fireEvent.click(player);
  });

  expect(teamA.querySelectorAll("li").length).toBeGreaterThan(0);
  expect(teamB.querySelectorAll("li").length).toBeGreaterThan(0);

  const initialAvailablePlayersCount = availablePlayers.length;

  fireEvent.click(resetButton);

  expect(teamA.querySelectorAll("li")).toHaveLength(0);
  expect(teamB.querySelectorAll("li")).toHaveLength(0);

  const finalAvailablePlayersCount = availablePlayers.length;
  const totalTeamPlayers =
    teamA.querySelectorAll("li").length + teamB.querySelectorAll("li").length;

  expect(finalAvailablePlayersCount).toBe(
    initialAvailablePlayersCount + totalTeamPlayers,
  );
});

test("did player change the team on click button", () => {
  render(
    <AppProvider>
      <PlayersList />
      <Teams />
    </AppProvider>,
  );

  const availablePlayers = screen.getAllByTestId(/player-/);
  const firstSixPlayers = availablePlayers.slice(0, 6);
  const teamB = screen.getByTestId("team-bravo");
  const teamA = screen.getByTestId("team-alpha");

  firstSixPlayers.forEach((player) => {
    fireEvent.click(player);
  });

  const playerToChange = firstSixPlayers[0];
  const playerName = playerToChange.textContent?.split(" ")[0];
  const changeTeamButton = screen.getByTestId(
    `change-team-button-${playerName?.replace(/\s/g, "-")}`,
  );

  for (let i = 0; i < 10; i++) {
    fireEvent.click(changeTeamButton);

    const isPlayerInTeamA = Array.from(teamA.querySelectorAll("li")).some(
      (player) => player.textContent?.includes(playerName!),
    );

    const isPlayerInTeamB = Array.from(teamB.querySelectorAll("li")).some(
      (player) => player.textContent?.includes(playerName!),
    );

    if (i % 1 === 0) {
      expect(isPlayerInTeamA).toBe(false);
      expect(isPlayerInTeamB).toBe(true);
    } else {
      expect(isPlayerInTeamB).toBe(false);
      expect(isPlayerInTeamA).toBe(true);
    }
  }
});

test("players return to available players on second click", () => {
  render(
    <AppProvider>
      <PlayersList />
      <Teams />
    </AppProvider>,
  );

  const availablePlayers = screen.getAllByTestId(/player-/);
  const firstSixPlayers = availablePlayers.slice(0, 6);
  const teamA = screen.getByTestId("team-alpha");
  const teamB = screen.getByTestId("team-bravo");

  firstSixPlayers.forEach((player) => {
    fireEvent.click(player);
  });

  expect(
    teamA.querySelectorAll("li").length + teamB.querySelectorAll("li").length,
  ).toBe(6);

  const allPlayersInTeams = [
    ...teamA.querySelectorAll("li > div"),
    ...teamB.querySelectorAll("li > div"),
  ];

  allPlayersInTeams.forEach((player) => {
    fireEvent.click(player);
  });

  // expect(teamB.querySelectorAll("li > div")).toMatchInlineSnapshot();
  // expect(teamA.querySelectorAll("li > div")).toMatchInlineSnapshot();

  expect(teamA.querySelectorAll("li").length).toBe(1); // 0
  expect(teamB.querySelectorAll("li").length).toBe(1); // 0

  const updatedAvailablePlayers = screen.getAllByTestId(/player-/);
  expect(updatedAvailablePlayers.length).toBe(availablePlayers.length + 2); //40
});

test("min and max sliders change the values correctly", () => {
  render(
    <AppProvider>
      <Teams />
    </AppProvider>,
  );

  const minSlider = screen.getByTestId("range-input-min");
  const maxSlider = screen.getByTestId("range-input-max");

  fireEvent.change(minSlider, { target: { value: "0.2" } });
  expect(minSlider.getAttribute("value")).toBe("0.2");

  fireEvent.change(maxSlider, { target: { value: "0.8" } });
  expect(maxSlider.getAttribute("value")).toBe("0.8");
});

vi.mock("html2canvas", () => ({
  default: vi.fn(),
}));

const mockCanvas = {
  toBlob: vi.fn((callback: (blob: Blob) => void) => {
    const blob = new Blob(["mock image"], { type: "image/png" });
    callback(blob);
  }),
};

(html2canvas as Mock).mockResolvedValue(mockCanvas);

test("copies screenshot to clipboard on button click", async () => {
  const writeTextMock = vi.fn();
  Object.defineProperty(navigator, "clipboard", {
    value: {
      write: writeTextMock,
    },
    writable: true,
  });

  render(
    <AppProvider>
      <Teams />
    </AppProvider>,
  );

  const screenshotButton = screen.getByTestId("screenshot-teams-button");
  fireEvent.click(screenshotButton);
  await waitFor(() => expect(writeTextMock).toHaveBeenCalled());
  expect(writeTextMock.mock.calls).toMatchInlineSnapshot(`
    [
      [
        [
          ClipboardItem {
            "presentationStyle": "unspecified",
          },
        ],
      ],
    ]
  `);
});
