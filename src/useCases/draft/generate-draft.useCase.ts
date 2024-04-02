import { IDraft, ITeam } from "@/domain/draft.domain";
import { IPlayer } from "@/domain/player.domain";
import { draftEvent } from "@/store/draft/draft-events";
import playerStore from "@/store/player/player-store";

const calculatePlayerScore = (player: IPlayer) => {
  return Number(player.score) + Number(player.wins) * 5 + Number(player.power) * 20;
};

const execute = (config: Partial<IDraft>, callBack: () => void) => {
  const { players } = playerStore.getState();
  const dataSource = [...players];
  const teamList = [];
  const totalTeams = Number(config!.teamsQuantity);

  if (!dataSource?.length) {
    window.alert("Não há jogadores disponíveis.");
    return;
  }

  for (let i = 0; i < totalTeams; i++) {
    const team: ITeam = {
      id: String(i + 1),
      name: `Team ${i + 1}`,
      players: [],
    };

    let bestPlayerIndex = 0;
    let bestPlayerScore = 0;
    for (let j = 0; j < dataSource.length; j++) {
      const playerScore = calculatePlayerScore(dataSource[j]);
      if (playerScore > bestPlayerScore) {
        bestPlayerIndex = j;
        bestPlayerScore = playerScore;
      }
    }
    const bestPlayer = dataSource.splice(bestPlayerIndex, 1)[0];
    bestPlayer.isCaptain = true;
    team.players.push(bestPlayer);
    teamList.push(team);
  }

  draftEvent({
    config: { ...config, teamList },
    activeTab: '2'
  });

  callBack();
};

export const generateDraftUseCase = { execute };
