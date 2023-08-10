<script setup lang="ts"></script>

<template>
  <nav class="navigation">
    <router-link to="/">Home</router-link>
  </nav>
  <router-view />
</template>

<style lang="scss" scoped>
.navigation {
  gap: 16px;
  display: flex;
  justify-content: space-around;
  padding: 16px;
}
</style>
