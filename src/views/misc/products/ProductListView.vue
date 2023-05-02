<template>
  <ProductList />
</template>

<script>
import { defineComponent } from "vue";

// Components
import ProductList from "@/components/misc/products/ProductList.vue";

export default defineComponent({
  name: "ProductListView",

  components: {
    ProductList,
  },
});
</script>
