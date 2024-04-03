import { IDraftPage } from '@/domain/draft.domain'

import { draftEvent } from './draft-events'
import { draftInitialState } from './draft-state'
import { createStore } from 'effector'
import { persist } from 'effector-storage/local'

const draftStore = createStore<IDraftPage>(draftInitialState).on(
  draftEvent,
  (state, payload) => {
    return {
      ...state,
      ...payload,
    }
  },
)

persist({ store: draftStore, key: 'draftStore' })

export default draftStore
