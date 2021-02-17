<template>
  <div id="profileWrapper">
    <div>My average score: {{ user.avgScore }} wpm</div>
    <br />
    <div>My highest score: {{ user.highestScore }} wpm</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useUserStore } from "../store/user";

export default defineComponent({
  setup() {
    const user = computed(() => {
      return useUserStore()?.state.user.data;
    });
    return { user };
  },
});
</script>

<style lang="scss">
@import "../scss/shared.scss";
#profileWrapper {
  background-color: $surface;
  padding: 100px;
}
</style>
