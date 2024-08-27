import { IPlayer } from '@/domain/player.domain'

const execute = (data) => {
  const player = { name: '' }
  player.name = data.name
  player.twitch = data.twitch
  player.email = data.email
  player.score_rocketleague = 0
  if (data.capitao_ou_reserva == 'capitao') player.isCaptain = 1
  if (data.capitao_ou_reserva == 'reserva') player.isBackup = 1

  if (data.jajogou == 'claro')
    player.score_rocketleague = player.score_rocketleague + 2

  if (data.frequencia == '1x')
    player.score_rocketleague = player.score_rocketleague + 1
  if (data.frequencia == '3x')
    player.score_rocketleague = player.score_rocketleague + 3
  if (data.frequencia == 'sempre')
    player.score_rocketleague = player.score_rocketleague + 4

  if (data.modos == 'ranqueado')
    player.score_rocketleague = player.score_rocketleague + 3

  if (data.nivel_ranqueado == 'bronze')
    player.score_rocketleague = player.score_rocketleague + 1
  if (data.nivel_ranqueado == 'dima')
    player.score_rocketleague = player.score_rocketleague + 3
  if (data.nivel_ranqueado == 'max')
    player.score_rocketleague = player.score_rocketleague + 5

  data.items.forEach((item) => {
    if (item == 'controle')
      player.score_rocketleague = player.score_rocketleague + 3
    if (item == 'saltos')
      player.score_rocketleague = player.score_rocketleague + 3
    if (item == 'powerslide')
      player.score_rocketleague = player.score_rocketleague + 2
    if (item == 'wallhits')
      player.score_rocketleague = player.score_rocketleague + 3
    if (item == 'posicionamento')
      player.score_rocketleague = player.score_rocketleague + 3
    if (item == 'leitura_de_jogo')
      player.score_rocketleague = player.score_rocketleague + 4
  })

  player.score_rocketleague = Math.ceil(player.score_rocketleague / 6)
  if (player.score_rocketleague > 6) player.score_rocketleague = 6
  player.stars = player.score_rocketleague

  console.log(player)

  const config = { game: data.game, edition: data.edition }

  fetch('http://localhost:5000/player_new_draft', {
    mode: 'cors',
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ player, config }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then((data) => {
      console.log(data)
      // Aqui você pode processar a resposta recebida do servidor
    })
    .catch((error) => {
      const errorJson = { error: error.message }
      console.log('Error JSON:', errorJson)
    })
}

export const subscribePlayer = { execute }
