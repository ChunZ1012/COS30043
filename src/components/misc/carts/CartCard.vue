<template>
    <v-card
        role="button"
        :elevation="0"
        :hover="true"
        :loading="true"
        variant="outlined"
        class="mx-auto pa-2 text-dark w-100"
        color="white"
        :key="cart.cartId"
        v-if="cart.cartItems.length > 0"
    >
        <v-table>
            <thead>
                <v-checkbox
                    v-model="isCheckAll"
                    label="Select All"
                    @click="toggleCheckbox"
                ></v-checkbox>
            </thead>
            <tr>
                <v-table>
                    <tr
                        v-for="(cartProduct, idx) in cart.cartItems"
                        :key="idx"
                    >
                        <v-card
                            role="button"
                            :elevation="0"
                            variant="plain"
                            class="mx-auto pa-2 text-dark w-100"
                            color="white"
                            :to="{
                                name:'ProductDetail',
                                params: {
                                    id: cartProduct.productId
                                }
                            }"
                        >
                            <v-row
                                align="center"
                                class="gap-2"
                            >
                                <v-col
                                    cols="auto"
                                    md="auto"
                                    class="p-0 ps- p-md-3"
                                >
                                    <v-checkbox
                                        class="col-auto text-dark"
                                        v-model="cartProduct.isChecked"
                                        :model-value="cartProduct.isChecked"
                                        :disabled="cartProduct.isDisabled"
                                        @click.stop.prevent="toggleCheckbox"
                                    ></v-checkbox>
                                </v-col>
                                <v-col
                                    cols="3"
                                    md="2"
                                    class="p-1 p-md-2"
                                >
                                    <v-img
                                        contain
                                        aspect-ratio="1/1"
                                        :src="cartProduct.productImageUrl"
                                    >
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
                                
                                <v-col
                                    cols="7"
                                    md="8"
                                    lg="9"
                                    align-self="start"
                                >
                                    <v-row>
                                        <v-col
                                            cols="12"
                                            class="text-dark"
                                        >
                                            <h4 class="fw-bolder">{{ cartProduct.productName }}</h4>

                                            <p 
                                                class="fs-6"
                                            >Variant: {{ cartProduct.productVariantText }}</p>

                                            <v-text-field
                                                type="number"
                                                variant="outlined"
                                                label="Qty"
                                                density="compact"
                                                class="cart-product-qty-input"
                                                required
                                                :rules="[qtyRule(idx, cartProduct.productVariantAvailQty)]"
                                                v-model="cartProduct.productVariantQty"
                                                min="1"
                                                :max="cartProduct.productVariantAvailQty"
                                                prepend-inner-icon="mdi-minus"
                                                @click:prepend-inner="onQtyChanged(idx, false)"
                                                append-inner-icon="mdi-plus"
                                                @click:append-inner="onQtyChanged(idx, true)"
                                            ></v-text-field>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col
                                            cols="12"
                                            align-self="end"
                                        >
                                            <div class="d-flex flex-row col-12 align-items-center text-dark" v-if="cartProduct.productVariantDiscount">
                                                <del>
                                                    <span class="fs-6">RM {{ cartProduct.productVariantPrice }}</span>
                                                </del>
                                                <span class="fs-5 ms-2" style="color: chocolate"
                                                    >RM {{ (cartProduct.productVariantPrice - cartProduct.productVariantDiscountAmt).toFixed(2) }}
                                                </span>
                                                <v-spacer></v-spacer>
                                                <v-icon
                                                    icon="mdi-delete-forever"
                                                    size="large"
                                                    class="col-1 text-dark"
                                                    @click.stop.prevent="removeCartItem(idx)"
                                                ></v-icon>
                                            </div>

                                            <div class="d-flex flex-row col-12 align-items-center text-dark" v-else>
                                                <span class="fs-5" color="white">RM {{ cartProduct.productVariantPrice.toFixed(2) }}</span>
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
                    </tr>
                </v-table>
            </tr>
        </v-table>
    </v-card>
</template>

<style>
.cart-product-qty-input {
    width:128px!important;
}
</style>

<script>
import { isMobile } from "mobile-device-detect";

export default {
    name:"OrderCard",
    props: {
        cart: {
            type:Object,
            default:undefined
        }
    },
    data:function() {
        return {
            isCheckAll:false,
            isChecked:[],
            selectedCartId: -1,
            // ########
            // Rules
            // ########
            qtyRule(idx, max) {
                return v => {
                    let isValid = !isNaN(v) && parseInt(Number(v)) == v && !isNaN(parseInt(v, 10)) && v > 0;
                    let item = this.cart.cartItems[idx];
                    let errMsg = "";

                    if(isValid) {
                        if(v > max) {
                            item.isChecked = false;
                            item.isDisabled = true;
                            errMsg = 'Exceed allowed value!'
                        }
                        else item.isDisabled = false;
                    }
                    else {
                        item.isChecked = false;
                        item.isDisabled = true;
                        errMsg = 'Field is required!';
                    }

                    return isValid ? (v <= max ? true : errMsg) : errMsg;
                }
            }
        }
    },
    created() {
        this.cart.cartItems.forEach(c => {
            c.isChecked = false;
            c.isDisabled = false;

            this.isChecked.push({
                checked: false,
                disable:false
            });
        });
    },
    mounted() {
        
    },
    computed: {
        isMobileDevice() {
            return isMobile;
        },
        isSelected() {
            return this.isChecked.map((c, idx) => {
                return { id:idx, value:c.checked };
            });
        },
        toggleCheckbox() {
            this.$emit('clickItem');
        }
    },
    methods: {
        onCheckAllClicked() {
            this.$emit('clickAll', true);
        },
        onQtyChanged(idx, isIncrement) {
            let v = this.cart.cartItems[idx];

            let qty = (v.productVariantQty == 1 ? 0 : 1) * -1;
            if(isIncrement) qty = v.productVariantQty == v.productVariantAvailQty ? 0 : 1;

            this.cart.cartItems[idx].productVariantQty += qty;
        },
        removeCartItem(idx) {
            if(confirm("Are you sure to remove the item?")) {
                this.$store.commit('removeFromCart', {
                    productId: this.cart.cartItems[idx].productId,
                    productVariantId: this.cart.cartItems[idx].productVariantId,
                });
            }
        }
    },
    watch: {
        isMobile() {
            console.log("now: " + isMobile);
        },
        isCheckAll(newValue) {
            this.cart.cartItems.forEach((a, i, t) => t[i].isChecked = t[i].isDisabled ? false : newValue);
            this.$emit('clickAll', {
                cartId: this.cart.cartId,
                value: newValue
            });
        },
    }
}
</script>