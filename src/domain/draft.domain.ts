import { BaseDomain } from "./base.domain";
import { IPlayer } from "./player.domain";

export interface IDraft extends BaseDomain {
  name?: string
  teamPlayersQuantity?: string
  teamsQuantity?: string
  isSmartCaptainSelection?: boolean
  teamList: ITeam[]
}

export interface IDraftPage {
  activeTab: string
  config: IDraft | null
  isActiveTimer: boolean
  timerSeconds: number
  activeTeamIndex: number
}

export interface ITeam {
  id?: string
  photo?: string
  name: string
  players: IPlayer[]
}