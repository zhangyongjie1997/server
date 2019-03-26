let baseUrl = '//zyjbiubiu.cn/api/';
if(process.env.NODE_ENV != 'production'){
  baseUrl = '//localhost:3000/api/'
}

export {baseUrl}