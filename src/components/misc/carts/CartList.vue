<template>
  <div class="cart-container">
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    <v-spacer></v-spacer>
    <v-col cols="12" class="p-1 p-md-3">
      <h2>{{ breadcrumbTitle }}</h2>

      <v-overlay
        v-model="isLoading"
        v-if="isLoading"
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

      <v-table v-else>
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

    <div class="fixed-bottom">
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
import { usePOST } from "@/assets/js/HttpManager";
import { useDialog } from "@/assets/js/SweetAlert2Dialog";

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
  methods: {
    getCarts() {
      this.$store.commit("fetchCartData");
      this.$store.watch(
        (state, getters) => {
          return state.carts;
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
          this.isLoading = false;
        }
      );

      // FIXME: Modify the below line to match with th api in future
      // let url = "http://localhost/COS30043/index.php/carts/list";
      // const { result, error } = useGET(url);
      // watchEffect(() => {
      //     if(result.value && Object.keys(result.value).length) {
      //         this.carts = result.value;
      //     }
      //     if(error.value) {
      //         useDialog("Oops", "Error when fetching your cart data! Please try again later.",
      //             false,
      //             true,
      //             () => {
      //                 this.$router.replace({
      //                     name:"Home"
      //                 });
      //             }
      //         )
      //     }
      // });

      // let carts = this.$store.getters.getCarts.map(c => {
      //     return {
      //         productId: c.productId,
      //         productVariantId: c.productVariantId,
      //         productVariantQty: c.productVariantQty
      //     }
      // });
    },
    proceedToPayment() {
      let url = "http://localhost/COS30043/index.php/orders/add";
      let data = this.carts
        .filter(c => (!c.isDisabled && c.isChecked))
        .map(c => {
          return {
            cartId:c.cartId,
            variantId:c.variantId,
            variantOrderedQty:c.variantOrderedQty
          }
        });

      const { error, stop } = usePOST(url, {
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
          stop();
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
  },
};
</script>
