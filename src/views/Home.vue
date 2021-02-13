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
import { useStore } from "../store";

export default defineComponent({
  setup() {
    const store = useStore();
    const count = computed(() => store.getters.getCount);
    const increment = () => store.dispatch("incrementCount");
    const decrement = () => store.dispatch("decrementCount");
    return {
      count,
      increment,
      decrement,
    };
  },
});
</script>

<style scoped></style>
