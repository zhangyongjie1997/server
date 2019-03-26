import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "./css/element-#000000/index.css";
import cusInput from './components/cus-input.vue';
import {
  loginMinix
} from './mixin'


Date.prototype.format = function (format) {
  format = format || "yyyy-MM-dd hh:mm:ss";
  let list = {
    "y+": String(this.getFullYear()), //年
    "M+": String(this.getMonth() + 1), //月份 
    "d+": String(this.getDate()), //日 
    "h+": String(this.getHours()), //小时 
    "m+": String(this.getMinutes()), //分 
    "s+": String(this.getSeconds()), //秒 
    "q+": String(Math.floor((this.getMonth() + 3) / 3)), //季度 
    "S": String(this.getMilliseconds()) //毫秒 
  };
  Object.keys(list).map(function (key) {
    let reg = new RegExp("(" + key + ")", 'g');
    format = format.replace(reg, function (fmt) {
      if (/y+/.test(fmt)) return list[key].substr(4 - fmt.length);
      return fmt.length == 1 ? list[key] : ("00" + list[key]).substr(list[key].length);
    });
  })
  return format;
}

Vue.use(ElementUI);
Vue.config.productionTip = false;
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title;
  next();
});
Vue.component('cus-input', cusInput);
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});
Vue.directive('line_mid', {
  inserted(ele, binding) {
    //console.log('insert');
    let height;
    if (ele.currentStyle) {
      height = ele.currentStyle['height'];
    } else {
      height = getComputedStyle(ele, null).getPropertyValue('height');
    }
    ele.style.cssText += 'line-height:' + height + " !important";
  },
  update(ele) {
    //console.log('update');
    let height;
    if (ele.currentStyle) {
      height = ele.currentStyle['height'];
    } else {
      height = getComputedStyle(ele, null)['height'];
    }
    ele.style.lineHeight = height;
  },
  componentUpdated(ele) {
    //console.log('componentUpdated');
    let height;
    if (ele.currentStyle) {
      height = ele.currentStyle['height'];
    } else {
      height = getComputedStyle(ele, null)['height'];
    }
    ele.style.lineHeight = height;
  }
});
Vue.mixin(loginMinix);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");