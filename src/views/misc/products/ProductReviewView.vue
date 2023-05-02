<template>
    <ProductReview />
</template>

<script>
import { defineComponent } from "vue";

// Components
import ProductReview from "@/components/misc/products/ProductReview.vue";

export default defineComponent({
    name: "ProductReviewView",

    components: {
        ProductReview,
    },
});
</script>
  