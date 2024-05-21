import { IDraft, ITeam } from '@/domain/draft.domain'
import { draftEvent } from '@/store/draft/draft-events'
import { draftInitialState } from '@/store/draft/draft-state'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'

const execute = (config: Partial<IDraft>, callBack?: () => void) => {
  draftEvent(draftInitialState)
  const { players } = playerStore.getState()
  const dataSource = [...players]
  const total =
    Number(config?.teamPlayersQuantity) * Number(config?.teamsQuantity)

  if (!dataSource?.length) {
    window.alert('Não há jogadores disponíveis.')
    return
  }

  console.log(dataSource?.length)
  console.log(total)

  if (dataSource?.length < total) {
    playerEvent({ openModalUpload: false })
    window.alert('Não há quantidade de jogadores suficiente.')
    return
  }

  const teamList = []
  const totalTeams = Number(config!.teamsQuantity)

  for (let i = 0; i < totalTeams; i++) {
    const team: ITeam = {
      id: String(i + 1),
      players: [],
    }

    let bestPlayerIndex = 0
    let bestPlayerScore = 0
    for (let j = 0; j < dataSource.length; j++) {
      const playerScore = Number(dataSource[j].stars)
      if (playerScore > bestPlayerScore) {
        bestPlayerIndex = j
        bestPlayerScore = playerScore
      }
    }
    const bestPlayer = dataSource.splice(bestPlayerIndex, 1)[0]
    bestPlayer.isCaptain = true
    team.players.push(bestPlayer)
    teamList.push(team)
  }

  draftEvent({
    config: { ...config, teamList },
    activeTab: '2',
  })

  if (callBack) callBack()
}

export const generateDraftUseCase = { execute }
