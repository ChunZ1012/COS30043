<template>
  <v-row>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    <v-spacer></v-spacer>
    <!-- Search field -->
    <v-col cols="12" md="4">
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
    <v-col class="d-lg-block d-none" cols="12" md="2">
      <ProductListFilter
        :priceRange="priceRange"
        :categories="categories"
        :priceMax="priceMax"
        @onSelectedCategoryChange="onSelectedCategoryChange"
        @onPriceRangeChange="onPriceRangeChange"
      ></ProductListFilter>
    </v-col>
    <!-- Container -->
    <v-col cols="12" md="10">
      <h2>{{ breadcrumbs.length > 1 ? breadcrumbs[1] : "" }}</h2>

      <div class="d-flex flex-row gap-2 align-items-center d-md-none">
        <v-dialog v-model="mobileFilterDialog" width="auto" class="pa-2">
          <template v-slot:activator="{ props }">
            <v-btn
              class="ma-2"
              color="gray-lighten-3"
              variant="outlined"
              v-bind="props"
            >
              <v-icon start size="large" icon="mdi-filter-variant"></v-icon>
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
                >Close</v-btn
              >
              <v-btn
                class="ma-2"
                color="gray-lighten-3"
                variant="outlined"
                @click="mobileFilterDialog = false"
                >Apply</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <!-- Sorting -->
      <div
        class="d-flex flex-row col-md-4 col-12 py-2 my-2 gap-3 align-items-center"
      >
        <span class="fs-6">Sort By: </span>
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
      <div>
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
              :pid="product?.productId"
              :title="product?.productTitle"
              :url="product?.productImageUrl"
              :price="product?.productPrice"
              :discount="product?.productDist"
              :distAmt="product?.productDistAmt"
              :showRating="true"
              :rating="parseFloat(product.productOverallRating).toFixed(2)"
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
      </div>
    </v-col>
  </v-row>
</template>

<style type="text/css">
ul.v-pagination__list {
  padding: 0px;
}
</style>

<script>
import { isMobile } from "mobile-device-detect";
import { useGET } from "@/assets/js/HttpManager";
import ProductCard from "@/views/misc/products/ProductCardView.vue";
import ProductCategoryEnum from "@/assets/js/enums/ProductCategoryEnum.js";
import ProductListFilter from "./ProductListFilter.vue";
import { mapGetters, mapState } from "vuex";
import { BASEURL } from "@/inc/const";

export default {
  name: "ProductList",
  data: function () {
    return {
      // #############
      // Real
      // #############
      breadcrumbs: ["Home"],
      pType: "all",
      // Filter
      mobileFilterDialog: false,
      priceRangeTimeout: undefined,
      textSearch: "",
      selectedCategory: [],
      priceMax: 3500,
      priceRange: [0, 3500],
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
        {
          name: "ac",
          title: "Accessories",
        },
      ],
      //Sorting
      selectedSort: {
        optionId: 1,
        optionText: "Price: Low to High",
      },
      sortOptions: [
        {
          optionId: 1,
          optionText: "Price: Low to High",
        },
        {
          optionId: 2,
          optionText: "Price: High to Low",
        },
        {
          optionId: 3,
          optionText: "Rating: Low to High",
        },
        {
          optionId: 4,
          optionText: "Rating: High to Low",
        },
      ],
      // Watcher
      routeUnwatcher: undefined
    };
  },
  created() {
    this.startLoading;
    // Set api url
    let url = `${BASEURL}/products/list`;
    // fetch data from api and assign to local variables
    useGET(url, {
      callback: (r) => {
        this.products = r;
        this.initialize();
      },
    });

    // Watch route changes
    this.routeUnwatcher = this.$watch(
      () => this.$route.params,
      (toParams, fromParams) => {
        if (Object.hasOwn(toParams, "productType")) {
          this.initialize();
        }
      }
    );

    let searchQuery = this.$route.query.q;
    if(searchQuery != undefined || searchQuery != "" || searchQuery.length > 0) {
      this.textSearch = searchQuery;
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapGetters(['loading']),
    startLoading() {
      this.$store.commit('loading/setLoadingStatus', true);
    },
    stopLoading() {
      this.$store.commit('loading/setLoadingStatus', false);
    }
  },
  methods: {
    initialize() {
      // get productType param value from route, default is all
      this.pType = this.$route.params.productType ?? 'all';
      let breadcrumbTitle = this.getProductCategoryTitle(this.pType);
      
      if (this.breadcrumbs.length > 1) this.breadcrumbs[1] = breadcrumbTitle;
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
      if (this.products == undefined || this.products.length == 0) return;

      let templist =
        this.textSearch == undefined ||
        this.textSearch.length <= 0 ||
        this.selectedCategory.length <= 0
          ? this.products
          : this.filteredList;
      let self = this;

      // Filter by product type (eg. recommended, best-seller), exclude All Product
      templist = templist.filter((p) =>
        self.pType.toLowerCase() == "all"
          ? true
          : self.pType.toLowerCase().includes(p.productType.toLowerCase())
      );

      // If the cateogy filter is selected at least one
      if (this.selectedCategory.length > 0) {
        templist = templist.filter((p) => {
          // Check if the product has same category as selected categories
          let isInclude = self.selectedCategory.includes(
            p.productCatg.toLowerCase()
          );
          // If there is any text keyed into the search field, then apply filter to products list
          if (this.textSearch !== undefined && this.textSearch.length > 0) {
            isInclude &= p.productTitle
              .toLowerCase()
              .includes(this.textSearch.toLowerCase());
          }
          // return the include status
          return isInclude;
        });
      } else {
        // if user had keyed in the keyword, then filter the list
        if (this.textSearch !== undefined && this.textSearch.length > 0) {
          templist = templist.filter((p) =>
            p.productTitle.toLowerCase().includes(this.textSearch.toLowerCase())
          );
        }
      }
      // Filter by price range
      templist = templist.filter((p) => {
        let finalPrice = this.calculateProductPrice(p);
        return (
          finalPrice >= this.priceRange[0] && finalPrice <= this.priceRange[1]
        );
      });
      // Sorting
      switch (this.selectedSort.optionId) {
        case 1:
        case 2:
          templist = templist.sort((a, b) => {
            let ap = this.calculateProductPrice(a);
            let bp = this.calculateProductPrice(b);

            return this.selectedSort.optionId == 1 ? ap - bp : bp - ap;
          });
          break;
        case 3:
        case 4:
          templist = templist.sort((a, b) => {
            let ar = a.productOverallRating;
            let br = b.productOverallRating;

            return this.selectedSort.optionId == 3 ? ar - br : br - ar;
          });
          break;
      }

      // Reset current page to 1
      this.currentPage = 1;
      this.filteredList = templist;
      this.stopLoading;
    },
    onSelectedCategoryChange(data) {
      this.selectedCategory = data;
    },
    onPriceRangeChange(data) {
      this.startLoading;
      if (this.priceRangeTimeout !== undefined) clearTimeout(this.priceRangeTimeout);

      this.priceRangeTimeout = setTimeout(() => {
        this.priceRange = data;
      this.stopLoading;
      }, 550);
    },
    calculateProductPrice(p) {
      return p.productDist ? p.productPrice - p.productDistAmt : p.productPrice;
    },
    getProductAvgRating(productInfo) {
      let totalRating = productInfo.reviews.reduce(
        (total, r) => total + r.userRating,
        0
      );
      return (totalRating / productInfo.reviews.length).toFixed(2);
    },
    getProductCategoryTitle(category) {
      return ProductCategoryEnum[category];
    },
  },
  watch: {
    selectedCategory() {
      this.filterProducts();
    },
    textSearch() {
      this.filterProducts();
    },
    priceRange() {
      this.filterProducts();
    },
    selectedSort() {
      this.filterProducts();
    },
  },
  destroyed() {
    this.routeUnwatcher();
  },
  components: {
    ProductCard,
    ProductListFilter,
  },
};
</script>
