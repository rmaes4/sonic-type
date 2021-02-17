<template>
  <div id="errorWrapper">
    <h1>404</h1>
    <h2>Oops!</h2>
    <br />
    <p>The page you are looking for doesn't seem to exist.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style lang="scss">
@import "../scss/shared.scss";
#errorWrapper {
  background-color: $surface;
  padding: 100px;
}
</style>
