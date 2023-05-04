<template>
    <OrderList />
</template>

<script>
import { defineComponent } from "vue";

// Components
import OrderList from "@/components/misc/orders/OrderList.vue";

export default defineComponent({
    name: "OrderListView",

    components: {
        OrderList,
    },
});
</script>
  