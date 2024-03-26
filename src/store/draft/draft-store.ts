import { IDraftPage } from "@/domain/draft.domain";
import { persist } from 'effector-storage/local'
import { createStore } from "effector";
import { draftEvent } from "./draft-events";
import { draftInitialState } from "./draft-state";

const draftStore = createStore<IDraftPage>(draftInitialState).on(
  draftEvent,
  (state, payload) => {
    return {
      ...state,
      ...payload,
    };
  },
);

persist({ store: draftStore, key: 'draftStore' })

export default draftStore