import { IPlayer } from '@/domain/player.domain'
import draftStore from '@/store/draft/draft-store'

import * as XLSX from 'xlsx'

interface IExportModel extends IPlayer {
  team: string
  teamAvg: number
}

const execute = () => {
  const { config } = draftStore.getState()

  const dataSource = config?.teamList || []
  const formattedData = [] as IExportModel[]

  for (const team of dataSource) {
    const activeTeamTotalScore = [...team.players].reduce((total, player) => {
      return total + (player ? Number(player.stars) : 0)
    }, 0)
    const activeTeamAvgScore = Math.abs(
      activeTeamTotalScore / team.players.length,
    )
    for (const player of team?.players) {
      delete player.id
      delete player.photo
      delete player.createdAt

      formattedData.push({
        ...player,
        team: team.id!.toString(),
        teamAvg: activeTeamAvgScore,
      })
    }
  }

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(formattedData)
  XLSX.utils.book_append_sheet(wb, ws, 'importacao')
  XLSX.writeFile(wb, 'draft.xlsx')
}

export const downloadDraftUseCase = { execute }
