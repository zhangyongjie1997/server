const goods = require('../models/goods')
const user = require('../models/user')
const utils = require('../lib/utils')
const path = require('path')
const async = require('async')
const payController = require('./payController')
const UserController = require('./userController')

class goodsController {
  async getIndexList(req, res, next){
    let that = this;
    let sort =  req.query.sort;
    let list = await goods.getIndexList();
    let collectList = await user.findCollect(req.query.userPhone);
    let collectListAll = await user.getCollectCount();
    if(list.code == 0){
      let data = list.data;
      data = that.collectNum(data, collectListAll);
      utils.sortList(data, sort);
      setTimeout(()=>{
        res.send({code: 0, msg:'获取成功', data: data.slice(0, 8)}).end();
      },1000)
    }else{
      utils.sendError(res, list.err);
    }
  }
  async getIndexImg(req, res, next){
    let result;
    const data = await utils.getDirInfo(path.resolve(__dirname, '../../public/index/img'));
    if(data.code == 0){
      result = data.data.map(item => {
        return '//39.107.88.223/api/public/index/img/' + item;
      });
      res.send({code:0, msg:'获取成功', data: result}).end();
    }
  }
  async upload(req, res, next){
    let resault = await goods.addGood(req, res, next);
    if(resault.code != 0){
      return utils.sendError(res, resault.err);
    }
    res.send({code: 0, msg: '上传成功'}).end();
  }
  async getGoodsClass(req, res, next){
    let classList = await goods.getGoodsClass();
    if(classList.code != 0) return utils.sendError(res, classList.err);
    res.send({code: 0, msg: '获取成功', data: classList.data}).end();
  }
  async getCollecion(req, res, next){
    let collectList = await goods.getCollection(req.body.userPhone);
    if(collectList.code != 0) return utils.sendError(res, collectList.err);
    let currentPage = req.body.currentPage || 0,
      pageSize = req.body.pageSize || 0;
    let list = collectList.data.slice(pageSize * currentPage, pageSize * (currentPage + 1));
    res.send({code: 0, msg: '获取成功', data: {
      data: list,
      count: collectList.data.length
    }}).end();
  }
  async getListByClass(req, res, next){
    let that = this;
    let classList = await goods.getListByClass(req.query.goodsClass);
    utils.sortList(classList.data, req.query.sort);
    if(classList.code != 0) return utils.sendError(res, classList.err);
    let collectListAll = await user.getCollectCount();
    classList.data = that.collectNum(classList.data, collectListAll);
    res.send({code: 0, msg: '获取成功', data: classList.data || []}).end();
  }
  async getGoodsListByPhone(req, res, next){
    let that = this;
    let goodsList = await goods.getGoodsListByPhone(req.body.userPhone);
    if(goodsList.code != 0) return utils.sendError(res, goodsList.err);
    let currentPage = req.body.currentPage || 0,
      pageSize = req.body.pageSize || 0;
    let list = goodsList.data.sort((a, b) => {
      if(utils.getTimestamp(a.time) > utils.getTimestamp(b.time)) return -1;
      return 1;
    }).slice(pageSize * currentPage, pageSize * (currentPage + 1));
    res.send({code: 0, msg: '获取成功', data: {
      data: list,
      count: goodsList.data.length
    }}).end();
  }
  payGoods(req, res){
    let goodsInfo = [];
    async.map(req.body.goodsList, mapFunc, finalFunc);
    async function mapFunc(item, cb){
      let result = await goods.getGoodsById(item);
      if(result.code != 0) return utils.sendError(res, result.err);
      goodsInfo.push(result.data);
    }
    function finalFunc(err){
      err && utils.sendError(res, err);
      let url = payController.pay(goodsInfo);
      res.send({code: 0, data: url});
    }
  }
  collectNum(dataList, collectList){
    dataList = dataList.map((item) => {
      item.collectCount = 0;
      item.collected = collectList.data.some(item2 => {
        return item2.id == item.id;
      });
      collectList.data.forEach(item3 => {
        if(item3.id == item.id){
          item.collectCount = item3.count;
        }
      });
      return item;
    });
    return dataList;
  }
  deleteGoods(req, res){
    let body = req.body;
    UserController.userVerify(body.userPhone, body.password).then(async result => {
      if(result.code != 0) return utils.sendError(res, result.err);
      let resault2 = await goods.deleteGoodsById(body.goodsId);
      if(resault2.code != 0) return utils.sendError(res, resault2.err);
      res.send({code: 0, msg: '删除成功'});
    });
  }
}

module.exports = new goodsController();