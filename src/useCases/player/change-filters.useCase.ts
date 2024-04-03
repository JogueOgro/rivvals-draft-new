import { playerEvent } from '@/store/player/player-events'

interface IParams {
  name?: string | null
}

const execute = (params: IParams) => {
  playerEvent({
    currentPage: 1,
    filters: params,
  })
}

export const changeFiltersUseCase = { execute }
