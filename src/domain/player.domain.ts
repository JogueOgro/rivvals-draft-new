import { BaseDomain } from './base.domain'

export interface IPlayer extends BaseDomain {
  photo?: string
  email?: string
  name?: string
  nick?: string
  tags?: string[]
  wins?: number
  power?: number
  score?: number
  isCaptain?: boolean
}

export interface IPlayerPage {
  isLoading: boolean
  pageSize: number
  currentPage: number
  totalPages: number
  totalRegistries: number
  selectedRows: string[]
  players: IPlayer[]
  filters: {
    name?: string | null
  }
}
