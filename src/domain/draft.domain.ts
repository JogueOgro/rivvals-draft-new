import { BaseDomain } from './base.domain'
import { IPlayer } from './player.domain'

export interface ITeam {
  id?: string
  photo?: string
  players: IPlayer[]
  avgScore: number
}

export interface IDraft extends BaseDomain {
  name?: string
  teamPlayersQuantity?: string
  teamsQuantity?: string
  teamList?: ITeam[]
}

export interface IDraftPage {
  activeTab: string
  config: IDraft | null
  isActiveTimer: boolean
  isOpenModalStart: boolean
  timerSeconds: number
  activeTeamIndex: number
}
