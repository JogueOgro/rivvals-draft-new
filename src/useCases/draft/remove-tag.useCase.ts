import { playerEvent } from '@/store/player/player-events'
import playerStore from '@/store/player/player-store'

const execute = ({ playerId, tag }: { playerId?: string; tag: string }) => {
  const { players: oldList } = playerStore.getState()

  const newList = [...oldList].map((player) => {
    if (player.id !== playerId) return player

    const tagOldList = player.tags?.trim()
    const playerOldTagList = tagOldList?.split(',')
    const filteredList = playerOldTagList?.filter((x) => x !== tag)
    const playerNewTagList = filteredList?.join(',')

    return {
      ...player,
      tags: `${playerNewTagList}`,
    }
  })

  playerEvent({ players: newList })
}

export const removeTagUseCase = { execute }
