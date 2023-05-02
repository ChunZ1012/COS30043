<template>
  <Container />
</template>

<script>
import { defineComponent } from "vue";

// Components
import Container from "../components/Container.vue";

export default defineComponent({
  name: "ContainerView",

  components: {
    Container,
  },
});
</script>
