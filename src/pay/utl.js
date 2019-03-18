const crypto = require('crypto');
const request = require('request');


class Utl {
  constructor() {}

  /**
   * 浅拷贝
   * @param obj
   * @returns {{}}
   */
  copy(obj) {
    let ret = {};
    for (let k in obj) {
      ret[k] = obj[k];
    }
    return ret;
  }

  /**
   * 对请求参数进行组装、编码、签名，返回已组装好签名的参数字符串
   * @param {{Object} params  请求参数
   * @param {String} privateKey 商户应用私钥
   * @param {String} [signType] 签名类型 'RSA2' or 'RSA'
   * @returns {String}
   */
  processParams(params, privateKey, signType) {
    let ret = this.encodeParams(params);
    let sign = this.sign(ret.unencode, privateKey, signType);
    return ret.encode + '&sign=' + encodeURIComponent(sign);
  }
  /**
   * 对请求参数进行组装、编码
   * @param {Object} params  请求参数
   * @returns {Object}
   */
  encodeParams(params) {
    let keys = [];
    for (let k in params) {
      let v = params[k];
      if (params[k] !== undefined && params[k] !== "") keys.push(k);
    }
    keys.sort();

    let unencodeStr = "";
    let encodeStr = "";
    let len = keys.length;
    for (let i = 0; i < len; ++i) {
      let k = keys[i];
      if (i !== 0) {
        unencodeStr += '&';
        encodeStr += '&';
      }
      unencodeStr += k + '=' + params[k];
      encodeStr += k + '=' + encodeURIComponent(params[k]);
    }
    return {
      unencode: unencodeStr,
      encode: encodeStr
    };
  }
  /**
   * 对字符串进行签名验证
   * @param {String} str 要验证的参数字符串
   * @param {String} sign 要验证的签名
   * @param {String} publicKey 支付宝公钥
   * @param {String} [signType] 签名类型
   * @returns {Boolean}
   */
  signVerify(str, sign, publicKey, signType) {
    let verify;
    if (signType === 'RSA2') {
      verify = crypto.createVerify('RSA-SHA256');
    } else {
      verify = crypto.createVerify('RSA-SHA1');
    }
    verify.update(str, 'utf8');
    let result = verify.verify(publicKey, sign, 'base64');
    return result;
  }

  /**
   * 对字符串进行签名
   * @param {String} str 要签名的字符串
   * @param {String} privateKey 商户应用私钥
   * @param {String} [signType] 签名类型
   * @returns {String}
   */
  sign(str, privateKey, signType) {
    let sha;
    if (signType === 'RSA2') {
      sha = crypto.createSign('RSA-SHA256');
    } else {
      sha = crypto.createSign('RSA-SHA1');
    }
    sha.update(str, 'utf8');
    return sha.sign(privateKey, 'base64');
  }
  /**
   * 发送请求 https://github.com/request/request
   * @param {Object} opts 请求参数
   * @param {String} opts.url 请求地址
   * @param {String} opts.method  GET|POST|PUT...
   * @param {String} [opts.type] text/xml | application/json | application/x-www-form-urlencoded ...
   * @param {Object} [opts.headers] {}
   * @param {Object} [opts.qs] query参数
   * @param {Buffer|String|ReadStream} [opts.body] 请求体
   * @param {Object} [opts.form] form表单
   * @returns {Promise.<Object>} resolve({response, body})
   */
  request(opts) {
    return new Promise(function (resolve, reject) {
      request(opts, function (err, res, body) {
        if (err) {
          reject(err);
          return;
        }
        let ret = {
          response: res,
          body: body
        };
        ret.ok = function () {
          return res.statusCode === 200;
        };
        ret.json = function () {
          if (res.body) return JSON.parse(res.body);
          return null;
        };
        resolve(ret);
      });
    });
  }

}

module.exports = new Utl();


