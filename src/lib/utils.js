const fs = require("fs");
const path = require("path");

Date.prototype.format = function(format) {
  format = format || "yyyy-MM-dd hh:mm:ss";
  let list = {
    "y+": String(this.getFullYear()), //年
    "M+": String(this.getMonth() + 1), //月份
    "d+": String(this.getDate()), //日
    "h+": String(this.getHours()), //小时
    "m+": String(this.getMinutes()), //分
    "s+": String(this.getSeconds()), //秒
    "q+": String(Math.floor((this.getMonth() + 3) / 3)), //季度
    S: String(this.getMilliseconds()) //毫秒
  };
  Object.keys(list).map(function(key) {
    let reg = new RegExp("(" + key + ")", "g");
    format = format.replace(reg, function(fmt) {
      if (/y+/.test(fmt)) return list[key].substr(4 - fmt.length);
      return fmt.length == 1 ? list[key] : ("00" + list[key]).substr(list[key].length);
    });
  });
  return format;
};

class Utils {
  static type(obj) {
    return Object.prototype.toString
      .call(obj)
      .split(" ")[1]
      .toString()
      .split("]")[0];
  }
  /**
   * @method 用于判断文件夹是否存在,不存在就创建
   * @param {String} targetPath 文件夹路径
   * @returns {Object} Promise对象
   */
  dir_exist_create(targetPath) {
    return new Promise((resolve, reject) => {
      try {
        fs.stat(targetPath, (err, stats) => {
          if (!stats) {
            fs.mkdir(targetPath, (err, res) => {
              if (err) {
                reject({ code: -1, err });
              } else {
                resolve({ code: 0 });
              }
            });
          } else {
            resolve({ code: 0 });
          }
        });
      } catch (error) {
        console.log(err);
      }
    });
  }
  /**
   * @method 写入单个文件
   * @param {String} target_path 目标路径，用于写入以及判断文件夹是否存在
   * @param {String} file_name 文件名
   * @param {String} tmp_path 远程路径
   */
  writeSingleFile(target_path, file_name, tmp_path) {
    console.log(target_path, file_name, tmp_path);
    return new Promise(async (resolve, reject) => {
      let result = await this.dir_exist_create(target_path);
      if (result.code == 0) {
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(path.resolve("", target_path + "/" + decodeURIComponent(file_name)));
        const a = src.pipe(dest);
        src.on("end", function() {
          resolve({ code: 0, path: a.path.replace("/usr/local/src/server/uploads", "/static").replace("//", "/") });
        });
        src.on("error", function(err) {
          resolve({ code: -1, err });
        });
      } else {
        resolve({ code: -1, err: result.err });
      }
    });
  }
  readFile(targetPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve("./", targetPath), (err, data) => {
        if (err) return resolve({ code: -1, err: err });
        resolve({ code: 0, data: JSON.parse(data.toString()) });
      });
    });
  }
  getDirInfo(targetPath) {
    return new Promise((resolve, reject) => {
      const info = fs.readdirSync(path.resolve("./", targetPath));
      resolve({ code: 0, data: info });
    });
  }
  sendError(res, err) {
    console.log(err);
    res.end(JSON.stringify({ code: -1, msg: err ? err.message : '服务器出错了' }));
  }
  getTimestamp(data) {
    if (!data) return new Date().getTime();
    let mydate = data;
    if (data.replace) {
      mydate = data.replace(/-/g, "/");
    }
    return new Date(mydate).getTime();
  }
  static getTimestamp(data) {
    if (!data) return new Date().getTime();
    let mydate = data;
    if (data.replace) {
      mydate = data.replace(/-/g, "/");
    }
    return new Date(mydate).getTime();
  }
  promiseify(callback) {
    return new Promise(callback(resolve, reject));
  }
  formatDate(date = new Date(), format) {
    format = format || "yyyy-MM-dd hh:mm:ss";
    let list = {
      "y+": String(date.getFullYear()), //年
      "M+": String(date.getMonth() + 1), //月份
      "d+": String(date.getDate()), //日
      "h+": String(date.getHours()), //小时
      "m+": String(date.getMinutes()), //分
      "s+": String(date.getSeconds()), //秒
      "q+": String(Math.floor((date.getMonth() + 3) / 3)), //季度
      S: String(date.getMilliseconds()) //毫秒
    };
    Object.keys(list).map(function(key) {
      let reg = new RegExp("(" + key + ")", "g");
      format = format.replace(reg, function(fmt) {
        if (/y+/.test(fmt)) return list[key].substr(4 - fmt.length);
        return fmt.length == 1 ? list[key] : ("00" + list[key]).substr(list[key].length);
      });
    });
    return format;
  }
  getDateTime() {
    return this.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
  }
  sortList(list = [], sort = "new") {
    if (sort && sort == "new") {
      list.sort((a, b) => {
        if (this.getTimestamp(a.time) > this.getTimestamp(b.time)) return -1;
        return 1;
      });
    } else {
      list.sort((a, b) => {
        if (a.collectCount > b.collectCount) return -1;
        return 1;
      });
    }
    return list;
  }
  deepCopy(obj) {
    if (!(obj instanceof Object)) return obj;
    if (Array.isArray(obj)) return arrayCopy(obj);
    let data = {};
    Reflect.ownKeys(obj).forEach(item => {
      data[item] =
        obj[item] instanceof Object
          ? Array.isArray(obj[item])
            ? arrayCopy(obj[item])
            : deepCopy(obj[item])
          : obj[item];
    });
    // for (const key in obj) {
    //   if (obj.hasOwnProperty(key)) {
    //     data[key] = obj[key] instanceof Object ?
    //      Array.isArray(obj[key]) ?
    //       arrayCopy(obj[key]) :
    //        that.deepCopy(obj[key]) :
    //         obj[key];
    //   }
    // }
    function arrayCopy(arr) {
      let resArr = [];
      Object.keys(arr).forEach(element => {
        resArr[element] = arr[element];
      });
      return resArr;
    }
    return data;
  }
  static getQueryString(data) {
    let str = "?";
    Object.keys(data).forEach((item, index) => {
      if (index == 0) {
        str += item + "=" + data[item];
      } else {
        str += "&" + item + "=" + data[item];
      }
    });
    return str;
  }
}
module.exports = Utils;

function Storage(label) {
  this.label = label;
  this.get = function() {
    var now = new Date().getTime() / 1000,
      data = localStorage.getItem(this.label + name);
    if (!data.expires) return data.value;
    return now > data.expires ? false : data.value;
  };
  this.set = function() {
    var data = Object.create(null),
      endTime = expires ? new Date().getTime() / 1000 + expires : "";
    data.endTime = endTime;
    data.value = value;
    localStorage.setItem(this.label + JSON.stringify(data));
  };
}
