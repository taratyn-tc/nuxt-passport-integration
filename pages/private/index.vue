<script setup lang="ts">

</script>

<template>
  <div>
    <h1>Public</h1>
  </div>
  <ul>
    <li><NuxtLink to="/public/">Index</NuxtLink></li>
    <li><NuxtLink to="/public/one">One</NuxtLink></li>
    <li><NuxtLink to="/public/two">Two</NuxtLink></li>
  </ul>
  <div>
    <h1>Private</h1>
  </div>
  <ul>
    <li><NuxtLink to="/private/">Index</NuxtLink></li>
    <li><NuxtLink to="/private/one">One</NuxtLink></li>
    <li><NuxtLink to="/private/one">Two</NuxtLink></li>
  </ul>
</template>

<style scoped>

</style>