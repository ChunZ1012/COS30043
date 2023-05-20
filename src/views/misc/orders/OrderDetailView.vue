<template>
  <OrderDetail />
</template>

<script>
import { defineComponent } from "vue";

// Components
import OrderDetail from "@/components/misc/orders/OrderDetail.vue";

export default defineComponent({
  name: "OrderDetailView",

  components: {
    OrderDetail,
  },
});
</script>
