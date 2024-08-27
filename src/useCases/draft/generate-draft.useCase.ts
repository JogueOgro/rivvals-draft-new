import { IDraft, ISchedule, ITeam } from '@/domain/draft.domain'
import { IPlayer } from '@/domain/player.domain'
import { sortDays } from '@/lib/utils'
import { IType } from '@/pages/home'
import { draftEvent } from '@/store/draft/draft-events'
import { draftInitialState } from '@/store/draft/draft-state'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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
  let availablePlayers = [] as IPlayer[]

  if (type === 'database') {
    availablePlayers = players?.filter(
      (x) =>
        !teamList.some((y) => y.players.some((z) => z.idplayer === x.idplayer)),
    )
  } else {
    availablePlayers = players?.filter(
      (x) => !teamList.some((y) => y.players.some((z) => z.id === x.id)),
    )
  }

  for (let i = 0; i < totalTeams; i++) {
    const teamNum = i + 1
    const team: ITeam = {
      id: String(teamNum),
      players: [],
      schedules: [] as ISchedule[],
    }

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
      team.schedules.push(...playerToInsert.schedule)
    } else {
      const formattedTeamList = filteredTeamPlayers.map((x, o) => ({
        ...x,
        isCaptain: o === 0,
      }))
      team.players.push(...formattedTeamList)

      formattedTeamList.forEach((teamPlayer) => {
        if (team.schedules.length === 0) {
          team.schedules = [...teamPlayer.schedule]
        } else {
          for (let pindex = 0; pindex < teamPlayer.schedule.length; pindex++) {
            for (let tindex = 0; tindex < team.schedules.length; tindex++) {
              if (
                JSON.stringify(teamPlayer.schedule[pindex]) ===
                JSON.stringify(team.schedules[tindex])
              ) {
                break
              }
              if (tindex === team.schedules.length - 1) {
                team.schedules.push(teamPlayer.schedule[pindex])
                break
              }
            }
          }
        }
      })
    }
    team.schedules.sort(sortDays)
    teamList.push(team)
  }

  // @ts-ignore
  draftEvent({
    config: { ...config, teamList },
    activeTab: '2',
  })

  if (callBack) callBack()
}

export const generateDraftUseCase = { execute }
