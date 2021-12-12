<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from "./shared/components/HelloWorld.vue";
import Nav from "./views/nav/Nav.vue";
</script>

<template>
  <Nav></Nav>
  <router-view></router-view>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300&display=swap");

html {
  --colorPrimary: rgb(32, 184, 120);
  --colorAccent: rgb(0, 26, 59);
  font-family: "Roboto", sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
