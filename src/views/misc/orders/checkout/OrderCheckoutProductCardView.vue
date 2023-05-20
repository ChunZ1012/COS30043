<template>
    <OrderCheckoutProductCard />
</template>
  
<script>
import { defineComponent } from "vue";

// Components
import OrderCheckoutProductCard from "@/components/misc/orders/checkout/OrderCheckoutProductCard.vue";

export default defineComponent({
    name: "OrderCheckoutProductCardView",

    components: {
        OrderCheckoutProductCard,
    },
});
</script>
