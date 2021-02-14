<template>
  <div>test</div>
  <TypingTest
    text="All that is gold does not glitter, Not all those who wander are lost; The old that is strong does not wither, Deep roots are not reached by the frost. From the ashes a fire shall be woken, A light from the shadows shall spring; Renewed shall be blade that was broken, The crownless again shall be king."
    author="Joe Bob"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TypingTest from "../components/TypingTest.vue";

export default defineComponent({
  name: "Test",
  components: {
    TypingTest,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
