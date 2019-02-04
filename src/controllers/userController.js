const user = require('../models/user')
const jwt = require("../lib/jwt")
const utils = require('../lib/utils')

class User {
  constructor() {}
  register(request, response, next) {
    let data = request.body;
    user.findUserByPhone(data.phone).then(res1 => {
      if (res1.length < 1) {
        let {
          phone = '',
            nick_name = '',
            password = '',
            sex = '',
            avatar = ''
        } = data;
        user.addUser([phone, password, nick_name, sex, avatar]).then(res2 => {
          if (res2) {
            response.end(JSON.stringify({
              code: 0,
              msg: 'success',
              data: res2
            }))
          }
        }).catch(err => {
          console.log(err);
          response.end(JSON.stringify({
            code: -1,
            msg: err.message
          }))
        })
      } else {
        response.end(JSON.stringify({
          code: -1,
          msg: '手机号已存在'
        }))
      }
    })
  }

  login(request, response, next) {
    if (!request.body.password) {
      return response.end(JSON.stringify({
        code: -1,
        msg: '密码不能为空'
      }))
    }
    let data = request.body;
    user.findUserByPhone(data.phone).then(res => {
      if (res.length < 1) {
        response.end(JSON.stringify({
          code: -1,
          msg: "用户不存在"
        }));
      } else {
        if (res[0].password = data.password) {
          const payload = {
            phone: res[0].phone
          }
          let token = jwt.getToken(payload);
          user.addLoginUser(data.phone, token);
          response.end(JSON.stringify({
            code: 0,
            msg: "登录成功",
            data: {
              token,
              phone: res[0].phone,
              nick_name: res[0].nick_name || '默认',
              avatar: res[0].avatar || ''
            }
          }));
        } else {
          response.end(JSON.stringify({
            code: -1,
            msg: '密码不正确'
          }))
        }
      }
    }).catch(err => {

    });
  }
  async avatarUpload(req, res, next) {
    console.log(req)
    let resault = await user.uploadAvatar(req, res, next)
    let path;
    if (resault.code == 0) {
      path = '//localhost:' + global.port + '/' + (resault.path).replace('uploads/', '');
      res.send({
        code: 0,
        msg: '上传成功',
        data: {
          path
        }
      }).end();
      user.updateAvatar(path, req.body.phone);
    } else {
      utils.sendError(res, resault.err);
    }
  }
  async editInfo(req, res, next){
    let body = req.body;
    let resault = await user.updateInfo(body.userPhone, body.phone, body.nick_name);
    if(resault.code != 0) return utils.sendError(res, resault.err);
    resault.msg = '修改成功';
    res.send(resault).end();
  }
  async collect(req, res, next){
    let body = req.body;
    let resault = await user.collect(body.userPhone, body.id);
    if(resault.code == -1) return utils.sendError(res, resault.err);
    res.send(resault).end();
  }
}

module.exports = new User();