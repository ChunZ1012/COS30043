<template>
  <v-card
    role="button"
    :elevation="0"
    :hover="true"
    :ripple="true"
    :loading="isLoading"
    :disabled="isLoading"
    class="mx-auto pa-2 text-dark w-100"
    color="white"
    :key="cart.cartId"
    v-if="cart != {}"
    :to="{
      name: 'ProductDetail',
      params: {
        id: cart.productId,
      },
    }"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="6"
        indeterminate
      ></v-progress-linear>
    </template>
    <v-row align="center" class="gap-2">
      <v-col cols="auto" md="auto" class="p-0 ps- p-md-3">
        <v-checkbox
          class="col-auto text-dark"
          v-model="cart.isChecked"
          :disabled="cart.isDisabled"
          @click.stop.prevent="toggleCheckbox"
        ></v-checkbox>
      </v-col>
      <v-col cols="3" md="2" class="p-1 p-md-2">
        <v-img contain aspect-ratio="1/1" :src="cart.variantImageUrl">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="primary"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
      </v-col>

      <v-col cols="7" md="8" lg="9" align-self="start">
        <v-row>
          <v-col cols="12" class="text-dark">
            <h4 class="fw-bolder">{{ cart.productName }}</h4>

            <p class="fs-6">
              {{ cart.variantTypeText }}: {{ cart.variantTypeValue }}
            </p>

            <v-text-field
              @click.prevent
              align="center"
              type="number"
              variant="outlined"
              label="Qty"
              density="compact"
              class="cart-product-qty-input"
              required
              validate-on="input"
              :rules="[qtyRule(cart.variantAvailQty)]"
              v-model="cart.variantOrderedQty"
              min="1"
              :max="cart.variantAvailQty"
              prepend-inner-icon="mdi-minus"
              @click:prepend-inner.stop.prevent="onQtyChanged(false)"
              append-inner-icon="mdi-plus"
              @click:append-inner.stop.prevent="onQtyChanged(true)"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" align-self="end">
            <div
              class="d-flex flex-row col-12 align-items-center text-dark"
              v-if="cart.variantDist"
            >
              <del>
                <span class="fs-6">RM {{ getProductPrice(false) }}</span>
              </del>
              <span class="fs-5 ms-2" style="color: chocolate"
                >RM {{ getProductPrice(true) }}
              </span>
              <v-spacer></v-spacer>
              <v-icon
                icon="mdi-delete-forever"
                size="large"
                class="col-1 text-dark"
                @click.stop.prevent="removeCartItem(idx)"
              ></v-icon>
            </div>

            <div
              class="d-flex flex-row col-12 align-items-center text-dark"
              v-else
            >
              <span class="fs-5" color="white"
                >RM {{ getProductPrice(false) }}</span
              >
              <v-spacer></v-spacer>
              <v-icon
                icon="mdi-delete-forever"
                size="large"
                class="col-1 text-dark"
                @click.stop.prevent="removeCartItem(idx)"
              ></v-icon>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<style>
.cart-product-qty-input {
  width: 128px !important;
}
</style>

<script>
export default {
  name: "OrderCard",
  props: {
    cart: {
      type: Object,
      default: {},
    },
  },
  data: function () {
    return {
      selectedCartId: -1,
      isLoading:false,
      cartQtyChangeTimeout: null,
      // ########
      // Rules
      // ########
      qtyRule(max) {
        return (v) => {
          let isValid =
            !isNaN(v) &&
            parseInt(Number(v)) == v &&
            !isNaN(parseInt(v, 10)) &&
            v > 0;
          let errMsg = "";

          if (isValid) {
            if (v > max) {
              this.cart.isChecked = false;
              this.cart.isDisabled = true;
              errMsg = "Exceed allowed value!";
            } else {
              this.cart.isDisabled = false;

              if(this.cartQtyChangeTimeout != null) clearTimeout(this.cartQtyChangeTimeout);
              this.isLoading = true;
              this.cartQtyChangeTimeout = setTimeout(() => {
                this.$store.commit("cart/editCart", {
                  cartId: this.cart.cartId,
                  variantId: this.cart.variantId,
                  variantOrderedQty: this.cart.variantOrderedQty,
                });
                this.isLoading = false;
              }, 1000);
            }
          } else {
            this.cart.isChecked = false;
            this.cart.isDisabled = true;
            errMsg = "Field is required!";
          }

          return isValid
            ? v <= this.cart.variantAvailQty
              ? true
              : errMsg
            : errMsg;
        };
      },
    };
  },
  created() {
    this.cart.isChecked = false;
    this.cart.isDisabled = false;
  },
  computed: {
    isSelected() {
      return this.isChecked.map((c, idx) => {
        return { id: idx, value: c.checked };
      });
    },
    orderedQty() {
      return this.cart.variantOrderedQty;
    },
  },
  methods: {
    toggleCheckbox() {
      this.$emit('onToggleItem', this.cart);
    },
    onQtyChanged(isIncrement) {
      let v = this.cart;
      let vQty = parseInt(v.variantOrderedQty);
      let aQty = parseInt(v.variantAvailQty);

      let qty = 0;
      if(isIncrement) qty = (vQty == aQty) ? 0 : 1;
      else qty = (vQty == 1) ? 0 : -1;
      this.cart.variantOrderedQty = parseInt(this.cart.variantOrderedQty) + qty;

      this.$emit("onQtyChanged");
    },
    removeCartItem() {
      if (confirm("Are you sure to remove the item?")) {
        this.$store.dispatch("cart/removeFromCart", {
          cartId: this.cart.cartId,
        });
      }
    },
    getProductPrice(withDiscount = false) {
      let price = this.cart.variantPrice;
      if (withDiscount) price -= this.cart.variantDistAmt;
      return parseFloat(price).toFixed(2);
    },
  }
};
</script>
