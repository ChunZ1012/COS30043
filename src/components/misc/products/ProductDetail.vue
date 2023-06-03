<template v-if="product !== undefined">
  <v-row>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    <v-spacer></v-spacer>
  </v-row>

  <v-overlay
    v-if="loading"
    v-model="loading"
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

  <!-- Prodct Detail Header -->
  <v-row v-else>
    <!-- Product Image Carousel -->
    <v-col cols="12" md="6">
      <v-card elevation="4" variant="plain" class="mx-auto fill-height">
        <v-carousel
          hide-delimiter-background
          show-arrows="hover"
          cycle
          :height="isMobileDevice ? -1 : 400"
        >
          <v-carousel-item
            v-for="(imageUrl, i) in getCurrentProductVariant.productImageUrl.split(',')"
            :class="imageUrl"
            aspect-ratio="1/1"
            :key="i"
            :src="imageUrl"
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
    </v-col>
    <!-- Product Info (Except description)-->
    <v-col cols="12" md="6">
      <v-form v-model="valid">
        <h1 class="fw-bold">{{ product.productTitle }}</h1>
        <div
          class="d-flex flex-row align-items-center"
          v-if="isProductInDiscount"
        >
          <del>
            <span class="fs-6">RM {{ getProductPrice(true) }}</span>
          </del>
          <span class="fs-5 ms-2" style="color: chocolate"
            >RM {{ getProductPrice(false) }}</span
          >
        </div>

        <div class="d-flex flex-row align-items-center" v-else>
          <span class="fs-5" color="white">RM {{ getProductPrice(true) }}</span>
        </div>

        <template v-for="variant in product.productVariants">
          <v-select
            :label="variant.variantTypeText"
            :items="getProductVariantInfo(variant.variantType)"
            item-value="variantId"
            item-title="variantValue"
            return-object
            hide-details
            single-line
            :rules="variantRule"
            v-model="selectedVariant"
            required
            variant="outlined"
            class="mt-3"
          ></v-select>

          <v-col cols="12" md="4">
            <v-text-field
              label="Qty"
              type="number"
              v-model="orderQty"
              variant="outlined"
              min="0"
              :max="getVariantAvailQty"
              prepend-icon="mdi-minus"
              @click:prepend="
                () => {
                  orderQty -= orderQty == 1 ? 0 : 1;
                }
              "
              append-icon="mdi-plus"
              @click:append="
                () => {
                  orderQty += orderQty == getVariantAvailQty ? 0 : 1;
                }
              "
              :rules="qtyRule"
            >
            </v-text-field>
          </v-col>
        </template>
        <v-spacer></v-spacer>
        <v-row class="mt-md-4 ma-md-4">
          <!-- Add to Cart -->
          <v-col cols="12" md="auto">
            <v-btn
              variant="outlined"
              type="submit"
              block
              @click.stop.prevent="addToCart"
              :disabled="!buttonEnabled"
              >Add to Cart</v-btn
            >
          </v-col>
          <!-- Buy Now -->
          <v-col cols="12" md="auto">
            <v-btn
              variant="outlined"
              type="submit"
              block
              @click.stop.prevent="onBuyNowClick"
              :disabled="!buttonEnabled"
              >Buy Now</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>

  <!-- Product Detail Content -->
  <v-spacer></v-spacer>
  <v-row class="mt-4">
    <v-card flat="true" class="w-100">
      <v-tabs bg-color="transparent" v-model="currentTab" align-tabs="start">
        <v-tab value="description">Description</v-tab>
        <v-tab value="rating">Rating</v-tab>
      </v-tabs>

      <v-card-text class="w-100 pa-4">
        <v-window v-model="currentTab">
          <v-window-item value="description">
            <p v-html="product?.productDesc"></p>
          </v-window-item>
          <!-- Rating -->
          <v-window-item value="rating">
            <v-card class="d-flex flex-column mx-auto p-4" elevation="2">
              <p class="fs-3 fw-bold">Rating Overview</p>
              <div class="d-flex align-center flex-column my-auto">
                <div class="fs-1 mt-md-4 mt-2 fw-bold">
                  {{ getOverallRating }}
                  <span class="fs-5 ml-md-n3 ml-n2 fw-normal">/5</span>
                </div>

                <v-rating
                  :model-value="getOverallRating"
                  color="yellow-darken-2"
                  half-increments
                ></v-rating>
                <div class="px-3">{{ getTotalReviewsCount }} ratings</div>
              </div>

              <v-list
                bg-color="transparent"
                class="d-flex flex-column-reverse"
                density="comfortable"
              >
                <v-list-item v-for="(rating, idx) in 5" :key="i">
                  <v-progress-linear
                    :model-value="
                      calculateRatingBarValueBasedOnRating(rating) * 100
                    "
                    class="mx-n5"
                    color="yellow-darken-2"
                    height="21"
                    rounded
                  ></v-progress-linear>

                  <template v-slot:prepend>
                    <span>{{ rating }}</span>
                    <v-icon icon="mdi-star" class="mx-4"></v-icon>
                  </template>
                  <template v-slot:append>
                    <div class="rating-values">
                      <span class="d-flex justify-end">
                        {{ getTotalReviewsCountBasedOnRating(rating) }}
                      </span>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>

            <div class="mt-4 pt-3">
              <p class="fs-2 fw-bold">Review(s)</p>
              <ProductReviewView
                v-if="getCurrentReviews.length > 0"
                v-for="review in getCurrentReviews"
                :userAvatarUrl="review.userAvatarUrl"
                :userDisplayName="review.userDisplayName"
                :userRating="review.userRating"
                :userComment="review.userComment"
                :userCommentTime="review.userCommentTime"
                width="90%"
                class="my-4"
              ></ProductReviewView>
              <p class="fs-5" v-else>No review yet to be made by the user</p>
              <!-- Review Paginator -->
              <v-pagination
                v-if="getCurrentReviews.length > 0"
                v-model="currentPage"
                :length="
                  Math.ceil(product.productReviews.length / itemsPerPage)
                "
                :total-visible="isMobileDevice ? 2 : 6"
                rounded="circle"
                ellipsis="."
                variant="text"
                :size="isMobileDevice ? 'small' : 'default'"
              ></v-pagination>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<style>
.rating-container {
  width: 90%;
  height: fit-content;
}
</style>

<script>
import { isMobile } from "mobile-device-detect";
import { useLoading, useDialog } from "@/assets/js/SweetAlert2Dialog";
import { useGET, usePOST } from "@/assets/js/HttpManager";
import ProductReviewView from "@/views/misc/products/ProductReviewView.vue";
import { BASEURL, resetLoginAndRedirect } from "@/inc/const";

export default {
  name: "ProductDetail",
  props: {
    id: {
      type: String || Number,
      default: -1,
    },
  },
  data: function () {
    return {
      // Rules
      variantRule: [
        (v) => {
          this.buttonEnabled = !!v;
          return !!v || "Please select at least one variant!";
        },
      ],
      qtyRule: [
        (v) => {
          this.buttonEnabled = !!v;
          return !!v || "Please enter a number larger than 0!";
        },
        (v) => {
          let isValid = !!v && v > 0;
          this.buttonEnabled = isValid;
          return isValid || "Please enter a number larger than 0!";
        },
        (v) => {
          let isValid = !!v && v <= this.getVariantAvailQty;
          this.buttonEnabled = isValid;
          return isValid || "Invalid!";
        },
      ],
      // #############
      // Real
      // #############
      loading: true,
      breadcrumbs: ["Home", "Product"],
      product: {},
      selectedVariant: {},
      buttonEnabled: true,
      orderQty: 1,
      valid: true,
      currentTab: "",
      // Pagination
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  beforeRouteUpdate() {
    localStorage.setItem("beforeRouteUpdate", "im here");
  },
  created() {
    this.loading = true;
    this.fetchData();
  },
  computed: {
    isMobileDevice() {
      return isMobile;
    },
    getCurrentReviews() {
      let start = this.currentPage - 1;
      return this.product.productReviews.slice(
        start,
        start + this.itemsPerPage
      );
    },
    getProductImageUrls() {
      // let imageUrls = [];

      // urls = this.;
      // urls.split(",").forEach((url) => {
      //   imageUrls.push(url);
      // });

      // return imageUrls;
    },
    isProductInDiscount() {
      return this.getCurrentProductVariant.productVariantDist;
    },
    getProductVariant() {
      let v = new Set(
        this.product.productVariants.map((v) => v.productVariantType)
      );
      return v;
    },
    getVariantAvailQty() {
      return this.getCurrentProductVariant.productVariantAvailQty;
    },
    getCurrentProductVariant() {
      return this.product.productVariantsInfo.find(
        (v) => v.productVariantId == this.selectedVariant.variantId
      );
    },
    getOverallRating() {
      return parseFloat(this.product.productOverallRating).toFixed(2);
    },
    getTotalReviewsCount() {
      return parseInt(this.product.productReviews.length);
    },
  },
  methods: {
    fetchData() {
      let url = `${BASEURL}/products/get?id=${this.id}`;
      useGET(url, {
        callback: (r, e) => {
          if (e) {
            useDialog("Oops", {
              description: "The product you are looking at is no longer exist!",
              showCancelButton: false,
              sticky: true,
              confirmButtonAction:() => {
                this.$router.replace({
                  name: "Products",
                });
              }
            });
          } else {
            this.product = r;
            this.selectedVariant = this.product.productVariantsInfo.map((v) => {
              return {
                variantId: v.productVariantId,
                variantValue: v.productVariantValue,
              };
            })[0];
          }
          this.loading = false;
        },
      });
    },
    getProductPrice(isOriginalPrice = false) {
      let vi = this.getCurrentProductVariant;
      let price = vi.productVariantPrice;
      if (!isOriginalPrice && vi.productVariantDist)
        price = vi.productVariantPrice - vi.productVariantDistAmt;

      return parseFloat(price).toFixed(2);
    },
    getProductVariantInfo(type) {
      let variants = this.product.productVariantsInfo
        .filter((v) => v.productVariantType == type)
        .map((v) => {
          return {
            variantId: v.productVariantId,
            variantValue: v.productVariantValue,
          };
        });
      return variants;
    },
    getTotalReviewsCountBasedOnRating(rating) {
      return this.product.productReviews.filter(
        (r) => r.userRating >= rating && r.userRating < rating + 1
      ).length;
    },
    calculateRatingBarValueBasedOnRating(rating) {
      let totalRating = this.getTotalReviewsCountBasedOnRating(rating);
      return (totalRating / this.getTotalReviewsCount).toFixed(2);
    },
    addToCart() {
      useLoading("Loading...");
      this.$store.dispatch("cart/addToCart", {
        variantId: this.selectedVariant.variantId,
        variantOrderedQty: this.orderQty,
      });
    },
    onBuyNowClick() {
      let isLoggedIn = this.$store.getters['auth/isLoggedIn'];
      let token = this.$store.getters['auth/getToken'];

      if(token == '' || !isLoggedIn) {
        resetLoginAndRedirect();
      }
      else {
        let url = `${BASEURL}/orders/add`;
        let data = {
          variantId: this.selectedVariant.variantId,
          variantOrderedQty: this.orderQty
        };

        usePOST(url, {
          data: {
            fromCart: false,
            data: data
          },
          callback: (r, e) => {
            if(r.error == true) {
              useDialog('Oops', 'Error when proceeding with your order. Please try again later', false);
              console.log(e);
            }
            else {
              this.$router.push({
                name:'OrderCheckout',
                params: {
                  orderGuid: r.orderGuid
                }
              });
            }
          }
        })
      }
    }
  },
  watch: {
    selectedVariant() {
      this.orderQty = 1;
    },
  },
  components: {
    ProductReviewView,
  },
};
</script>