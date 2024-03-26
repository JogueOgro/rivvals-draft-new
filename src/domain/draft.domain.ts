import { BaseDomain } from "./base.domain";
import { IPlayer } from "./player.domain";

export interface IDraft extends BaseDomain {
  name?: string
  teamPlayersQuantity?: string
  teamsQuantity?: string
  isSmartCaptainSelection?: boolean
  teamList: {
    id?: string
    name: string
    photo?: string
    players: IPlayer[]
  }[]
}

export interface IDraftPage {
  activeTab: string
  config: IDraft | null
}
