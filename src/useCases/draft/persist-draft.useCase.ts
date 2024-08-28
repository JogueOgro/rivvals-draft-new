import draftStore from '@/store/draft/draft-store'
import playerStore from '@/store/player/player-store'

const execute = () => {
  const { players } = playerStore.getState()
  const { config } = draftStore.getState()

  fetch('/complete_draft', {
    mode: 'cors',
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ players, config }),
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

export const persistDraftUseCase = { execute }
