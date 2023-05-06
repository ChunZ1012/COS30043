<template>
    <CartCard></CartCard>
</template>

<script>
import { defineComponent } from "vue";

// Components
import CartCard from "@/components/misc/carts/CartCard.vue";

export default defineComponent({
    name: "CartCardView",

    components: {
        CartCard,
    },
});
</script>
  