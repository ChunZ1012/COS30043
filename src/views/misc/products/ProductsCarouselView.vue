<template>
  <ProductsCarousel />
</template>

<script>
import { defineComponent } from "vue";

// Components
import ProductsCarousel from "@/components/misc/products/ProductsCarousel.vue";

export default defineComponent({
  name: "ProductsCarouselView",

  components: {
    ProductsCarousel,
  },
});
</script>
