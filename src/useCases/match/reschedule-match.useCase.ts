/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/clients/api'
import { IReschedule } from '@/domain/match.domain'
import { formatLocalDate } from '@/lib/utils'

const execute = async (player, reason, match) => {
  const localScheduledDate = formatLocalDate(match.scheduledDate)

  const reschedule = {
    playerid: player.idplayer,
    playername: player.name,
    reason,
    blockedSchedule: localScheduledDate,
  } as IReschedule

  const weekdaysMap = [
    'DOMINGO',
    'SEGUNDA-FEIRA',
    'TERÇA-FEIRA',
    'QUARTA-FEIRA',
    'QUINTA-FEIRA',
    'SEXTA-FEIRA',
    'SÁBADO',
  ]

  const scheduledDate = new Date(match.scheduledDate)
  const targetDay = weekdaysMap[scheduledDate.getDay()]
  const targetHour = scheduledDate.getHours()
  const scheduleJSON = match.freeSchedule.toString().replace(/'/g, '"')
  match.freeSchedule = JSON.parse(scheduleJSON)
  const updatedSchedule = match.freeSchedule.filter(
    (slot) => !(slot.day === targetDay && slot.hour === targetHour),
  )

  match.freeSchedule = JSON.stringify(updatedSchedule)
  match.reschedule = reschedule
  match.scheduledDate = null
  match.isScheduled = 0

  try {
    await api.put('/match/' + match.idmatch, match)
  } catch (error) {
    console.error('Erro na busca de partidas:', error.message)
    if (error.response) {
      console.error('Status do erro:', error.response.status)
      console.error('Dados do erro:', error.response.data)
    }
  }
}

export const rescheduleMatchUseCase = { execute }
