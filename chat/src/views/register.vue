<template>
  <div class="login page flex">
    <div class="container">
      <el-row class="title">
        <el-col :span="6">
          <h1>注册</h1>
        </el-col>
        <el-col :span="18" class="text-left">
          <span>已有账号？<router-link to="/login" class="a">去登录</router-link></span>
        </el-col>
      </el-row>
      <el-row class="margin-top-row">
        <cus-input :label="'手机号'" v-model="phone" :maxlength=11></cus-input>
      </el-row>
      <el-row class="margin-top-row" style="margin-top:20px;">
        <cus-input type="password" :label="'密  码'" v-model="password"></cus-input>
      </el-row>
      <el-row class="margin-top-row" style="margin-top:20px;">
        <cus-input :label="'昵  称'" v-model="nick_name"></cus-input>
      </el-row>
      <el-row class="margin-top-row">
        <span @click="register" class="pointer">注册</span>
      </el-row>
    </div>
  </div>
</template>

<script>
import {register} from '../api/api.js';
// @ is an alias to /src

export default {
  name: "home",
  data(){
    return{
      phone: '',
      password: '',
      nick_name: ''
    }
  },
  methods: {
    register(){
      let data = {
        phone: this.phone,
        password: this.password,
        nick_name: this.nick_name,
        sex: 0
      }
      register(data).then(res=>{
        if(res.code==0){
          this.$router.push('/login');
        }else{
          this.$message(res.data.msg);
        }
      });
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
