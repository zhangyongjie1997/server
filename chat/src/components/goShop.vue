<template>
  <div>
    <div @click="goShop" v-show="showGoShop" class="go-top pointer">
      <div class="container">
        <div class="iDiv1"><i class="iconfont icon-gouwuchekong"></i></div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  data() {
    return {
      showGoShop: true,
    };
  },
  methods: {
    goShop(){
      this.$router.push('/personal?tab=shop');
    }
  }
};
</script>

<style scoped>
.go-top {
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: rgba(189, 189, 189, 0);
  right: 60px;
  bottom: 100px;
  text-align: center;
  line-height: 50px;
  box-shadow: 0 0 2px #000;
  overflow: hidden;
  z-index: 999999;
}
.container {
  position: relative;
  width: 50px;
  height: 50px;
}
.go-top i {
  transition: all 0.4s ease;
  font-size: 35px;
  color: #f60;
}
.iDiv1 {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.4s ease;
}
.iDiv2 {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50px;
  left: 0;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  vertical-align: middle;
  color: #000;
  transition: all 0.4s ease;
}
</style>