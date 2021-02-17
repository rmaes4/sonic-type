<template>
  <div id="nav" class="clearfix">
    <div class="left">
      <b id="brand">SonicType</b>
      <router-link to="/test">Test</router-link> |
      <router-link to="/highscores">High Scores</router-link>
    </div>
    <div v-if="loggedIn" class="right">
      <router-link to="/profile"
        >{{ user?.displayName }} [{{ user?.avgScore }}]</router-link
      >
      |
      <a href="#" @click="signOut()">Sign Out</a>
    </div>
    <div v-else class="right">
      <router-link to="/login">Log In</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useUserStore } from "../store/user";

export default defineComponent({
  setup() {
    const loggedIn = computed(() => {
      return useUserStore()?.state.user.loggedIn;
    });

    const user = computed(() => {
      return useUserStore()?.state.user.data;
    });
    const signOut = useUserStore()?.signOut;
    return { loggedIn, user, signOut };
  },
});
</script>

<style scoped>
#nav {
  border: 1px solid black;
  padding: 10px;
}
#brand {
  margin-right: 20px;
}
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

.left {
  float: left;
}

.right {
  float: right;
}
</style>
