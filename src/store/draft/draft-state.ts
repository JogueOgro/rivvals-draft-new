import { IDraftPage } from '@/domain/draft.domain'

export const draftInitialState: IDraftPage = {
  config: null,
  activeTab: '1',
  isActiveTimer: false,
  timerSeconds: 60,
  activeTeamIndex: 0,
  isOpenModalStart: false,
  chat: [],
}
