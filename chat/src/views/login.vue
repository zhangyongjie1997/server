<template>
  <div class="login page flex">
    <div class="container">
      <el-row class="title">
        <el-col :span="6">
          <h1>登录</h1>
        </el-col>
        <el-col :span="18" class="text-left">
          <span>没有账号？<router-link to="/register" class="a">去注册</router-link></span>
        </el-col>
      </el-row>
      <el-row class="margin-top-row">
        <cus-input placeholder="" :maxlength=11 :label="'手机号'" v-model="phone"></cus-input>
      </el-row>
      <el-row class="margin-top-row" style="margin-top:20px;">
        <cus-input type="password" :label="'密  码'" v-model="password"></cus-input>
      </el-row>
      <el-row class="margin-top-row">
        <span @click="login" class="pointer">登录</span>
      </el-row>
    </div>
  </div>
</template>

<script>
import {login} from '../api/api.js';
import utils from '../lib/utils.js';
// @ is an alias to /src

export default {
  name: "home",
  data(){
    return{
      phone: '',
      password: ''
    }
  },
  methods: {
    login(){
      let data = {
        phone: this.phone,
        password: this.password
      }
      login(data).then(res=>{
        if(res.code == 0){
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              utils.setLocalStorage(key,res.data[key])
            }
          }
          this.$store.commit('setUser', res.data)
          this.$router.push('/index');
        }
      }).catch();
    }
  },
  watch:{
    input(value){
      console.log(value);
    }
  }
};
</script>
<style lang="less" scoped>
.login{
  .container{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 350px;
    height: 350px;
    .title{
      margin-bottom: 20px;
      display: flex;
      justify-items: baseline;
      justify-content: flex-end;
      span{
        position: relative;
        top: 18px;
        a{
          color: rgb(32, 66, 255);
        }
      }
    }
    
  }
}
</style>
