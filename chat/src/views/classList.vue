<template>
  <div class="main">
    <goTop></goTop>
    <div class="topBar">
      <div class="classList text-left">
        <div ref="classTab0" @click="changeClass($event, '0')" v-line_mid class="classItem pointer active text-center">全部</div>
        <div ref="classTab" @click="changeClass($event, item.id)" v-line_mid class="classItem pointer text-center" v-for="item in goodsClasses" :key="item.id">
          {{item.name}}
        </div>
      </div>
      <div class="line"></div>
      <div class="classList text-left">
        <div ref="new" @click="changeSort($event, 'new')" v-line_mid class="classItem pointer active text-center">最新</div>
        <div ref="hot" @click="changeSort($event, 'hot')" v-line_mid class="classItem pointer text-center">最热</div>
      </div>
    </div>
    <div class="goods_container" v-loading="loading">
      <div ref="list" v-for="(item1, index) in lists" :key="index" class="item_long">
        <transition-group name="fade">
          <router-link tag="div" 
            :to="'/detail?id=' + item.id" class="goods_item pointer"
            v-for="(item, index) in item1" :key="index">
              <img :src="item.cover" width="100%">
              <div class="item_info">
                <p class="info_name">{{item.name}}</p>
                <div>
                  <div class="foot_info">
                    <div>￥{{item.price}}</div>
                    <div style="color: #f60;">{{item.collectCount}} 收藏</div>
                  </div>
                </div>
              </div>
            </router-link>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<script>
import goTop from '../components/goTop.vue';
import { pay, getGoodsClass, getClassList } from '../api/api.js';
// import $ from 'jquery';
export default {
  data() {
    return {
      goodsClasses: [],
      goodsList: [],
      currentClass: 0,
      currentSort: 'new',
      loading: false,
      pageSize: 10,
      currentPage: 0,
      lists: {
        list1: [],
        list2: [],
        list3: [],
        list4: [],
        list5: [],
      }
    };
  },
  components:{
    goTop
  },
  created(){
    let that = this;
    getGoodsClass().then(res => {
      if(res.code == 0){
        that.goodsClasses = res.data;
      }
      that.getClassList();
    });
  },
  methods: {
    changeClass(e, classId){
      if(classId == this.currentClass) return;
      this.currentClass = classId;
      this.$refs.classTab.forEach(element => {
        element.classList.remove('active');
      });
      this.$refs.classTab0.classList.remove('active');
      if(classId == 0){
        this.$refs.classTab0.classList.add('active');
      }else{
        this.$refs.classTab[classId - 1].classList.add('active');
      }
      this.getClassList();
    },
    changeSort(e, sort){
      if(this.currentSort == sort) return;
      this.currentSort = sort;
      if(sort == 'new'){
        this.$refs.hot.classList.remove('active');
        this.$refs.new.classList.add('active');
      }else{
        this.$refs.new.classList.remove('active');
        this.$refs.hot.classList.add('active');
      }
      this.getClassList();
    },
    getClassList(){
      this.loading = true;
      let that = this;
      getClassList({
        goodsClass: that.currentClass,
        sort: that.currentSort
      }).then(res => {
        this.loading = false;
        that.goodsList = res.data;
        that.waterFall();
      });
    },
    waterFall(){
      let that = this;
      this.$nextTick(() => {
        let minHeight = 99999, minIndex = 0;
        let slice = that.goodsList.slice(0, 5);
        let slice2 = that.goodsList.slice(5);
        Object.keys(that.lists).forEach(item => {
          that.lists[item] = [];
        });
        slice.forEach((item, index) => {
          that.lists['list' + (index + 1)].push(item);
        });
        that.$nextTick(() => {
          next();
        });
        function next(){
          if(slice2.length == 0) return;
          that.$nextTick(() => {
            minHeight = 99999, minIndex = 99999;
            that.$refs.list.forEach((item, idx) => {
              if(item.offsetHeight < minHeight) minHeight = item.offsetHeight, minIndex = idx + 1;
            });
            that.lists['list' + minIndex].push(slice2.shift());
            setTimeout(()=>{
              that.$nextTick(() => {
                next();
              });
            }, 300);
          });
        }
      });
    },
    pay(){
      pay({
        goodsList: [1]
      });
    }
  }
};
</script>
<style scoped>

.topBar {
  box-sizing: border-box;
  width: 80%;
  margin: 30px auto 30px;
}
.line{
  width: 100%;
  height: 2px;
  background-color: #000;
  margin: 10px 0;
}
.classItem{
  box-sizing: border-box;
  height: 30px;
  width: 60px;
  display: inline-block;
  margin: 0 15px;
}
.classItem.active{
  border: 1px solid #000;
}
.goods_container{
  /* display: flex;
  justify-content: space-between; */
  padding-top: 10px;
  width: 85%;
  margin: 0 auto 100px;
  overflow: hidden;
}
.item_long{
  box-sizing: border-box;
  float: left;
  width: 20%;
  overflow: hidden;
}
.goods_item{
  position: relative;
  font-size: 0;
  box-sizing: border-box;
  display: inline-block;
  margin: 0 0 10px 0;
  width: 200px;
  border: 1px solid #fff;
  transition: all .2s ease;
  box-shadow: 0 2px 7px 0 rgba(0, 0, 0, .2);
}
.item_info{
  height: 60px;
  font-size: 14px;
  padding: 10px 10px 5px;
  box-sizing: border-box;
  flex-direction: column;
  text-align: left;
}
.info_name{
  font-size: 14px;
}
.foot_info{
  margin-top: 5px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.goods_item:hover{
  border: 1px solid #ddd;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>