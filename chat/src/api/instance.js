const axios = require('axios')
import md5 from '../lib/md5.js'
import utils from '../lib/utils'
import ElementUI from "element-ui"

const axios2 = axios.create({
  baseURL: '//localhost:3000',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

axios2.interceptors.request.use(
  config => {
    let token = utils.getLocalStorage("token") || "";
    if (config.method == "post") {
      let data = {
        ...config.data.data,
        userPhone: utils.getLocalStorage('phone') || '',
        timestamp: Date.parse(new Date()) / 1000,
        token,
        sign: token ? md5(token + "h5openVip") : ""
      };
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          config.data.file.append(key, data[key])
        }
      }
      config.data = config.data.file;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios2;