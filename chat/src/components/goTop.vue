<template>
  <div>
    <transition name="fade">
      <div @click="backTop" v-if="showGoTop" class="go-top pointer">
        <div class="container">
        <div class="iDiv1"><i class="iconfont icon-arrow-upward"></i></div>
        <div class="iDiv2">回到顶部</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props:{
    scrollInfo:{
      distance:0
    }
  },
  data() {
    return {
      showGoTop:false,
      scrollTop:0
    }
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll',start);
    next();
  },
  mounted(){
    this.init(); 
  },
  methods:{
    init(){
      const start = () => {
        if(document.documentElement.scrollTop>=400){
          this.showGoTop = true;
        }else{
          this.showGoTop = false;
        }
      }
      window.addEventListener('scroll',start);
    },
    backTop(){
      let distance = document.documentElement.scrollTop;
      let time = setInterval(function(){
        distance -= 60;
        document.documentElement.scrollTop = distance;
        if(distance<=60){
          document.documentElement.scrollTop = 0;
          clearInterval(time);
        }
      },13);
      this.init();
    },
  },
}
</script>

<style scoped>
.go-top{
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: rgba(189, 189, 189, 0);
  right: 60px;
  bottom: 40px;
  text-align: center;
  line-height: 50px;
  box-shadow: 0 0 2px #000;
  overflow: hidden;
  z-index: 999999;
}
.container{
  position: relative;
  width: 50px;
  height: 50px;
}
.go-top i{
  transition: all .4s ease;
  font-size: 35px;
  color: #000;
}
.iDiv1{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: all .4s ease;
}
.iDiv2{
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
  transition: all .4s ease;
}
.go-top:hover .iDiv1{
  top: -50px;
}
.go-top:hover .iDiv2{
  top: 0px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>