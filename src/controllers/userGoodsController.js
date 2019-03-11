const utils = require('../lib/utils')
const goods = require('../models/goods')
const user = require('../models/user')

class userGoodsController {
  constructor(){}
  async collect(req, res, next){
    let body = req.body;
    let resault = await user.collect(body.userPhone, body.id);
    if(resault.code == -1) return utils.sendError(res, resault.err);
    res.send(resault).end();
  }
  async getCollecion(req, res, next){
    let collectList = await goods.getCollection(req.body.userPhone);
    if(collectList.code != 0) return utils.sendError(res, collectList.err);
    res.send({code: 0, msg: '获取成功', data: collectList.data}).end();
  }
}

module.exports = new userGoodsController();