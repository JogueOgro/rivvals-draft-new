import { BaseDomain } from './base.domain'

export interface IPlayer extends BaseDomain {
  photo?: string
  email?: string
  name?: string
  nick?: string
  medal?: number
  power?: number
  wins?: number
  tags?: string
  stars?: number
  score?: number
  isCaptain?: boolean
}

export interface IPlayerPage {
  isLoading: boolean
  openModalUpload: boolean
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
