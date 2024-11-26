/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/clients/api'

const execute = async (formData) => {
  let winner = 'draw'
  if (formData.team1 > formData.team2) {
    winner = 'team1'
  } else {
    winner = 'team2'
  }
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000 // Deslocamento do fuso horário em milissegundos
  const localTime = new Date(now.getTime() - offset)
  const scores = {
    idMatch: formData.match.idmatch,
    scoreTeam1: formData.team1,
    scoreTeam2: formData.team2,
    winner,
    isDone: 1,
    conclusionDate: localTime.toISOString().slice(0, 19).replace('T', ' '),
  }

  api
    .post('/match/scores', scores)
    .then((response) => {
      if (response.status === 200) {
        console.log('Partidas atualizadas!')
      } else {
        console.log('Erro na resposta', response)
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar dados:', error.message)
      if (error.response) {
        console.error('Status do erro:', error.response.status)
        console.error('Dados do erro:', error.response.data)
      }
    })
}

export const postMatchUseCase = { execute }
