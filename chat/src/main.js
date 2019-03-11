import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "./css/element-#000000/index.css";
import cusInput from './components/cus-input.vue';

Vue.use(ElementUI);
Vue.config.productionTip = false;
router.beforeEach(function(to, from, next) {
  document.title = to.meta.title;
  next();
});
Vue.component('cus-input', cusInput);
router.beforeEach((to, from, next)=>{
  document.title = to.meta.title;
  next();
});
Vue.directive('line_mid', {
  inserted(ele, binding){
    //console.log('insert');
    let height;
    if(ele.currentStyle){
      height = ele.currentStyle['height'];
    }else{
      height = getComputedStyle(ele, null).getPropertyValue('height');
    }
    ele.style.cssText += 'line-height:' + height + " !important";
  },
  update(ele){
    //console.log('update');
    let height;
    if(ele.currentStyle){
      height = ele.currentStyle['height'];
    }else{
      height = getComputedStyle(ele, null)['height'];
    }
    ele.style.lineHeight = height;
  },
  componentUpdated(ele){
    //console.log('componentUpdated');
    let height;
    if(ele.currentStyle){
      height = ele.currentStyle['height'];
    }else{
      height = getComputedStyle(ele, null)['height'];
    }
    ele.style.lineHeight = height;
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
