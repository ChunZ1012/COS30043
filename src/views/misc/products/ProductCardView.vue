<template>
  <ProductCard />
</template>

<script>
import { defineComponent } from "vue";

// Components
import ProductCard from "@/components/misc/products/ProductCard.vue";

export default defineComponent({
  name: "ProductCardView",

  components: {
    ProductCard,
  },
});
</script>
