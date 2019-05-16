<template>
  <el-row class="main">
    <el-col :span="4">
      <div class="logo">
        <img src="../assets/logo.jpg" alt="" height="60px">
      </div>
    </el-col>
    <el-col :span="16">
      <el-menu :default-active="$route.path" router class="el-menu-demo" mode="horizontal" background-color="#000" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="/index">首页</el-menu-item>
        <el-menu-item index="/classList">分类</el-menu-item>
        <el-menu-item :disabled="!isLogin" index="/personal">我的</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="4" class="full-height" v-line_mid>
      <router-link v-if="!isLogin" to="/login" class="login_btn">登录</router-link>
      <el-row v-if="isLogin">
        <el-col :span="8" class="text_left pointer">
          <el-dropdown>
            <img :src="baseUrl + user.avatar" height="60px" width="60px">
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="changeTab('info')">个人信息</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="changeTab('goods')">我的商品</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="changeTab('collect')">我的收藏</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="changeTab('shop')">购物车</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="changeTab('order')">我的订单</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="loginout">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col class="text_left loginout pointer" :span="10">
          <span>{{user.nick_name}}</span>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { baseUrl } from "../lib/config.js";
import utils from "../lib/utils.js";
export default {
  data() {
    return {
      baseUrl: baseUrl,
      //user: {}
    };
  },
  created() {
    // if (utils.getLocalStorage("store")) {
    //   this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
    //   alert(0)
    // }
    // //在页面刷新时将vuex里的信息保存到sessionStorage里
    // window.addEventListener("beforeunload",()=>{
    //   utils.setLocalStorage("store", this.$store.state)
    // })
    //this.user = this.$store.state.user;
  },
  methods: {
    changeTab(tab){
      let path = '/personal?tab=' + tab;
      if(this.$route.path == '/personal'){
        this.$router.replace(path);
      }else{
        this.$router.push(path);
      }
    },
    loginout() {
      this.$store.commit("loginout");
      console.log(this.$router);

      this.$router.replace("/login");
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  }
};
</script>
<style scoped>
.main {
  background-color: #000;
  height: 60px;
  /* position: sticky;
  top: 0;
  z-index: 9; */
}
.main .el-menu.el-menu--horizontal {
  border: none;
}
.logo {
  font-size: 0;
  height: 100%;
}
.login_btn {
  color: #ffffff;
}
.loginout {
  color: #ffffff;
  font-size: 14px;
}
</style>