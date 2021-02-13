import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { userStoreSymbol, createUserStore } from "./store/user";

createApp(App)
  .use(router)
  .provide(userStoreSymbol, createUserStore())
  .mount("#app");
