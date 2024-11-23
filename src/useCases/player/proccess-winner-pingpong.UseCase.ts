import api from '@/clients/api'

function calcRating(r_vencedor, r_perdedor) {
  const rt = Number(r_vencedor) / Number(r_perdedor)

  return Math.round(30 * rt)
}

const execute = async (data) => {
  let ratingWinner = data.player1?.score_pingpong || 1000
  let ratingLoser = data.player1?.score_pingpong || 1000

  const ratingChange = calcRating(ratingWinner, ratingLoser)
  ratingWinner = ratingWinner + ratingChange
  ratingLoser = ratingLoser - ratingChange

  try {
    const response = await api.put(
      '/player/pingpong/' + data.player1.idplayer + '/' + ratingWinner,
    )
    console.log(response.data)
  } catch (error) {
    const errorJson = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }
    console.log('Error JSON:', errorJson)
  }

  try {
    const response = await api.put(
      '/player/pingpong/' + data.player2.idplayer + '/' + ratingLoser,
    )
    console.log(response.data)
  } catch (error) {
    const errorJson = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }
    console.log('Error JSON:', errorJson)
  }
}

export const processWinnerPingPong = { execute }
