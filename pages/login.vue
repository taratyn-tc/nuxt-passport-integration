<script setup lang="ts">
</script>

<template>
  <h1>Login Page</h1>
  <a href="/api/auth/saml">SAML Login</a>
  <br/>
  <div>

    <form method="post" action="/api/auth/credentials">
      <input type="text" name="username"/>
      <input type="password" name="password"/>
      <button type="submit">Login</button>
    </form>
  </div>
</template>