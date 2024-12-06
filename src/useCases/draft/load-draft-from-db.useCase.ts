/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/clients/api'
import { IPlayer } from '@/domain/player.domain'
import { IType } from '@/pages/admin'
import { groupsEvent } from '@/store/groups/groups-events'

import { importPlayersFromDBUseCase } from '../player/import-players-from-db.useCase'
import { generateDraftUseCase } from './generate-draft.useCase'

type IParams = {
  draftEdition: string | null
  type: IType
  callBack: () => void
}

const fetchDraftsByEdition = async (draftEdition: string) => {
  try {
    const response = await api.get('/drafts_by_edition/' + draftEdition)
    const data = response.data
    return data
  } catch (error) {
    console.error('Erro ao buscar dados:', error.message)
    if (error.response) {
      console.error('Status do erro:', error.response.status)
      console.error('Dados do erro:', error.response.data)
    }
  }
}

// const fetchAllGroups = async () => {
//   try {
//     const response = await api.get('/teams')
//     const data = response.data
//     return data
//   } catch (error) {
//     console.error('Erro ao buscar dados:', error.message)
//     if (error.response) {
//       console.error('Status do erro:', error.response.status)
//       console.error('Dados do erro:', error.response.data)
//     }
//   }
// }

const execute = async ({ draftEdition, callBack, type }: IParams) => {
  if (!draftEdition) return

  const fullDraft = await fetchDraftsByEdition(draftEdition)

  if (!fullDraft) {
    console.error('Erro ao obter o draft completo')
    return
  }

  const players: IPlayer[] = []
  for (let index = 0; index < fullDraft.length; index++) {
    fullDraft[index].player.team = fullDraft[index].team.number
    players.push(fullDraft[index].player)
  }

  await importPlayersFromDBUseCase.execute(players)

  const singleDraft = fullDraft[0]

  groupsEvent({
    groupsQuantity: singleDraft.groupsQuantity,
    teamsPerGroup: singleDraft.teamsPerGroup,
  })

  groupsEvent({
    groupsQuantity: 1,
    teamsPerGroup: 2,
  })

  generateDraftUseCase.execute(
    fullDraft,
    {
      isActive: singleDraft?.active,
      game: singleDraft?.game,
      edition: singleDraft?.edition,
      draftDate: singleDraft?.draftDate,
      finalDate: singleDraft?.finalDate,
      teamPlayersQuantity: singleDraft?.playersPerTeam,
      teamsQuantity: singleDraft?.teamsQuantity,
    },
    () => {
      callBack()
    },
    type,
  )
}

export const loadDraftFromDB = { execute }
