import { createApp } from "vue";
import App from "./App.vue";
import { userStoreSymbol, createUserStore } from "./store/user";
import router from "./router";

createApp(App)
  .provide(userStoreSymbol, createUserStore())
  .use(router)
  .mount("#app");

//TODO: refactor everything
