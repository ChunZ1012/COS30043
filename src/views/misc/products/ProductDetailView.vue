<template>
    <ProductDetail />
</template>

<script>
import { defineComponent } from "vue";

// Components
import ProductDetail from "@/components/misc/products/ProductDetail.vue";

export default defineComponent({
    name: "ProductDetailView",

    components: {
        ProductDetail,
    },
});
</script>
  