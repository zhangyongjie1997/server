const jwt = require("jsonwebtoken")
const secret = require('./config').secret


module.exports = {
  getToken(payload) {
    return jwt.sign(payload, secret, {
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60  //一个小时
    });
  },
  verify(req, res, next, callback){
    let urlJudge = judgeUrl(req.url);
    console.log(urlJudge);
    if(urlJudge) return next();
    let token = req.body.token;
    jwt.verify(token, secret, (err, decoded) => {
      console.log(err, decoded);
      if(err || !decoded) return res.end(JSON.stringify({code: 4011, data:{}, msg: err.JsonWebTokenError}))
      next();
      if(callback && typeof callback == 'function') return callback();
    })
  }
}
function judgeUrl(url){
  const urlList = [
    '/static',
    '/public',
    '/user/register',
    '/user/login',
    '/goods/indexList',
    '/goods/classList',
    '/goods/getGoodsClass',
    '/index/swiper',
    '/goods/getOne',
    '/mongo',
    '/user/avatar',
    '/user/getUserByPhone',
  ]
  return urlList.some(item => url.indexOf(item) != -1);
}