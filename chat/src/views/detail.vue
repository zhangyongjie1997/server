<template>
  <div class="main">
    <go-top></go-top>
    <el-row style="font-size:0;">
      <img src="../assets/benner.jpg" width="100%">
    </el-row>
    <div class="userInfo_container">
      <div class="userInfo">
        <img :src="goodsUser.avatar" class="avatar" width="70px" height="70px">
        <span class="nick_name">{{goodsUser.nick_name}}</span>
      </div>
    <el-button class="fr" @click="$router.go(-1)">返回</el-button>
    </div>
    <div class="content_container">
      <div class="left">
        <div class="cover">
          <img :src="goods.cover" height="100%" width="100%">
        </div>
        <el-row class="collect_container">
          <el-col :span="6">
            <el-button plain @click="collect($event, goods.id)">{{collectText}}</el-button>
          </el-col>
          <el-col :span="14" style="height:100%;margin-left:30px;">
            <p style="font-size:16px;color:#000;">喜欢这件商品吗？</p>
            <p style="font-size:14px;color:#aaa;">喜欢就将它添加到您的收藏夹吧！</p>
          </el-col>
        </el-row>
      </div>
      <div class="right">
        <p class="name text-left">{{goods.name}}</p>
        <p class="price text-left">￥{{goods.price}}</p>
        <p class="pack_info text-left">今天下单于2019-04-04日前发货</p>
        <div class="num text-left">
          数量：
          <el-input-number size="mini" v-model="goodsNum" :min="1" :max="3" label="描述文字"></el-input-number>
        </div>
        <div class="btn_container text-left">
          <el-button size="medium" type="danger">立即购买</el-button>
          <el-button @click="addShop" size="medium" type="warning">加入购物车</el-button>
        </div>
        <div class="discribe text-left">
          <p class="discribe_title">描述：</p>
          <p class="discribe_content">{{goods.describe}}</p>
        </div>
      </div>
    </div>
    <el-row>
      <span class="comment_btn pointer">获取评论</span>
    </el-row>
    <div>当前商品{{JSON.stringify(goods)}}</div>
  </div>
</template>
<script>
import goTop from '../components/goTop.vue';
import { addShop, getOneGoods, collect, judgeCollect, getUserByPhone } from '../api/api.js'
export default {
  data() {
    return {
      goods:{},
      goodsUser: {},
      collectText: '收藏',
      goodsNum: 1
    };
  },
  created(){
    let id = this.$route.query.id;
    this.getGoods(id);
  },
  mounted(){},
  components: {goTop},
  methods:{
    addShop(){
      addShop({userPhone: this.$store.state.user.phone, id: this.goods.id})
        .then(res => {
          
        });
    },
    getGoods(id){
      let that = this;
      getOneGoods({
        id: id || that.goods.id
      }).then(res => {
        if(res.code != 0) return that.$message.error(res.msg);
        that.goods = res.data;
        if(this.isLogin) that.judgeCollect();
        getUserByPhone({userPhone: that.goods.phone})
          .then(res => {
            if(res.code != 0) return that.$message.error(res.msg);
            that.goodsUser = res.data;
          });
      });
    },
    judgeCollect(){
      let that = this;
      judgeCollect({userPhone: this.$store.state.user.phone, id: this.goods.id})
        .then(res => {
          if(res.code != 0) return that.$message.error(res.msg);
          if(res.data.collect == 1) that.collectText = "取消收藏";
        });
    },
    collect(e, id){
      if(!this.isLogin) return this.$emit('showLogin', true);
      let that = this;
      let target = e.currentTarget || e.target;
      collect({userPhone: this.$store.state.user.phone, id}).then(res => {
        if(res.code == 0) that.$message.success(res.msg);
        target.innerText = target.innerText == "收藏" ? "取消收藏" : "收藏";
      });
    }
  }
};
</script>
<style scoped>
.main{
  background-color: whitesmoke;
}
.content_container{
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border: 1px solid #ebeef5;
  background-color: #fff;
  font-size: 0;
  width: 80%;
  margin: 10px auto;
  border: 1px solid #ddd;
  transition: border .2s ease;
  overflow: hidden;
}
.userInfo_container{
  box-sizing: border-box;
  padding: 10px;
  width: 80%;
  margin: 10px auto 0;
  display: inline-block;
}
.userInfo{
  float: left;
}
.nick_name{
  position: relative;
  left: 10px;
  bottom: 10px;
  font-size: 26px;
}
.left, .right{
  padding: 20px;
  box-sizing: border-box;
  display: inline-block;
  width: 50%;
}
.left{
  float: left;
}
.right{
  float: right;
}
.cover{
  border: 1px solid #ccc;
  margin: 0 auto;
  width: 500px;
  height: 333px;
}
.collect_container{
  text-align: left;
  box-sizing: border-box;
  padding: 20px;
  height: 80px;
  width: 100%;
  background-color: #e5f4f7;
  margin-top: 15px;
}
.right{
  padding: 20px 20px 20px 50px;
}
.right .name{
  font-size: 24px;
}
.right .price,
.right .pack_info,
.right .btn_container,
.right .num,
.right .discribe{
  margin-top: 20px;
  font-size: 20px;
}
.right .pack_info{
  color: #ff783e;
  font-size: 16px;
}
.right .num{
  font-size: 14px;
}
.right .btn_container{
  margin-top: 50px;
}
.discribe{
  color: #888888;
}
.discribe_title{
  margin: 30px 0 10px;
  font-size: 16px;
}
.discribe_content{
  font-size: 15px;
}
.comment_btn{
  display: inline-block;
  padding: 20px 0;
  color: #f60;
  font-size: 20px;
  font-weight: bold;
}
</style>