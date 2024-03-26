import { playerEvent } from "@/store/player/player-events"
import playerStore from "@/store/player/player-store"

const execute = async (listPlayerId: string[]) => {
  const { dataSource } = playerStore.getState()
  const newData = dataSource?.filter(player => !listPlayerId?.includes(player.id!))
  playerEvent({ dataSource: newData, totalRegistries: newData?.length || 0 })
}

export const deletePlayersUseCase = { execute }