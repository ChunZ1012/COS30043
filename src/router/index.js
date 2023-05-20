import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/",
    name: "Container",
    component: () => import("@/views/ContainerView.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/HomeView.vue"),
      },
      {
        path: "products",
        name: "ProductsContainer",
        children: [
          {
            path: "all",
            name: "Products",
            component: () =>
              import("@/views/misc/products/ProductListView.vue"),
            redirect: {
                name:'ProductsType',
                params: {
                  productType:'all'
                }
            }
          },
          {
            path: "types/:productType",
            name: "ProductsType",
            component: () =>
              import("@/views/misc/products/ProductListView.vue"),
            props: true,
          },
        ],
      },
      {
        path: "products/view/:id",
        name: "ProductDetail",
        component: () => import("@/views/misc/products/ProductDetailView.vue"),
        props: true,
      },
      {
        path: "orders",
        name: "Orders",
        component: () => import("@/views/misc/orders/OrderListView.vue"),
        // alias: ['/orders/view'],
        props: {
          breadcrumbTitle: "All Orders",
        },
      },
      {
        path: "order/checkout/:orderGuid",
        name: "OrderCheckout",
        component: () => import("@/views/misc/orders/checkout/OrderCheckoutView.vue"),
        props: true
      },
      {
        path: "orders/view/:orderGuid",
        name: "OrderDetail",
        component: () => import("@/views/misc/orders/OrderDetailView.vue"),
        props: true,
      },
      {
        path: "carts",
        name: "Carts",
        component: () => import("@/views/misc/carts/CartListView.vue"),
      },
    ],
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  strict:true,
  sensitive:true
});

// router.beforeEach(async (to, from) => {
//   console.log('to: ', to);
//   console.log('from: ', from);
// });

export default router;
