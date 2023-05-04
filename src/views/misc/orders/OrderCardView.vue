<template>
    <OrderCard />
</template>

<script>
import { defineComponent } from "vue";

// Components
import OrderCard from "@/components/misc/orders/OrderCard.vue";

export default defineComponent({
    name: "OrderCardView",

    components: {
        OrderCard,
    },
});
</script>
  