import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'

const execute = async (playerId: string) => {
  const { players } = playerStore.getState()
  const newData = [...players]?.map((player) =>
    player.id === playerId ? { ...player, isExcluded: true } : player,
  )
  playerEvent({
    players: newData,
  })
}

export const deletePlayersUseCase = { execute }
