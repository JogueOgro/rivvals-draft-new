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
