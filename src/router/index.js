import { createRouter, createWebHistory } from "vue-router";
import store from "@/stores";
import { useToast } from "@/assets/js/SweetAlert2Dialog";
import { resetLoginAndRedirect } from "@/inc/const";

const PUBLIC_ROUTES_NAME = [
  'Login',
  'Register',
  'Home',
  'Products',
  'ProductsType',
  'ProductDetail'
]

const routes = [
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
            },
            props: route => ({
              query: route.query.q
            })
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
      {
        path: "account",
        name: "UserAccount",
        component: () => import("@/views/misc/users/UserAccountView.vue")
      },
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/LoginView.vue"),
      },
      {
        path: "register",
        name: "Register",
        component: () => import("@/views/RegisterView.vue"),
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

router.beforeEach(async (to, from, next) => {
    let isPublic = PUBLIC_ROUTES_NAME.includes(to.name);
    let isLoggedIn = store.getters['auth/isLoggedIn'];
    
    if(!isPublic && !isLoggedIn) resetLoginAndRedirect();
    else next();
});

export default router;