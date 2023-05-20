<template>
    <v-card
        :elevation="4"
        variant="plain"
        class="mx-auto pa-2 text-dark w-100 order-card"
        :rounded="8"
        :color="white"
    >
        <template v-for="(product, idx) in products">
            <!-- Card Expansion -->
            <v-expand-transition
                v-if="
                    idx >= (isMobileDevice ? mobileMaxShowList : desktopMaxShowList) &&
                    !showAllProducts
                "
                :key="idx"
            >
            <v-row v-show="expand">
            <!-- Order Image -->
            <v-col cols="4" md="2" class="ps-3">
                <v-img contain aspect-ratio="1/1" :src="product.variantImageUrl">
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

            <!-- Order Detail -->
            <v-col cols="8" md="10" class="text-dark">
                <p class="fs-md-4 fs-6">
                <strong>{{ product.productName }}</strong>
                </p>
                <!-- MD View -->
                <div class="d-md-block d-none">
                <div class="d-flex flex-row pe-md-4 align-items-center">
                    <span
                    >{{ product.productVariantType }} :
                    {{ product.productVariantValue }}</span
                    >
                    <v-spacer></v-spacer>
                    <span class="float-right"
                    >RM: {{ getVariantPrice(product) }}</span
                    >
                </div>
                <p>x{{ product.orderVariantQty }}</p>
                </div>

                <!-- SM View -->
                <div class="d-md-none d-block">
                <div
                    class="d-flex flex-row pe-1 align-items-center justify-content-between"
                >
                    <span class="col-9"
                    >{{ product.productVariantType }} :
                    {{ product.productVariantValue }}</span
                    >
                    <span class="float-right col-3 text-end"
                    >x{{ product.orderVariantQty }}</span
                    >
                </div>
                <span class="float-right mt-4"
                    >RM {{ getVariantPrice(product) }}</span
                >
                </div>
            </v-col>
            </v-row>
        </v-expand-transition>

        <template v-else>
            <v-row :class="idx == 0 && showAllProducts ? 'mt-1' : null">
            <!-- Order Image -->
            <v-col cols="4" :md="isInDetail ? 1 : 2" class="ps-3">
                <v-img contain aspect-ratio="1/1" :src="product.variantImageUrl">
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

            <!-- Order Detail -->
            <v-col cols="8" :md="isInDetail ? 11 : 10" class="text-dark">
                <p class="fs-md-4 fs-6">
                <strong>{{ product.productName }}</strong>
                </p>
                <!-- MD View -->
                <div class="d-md-block d-none">
                <div class="d-flex flex-row pe-md-4 align-items-center">
                    <span
                    >{{ product.productVariantType }} :
                    {{ product.productVariantValue }}</span
                    >
                    <v-spacer></v-spacer>
                    <span 
                        class="float-right"
                    >RM: {{ getVariantPrice(product) }}</span
                    >
                </div>
                <p>x{{ product.orderVariantQty }}</p>
                </div>

                <!-- SM View -->
                <div class="d-md-none d-block">
                <div
                    class="d-flex flex-row pe-1 align-items-center justify-content-between"
                >
                    <span class="col-9">{{
                        product.productVariantValue
                    }}</span>
                    <span class="float-right col-3 text-end"
                    >x{{ product.orderVariantQty }}</span
                    >
                </div>
                <span class="float-right mt-4"
                    >RM {{ getVariantPrice(product) }}</span
                >
                </div>
            </v-col>
            </v-row>
        </template>
    </template>
    <!-- Show More -->
    <v-card-actions
        v-if="
            ((isMobile && products.length > mobileMaxShowList) ||
            (!isMobile && products.length > desktopMaxShowList)) &&
            !showAllProducts
        "
        class="d-flex flex-row justify-content-center"
        >
        <v-btn
            color="grey-darken-4"
            variant="text"
            :prepend-icon="expand ? 'mdi-arrow-up' : 'mdi-arrow-down'"
            @click.stop.prevent="expand = !expand"
        >
            {{ !expand ? "Show More" : "Show Less" }}
        </v-btn>
    </v-card-actions>

    <v-divider
        :thickness="2"
        class="border-opacity-25"
        color="grey-darken-2"
    ></v-divider>

        <div class="text-dark float-right pe-md-4">
            <div class="d-flex flex-row align-items-center gap-2 mb-2">
                <p class="fs-md-4 fs-7 mb-0 fw-bold">Total:</p>
                <p class="fs-md-3 fs-6 mb-0 fw-bold">
                RM {{ calculateTotalAmount }}
                </p>
            </div>
        </div>
    </v-card>
</template>
  
<style>
@media screen and (max-width: 767.99px) {
    .order-card {
        max-width:100%;
    }
}

@media screen and (min-width: 768px) {
    .order-card {
        max-width:90%;
    }
}
</style>

<script>
import { isMobile } from "mobile-device-detect";

export default {
    name: "OrderCheckoutProductCard",
    props: {
        products: {
            type: Array,
            default: [],
        }
    },
    data: function () {
        return {
            totalPrice: -1,
            expand: false,
            mobileMaxShowList: 1,
            desktopMaxShowList: 2,
        };
    },
    computed: {
        isMobileDevice() {
            return isMobile;
        },
        calculateTotalAmount() {
            let total = 0.00;

            this.products.forEach(p => {
                total += (this.getVariantPrice(p) * p.orderVariantQty);
            });

            return total.toFixed(2);
        }
    },
    methods: {
        getVariantPrice(product) {
            let price = parseFloat(product.orderVariantPrice);
            price -= (product.orderVariantDiscount) ? product.orderVariantDiscountAmt : 0;

            return price.toFixed(2);
        },
    },
};
</script>
  