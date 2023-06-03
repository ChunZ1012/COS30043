<template>
    <Loading />
</template>

<script>
import { defineComponent } from "vue";

// Components
import Loading from "@/components/misc/helpers/Loading.vue";

export default defineComponent({
    name: "LoadingView",

    components: {
        Loading,
    },
});
</script>
  