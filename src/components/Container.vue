<template>
  <v-app-bar flat rounded dense>
    <v-app-bar-nav-icon
      v-if="isMobileDevice()"
      variant="text"
      @click.stop="drawer = !drawer"
    >
    </v-app-bar-nav-icon>

    <v-container
      v-if="!isMobileDevice()"
      class="fill-height d-flex align-center"
      fluid
    >
      <router-link
        v-for="(link, idx) in links"
        :to="{
          name: link.routeName
        }"
        :key="idx"
        class="text-decoration-none text-dark"
      >
        <v-btn variant="text">
          {{ link.title }}
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>

      <v-responsive max-width="260">
        <v-text-field
          density="compact"
          hide-details
          variant="solo"
        ></v-text-field>
      </v-responsive>

      <v-avatar color="grey-darken-1" class="me-10 ms-4" size="32"></v-avatar>
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" location="top" temporary>
    <v-col>
      <router-link
        v-for="(link, idx) in links"
        :to="link.url"
        :key="idx"
        class="text-decoration-none text-dark"
      >
        <v-btn variant="text">{{ link.title }}</v-btn>
      </router-link>
    </v-col>
  </v-navigation-drawer>

  <v-container fluid style="margin-top: 64px">
    <router-view />
  </v-container>
  <!-- Comment -->
  <!--
  <v-main class="bg-grey-lighten-3">
      <v-container fluid>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">
              <v-list rounded="lg">
                <v-list-item
                  v-for="n in 5"
                  :key="n"
                  link
                >
                  <v-list-item-title>
                    List Item {{ n }}
                  </v-list-item-title>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item
                  link
                  color="grey-lighten-4"
                >
                  <v-list-item-title>
                    Refresh
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet
              min-height="70vh"
              rounded="lg"
            >
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
  </v-main>
  -->
</template>

<script>
import { isMobile } from "mobile-device-detect";

export default {
  name: "Container",

  data: () => ({
    drawer: false,
    group: null,
    links: [
      {
        title: "Home",
        routeName:"Home",
        url: "/",
      },
      {
        title: "Products",
        routeName:"Products",
        url: "products",
      },
      {
        title: "Order",
        routeName:"Orders",
        url: "orders",
      },
    ],
  }),
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
