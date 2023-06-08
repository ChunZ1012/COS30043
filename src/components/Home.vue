<template>
  <v-row>
    <v-card
      elevation="4"
      variant="plain"
      class="w-100 mx-auto mb-3"
      height="500"
    >
      <v-carousel 
        :hide-delimiter-background="true" 
        :show-arrows="'hover'" 
        cycle
      >
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

  <v-fade-transition
    :group="true"
  >
    <ProductsCarousel
      v-if="!isLoading"
      v-for="(type, key) in productTypes"
      :key="key"
      :products="getProductByCategory(type)"
      :title="getProductCategoryTitle(type)"
      :linkTo="type"
    ></ProductsCarousel>
  </v-fade-transition>
</template>

<script>
import { useGET } from "@/assets/js/HttpManager";
import ProductsCarousel from "@/views/misc/products/ProductsCarouselView.vue";
import ProductCategoryEnum from "@/assets/js/enums/ProductCategoryEnum.js";
import SliderData from "@/assets/data/Sliders.json";
import { mapState } from "vuex";
import { BASEURL } from "@/inc/const";

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
    this.getBanners();
  },
  computed: {
    ...mapState(['auth', 'loading'])
  },
  methods: {
    getProductData() {
      // this.$store.commit('loading/setLoadingStatus', true);
      // Set api url
      let url = `${BASEURL}/products/list?desc=false`;
      // fetch data from api and assign to local variables
      useGET(url, {
        callback: (r, e) => {
          this.products = r;
          // Get distinct product type value from product list
          this.productTypes = new Set(this.products.map((p) => p.productType));
          // Stop loading overlay
          this.$store.commit('loading/setLoadingStatus', false);
          this.isLoading = false;
        },
      });
    },
    getBanners() {
      this.sliders = [];
      let url = `${BASEURL}/banners/list`;
      useGET(url, {
        callback: (r, e) => { 
          if(e) console.log(e);
          else {
            r.forEach(rx => {
              let d = {
                url: rx.banner
              };
              this.sliders.push(d);
            });
          }
        }
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
