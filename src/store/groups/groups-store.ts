import { IGroups} from "@/domain/groups.domain";
import { persist } from 'effector-storage/local'
import { createStore } from "effector";
import { groupsEvent } from "./groups-events";
import { groupsInitialState } from "./groups-state";

const groupsStore = createStore<IGroups>(groupsInitialState).on(
  groupsEvent,
  (state, payload) => {
    return {
      ...state,
      ...payload,
    };
  },
);

persist({ store: groupsStore, key: 'groupsStore' })

export default groupsStore