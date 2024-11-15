import api from '@/clients/api'
import draftStore from '@/store/draft/draft-store'
import playerStore from '@/store/player/player-store'

const execute = async () => {
  const { players } = playerStore.getState()
  const { config } = draftStore.getState()

  try {
    const response = await api.post('/new_draft', { players, config })
    const data = response.data
    // console.log(data)
  } catch (error) {
    const errorJson = {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    }
    console.log('Error JSON:', errorJson)
  }
}

export const persistNewDraftUseCase = { execute }
