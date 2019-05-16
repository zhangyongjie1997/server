import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import('./views/login.vue'),
      meta:{
        title:'登录'
      }
    },
    {
      path: "/register",
      name: "register",
      component: () => import('./views/register.vue'),
      meta:{
        title:'注册'
      }
    },
    {
      path: "/upload",
      name: "upload",
      component: () => import('./views/upload.vue'),
      meta:{
        title:'上传'
      }
    },
    {
      path: "/index",
      name: "home",
      component: () => import('./views/index.vue'),
      meta:{
        title:'首页',
        keepAlive: true
      }
    },
    {
      path: "/personal",
      name: "personal",
      component: () => import('./views/personal.vue'),
      meta:{
        title:'个人中心',
      }
    },
    {
      path: "/order",
      name: "order",
      component: () => import('./views/order.vue'),
      meta:{
        title:'订单信息',
      }
    },
    {
      path: "/classList",
      name: "classList",
      component: () => import('./views/classList.vue'),
      meta:{
        title:'分类',
        keepAlive: true
      }
    },
    {
      path: "/detail",
      name: "detail",
      component: () => import('./views/detail.vue'),
      meta:{
        title:'详情'
      }
    },
    {
      path: "/settlement",
      name: "settlement",
      component: () => import('./views/settlement.vue'),
      meta:{
        title:'结算'
      }
    },
    {
      path: "/",
      name: "index",
      component: () => import('./views/index.vue'),
      meta:{
        title:'首页',
        keepAlive: true
      }
    },
  ]
});
