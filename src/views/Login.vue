<template>
  <div>
    login
    <button @click="signIn">Sign in with Google</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { auth, googleAuth } from "../firebase";

export default defineComponent({
  setup() {
    const signIn = () => {
      auth.signInWithRedirect(googleAuth);
    };
    onMounted(async () => {
      const result = await auth.getRedirectResult();
      console.log(result);
      console.log(result.user?.displayName);
      console.log(result.user?.email);
      console.log(result.user?.uid);
    });
    return { signIn };
  },
});
</script>

<style scoped></style>
