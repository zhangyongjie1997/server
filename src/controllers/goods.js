const goods = require('../models/goods')
const user = require('../models/user')
const utils = require('../lib/utils')

module.exports = {
  async getIndexList(req, res, next){
    let sort =  req.query.sort;
    let list = await goods.getIndexList();
    let collectList = await user.findCollect(req.query.userPhone);
    let collectListAll = await user.getCollectCount();
    if(list.code == 0){
      let data = list.data;
      data = data.map((item) => {
        item.collectCount = 0;
        item.collected = collectList.data.some(item2 => {
          return item2.id == item.id;
        });
        collectListAll.data.forEach(item3 => {
          if(item3.id == item.id){
            item.collectCount = item3.count;
          }
        });
        return item;
      })
      if(sort == 'new'){
        data.sort((a, b)=>{
          if(utils.getTimestamp(a.time) > utils.getTimestamp(b.time)) return -1;
          return 1;
        })
      }else{
        data.sort((a, b) => {
          if(a.collectCount > b.collectCount) return -1;
          return 1;
        })
      }
      setTimeout(()=>{
        res.send({code: 0, msg:'获取成功', data: data.slice(0, 8)})
      },1000)
    }else{
      utils.sendError(res, list.err);
    }
  },
  async upload(req, res, next){
    // console.log(req);
    // return res.send({code: 0}).end();
    let resault = await goods.addGood(req, res, next);
    if(resault.code == 0){
      res.send({
        code: 0,
        msg: '上传成功'
      }).end();
    }else{
      utils.sendError(res, resault.err);
    }
  },
  async getGoodsClass(req, res, next){
    let classList = await goods.getGoodsClass();
    if(classList.code != 0) return utils.sendError(res, classList.err);
    res.send({code: 0, msg: '获取成功', data: classList.data});
  }
}