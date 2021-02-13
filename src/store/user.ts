import { reactive, readonly, provide, inject } from "vue";
import { auth } from "../firebase";

export const userStoreSymbol = Symbol("user");

interface UserData {
  displayName: string;
  email: string;
}

interface UserState {
  user: {
    loggedIn: boolean;
    data: UserData | null;
  };
}

interface UserStore {
  readonly state: UserState;
  fetchUser: any;
  signOut: any;
}

export const createUserStore = () => {
  auth.onAuthStateChanged((user) => {
    fetchUser(user as UserData | null);
  });
  const state = reactive<UserState>({
    user: {
      loggedIn: false,
      data: null,
    },
  });
  const fetchUser = (user: UserData | null) => {
    state.user.loggedIn = user !== null;
    if (user) {
      state.user.data = {
        displayName: user.displayName,
        email: user.email,
      };
    } else {
      state.user.data = null;
    }
  };
  const signOut = async () => {
    console.log("sign out 2");
    await auth.signOut();
  };
  return {
    state: readonly(state),
    fetchUser,
    signOut,
  };
};

export const useUserStore = (): UserStore | undefined =>
  inject(userStoreSymbol);
export const provideUserStore = () =>
  provide(userStoreSymbol, createUserStore());
