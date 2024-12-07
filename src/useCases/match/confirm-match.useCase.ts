/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/clients/api'
import { IConfirmation } from '@/domain/match.domain'

const execute = async (player, draft, match) => {
  let freshMatch

  try {
    const response = await api.get('/match/' + match.idmatch)
    freshMatch = response.data
    console.log(freshMatch)
    if (!freshMatch.confirmation) {
      freshMatch.confirmation = {
        playersPerTeam: draft.playersPerTeam,
        numberConfirmed: 0,
        playersConfirms: [],
      } as IConfirmation
    }
  } catch (error) {
    console.error('Erro na busca de partidas:', error.message)
    if (error.response) {
      console.error('Status do erro:', error.response.status)
      console.error('Dados do erro:', error.response.data)
    }
    return
  }

  console.log(freshMatch)

  freshMatch.confirmation.numberConfirmed += 1
  freshMatch.confirmation.playerConfirms.push({
    id: player.idplayer,
    name: player.name,
    team: draft.team.idteam,
    ok: true,
  })

  try {
    const response = await api.put('/match/' + match.idmatch, freshMatch)
    freshMatch = response.data
  } catch (error) {
    console.error('Erro na busca de partidas:', error.message)
    if (error.response) {
      console.error('Status do erro:', error.response.status)
      console.error('Dados do erro:', error.response.data)
    }
  }
}

export const confirmMatchUseCase = { execute }
