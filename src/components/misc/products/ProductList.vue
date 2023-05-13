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
    <!-- Filtering Panel -->
    <v-col
      class="d-lg-block d-none"
      cols="12"
      md="2"
    >
      <ProductListFilter
        :priceRange="priceRange"
        :categories="categories"
        :priceMax="priceMax"
        @onSelectedCategoryChange="onSelectedCategoryChange"
        @onPriceRangeChange="onPriceRangeChange"
      ></ProductListFilter>
    </v-col>
    <!-- Container -->
    <v-col 
      cols="12" 
      md="10"
    >
      <h2>{{ breadcrumbs.length > 1 ? breadcrumbs[1] : "" }}</h2>

      <div class="d-flex flex-row gap-2 align-items-center d-md-none"
      >
        <v-dialog
          v-model="mobileFilterDialog"
          width="auto"
          class="pa-2"
        >
          <template v-slot:activator="{ props }"
          >
            <v-btn
              class="ma-2"
              color="gray-lighten-3"
              variant="outlined"
              v-bind="props"
            >
              <v-icon
                start
                size="large"
                icon="mdi-filter-variant"
              ></v-icon>
              Filter
            </v-btn>
          </template>

          <v-card>
            <v-card-title>Filtering Panel</v-card-title>
            <div class="px-2">
              <v-divider :thickness="3" class="mt-0"></v-divider>
            </div>
            <ProductListFilter
              :isMobile="true"
              :showOutline="false"
              :priceRange="priceRange"
              :categories="categories"
              :priceMax="priceMax"
              @onSelectedCategoryChange="onSelectedCategoryChange"
              @onPriceRangeChange="onPriceRangeChange"
            ></ProductListFilter>

            <v-card-actions
              class="d-flex flex-row align-items-center justify-content-end"
            >
              <v-btn
                class="ma-2"
                color="gray-lighten-3"
                variant="outlined"
                @click="mobileFilterDialog = false"
              >Close</v-btn>
              <v-btn
                class="ma-2"
                color="gray-lighten-3"
                variant="outlined"
                @click="mobileFilterDialog = false"
              >Apply</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <!-- Sorting -->
      <div 
        class="d-flex flex-row col-md-4 col-12 py-2 my-2 gap-3 align-items-center"
      >
        <span
          class="fs-6"
        >Sort By: </span>
        <v-select
          v-model="selectedSort"
          :items="sortOptions"
          item-value="optionId"
          item-title="optionText"
          density="comfortable"
          label="Select"
          variant="outlined"
          hide-details
          return-object
          single-line
        ></v-select>
        <v-spacer></v-spacer>
      </div>
      <!-- Product List -->
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
            :showRating="true"
            :rating="getProductAvgRating(product?.info)"
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
import ProductListFilter from "./ProductListFilter.vue";

export default {
  name: "ProductList",
  props: {
    breadcrumbTitle: {
      type:String,
      default:"All Products"
    },
    productType: {
      type:String,
      default:undefined
    },
  },
  data: function() {
    return {
      // #############
      // Real
      // #############
      breadcrumbs: ["Home"],
      pType: "all",
      // Filter
      mobileFilterDialog:false,
      priceRangeTimeout:undefined,
      textSearch: "",
      selectedCategory: [],
      priceMax: 9999.99,
      priceRange: [0,  9999.99],
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
      //Sorting
      selectedSort: {
          optionId:1,
          optionText: "Price: Low to High"
      },
      sortOptions: [
        {
          optionId:1,
          optionText: "Price: Low to High"
        },
        {
          optionId:2,
          optionText: "Price: High to Low"
        },
        {
          optionId:3,
          optionText: "Rating: Low to High"
        },
        {
          optionId:4,
          optionText: "Rating: High to Low"
        }
      ]
    }
  },
  created() {
    this.initialize();
    // Watch route changes
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        let params = undefined;
        if(Object.hasOwn(toParams, 'productType')) {
          if(Object.keys(ProductCategoryEnum).includes(toParams.productType)) {
            params = toParams;
          }
        }
        this.initialize(params);
      }
    );
  },
  methods: {
    initialize(toParams = undefined) {
      // Testing, read data from json
      this.products = ProductData;
      // Get the default breadcrumb title (Use for All Product)
      let breadcrumbTitle = this.breadcrumbTitle;
      // If the user do not navigate to other category page, and land on All Product page
      let currentUrl = this.$route.path.split('/', 3);
      if((toParams === undefined && this.productType == undefined) || (currentUrl.length > 2 && currentUrl[2] == 'all')) {
        this.pType = 'all';
      }
      // productType is passed by the router (Defined in @/router/index.js)
      // If the user click on the other category page
      else if(toParams !== undefined) {
        this.pType = toParams.productType;
      }
      else if(this.productType.length > 0) {
        console.log(this.productType);
        this.pType = this.productType;
      }

      console.log('toParams null: ' + (toParams == undefined) + ', product type: ' + this.productType + ', pType: ' + this.pType);

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

      switch(this.selectedSort.optionId) {
        case 1:
        case 2:
          templist = templist.sort((a, b) =>  {
            let ap = a.discount ? (a.price - a.distAmt) : a.price;
            let bp = b.discount ? (b.price - b.distAmt) : b.price;

            return this.selectedSort.optionId == 1 ? (ap - bp) : (bp - ap);
          });
          break;
        case 3:
        case 4:
          templist = templist.sort((a, b) =>  {
            let ar = a.info.reviews.reduce((total, r) => total + r.userRating, 0);
            let br = b.info.reviews.reduce((total, r) => total + r.userRating, 0);

            ar = ar / a.info.reviews.length;
            br = br / b.info.reviews.length;

            return this.selectedSort.optionId == 3 ? (ar - br) : (br - ar);
          });
          break;
      }

      // Reset current page to 1
      this.currentPage = 1;
      this.filteredList = templist;
    },
    onSelectedCategoryChange(data) {
      this.selectedCategory = data;
    },
    onPriceRangeChange(data) {
      if(this.priceRangeTimeout !== undefined) clearTimeout(this.priceRangeTimeout);
      this.priceRangeTimeout = setTimeout(() => {
        this.priceRange = data;
      }, 550);
    },
    getProductAvgRating(productInfo) {
      let totalRating = productInfo.reviews.reduce((total, r) => total + r.userRating, 0);
      return (totalRating / (productInfo.reviews.length)).toFixed(2);
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
    },
    selectedSort() {
      this.filterProducts();
    }
  },
  components: {
    ProductCard,
    ProductListFilter
  },
};
</script>
