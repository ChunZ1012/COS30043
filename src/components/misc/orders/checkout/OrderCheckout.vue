<template>
    <v-row>
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    </v-row>
    <v-fade-transition
        group="true"
    >
        <v-row>
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

                    <v-radio-group
                        v-model="selectedDeliveryInformation"
                        @change="onDeliveryInfomationRadioChanged"
                    >
                        <v-radio
                            v-for="d in deliveryInformations"
                            :value="d.deliveryID"
                        >
                            <template v-slot:label>
                                <v-card
                                    class="mb-3"
                                    variant="flat"
                                    :elevation="0"
                                >
                                    <v-card-item
                                    >
                                        <h4> {{ d.deliveryName }}</h4>
                                        <p class="mb-1">Address: {{ getCombinedDeliveryAddress(d) }} </p>
                                        <p class="mb-1">Email: {{ d.deliveryEmail }} </p>
                                        <p class="mb-1">Contact: {{ d.deliveryContact }} </p>
                                    </v-card-item>
                                </v-card>
                            </template>
                        </v-radio>
                    </v-radio-group>
                    
                    <template
                        v-for="data in deliveryInputFields"
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
import { useDialog } from "@/assets/js/SweetAlert2Dialog";
import { usePOST } from '@/assets/js/HttpManager';
import { BASEURL } from "@/inc/const";

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
            orderData:[],
            // Form data
            valid: false,
            paymentMethod:"",
            // Delivery
            deliveryInformations: [],
            selectedDeliveryInformation: -1,
            // Delivery Form Fields     
            deliveryInputFields: [
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
                    name: "orderDeliveryAddress1",
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
        // Get order data from api
        this.getOrderData();
        // Get delivery information 
        this.getDeliveryInformation();
    },
    computed:{

    },
    methods: {
        getOrderData() {
            let url = `${BASEURL}/orders/check?id=${this.orderGuid}`;
            usePOST(url, {
                callback: (r, e) => {
                    if(e) {
                        useDialog("Oops", {
                            description: e,
                            showCancelButton: false,
                            sticky: true,
                            confirmButtonAction: () => {
                                this.$router.go(-1);
                            }
                        });
                        console.log(e);
                    }
                    else this.orderData = r;
                }
            });
        },
        getDeliveryInformation() {
            let url = `${BASEURL}/account/list-delivery`;
            usePOST(url, {
                callback: (r, e) => {
                    this.deliveryInformations = r;
                }
            });
        },
        getCombinedDeliveryAddress(d) {
            return `${d.deliveryAddress1}, ${d.deliveryAddress2}`;
        },
        onDeliveryInfomationRadioChanged() {
            let d = this.deliveryInformations.find(de => de.deliveryID == this.selectedDeliveryInformation);

            if(d != undefined || d != null) {
                this.deliveryInputFields.forEach(f => {
                    let name = f.name.substring(5);
                    name = name.charAt(0).toLowerCase() + name.slice(1);

                    if(d.hasOwnProperty(name)) {
                        f.value = d[name];
                    }
                });
            }
        },
        submitForm() {
            this.$refs.form.validate();
            if(this.valid) {
                console.log('form data valid');
                
                let d = {};
                this.deliveryInputFields.forEach(f => {
                    d[f.name] = f.value;
                });

                let url = `${BASEURL}/orders/checkout?id=${this.orderGuid}`;
                
                usePOST(url, {
                    data: d,
                    callback: (r, e) => {
                        if(r || !e) {
                            useDialog('Hooray!', {
                                description: 'Successfully Checkout!',
                                showCancelButton: false,
                                confirmButtonAction: () => {
                                    console.log('dialog closed!');
                                    this.$router.push({
                                        name: "Home"
                                    });
                                }
                            })
                        }
                        else {
                            useDialog('Oops', {
                                description: e,
                                showCancelButton: false,
                                sticky: true
                            })
                        }
                    }
                });
            }
            else console.log('form not valid');
        }
    },
    components: {
        OrderCheckoutProductCardView
    }
}
</script>