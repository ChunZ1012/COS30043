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
                <v-card-text
                    class="float-right"
                >
                    <span
                        class="fs-4 fw-bold"
                    >Total Price: RM{{ totalPrice.toFixed(2) }}</span>
                </v-card-text>
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
            isFullyLoaded: false
        }
    },
    created() {
        this.carts = CartData;
    },
    mounted() {
        window.addEventListener('load', () => {
            this.isFullyLoaded = true;
        })
    },
    methods: {
        onAllClick(data) {
            //console.log('onClickAll ' + data.cartId + ", " + data.value);
        },
        onItemClick(data) {
            if(this.isFullyLoaded) {
                this.totalPrice += data.value;
                console.log(this.carts[0].cartItems[0].productVariantQty);
            }
        }
    },
    components: {
        CartCard
    }
}
</script>