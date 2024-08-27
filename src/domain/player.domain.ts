import { BaseDomain } from './base.domain'

export interface IPlayer extends BaseDomain {
  idplayer?: number
  photo?: string
  twitch?: string
  email?: string
  name?: string
  nick?: string
  medal?: number
  power?: number
  wins?: number
  tags?: string
  stars?: number
  isCaptain?: boolean
  isBackup?: boolean
  schedule?: {
    day: string
    hour: number
  }[]
  team?: number
  isExcluded?: boolean
  riot?: string
  epic?: string
  xbox?: string
  psn?: string
  score_cs?: string
  score_valorant?: string
  score_lol?: string
  score_rocketleague?: string
  score_fallguys?: string
}

export interface IPlayerPage {
  isLoading: boolean
  openModalUpload: boolean
  openModalDB: boolean
  pageSize: number
  progress: number
  currentPage: number
  totalPages: number
  totalRegistries: number
  selectedRows: string[]
  players: IPlayer[]
  filters: {
    name?: string | null
  }
}
