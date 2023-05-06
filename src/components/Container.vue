<template>
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
          <h4>BRANDING</h4>
          <button class="navbar-toggler"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbar">
              <span class="navbar-toggler-icon">
              </span>
          </button>
          <div 
            class="collapse navbar-collapse ps-lg-3 ps-0 justify-content-between" 
            id="navbar">
            <ul class="navbar-nav">
                <template
                  v-for="link in links"
                >
                  <template
                    v-if="link.children !== undefined && link.children.length > 0"
                  >
                    <div 
                      class="nav-item dropdown"
                    >
                      <a 
                        class="nav-link dropdown-toggle" 
                        data-bs-toggle="dropdown"
                      >{{ link.title }}</a>
                      <v-expand-transition>
                        <ul
                          class="dropdown-menu"
                        >
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
                                  productType: cLink.id 
                                }
                              }"
                            >{{ cLink.title }}</router-link>
                          </li>
                        </ul>
                      </v-expand-transition>
                    </div>
                  </template>
                  <li 
                    v-else
                    class="nav-item">
                    <router-link 
                      :to="{
                        name:link.routeName
                      }"
                      class="nav-link">
                        {{ link.title }}
                    </router-link>
                  </li>
                </template>
            </ul>

            <div
              class="d-flex flex-row align-items-center gap-3"
            >
              <form
                class="d-flex mt-2 mt-lg-0 nav-search-bar"
              >
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
              <v-badge
                :content="12"
                class="d-none d-lg-inline-block"
              >
                <router-link
                  color="black"
                  :to="{
                    name:'Carts'
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
  <!--
  <v-app-bar flat rounded dense>
    <v-app-bar-nav-icon
      class="d-block d-md-none"
      variant="text"
      @click.stop.prevent="drawer = !drawer"
    >
    </v-app-bar-nav-icon>

    <v-container
      class="fill-height d-md-flex d-none align-center"
      fluid
    >
      <template
        v-for="(link, key) in links"
      >
        <template
          v-if="link.children !== undefined && link.children.length > 0"
        >
          <v-menu
            location="bottom"
          >
            <template
              v-slot:activator="{ props }"
            >
              <v-btn
                variant="text"
                v-bind="props"
              >{{ link.title }}</v-btn>
            </template>

            <v-list
              v-for="(cLink, cKey) in link.children"
              nav="true"
              mandatory="false"
              density="comfortable"
              elevation="0"
              :rounded="false"
              class="rounded-0"
            >
              <v-list-item
                rounded="false"
                nav="true"
                variant="flat"
                :to="{
                  name: link.routeName,
                  params: {
                    productType:cLink.id
                  }
                }"
              >{{ cLink.title }}</v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template
          v-else
        >
          <router-link
            :to="{
              name: link.routeName
            }"
            class="text-decoration-none text-dark"
          >
            <v-btn variant="text">
              {{ link.title }}
            </v-btn>
          </router-link>
        </template>
      </template>

      <v-spacer></v-spacer>

      <v-responsive max-width="260">
        <v-text-field
          density="compact"
          hide-details
          variant="solo"
        ></v-text-field>
      </v-responsive>

      <v-avatar color="grey-darken-1" class="me-10 ms-4 d-md-block d-none" size="32"></v-avatar>
    </v-container>
  </v-app-bar>

  <v-navigation-drawer 
    class="d-md-block d-none"
    v-model="drawer" 
    location="top" 
    temporary
  >
     <v-col>
      <router-link
        v-for="(link, idx) in links"
        :to="{
          name:link.name
        }"
        :key="idx"
        class="text-decoration-none text-dark"
      >
        <v-btn variant="text">{{ link.title }}</v-btn>
      </router-link>
    </v-col>
  </v-navigation-drawer>
  -->
  <v-container 
    fluid
    class="p-md-2 p-1 mt-2"
  >
    <router-view />
  </v-container>
</template>

<style>
/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (max-width: 767.99px) {
  .main-container {
    margin-top:0px;
  }
}
@media only screen and (min-width: 768px) {
  .main-container {
    margin-top:64px;
  }
}

.dropdown-menu > .nav-item {
  transform-origin: top center;
  animation: translateX 300ms 100ms ease-in-out forwards;
}

@keyframes translateX {
  0% {
    opacity: 0;
    transform:translateX(60px);
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
import ProductCategoryEnum from "@/assets/js/enums/ProductCategoryEnum.js"

export default {
  name: "Container",

  data: () => ({
    searchText:"",
    links: [
      {
        title: "Home",
        routeName:"Home",
      },
      {
        title: "Products",
        routeName:"Products",
      },
      {
        title: "Our Choices",
        routeName: "ProductsType", 
        children: []
      },
      {
        title: "Order",
        routeName:"Orders",
      },
    ],
  }),
  created() {
    let productCategoryLink = this.links.find(l => l.routeName == "ProductsType");
    let productCategories = [];

    Object.keys(ProductCategoryEnum).forEach((v) => {
      productCategories.push({
        id:v,
        title: ProductCategoryEnum[v]
      });
    });
    productCategoryLink.children = productCategories;
  },
  methods: {
    isMobileDevice() {
      return isMobile;
    },
  },
};
</script>
