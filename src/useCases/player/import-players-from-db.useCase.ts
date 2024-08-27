import { IPlayer } from '@/domain/player.domain'
import { sortDays } from '@/lib/utils'
import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'

const execute = async (players: IPlayer[]) => {
  try {
    const { pageSize } = playerStore.getState()
    playerEvent({ isLoading: true })
    const totalRegistries = players.length
    const totalPages = Math.ceil(totalRegistries / pageSize)

    players.forEach((player) => {
      const formalJSON = player.schedule.toString().replace(/'/g, '"')
      player.schedule = JSON.parse(formalJSON).sort(sortDays)
      player.id = String(player.idplayer)
    })

    const sortPlayerByScore = players?.sort((playerA, playerB) => {
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

export const importPlayersFromDBUseCase = { execute }
