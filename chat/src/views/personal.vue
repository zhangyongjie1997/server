<template>
  <div class="main">
    <el-tabs :value="activeTab" tab-position="left" style="" @tab-click="tabClick">
      <el-tab-pane name="info" label="个人信息">
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
            <el-input readonly v-model="user.phone"></el-input>
          </el-col>
        </el-row>
        <el-row v-line_mid>
          <el-col :span="2"><span>昵称</span></el-col>
          <el-col :span="10">
            <el-input readonly v-model="user.nick_name"></el-input>
          </el-col>
        </el-row>
        <el-row class="text_left">
          <el-button @click="showEdit">编辑</el-button>
          <el-button @click="showEdit">修改密码</el-button>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="goods" label="我的商品">
        <div class="pane_goods">
          <el-row class="text_left">
            <el-button plain type='primary' @click="$router.push('/upload')">添加作品</el-button>
          </el-row>
          <el-row class="goods_container">
            <p v-if="goodsList.length == 0" style="font-size:26px;color:#ccc;">您还没有发布过商品 . . .</p>
            <el-row v-line_mid class="collect-item pointer" v-for="(item, index) in goodsList" :key="index">
              <el-col v-if="goodsList.length > 0" :span="12">
                <router-link class="collect-link" tag="a" :to="'/detail/' + item.id">{{item.name}}</router-link>
              </el-col>
              <el-col :span="4">价格：￥{{item.price}}</el-col>
              <el-col :span="2">分类：{{classFilter(item.class)}}</el-col>
              <el-col class="text-right" :span="6">发布时间：{{item.time}}</el-col>
            </el-row>
          <div class="block pagination_container">
            <el-pagination
              @size-change="handleSizeChange($event, 'goods')"
              @current-change="handleCurrentChange($event, 'goods')"
              :current-page="1"
              :page-sizes="[5, 10]"
              :page-size="5"
              layout="total, sizes, prev, pager, next, jumper"
              :total="goodsCount">
            </el-pagination>
          </div>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane name="collect" label="我的收藏">
        <el-row>
          <el-card class="collect-container">
            <el-row v-line_mid class="collect-item pointer" v-for="(item, index) in collectList" :key="index">
              <el-col :span="14">
                <router-link class="collect-link" tag="a" :to="'/detail/' + item.id">{{item.name}}</router-link>
              </el-col>
              <el-col :span="4">价格：￥{{item.price}}</el-col>
              <el-col class="text-right" :span="6">收藏时间：{{item.collectTime}}</el-col>
            </el-row>
          </el-card>
          <div class="block pagination_container">
            <el-pagination
              @size-change="handleSizeChange($event, 'collect')"
              @current-change="handleCurrentChange($event, 'collect')"
              :current-page="1"
              :page-sizes="[5, 10]"
              :page-size="5"
              layout="total, sizes, prev, pager, next, jumper"
              :total="collectCount">
            </el-pagination>
          </div>
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
</template>;
<script>
import { baseUrl } from "../lib/config.js";
import utils from '../lib/utils.js';
import { editPersonalInfo, getCollect, getPersonalGoods, getGoodsClass } from "../api/api.js";
export default {
  data() {
    return {
      activeTab: 'info',
      //user:{},
      uploadData:{
        token: utils.getLocalStorage('token'),
        phone: utils.getLocalStorage('phone')
      },
      baseUrl: baseUrl,
      dialogVisible: false,
      userForm: {},
      collectCount: 0,
      collectList: [],
      goodsCount: 0,
      goodsList: [],
      collectPageSize: 5,
      goodsPageSize: 5,
      currentCollectPage: 0,
      currentGoodsPage: 0,
      goodsClass: []
    };
  },
  created(){
    if(this.$route.query && this.$route.query.tab){
      this.getPersonalGoods();
      this.activeTab = this.$route.query.tab;
    }
    this.getGoodsClass();
  },
  methods: {
    classFilter(value){
      let result;
      this.goodsClass.some((item) => {
        if(item.id == value){
          result = item.name;
          return true;
        }
        return false;
      });
      return result;
    },
    getGoodsClass(){
      let that = this;
      getGoodsClass().then(res => {
        if(res.code == 0){
          that.goodsClass = res.data;
        }
      });
    },
    handleSizeChange(size, type){
      switch(type){
        case 'collect':
          this.collectPageSize = size;
          this.getCollect();
          break;
        case 'goods':
          this.goodsPageSize = size;
          this.getPersonalGoods();
          break;
      }
    },
    handleCurrentChange(current, type){
      switch(type){
        case 'collect':
          this.currentCollectPage = current - 1;
          this.getCollect();
          break;
        case 'goods':
          this.currentGoodsPage = current - 1;
          this.getPersonalGoods();
          break;
      }
    },
    tabClick(e){
      let that = this;
      switch(e.index){
        case '2':
          that.getCollect();
          break;
        case '1':
          that.getPersonalGoods();
          break;
      }
    },
    getCollect(){
      let that = this;
      getCollect({
        phone: this.$store.getters.get('user[phone]'),
        pageSize: that.collectPageSize,
        currentPage: that.currentCollectPage,
      }).then(res => {
        if(res.code != 0){
          that.$message.error(res.msg);
        }else{
          that.collectCount = res.data.count;
          that.collectList = res.data.data;
        }
      });
    },
    getPersonalGoods(){
      let that = this;
      getPersonalGoods({
        phone: this.$store.getters.get('user[phone]'),
        pageSize: that.goodsPageSize,
        currentPage: that.currentGoodsPage,
      }).then(res => {
        if(res.code != 0){
          that.$message.error(res.msg);
        }else{
          that.goodsList = res.data.data;
          that.goodsCount = res.data.count;
        }
      });
    },
    avatar_upload_success(res){
      if(res.code == 0){
        this.$store.commit('setUser', Object.assign(this.user, {
          avatar: res.data.path
        }));
        this.$message.success(res.msg);
      }
    },
    showEdit(){
      this.dialogVisible = true;
      this.userForm.formName = this.user.nick_name;
      this.userForm.formPhone = this.user.phone;
    },
    commitEdit(){
      let that = this;
      editPersonalInfo({
        nick_name: this.userForm.formName,
        phone: this.userForm.formPhone
      }).then(res => {
        if(res.code == 0){
          that.user = res.data;
          that.$store.commit('setUser', res.data)
          that.dialogVisible = false
        }
      })
    }
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
.collect-container{
  height: auto;
}
.collect-item{
  height: 50px;
  margin-bottom: 10px;
  padding: 0 10px;
  font-size: 12px;
  border: 1px solid #ccc;
}
.collect-link:hover{
  color: #409EFF;
}
.pane_goods{
  padding: 30px;
}
.goods_container{
  height: auto;
}
.pagination_container{
  margin-top: 10px;
}
</style>