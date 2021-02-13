import { createStore, useStore as baseUseStore, Store } from "vuex";
import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";
import { InjectionKey } from "vue";
// import plugins from "./plugins";

export interface State {
  count: number;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    count: 0,
  },
  getters,
  actions,
  mutations,
  // plugins,
});

export function useStore() {
  return baseUseStore(key);
}
