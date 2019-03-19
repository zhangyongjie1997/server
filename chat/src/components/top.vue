<template>
  <el-row class="main">
    <el-col :span="4">
      <div class="logo">
        <img
          src="../assets/logo.jpg"
          alt=""
          height="60px"
        >
      </div>
    </el-col>
    <el-col :span="16">
      <el-menu
        :default-active="$route.path"
        router
        class="el-menu-demo"
        mode="horizontal"
        background-color="#000"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/index">首页</el-menu-item>
        <el-menu-item index="/classList">分类</el-menu-item>
        <el-menu-item v-if="isLogin" index="/personal">我的</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="4" class="full-height" v-line_mid>
      <router-link v-if="!isLogin" to="/login" class="login_btn">登录</router-link>
      <el-row v-if="isLogin">
        <el-col :span="8" class="text_left">
          <img :src="user.avatar" height="60px" width="60px">
      </el-col>
        <el-col class="text_left loginout pointer" :span="10"><span @click="loginout">退出登录</span></el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import utils from '../lib/utils.js';
export default {
  data() {
    return {
      //user: {}
    };
  },
  created(){
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
  methods:{
    loginout(){
      this.$store.commit('loginout');
      console.log(this.$router);
      
      this.$router.replace('/login');
    }
  },
  computed: {
    isLogin(){
      return this.user.phone ? true : false;
    },
    user(){
      return this.$store.state.user
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
.login_btn{
  color: #ffffff;
}
.loginout{
  color: #ffffff;
  font-size: 14px;
}
</style>