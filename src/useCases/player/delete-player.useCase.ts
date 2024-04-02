import { playerEvent } from "@/store/player/player-events"
import playerStore from "@/store/player/player-store"

const execute = async (listPlayerId: string[]) => {
  const { players } = playerStore.getState()
  const newData = players?.filter(player => !listPlayerId?.includes(player.id!))
  playerEvent({ players: newData, totalRegistries: newData?.length || 0 })
}

export const deletePlayersUseCase = { execute }