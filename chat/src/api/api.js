const axios = require('axios')
const Qs = require('qs')
import md5 from '../lib/md5.js'
import utils from '../lib/utils'
import ElementUI from 'element-ui'
import axios2 from './instance'
import router  from '../router'


axios.defaults.baseURL = '//zyjbiubiu.cn/api';
if(process.env.NODE_ENV != 'production'){
  axios.defaults.baseURL = '//localhost:3000/api'
}

axios.interceptors.request.use(
  config => {
    let token = utils.getLocalStorage("token") || "";
    if (config.method == "post") {
      if (config.data.password) {
        config.data.password = md5(config.data.password);
      }
      if (config.data.confirmPassword) {
        config.data.confirmPassword = md5(config.data.confirmPassword);
      }
      if (config.data.oldPassword) {
        config.data.oldPassword = md5(config.data.oldPassword);
      }
      if (config.data.newPassword) {
        config.data.newPassword = md5(config.data.newPassword);
      }
      
      config.data = Qs.stringify({
        ...config.data,
        userPhone: utils.getLocalStorage('phone') || '',
        timestamp: Date.parse(new Date()) / 1000,
        token,
        sign: token ? md5(token + "h5openVip") : ""
      });
    } else if (config.method == "get") {
      config.params = {
        ...config.data,
        userPhone: utils.getLocalStorage('phone') || '',
        timestamp: Date.parse(new Date()) / 1000,
        token,
        sign: token ? md5(token + "h5openVip") : ""
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  response => {
    if (response.data.code == "4011" || response.data.code == "4012") {
      router.push('/login');
      ElementUI.Message.error('登录失效请重新登录');
      return Promise.reject(new Error(response.data.code));
    } else if (response.data.code != 0) {
      ElementUI.Message.error(response.data.msg);
    }
    return response.data;
  },
  error => {
    console.log(error)
    return Promise.reject(new Error("服务器出错了"));
  }
);
export let login = (data) => {
  return axios.post('/user/login', data);
}
export let register = (data) => {
  return axios.post('/user/register', data);
}
export let collect = (data) => {
  return axios.post('/user/collect', data);
}
export let getIndexGoods = (data) => {
  return axios.get(`/goods/indexList?sort=${data.sort}`);
}
export let getGoodsClass = () => {
  return axios.get('/goods/getGoodsClass');
}
export let getIndexImg = () => {
  return axios.get('/index/swiper');
}
export let editPersonalInfo = (data) => {
  return axios.post('/user/editInfo', data);
}
export let changePwd = (data) => {
  return axios.post('/user/changePwd', data);
}
export let uploadGoods = (data) => {
  return axios2.post('/goods/upload', data);
}
export let getCollect = (data) => {
  return axios.post('/goods/getCollect', data);
}
export let getPersonalGoods = (data) => {
  return axios.post('/goods/personalGoods', data);
}
export let pay = (data) => {
  return axios.post('/pay/pay', data);
}
export let getClassList = (data) => {
  return axios.get('/goods/classList' + getQueryString(data));
}
export let deleteGoods = (data) => {
  return axios.post('/goods/delete', data);
}
export let resellGoods = (data) => {
  return axios.post('/goods/resell', data);
}
export let getOneGoods = (data) => {
  return axios.post('/goods/getOne', data);
}
export let judgeCollect = (data) => {
  return axios.post('/user/judgeCollect', data);
}
export let getUserByPhone = (data) => {
  return axios.post('/user/getUserByPhone', data)
}
export let addShop = (data) => {
  return axios.post('/user/addShop', data);
}
export let shopHadGoods = (data) => {
  return axios.post('/user/shopHadGoods', data);
}
export let getShop = (data) => {
  return axios.post('/user/getShop', data);
}
export let editShopSubmit = (data) => {
  return axios.post('/user/editShopSubmit', data);
}
export let orderCommit = (data) => {
  return axios.post('/user/orderCommit', data);
}
export let getOrderDetail = (data) => {
  return axios.post('/user/orderDetail', data);
}
export let orderStatus = (data) => {
  return axios.post('/user/orderStatus', data);
}
export let getCityList = (data) => {
  return axios.get('/user/cityList' + getQueryString(data));
}
export let orderPay = (data) => {
  return axios.post('/order/pay', data);
}
export let orderCancel = (data) => {
  return axios.post('/order/cancel', data);
}
export let getPersonalOrder = (data) => {
  return axios.post('/order/personalOrder', data);
}
export let createComment = (data) => {
  return axios.post('/user/comment/create', data);
}
export let replay0 = (data) => {
  return axios.post('/user/reply0', data);
}
export let getComment0 = (data) => {
  return axios.post('/user/getComment0', data);
}
export let getComment = (data) => {
  return axios.post('/user/getComment', data);
}





function getQueryString(data){
  let str = '?';
  Object.keys(data).forEach((item, index) => {
    if(index== 0){
      str += (item + '=' + data[item]);
    }else{
      str += ('&' + item + '=' + data[item]);
    }
  });
  return str;
}