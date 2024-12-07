import api from '@/clients/api'
import { sleep } from '@/lib/utils'

function calcRating(rVencedor, rPerdedor) {
  const ratingDifference = rVencedor - rPerdedor
  const basePoints = 35 // Pontos base para ratings iguais
  const maxBonus = 100 // Máximo para vitórias do azarão
  const minPoints = 10 // Mínimo para vitórias do favorito
  const scalingFactor = 0.1 // Proporcionalidade do ajuste
  const ratingThreshold = 800 // Limite de diferença para pontuações fixas

  let adjustment

  if (ratingDifference > ratingThreshold) {
    // Vitória do favorito com diferença acima de 800
    adjustment = minPoints
  } else if (ratingDifference < -ratingThreshold) {
    // Vitória do azarão com diferença acima de 800
    adjustment = maxBonus
  } else if (ratingDifference > 0) {
    // Vitória do favorito com diferença dentro do limite
    adjustment = Math.max(
      basePoints - ratingDifference * scalingFactor,
      minPoints, // Garante no mínimo 10 pontos
    )
  } else {
    // Vitória do azarão com diferença dentro do limite
    adjustment = Math.min(
      basePoints + Math.abs(ratingDifference) * scalingFactor,
      maxBonus, // Limita a 100 pontos
    )
  }

  return Math.round(adjustment)
}

const execute = async (players) => {
  let ratingPlayer1 = players.player1?.score_pingpong || 1000
  let ratingPlayer2 = players.player2?.score_pingpong || 1000

  let ratingChange = 0

  if (players.winner === 'player1') {
    ratingChange = calcRating(ratingPlayer1, ratingPlayer2) // Player1 venceu
    ratingPlayer1 += ratingChange
    ratingPlayer2 -= ratingChange
  } else if (players.winner === 'player2') {
    ratingChange = calcRating(ratingPlayer2, ratingPlayer1) // Player2 venceu
    ratingPlayer1 -= ratingChange
    ratingPlayer2 += ratingChange
  }

  // Garantir que os ratings não sejam negativos
  ratingPlayer1 = Math.max(0, ratingPlayer1)
  ratingPlayer2 = Math.max(0, ratingPlayer2)

  try {
    await api.put(
      '/player/pingpong/' + players.player1.idplayer + '/' + ratingPlayer1,
    )
  } catch (error) {
    const errorJson = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }
    console.log('Error JSON:', errorJson)
  }

  try {
    await api.put(
      '/player/pingpong/' + players.player2.idplayer + '/' + ratingPlayer2,
    )
  } catch (error) {
    const errorJson = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }
    console.log('Error JSON:', errorJson)
  }
  console.log(ratingPlayer1, ratingPlayer2, ratingChange)
}

export const processWinnerPingPong = { execute }
