<template>
  <div class="dialog">
    <el-dialog :visible.sync="dialogVisible"
               width="30%"
               :before-close="handleClose">
      <div class="content">
        <h1>登录
          <small>没有账号？
            <router-link tag="a"
                         to="/register">注册</router-link>
          </small>
        </h1>
        <el-form ref="Form" :model="Form" class="form" :rules="rules" label-width="100px">
          <el-form-item class="row" label="用户名" prop="phone">
            <el-input v-model="Form.phone"
                      placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item class="row" label="密码" prop="password">
            <el-input type="password" v-model="Form.password"
                      placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="btnDisabled"
                   @click="login">登 录</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { login } from '../api/api.js';
import utils from '../lib/utils.js';
export default {
  props:{
    odialogVisible: Boolean
  },
  data() {
    return {
      Form:{
        phone:'',
        password:'',
      },
      dialogVisible: false,
      btnDisabled: true,
      rules:{
        phone:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 11, message: '请输入正确的手机号', trigger: 'blur' },
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码最少是6位', trigger: 'blur' },
        ],
      }
    };
  },
  created() {},
  mounted() {
    //window.addEventListener('keyup', this.keyLogin);
  },
  watch: {
    odialogVisible(val){
      this.dialogVisible = val;
    },
    dialogVisible(val){
      this.$emit('showLogin', val);
    },
    Form:{
      handler(){
        if(this.Form.phone.length>=11&&this.Form.password.length>=6){
          this.btnDisabled = false;
        }else{
          this.btnDisabled = true;
        }
      },
      deep:true
    },
    'Form.password'(){}
  },
  methods: {
    keyLogin(){
      if (event.keyCode == 13) this.login();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('showLogin', false);
          done();
        })
        .catch(_ => {});
    },
    login(){
      let that = this;
      let data = {
        phone: this.Form.phone,
        password: this.Form.password
      }
      login(data).then(res=>{
        if(res.code == 0){
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key)) {
              utils.setLocalStorage(key,res.data[key])
            }
          }
          that.$message.success(res.msg);
          that.$store.commit('setUser', res.data)
          that.dialogVisible = false;
        }
      }).catch();
    }
  }
};
</script>
<style scoped>
h1 {
  margin-top: 0;
}
h1 small {
  font-size: 20px;
  font-weight: 300;
}
h1 small a {
  color: #409eff;
}
.form {
  margin-top: 20px;
  text-align: left;
  font-size: 18px;
}
.form .row {
  margin-bottom: 20px;
}
</style>