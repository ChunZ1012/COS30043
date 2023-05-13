<template v-if="product !== undefined">
    <v-row>
      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
      <v-spacer></v-spacer>
    </v-row>
    <!-- Prodct Detail Header -->
    <v-row>
        <!-- Product Image Carousel -->
        <v-col
            cols="12"
            md="6"
        >
            <v-card
                elevation="4"
                variant="plain"
                class="mx-auto fill-height"
            >
                <v-carousel 
                    hide-delimiter-background 
                    show-arrows="hover"
                    cycle
                    :height="isMobileDevice ? -1 : 400"
                >
                    <v-carousel-item
                        v-for="(imageUrl, i) in product.info.images"
                        :class="imageUrl"
                        :key="i"
                        :src="imageUrl"
                        cover
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
        <v-col
            cols="12"
            md="6"
        >
            <v-form
                v-model="valid"
            >
                <h1
                    class="fw-bold"
                >{{ product.title }}</h1>
                <div class="d-flex flex-row align-items-center" v-if="product.discount">
                    <del>
                        <span class="fs-6">RM {{ product.price }}</span>
                    </del>
                    <span class="fs-5 ms-2" style="color: chocolate"
                        >RM {{ (product.price - product.distAmt).toFixed(2) }}</span
                    >
                    </div>

                    <div class="d-flex flex-row align-items-center" v-else>
                    <span class="fs-5" color="white">RM {{ product.price.toFixed(2) }}</span>
                </div>

                <v-select
                    v-if="product.info.variant || product.info.variant.length > 0"
                    :label="product.info.variant.type"
                    :items="product.info.variant.values"
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

                <v-col
                    cols="12"
                    md="4"
                >
                    <v-text-field
                        label="Qty"
                        type="number"
                        v-model="orderQty"
                        variant="outlined"
                        min="0"
                        :max="product.info.availQty"
                        prepend-icon="mdi-minus"
                        @click:prepend="() => {
                            orderQty -= (orderQty == 0) ? 0 : 1
                        }"
                        append-icon="mdi-plus"
                        @click:append="() => {
                            orderQty += (orderQty == product.info.availQty) ? 0 : 1;
                        }"
                        :rules="qtyRule"
                    >
                    </v-text-field>
                </v-col>
                <v-spacer></v-spacer>
                <v-row
                    class="mt-md-4 ma-md-4"
                >
                    <!-- Add to Cart -->
                    <v-col
                        cols="12"
                        md="auto"
                    >
                        <v-btn
                            variant="outlined"
                            type="submit"
                            block
                            @click.stop.prevent="addToCart"
                            :disabled="!buttonEnabled"
                        >Add to Cart</v-btn>
                    </v-col>
                    <!-- Buy Now -->
                    <v-col
                        cols="12"
                        md="auto"
                    >
                        <v-btn
                            variant="outlined"
                            type="submit"
                            block
                            :disabled="!buttonEnabled"
                        >Buy Now</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-col>
    </v-row>

    <!-- Product Detail Content -->
    <v-spacer></v-spacer>
    <v-row
        class="mt-4"
    >
        <v-card
            flat="true"
            class="w-100"
        >
            <v-tabs
                bg-color="transparent"
                v-model="currentTab"
                align-tabs="start"
            >
                <v-tab value="description">Description</v-tab>
                <v-tab value="rating">Rating</v-tab>
            </v-tabs>

            <v-card-text
                class="w-100 pa-4"
            >
                <v-window 
                    v-model="currentTab"
                >
                    <v-window-item
                        value="description"
                    >
                        <p>{{ product.info.description }}</p>

                    </v-window-item>
                    <!-- Rating -->
                    <v-window-item
                        value="rating"
                    >
                        <v-card
                            class="d-flex flex-column mx-auto p-4"
                            elevation="2"
                        >
                            <p class="fs-3 fw-bold">Rating Overview</p>
                            <div
                                class="d-flex align-center flex-column my-auto"
                            >
                                <div 
                                    class="fs-1 mt-md-4 mt-2 fw-bold"
                                >
                                    {{ getAvgRating }}
                                    <span class="fs-5 ml-md-n3 ml-n2 fw-normal">/5</span>
                                </div>

                                <v-rating
                                    :model-value="getAvgRating"
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
                                <v-list-item
                                    v-for="(rating, idx) in 5"
                                    :key="i"
                                >
                                    <v-progress-linear
                                        :model-value="calculateRatingBarValueBasedOnRating(rating) * 100"
                                        class="mx-n5"
                                        color="yellow-darken-2"
                                        height="21"
                                        rounded
                                    ></v-progress-linear>

                                    <template v-slot:prepend>
                                        <span>{{ rating }}</span>
                                        <v-icon 
                                            icon="mdi-star"
                                            class="mx-4"
                                        ></v-icon>
                                    </template>
                                    <template v-slot:append>
                                        <div class="rating-values">
                                            <span class="d-flex justify-end"> {{ getTotalReviewsCountBasedOnRating(rating) }} </span>
                                        </div>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-card>

                        <div
                            class="mt-4 pt-3"
                        >
                            <p class="fs-2 fw-bold">Review(s)</p>
                            <ProductReviewView
                                v-for="review in getCurrentReviews"
                                :userAvatarUrl="review.userAvatarUrl"
                                :userDisplayName="review.userDisplayName"
                                :userRating="review.userRating"
                                :userComment="review.userComment"
                                :userCommentTime="review.userCommentTime"
                                width="90%"
                                class="my-4"
                            ></ProductReviewView>
                            <!-- Review Paginator -->
                            <v-pagination
                                v-model="currentPage"
                                :length="Math.ceil(product.info.reviews.length / itemsPerPage)"
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

    <Dialog 
        ref="productDialog"
    ></Dialog>
</template>

<style>
.rating-container {
    width:90%;
    height: fit-content;
}
</style>

<script>
import { isMobile } from "mobile-device-detect";
import { useLoading, useToast, useCloseDialog, useDialog } from '@/assets/js/SweetAlert2Dialog';
import ProductData from '@/assets/data/Products.json';
import Dialog from '@/components/misc/dialogs/Dialog.vue';
import ProductReviewView from '@/views/misc/products/ProductReviewView.vue';

export default {
    name: "ProductDetail",
    props: {
        id: {
            type:String||Number,
            default: -1
        }
    },
    data: function () {
       return {
            // Rules
            variantRule: [
                (v) => {
                    this.buttonEnabled = !!v;
                    return !!v || "Please select at least one variant!"
                }
            ],
            qtyRule: [
                (v) => {
                    this.buttonEnabled = !!v;
                    return !!v || "Please enter a number larger than 0!"
                },
                (v) => {
                    this.buttonEnabled = !!v;
                    return v > 0 || "Please enter a number larger than 0!"
                },
                (v) => {
                    this.buttonEnabled = !!v;
                    return v <= this.product.info.availQty || "Invalid!"
                }
            ],
            // #############
            // Real
            // #############
            breadcrumbs: ["Home", "Product"],
            product: undefined,
            selectedVariant: {},
            buttonEnabled: true,
            orderQty: 1,
            valid:true,
            currentTab:"",
            // Pagination
            currentPage: 1,
            itemsPerPage: 10,
       }
    },
    created() {
        for(let i in ProductData) {
            let product = ProductData[i];

            if(product.id == this.id) {
                this.product = product;
                break;
            }
        }
    },
    mounted() {
        // Do dialog prompting after mount, since the $refs only assigned after created
        if(this.product === undefined || this.product == {}) {
            this.promptDialog('Oops!', 'Sorry but seems like the item you view is no longer exist!');
        }
        else {
            // Pushing the vue props to the breadcrumbs list
            this.breadcrumbs.push(this.product.title);
            // Set initial variant value
            this.selectedVariant = this.product.info.variant.values[0];
        }
    },
    computed:{
        isMobileDevice() {
            return isMobile;
        },
        getTotalReviewsCount(){
            return this.product.info.reviews.length;
        },
        getAvgRating(){
            let totalReviews = this.product.info.reviews.reduce((total, review) =>  total + parseFloat(review.userRating), 0);
            return (totalReviews / this.getTotalReviewsCount).toFixed(2);
        },
        getCurrentReviews() {
            let start = (this.currentPage - 1);
            return this.product.info.reviews.slice(start, (start + this.itemsPerPage));
        }
    },
    methods: {
        calculateRatingBarValueBasedOnRating(rating){
            let totalRating = this.getTotalReviewsCountBasedOnRating(rating);
            return (totalRating / this.getTotalReviewsCount).toFixed(2);
        },
        getTotalReviewsCountBasedOnRating(rating){
            let totalRating = this.product.info.reviews.filter(r => r.userRating == rating).length;
            return totalRating;
        },  
        promptDialog(title, description) {
            this.$refs.productDialog.showDialog(title, description)
        },
        addToCart() {
            useLoading("Loading...");
            setTimeout(() => {
                this.$store.commit('addToCart', {
                    productId:this.product.id,
                    productVariantId: this.selectedVariant.variantId,
                    productVariantQty: this.orderQty
                });
                useToast("Successfully Added");
            }, 1000);
        }
    },
    watch: {

    },
    components: {
        Dialog,
        ProductReviewView
    }
};
</script>
  