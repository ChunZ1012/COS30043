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
        >
            <v-tabs
                bg-color="transparent"
                v-model="currentTab"
                align-tabs="start"
            >
                <v-tab value="description">Description</v-tab>
                <v-tab value="rating">Rating</v-tab>
            </v-tabs>

            <v-card-text>
                <v-window 
                    v-model="currentTab"
                >
                    <v-window-item
                        value="description"
                    >
                        <p>{{ product.info.description }}</p>
                    </v-window-item>
                    <v-window-item
                        value="rating"
                        width="95%"
                    >
                        <StarRating
                            :max-rating="5"
                            :increment="0.1"
                            :rating="product.info.overallRating"
                            :read-only="true"
                            :star-size="30"
                            :animate="false"
                        ></StarRating>

                        <v-spacer class="mt-4"></v-spacer>

                        <div>
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
        ref="dialog"
        :isLoading="false"
        :persistent="true"
        :confirmButtonText="'Back to Homepage'"
        :singleButtonOnly="true"
        :confirmButtonAction="{
            type:'route',
            name:'Home'
        }"
    ></Dialog>
</template>

<script>
import { isMobile } from "mobile-device-detect";
import ProductData from '@/assets/data/Products.json';
import Dialog from '@/components/misc/dialogs/Dialog.vue';
import ProductReviewView from '@/views/misc/products/ProductReviewView.vue';
import StarRating from 'vue-star-rating';

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
                (v) => !!v || "Please select at least one variant!"
            ],
            qtyRule: [
                (v) => !!v || "Please enter a number larger than 0!",
                (v) => v > 0 || "Please enter a number larger than 0!",
                (v) => v <= this.product.info.availQty || "Invalid!"
            ],
            // #############
            // Real
            // #############
            breadcrumbs: ["Home", "Product"],
            product: undefined,
            selectedVariant:"",
            orderQty: 1,
            valid:true,
            currentTab:"",
            // Pagination
            currentPage: 1,
            itemsPerPage: 10,
       }
    },
    created() {
        // Pushing the vue props to the breadcrumbs list
        this.breadcrumbs.push(this.breadcrumbTitle);
        for(let i in ProductData) {
            let product = ProductData[i];

            if(product.id == this.id) {
                this.product = product;
                console.log(this.product.info.overallRating)
                break;
            }
        }
    },
    mounted() {
        // Do dialog prompting after mount, since the $refs only assigned after created
        if(this.product === undefined || this.product == {}) {
            this.promptDialog('Oops!', 'Sorry but seems like the item you view is no longer exist!');
        }
    },
    computed:{
        breadcrumbTitle() {
            return this.$route.query.name ?? '';
        },
        isMobileDevice() {
            return isMobile;
        },
        getCurrentReviews() {
            let start = (this.currentPage - 1);
            return this.product.info.reviews.slice(start, (start + this.itemsPerPage));
        }
    },
    methods: {
        isMobileDevice() {
            return isMobile;
        },
        promptDialog(title, description) {
            console.log(this.$refs.dialog);
            this.$refs.dialog.showDialog(title, description)
        }
    },
    watch: {

    },
    components: {
        Dialog,
        StarRating,
        ProductReviewView
    }
};
</script>
  