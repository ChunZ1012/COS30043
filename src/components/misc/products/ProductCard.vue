<template>
  <v-card
    role="button"
    elevation="4"
    variant="plain"
    class="mx-auto p-1"
    ripple="true"
    :md="variableWidth ? 200 : undefined"
    :lg="variableWidth ? 290 : undefined"
    :width="!variableWidth ? 300 : undefined"
    rounded="8"
    :to="{
      name: 'ProductDetail',
      params: {
        id: this.pid,
      },
      query: {
        name: this.title,
      },
    }"
  >
    <v-hover v-slot="{ isHovering, props }">
      <!-- Non hover image -->
      <v-img
        v-bind="props"
        height="250"
        aspect-ratio="1/1"
        :src="url"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
        </template>
        <!-- Hovered image -->
        <v-fade-transition>
          <v-img
            v-bind="props" 
            v-show="isHovering && hoverUrl.length > 0"
            aspect-ratio="1/1" 
            :src="hoverUrl"
            class="product-card-hover"
          ></v-img>
        </v-fade-transition>
      </v-img>
    </v-hover>
    <!-- Product Price -->
    <v-card-item>
      <h4 class="fw-bold text-truncate">{{ title }}</h4>
      <div class="d-flex flex-row align-items-center" v-if="discount">
        <del>
          <span class="fs-6">RM {{ getRoundedPrice }}</span>
        </del>
        <span class="fs-5 ms-2" style="color: chocolate"
          >RM {{ getPriceAfterDiscount }}</span
        >
      </div>

      <div class="d-flex flex-row align-items-center" v-else>
        <span class="fs-5" color="white">RM {{ getRoundedPrice }}</span>
      </div>
    </v-card-item>
    <!-- Product Rating -->
    <div
      v-if="showRating"
      class="d-flex flex-row align-items-center p-1 ms-2 m-1"
    >
      <span class="fs-5 fw-bold">{{ rating }}</span>
      <v-rating
        :model-value="rating"
        color="yellow-darken-2"
        half-increments
        density="compact"
      ></v-rating>
    </div>
    <!-- What is this? -->
    <!-- <v-overlay
      contained
      :absolute="absolute"
      :model-value="isHovering"
      class="align-center justify-center"
    >
      <template>
        <v-img aspect-ratio="1/1" :src="hoverUrl" class="w-100 h-100">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
      </template>
    </v-overlay> -->
  </v-card>
</template>

<style type="text/css">
  .product-card-hover {
    height:100%;
    background-color: white;
  }
</style>

<script>
export default {
  name: "ProductCard",
  props: {
    pid: {
      type: String || Number,
      default: -1,
    },
    title: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    hoverUrl: {
      type: String,
      default: "",
    },
    discount: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    distAmt: {
      type: Number,
      default: 0,
    },
    showRating: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: -1,
    },
    variableWidth: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getRoundedPrice() {
      return parseFloat(this.price).toFixed(2);
    },
    getPriceAfterDiscount() {
      return (this.price - this.distAmt).toFixed(2);
    },
  },
};
</script>
