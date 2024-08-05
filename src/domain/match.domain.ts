import { BaseDomain } from './base.domain'
import { ITeam } from './draft.domain'

export interface IMatch extends BaseDomain {
  team1?: ITeam
  team2?: ITeam
  phase?: string
  group?: number
  format?: string
  day?: string
  hour?: string
  isDone?: boolean
  isScheduled?: boolean
  score?: string[]
  freeSchedule?: []
}
