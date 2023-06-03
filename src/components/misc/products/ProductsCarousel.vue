<template>
  <!-- Products Carousel Header -->
  <div class="d-flex flex-row mt-4 mb-1 align-items-center">
    <h2 class="fw-bold">{{ title }}</h2>
    <p class="fs-5" v-if="description === undefined || description.length <= 0">
      {{ description }}
    </p>
    <v-spacer></v-spacer>
    <v-btn
      variant="text"
      :to="{
        name: 'ProductsType',
        params: {
          productType: linkTo,
        },
      }"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-arrow-right"></v-icon>
      </template>
      View More</v-btn
    >
  </div>
  <!-- Products Carousel -->
  <v-slide-group
    show-arrows="hover"
    hide-delimeters
    max="0"
    multiple="false"
    mandatory="false"
    class="my-1"
  >
    <v-slider-group-item v-for="(product, idx) in products" :key="idx">
      <v-col cols="12" class="my-2">
        <ProductCard
          :pid="product?.productId"
          :title="product?.productTitle"
          :url="product?.productImageUrl"
          :hoverUrl="product?.productImageHoverUrl"
          :price="product?.productPrice"
          :discount="product?.productDist == 1"
          :distAmt="product?.productDistAmt"
        ></ProductCard>
      </v-col>
    </v-slider-group-item>
  </v-slide-group>
</template>

<script>
import ProductCard from "@/views/misc/products/ProductCardView.vue";
import { isMobile } from "mobile-device-detect";

export default {
  name: "ProductsCarousel",
  props: {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    linkTo: {
      type: String,
      default: "",
    },
    products: {
      type:Array,
      default: []
    },
  },
  methods: {
    isMobileDevice() {
      return isMobile;
    },
  },
  components: {
    ProductCard,
  },
};
</script>
