import { IPlayer } from '@/domain/player.domain'
import playerStore from '@/store/player/player-store'

type IParams = {
  listOfAllocatedPlayers: string[]
}

const execute = ({ listOfAllocatedPlayers }: IParams) => {
  const { players } = playerStore.getState()

  const sortByScore = [...players]?.sort(sortPlayersByScore)

  const filteredAvailablePlayers = sortByScore?.filter((player) => {
    return !listOfAllocatedPlayers.includes(player.id!)
  })

  if (filteredAvailablePlayers.length <= 5) return filteredAvailablePlayers

  const list = filteredAvailablePlayers.filter((_, i) => i <= 5)
  const total = list.length
  const selectedPlayers: IPlayer[] = []
  const selectedIndexes: number[] = []

  while (selectedPlayers.length < 5) {
    const randomIndex = Math.floor(Math.random() * total)
    if (!selectedIndexes.includes(randomIndex)) {
      selectedIndexes.push(randomIndex)
      selectedPlayers.push(list[randomIndex])
    }
  }

  return selectedPlayers
}

const sortPlayersByScore = (playerA: IPlayer, playerB: IPlayer) => {
  return Number(playerB.score) - Number(playerA.score)
}

export const getSelectPlayersUseCase = { execute }
