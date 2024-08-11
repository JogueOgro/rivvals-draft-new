import { ITeam } from '@/domain/draft.domain'
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

  const unmatchedPlayersList: IPlayer[] = []

  for (const row of filteredAvailablePlayers) {
    if (!unmatchedPlayersList.includes(row)) {
      const stringPlayerTags = row.tags?.trim()
      const listPlayerTags = stringPlayerTags?.split(',') || []
      const isMatchTags = activeTeamTags.some((x) =>
        listPlayerTags.includes(x!),
      )
      if (!isMatchTags) {
        unmatchedPlayersList.push(row)
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

  if (unmatchedPlayersList.length === 0) {
    return unmatchedPlayersList
  }

  if (unmatchedPlayersList.length <= Number(config?.teamsQuantity)) {
    let orderedTeamsList = [...teams]
    orderedTeamsList = orderedTeamsList?.sort((teamA: ITeam, teamB: ITeam) => {
      return Number(teamA.avgScore) - Number(teamB.avgScore)
    })

    orderedTeamsList = orderedTeamsList.filter(
      (team) => team.players.length < Number(config?.teamPlayersQuantity),
    )

    const orderedIndex = orderedTeamsList.findIndex(
      (x) => x.id === teams[activeTeamIndex].id,
    )

    let magicPlayer: IPlayer

    magicPlayer = unmatchedPlayersList[orderedIndex]

    // Remover players em ordens arbitrárias pode causar undefined aqui
    if (magicPlayer === undefined) {
      magicPlayer =
        unmatchedPlayersList[Math.floor(unmatchedPlayersList.length / 2)]
    }

    let len = filteredAvailablePlayers.length
    if (len > 5) {
      len = 5
    }
    const magicCardList = new Array(len).fill(magicPlayer)
    // console.log(magicCardList)
    return magicCardList
  }

  let sectionSize = unmatchedPlayersList.length / 3

  // manter no minimo 8 cartas para que sejam escolhidas 5 (mesmo que pegue de outro balde)
  if (sectionSize < unmatchedPlayersList.length / 2) {
    sectionSize = unmatchedPlayersList.length / 2
  }

  let sortCardsByAverageTeamScore = []

  if (muchHigher) {
    sortCardsByAverageTeamScore = unmatchedPlayersList.slice(-sectionSize, -1)
    // console.log('MuchHigher:', sortCardsByAverageTeamScore)
  }
  if (muchLower) {
    sortCardsByAverageTeamScore = unmatchedPlayersList.slice(0, sectionSize)
    // console.log('MuchLower', sortCardsByAverageTeamScore)
  }
  if (inAverage) {
    sortCardsByAverageTeamScore = unmatchedPlayersList.slice(
      sectionSize,
      2 * sectionSize,
    )
    // console.log('Avg:', sortCardsByAverageTeamScore)
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
        // São 20 horários na semana, queremos 8 livres
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

  /* console.log({
    activeTeam: activeTeamIndex + 1,
    activeTeamAvgScore,
    rivvalsAvgScore,
    rivvalsTotalPlayers,
    sugestions: cardList,
  })
  console.log(cardList) */
  return cardList
}

export const getSelectPlayersUseCase = { execute }
