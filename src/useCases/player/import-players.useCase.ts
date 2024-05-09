import { IPlayer } from '@/domain/player.domain'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'

import { uuid } from 'uuidv4'

const execute = async (players: IPlayer[], cb: () => void) => {
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
        }
      })
      .filter((row) => !!row?.name && !!row?.email)

    const sortPlayerByName = formattedData?.sort((playerA, playerB) => {
      const nameA = playerA?.name || ''
      const nameB = playerB?.name || ''
      return nameA.localeCompare(nameB)
    })

    playerEvent({
      isLoading: false,
      players: sortPlayerByName,
      totalRegistries,
      totalPages,
    })
    cb()
  } catch (e) {
    window.alert(
      'Ocorreu um erro, verifique o arquivo de importação e tente novamente.',
    )
  }
}

export const importPlayersUseCase = { execute }
