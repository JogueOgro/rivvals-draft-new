/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/clients/api'
import { ITeam } from '@/domain/draft.domain'
import { IConfirmation, IMatch } from '@/domain/match.domain'

type ISchedule = { day: string; hour: number }

type IParams = {
  edition: string
  teamList: any
  groupsQuantity: string | undefined
}

const fullSchedule = [
  { day: 'SEGUNDA-FEIRA', hour: 19 },
  { day: 'SEGUNDA-FEIRA', hour: 20 },
  { day: 'SEGUNDA-FEIRA', hour: 21 },
  { day: 'SEGUNDA-FEIRA', hour: 22 },
  { day: 'TERÇA-FEIRA', hour: 19 },
  { day: 'TERÇA-FEIRA', hour: 20 },
  { day: 'TERÇA-FEIRA', hour: 21 },
  { day: 'TERÇA-FEIRA', hour: 22 },
  { day: 'QUARTA-FEIRA', hour: 19 },
  { day: 'QUARTA-FEIRA', hour: 20 },
  { day: 'QUARTA-FEIRA', hour: 21 },
  { day: 'QUARTA-FEIRA', hour: 22 },
  { day: 'QUINTA-FEIRA', hour: 19 },
  { day: 'QUINTA-FEIRA', hour: 20 },
  { day: 'QUINTA-FEIRA', hour: 21 },
  { day: 'QUINTA-FEIRA', hour: 22 },
  { day: 'SEXTA-FEIRA', hour: 19 },
  { day: 'SEXTA-FEIRA', hour: 20 },
  { day: 'SEXTA-FEIRA', hour: 21 },
  { day: 'SEXTA-FEIRA', hour: 22 },
]

function findMatch(
  draftEdition,
  team1: ITeam,
  team2: ITeam,
  schedule: ISchedule[],
) {
  const freeSchedule = [] as ISchedule[]
  const confirmation = {
    playersToConfirm: team1.players.length * 2,
    numberConfirmed: 0,
    playersConfirms: {
      team1: [],
      team2: [],
    },
  } as IConfirmation

  for (const player of team1.players) {
    confirmation.playersConfirms.team1.push({
      id: player.idplayer,
      name: player.name,
      email: player.email,
      team: team1.id,
      teamName: team1.name,
      ok: false,
    })
  }

  for (const player of team2.players) {
    confirmation.playersConfirms.team2.push({
      id: player.idplayer,
      name: player.name,
      email: player.email,
      team: team1.id,
      teamName: team1.name,
      ok: false,
    })
  }

  if (schedule.length === 0) {
    return {
      team1,
      team2,
      draftEdition,
      freeSchedule: fullSchedule,
      phase: 'group',
      group: team1.group,
      isScheduled: false,
      isDone: false,
      format: 'md1',
      confirmation,
    }
  } else {
    for (let index = 0; index < fullSchedule.length; index++) {
      for (let f = 0; f < schedule.length; f++) {
        if (
          JSON.stringify(fullSchedule[index]) === JSON.stringify(schedule[f])
        ) {
          break
        }
        if (f === schedule.length - 1) {
          freeSchedule.push(fullSchedule[index])
          break
        }
      }
    }
  }

  return {
    team1,
    team2,
    draftEdition,
    freeSchedule,
    phase: 'group',
    group: team1.group,
    isScheduled: false,
    isDone: false,
    format: 'md1',
    confirmation,
  } as IMatch
}

const execute = async ({ edition, teamList, groupsQuantity }: IParams) => {
  const newListMatch = [] as IMatch[]
  for (let index = 1; index <= Number(groupsQuantity); index++) {
    const teams = teamList?.filter((x) => x.group === index) || []
    for (let s = 0; s < teams?.length - 1; s++) {
      const team1 = s
      for (let t = s; t <= teams?.length - 2; t++) {
        const team2 = t + 1
        const jointSchedules: ISchedule[] = [
          ...teams[team1].schedules,
          ...teams[team2].schedules,
        ]
        if (team1 !== team2) {
          const matchData = findMatch(
            edition,
            teams[team1],
            teams[team2],
            jointSchedules,
          )
          newListMatch.push(matchData)
        }
      }
    }
  }

  api
    .post('/matches', newListMatch)
    .then((response) => {
      if (response.status === 200) {
        console.log('Partidas criadas com sucesso')
      } else {
        console.log('Erro ao buscar dados:', response)
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    })
}

export const createMatchesUseCase = { execute }
