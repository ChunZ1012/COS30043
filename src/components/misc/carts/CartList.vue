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
                v-for="cart in carts"
            >
                <tr>
                    <CartCard
                        :cart="cart"
                        @clickAll="onAllClick"
                        @clickItem="onItemClick"
                    ></CartCard>
                </tr>
            </v-table>
        </v-col>

        <div
            class="fixed-bottom"
        >
            <v-card
                :elevation="8"
            >
                <div
                    class="d-flex flex-row float-right align-items-center m-2 p-2 gap-3"
                >                   
                    <v-slide-x-reverse-transition
                        group="true"
                        hide-on-leave="true"
                    >
                    <span
                        class="fs-4 fw-bold"
                    >Total Price: RM{{ totalPrice.toFixed(2) }}</span>
 
                        <v-btn
                            v-if="showCheckoutButton"
                            variant="outlined"
                            color="orange"
                        >Checkout</v-btn>
                    </v-slide-x-reverse-transition>
                </div>
            </v-card>
        </div>
    </div>
</template>

<style>
.cart-container {
    margin-bottom:64px;
}
</style>

<script>
import CartCard from "@/views/misc/carts/CartCardView.vue";
import CartData from '@/assets/data/Carts.json';
import ProductData from '@/assets/data/Products.json';

export default {
    name:"OrderList",
    props: {
        breadcrumbTitle: {
            type:String,
            default:""
        },
    },
    data: function() {
        return {
            // #############
            // Real
            // #############
            breadcrumbs: ["Home", "Cart"],
            carts:[],
            totalPrice:0,
            isFullyLoaded: false,
            // Checkout
            showCheckoutButton:false
        }
    },
    created() {},
    mounted() {
        window.addEventListener('load', () => {
            this.isFullyLoaded = true;
        });
        this.getCarts;
    },
    computed: {
        getCarts() {
            // FIXME: Modify the below line to match with th api in future
            let carts = this.$store.getters.getCarts.map(c => {
                return { 
                    productId: c.productId,
                    productVariantId: c.productVariantId,
                    productVariantQty: c.productVariantQty
                }
            });
            ProductData.forEach((p, idx) => {
                if(carts.map(c => c.productId).includes(p.id)) {
                    p.info.variant.values.forEach(v => {
                        if(carts.map(c => c.productVariantId).includes(v.variantId)) {
                            this.carts.push({
                                cartId: idx,
                                cartItems:[
                                    {
                                        productId: p.id,
                                        productName: p.title,
                                        productImageUrl: p.url,
                                        productVariantId: v.variantId,
                                        productVariantText: v.variantValue,
                                        productVariantQty: 6,
                                        productVariantPrice: p.price,
                                        productVariantDiscount: p.discount,
                                        productVariantDiscountAmt: p.distAmt
                                    }
                                ]
                            });
                        }
                    });
                }
            });
            // CartData.forEach(cd => {
            //     cd.cartItems.forEach(ci => {
            //         console.log(ci.productId + ":" + ci.productVariantId);
            //         if(carts.map(c => c.productId).includes(ci.productId) && carts.map(c => c.productVariantId).includes(ci.productVariantId)) {
            //             this.carts.push(cd);
            //             console.log(cd);
            //         }
            //     })
            // })
            // return this.carts;
        }
    },
    methods: {
        onItemClick() {
            let totalPrice = 0;
            let checkedCount = 0;

            this.carts.forEach(c => {
                c.cartItems.forEach(i => {
                    if(i.isChecked) {
                        checkedCount += 1;
                        let qty = i.productVariantQty;
                        totalPrice += i.productVariantPrice * qty;

                        if(i.productVariantDiscount) {
                            totalPrice -= i.productVariantDiscountAmt * qty;
                        }
                        else {
                            totalPrice += i.productVariantDiscountAmt * qty;
                        }
                    }
                });
            });
            this.totalPrice = totalPrice;
            this.showCheckoutButton = checkedCount > 0;
        }
    },
    components: {
        CartCard
    }
}
</script>