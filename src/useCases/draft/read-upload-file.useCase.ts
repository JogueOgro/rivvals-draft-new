/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPlayer } from '@/domain/player.domain'
import { sleep } from '@/lib/utils'
import { IType } from '@/pages/home'
import draftStore from '@/store/draft/draft-store'
import { playerEvent } from '@/store/player/player-events'

import { generateDraftUseCase } from '../draft/generate-draft.useCase'
import { importPlayersUseCase } from '../player/import-players.useCase'
import * as XLSX from 'xlsx'

type IParams = {
  file: File | null
  type: IType
  callBack: () => void
}

const execute = async ({ file, callBack, type }: IParams) => {
  if (!file) return

  const { config } = draftStore.getState()

  playerEvent({ progress: 0, isLoading: true })
  await sleep(500)

  const reader = new FileReader()

  reader.onload = async (e) => {
    playerEvent({ progress: 20 })

    const data = new Uint8Array(e!.target!.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const importedData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as any[][]

    await sleep(500)
    playerEvent({ progress: 40 })

    const players: IPlayer[] = importedData.slice(1).map((row) => ({
      name: row[0] || '',
      nick: row[1] || '',
      twitch: row[2] || '',
      email: row[3] || '',
      stars: parseInt(row[4] as string) || 0,
      medal: parseInt(row[5] as string) || 0,
      wins: parseInt(row[6] as string) || 0,
      tags: row[7] || '',
      photo: row[8] || '',
      team: row[9] || '',
      schedule: row[10] || [],
    }))

    await sleep(500)
    playerEvent({ progress: 60 })

    await importPlayersUseCase.execute(players)
    await sleep(500)
    playerEvent({ progress: 80 })

    generateDraftUseCase.execute(
      {
        game: config?.game,
        edition: config?.edition,
        draftDate: config?.draftDate,
        finalDate: config?.finalDate,
        teamPlayersQuantity: config?.teamPlayersQuantity,
        teamsQuantity: config?.teamsQuantity,
      },
      () => {
        playerEvent({ progress: 100 })
        callBack()
      },
      type,
    )

    await sleep(500)
    playerEvent({ openModalUpload: false, isLoading: false })
  }
  reader.readAsArrayBuffer(file)
}

export const readUploadFileUseCase = { execute }
