/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/clients/api'
import { IConfirmation } from '@/domain/match.domain'
import { fixStringToObj } from '@/lib/utils'

const execute = async (player, draft, match) => {
  let freshMatch

  try {
    const response = await api.get('/match/' + match.idmatch)
    freshMatch = response.data
    freshMatch.confirmation = fixStringToObj(
      freshMatch.confirmation,
    ) as IConfirmation
  } catch (error) {
    console.error('Erro na busca de partidas:', error.message)
    if (error.response) {
      console.error('Status do erro:', error.response.status)
      console.error('Dados do erro:', error.response.data)
    }
    return
  }

  console.log(freshMatch.confirmation)

  const updatePlayerOk = (players, idPlayer) =>
    players.map((player) =>
      player.id === idPlayer ? { ...player, ok: true } : player,
    )

  freshMatch.confirmation.playersConfirms.team1 = updatePlayerOk(
    freshMatch.confirmation.playersConfirms.team1,
    player.idplayer,
  )

  freshMatch.confirmation.playersConfirms.team2 = updatePlayerOk(
    freshMatch.confirmation.playersConfirms.team2,
    player.idplayer,
  )

  if (!freshMatch.confirmation.confirmedIds.includes(player.idplayer)) {
    freshMatch.confirmation.confirmedIds.push(player.idplayer)
  }

  try {
    await api.put('/match/' + match.idmatch, freshMatch)
  } catch (error) {
    console.error('Erro na busca de partidas:', error.message)
    if (error.response) {
      console.error('Status do erro:', error.response.status)
      console.error('Dados do erro:', error.response.data)
    }
  }
}

export const confirmMatchUseCase = { execute }
