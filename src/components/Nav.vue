<template>
  <div id="outer-nav">
    <div id="nav" class="clearfix">
      <div class="left">
        <b id="brand">SonicType</b>
        <router-link to="/test">Test</router-link> |
        <router-link to="/highscores">High Scores</router-link>
      </div>
      <div v-if="loggedIn" class="right">
        <router-link to="/profile"
          >{{ user?.displayName }}
          <span class="badge">{{ user?.avgScore }}</span></router-link
        >
        |
        <a href="#" @click="signOut()">Sign Out</a>
      </div>
      <div v-else class="right">
        <router-link to="/login">Log In</router-link>
      </div>
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

<style lang="scss">
@import "../scss/shared.scss";

#outer-nav {
  background-color: $surface;
}

#nav {
  padding: 10px;

  margin-bottom: 20px;
}
#brand {
  margin-right: 20px;
  background-color: $primary;
  color: $on-primary;
  font-weight: bold;
  padding: 6px;
  border-radius: 20px;
}
a {
  &:link,
  &:visited,
  &:hover,
  &:active {
    color: #ffffff;
    text-decoration: none;
    font-weight: bold;
  }
  &:hover {
    text-decoration: underline;
  }
}
.badge {
  background-color: $secondary;
  color: $on-secondary;
  padding: 2px 4px;
  border-radius: 50%;
  font-weight: normal;
}
.active-link {
  color: $primary !important;
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
