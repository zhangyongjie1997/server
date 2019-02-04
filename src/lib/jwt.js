const jwt = require("jsonwebtoken")
const secret = require('./config').secret


module.exports = {
  getToken(payload) {
    return jwt.sign(payload, secret, {
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60
    });
  },
  async verify(req, res, next, callback){
    let urlJudge = await judgeUrl(req.url);
    if(urlJudge == -1) return next();
    let token = req.body.token;
    jwt.verify(token, secret, (err, decoded) => {
      console.log(err, decoded);
      if(err || !decoded) return res.end(JSON.stringify({code: 4011, data:{}, msg: err.JsonWebTokenError}))
      if(callback && typeof callback == 'function') return callback();
      next();
    })
  }
}
function judgeUrl(url){
  switch (url){
    //case '/goods/upload':
    case '/user/register':
    case '/user/login':
      return -1;
    case '':
  }
}