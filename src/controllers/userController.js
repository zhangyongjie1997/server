const user = require('../models/user')
const jwt = require("../lib/jwt")
const Utils = require('../lib/utils')
const async = require('async')
const goods = require('../models/goods')

class UserController extends Utils{
  constructor() {super()}
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
            }));
          }
        }).catch(err => {
          console.log(err);
          response.end(JSON.stringify({
            code: -1,
            msg: err.message
          }));
        })
      } else {
        response.end(JSON.stringify({
          code: -1,
          msg: '手机号已存在'
        }));
      }
    })
  }
  static userVerify(phone, password){
    return new Promise(async resolve => {
      let userInfo = await user.findUserByPhone(phone);
      if(userInfo.length == 0) return resolve({code: -1, msg: '用户不存在', err: {message: '用户不存在'}});
      if(userInfo[0].password == password) return resolve({code: 0, data: userInfo[0], msg: '登录成功'});
      return resolve({code: -1, msg: '密码不正确', err: {message: '密码不正确'}});
    });
  }
  login(request, response) {
    let that = this;
    if (!request.body.password) {
      return response.end(JSON.stringify({
        code: -1,
        msg: '密码不能为空'
      }))
    }
    let data = request.body;
    UserController.userVerify(data.phone, data.password).then(res => {
      if(res.code != 0) return response.json(res);
      const payload = {
        phone: res.data.phone
      }
      let token = jwt.getToken(payload);
      user.addLoginUser(data.phone, token);
      response.end(JSON.stringify({
        code: 0,
        msg: "登录成功",
        data: {
          token,
          phone: res.data.phone,
          nick_name: res.data.nick_name || '默认',
          avatar: res.data.avatar || ''
        }
      }));
    });
  }
  async avatarUpload(req, res, next) {
    let result = await user.uploadAvatar(req);
    let path;
    if (result.code == 0) {
      path = '//39.107.88.223/api/' + (result.path).replace('uploads/', 'static/');
      res.send({
        code: 0,
        msg: '上传成功',
        data: {
          path
        }
      }).end();
      user.updateAvatar(path, req.body.phone);
    } else {
      this.sendError(res, result.err);
    }
  }
  async editInfo(req, res, next){
    let body = req.body;
    let result = await user.updateInfo(body.userPhone, body.phone, body.nick_name);
    if(result.code != 0) return this.sendError(res, result.err);
    result.msg = '修改成功';
    res.send(result).end();
  }
  async collect(req, res, next){
    let body = req.body;
    let result = await user.collect(body.userPhone, body.id);
    if(result.code == -1) return this.sendError(res, result.err);
    res.send(result).end();
  }
  async judgeCollect(req, res){
    let result = await user.getOneCollect(req.body.userPhone, req.body.id);
    if(result.code == -1) return this.sendError(res, result.err);
    res.send({code: 0, data: {collect: result.data.length}, msg: '获取成功'}).end();
  }
  async getUserByPhone(req, res){
    let userInfo = await user.findUserByPhone(req.body.userPhone);
    if(userInfo.length == 0) return resolve({code: -1, msg: '用户不存在', err: {message: '用户不存在'}});
    res.send({code: 0, data: userInfo[0], msg: '获取成功'}).end();
  }
  async addShop(req, res){
    let result = await user.findShopByPhone(req.body.userPhone);
    if(result.code == -1) return this.sendError(res, result.err);
    if(!result.data){
      let result2 = await user.addNewShop(req.body.userPhone, req.body.id, req.body.count);
      if(result2.code == -1) return this.sendError(res, result.err);
      res.send({code: 0, data: result2.data, msg: '成功'});
    }else{
      let list = result.data.idList, id = req.body.id;
      let had = list.some((item, index) => {
        if(item.id == id) list[index].count = req.body.count * 1 + list[index].count * 1;
        return item.id == id;
      });
      if(!had) list.push({id, count: req.body.count * 1});
      let result3 = await user.addShop(req.body.userPhone, list);
      if(result3.code == -1) return this.sendError(res, result.err);
      res.send({code: 0, data: result3.data, msg: '添加成功'});
    }
  }
  async shopHadGoods(req, res){
    let result = await user.findShopByPhone(req.body.userPhone);
    if(result.code == -1) return this.sendError(res, result.err);
    if(!result.data) return res.send({code: 0, data: {had: 0}, msg: '成功'}).end();
    let list = result.data.idList;
    let had = list.some(item => {
      return item.id == req.body.id;
    });
    return res.send({code: 0, data: {had: had ? 1 : 0}, msg: '成功'}).end();
  }
  async getShop(req, res){
    let result = await user.findShopByPhone(req.body.userPhone);
    if(result.code == -1) return this.sendError(res, result.err);
    if(!result.data) res.send({code: 0, data: [], msg: '成功'}).end();
    let list = [];
    async.eachSeries(result.data.idList, async (listItem) => {
      let goodsItem = await goods.getGoodsById(listItem.id);
      if(goodsItem.code != 0) return this.sendError(res, goodsItem.err);
      if(goodsItem.data[0]){
        goodsItem.data[0].shopCount = listItem.count;
        list.push(goodsItem.data[0]);
      }
    }, (err, result) => {
      if(err) return this.sendError(res, err);
      res.send({code: 0, data: list, msg: '成功'});
    });
  }
  async editShopSubmit(req, res){
    let result = await user.addShop(req.body.userPhone, JSON.parse(req.body.shopList));
    if(result.code == -1) return this.sendError(res, result.err);
    return res.send({code: 0, msg: '成功'}).end();
  }
}

module.exports = UserController;