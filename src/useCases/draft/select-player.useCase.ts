import { ITeam } from '@/domain/draft.domain'
import { IPlayer } from '@/domain/player.domain'
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'

import { addSeconds } from 'date-fns'

const execute = (selectedPlayer: IPlayer) => {
  const { config, activeTeamIndex } = draftStore.getState()
  draftEvent({
    isOpenModalStart: true,
    isActiveTimer: false,
    timerSeconds: 60,
  })

  const newTeamList = !config?.teamList ? [] : [...config.teamList]

  newTeamList[activeTeamIndex].players.push({
    ...selectedPlayer,
    isCaptain: false,
  })

  const playerSchedule = selectedPlayer.schedule
  const teamSchedule = newTeamList[activeTeamIndex].schedules
  let newTeamSchedule = [...teamSchedule]

  const days = [
    'SEGUNDA-FEIRA',
    'TERÇA-FEIRA',
    'QUARTA-FEIRA',
    'QUIINTA-FEIRA',
    'SEXTA-FEIRA',
    'SÁBADO',
    'DOMINGO',
  ]

  const sortDays = function (a, b) {
    a = days.indexOf(a)
    b = days.indexOf(b)
    return a - b
  }

  if (newTeamSchedule.length === 0) newTeamSchedule = [...playerSchedule]
  else {
    for (let pindex = 0; pindex < playerSchedule.length; pindex++) {
      for (let tindex = 0; tindex < newTeamSchedule.length; tindex++) {
        if (
          JSON.stringify(playerSchedule[pindex]) ===
          JSON.stringify(newTeamSchedule[tindex])
        ) {
          break
        }
        if (tindex === newTeamSchedule.length - 1) {
          newTeamSchedule.push(playerSchedule[pindex])
          break
        }
      }
    }
  }

  newTeamList[activeTeamIndex].schedules = [...newTeamSchedule].sort(sortDays)

  const teams = !config?.teamList ? [] : [...config.teamList]
  const activeTeam = teams[activeTeamIndex]

  const activeTeamTotalPlayers = activeTeam?.players.length
  const activeTeamTotalScore = [...activeTeam.players].reduce(
    (total, player) => {
      return total + (player ? Number(player.stars) : 0)
    },
    0,
  )

  const activeTeamAvgScore = Math.abs(
    activeTeamTotalScore / activeTeamTotalPlayers,
  )

  newTeamList[activeTeamIndex].avgScore = activeTeamAvgScore

  // Rodada de Balanceamento
  if (
    activeTeamIndex + 1 >= newTeamList.length &&
    teams[0].players.length === Number(config?.teamPlayersQuantity) - 1
  ) {
    newTeamList?.sort((teamA: ITeam, teamB: ITeam) => {
      return Number(teamA.avgScore) - Number(teamB.avgScore)
    })
  }

  if (activeTeamIndex + 1 >= newTeamList.length) {
    draftEvent({
      config: { ...config, teamList: newTeamList },
      activeTeamIndex: 0,
      activeTeamStartTurnDate: new Date(),
      activeTeamEndTurnDate: addSeconds(new Date(), 60),
    })
    return
  }

  draftEvent({
    config: { ...config, teamList: newTeamList },
    activeTeamIndex: activeTeamIndex + 1,
    activeTeamStartTurnDate: new Date(),
    activeTeamEndTurnDate: addSeconds(new Date(), 60),
  })
}

export const selectPlayerUseCase = { execute }
