import { BaseDomain } from './base.domain'

export interface IPlayer extends BaseDomain {
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
  schedule?: {
    day: string
    hour: number
  }[]
  team?: number
  isExcluded?: boolean
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
