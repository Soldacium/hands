import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// import store from "./store/store";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("./views/welcome/Welcome.vue"),
  },
  {
    path: "/rock-paper-scissors",
    component: () => import("./views/RPS/RPS.vue"),
  },
];

const router = createRouter({
  routes: routes,
  linkActiveClass: "activated-route",
  history: createWebHistory(),
});

router.beforeEach((to, from, next) => {
  // store.commit("changeLoading");
  console.log("hey");
  next();
});

router.afterEach(() => {
  // store.commit("changeLoading");
});

export default router;
