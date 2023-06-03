<template>
  <nav class="navbar navbar-expand-md nav-theme">
    <div class="container-fluid">
      <h4>X-MOBILE</h4>
      <button
        class="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navbar"
      >
        <span class="navbar-toggler-icon"> </span>
      </button>
      <div
        class="collapse navbar-collapse ps-lg-3 ps-0 justify-content-between"
        id="navbar"
      >
        <ul class="navbar-nav">
          <template v-for="link in links">
            <!-- Sub Nav -->
            <template
              v-if="link.children !== undefined && link.children?.length > 0"
            >
              <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">{{
                  link.title
                }}</a>
                <ul class="dropdown-menu">
                  <li
                    v-for="(cLink, cKey) in link.children"
                    class="nav-item"
                    :key="cKey"
                  >
                    <router-link
                      class="dropdown-item"
                      :to="{
                        name: link.routeName,
                        params: {
                          productType: cLink.id,
                        },
                      }"
                      >{{ cLink.title }}</router-link
                    >
                  </li>
                </ul>
              </div>
            </template>
            <!-- Mobile Link -->
            <template
              v-else-if="link.onlyInMobile !== undefined && link.onlyInMobile"
            >
              <li class="nav-item d-block d-md-none">
                <router-link
                  :to="{
                    name: link.routeName,
                  }"
                  class="nav-link"
                >
                  {{ link.title }}
                </router-link>
              </li>
            </template>
            <!-- Normal Nav -->
            <li v-else class="nav-item">
              <router-link
                :to="{
                  name: link.routeName
                }"
                class="nav-link"
              >
                {{ link.title }}
              </router-link>
            </li>
          </template>
        </ul>

        <div 
          class="d-flex flex-row align-items-center justify-content-end w-100 w-md-40 gap-4"
        >
          <form 
            class="d-flex mt-2 mt-lg-0 col-md-8 col-12"
            @submit.stop.prevent="onSearchFormSubmit"
            v-if="!hideSearchBar"
          >
            <v-text-field
              v-model="searchText"
              type="text"
              name="Search"
              label="Search Products"
              variant="outlined"
              append-inner-icon="mdi-magnify"
              clearable
              hide-details
              :autofocus="false"
              :autocomplete="false"
            ></v-text-field>
          </form>
          <v-badge
            :content="cartsCount" 
            class="d-none d-lg-inline-block"
          >
            <router-link
              color="black"
              :to="{
                name: 'Carts',
              }"
              tag="div"
            >
              <v-icon
                size="large"
                icon="mdi-cart-outline"
                type="button"
              ></v-icon>
            </router-link>
          </v-badge>

          <v-menu
          >
            <template 
              v-slot:activator="{ props }"
            >
              <v-icon
                v-bind="props"
                size="x-large"
                icon="mdi-account-outline"
                class="d-none d-lg-inline-flex"
              ></v-icon>
            </template>

            <v-list>
              <v-list-item
                :to="{
                  name: 'UserAccount'
                }"
              >
                <v-list-item-title>My Account</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="onAccountLogClick"
              >
                <v-list-item-title>{{ accountLogText }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
  </nav>
  <v-container fluid class="pa-md-2 p-2 mt-2">
    <v-overlay
      v-model="isLoading"
      contained
      scroll-strategy="block"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <!-- <router-view
      v-slot="{ Component }"
    >
      <component :is="Component" />
    </router-view> -->
    <router-view />
  </v-container>
</template>

<style>
/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (max-width: 767.99px) {
  .main-container {
    margin-top: 0px;
  }
}
@media only screen and (min-width: 768px) {
  .main-container {
    margin-top: 64px;
  }
}

.dropdown-menu > .nav-item {
  transform-origin: top center;
  animation: translateX 300ms 100ms ease-in-out forwards;
}

@keyframes translateX {
  0% {
    opacity: 0;
    transform: translateX(60px);
  }
  80% {
    transform: translateX(-5px);
  }

  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
</style>

<script>
import { isMobile } from "mobile-device-detect";
import ProductCategoryEnum from "@/assets/js/enums/ProductCategoryEnum.js";
import LoadingView from '@/views/misc/helpers/LoadingView.vue';
import { mapState ,mapGetters } from "vuex";

export default {
  name: "Container",

  data: () => ({
    searchText: "",
    cartsCount: 0,
    // Login
    isLoggedIn: false,
    accountLogText: 'Login',
    isLoading: true,
    hideSearchBar: false,
    // Nav bar
    links: [
      {
        title: "Home",
        routeName: "Home",
        children: undefined,
      },
      {
        title: "Products",
        routeName: "Products",
      },
      {
        title: "Our Choices",
        routeName: "ProductsType",
        children: [],
      },
      { 
        title: "Order",
        routeName: "Orders"
      },
      {
        title: "My Cart",
        routeName: "Carts",
        onlyInMobile: true
      },
      {
        title: "My Account",
        routeName: "UserAccount",
        onlyInMobile: true,
      },
    ],
    // Watcher
    routeWatcher: null,
    loadingWatcher: null,
    loginWatcher: null,
    cartWatcher: null
  }),
  created() {
    // Initialize the nav
    this.initializeProductCategoryNav();
    // Watch the route change, and react to the change
    this.observeRouteChange();
    // observe the loading state to display the loading screen accordingly
    this.observeLoadingState();
    // observe the login status, hence execute specific function
    this.observeLoginState();
    // Observe the available carts count
    this.observeCartsCount();
  },
  computed: {
    // Map both vuex modules together
    ...mapState(['cart', 'loading']),
    // Map both vuex modules' getter together
    ...mapGetters(['cart', 'loading'])
  },
  methods: {
    isMobileDevice() {
      return isMobile;
    },
    initializeProductCategoryNav() {
      let productCategoryLink = this.links.find(
        (l) => l.routeName == "ProductsType"
      );
      let productCategories = [];
      Object.keys(ProductCategoryEnum).forEach((v) => {
        if(v != 'all') {
          productCategories.push({
            id: v,
            routeParams: {
              productType: v
            },
            title: ProductCategoryEnum[v],
          });
        }
      });
      productCategoryLink.children = productCategories;
    },
    observeCartsCount() {
      // Fetch cart data before watch
      this.$store.commit('cart/fetchCartData');
      // Keep observing
      this.cartWatcher = this.$store.watch(
        (state, getters) => {
          // Array type access to vuex module getter (namespace/gettersName)
          return getters['cart/cartsCount'];
        },
        (v) => {
          this.cartsCount = v;
        }
      );
    },
    onSearchFormSubmit() {
      // Passing search query to product list
      this.$router.push({
        name:"Products",
        query: {
          q: this.searchText
        }
      });
      // Remove typed text
      this.searchText = "";
    },
    observeRouteChange() {
      // Run once
      this.hideSearchBarIfRouteMatch(this.$route.name);
      // Keep observing
      this.routeWatcher = this.$watch(() => this.$route, 
      (to, from) => this.hideSearchBarIfRouteMatch(to.name));
    },
    hideSearchBarIfRouteMatch(routeName) {
      this.hideSearchBar = (routeName == 'Products' || routeName == 'ProductsType');
    },
    observeLoadingState() {
      // Keep observing
      this.loadingWatcher = this.$store.watch(
        (state, getters) => {
          return state.loading.isLoading;
        },  
        (v) => {
          this.isLoading = v;
        }
      );
    },
    observeLoginState() {
      // Run once
      this.isLoggedIn = this.$store.getters['auth/isLoggedIn'];
      this.accountLogText = this.isLoggedIn ? 'Logout' : 'Login';

      // Keep observing
      this.loginWatcher = this.$store.watch(
        (state, getters) => {
          return getters['auth/isLoggedIn'];
        },
        (v) => {
          this.isLoggedIn = v;
          if(v) {
            this.$store.commit("cart/fetchCartData");
            this.accountLogText = 'Logout';
          }
          else this.accountLogText = 'Login';
        })
    },
    onAccountLogClick() {
      if(this.isLoggedIn) {
        this.$store.dispatch('auth/logout');
        this.$store.commit('cart/clearCartData');
      }
      else {
        this.$router.push({
          name:"Login"
        });
      }
    }
  },
  destroyed() {
    // Unwatch all watcher
    this.loginWatcher();
    this.loadingWatcher();
    this.cartWatcher();
    this.routeWatcher();
  },
  components: {
    LoadingView
  }
};
</script>
