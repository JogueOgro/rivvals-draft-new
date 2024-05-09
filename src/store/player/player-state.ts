import { IPlayerPage } from '@/domain/player.domain'

export const playerInitialState: IPlayerPage = {
  pageSize: 10,
  currentPage: 1,
  totalPages: 1,
  selectedRows: [],
  isLoading: false,
  openModalUpload: false,
  totalRegistries: 0,
  progress: 0,
  filters: {
    name: null,
  },
  players: [],
}
