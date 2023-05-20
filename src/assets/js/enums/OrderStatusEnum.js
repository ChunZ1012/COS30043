const OrderStatusEnum = Object.freeze({
  PLACED: {
    text: "Order Placed",
    icon: "mdi-equal-box",
  },
  PICKED: {
    text: "Parcel Picked",
    icon: "mdi-check-all",
  },
  SHIPPING: {
    text: "Shipping",
    icon: "mdi-airplane-takeoff",
  },
  DELIVERED: {
    text: "Delivered",
    icon: "mdi-truck-delivery",
  },
});

export default OrderStatusEnum;
