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
          <el-input-number size="mini" v-model="goodsNum" :min="1" :max="1" label="描述文字"></el-input-number>
        </div>
        <div v-if="!mineGoods && goods.status == 0" class="btn_container text-left">
          <el-button @click="buyNow" size="medium" type="danger">立即购买</el-button>
          <el-button @click="addShop" size="medium" type="warning">加入购物车</el-button>
          <p v-if="hadShop">您的购物车中已存在该商品。</p>
        </div>
        <div v-if="goods.status == -1" class="btn_container">已下架</div>
        <div v-if="goods.status == 1" class="btn_container">已售空</div>
        <div class="discribe text-left">
          <p class="discribe_title">描述：</p>
          <p class="discribe_content">{{goods.describe}}</p>
        </div>
      </div>
    </div>
    <el-row class="add_comment_container" v-if="isLogin">
      <div class="add_comment_inner_container">
        <div style="position: relative;">
          <div @blur="commentBlur" @focus="commentFocus" @input="comment_change" contenteditable="true" tabindex="0" class="add_comment"></div>
          <div v-if="comment.length < 1" class="placeholder">写下你的评论...</div>
        </div>
        <div @click="createComment" class="submit_comment">
          提交
        </div>
      </div>
    </el-row>
    <el-row>
      <span v-if="!showComment" @click="getCommentBtn" class="comment_btn pointer">获取评论</span>
      <span v-if="showComment && commentList.length == 0" class="comment_empty pointer">暂无评论</span>
    </el-row>
    <div v-if="showComment && commentList.length > 0" class="comment_container">
      <el-row class="comment_title">
        <span>{{commentList.length}}条评论</span>
      </el-row>
      <el-row class="comment_list_container">
        <div v-for="(item, index) in commentList" :key="item.id" class="comment_item_container">
          <el-row :gutter="20" class="comment_item_title">
            <el-col :span="1">
              <img class="comment_avatar pointer" :src="item.avatar">
            </el-col>
            <el-col :offset="0" :span="3" class="comment_item_name pointer">{{item.nick_name}}</el-col>
            <el-col class="comment_item_time text_right" :offset="14" :span="6">{{item.id | dateFormatter}}</el-col>
          </el-row>
          <el-row>
            <el-col class="text_left comment_item_content" :offset="1" :span="23">
              {{item.content}}
            </el-col>
            <el-col ref="huifuBtn" :span="23" :offset="1" class="text_right comment_huifu_btn">
              <span @click="clickSuphuifu($event, index)">回复</span>
            </el-col>
            <el-col ref="suphuifu" :span="23" class="huifu_container hide" :offset="1">
              <input ref="suphuifuContent" type="text" placeholder="请输入评论。。。" class="huifu_container_inner">
              <div class="text_right">
                <span class="suphuifuSubmit" @click="suphuifuSubmit($event, index, item.id)">回复</span>
              </div>
            </el-col>
            <el-col v-if="item.childComment" class="text_left subcomment_container" :offset="1" :span="23">
              <div v-for="(item2, index2) in item.childComment" :key="index2" class="subcomment_item_container">
                <el-row>
                  <el-col :span="1">
                    <img class="subcomment_avatar pointer" :src="item2.avatar">
                  </el-col>
                  <el-col :span="6">
                    <span class="pointer comment_item_name">{{item2.nick_name}}</span>
                    <span style="margin: 0 5px;color: #027fff;">回复</span>
                    <span class="pointer comment_item_name">{{item2.parent ? item2.parent.nick_name : item.nick_name}}</span>
                  </el-col>
                  <el-col :offset="11" :span="6" class="comment_item_time text_right">{{item2.id | dateFormatter}}</el-col>
                </el-row>
                <el-row>
                  <el-col class="text_left subcomment_item_content" :offset="1" :span="23">
                    {{item2.content}}
                  </el-col>
                  <el-col ref="subhuifuBtn" :span="23" :offset="1" class="text_right subcomment_huifu_btn">
                    <span @click="clickSubhuifu($event, index2)">回复</span>
                  </el-col>
                  <el-col ref="subhuifu" :span="23" class="huifu_container hide" :offset="1">
                    <input ref="subhuifuContent" type="text" placeholder="请输入评论。。。" class="huifu_container_inner">
                    <div class="text_right">
                      <span class="suphuifuSubmit" @click="subhuifuSubmit($event, index2, item2.id)">回复</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-row>
    </div>
    <!-- <div>当前商品{{JSON.stringify(goods)}}</div> -->
  </div>
</template>
<script>
import * as $ from "jquery";
import goTop from "../components/goTop.vue";
import {
  getComment0,
  createComment,
  shopHadGoods,
  addShop,
  getOneGoods,
  collect,
  judgeCollect,
  getUserByPhone,
  replay0,
  getComment
} from "../api/api.js";
export default {
  data() {
    return {
      goodsId: "",
      goods: {},
      goodsUser: {},
      collectText: "收藏",
      goodsNum: 1,
      hadShop: 0,
      showComment: false,
      comment: "",
      atComment: false,
      focus: false,
      commentList: []
    };
  },
  created() {
    this.goodsId = this.$route.query.id;
    window.addEventListener("visibilitychange", this.visibilitychange);
    this.getGoods(this.goodsId);
  },
  methods: {
    subhuifuSubmit(e, index, id){
      let content = this.$refs['subhuifuContent'][index].value, that = this;
      if(content.length == 0) return this.$message.warning('回复不能为空');
      replay0({
        content: content,
        goodsId: this.goodsId,
        userPhone: this.$store.state.user.phone,
        parentCommentId: id,
      }).then(res => {
        that.$refs['subhuifu'][index].$el.classList.add('hide');
        that.$refs['subhuifuBtn'][index].$el.classList.remove('hide');
        that.getCommentAll();
      });
    },
    clickSubhuifu(e, index){
      this.$refs['subhuifu'].forEach(item => {
        item.$el.classList.add('hide');
      });
      this.$refs['subhuifuBtn'].forEach(item => {
        item.$el.classList.remove('hide');
      });
      this.$refs['subhuifu'][index].$el.classList.remove('hide');
      this.$refs['subhuifuBtn'][index].$el.classList.add('hide');
    },
    getCommentAll(){
      let that = this;
      getComment({
        userPhone: this.$store.state.user.phone,
        goodsId: this.goodsId
      }).then(res => {
        that.commentList = res.data;
        that.showComment = true;
      });
    },
    suphuifuSubmit(e, index, id){
      let content = this.$refs['suphuifuContent'][index].value, that = this;
      if(content.length == 0) return this.$message.warning('回复不能为空');
      replay0({
        content: content,
        goodsId: this.goodsId,
        userPhone: this.$store.state.user.phone,
        parentCommentId: id,
      }).then(res => {
        that.$refs['suphuifu'][index].$el.classList.add('hide');
        that.$refs['huifuBtn'][index].$el.classList.remove('hide');
        that.$refs['suphuifuContent'][index].value = '';
        that.getCommentAll();
      });
    },
    clickSuphuifu(e, index){
      this.$refs['suphuifu'].forEach(item => {
        item.$el.classList.add('hide');
      });
      this.$refs['huifuBtn'].forEach(item => {
        item.$el.classList.remove('hide');
      });
      this.$refs['suphuifu'][index].$el.classList.remove('hide');
      this.$refs['huifuBtn'][index].$el.classList.add('hide');
    },
    createComment() {
      let that = this;
      if (!this.comment) return this.$message.warning("请先输入评论");
      createComment({
        content: this.comment,
        goodsId: this.goodsId,
        userPhone: this.$store.state.user.phone,
        supComment: ""
      }).then(res => {
        that,comment = '';
        that.getComment();
      });
    },
    visibilitychange() {
      if (document.visibilityState != "visible") $(".add_comment").blur();
    },
    commentFocus(e) {
      $(".add_comment").animate({ width: "-=100px" }, 100);
      $(".submit_comment").addClass("active");
    },
    commentBlur() {
      $(".add_comment").animate({ width: "100%" }, 100);
      $(".submit_comment").removeClass("active");
    },
    comment_change(e) {
      this.comment = e.target.textContent;
    },
    getCommentBtn() {
      this.showComment = true;
      this.getCommentAll();
    },
    getComment() {
      let that = this;
      getComment0({
        userPhone: this.$store.state.user.phone,
        goodsId: this.goods.id
      }).then(res => {
        that.commentList = res.data;
        that.showComment = true;
      });
    },
    buyNow() {
      let that = this;
      addShop({
        userPhone: this.$store.state.user.phone,
        id: this.goods.id,
        count: 1
      }).then(res => {
        if (res.code == 0) that.hadShop = res.data.had;
        that.$router.push("/settlement");
      });
    },
    shopHadGoods() {
      let that = this;
      shopHadGoods({
        userPhone: this.$store.state.user.phone,
        id: this.goods.id
      }).then(res => {
        if (res.code != 0) return that.$message.error(res.msg);
        that.hadShop = res.data.had;
      });
    },
    addShop() {
      let that = this;
      addShop({
        userPhone: this.$store.state.user.phone,
        id: this.goods.id,
        count: this.goodsNum
      }).then(res => {
        that.$message(res.msg);
        if (res.code == 0) that.hadShop = res.data.had;
      });
    },
    getGoods(id) {
      let that = this;
      getOneGoods({
        id: id || that.goods.id
      }).then(res => {
        if (res.code != 0) return that.$message.error(res.msg);
        that.goods = res.data;
        if (that.isLogin) {
          that.judgeCollect();
          that.shopHadGoods();
        }
        getUserByPhone({ userPhone: that.goods.phone }).then(res => {
          if (res.code != 0) return that.$message.error(res.msg);
          that.goodsUser = res.data;
        });
      });
    },
    judgeCollect() {
      let that = this;
      judgeCollect({
        userPhone: this.$store.state.user.phone,
        id: this.goods.id
      }).then(res => {
        if (res.code != 0) return that.$message.error(res.msg);
        if (res.data.collect == 1) that.collectText = "取消收藏";
      });
    },
    collect(e, id) {
      if (!this.isLogin) return this.$emit("showLogin", true);
      let that = this;
      let target = e.currentTarget || e.target;
      collect({ userPhone: this.$store.state.user.phone, id }).then(res => {
        if (res.code == 0) that.$message.success(res.msg);
        target.innerText = target.innerText == "收藏" ? "取消收藏" : "收藏";
      });
    }
  },
  beforeRouteLeave() {
    window.removeEventListener("visibilitychange", this.visibilitychange);
  },
  components: { goTop },
  computed: {
    mineGoods() {
      return this.$store.state.user.phone == this.goods.phone;
    }
  }
};
</script>
<style scoped>
.suphuifuSubmit{
  display: inline-block;
  height: 30px;
  width: 60px;
  border-radius: 4px;
  background-color: #027fff;
  color: #fff;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
.huifu_container_inner{
  margin-bottom: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 35px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  line-height: 35px;
  text-align: left;
  padding-left: 10px;
}
.huifu_container{
  margin-bottom: 10px;
  padding: 10px;
  background-color: whitesmoke;
}
.comment_huifu_btn,
.subcomment_huifu_btn{
  font-size: 14px;
  color: #aaa;
  cursor: pointer;
  margin-bottom: 10px;
}
.main {
  padding-bottom: 80px;
}
.subcomment_container {
  margin-bottom: 10px;
  padding: 10px;
  background-color: whitesmoke;
}
.subcomment_avatar {
  border: 1px solid #8590a6;
  border-radius: 4px;
  width: 25px;
  height: 25px;
}
.subcomment_item_content {
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.comment_item_content {
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.comment_item_time {
  color: #8590a6;
  font-size: 12px;
}
.comment_item_name {
  text-align: left;
  color: #666;
  font-size: 14px;
}
.comment_item_title {
  margin-bottom: 10px;
}
.comment_list_container {
  padding: 20px 10px;
}
.comment_avatar {
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 40px;
  height: 40px;
}
.comment_container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  width: 80%;
  margin: 0 auto;
  color: #1a1a1a;
}
.comment_title {
  font-weight: bold;
  font-size: 16px;
  color: #1a1a1a;
  text-align: left;
}
.submit_comment {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -18px;
  line-height: 36px;
  padding: 0 16px;
  background-color: rgba(0, 0, 0, 0.9);
  color: #fff;
  border-radius: 3px;
  transform: scale(0);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}
.submit_comment:hover {
  background-color: #000;
}
.submit_comment.active {
  transform: scale(1);
}
.placeholder {
  position: absolute;
  pointer-events: none;
  color: #8590a6;
  white-space: pre-wrap;
  top: 8px;
  left: 14px;
}
.add_comment_container {
  padding: 12px 20px;
  box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
  margin: 30px auto;
  width: 80%;
  background-color: #fff;
}
.add_comment_inner_container {
  position: relative;
  min-width: 198px;
}
.add_comment {
  position: relative;
  box-sizing: border-box;
  outline: none;
  cursor: text;
  border-radius: 3px;
  border: 1px solid #ebebeb;
  transition: all 0.1s ease-in-out;
  font-size: 15px;
  line-height: 1.6;
  text-align: left;
  padding: 6px 12px;
  background-color: #f6f6f6;
  width: 100%;
}
.add_comment:focus {
  background-color: #fff;
  border: 1px solid #8590a6;
}
.comment_empty {
  line-height: 2em;
  font-size: 32px;
  color: #989898;
}
.main {
  background-color: whitesmoke;
}
.content_container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  background-color: #fff;
  font-size: 0;
  width: 80%;
  margin: 10px auto;
  border: 1px solid #ddd;
  transition: border 0.2s ease;
  overflow: hidden;
}
.userInfo_container {
  box-sizing: border-box;
  padding: 10px;
  width: 80%;
  margin: 10px auto 0;
  display: inline-block;
}
.userInfo {
  float: left;
}
.nick_name {
  position: relative;
  left: 10px;
  bottom: 10px;
  font-size: 26px;
}
.left,
.right {
  padding: 20px;
  box-sizing: border-box;
  display: inline-block;
  width: 50%;
}
.left {
  float: left;
}
.right {
  float: right;
}
.cover {
  border: 1px solid #ccc;
  margin: 0 auto;
  width: 500px;
  height: 333px;
}
.collect_container {
  text-align: left;
  box-sizing: border-box;
  padding: 20px;
  height: 80px;
  width: 100%;
  background-color: #e5f4f7;
  margin-top: 15px;
}
.right {
  padding: 20px 20px 20px 50px;
}
.right .name {
  font-size: 24px;
}
.right .price,
.right .pack_info,
.right .btn_container,
.right .num,
.right .discribe {
  margin-top: 20px;
  font-size: 20px;
}
.right .pack_info {
  color: #ff783e;
  font-size: 16px;
}
.right .num {
  font-size: 14px;
}
.right .btn_container {
  margin-top: 50px;
}
.right .btn_container p {
  font-size: 14px;
  color: #999;
}
.discribe {
  color: #888888;
}
.discribe_title {
  margin: 30px 0 10px;
  font-size: 16px;
}
.discribe_content {
  font-size: 15px;
}
.comment_btn {
  display: inline-block;
  padding: 20px 0;
  color: #f60;
  font-size: 20px;
  font-weight: bold;
}
</style>