<template>
  <div class="main">
    <el-tabs tab-position="left" style="">
      <el-tab-pane label="个人信息">
        <el-row class="avatar" v-line_mid>
          <el-col :span="2"><span>头像</span></el-col>
          <el-col :span="2">
            <img :src="user.avatar" height="50px">
          </el-col>
          <el-col :span="4">
            <el-upload
              :show-file-list="false"
              name="avatar"
              class="upload-demo"
              :data="uploadData"
              :on-success="avatar_upload_success"
              :action='baseUrl + "user/avatar"'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-col>
        </el-row>
        <el-row v-line_mid>
          <el-col :span="2"><span>手机号</span></el-col>
          <el-col :span="10">
            <el-input v-model="user.phone"></el-input>
          </el-col>
        </el-row>
        <el-row v-line_mid>
          <el-col :span="2"><span>昵称</span></el-col>
          <el-col :span="10">
            <el-input v-model="user.nick_name"></el-input>
          </el-col>
        </el-row>
        <el-row class="text_left">
          <el-button @click="showEdit">编辑</el-button>
          <el-button @click="showEdit">修改密码</el-button>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="我的商品">
        <el-row class="text_left">
          <el-button plain type='primary' @click="$router.push('/upload')">添加作品</el-button>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="编辑信息"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form label-width="80px" :model="userForm">
        <el-form-item label="昵称">
          <el-input v-model="userForm.formName"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userForm.formPhone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { baseUrl } from "../lib/config.js";
import utils from '../lib/utils.js';
import { editPersonalInfo } from "../api/api.js";
export default {
  data() {
    return {
      //user:{},
      uploadData:{
        token: utils.getLocalStorage('token'),
        phone: utils.getLocalStorage('phone')
      },
      baseUrl: baseUrl,
      dialogVisible: false,
      userForm: {}
    };
  },
  methods: {
    avatar_upload_success(res){
      if(res.code == 0){
        this.$store.commit('setUser', Object.assign(this.user, {
          avatar: res.data.path
        }))
      }
    },
    showEdit(){
      this.dialogVisible = true;
      this.userForm.formName = this.user.nick_name;
      this.userForm.formPhone = this.user.phone;
    },
    commitEdit(){
      editPersonalInfo({
        nick_name: this.userForm.formName,
        phone: this.userForm.formPhone
      }).then(res => {
        if(res.code == 0){
          this.user = res.data;
          this.$store.commit('setUser', res.data)
          this.dialogVisible = false
        }
      })
    }
  },
  created(){
    
  },
  computed: {
    user(){
      return this.$store.state.user;
    }
  }
};
</script>
<style scoped>
.main{
  width: 80%;
  margin: 50px auto 0;
}
.avatar{
  height: 50px;
}
#pane-0, #pane-1{
  padding: 30px;
}
.el-row{
  margin-bottom: 30px;
}
.el-col{
  text-align: left;
}
</style>