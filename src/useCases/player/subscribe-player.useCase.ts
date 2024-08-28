import api from '@/clients/api'

const execute = async (data) => {
  const player = {
    name: data.name,
    twitch: data.twitch,
    email: data.email,
    score_rocketleague: 0,
    isCaptain: 0,
    isBackup: 0,
    stars: 0,
  }

  if (data.capitao_ou_reserva === 'capitao') player.isCaptain = 1
  if (data.capitao_ou_reserva === 'reserva') player.isBackup = 1

  if (data.jajogou === 'claro')
    player.score_rocketleague = player.score_rocketleague + 2

  if (data.frequencia === '1x')
    player.score_rocketleague = player.score_rocketleague + 1
  if (data.frequencia === '3x')
    player.score_rocketleague = player.score_rocketleague + 3
  if (data.frequencia === 'sempre')
    player.score_rocketleague = player.score_rocketleague + 4

  if (data.modos === 'ranqueado')
    player.score_rocketleague = player.score_rocketleague + 3

  if (data.nivel_ranqueado === 'bronze')
    player.score_rocketleague = player.score_rocketleague + 1
  if (data.nivel_ranqueado === 'dima')
    player.score_rocketleague = player.score_rocketleague + 3
  if (data.nivel_ranqueado === 'max')
    player.score_rocketleague = player.score_rocketleague + 5

  data.items.forEach((item) => {
    if (item === 'controle')
      player.score_rocketleague = player.score_rocketleague + 3
    if (item === 'saltos')
      player.score_rocketleague = player.score_rocketleague + 3
    if (item === 'powerslide')
      player.score_rocketleague = player.score_rocketleague + 2
    if (item === 'wallhits')
      player.score_rocketleague = player.score_rocketleague + 3
    if (item === 'posicionamento')
      player.score_rocketleague = player.score_rocketleague + 3
    if (item === 'leitura_de_jogo')
      player.score_rocketleague = player.score_rocketleague + 4
  })

  player.score_rocketleague = Math.ceil(player.score_rocketleague / 6)
  if (player.score_rocketleague > 6) player.score_rocketleague = 6
  player.stars = player.score_rocketleague

  const config = { game: data.game, edition: data.edition }

  return api
    .post('/subscribe_player', { player, config })
    .then((successData) => {
      console.log(successData)
      return true
    })
    .catch((errorData) => {
      const errorJson = { error: errorData.message }
      console.log('Error JSON:', errorJson)
      return false
    })
}

export const subscribePlayer = { execute }
