import { BaseDomain } from './base.domain'
import { ISchedule } from './draft.domain'

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
  trophy?: number
  gold?: number
  silver?: number
  bronze?: number
  border?: string
  bestTeam?: string
  bestPlacement?: string
  favoriteGame?: string
  mobile?: string
  evaluations?: number
  achievments?: number
  participations?: number
  tags?: string
  stars: number
  isCaptain?: boolean
  isBackup?: boolean
  schedule: ISchedule[]
  team?: number
  isExcluded?: boolean
  riot?: string
  epic?: string
  xbox?: string
  psn?: string
  score_cs?: number
  score_valorant?: number
  score_lol?: number
  score_rocketleague?: number
  score_fallguys?: number
  score_pingpong?: number
  score_racing?: number
}

export interface IPlayerPage {
  isLoading: boolean
  openModalUpload: boolean
  openModalDB: boolean
  openModalDBNew: boolean
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
