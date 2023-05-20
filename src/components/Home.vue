<template>
  <v-row>
    <v-card
      elevation="4"
      variant="plain"
      class="w-100 mx-auto mb-3"
      height="500"
    >
      <v-carousel hide-delimiter-background show-arrows="hover" cycle>
        <v-carousel-item
          v-for="(slider, i) in sliders"
          :key="i"
          :src="slider.url"
          cover
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-row>

  <ProductsCarousel
    v-for="(type, key) in productTypes"
    :key="key"
    :products="getProductByCategory(type)"
    :title="getProductCategoryTitle(type)"
    :linkTo="type"
  ></ProductsCarousel>
</template>

<script>
import { useGET } from "@/assets/js/HttpManager";
import ProductsCarousel from "@/views/misc/products/ProductsCarouselView.vue";
import ProductCategoryEnum from "@/assets/js/enums/ProductCategoryEnum.js";
import SliderData from "@/assets/data/Sliders.json";

export default {
  name: "Home",
  data: function () {
    return {
      isLoading: true,
      // Arrays
      sliders: [],
      products: [],
      productTypes: [],
    };
  },
  created() {
    this.getProductData();
    this.sliders = SliderData;
  },
  methods: {
    getProductData() {
      this.isLoading = true;
      // Set api url
      let url = "http://localhost/COS30043/index.php/products/list?desc=false";
      // fetch data from api and assign to local variables
      const { error, stop } = useGET(url, {
        callback: (r) => {
          this.products = r;
          // Get distinct product type value from product list
          this.productTypes = new Set(this.products.map((p) => p.productType));
          stop();
          // Stop loading overlay
          this.isLoading = false;
        },
      });
    },
    getProductByCategory(category) {
      return this.products.filter(
        (p) => p.productType.toLowerCase() == category.toLowerCase()
      );
    },
    getProductCategoryTitle(category) {
      return ProductCategoryEnum[category];
    },
  },
  components: {
    ProductsCarousel,
  },
};
</script>
