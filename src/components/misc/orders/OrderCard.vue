<template>
    <v-card
        role="button"
        :elevation="4"
        variant="plain"
        class="mx-auto pa-2 text-dark w-100"
        :ripple="true"
        :rounded="8"
        :color="white"
        :to="{
            name:'OrderDetail',
            params: {
                orderId:orderId
            }
        }"
    >
        <p 
            v-show="showOrderId"
            class="text-dark"
        ><i>Order ID: {{ orderId }}</i></p>
        
        <template
            v-for="(product, idx) in order.orderProducts"
        >
            <!-- Card Expansion -->
            <v-expand-transition
                v-if="idx >= (isMobileDevice ? mobileMaxShowList : desktopMaxShowList) && !showAllProducts"
                :key="idx"
            >
                <v-row
                    v-show="expand"
                >
                    <!-- Order Image -->
                    <v-col
                        cols="4"
                        md="2"
                        class="ps-3"
                    >
                        <v-img
                            contain
                            aspect-ratio="1/1"
                            :src="product.productImageUrl"
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

                    <!-- Order Detail -->
                    <v-col
                        cols="8"
                        md="10"
                        class="text-dark"
                    >
                        <p class="fs-md-4 fs-6"><strong>{{ product.productName }}</strong></p>
                        <!-- MD View -->
                        <div 
                            class="d-md-block d-none"
                        >
                            <div
                                class="d-flex flex-row pe-md-4 align-items-center"
                            >
                                <span>{{ product.productVariant }}</span>
                                <v-spacer></v-spacer>
                                <span class="float-right">RM: {{ product.productPrice.toFixed(2) }}</span>
                            </div>
                            <p>x{{ product.productQty }}</p>
                        </div>

                        <!-- SM View -->
                        <div    
                            class="d-md-none d-block"
                        >
                            <div
                                class="d-flex flex-row pe-1 align-items-center justify-content-between"
                            >
                                <span
                                    class="col-9"
                                >{{ product.productVariant }}</span>
                                <span 
                                    class="float-right col-3 text-end"
                                >x{{ product.productQty }}</span>
                            </div>
                            <span class="float-right mt-4">RM {{ product.productPrice }}</span>
                        </div>
                    </v-col>
                </v-row>
            </v-expand-transition>

            <template v-else>
                <v-row
                    :class="(idx == 0 && showAllProducts) ? 'mt-1' : null"
                >
                    <!-- Order Image -->
                    <v-col
                        cols="4"
                        :md="isInDetail ? 1 : 2"
                        class="ps-3"
                    >
                        <v-img
                            contain
                            aspect-ratio="1/1"
                            :src="product.productImageUrl"
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

                    <!-- Order Detail -->
                    <v-col
                        cols="8"
                        :md="isInDetail ? 11 : 10"
                        class="text-dark"
                    >
                        <p class="fs-md-4 fs-6"><strong>{{ product.productName }}</strong></p>
                        <!-- MD View -->
                        <div 
                            class="d-md-block d-none"
                        >
                            <div
                                class="d-flex flex-row pe-md-4 align-items-center"
                            >
                                <span>{{ product.productVariant }}</span>
                                <v-spacer></v-spacer>
                                <span class="float-right">RM: {{ product.productPrice.toFixed(2) }}</span>
                            </div>
                            <p>x{{ product.productQty }}</p>
                        </div>

                        <!-- SM View -->
                        <div    
                            class="d-md-none d-block"
                        >
                            <div
                                class="d-flex flex-row pe-1 align-items-center justify-content-between"
                            >
                                <span
                                    class="col-9"
                                >{{ product.productVariant }}</span>
                                <span 
                                    class="float-right col-3 text-end"
                                >x{{ product.productQty }}</span>
                            </div>
                            <span class="float-right mt-4">RM {{ product.productPrice }}</span>
                        </div>
                    </v-col>
                </v-row>
            </template>
        </template>
        <!-- Show More -->
        <v-card-actions
            v-if="((isMobile && order.orderProducts.length > mobileMaxShowList) || !isMobile && order.orderProducts.length > desktopMaxShowList) && !showAllProducts"
            class="d-flex flex-row justify-content-center"
        >
            <v-btn
                color="grey-darken-4"
                variant="text"
                :prepend-icon="expand ? 'mdi-arrow-up' : 'mdi-arrow-down'"
                @click.stop.prevent="expand = !expand"
            >
                {{ !expand ? 'Show More' : 'Show Less' }}
            </v-btn>    
        </v-card-actions>

        <v-divider
            :thickness="2"
            class="border-opacity-25"
            color="grey-darken-2"
        ></v-divider>

        <div
            class="text-dark float-right pe-md-4"
        >
            <div 
                class="d-flex flex-row align-items-center gap-2 mb-2"
            >
                <p class="fs-md-4 fs-7 mb-0 fw-bold">Total: </p>
                <p class="fs-md-3 fs-6 mb-0 fw-bold">RM {{ order.orderTotalPrice.toFixed(2) }}</p>
            </div>
        </div>
    </v-card>
</template>

<script>
import { isMobile } from "mobile-device-detect";

export default {
    name:"OrderCard",
    props: {
        orderId: {
            type:Number,
            default:-1
        },
        order: {
            type:Object,
            default: undefined
        },
        showOrderId: {
            type:Boolean,
            default:true
        },
        showAllProducts: {
            type:Boolean,
            default: false
        },
        isInDetail: {
            type:Boolean,
            default: false
        }
    },
    data:function() {
        return {
            order: {},
            totalPrice: -1,
            expand: false,
            mobileMaxShowList: 1,
            desktopMaxShowList: 2
        }
    },
    computed: {
        isMobileDevice() {
            return isMobile;
        }
    },
    watch: {
        isMobile() {
            console.log("now: " + isMobile);
        }
    }
}
</script>