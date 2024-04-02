import { IPlayerPage } from "@/domain/player.domain";
import { persist } from 'effector-storage/local';


import { createStore } from "effector";
import { playerEvent } from "./player-events";
import { playerInitialState } from "./player-state";

const playerStore = createStore<IPlayerPage>(playerInitialState).on(
  playerEvent,
  (state, payload) => {
    return {
      ...state,
      ...payload,
    };
  },
);

persist({ store: playerStore, key: 'playerStore' })

export default playerStore