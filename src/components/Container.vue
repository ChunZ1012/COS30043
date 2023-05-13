<template>
    <nav class="navbar navbar-expand-md">
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
                    </div>
                  </template>
                  <template
                    v-else-if="link.onlyInMobile !== undefined && link.onlyInMobile"
                  >
                    <li
                      class="nav-item d-block d-md-none">
                      <router-link 
                        :to="{
                          name:link.routeName
                        }"
                        class="nav-link">
                          {{ link.title }}
                      </router-link>
                    </li>
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
                :content="getCartCount"
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
  <v-container 
    fluid
    class="p-md-2 p-2 mt-2"
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
import { useToast } from "@/assets/js/SweetAlert2Dialog";
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
      {
        title: "My Cart",
        routeName: "Carts",
        onlyInMobile:true
      },
      {
        title: "My Account",
        routeName: "Carts",
        onlyInMobile:true
      }
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

    this.$store.commit('removeAllFromCart');
    this.getUserCarts();
  },
  computed: {
    getCartCount() {
      return this.$store.getters.getCartsCount;
    }
  },
  methods: {
    isMobileDevice() {
      return isMobile;
    },
    getUserCarts() {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch("http://localhost/COS30043/index.php/carts/list?limit=10", requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.error) {
            console.log(result.error);
          }
          else {
            this.$store.commit('addAllToCart', result);
          }
        })
        .catch(error => {
          console.log('error', error);
          useToast(error);
        });
    }
  },
};
</script>
