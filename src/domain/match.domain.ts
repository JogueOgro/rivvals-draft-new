import { BaseDomain } from './base.domain'
import { ITeam } from './draft.domain'

export interface IReschedule {
  playerid: number
  playername: string
  reason: string
  blockedSchedule: string
}
export interface IConfirmation {
  playersToConfirm?: number
  confirmedIds?: []
  playersConfirms?: {
    team1?: Array<{
      id?: number
      name?: string
      nick?: string
      email?: string
      team?: number
      teamName?: string
      ok?: boolean
    }>
    team2?: Array<{
      id?: number
      name?: string
      nick?: string
      email?: string
      team?: number
      teamName?: string
      ok?: boolean
    }>
  }
}
export interface IMatch extends BaseDomain {
  idmatch?: string
  team1?: ITeam
  team2?: ITeam
  draftEdition?: string
  phase?: string
  group?: number
  format?: string
  isDone?: boolean
  isScheduled?: boolean
  scheduledDate: Date
  reschedule: IReschedule
  winner?: number
  scoreTeam1?: number
  scoreTeam2?: number
  freeSchedule?: { day: string; hour: number }[]
  confirmation?: IConfirmation
  conclusionDate?: Date
}
