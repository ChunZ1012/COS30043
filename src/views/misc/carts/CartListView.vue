<template>
    <CartList></CartList>
</template>

<script>
import { defineComponent } from "vue";

// Components
import CartList from "@/components/misc/carts/CartList.vue";

export default defineComponent({
    name: "CartListView",

    components: {
        CartList,
    },
});
</script>
  