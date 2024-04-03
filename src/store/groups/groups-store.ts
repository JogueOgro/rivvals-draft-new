import { IGroups } from '@/domain/groups.domain'

import { groupsEvent } from './groups-events'
import { groupsInitialState } from './groups-state'
import { createStore } from 'effector'
import { persist } from 'effector-storage/local'

const groupsStore = createStore<IGroups>(groupsInitialState).on(
  groupsEvent,
  (state, payload) => {
    return {
      ...state,
      ...payload,
    }
  },
)

persist({ store: groupsStore, key: 'groupsStore' })

export default groupsStore
