import { State } from ".";
import { INC_COUNT, DEC_COUNT } from "./mutation-types";

export default {
  [INC_COUNT](state: State) {
    state.count = state.count + 1;
  },
  [DEC_COUNT](state: State) {
    state.count = state.count - 1;
  },
};
