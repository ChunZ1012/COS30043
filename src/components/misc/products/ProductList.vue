<template>
  <v-row>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <v-spacer></v-spacer>
    <!-- Search field -->
    <v-col
      cols="12"
      md="4"
    >
      <v-text-field
        v-model="textSearch"
        label="Search"
        hide-details
        single-line
        rounded="16"
        class="col-12"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        type="text"
      ></v-text-field>
    </v-col>
  </v-row>

  <v-row>
    <!-- Filtering panel -->
    <v-col
      v-if="!isMobileDevice()"
      cols="12"
      md="2"
    >
      <v-card
        variant="outlined"
        rounded 
        width="85%"
      >
        <!-- By Category Filtering -->
        <v-card-item density="compact">
          <p class="fs-5">By Category</p>

          <v-checkbox
            v-for="category in categories"
            v-model="selectedCategory"
            :label="category.title"
            :value="category.name"
            density="compact"
            hide-details
          >
          </v-checkbox>
        </v-card-item>

        <div class="px-2">
          <v-divider :thickness="3" class="mt-0"></v-divider>
        </div>

        <v-card-item density="compact">
          <p class="fs-5">By Price</p>

          <v-range-slider
            v-model="priceRange"
            strict
            hide-details
            :max="priceMax"
            :min="0"
            :steps="0.01"
            density="compact"
            thumb-size="12"
          ></v-range-slider>

          <v-row 
            dense 
            class="p-0"
          >
            <v-text-field
              :model-value="priceRange[0].toFixed(2)"
              hide-details
              single-line
              class="col-6"
              type="number"
              variant="flat"
              density="compact"
              @change="$set(priceRange, 0, $event)"
            ></v-text-field>

            <v-text-field
              :model-value="priceRange[1].toFixed(2)"
              hide-details
              single-line
              class="col-6"
              type="number"
              variant="flat"
              density="compact"
              @change="$set(priceRange, 1, $event)"
            ></v-text-field>
          </v-row>
        </v-card-item>
      </v-card>
    </v-col>

    <!-- Product List -->
    <v-col 
      cols="12" 
      md="10"
    >
      <h2>{{ breadcrumbs.length > 1 ? breadcrumbs[1] : "" }}</h2>
      <v-row class="mt-2">
        <v-col
          cols="12"
          md="4"
          lg="3"
          class="my-1"
          v-for="(product, idx) in getCurrentPageProducts()"
          :key="idx"
        >
          <ProductCard
            :pid="product.id"
            :title="product.title"
            :url="product.url"
            :price="product.price"
            :discount="product.discount"
            :distAmt="product?.distAmt"
            :variableWidth="true"
          ></ProductCard>
        </v-col>
      </v-row>
      <!-- Product List Paginator -->
      <v-pagination
        v-model="currentPage"
        :length="Math.ceil(filteredList.length / itemsPerPage)"
        :total-visible="isMobileDevice() ? 2 : 6"
        rounded="circle"
        ellipsis="."
        variant="text"
        :size="isMobileDevice() ? 'small' : 'default'"
        class="mt-md-4 mt-3"
      ></v-pagination>
    </v-col>
  </v-row>
</template>

<style type="text/css">
ul.v-pagination__list {
  padding:0px;
}
</style>

<script>
import { isMobile } from "mobile-device-detect";
import ProductCard from "@/views/misc/products/ProductCardView.vue";
import ProductData from '@/assets/data/Products.json';
import ProductCategoryEnum from "@/assets/js/enums/ProductCategoryEnum.js"

export default {
  name: "ProductList",
  props: {
    breadcrumbTitle: {
      type:String,
      default:""
    },
    productType: {
      type:String,
      default:""
    }
  },
  data: () => ({
    // #############
    // Real
    // #############
    breadcrumbs: ["Home"],
    pType: "all",
    // Filter
    textSearch: "",
    selectedCategory: [],
    priceMax: 9999.99,
    priceRange: [0, 999],
    // Pagination
    currentPage: 1,
    itemsPerPage: 12,
    // Products Data
    products: [],
    filteredList: [],
    categories: [
      {
        name: "pc",
        title: "Phone Case",
      },
      {
        name: "sp",
        title: "Screen Protector",
      },
      {
        name: "ep",
        title: "Earphones",
      },
      {
        name: "hp",
        title: "Headphones",
      },
    ],
  }),
  beforeRouteUpdate(to, from, next) {
    console.log(to);
    console.log(from);
  },
  created() {
    this.initialize();
    // Watch route changes
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        if(Object.hasOwn(toParams, 'productType')) {
          if(Object.keys(ProductCategoryEnum).includes(toParams.productType)) {
            this.initialize(toParams);
          }
        }
      }
    );
  },
  methods: {
    initialize(toParams = undefined) {
      // Testing, read data from json
      this.products = ProductData;
      // Get the default breadcrumb title (Use for All Product)
      let breadcrumbTitle = this.breadcrumbTitle;

      // productCategory is passed by the router (Defined in @/router/index.js)
      // Triggered when the user is landing on this page, without accessing to other
      // category page before landing
      // If the user click on the other category page
      if(toParams !== undefined) {
        breadcrumbTitle = "";
        this.pType = toParams.productType;
      }
      else if(this.productType.length > 0) {
        this.pType = this.productType;
      }
      console.log(toParams == undefined);
      // if the breadcrumb title is empty
      // then we will set the title to based on the product type
      if(breadcrumbTitle.length <= 0 || this.pType != 'all') breadcrumbTitle = this.getProductCategoryTitle(this.pType);
      // Set the breadcrumb title
      if(this.breadcrumbs.length > 1) this.breadcrumbs[1] = breadcrumbTitle;
      else this.breadcrumbs.push(breadcrumbTitle);

      // Assign the product list to products
      this.filteredList = this.products;
      // Filter the products
      this.filterProducts();
    },
    isMobileDevice() {
      return isMobile;
    },
    getCurrentPageProducts() {
      let start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredList.slice(start, start + this.itemsPerPage);
      // return this.filteredList;
    },
    filterProducts() {
      // Get the correct products list based on the filter conditions
      // Get the original product list when either the selected category is empty, or there is no keyword enetered by user
      let templist = ((this.textSearch == undefined || this.textSearch.length <= 0) || (this.selectedCategory.length <= 0)) ? this.products : this.filteredList;
      let self = this;

      // Filter by product type (eg. recommended, best-seller), exclude All Product
      templist = templist.filter(p => (self.pType.toLowerCase() == "all") ? true : (self.pType.toLowerCase().includes(p.type.toLowerCase())));

      // If the cateogy filter is selected at least one
      if(this.selectedCategory.length > 0) {
        templist = templist.filter(p => {
          // Check if the product has same category as selected categories
          let isInclude = self.selectedCategory.includes(p.catg.toLowerCase());
          // If there is any text keyed into the search field, then apply filter to products list
          if(this.textSearch !== undefined || this.textSearch.length > 0) {
            isInclude &= (p.title.toLowerCase().includes(this.textSearch.toLowerCase()));
          }
          // return the include status
          return isInclude;
        });
      }
      else {
        // if user had keyed in the keyword, then filter the list
        if(this.textSearch !== undefined || this.textSearch.length > 0) {
          templist = templist.filter((p) =>
            p.title.toLowerCase().includes(this.textSearch.toLowerCase())
          );
        }
      }
      // Filter by price range
      templist = templist.filter(p => {
        let finalPrice = p.discount ? (p.price - p.distAmt) : p.price;
        return (finalPrice >= this.priceRange[0]) && (finalPrice <= this.priceRange[1]);
      });

      // Reset current page to 1
      this.currentPage = 1;
      this.filteredList = templist;
    },
    getProductCategoryTitle(category) {
      return ProductCategoryEnum[category];
    }
  },
  watch: {
    selectedCategory() {
      this.filterProducts();
    },
    textSearch() {
      this.filterProducts();
    },
    priceRange(){
      this.filterProducts();
    }
  },
  components: {
    ProductCard,
  },
};
</script>
