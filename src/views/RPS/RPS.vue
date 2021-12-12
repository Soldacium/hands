<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import HandEngine from "../../shared/services/hand-engine";

let canvas: HTMLCanvasElement;
onMounted(() => {
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (canvas) {
    HandEngine.init(canvas);
    HandEngine.addHand();
    HandEngine.addCube();
    HandEngine.render();

    console.log("rendered");
  }
});

onUnmounted(() => {
  HandEngine.stopRender();
});
</script>
<template>
  <canvas id="canvas"></canvas>
</template>

<style lang="scss" scoped></style>
