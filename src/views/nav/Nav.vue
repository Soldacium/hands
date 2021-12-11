<script lang="ts" setup>
import ButtonBasic from "../../shared/components/ButtonBasic.vue";
interface Button {
  link: string;
  content: string;
}

const buttons: Button[] = [
  {
    link: "/",
    content: "Main",
  },
  {
    link: "about",
    content: "About",
  },
  {
    link: "about",
    content: "Contact",
  },
  {
    link: "login",
    content: "Login",
  },
];
</script>

<template>
  <div class="wrap">
    <img alt="Vue logo" src="../../assets/logo.png" />
    <div class="title">THE TEST APP</div>
    <div class="buttons">
      <router-link :to="button.link" v-for="button in buttons">
        <ButtonBasic>
          {{ button.content }}
        </ButtonBasic>
      </router-link>
      <!--
           
        -->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
