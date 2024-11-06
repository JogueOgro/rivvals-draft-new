import { IAuth } from '@/domain/auth.domain'

import { authEvent } from './auth-events'
import { authInitialState } from './auth-state'
import { createStore } from 'effector'
import { persist } from 'effector-storage/local'

const authStore = createStore<IAuth>(authInitialState).on(
  authEvent,
  (state, payload) => {
    return {
      ...state,
      ...payload,
    }
  },
)

persist({ store: authStore, key: 'authStore' })

export default authStore
