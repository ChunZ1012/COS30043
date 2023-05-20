<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    <v-spacer></v-spacer>
    <v-col cols="12" class="p-1 p-md-3">
      <h2>{{ breadcrumbTitle }}</h2>

      <v-row v-for="order in orders" class="col-12 m-0 mt-4">
        <OrderCard
          :orderGuid="order.orderGuid"
          :order="order"
          :showOrderId="true"
          :showAllProduct="false"
        ></OrderCard>
      </v-row>
    </v-col>
  </div>
</template>

<script>
import OrderCard from "@/views/misc/orders/OrderCardView.vue";
import { usePOST } from "@/assets/js/HttpManager";
import { useDialog } from "@/assets/js/SweetAlert2Dialog";

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
    };
  },
  created() {
    // Pushing the vue props to the breadcrumbs list
    this.breadcrumbs.push(this.breadcrumbTitle);
    // Load data from json
    // this.orders = OrderData.slice(0, 10);
    this.getOrderData();
  },
  mounted() {},
  methods: {
    getOrderData() {
      let url = "http://localhost/COS30043/index.php/orders/list";
      const { error, stop } = usePOST(url, {
        callback: (r, e) => {
          if (e)
            useDialog(
              "Oops",
              "Error when fetching the order data!",
              false,
              true
            );
          else {
            this.orders = r;
            console.log(r);
          }
          stop();
        },
      });
    },
  },
  components: {
    OrderCard,
  },
};
</script>
