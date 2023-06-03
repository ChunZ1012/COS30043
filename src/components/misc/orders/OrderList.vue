<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    <v-spacer></v-spacer>
    <v-col cols="12" class="p-1 p-md-3">
      <h2>{{ breadcrumbTitle }}</h2>

      <v-card
        variant="plain"
      >
        <v-tabs
          v-model="currentTab"
        >
          <v-tab
            v-for="(o, idx) in getOrderStatusEnum"
            :key="idx"
            :value="idx"
          >{{ o.text }}</v-tab>
        </v-tabs>

        <v-card-item
          class="p-1 p-md-2"
        >
          <v-window
            v-model="currentTab"
          >
            <v-window-item
              v-for="(o, idx) in getOrderStatusEnum"
              :key="idx"
              :value="idx"
              class="p-2"
            >
              <template
                v-for="order in orders"
              >
                <template
                  v-if="idx == 0"
                >
                  <OrderCard
                    :order="order"
                    class="mb-3"
                  ></OrderCard>
                </template>
                <template
                  v-else
                >
                  <OrderCard
                    v-if="order.orderStatus == idx"
                    :order="order"
                    class="mb-3"
                  ></OrderCard>
                </template>
              </template>
            </v-window-item>
          </v-window>
        </v-card-item>

        <v-row 
          v-if="false"
          v-for="order in orders" 
          class="col-12 m-0 mt-4"
        >
          <OrderCard
            :order="order"
          ></OrderCard>
        </v-row>
      </v-card>
    </v-col>
  </div>
</template>

<script>
import OrderCard from "@/views/misc/orders/OrderCardView.vue";
import OrderStatusEnum from "@/assets/js/enums/OrderStatusEnum";
import LoadingView from "@/views/misc/helpers/LoadingView.vue";
import { usePOST } from "@/assets/js/HttpManager";
import { BASEURL, resetLoginAndRedirect } from "@/inc/const";

export default {
  name: "OrderList",
  props: {
    breadcrumbTitle: {
      type: String,
      default: "",
    },
  },
  data: function () {
    return {
      // #############
      // Real
      // #############
      breadcrumbs: ["Home"],
      orders: [],
      currentTab: 0,
    };
  },
  created() {
    // Pushing the vue props to the breadcrumbs list
    this.breadcrumbs.push(this.breadcrumbTitle);
    this.getOrderData();
  },
  mounted() {},
  computed: {
    getOrderStatusEnum() {
      return OrderStatusEnum;
    }
  },
  methods: {
    getOrderData() {
      let url = `${BASEURL}/orders/list`;
      usePOST(url, {
        callback: (r, e) => {
          if (e) {
            resetLoginAndRedirect();
            console.log(e);
          }
          else this.orders = r;
        },
      });
    },
  },
  components: {
    OrderCard,
    LoadingView
  },
};
</script>
