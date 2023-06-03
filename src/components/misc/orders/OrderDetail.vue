<template v-if="order !== undefined">
  <div
    class="order-container"
  >
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
    <v-spacer></v-spacer>

    <div 
      class="d-flex flex-row overflow-x-scroll"
    >
      <!-- Order Status Timeline -->
      <v-timeline 
        direction="horizontal" 
        side="start"
      >
        <template
          v-for="(status, idx) in getOrderStatusEnum()"
        >
          <v-timeline-item
            v-if="idx > 0 && idx != order.orderStatus"
            size="x-large"
            class="d-none d-md-contents"
          >
            <template 
              v-slot:icon
            >
              <v-avatar
                rounded="24"
                :color="isOrderStatusCompleted(idx) ? 'success' : 'grey-lighten-1'"
                size="large"
              >
                <v-icon :icon="status.icon" color="white"></v-icon>
              </v-avatar>
            </template>
            <template 
              v-slot:opposite
            >
              {{ status.text }}
            </template>
          </v-timeline-item>

          <v-timeline-item
            v-else-if="idx > 0 && idx == order.orderStatus"
            size="x-large"
            class="d-contents d-md-none"
          >
            <template 
              v-slot:icon
            >
              <v-avatar
                rounded="24"
                color="success"
                size="large"
              >
                <v-icon :icon="status.icon" color="white"></v-icon>
              </v-avatar>
            </template>
            <template 
              v-slot:opposite
            >
              {{ status.text }}
            </template>
          </v-timeline-item>
        </template>
      </v-timeline>
    </div>

    <div class="p-md-4 p-2 mt-4">
      <!-- Order Information -->
      <v-row>
        <!-- Order Delivery Information -->
        <v-col cols="12" md="4">
          <h3>Delivery Address</h3>
          <template
            v-if="order.orderDeliveryName == '' || order.orderDeliveryEmail == '' || order.orderDeliveryContact == ''"
          >
            <p>No delivery information</p>
          </template>
          <template
            v-else
          >
            <p class="mb-1">{{ order?.orderDeliveryName }}</p>
            <p class="mb-1">{{ order?.orderDeliveryContact }}</p>
            <p class="mb-1">{{ order?.orderDeliveryEmail }}</p>
            <p class="mb-1">{{ order?.orderDeliveryAddress }}</p>
            <p class="mb-1">{{ order?.orderDeliveryAddress2 }}</p>
          </template>
        </v-col>
        <!-- Order Delivery Spacer -->
        <v-col 
          v-if="order.orderLogs?.length > 0"
          cols="12" 
          md="auto"
        >
          <v-divider
            :thickness="2"
            vertical
            class="mt-0 fill-height d-md-block d-none"
          ></v-divider>
          <v-divider
            :thickness="2"
            class="mt-0 d-md-none d-block"
          ></v-divider>
        </v-col>
        <!-- Order Delivery Timeline -->
        <v-col
          v-if="order?.orderLogs?.length > 0"
          cols="12" 
          md="auto" 
          align-self="start"
          class="mt-md-2 mt-0"
        >
          <v-timeline
            side="end"
            density="comfortable"
            truncateLine="end"
            align="start"
          >
            <v-timeline-item
              v-for="(timeline, idx) in order.orderLogs"
              :key="idx"
              :dot-color="'success'"
              size="16"
            >
              <div class="d-flex flex-row gap-3">
                <span
                  class="col-auto"
                ><strong>{{ timeline.orderLogDate }}</strong></span
                >
                <span
                >{{ timeline.orderLogRemark }}</span>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-col>
      </v-row>
    </div>

    <!-- Ordered Products -->
    <div class="mt-4">
      <h3>Ordered Products</h3>

        <OrderCard
          :orderGuid="order?.orderGuid"
          :order="order"
          :showOrderId="false"
          :showAllProducts="true"
          :isInDetail="true"
        ></OrderCard>
    </div>
  </div>
</template>

<style>
.order-container {
  margin-bottom: 70px;
}
</style>

<script>
import { isMobile } from "mobile-device-detect";
import { usePOST } from "@/assets/js/HttpManager";
import OrderStatusEnum from "@/assets/js/enums/OrderStatusEnum.js";
import OrderCard from "@/views/misc/orders/OrderCardView.vue";
import { useDialog } from "@/assets/js/SweetAlert2Dialog";
import { BASEURL } from "@/inc/const";

export default {
  name: "OrderDetail",
  props: {
    orderGuid: {
      type: String,
      default: -1,
    },
  },
  data: function () {
    return {
      breadcrumbs: ["Home", "Orders"],
      order: {},
    };
  },
  created() {
    this.getOrderDetail();
  },
  mounted() {
    this.breadcrumbs.push(this.orderGuid);
  },
  computed: {
    isMobileDevice() {
      return isMobile;
    },
  },
  computed: {
    getCurrentOrderStatusEnum() {
      return OrderStatusEnum[this.order.orderStatus];
    }
  },
  methods: {
    getOrderDetail() {
      let url = `${BASEURL}/orders/detail?id=${this.orderGuid}`;
      usePOST(url, {
        callback: (r, e) => {
          if(e || !r) {
            useDialog("Oops", {
              description: e,
              sticky:true,
              showCancelButton:false,
              confirmButtonAction: () => {
                this.$router.go(-1);
              }
            });
          }
          else this.order = r;
        }
      });

    },
    // Not working in computed, not sure why it works b4
    getOrderStatusEnum() {
      return OrderStatusEnum
    },
    isOrderStatusCompleted(status) {
      return this.order.orderStatus >= status;
    },
  },
  components: {
    OrderCard
  },
};
</script>
