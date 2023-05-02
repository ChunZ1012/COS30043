import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ContainerView from "../views/ContainerView.vue";
import ProductListView from "@/views/misc/products/ProductListView.vue";
import ProductDetailView from "@/views/misc/products/ProductDetailView.vue";

const routes = [
  {
    path: "/home-test",
    name: "home",
    component: HomeView,
  },
  {
    path: "/test",
    name: "test",
    component: ContainerView,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/",
    name: "Container",
    component: () => import("../views/ContainerView.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: HomeView,
      },
      {
        path: "/products",
        name: "Products",
        component: ProductListView,
        props: {
          breadcrumbTitle: "All Products",
        },
      },
      {
        path: "/products/view/:id",
        name: "ProductDetail",
        component: ProductDetailView,
        props:true
      },
      {
        path: "/orders",
        name: "Orders",
        component: HomeView,
      }
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
});

export default router;
