<template>
  <!-- Products Carousel Header -->
  <v-row class="my-2">
    <h2 class="fw-bold my-2">{{ title }}</h2>
    <p class="fs-5" v-if="description === undefined || description.length <= 0">
      {{ description }}
    </p>
  </v-row>
  <!-- Products Carousel -->
  <v-slide-group
    show-arrows="hover"
    hide-delimeters
    max="0"
    multiple="false"
    mandatory="false"
    class="my-2"
  >
    <v-slider-group-item v-for="(product, idx) in products" :key="idx">
      <v-col cols="12" class="my-2">
        <ProductCard
          :pid="product.id"
          :title="product.title"
          :url="product.url"
          :price="product.price"
          :discount="product.discount"
          :distAmt="product?.distAmt"
        ></ProductCard>
      </v-col>
    </v-slider-group-item>
  </v-slide-group>
  <!--
    <v-row
        class="my-2 d-md-none d-none"
    >
        <v-col
            cols="12"
            md="4"
            lg="4"
            class="my-2"
            v-for="(product, idx) in products"
            :key="idx"
        >
            <Product
                :title="product.title"
                :url="product.url"
                :price="product.price"
                :discount="product.discount"
                :distAmt="product?.distAmt"
            ></Product>
        </v-col>
    </v-row>
    -->
</template>

<script>
import ProductCard from "@/views/misc/products/ProductCardView.vue";
import { isMobile } from "mobile-device-detect";

export default {
  name: "ProductsCarousel",
  props: {
    title: {
      type:String,
      default:""
    },
    description: {
      type:String,
      default:""
    },
    products: [],
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
