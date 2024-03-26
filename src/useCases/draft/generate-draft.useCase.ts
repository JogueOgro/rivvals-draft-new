import { IDraft } from "@/domain/draft.domain";
import { IPlayer } from "@/domain/player.domain";
import { draftEvent } from "@/store/draft/draft-events";
import { playerEvent } from "@/store/player/player-events";
import playerStore from "@/store/player/player-store";

const calculatePlayerScore = (player: IPlayer) => {
  return Number(player.score) + Number(player.wins) * 5 + Number(player.power) * 20;
};

const execute = (config: Partial<IDraft>, callBack: () => void) => {
  const { dataSource: players } = playerStore.getState();
  const teamList = [];
  const totalTeams = Number(config!.teamsQuantity);

  if (!players?.length) {
    window.alert("Não há jogadores disponíveis.");
    return;
  }

  for (let i = 0; i < totalTeams; i++) {
    const team: any = {
      id: String(i + 1),
      name: `Team ${i + 1}`,
      players: [],
    };

    let bestPlayerIndex = 0;
    let bestPlayerScore = 0;
    for (let j = 0; j < players.length; j++) {
      const playerScore = calculatePlayerScore(players[j]);
      if (playerScore > bestPlayerScore) {
        bestPlayerIndex = j;
        bestPlayerScore = playerScore;
      }
    }
    const bestPlayer = players.splice(bestPlayerIndex, 1)[0];
    bestPlayer.isCaptain = true;
    playerEvent({
      dataSource: players?.map(player => player?.id === bestPlayer?.id ? ({ ...player, isCaptain: true }) : player)
    })
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
