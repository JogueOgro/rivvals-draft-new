import { BaseDomain } from './base.domain'
import { IPlayer } from './player.domain'
import { ChatUserstate } from 'tmi.js'

export interface ITeam {
  id?: string
  photo?: string
  players: IPlayer[]
}

export interface IDraft extends BaseDomain {
  name?: string
  teamPlayersQuantity?: string
  teamsQuantity?: string
  teamList?: ITeam[]
}

export interface IDraftChat {
  id?: string
  user?: ChatUserstate
  message?: string
  isAction?: boolean
  isExecuted?: boolean
  created: Date
}

export interface IDraftPage {
  activeTab: string
  config: IDraft | null
  isActiveTimer: boolean
  isOpenModalStart: boolean
  timerSeconds: number
  chat: IDraftChat[]
  activeTeamIndex: number
  activeTeamStartTurnDate: Date
  activeTeamEndTurnDate: Date
}
