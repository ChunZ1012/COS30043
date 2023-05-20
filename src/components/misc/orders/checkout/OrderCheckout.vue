<template>
    <v-row>
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    </v-row>
    <v-overlay
        v-if="isLoading"
        v-model="isLoading"
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

    <v-fade-transition
        group="true"
    >
        <v-row v-if="!isLoading">
            <v-col
                cols="12"
                md="6"
                order="last"
                order-lg="first"
                align-self="auto"
            >
                <v-form 
                    ref="form" 
                    v-model="valid"
                    @submit.prevent
                >
                    <h2 class="mb-3">Delivery Information</h2>
                    <template
                        v-for="data in formInputData"
                    >
                        <v-text-field
                            variant="outlined"
                            v-model="data.value"
                            :label="data.label"
                            :name="data.name"
                            :type="data.type"
                            :placeholder="data.placeholder"
                            :required="data.required"
                            :rules="data.rules ? data.rules.concat(commonTextRule) : commonTextRule"
                            class="mb-2"
                        ></v-text-field>
                    </template>

                    <h4>Select Payment Method</h4>
                    <v-radio-group
                        v-model="paymentMethod"
                        :rules="commonTextRule"
                    >
                        <v-radio
                            value="banking"
                        >
                            <template v-slot:label>
                                Online Banking
                            </template>
                        </v-radio>
                    </v-radio-group>

                    <v-btn
                        type="submit"
                        block
                        class="mt-2"
                        variant="outlined"
                        width="20%"
                        @click="submitForm"
                        :disabled="!valid"
                    >Submit</v-btn>
                </v-form>
            </v-col>

            <v-col
                cols="12"
                md="6"
                order="first"
                order-lg="last"
                class="p-3 p-md-0 mb-4"
            >
                <h2 class="mb-3">Product Details</h2>
                <OrderCheckoutProductCardView
                    :products="orderData.orderDetail"
                    :showAllProducts="false"
                ></OrderCheckoutProductCardView>
            </v-col>
        </v-row>
    </v-fade-transition>
</template>

<script>
import OrderCheckoutProductCardView from "@/views/misc/orders/checkout/OrderCheckoutProductCardView.vue";
import OrderCard from "@/views/misc/orders/OrderCardView.vue";

import { useDialog } from "@/assets/js/SweetAlert2Dialog";
import { usePOST } from '@/assets/js/HttpManager';

export default {
    name:"OrderCheckout",
    props: {
        orderGuid: {
            type:String,
            default: ""
        }
    },
    data:function() {
        const commonTextRule = [(v) => !!v || 'This field is required!'];
        return {
            breadcrumbs:["Home", "Order", "Payment"],
            isLoading:true,
            orderData:[],
            // Form data
            valid: false,
            paymentMethod:"",
            formInputData: [
                {
                    type:"text",
                    label: "Full Name",
                    placeholder:"Your full name",
                    name: "orderDeliveryName",
                    required: true,
                    value: ""
                },
                {
                    type:"text",
                    label: "Delivery Address 1",
                    placeholder:"Your delivery address 1",
                    name: "orderDeliveryAddress",
                    required: true,
                    value: ""
                },
                {
                    type:"text",
                    label: "Delivery Address 2",
                    placeholder:"Your delivery address 2",
                    name: "orderDeliveryAddress2",
                    required: true,
                    value: ""
                },
                {
                    type:"tel",
                    label: "Delivery Contact Number",
                    placeholder:"Your delivery contact no.",
                    name: "orderDeliveryContact",
                    required: true,
                    value: ""
                },
                {
                    type:"email",
                    label: "Delivery Email",
                    placeholder:"Your delivery email",
                    name: "orderDeliveryEmail",
                    required: true,
                    rules: [
                        (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Invalid email format!"
                    ],
                    value: ""
                }
            ],
            commonTextRule,
        }
    },
    created() {
        this.getOrderData();
    },
    computed:{

    },
    methods: {
        getOrderData() {
            let url = "http://localhost/COS30043/index.php/orders/get?id=" + this.orderGuid;
            const { error, stop } = usePOST(url, {
                callback: (r, e) => {
                    if(e) {
                        useDialog("Oops", "Error when fetching the order data!", false);
                        console.log(e);
                    }
                    else {
                        this.orderData = r;
                        this.isLoading = false;
                    }
                    stop();
                }
            });
        },
        submitForm() {
            this.$refs.form.validate();
            if(this.valid) {
                console.log('form data valid');

                let data = {}
                this.formInputData.forEach(f => {
                    data[f.name] = f.value;
                })

                let url = "http://localhost/COS30043/index.php/orders/update?id=" + this.orderGuid;
                
            }
            else console.log('form not valid');
        }
    },
    beforeUnmount() {
        console.log('unmounting... ');
    },
    components: {
        OrderCheckoutProductCardView,
        OrderCard
    }
}
</script>