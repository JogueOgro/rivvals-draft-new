import api from '@/clients/api'
import { sortDays } from '@/lib/utils'

const execute = async (player) => {
  try {
    player.schedule.sort(sortDays)
    const response = await api.put(
      '/player/schedule/' + player.idplayer,
      player,
    )

    if (response.status === 200) {
      console.log('Agenda atualizada com sucesso')
    } else {
      console.log('Erro na resposta', response)
    }
  } catch (error) {
    console.error('Erro na requisição', error)
  }
}

export const editPlayerSchedule = { execute }
