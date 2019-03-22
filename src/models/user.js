const db = require('../db/db')
const Utils = require('../lib/utils')
const { Shop } = require('../db/mongo')
const async = require('async')

class User extends Utils{
  constructor(){
    super();
    this.promiseify = this.promiseify;
  }

  findUserByPhone(phone) {
    return new Promise(async (resolve, reject) => {
      let res = await db.query('select * from user where phone=(?)', [phone]);
      if (res[1]) return reject(res[1]);
      resolve(res[0]);
    });
  }
  addUser(data) {
    return new Promise(async (resolve, reject) => {
      let res = await db.query('insert into user values(?,?,?,?,?)', data);
      if (res[1]) return reject(res[1]);
      let newUserList = await this.findUserByPhone(data[0]);
      resolve(newUserList[0]);
    });
  }
  findLoginByPhone(phone) {
    return new Promise(async (resolve, reject) => {
      let res = await db.query('select * from login where phone=(?)', [phone]);
      if (res[1]) return reject(res[1])
      resolve(res[0]);
    });
  }
  async addLoginUser(phone, token) {
    let res = await this.findLoginByPhone(phone);
    if (res.length > 0) {
      db.query('update login set token=(?) where phone=(?)', [token, phone]);
    } else {
      db.query('insert into login values(?,?)', [phone, token])
    }
  }
  updateInfo(userPhone, phone, nick_name){
    return new Promise(async (resolve, reject) => {
      let result = await db.query('update user set phone=(?),nick_name=(?) where phone=(?)', [phone, nick_name, userPhone]);
      if(result[1]){
        resolve({code: -1, err: result[1]});
      }else{
        let newUserList = await this.findUserByPhone(phone);
        resolve({code: 0, data: newUserList[0]});
      }
    });
  }
  findCollect(phone, id){
    return new Promise(async (resolve, reject) => {
      if(!phone && !id){}
      let result = await db.query(`select * from collect ${phone ? id ? ' where phone=(?) and id=(?)' : ' where phone=(?)' : ''}`, [phone, id]);
      if(result[1]) return resolve({code: -1, err: result[1]});
      resolve({code: 0, data: result[0]});
    });
  }
  getCollectCount(){
    return new Promise(async (resolve, reject) => {
      let result = await db.query('select count(id) as count,id,phone from collect group by id');
      if(result[1]) return resolve({code: -1, err: result[1]});
      resolve({code: 0, data: result[0]});
    });
  }
  collect(phone, id){
    return new Promise(async (resolve, reject) => {
      let collect = await this.findCollect(phone, id), result;
      if(collect.code == 0){
        if(collect.data.length <= 0){
          result = await db.query('insert into collect values(?,?,?)', [phone, id, this.formatDate(new Date())]);
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
    });
  }
  updateAvatar(path, phone) {
    db.query('update user set avatar=(?) where phone=(?)', [path, phone]);
  }
  uploadAvatar(req) {
    return new Promise(async (resolve, reject) => {
      let ExtensionName = req.file.mimetype.split('/')[1];
      let tmp_path = req.file.path;
      let target_path = 'uploads/' + req.body.phone;
      let file_name = 'avatar.' + ExtensionName;
      let result = await this.writeSingleFile(target_path, file_name, tmp_path);
      if (result.code == 0) {
        resolve({code: 0, path: result.path});
      } else {
        resolve({code: -1, err: result.err});
      }
    });
  }
  userWriteSingleFile(req, res, path, avatar) {
    return new Promise(async (resolve, reject) => {
      let tmp_path = req.file.path;
      let target_path = 'uploads/' + req.body.phone;
      let file_name = avatar || req.file.originalname;
      let result = await this.writeSingleFile(target_path, file_name, tmp_path);
      if (result.code == 0) {
        resolve({code: 0, path: result.path});
      } else {
        resolve({code: -1, err: result.err});
      }
    });
  }
  getOneCollect(phone, id){
    return new Promise(async resolve => {
      let result = await db.query('select * from collect where phone=? and id=?', [phone, id]);
      if(result[1]) return resolve({code: -1, err: result[1]});
      resolve({code: 0, data: result[0]});
    });
  }
  findShopByPhone(phone){
    return new Promise(resolve => {
      Shop.findOne({
        phone
      }, (err, result) => {
        if(err) return resolve({code: -1, err});
        return resolve({code: 0, data: result});
      });
    });
  }
  addShop(phone, list){
    return new Promise(async resolve => {
      Shop.updateOne({phone}, {idList: list}, (err, result) => {
        if(err) return resolve({code: -1, err});
        return resolve({code: 0, data: result});
      });
    });
  }
  addNewShop(phone, id, count){
    return new Promise(resolve => {
      new Shop({phone, idList: [{id, count}]})
       .save((err, result) => {
          if(err) return resolve({code: -1, err});
          return resolve({code: 0, data: result});
       });
    });
  }
  deleteFormCollectAll(id){
    return new Promise(async resolve => {
      let result = await db.query('delete from collect where id=?', [id]);
      if(result[1]) return resolve({code: -1, err: result[1]});
      resolve({code: 0, data: result[0]});
    });
  }
  deleteFromShopAll(id){
    return new Promise(resolve => {
      Shop.find({}, (err, data) => {
        if(err) return resolve({code: -1, err});
        async.eachSeries(data, async (shopItem) => {
          if(shopItem.idList.indexOf(Number(id)) != -1 || shopItem.idList.indexOf(String(id)) != -1){
            let list = shopItem.idList.filter(item => item != id);
            await this.addShop(shopItem.phone, list);
          }
        }, (err, result) => {
          if(err) return resolve({code: -1, err});
          return resolve({code: 0});
        });
      });
    });
  }
}
module.exports = new User();