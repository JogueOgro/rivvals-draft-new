import { draftEvent } from '@/store/draft/draft-events'
import { draftInitialState } from '@/store/draft/draft-state'
import { playerEvent } from '@/store/player/player-events'
import { playerInitialState } from '@/store/player/player-state'
import playerStore from '@/store/player/player-store'

const execute = async (listPlayerId: string[]) => {
  const { players } = playerStore.getState()
  const newData = [...players]?.filter(
    (player) => !listPlayerId?.includes(player.id!),
  )

  if (listPlayerId.length === players.length) {
    draftEvent(draftInitialState)
    playerEvent(playerInitialState)
    window.location.reload()
  } else {
    playerEvent({
      players: newData,
      totalRegistries: newData?.length || 0,
      selectedRows: [],
    })
  }
}

export const deletePlayersUseCase = { execute }
