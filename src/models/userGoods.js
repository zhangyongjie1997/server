const db = require('../db/db')
const utils = require('../lib/utils')

class userGoods {
  constructor(){}
  findCollect(phone, id){
    return new Promise(async (resolve, reject) => {
      if(!phone && !id){}
      let result = await db.query(`select * from collect ${phone ? id ? ' where phone=(?) and id=(?)' : ' where phone=(?)' : ''}`, [phone, id]);
      if(result[1]) return resolve({code: -1, err: result[1]});
      resolve({code: 0, data: result[0]});
    })
  }
  getCollectCount(){
    return new Promise(async (resolve, reject) => {
      let result = await db.query('select count(id) as count,id,phone from collect group by id');
      if(result[1]) return resolve({code: -1, err: result[1]});
      resolve({code: 0, data: result[0]});
    })
  }
  collect(phone, id){
    return new Promise(async (resolve, reject) => {
      let collect = await this.findCollect(phone, id), result;
      if(collect.code == 0){
        if(collect.data.length <= 0){
          result = await db.query('insert into collect values(?,?)', [phone, id]);
          if(result[1]) return resolve({code: -1, err: result[1]});
          resolve({code: 0, msg: "收藏成功"});
        }else{
          result = await db.query('delete from collect where phone=(?) and id=(?)', [phone, id]);
          if(result[1]) return resolve({code: -1, err: result[1]});
          resolve({code: 1, msg: "取消收藏成功"});
        }
      }else{
        resolve({code: -1, err: collect.err});
      }
    })
  }
  getCollection(phone){
    return new Promise(async (resolve, reject) => {
      let collectList = [];
      let result = await db.query('select id from collect where phone=?', [phone]);
      if(result[1]) return resolve({code: -1, err: result[1]});
      async.eachSeries(
        result[0],
        async (item) => {
          let result2 = await db.query('select * from goods where id=?', [item.id]);
          if(result2[1]) return resolve({code: -1, err: result[1]});
          collectList.push(result2[0][0]);
        },
        () => {resolve({code: 0, data: collectList});}
      );
    });
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
}