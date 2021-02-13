import { reactive, readonly, provide, inject } from "vue";

export const userStoreSymbol = Symbol("user");

interface UserStore {
  readonly state: {
    counter: number;
  };
  increment: any;
  decrement: any;
}

export const createUserStore = () => {
  const state = reactive({
    counter: 0,
  });
  const increment = () => {
    state.counter++;
  };
  const decrement = () => state.counter--;
  return {
    state: readonly(state),
    increment,
    decrement,
  };
};

export const useUserStore = (): UserStore | undefined =>
  inject(userStoreSymbol);
export const provideUserStore = () =>
  provide(userStoreSymbol, createUserStore());
