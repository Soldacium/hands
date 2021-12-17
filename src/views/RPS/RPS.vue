<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import Engine from "../../shared/services/engine";

let canvas: HTMLCanvasElement;

onMounted(() => {
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  console.log(canvas);
  if (canvas) {
    Engine.init(canvas);
  }
});

onUnmounted(() => {
  Engine.stopRender();
});
</script>
<template>
  <canvas id="canvas"></canvas>
</template>

<style lang="scss" scoped></style>
