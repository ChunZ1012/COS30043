<template>
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
                    productType  :cLink.id
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
    <!-- <v-col>
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
    </v-col> -->
  </v-navigation-drawer>

  <v-container 
    fluid
    class="main-container p-md-3 p-4"
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
</style>

<script>
import { isMobile } from "mobile-device-detect";
import ProductCategoryEnum from "@/assets/js/enums/ProductCategoryEnum.js"

export default {
  name: "Container",

  data: () => ({
    drawer: false,
    group: null,
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
        title: "Categories",
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
  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
