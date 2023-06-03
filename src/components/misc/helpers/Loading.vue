<template>
    <v-overlay
        :model-value="isLoading"
        contained
        scroll-strategy="block"
        class="align-center justify-center"
    >
        <v-progress-circular
            color="primary"
            indeterminate
            size="64"
        ></v-progress-circular>
    </v-overlay>
</template>

<script>
export default {
    name:"Loading",
    props: {
        isLoading: {
            type:Boolean,
            default: true
        }
    }
}
</script>