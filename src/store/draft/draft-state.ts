import { IDraftPage } from '@/domain/draft.domain'

import { addSeconds } from 'date-fns'

export const draftInitialState: IDraftPage = {
  chat: [],
  config: undefined,
  activeTab: '1',
  timerSeconds: 60,
  isActiveTimer: false,
  isOpenModalStart: false,
  activeTeamIndex: 0,
  activeTeamStartTurnDate: new Date(),
  activeTeamEndTurnDate: addSeconds(new Date(), 60),
}
