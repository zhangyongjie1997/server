<template>
  <div id="app">
    <top v-if="$route.path != '/login' && $route.path != '/register'"></top>
    <router-view />
  </div>
</template>
<script>
import top from "./components/top";
import utils from "./lib/utils.js";
export default {
  created() {
    console.log(document.querySelector('::-webkit-scrollbar'));
  },
  components: {
    top
  },
};
</script>

<style lang="less">
// @import url('//at.alicdn.com/t/font_1037397_e5ayzupmze.css');
@import url("./css/reset.css");
body,
html {
  height: 100%;
}
body {
  background-size: cover;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}
#app {
  position: relative;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  width: 100%;
  min-height: 500px;
  min-width: 500px;
  margin: 0 auto;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
}
::-webkit-scrollbar {
  width: 0px;
  height: 10px;
  background-color: transparent;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #aaa;
  transition: all .3s ease-in-out;
}


.page {
  width: 100% !important;
  height: 100% !important;
}
.flex {
  display: flex !important;
  justify-content: space-between !important;
  justify-items: center !important;
  align-items: center !important;
  align-content: space-between !important;
}
.text-left {
  text-align: left !important;
}
.text-right {
  text-align: right !important;
}
.text-center{
  text-align: center !important;
}
.margin-top-row {
  margin-top: 50px !important;
}
.full-height {
  height: 100% !important;
}
.mid_v {
  position: absolute !important;
  top: 50% !important;
}
.pointer {
  cursor: pointer !important;
}
.overflow{
  overflow: hidden;
}
.no_select{
  user-select: none;
}
.text_left {
  text-align: left !important;
}
.text_right {
  text-align: right !important;
}
.el-input__inner,
.el-button {
  border-radius: 0 !important;
}
.el-step__main {
  position: relative !important;
  top: 20px !important;
}
.el-step__icon {
  position: absolute !important;
  left: 0 !important;
}
.color_success{
  color: #67C23A;
}
.color_danger{
  color: #f56c6c;
}
</style>
