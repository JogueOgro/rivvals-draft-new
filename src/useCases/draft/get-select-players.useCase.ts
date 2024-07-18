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
  let scheduleList = []

  /* function checkBlockSchedule(scheduleList, cardSchedule) {
     console.log('scheduleList:', scheduleList)
    scheduleList = scheduleList?.pop()
     const concatSchedules = scheduleList
     console.log(
      'concat:',
      concatSchedules,
      'concatUndefined?:',
      concatSchedules?.length == 0,
    )
    if (concatSchedules == undefined) {
      console.log('Inicizalizado:', JSON.stringify(cardSchedule))
      concatSchedules = cardSchedule
    } else {
      cardSchedule.forEach((newSchedule) => {
        // console.log('CARD', JSON.stringify(newSchedule))

        scheduleList.forEach((schedule) => {
          // console.log('SCHEDULE ENTRY:', JSON.stringify(schedule))
          console.log(
            'newSchedule:',
            JSON.stringify(newSchedule),
            'schedule:',
            JSON.stringify(schedule),
            'COMPARA:',
            JSON.stringify(newSchedule) === JSON.stringify(schedule),
          )
          if (JSON.stringify(newSchedule) === JSON.stringify(schedule)) {
            concatSchedules.push(newSchedule)
            console.log('NOVO SCHEDULE', JSON.stringify(schedule))
          }
        })
      })
    }
    return concatSchedules
  } */

  if (inAvarage) {
    const selectedIndexes: number[] = []
    while (cardList.length < 5) {
      const randomIndex = Math.floor(
        Math.random() * sortCardsByAvarageTeamScore.length,
      )
      if (!selectedIndexes.includes(randomIndex)) {
        const cardSchedule = sortCardsByAvarageTeamScore[randomIndex].schedule
        if (!scheduleList.length) {
          scheduleList = cardSchedule
          console.log('SCHEDULE INIT:', cardSchedule)
        } else {
          cardSchedule.forEach((newSchedule) => {
            console.log('CARD', JSON.stringify(newSchedule))
            scheduleList.forEach((schedule) => {
              console.log('SCHEDULE ENTRY:', JSON.stringify(schedule))
            })
          })
        }
        /* else {
          cardSchedule.forEach((newSchedule) => {
             console.log('CARD', JSON.stringify(newSchedule))

            scheduleList.forEach((schedule) => {
              console.log('SCHEDULE ENTRY:', JSON.stringify(schedule))
              console.log(
                'newSchedule:',
                JSON.stringify(newSchedule),
                'schedule:',
                JSON.stringify(schedule),
                'COMPARA:',
                JSON.stringify(newSchedule) === JSON.stringify(schedule),
              )
              if (JSON.stringify(newSchedule) === JSON.stringify(schedule)) {
                //concatSchedules.push(newSchedule)
                console.log('NOVO SCHEDULE', JSON.stringify(schedule))
              }


        } */

        selectedIndexes.push(randomIndex)
        cardList.push(sortCardsByAvarageTeamScore[randomIndex])
      }
    }
  } else {
    cardList = sortCardsByAvarageTeamScore.slice(0, 5)
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
