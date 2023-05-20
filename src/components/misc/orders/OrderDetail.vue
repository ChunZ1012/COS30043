<template v-if="order !== undefined">
  <div>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    <v-spacer></v-spacer>

    <div class="d-flex flex-row">
      <!-- Order Status Timeline -->
      <v-timeline direction="horizontal" side="start">
        <v-timeline-item
          v-for="(status, key) in orderStatusEnum"
          size="x-large"
        >
          <template v-slot:icon>
            <v-avatar
              rounded="24"
              :color="isOrderStatusExist(key) ? 'success' : 'grey-lighten-1'"
              size="large"
            >
              <v-icon :icon="status.icon" color="white"></v-icon>
            </v-avatar>
          </template>
          <template v-slot:opposite>
            {{ status.text }}
          </template>
        </v-timeline-item>
      </v-timeline>
    </div>

    <div class="p-md-4 p-2 mt-4">
      <!-- Order Information -->
      <v-row>
        <v-col cols="12" md="4">
          <h3>Delivery Address</h3>
          <p class="mb-1">{{ order?.orderDeliveryName }}</p>
          <p class="mb-1">{{ order?.orderDeliveryContact }}</p>
          <p class="mb-1">{{ order?.orderDeliveryEmail }}</p>
          <p class="mb-1">{{ order?.orderDeliveryAddress }}</p>
        </v-col>

        <v-col cols="12" md="auto">
          <v-divider
            :thickness="2"
            :vertical="!isMobileDevice"
            :class="'mt-0 ' + (!isMobileDevice ? 'fill-height' : null)"
          ></v-divider>
        </v-col>

        <v-col cols="12" md="auto" align-self="start">
          <v-timeline
            side="end"
            density="comfortable"
            truncateLine="end"
            align="start"
          >
            <v-timeline-item
              v-for="(timeline, idx) in order.orderDeliveryTimelines"
              :key="idx"
              :dot-color="'success'"
              size="16"
            >
              <div class="d-flex flex-row gap-3">
                <span
                  ><strong>{{ timeline.date }}</strong></span
                >
                <span>{{ timeline.description }}</span>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-col>
      </v-row>

      <!-- Order Products -->
      <div class="mt-4">
        <h3>Order Items</h3>

        <OrderCard
          :orderId="order?.orderId"
          :order="order"
          :showOrderId="false"
          :showAllProducts="true"
          :isInDetail="true"
        ></OrderCard>
      </div>
    </div>
  </div>

  <Dialog ref="orderDialog"></Dialog>
</template>

<script>
import { isMobile } from "mobile-device-detect";
import OrderStatusEnum from "@/assets/js/enums/OrderStatusEnum.js";
import OrderData from "@/assets/data/Orders.json";
import OrderCard from "@/views/misc/orders/OrderCardView.vue";
import Dialog from "@/components/misc/dialogs/Dialog.vue";

export default {
  name: "OrderDetail",
  props: {
    orderId: {
      type: String,
      default: -1,
    },
  },
  data: function () {
    return {
      breadcrumbs: ["Home", "Orders"],
      order: undefined,
    };
  },
  created() {
    for (var i = 0; i < OrderData.length; i++) {
      if (OrderData[i].orderId == this.orderId) {
        this.order = OrderData[i];
        break;
      }
    }
  },
  mounted() {
    // Do dialog prompting after mount, since the $refs only assigned after created
    if (this.order === undefined || this.order == {}) {
      this.promptDialog(
        "Oops!",
        "Sorry but seems like the order you view is invalid or no longer exist!"
      );
    } else {
      // Push order id to breadcrumbs
      this.breadcrumbs.push(this.orderId);
    }
  },
  computed: {
    isMobileDevice() {
      return isMobile;
    },
    orderStatusEnum() {
      return OrderStatusEnum;
    },
  },
  methods: {
    isOrderStatusExist(status) {
      let isExist = 0;
      this.order.orderDeliveryStatus.forEach((d) => {
        if (d.orderStatus.toLowerCase() == status.toLowerCase()) {
          isExist += 1;
        }
      });

      return isExist > 0;
    },
    promptDialog(title, description) {
      this.$refs.orderDialog.showDialog(title, description);
    },
  },
  components: {
    OrderCard,
    Dialog,
  },
};
</script>
