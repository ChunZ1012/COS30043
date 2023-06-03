<template>
  <UserAccount />
</template>

<script>
import { defineComponent } from "vue";

// Components
import UserAccount from "@/components/misc/users/UserAccount.vue";

export default defineComponent({
  name: "UserAccountView",

  components: {
    UserAccount,
  },
});
</script>