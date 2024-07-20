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

  console.log('SELECTED PLAYER SCHEDULE', selectedPlayer.schedule)
  console.log('TEAM SCHEDULE', teamSchedule)

  if (newTeamSchedule.length == 0) newTeamSchedule = [...playerSchedule]
  else {
    console.log('ENTROU PRA TENTAR ADD')
    for (let pindex = 0; pindex < playerSchedule.length; pindex++) {
      for (let tindex = 0; tindex < newTeamSchedule.length; tindex++) {
        if (
          JSON.stringify(playerSchedule[pindex]) ==
          JSON.stringify(newTeamSchedule[tindex])
        ) {
          break
        }
        if (tindex == newTeamSchedule.length - 1) {
          console.log('NOVO ELEMENTO', playerSchedule[pindex])
          newTeamSchedule.push(playerSchedule[pindex])
          break
        }
      }
    }
  }

  console.log('TIME SCHEDULE', newTeamSchedule)

  newTeamList[activeTeamIndex].schedules = [...newTeamSchedule]

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
