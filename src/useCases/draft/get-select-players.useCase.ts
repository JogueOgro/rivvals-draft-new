import { IPlayer } from '@/domain/player.domain'
import draftStore from '@/store/draft/draft-store'
import playerStore from '@/store/player/player-store'

import { max } from 'date-fns'

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

  const avgLimit = rivvalsAvgScore * 0.25
  const lowerLimit = rivvalsAvgScore - avgLimit
  const higherLimit = rivvalsAvgScore + avgLimit

  const muchHigher = activeTeamAvgScore > higherLimit
  const muchLower = activeTeamAvgScore < lowerLimit
  const inAverage =
    activeTeamAvgScore >= lowerLimit && activeTeamAvgScore <= higherLimit

  // if (filteredAvailablePlayers.length == config?.teamsQuantity) {
  //   // Ultima rodada
  // }

  console.log(
    'Quantos Players:',
    filteredListWithoutPlayersMatchTags.length,
    'Section:',
    filteredListWithoutPlayersMatchTags.length / 3,
  )

  const sectionSize = filteredListWithoutPlayersMatchTags.length / 3
  let sortCardsByAverageTeamScore = []

  if (muchHigher) {
    sortCardsByAverageTeamScore = filteredListWithoutPlayersMatchTags.slice(
      -sectionSize,
      -1,
    )
    console.log('MuchHigher:', sortCardsByAverageTeamScore)
  }
  if (muchLower) {
    sortCardsByAverageTeamScore = filteredListWithoutPlayersMatchTags.slice(
      0,
      sectionSize,
    )
    console.log('MuchLower', sortCardsByAverageTeamScore)
  }
  if (inAverage) {
    sortCardsByAverageTeamScore = filteredListWithoutPlayersMatchTags.slice(
      sectionSize,
      2 * sectionSize,
    )
    console.log('Avg:', sortCardsByAverageTeamScore)
  }

  const cardList: IPlayer[] = []
  let maxTries = 15

  const selectedIndexes: number[] = []
  while (cardList.length < 5) {
    const randomIndex = Math.floor(
      Math.random() * sortCardsByAverageTeamScore.length,
    )
    if (!selectedIndexes.includes(randomIndex)) {
      if (maxTries === 0) {
        console.log('CHEQUE MATE...')
        selectedIndexes.push(randomIndex)
        cardList.push(sortCardsByAverageTeamScore[randomIndex])
      } else {
        const cardSchedule =
          sortCardsByAverageTeamScore[randomIndex]?.schedule || []
        const teamSchedule = activeTeam.schedules

        for (let pindex = 0; pindex < cardSchedule.length; pindex++) {
          for (let tindex = 0; tindex < teamSchedule.length; tindex++) {
            if (
              JSON.stringify(cardSchedule[pindex]) ===
              JSON.stringify(teamSchedule[tindex])
            ) {
              break
            }
            if (tindex === teamSchedule.length - 1) {
              teamSchedule.push(cardSchedule[pindex])
              break
            }
          }
        }

        if (teamSchedule.length < 12) {
          selectedIndexes.push(randomIndex)
          cardList.push(sortCardsByAverageTeamScore[randomIndex])
        } else {
          console.log('Poucos Horários Livres, tentando outras cartas...')
          maxTries--
        }
      }
    }
  }

  console.log({
    activeTeam: activeTeamIndex + 1,
    activeTeamAvgScore,
    rivvalsAvgScore,
    rivvalsTotalPlayers,
    sugestions: cardList,
  })
  console.log(cardList)
  return cardList
}

export const getSelectPlayersUseCase = { execute }
