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

  const sortByScore = [...players]?.sort(
    (playerA: IPlayer, playerB: IPlayer) => {
      return Number(playerB.stars) - Number(playerA.stars)
    },
  )

  const filteredAvailablePlayers = sortByScore?.filter((player) => {
    return !listOfAllocatedPlayers.includes(player.id!)
  })

  if (filteredAvailablePlayers.length <= 5) return filteredAvailablePlayers

  const filteredListWithoutPlayersMatchTags: IPlayer[] = []

  for (const row of filteredAvailablePlayers) {
    if (!filteredListWithoutPlayersMatchTags.includes(row)) {
      const strigPlayerTags = row.tags?.trim()
      const listPlayerTags = strigPlayerTags?.split(',') || []
      const isMatchTags = activeTeamTags.some((x) =>
        listPlayerTags.includes(x!),
      )
      if (!isMatchTags) {
        filteredListWithoutPlayersMatchTags.push(row)
      }
    }
  }

  const rivvalsTotalPlayers = players.length
  const rivvalsTotalScore = [...players].reduce((total, player) => {
    return total + (player ? Number(player.stars) : 0)
  }, 0)
  const rivvalsAvgScore = Math.abs(rivvalsTotalScore / rivvalsTotalPlayers)

  const activeTeamTotalPlayers = activeTeam?.players.length
  const activeTeamTotalScore = [...activeTeam.players].reduce(
    (total, player) => {
      return total + (player ? Number(player.stars) : 0)
    },
    0,
  )
  const activeTeamAvgScore = Math.abs(
    activeTeamTotalScore / activeTeamTotalPlayers,
  )

  const avgLimit = 0.5
  const avarageLimitStart = rivvalsAvgScore - avgLimit
  const avarageLimitEnd = rivvalsAvgScore + avgLimit

  const aboveAvarage = activeTeamAvgScore > avarageLimitEnd
  const inAvarage =
    activeTeamAvgScore >= avarageLimitStart &&
    activeTeamAvgScore <= avarageLimitEnd

  const sortCardsByAvarageTeamScore = filteredListWithoutPlayersMatchTags.sort(
    (playerA: IPlayer, playerB: IPlayer) => {
      if (aboveAvarage) {
        return Number(playerA.stars) - Number(playerB.stars)
      }
      return Number(playerB.stars) - Number(playerA.stars)
    },
  )

  let cardList: IPlayer[] = []

  if (inAvarage) {
    const selectedIndexes: number[] = []
    while (cardList.length < 5) {
      const randomIndex = Math.floor(
        Math.random() * sortCardsByAvarageTeamScore.length,
      )
      if (!selectedIndexes.includes(randomIndex)) {
        selectedIndexes.push(randomIndex)
        cardList.push(sortCardsByAvarageTeamScore[randomIndex])
      }
    }
  } else {
    cardList = sortCardsByAvarageTeamScore.slice(0, 5)
  }

  return cardList
}

export const getSelectPlayersUseCase = { execute }
