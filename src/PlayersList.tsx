import data from './playersData.tsv?raw'

export function PlayersList() {
    const parseData = parsePlayerData(data)
    console.log({ parseData })
    return <ul>{parseData.map(playerData => {


        return <li>{playerData.name}</li>
    })}</ul>
}

type PlayerData = {
    name: string,
    clanTag: string,
    kdTrials: number,
    kdCrucible: number,
};

function parsePlayerData(baseText: string) {
    const availablePlayers: PlayerData[] = [];
    const lines = baseText.split('\n');

    lines.forEach(line => {
        if (line.includes('#')) {
            let [name, other] = line.split("#");
            if (!other) return;

            let parts = other.split("\t");
            name = name + "#" + (parts[0] || '');
            let [clanTag, kdTrials, kdCrucible] = parts.slice(1);

            const player = {
                name,
                clanTag,
                kdTrials: parseFloat(kdTrials) || 0,
                kdCrucible: parseFloat(kdCrucible) || 0
            };
            availablePlayers.push(player);
        } else {
            let parts = line.split(/\s+/);
            let [name, clanTag, kdTrials, kdCrucible] = parts;

            const player = {
                name,
                clanTag,
                kdTrials: parseFloat(kdTrials) || 0,
                kdCrucible: parseFloat(kdCrucible) || 0
            };
            availablePlayers.push(player);
        }
    });
    return availablePlayers
}