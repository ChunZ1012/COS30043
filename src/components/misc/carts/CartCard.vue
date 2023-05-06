<template>
    <v-card
        role="button"
        :elevation="0"
        variant="plain"
        class="mx-auto pa-2 text-dark w-100"
        color="white"
        :key="cart.cartId"
    >
        <v-table>
            <thead>
                <v-checkbox
                    v-model="isCheckAll"
                    label="Select All"
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
                        >
                            <v-row
                                align="center"
                                class="gap-2"
                            >
                                <v-col
                                    cols="auto"
                                    class="p-0 ps-1 ps-md-0 p-md-3"
                                >
                                    <v-checkbox
                                        class="col-auto text-dark"
                                        v-model="isChecked[idx].checked"
                                        :model-value="isChecked[idx].checked"
                                        :disabled="isChecked[idx].disable"
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
                                    md="9"
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
                                            <div class="d-flex flex-row align-items-center text-dark" v-if="cartProduct.productVariantDiscount">
                                                <del>
                                                    <span class="fs-6">RM {{ cartProduct.productVariantPrice }}</span>
                                                </del>
                                                <span class="fs-5 ms-2" style="color: chocolate"
                                                    >RM {{ (cartProduct.productVariantPrice - cartProduct.productVariantDiscountAmt).toFixed(2) }}</span
                                                >
                                                </div>

                                                <div class="d-flex flex-row align-items-center text-dark" v-else>
                                                <span class="fs-5" color="white">RM {{ cartProduct.productVariantPrice.toFixed(2) }}</span>
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
            cartsQty:[],
            // ########
            // Rules
            // ########
            qtyRule(idx, max) {
                return v => {
                    let isValid = !isNaN(v) && parseInt(Number(v)) == v && !isNaN(parseInt(v, 10)) && v > 0;
                    
                    if(isValid) {
                        if(v > max) {
                            this.isChecked[idx].checked = false;
                            this.isChecked[idx].disable = true;
                            return 'Exceed allowed value!'
                        }
                        else this.isChecked[idx].disable = false;
                    }
                    else {
                        this.isChecked[idx].checked = false;
                        this.isChecked[idx].disable = true;
                        return 'Field is required!';
                    }
                }
            }
        }
    },
    created() {
        // this.isChecked = Array(this.cart.cartItems.length).fill(false);
        this.cart.cartItems.forEach(c => {
            c.checked = false;
            let cartQty = {
                cartId: c.cartId,
                productId: c.productId,
                productVariantId: c.productVariantId,
                productVariantQty: c.productVariantQty
            }
            this.cartsQty.push(cartQty);

            let cartCheckbox = {
                checked: false,
                disable: false
            };

            this.isChecked.push(cartCheckbox);
        });
    },
    computed: {
        isMobileDevice() {
            return isMobile;
        },
        isSelected() {
            return this.isChecked.map((c, idx) => {
                return { id:idx, value:c.checked };
            });
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
    },
    watch: {
        isMobile() {
            console.log("now: " + isMobile);
        },
        isCheckAll(newValue) {
            this.isChecked.forEach((a, i, t) => t[i].checked = t[i].disable ? false : newValue);
            this.$emit('clickAll', {
                cartId: this.cart.cartId,
                value: newValue
            });
        },
        isSelected(newVal, oldVal) {
            let totalPrice = 0;

            if(newVal != undefined && newVal.length > 0) {
                newVal.forEach((i, idx) => {
                    let item = this.cart.cartItems[i.id];

                    let qty = item.productVariantQty;
                    let hasDiscount = item.productVariantDiscount;

                    if(i.value && oldVal != undefined && oldVal.length > 0 && !oldVal[idx].value) {
                        totalPrice += (item.productVariantPrice * qty);
                        if(hasDiscount) {
                            totalPrice -= (item.productVariantDiscountAmt * qty);
                        }
                    }
                    else if(!i.value) {
                        totalPrice -= (item.productVariantPrice * qty);
                        if(hasDiscount) {
                            totalPrice += (item.productVariantDiscountAmt * qty);
                        }
                    }
                });

                this.$emit('clickItem', {
                    cartId: this.cart.cartId,
                    value: totalPrice
                });
            }
        },
        isChecked: {
            handler(val, oldVal) {
                let totalPrice = 0;
                this.cart.cartItems.forEach((item, idx) => {
                    let isChecked = this.isChecked[idx].disable ? false : this.isChecked[idx].checked;

                    if(isChecked) {
                        totalPrice += 0;
                    }
                });

                // this.$emit('clickItem', {
                //     cartId: this.cart.cartId,
                //     value: val
                // });
            },
            deep:true
        }
    }
}
</script>