import { BaseDomain } from './base.domain'
import { ITeam } from './draft.domain'

export interface IMatch extends BaseDomain {
  idmatch?: string
  team1?: ITeam
  team2?: ITeam
  draftEdition?: string
  phase?: string
  group?: number
  format?: string
  day?: string
  hour?: string
  isDone?: boolean
  isScheduled?: boolean
  winner?: number
  scoreTeam1?: number
  scoreTeam2?: number
  freeSchedule?: { day: string; hour: number }[]
  conclusionDate: Date
}
