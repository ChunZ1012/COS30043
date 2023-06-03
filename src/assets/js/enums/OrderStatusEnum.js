const OrderStatusEnum = Object.freeze({
  0: {
    text:'All'
  },
  1 : {
    text: "Order Placed",
    icon: "mdi-equal-box",
  },
  2: {
    text: "Parcel Picked",
    icon: "mdi-check-all",
  },
  3: {
    text: "Delivered",
    icon: "mdi-truck-delivery",
  },
});

export default OrderStatusEnum;