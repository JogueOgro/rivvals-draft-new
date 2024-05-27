import { IDraft, ITeam } from '@/domain/draft.domain'
import { IPlayer } from '@/domain/player.domain'
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

  const teamList = [] as ITeam[]
  const totalTeams = Number(config!.teamsQuantity)

  for (let i = 0; i < totalTeams; i++) {
    const team: ITeam = {
      id: String(i + 1),
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

    team.players.push({ ...sortByTwitch[0], isCaptain: true })

    teamList.push(team)
  }

  draftEvent({
    config: { ...config, teamList },
    activeTab: '2',
  })

  if (callBack) callBack()
}

export const generateDraftUseCase = { execute }
