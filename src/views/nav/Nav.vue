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
    link: "rock-paper-scissors",
    content: "RPS",
  },
  {
    link: "about",
    content: "Contact",
  },
];
</script>

<template>
  <div class="wrap">
    <div class="title">HANDS</div>
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
