<script setup lang="ts">

</script>

<template>
  <h1>Hello World </h1>
  <form method="post" action="/api/auth/logout">
    <button type="submit">Logout</button>
  </form>
  <ul>
    <li>
      <NuxtLink to="public">public</NuxtLink>
    </li>
    <li>
      <NuxtLink to="private">private</NuxtLink>
    </li>
  </ul>
</template>
