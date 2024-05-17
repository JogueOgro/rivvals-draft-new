import { IPlayer } from '@/domain/player.domain'
import draftStore from '@/store/draft/draft-store'
import playerStore from '@/store/player/player-store'

type IParams = {
  listOfAllocatedPlayers: string[]
}

const execute = ({ listOfAllocatedPlayers }: IParams) => {
  const { config, activeTeamIndex } = draftStore.getState()
  const { players } = playerStore.getState()

  const teams = !config?.teamList ? [] : [...config.teamList]
  const activeTeam = teams[activeTeamIndex]

  const activeTeamTags = activeTeam?.players
    ?.filter((x) => !!x.tags)
    ?.map((x) => x.tags)

  const sortByScore = [...players]?.sort(sortPlayersByScore)

  const filteredAvailablePlayers = sortByScore?.filter((player) => {
    return !listOfAllocatedPlayers.includes(player.id!)
  })

  if (filteredAvailablePlayers.length <= 5) return filteredAvailablePlayers

  const selectedPlayers: IPlayer[] = []

  for (const row of filteredAvailablePlayers) {
    if (!selectedPlayers.includes(row)) {
      const strigPlayerTags = row.tags?.trim()
      const listPlayerTags = strigPlayerTags?.split(',') || []
      const isMatchTags = activeTeamTags.some((x) =>
        listPlayerTags.includes(x!),
      )
      if (!isMatchTags) {
        selectedPlayers.push(row)
      }
    }
  }

  return selectedPlayers.slice(0, 5)
}

const sortPlayersByScore = (playerA: IPlayer, playerB: IPlayer) => {
  return Number(playerB.score) - Number(playerA.score)
}

export const getSelectPlayersUseCase = { execute }
