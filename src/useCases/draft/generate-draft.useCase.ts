import { IDraft, ITeam } from '@/domain/draft.domain'
import { IPlayer } from '@/domain/player.domain'
import { IType } from '@/pages/home'
import { draftEvent } from '@/store/draft/draft-events'
import { draftInitialState } from '@/store/draft/draft-state'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'

const execute = (
  config: Partial<IDraft>,
  callBack: () => void,
  type: IType,
) => {
  draftEvent(draftInitialState)
  const { players } = playerStore.getState()
  const dataSource = [...players]
  const total =
    Number(config?.teamPlayersQuantity) * Number(config?.teamsQuantity)

  if (!dataSource?.length) {
    window.alert('Não há jogadores disponíveis.')
    return
  }

  if (dataSource?.length < total) {
    playerEvent({ openModalUpload: false })
    window.alert('Não há quantidade de jogadores suficiente.')
    return
  }

  const teamList = [] as ITeam[]
  const totalTeams = Number(config!.teamsQuantity)

  for (let i = 0; i < totalTeams; i++) {
    const teamNum = i + 1
    const team: ITeam = {
      id: String(teamNum),
      players: [],
    }

    const availablePlayers = players?.filter(
      (x) => !teamList.some((y) => y.players.some((z) => z.id === x.id)),
    )

    const sortByTwitch: IPlayer[] = availablePlayers?.sort((a, b) => {
      const twitchA = a?.twitch?.toString() || ''
      const twitchB = b?.twitch?.toString() || ''
      return twitchB.localeCompare(twitchA)
    })

    const filteredTeamPlayers = availablePlayers?.filter(
      (x) => Number(x.team) === teamNum,
    )

    const playerToInsert = { ...sortByTwitch[0], isCaptain: true }

    if (type === 'new') {
      team.players.push(playerToInsert)
    } else {
      const formattedTeamList = filteredTeamPlayers.map((x, o) => ({
        ...x,
        isCaptain: o === 0,
      }))
      team.players.push(...formattedTeamList)
    }

    teamList.push(team)
  }

  draftEvent({
    config: { ...config, teamList },
    activeTab: '2',
  })

  if (callBack) callBack()
}

export const generateDraftUseCase = { execute }
