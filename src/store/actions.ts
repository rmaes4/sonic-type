import { INC_COUNT, DEC_COUNT } from "./mutation-types";

export default {
  incrementCount({ commit }: any) {
    commit(INC_COUNT);
  },
  decrementCount({ commit }: any) {
    commit(DEC_COUNT);
  },
};
