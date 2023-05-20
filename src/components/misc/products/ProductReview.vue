<template>
  <v-card class="mx-auto pa-2" width="90%">
    <v-card-items>
      <div class="d-flex flex-row gy-2 align-items-center">
        <v-avatar size="64">
          <v-img :src="userAvatarUrl" :alt="userDisplayName"></v-img>
        </v-avatar>

        <v-col cols="12" class="ms-2">
          <h5>{{ userDisplayName }}</h5>
          <div
            class="d-flex flex-md-row flex-column gy-2 align-items-md-center align-items-start justify-content-start gap-md-4"
          >
            <p class="mb-0 mb-md-3">Published on: {{ userCommentTime }}</p>
            <p>
              <strong>Rating: {{ userRating }}</strong>
            </p>
          </div>
        </v-col>
      </div>
      <v-spacer></v-spacer>
      <p class="mt-2">{{ userComment }}</p>
    </v-card-items>
  </v-card>
</template>

<script>
export default {
  name: "ProductReview",
  props: {
    userDisplayName: {
      type: String,
      default: "",
    },
    userAvatarUrl: {
      type: String,
      default: "",
    },
    userRating: {
      type: Number,
      default: -1,
    },
    userComment: {
      type: String || undefined,
      default: undefined,
    },
    userCommentTime: {
      type: Date || undefined,
      default: undefined,
    },
  },
};
</script>
