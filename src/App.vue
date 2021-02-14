<template>
  <div id="main">
    <div id="content-wrap">
      <Nav />
      <router-view />
    </div>
    <footer id="footer">&copy;2021 Rob Maes</footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Nav from "./components/Nav.vue";
export default defineComponent({
  name: "App",
  components: {
    Nav,
  },
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

#main {
  width: 900px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  min-height: 100vh;
}

#content-wrap {
  padding-bottom: 2.5rem;
}

#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.5rem;
  background-color: bisque;
  text-align: center;
}
</style>
