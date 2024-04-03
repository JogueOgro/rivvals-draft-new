import { IPlayerPage } from '@/domain/player.domain'

import { playerEvent } from './player-events'
import { playerInitialState } from './player-state'
import { createStore } from 'effector'
import { persist } from 'effector-storage/local'

const playerStore = createStore<IPlayerPage>(playerInitialState).on(
  playerEvent,
  (state, payload) => {
    return {
      ...state,
      ...payload,
    }
  },
)

persist({ store: playerStore, key: 'playerStore' })

export default playerStore
