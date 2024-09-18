import { BaseDomain } from './base.domain'
import { IPlayer } from './player.domain'
import { ChatUserstate } from 'tmi.js'

export interface ISchedule {
  day: string
  hour: number
}

export interface ITeam {
  id?: string
  photo?: string
  avgScore?: number
  players: IPlayer[]
  schedules: ISchedule[]
  group?: number
  number?: number
}

export interface IDraft extends BaseDomain {
  isActive?: number
  game?: string
  edition: number
  draftDate?: Date
  finalDate?: Date
  teamPlayersQuantity?: string
  teamsQuantity?: string
  team?: ITeam // No DB um draft relaciona time a player, esta é uma adaptação
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
  config?: IDraft
  isActiveTimer: boolean
  isOpenModalStart: boolean
  timerSeconds: number
  chat: IDraftChat[]
  activeTeamIndex: number
  activeTeamStartTurnDate: Date
  activeTeamEndTurnDate: Date
}
