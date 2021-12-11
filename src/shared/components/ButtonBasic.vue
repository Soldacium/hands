<script setup lang="ts"></script>
<template>
  <button>
    <slot></slot>
  </button>
</template>
<style scoped lang="scss">
button {
  padding: 0.5em 1em;
  font-size: 1.3em;
  transition: 0.2s;
  border: 2px solid transparent;
  margin: 0 0.3em;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    border-color: var(--colorPrimary);
  }

  &:active:hover {
    border-color: var(--colorAccent);
  }
}
</style>
