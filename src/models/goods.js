const Mock = require('mockjs')
const utils = require('../lib/utils')
const db = require('../db/db')

class Goods {
  constructor(){}
  async getIndexList(){
    let data = [];
    return new Promise(async (resolve, reject) => {
      let res = await db.query('select * from goods');
      if(res[1]) return resolve({code: -1, err: res[1]})
      resolve({code: 0, data: res[0]})
    })
  }
  createGoods(){
    return Mock.mock({
      'list|5': [{
        'id|+1': 1,
        'time': '@datetime',
        'name': '@ctitle()',
        'describe': '@cparagraph()',
        'phone': /^1[385][1-9]\d{8}/,
        'price|1-2999.2': 99.00,
        'class|1-6': 1,
        'cover':''
      }]
    });
  }
  addGoods(){
    let goods = this.createGoods().list;
    goods.forEach(async item => {
      let data = [];
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          data.push(item[key]);
        }
      }
      data.push('//localhost:'+ global.port +'/index/img/good.jpeg');
      let res = await db.query('insert into goods values(?,?,?,?,?,?,?,?)', data);
    });
  }
  upload(request, response, next){
    response.end(JSON.stringify({ code: 0 }));
  }
  uploadSingleFile(req, res, path){
    return new Promise(async (resolve, reject)=>{
      let tmp_path = req.file.path;
      let target_path = 'uploads/'+ req.body.phone;
      let file_name = req.file.originalname;
      let result = await utils.writeSingleFile(target_path, file_name, tmp_path);
      if(result.code == 0){
        resolve({code: 0, path: result.path})
      }else{
        resolve({code: -1, err: result.err})
      }
    })
  }
  addGood(req, res, next){
    return new Promise(async (resolve, reject) => {
      let cover;
      const phone = req.body.userPhone;
      const target_path = 'uploads/'+ phone + '/goods';
      const result = await utils.dir_exist_create(target_path);
      if (result.code != 0) return utils.sendError(res, result.err);
      const result2 = await utils.getDirInfo(target_path);
      if (result2.code != 0) return utils.sendError(res, result.err);
      const goodNo = result2.data.length + 1;
      const target_path2 = target_path + '/good' + goodNo;
      const result3 = await utils.dir_exist_create(target_path2);
      if (result3.code != 0) return utils.sendError(res, result.err);
      for (const key in req.files) {
        const target_path3 = target_path2  + '/' + key;
        const result4 = await utils.dir_exist_create(target_path3);
        if (result4.code != 0) return utils.sendError(res, result.err);
        req.files[key].forEach(async (file) => {
          const tmp_path = file.path;
          const file_name = file.originalname;
          if(key == 'cover'){
            cover = '//localhost:' + global.port + '/' + target_path3 + '/' + file_name;
            cover.replace('uploads/', '');
          }
          const result5 = await utils.writeSingleFile(target_path3, file_name, tmp_path);
          if (result5.code != 0) return utils.sendError(res, result.err);
        })
      }
      let result6 = await this.insertGoods(req.body, goodNo, cover);
      if (result6.code != 0) return utils.sendError(res, result.err);
      resolve({code:0, msg: "上传成功"})
    })
  }
  insertGoods(data, id, cover){
    let _this = this;
    return new Promise(async (resolve, reject) => {
      let result = await db.query(
        'insert into goods values(?,?,?,?,?,?,?,?);', 
        [await _this.getNextGoodsId(), utils.getDateTime(), data.name, data.describe || '', data.userPhone, data.price, data.goodsClass, cover]
      );
      if(result[1]) return resolve({code: -1, err: result[1]});
      resolve({code: 0, msg: "成功"});
    });
  }
  async getNextGoodsId(){
    let result = await db.query('select max(id) from goods');
    if(!result[0][0]['max(id)']) return 0;
    return result[0][0]['max(id)'] * 1 + 1;
  }
  getGoodsClass(){
    return new Promise(async (resolve, reject) => {
      let result = await utils.readFile('public/goods/goodsClass.json');
      if(result.code != 0) return resolve({code: -1, err: result.err});
      resolve({code: 0, data: result.data});
    })
  }
}
module.exports = new Goods();
