<template>
  <div class="main">
    <go-top></go-top>
    <el-row style="font-size:0;">
      <img
        src="../assets/benner.jpg"
        width="100%"
      >
    </el-row>
    <div class="userInfo_container">
      <div class="userInfo">
        <img
          :src="goodsUser.avatar"
          class="avatar"
          width="70px"
          height="70px"
        >
        <span class="nick_name">{{goodsUser.nick_name}}</span>
      </div>
      <el-button
        class="fr"
        @click="$router.go(-1)"
      >返回</el-button>
    </div>
    <div class="content_container">
      <div class="left">
        <div class="cover">
          <img
            :src="goods.cover"
            height="100%"
            width="100%"
          >
        </div>
        <el-row class="collect_container">
          <el-col :span="6">
            <el-button
              plain
              @click="collect($event, goods.id)"
            >{{collectText}}</el-button>
          </el-col>
          <el-col
            :span="14"
            style="height:100%;margin-left:30px;"
          >
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
          <el-input-number
            size="mini"
            v-model="goodsNum"
            :min="1"
            :max="3"
            label="描述文字"
          ></el-input-number>
        </div>
        <div
          v-if="!mineGoods"
          class="btn_container text-left"
        >
          <el-button
            @click="buyNow"
            size="medium"
            type="danger"
          >立即购买</el-button>
          <el-button
            @click="addShop"
            size="medium"
            type="warning"
          >加入购物车</el-button>
          <p v-if="hadShop">您的购物车中已存在该商品。</p>
        </div>
        <div class="discribe text-left">
          <p class="discribe_title">描述：</p>
          <p class="discribe_content">{{goods.describe}}</p>
        </div>
      </div>
    </div>
    <el-row class="add_comment_container" v-if="isLogin">
      <div class="add_comment_inner_container">
        <div style="position: relative;">
          <div
            @blur="commentBlur"
            @focus="commentFocus"
            @input="comment_change"
            contenteditable="true"
            tabindex="0"
            class="add_comment"
          ></div>
          <div
            v-if="comment.length < 1"
            class="placeholder"
          >写下你的评论...</div>
        </div>
        <div
          @click="createComment"
          class="submit_comment"
        >
          提交
        </div>
      </div>
    </el-row>
    <el-row>
      <span
        v-if="!showComment"
        @click="getComment"
        class="comment_btn pointer"
      >获取评论</span>
      <span
        v-if="showComment && commentList.length == 0"
        class="comment_empty pointer"
      >暂无评论</span>
    </el-row>
    <div
      v-if="showComment"
      class="comment_container"
    >
      <el-row class="comment_title">
        <span>{{commentList.length}}条评论</span>
      </el-row>
      <el-row class="comment_list_container">
        <div v-for="item in commentList" :key="item" class="comment_item_container">
          <el-row
            :gutter="20"
            class="comment_item_title"
          >
            <el-col :span="1">
              <img
                class="comment_avatar pointer"
                :src="item.avatar"
              >
            </el-col>
            <el-col
              :offset="0"
              :span="3"
              class="comment_item_name pointer"
            >{{item.nick_name}}</el-col>
            <el-col
              class="comment_item_time text_right"
              :offset="14"
              :span="6"
            >{{item.time}}</el-col>
          </el-row>
          <el-row>
            <el-col
              class="text_left comment_item_content"
              :offset="1"
              :span="23"
            >
              {{item.nick_name}}: {{item.content}}
            </el-col>
            <el-col
              v-if="item.childComment"
              class="text_left subcomment_container"
              :offset="1"
              :span="23"
            >
              <div class="subcomment_item_container">
                <el-row>
                  <el-col :span="1">
                    <img
                      class="subcomment_avatar pointer"
                      :src="goodsUser.avatar"
                    >
                  </el-col>
                  <el-col :span="6">
                    <span class="pointer">xx</span>
                    <span style="margin: 0 5px;color: #666;">回复</span>
                    <span class="pointer">{{goodsUser.nick_name}}</span>
                  </el-col>
                  <el-col
                    :offset="11"
                    :span="6"
                    class="comment_item_time text_right"
                  >{{goods.time}}</el-col>
                </el-row>
                <el-row>
                  <el-col
                    class="text_left subcomment_item_content"
                    :offset="1"
                    :span="23"
                  >
                    南笙北执： 1.Tiktok（抖音国际版） 【软件介绍】：抖音短视频在国外叫做“Tik Tok” Tik Tok 是一款专注于音乐创意的影片App，更是年轻人交友的有趣社群 在这里每个人都可以拍出真正属于自
                  </el-col>
                </el-row>
              </div>
              <div class="subcomment_item_container">
                <el-row>
                  <el-col :span="1">
                    <img
                      class="subcomment_avatar pointer"
                      :src="goodsUser.avatar"
                    >
                  </el-col>
                  <el-col :span="6">
                    <span class="pointer">xx</span>
                    <span style="margin: 0 5px;color: #666;">回复</span>
                    <span class="pointer">{{goodsUser.nick_name}}</span>
                  </el-col>
                  <el-col
                    :offset="11"
                    :span="6"
                    class="comment_item_time text_right"
                  >{{goods.time}}</el-col>
                </el-row>
                <el-row>
                  <el-col
                    class="text_left subcomment_item_content"
                    :offset="1"
                    :span="23"
                  >
                    南笙北执： 1.Tiktok（抖音国际版） 【软件介绍】：抖音短视频在国外叫做“Tik Tok” Tik Tok 是一款专注于音乐创意的影片App，更是年轻人交友的有趣社群 在这里每个人都可以拍出真正属于自
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
  getUserByPhone
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
  beforeRouteLeave() {
    window.removeEventListener("visibilitychange", this.visibilitychange);
  },
  components: { goTop },
  computed: {
    mineGoods() {
      return this.$store.state.user.phone == this.goods.phone;
    }
  },
  methods: {
    createComment() {
      let that = this;
      if (!this.comment) return this.$message.warning("请先输入评论");
      createComment({
        content: this.comment,
        goodsId: this.goodsId,
        userPhone: this.$store.state.user.phone,
        supComment: ""
      }).then(res => {
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
    getComment() {
      this.showComment = true;
      this.getComment();
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
  }
};
</script>
<style scoped>
.main{
  padding-bottom: 80px;
}
.subcomment_container {
}
.subcomment_avatar {
  border: 1px solid #8590a6;
  border-radius: 4px;
  width: 25px;
  height: 25px;
}
.subcomment_item_content {
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.comment_item_content {
  border-bottom: 1px solid #8590a6;
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