<script lang="ts" setup>
import ButtonBasic from "../../shared/components/ButtonBasic.vue";
interface Button {
  link: string;
  content: string;
  icon: string;
}

const buttons: Button[] = [
  {
    link: "/",
    content: "Main",
    icon: "src/assets/icons/cards.svg",
  },
  {
    link: "rock-paper-scissors",
    content: "RPS",
    icon: "src/assets/icons/chess.svg",
  },
  {
    link: "snake",
    content: "Chess",
    icon: "src/assets/icons/snake1.svg",
  },
  {
    link: "snake",
    content: "Chess",
    icon: "src/assets/icons/RPS.svg",
  },
];
</script>

<template>
  <nav class="wrap">
    <div class="buttons">
      <router-link :to="button.link" v-for="button in buttons">
        <button>
          <img :src="button.icon" alt="" />
        </button>
      </router-link>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
$less-black-color: rgb(54, 54, 54);
nav {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 80px;
  background-color: black;
  display: flex;
  flex-direction: column;
  padding: 50px 0;
  align-items: center;
  border-right: 2px solid $less-black-color;
  box-shadow: 0 0 10px 0 black;
}

button {
  width: 50px;
  position: relative;
  overflow: hidden;
  height: 50px;
  margin: 8px 0;
  background: $less-black-color;
  border: none;
  cursor: pointer;
  transition: 0s;
  border-radius: 5px;
  box-shadow: 0 0 6px 1px black;

  &:hover {
    background: lighten($less-black-color, 6);
  }

  img {
    filter: invert(100%);
    height: 30px;
  }
}
</style>
