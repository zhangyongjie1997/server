const fs = require('fs')
const path = require('path')


Date.prototype.format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

const utils = {
  /**
   * @method 用于判断文件夹是否存在,不存在就创建
   * @param {String} targetPath 文件夹路径
   * @returns {Object} Promise对象
   */
  dir_exist_create(targetPath){
    return new Promise((resolve, reject) => {
      try {
        fs.stat(targetPath, (err, stats) => {
          if(!stats){
            fs.mkdir(targetPath, (err, res) => {
              if(err){
                reject({code: -1, err})
              }else{
                resolve({code: 0})
              }
            })
          }else{
            resolve({code: 0})
          }
        })
      } catch (error) {
        console.log(err);
        
      }
    })
  },
  /**
   * @method 写入单个文件
   * @param {String} target_path 目标路径，用于写入以及判断文件夹是否存在
   * @param {String} file_name 文件名
   * @param {String} tmp_path 远程路径
   */
  writeSingleFile(target_path, file_name, tmp_path){
    console.log(target_path, file_name, tmp_path);
    return new Promise(async (resolve, reject) => {
      let result = await this.dir_exist_create(target_path);
      if(result.code == 0){
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path + '/' + decodeURIComponent(file_name));
        const a = src.pipe(dest);
        src.on('end', function() { resolve({code: 0, path: a.path}) });
        src.on('error', function(err) { resolve({code: -1,err})});
      }else{
        resolve({code:-1, err: result.err});
      }
    })
  },
  readFile(targetPath){
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve('./', targetPath), (err, data) => {
        if(err) return resolve({code: -1, err: err});
        resolve({code: 0, data: JSON.parse(data.toString())});
      })
    })
  },
  getDirInfo(targetPath){
    return new Promise((resolve, reject) => {
      const info = fs.readdirSync(path.resolve('./', targetPath));
      resolve({code: 0, data: info})
    })
  },
  sendError(res, err){
    console.log(err);
    res.end(JSON.stringify({code: -1, msg: err.message}))
  },
  getTimestamp(data){
    if(!data) return new Date().getTime();
    let mydate = data;
    if(data.replace){
      mydate = data.replace(/-/g, '/');
    }
    return new Date(mydate).getTime();
  },
  promiseify(callback){
    return new Promise(callback(resolve, reject));
  },
  formatDate(date = new Date(), format) {
    format = format || "yyyy-MM-dd hh:mm:ss";
    var list = {
      "y+": String(date.getFullYear()), //年
      "M+": String(date.getMonth() + 1), //月份 
      "d+": String(date.getDate()), //日 
      "h+": String(date.getHours()), //小时 
      "m+": String(date.getMinutes()), //分 
      "s+": String(date.getSeconds()), //秒 
      "q+": String(Math.floor((date.getMonth() + 3) / 3)), //季度 
      "S": String(date.getMilliseconds()) //毫秒 
  
    };
    Object.keys(list).map(function (key) {
      var reg = new RegExp("(" + key + ")", 'g');
      format = format.replace(reg, function (fmt) {
        if (/y+/.test(fmt)) return list[key].substr(4 - fmt.length);
        return fmt.length == 1 ? list[key] : ("00" + list[key]).substr(list[key].length);
      });
    })
    return format;
  },
  getDateTime(){
    return this.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
  },
  sortList(list = [], sort){
    if(sort && sort == 'new'){
      list.sort((a, b)=>{
        if(utils.getTimestamp(a.time) > utils.getTimestamp(b.time)) return -1;
        return 1;
      });
    }else{
      list.sort((a, b) => {
        if(a.collectCount > b.collectCount) return -1;
        return 1;
      });
    }
    return list;
  },
  
}
module.exports = utils