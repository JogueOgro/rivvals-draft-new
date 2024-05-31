import playerStore from '@/store/player/player-store'

const execute = () => {
  const { players } = playerStore.getState()
  fetch('http://localhost:5000/draft/', {
    mode: 'cors',
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ players }),
  })
    .then((res) => res.json())
    .then((res) => console.log(res))
}

export const persistDraftUseCase = { execute }
