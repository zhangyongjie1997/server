const axios = require('axios')
const Qs = require('qs')
const https = require('https')


axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";
axios.interceptors.request.use(config => {
  config.data = Qs.stringify({
    ...config.data
  });
  return config;
});
axios.interceptors.response.use(config => {
  console.log(config)
  return config;
});

class Request{
  constructor(){}
  payRequest(data){
    return axios.post('https://openapi.alipaydev.com/gateway.do', data);
  }
  get(url, options, callback){
    let path = url + '?' + options.data;
    Reflect.deleteProperty(options, 'data');
    return https.request(path, options, callback);
  }
  post(url, options, callback){
    let path = url + '?' + options.data;
    Reflect.deleteProperty(options, 'data');
    return https.post(path, options, callback);
  }
  httpRequest(url, options, callback){
    let path = url + '?' + options.data;
    Reflect.deleteProperty(options, 'data');
    return https.request(path, options, callback);
  }
}

module.exports = new Request();