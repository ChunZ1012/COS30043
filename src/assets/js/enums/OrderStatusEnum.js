const OrderStatusEnum = Object.freeze({
    PLACED: {
        text: "Order Placed",
        icon: "mdi-equal-box"
    },
    PACKED: {
        text: "Item Packed",
        icon:"mdi-package-variant-closed"
    },
    PICKED: {
        text: "Parcel Picked",
        icon: "mdi-check-all"
    },
    SHIPPING: {
        text: "Shipping",
        icon: "mdi-airplane-takeoff"
    },
    DELIVERED: {
        text:"Delivered",
        icon:"mdi-truck-delivery"
    }   
});

export default OrderStatusEnum;