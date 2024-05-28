import { IPlayer } from '@/domain/player.domain'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'

import { uuid } from 'uuidv4'

const execute = async (players: IPlayer[]) => {
  try {
    const { pageSize } = playerStore.getState()
    playerEvent({ isLoading: true })
    const totalRegistries = players.length
    const totalPages = Math.ceil(totalRegistries / pageSize)
    const formattedData = [...players]
      ?.map((row) => {
        return {
          ...row,
          id: uuid(),
          createdAt: new Date().toISOString(),
          schedule: row?.schedule
            ? JSON.parse(row.schedule as unknown as string)
            : [],
        }
      })
      .filter((row) => !!row?.name)

    const sortPlayerByScore = formattedData?.sort((playerA, playerB) => {
      const scoreA = playerA?.stars || '0'
      const scoreB = playerB?.stars || '0'
      return Number(scoreB) - Number(scoreA)
    })

    playerEvent({
      isLoading: false,
      players: sortPlayerByScore,
      totalRegistries,
      totalPages,
    })
  } catch (e) {
    window.alert(
      'Ocorreu um erro, verifique o arquivo de importação e tente novamente.',
    )
  }
}

export const importPlayersUseCase = { execute }
