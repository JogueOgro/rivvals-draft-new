/* eslint-disable @typescript-eslint/no-explicit-any */

import { IPlayer } from '@/domain/player.domain'
import { IType } from '@/pages/home'
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
    const response = await fetch(
      apiHost + '/drafts_by_edition/' + draftEdition,
      {
        mode: 'cors',
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  }
}

const execute = async ({ draftEdition, callBack, type }: IParams) => {
  if (!draftEdition) return

  const fullDraft = await fetchDraftsByEdition(draftEdition)

  if (!fullDraft) {
    console.error('Erro ao obter o draft completo')
    return
  }

  const players: IPlayer[] = []
  for (let index = 0; index < fullDraft.length; index++) {
    fullDraft[index].player.team = fullDraft[index].team.idteam
    players.push(fullDraft[index].player)
  }

  await importPlayersFromDBUseCase.execute(players)

  const singleDraft = fullDraft[0]

  groupsEvent({
    groupsQuantity: singleDraft.groupsQuantity,
    teamsPerGroup: singleDraft.teamsPerGroup,
  })

  generateDraftUseCase.execute(
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
