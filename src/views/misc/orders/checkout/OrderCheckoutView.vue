<template>
    <OrderCheckout />
</template>
  
<script>
import { defineComponent } from "vue";

// Components
import OrderCheckout from "@/components/misc/orders/checkout/OrderCheckout.vue";

export default defineComponent({
    name: "OrderCheckoutView",

    components: {
        OrderCheckout,
    },
});
</script>
