import Vue from "vue";
import Router from "vue-router";
import login from "./views/login.vue";
import register from "./views/register.vue";
import upload from "./views/upload.vue";
import index from "./views/index.vue";
import personal from "./views/personal.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      name: "login",
      component: login,
      meta:{
        title:'登录'
      }
    },
    {
      path: "/register",
      name: "register",
      component: register,
      meta:{
        title:'注册'
      }
    },
    {
      path: "/upload",
      name: "upload",
      component: upload,
      meta:{
        title:'上传'
      }
    },
    {
      path: "/index",
      name: "index",
      component: index,
      meta:{
        title:'首页'
      }
    },
    {
      path: "/personal",
      name: "personal",
      component: personal,
      meta:{
        title:'个人中心'
      }
    },
    {
      path: "/",
      name: "index",
      component: index,
      meta:{
        title:'首页'
      }
    },
  ]
});
