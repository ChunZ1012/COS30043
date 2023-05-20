<template>
  <nav class="navbar navbar-expand-md nav-theme">
    <div class="container-fluid">
      <h4>BRANDING</h4>
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
            <template
              v-if="link.children !== undefined && link.children.length > 0"
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

        <div class="d-flex flex-row align-items-center gap-3">
          <form class="d-flex mt-2 mt-lg-0 nav-search-bar">
            <v-text-field
              v-model="searchText"
              type="text"
              name="Search"
              label="Search"
              variant="outlined"
              append-inner-icon="mdi-magnify"
              clearable
              hide-details
              :autofocus="false"
              :autocomplete="false"
            ></v-text-field>
          </form>
          <v-badge :content="cartsCount" class="d-none d-lg-inline-block">
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

          <v-icon
            size="x-large"
            icon="mdi-account-outline"
            class="d-none d-lg-inline-flex"
          ></v-icon>
        </div>
      </div>
    </div>
  </nav>
  <v-container fluid class="pa-md-2 p-2 mt-2">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
    <!-- <router-view /> -->
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

export default {
  name: "Container",

  data: () => ({
    searchText: "",
    cartsCount: 0,
    links: [
      {
        title: "Home",
        routeName: "Home",
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
        routeName: "Orders",
      },
      {
        title: "My Cart",
        routeName: "Carts",
        onlyInMobile: true,
      },
      {
        title: "My Account",
        routeName: "Carts",
        onlyInMobile: true,
      },
    ],
  }),
  created() {
    this.getUserCarts();

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
  methods: {
    isMobileDevice() {
      return isMobile;
    },
    getUserCarts() {
      this.$store.commit("fetchCartData");
      this.$store.watch(
        (state, getters) => {
          return getters.getCartsCount;
        },
        (v) => {
          this.cartsCount = v;
        }
      );
    },
  },
};
</script>
