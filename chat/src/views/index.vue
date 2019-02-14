<template>
  <div class="main">
    <el-row>
      <el-col :span="24">
        <el-carousel height="352px" indicator-position="none">
          <el-carousel-item
            v-for="item in indexImg"
            :key="item"
          >
            <img :src="'http://' + item" width="100%">
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    <el-row style="border-bottom:1px solid #ddd;">
      <el-col :span="24">
        <span class="hot active" ref='hot' data-hot="hot" @click="hotClick">热门</span>
        <span class="hot" ref='new' data-hot="new" @click="hotClick">最新</span>
      </el-col>
    </el-row>
    <el-row class="list_container" v-loading="loading">
      <div class="list_item" v-for="(item, index) in goods" :key="index">
        <div class="item_img">
          <a href="javascript:void(0);">
            <img :src="item.cover" height="185px">
          </a>
        </div>
        <div class="item_info">
          <el-row>
            <el-col :span="16" class="text_left info_name">{{item.name}}</el-col>
            <el-col :span="8" class="text_right pointer"><i :data-id="item.id" @click="collect" class="iconfont icon-shoucang1 collect" :class="{'active':item.collected}"></i></el-col>
          </el-row>
          <el-row class="text_left">
            <el-col class="text_lefr" :span="4">￥{{item.price ? item.price : '未指定价格'}}</el-col>
            <el-col class="text_right" :span="20">累积收藏{{item.collectCount}}次</el-col>
          </el-row>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
import {getIndexImg, getIndexGoods, collect} from '../api/api.js';
export default {
  data() {
    return {
      indexImg:[],
      hot:'hot',
      goods:[],
      loading: false
    };
  },
  created(){
    getIndexImg().then(res=>{
      this.indexImg = res.data;
    });
    this.getHot('hot');
  },
  methods:{
    hotClick(e){
      let hot = e.currentTarget ? e.currentTarget.dataset.hot : e.target.dataset.hot;
      if(hot == this.hot) return;
      this.hot = hot;
      this.$refs.new.classList.toggle('active');
      this.$refs.hot.classList.toggle('active');
      this.getHot(hot);
    },
    getHot(sort){
      this.loading = true;
      getIndexGoods({sort}).then(res => {
        if(res.code == 0){
          this.goods = res.data;
          this.loading = false;
        }
      });
    },
    collect(e){
      let target = e.currentTarget || e.target;
      let id = target.dataset.id;
      collect({phone: this.$store.state.user.phone, id}).then(res => {
        //this.getHot('hot');
        if(res.code == 0) this.$message.success(res.msg);
        target.classList.toggle('active');
      })
    }
  }
};
</script>
<style scoped>
.hot{
  cursor: pointer;
  margin: 30px 0 40px;
  display: inline-block;
  width: 120px;
  height: 35px;
  line-height: 35px;
}
.hot.active{
  border: 1px solid #000;
}
.list_container{
  padding: 40px 80px 55px 40px;
}
.list_item{
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