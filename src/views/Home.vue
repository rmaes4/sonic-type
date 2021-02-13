<template>
  <div>
    <button @click="decrement">-</button>
    <b>{{ count }}</b>
    <button @click="increment">+</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { usersCollection } from "../firebase";
import { useUserStore } from "../store/user";

export default defineComponent({
  setup() {
    console.log(useUserStore());
    const count = computed(() => {
      return useUserStore()?.state.counter;
    });
    return {
      count,
      increment: useUserStore()?.increment,
      decrement: useUserStore()?.decrement,
    };
  },
});
</script>

<style scoped></style>
