import { beforeEach, expect, Mock, test, vi } from "vitest";
import { PlayersList } from "./PlayersList";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { AppProvider } from "./AppContext";
import { Teams } from "./Teams";
import html2canvas from "html2canvas";

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

  const availablePlayers = screen.getAllByTestId("player-card");
  const firstSixPlayers = availablePlayers.slice(0, 6);

  firstSixPlayers.forEach((player) => {
    fireEvent.click(player);
  });

  const teamA = screen.getByTestId("team-Alpha");
  const firstPlayer = teamA.querySelectorAll("li");

  const lockedPlayer = firstPlayer[0];
  const playerName = lockedPlayer.textContent?.match(/^.*?#\d{4}/g)?.[0];
  const lockButton = screen.getByTestId(
    `lock-player-button-${playerName?.replace(/\s/g, "-")}`,
  );
  fireEvent.click(lockButton);

  expect(lockButton.textContent).toBe("Unlock");

  const shuffleButton = screen.getByTestId("shuffle-teams-button");
  for (let i = 0; i < 10; i++) {
    fireEvent.click(shuffleButton);
    const shuffledTeamPlayers = screen
      .getByTestId("team-Alpha")
      .querySelectorAll("li");

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

  const teamA = screen.getByTestId("team-Alpha");
  const teamB = screen.getByTestId("team-Bravo");
  const resetButton = screen.getByTestId("reset-teams-button");

  const availablePlayers = screen.getAllByTestId("player-card");
  const firstSixPlayers = availablePlayers.slice(0, 6);

  firstSixPlayers.forEach((player) => {
    fireEvent.click(player);
  });

  expect(teamA.querySelectorAll("li").length).toBeGreaterThan(0);
  expect(teamB.querySelectorAll("li").length).toBeGreaterThan(0);

  const initialAvailablePlayersCount = availablePlayers.length;

  fireEvent.click(resetButton);

  expect(teamA.getElementsByClassName("playerRow")).toHaveLength(0);
  expect(teamB.getElementsByClassName("playerRow")).toHaveLength(0);

  const finalAvailablePlayersCount = availablePlayers.length;
  const totalTeamPlayers =
    teamA.getElementsByClassName("playerRow").length +
    teamB.getElementsByClassName("playerRow").length;

  expect(finalAvailablePlayersCount).toBe(
    initialAvailablePlayersCount + totalTeamPlayers,
  );
});

test.skip("did player change the team on click button", () => {
  render(
    <AppProvider>
      <PlayersList />
      <Teams />
    </AppProvider>,
  );

  const availablePlayers = screen.getAllByTestId("player-row");
  const firstSixPlayers = availablePlayers.slice(0, 6);

  const clickPlayers = (count: number) => {
    for (let i = 0; i < count; i++) {
      fireEvent.click(screen.getAllByTestId("player-row")[0]);
    }
  };

  clickPlayers(6);

  const playerToChange = firstSixPlayers[0];

  const playerNameSpan = playerToChange.querySelector(
    `[data-testid^="player-"]`,
  ) as HTMLElement;

  // const playerName = playerToChange.textContent?.split(" ")[0];
  const playerName = playerNameSpan?.textContent?.match(/^.*?#\d{4}/g)?.[0];

  for (let i = 0; i < 10; i++) {
    const changeTeamButton = screen.getByTestId(
      `change-team-button-${playerName?.replace(/\s/g, "-")}`,
    );
    fireEvent.click(changeTeamButton);
    const teamB = screen.getByTestId("team-Bravo");
    const teamA = screen.getByTestId("team-Alpha");

    const isPlayerInTeamA = Array.from(teamA.querySelectorAll("li")).some(
      (player) => player.textContent?.includes(playerName!),
    );

    const isPlayerInTeamB = Array.from(teamB.querySelectorAll("li")).some(
      (player) => player.textContent?.includes(playerName!),
    );

    if (i % 2 === 0) {
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

  const availablePlayers = screen.getAllByTestId("player-row");
  const firstSixPlayers = availablePlayers.slice(0, 6);

  firstSixPlayers.forEach((player) => {
    fireEvent.click(player);
  });

  const teamA = screen.getByTestId("team-Alpha");
  const teamB = screen.getByTestId("team-Bravo");

  expect(
    teamA.querySelectorAll("[data-testid='player-card']").length +
      teamB.querySelectorAll("[data-testid='player-card']").length,
  ).toBe(6);

  const clickPlayers = (team: string, count: number) => {
    const teamElement = within(screen.getByTestId(`team-${team}`));
    for (let i = 0; i < count; i++) {
      fireEvent.click(teamElement.getAllByTestId("player-card")[0]);
    }
  };

  clickPlayers("Alpha", 3);
  clickPlayers("Bravo", 3);

  const currentTeamA = screen.getByTestId("team-Alpha");
  const currentTeamB = screen.getByTestId("team-Bravo");

  expect(
    currentTeamA.querySelectorAll("[data-testid='player-card']").length,
  ).toBe(0);
  expect(
    currentTeamB.querySelectorAll("[data-testid='player-card']").length,
  ).toBe(0);

  const updatedAvailablePlayers = screen.getAllByTestId("player-row");
  expect(updatedAvailablePlayers.length).toBe(availablePlayers.length);
});

test.skip("does the criterion change", () => {
  render(
    <AppProvider>
      <PlayersList />
      <Teams />
    </AppProvider>,
  );

  const availablePlayers = screen.getAllByTestId("player-row");
  const firstSixPlayers = availablePlayers.slice(0, 6);
  const teamA = screen.getByTestId("team-Alpha");
  const teamB = screen.getByTestId("team-Bravo");

  firstSixPlayers.forEach((player) => {
    fireEvent.click(player);
  });

  // expect(teamA).toMatchInlineSnapshot();

  expect(
    teamA.getElementsByClassName("playerCard").length +
      teamB.getElementsByClassName("playerCard").length,
  ).toBe(6);

  const radioCrucible = screen.getByTestId("radio-crucible");
  const radioTrials = screen.getByTestId("radio-trials");
  // const kdDiff = screen.getByTestId("kdDiff");

  fireEvent.click(radioCrucible);
  // expect(kdDiff).toBe(screen.getByTestId("kdDiff"));
  fireEvent.click(radioTrials);
});

test.skip("min and max sliders change the values correctly", () => {
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
