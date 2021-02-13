import { RouteRecordRaw, createWebHistory, createRouter } from "vue-router";
import Test from "../views/Test.vue";
import HighScores from "../views/HighScores.vue";
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";
import NotFound from "../views/NotFound.vue";
import { auth } from "../firebase";

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};
const guardAuth = async (to: any, from: any, next: any) => {
  if (await getCurrentUser()) {
    next();
  } else {
    next("/login");
  }
};

const redirect = async (to: any, from: any, next: any) => {
  if (!(await getCurrentUser())) {
    next();
  } else {
    next("/test");
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/test",
    alias: "/",
    name: "Test",
    component: Test,
  },
  {
    path: "/highscores",
    name: "High Scores",
    component: HighScores,
  },
  {
    path: "/login",
    name: "Log In",
    component: Login,
    beforeEnter: redirect,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: guardAuth,
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
