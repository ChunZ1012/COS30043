<template>
  <div class="cart-container">
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    <v-spacer></v-spacer>
    <v-col 
      cols="12" 
      class="p-1 p-md-3" 
    >
      <h2>{{ breadcrumbTitle }}</h2>
      <v-table
        class="w-100 w-md-95 mx-auto"
      >
        <thead>
          <v-checkbox
            label="Select All"
            v-model="isAllCheck"
            @change="onCheckAllItem"
          ></v-checkbox>
        </thead>
        <tr v-for="cart in carts">
          <CartCard
            :cart="cart"
            @onToggleItem="onSingleItemToggleCheck"
            @onQtyChanged="onItemToggleCheck"
          ></CartCard>
        </tr>
      </v-table>
    </v-col>

    <div class="fixed-bottom mt-1">
      <v-card :elevation="8">
        <div
          class="d-flex flex-row float-right align-items-center m-2 p-2 gap-3"
        >
          <v-slide-x-reverse-transition group="true" hide-on-leave="true">
            <span class="fs-4 fw-bold"
              >Total Price: RM{{ totalPrice.toFixed(2) }}</span
            >

            <v-btn 
              v-if="showCheckoutButton" 
              variant="outlined" 
              color="orange"
              @click="proceedToPayment"
            >Checkout</v-btn
            >
          </v-slide-x-reverse-transition>
        </div>
      </v-card>
    </div>
  </div>
</template>

<style>
.cart-container {
  margin-bottom: 64px;
}
</style>

<script>
import CartCard from "@/views/misc/carts/CartCardView.vue";
import LoadingView from "@/views/misc/helpers/LoadingView.vue";
import { usePOST } from "@/assets/js/HttpManager";
import { useDialog } from "@/assets/js/SweetAlert2Dialog";
import { mapState, mapGetters } from "vuex";
import { BASEURL } from "@/inc/const";

export default {
  name: "OrderList",
  props: {
    breadcrumbTitle: {
      type: String,
      default: "",
    },
  },
  data: function () {
    return {
      // #############
      // Real
      // #############
      breadcrumbs: ["Home", "Cart"],
      carts: [],
      totalPrice: 0,
      isAllCheck: false,
      // Checkout
      showCheckoutButton: false,
      // Loading
      isLoading: true,
    };
  },
  created() {
    this.getCarts();
  },
  computed: {
    ...mapState(['auth', 'cart', 'loading']),
    ...mapGetters(['auth', 'cart', 'loading']),
  },
  methods: {
    getCarts() {
      this.$store.commit("cart/fetchCartData");
      this.$store.watch(
        (state, getters) => {
          return getters['cart/carts'];
        },
        (v) => {
          let checkedStatus = this.carts.map((v) => {
            return {
              cartId: v.cartId,
              variantId: v.variantId,
              isChecked: v.isChecked,
              isDisabled: v.isDisabled,
            };
          });
          checkedStatus.forEach((c) => {
            let o = v.find(
              (w) => w.cartId == c.cartId && w.variantId == c.variantId
            );
            if (o !== undefined) {
              o.isChecked = c.isChecked;
              o.isDisabled = c.isDisabled;
            }
          });

          this.carts = v;
          this.onItemToggleCheck();
        }
      );
    },
    proceedToPayment() {
      let url = `${BASEURL}/orders/add`;
      let data = this.carts
        .filter(c => (!c.isDisabled && c.isChecked))
        .map(c => {
          return {
            cartId:c.cartId,
            variantId:c.variantId,
            variantOrderedQty:c.variantOrderedQty
          }
        });

      usePOST(url, {
        data: {
          fromCart: true,
          data: data
        },
        callback: (r, e) => {
          if(r.error === true) {
            useDialog('Oops', 'Error when proceeding with your order. Please try again later', false);
            console.log(e);
          }
          else {
            console.log(r);
            this.$router.push({
              name:'OrderCheckout',
              params: {
                orderGuid: r.orderGuid
              }
            });
          }
        }
      })
    },
    onCheckAllItem() {
      this.carts.forEach((i) => {
        if (!i.isDisabled) i.isChecked = this.isAllCheck;
      });

      this.onItemToggleCheck();
    },
    onSingleItemToggleCheck(cart) {
      let c = this.carts.find(c => c.cartId == cart.cartId);
      if(c != undefined || c != null) {
        if(!c.isDisabled) {
          c.isChecked = !c.isChecked;
          this.onItemToggleCheck();
        }
      }
    },
    onItemToggleCheck() {
      let totalPrice = 0;
      let checkedCount = 0;

      this.carts.forEach((i) => {
        if (i.isChecked) {
          checkedCount += 1;
          let qty = i.variantOrderedQty;
          totalPrice += i.variantPrice * qty;

          if (i.variantDist) {
            totalPrice -= i.variantDistAmt * qty;
          } else {
            totalPrice += i.variantDistAmt * qty;
          }
        }
      });
      this.totalPrice = totalPrice;
      this.showCheckoutButton = checkedCount > 0;
    },
  },
  components: {
    CartCard,
    LoadingView
  },
};
</script>
