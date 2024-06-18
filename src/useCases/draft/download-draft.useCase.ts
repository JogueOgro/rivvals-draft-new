import playerStore from '@/store/player/player-store'

import { addHours } from 'date-fns'
import * as XLSX from 'xlsx'

const execute = () => {
  const timezone = new Date().getTimezoneOffset() / 60
  const dt = addHours(new Date(), -timezone)
  const now = dt.toISOString().substring(0, 19)
  const fileName = 'resultado_do_draft_' + now + '.xlsx'

  const { players } = playerStore.getState()
  const formattedData = players?.map((x) => {
    const player = {
      name: x.name,
      nick: x.nick,
      twitch: x.twitch,
      email: x.email,
      stars: x.stars,
      medal: x.medal,
      wins: x.wins,
      tags: x.tags,
      photo: x.photo,
      team: x.team,
      schedule: JSON.stringify(x.schedule),
    }
    return player
  })
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(formattedData)
  XLSX.utils.book_append_sheet(wb, ws, 'draft')
  XLSX.writeFile(wb, fileName)
}

export const downloadDraftUseCase = { execute }
