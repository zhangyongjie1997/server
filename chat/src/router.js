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
      name: "index",
      component: () => import('./views/index.vue'),
      meta:{
        title:'首页'
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
      path: "/",
      name: "index",
      component: () => import('./views/index.vue'),
      meta:{
        title:'首页'
      }
    },
    {
      path: "/classList",
      name: "classList",
      component: () => import('./views/classList.vue'),
      meta:{
        title:'分类'
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
  ]
});
