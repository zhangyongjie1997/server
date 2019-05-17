<template>
  <div class="main">
    <el-row class="user_container">
      <el-row>
        <el-button class="fr back_btn" @click="$router.go(-1)">返回</el-button>
      </el-row>
      <el-row>
        <img class="avatar" :src="baseUrl + user.avatar" alt="">
      </el-row>
      <el-row class="user_name">
        <span>{{user.nick_name}}</span>
      </el-row>
      <el-row class="goods_count">{{goodsCount}}件作品</el-row>
      <el-row class="position"><i class="iconfont icon-location"></i> 中国</el-row>
    </el-row>
    <el-row class="recommend">
      <h2 class="text_left">推荐 / RECOMMEND</h2>
    </el-row>
    <el-row class="recommend" style="border:none;">
      <el-carousel indicator-position="none" :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="(item, index) in recommend" :key="index">
            <router-link tag="img" :to="'/detail?id=' + item.id" class="medium" :src="baseUrl + item.cover" height="100%"/>
        </el-carousel-item>
      </el-carousel>
    </el-row>
    <el-row class="recommend">
      <h2 class="text_left">原创销售作品</h2>
    </el-row>
    <el-row class="goodsList recommend list_container" style="border:none;">
      <router-link tag="div" :to="'/detail?id=' + item.id" class="list_item" v-for="(item, index) in goodsList" :key="index">
        <div class="item_img">
          <a href="javascript:void(0);">
            <img :src="baseUrl + item.cover" height="185px">
          </a>
        </div>
        <div class="item_info">
          <el-row>
            <el-col :span="16" class="text_left info_name">{{item.name}}</el-col>
            <el-col :span="8" class="text_right pointer"><i :data-id="item.id" @click="collect($event, item.id)" class="iconfont icon-shoucang1 collect" :class="{'active':item.collected}"></i></el-col>
          </el-row>
          <el-row class="text_left">
            <el-col class="text_lefr" :span="4">￥{{item.price ? item.price : '未指定价格'}}</el-col>
          </el-row>
        </div>
      </router-link>
    </el-row>
  </div>
</template>
<script>
import { getUserByPhone, getPersonalGoods, collect } from '../api/api.js';
export default {
  data() {
    return {
      user: {},
      goodsPageSize: 10,
      currentGoodsPage: 0,
      goodsList: [],
      goodsCount: 0,
      recommend: []
    };
  },
  created() {
    this.user.phone = this.$route.query.user;
    this.getUser();
    this.getPersonalGoods();
  },
  methods: {
    getUser(){
      let that = this;
      getUserByPhone({
        phoneNum: this.user.phone
      }).then(res => {
        if(res.code != 0) return that.$message.error(res.msg);
        this.user = res.data;
      });
    },
    getPersonalGoods(){
      let that = this;
      getPersonalGoods({
        phone: this.user.phone,
        pageSize: that.goodsPageSize,
        currentPage: that.currentGoodsPage,
      }).then(res => {
        if(res.code != 0){
          that.$message.error(res.msg);
        }else{
          that.goodsList = res.data.data;
          that.goodsCount = res.data.count;
          that.recommend = that.goodsList.slice(0, 4);
        }
      });
    },
    collect(e, id){
      if (!this.isLogin) return this.$emit("showLogin", true);
      let that = this;
      let target = e.currentTarget || e.target;
      // let id = target.dataset.id;
      collect({userPhone: this.$store.state.user.phone, id}).then(res => {
        //this.getHot('hot');
        if(res.code == 0) that.$message.success(res.msg);
        target.classList.toggle('active');
      });
    }
  }
};
</script>
<style scoped>
.main{
  padding-bottom: 130px;
}
.el-carousel__item .medium {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.user_container{
  margin-top: 40px;
}
.avatar{
  width: 106px;
  height: 106px;
  border-radius: 50%;
  overflow: hidden;
}
.user_name{
  margin-top: 10px;
  font-size: 20px;
  letter-spacing: 3px;
}
.goods_count{
  margin-top: 10px;
  font-size: 13px;
}
.position{
  margin-top: 10px;
  font-size: 13px;
}
.recommend{
  margin: 20px auto 0;
  width: 60%;
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.recommend h2{
  margin: 0;
  padding: 15px 0;
}
.back_btn{
  margin-right: 180px;
}
.list_item{
  position: relative;
  width: 240px;
  height: 260px;
  font-size: 0px;
  margin: 0 0 25px 25px;
  float: left;
  border: 1px solid #eee;
}
.item_img{
  overflow: hidden;
  font-size: 0;
}
.item_img img{
  transition: all .3s ease-out;
}
.item_img:hover img{
  transform: scale(1.1);
}
.item_info{
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  width: 100%;
  line-height: 2;
  font-size: 14px;
  padding: 10px;
}
.info_name{
  max-width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.collect.active{
  color: crimson;
}
</style>