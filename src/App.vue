<template>
  <v-app>
    <v-main class="pa-md-2">
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
  .router-link-btn {
    text-decoration: none;
  }
</style>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
