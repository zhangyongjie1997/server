const Mock = require("mockjs");
const Utils = require("../lib/utils");
const db = require("../db/db");
const async = require("async");
const path = require("path");
const goodsStatus = require('../lib/config').goodsStatus;

class Goods extends Utils {
  constructor() {
    super();
  }
  async getIndexList() {
    let data = [];
    return new Promise(async resolve => {
      let res = await db.query("select * from goods");
      if (res[1]) return resolve({ code: -1, err: res[1] });
      resolve({ code: 0, data: res[0] });
    });
  }

  createGoods() {
    return Mock.mock({
      "list|5": [
        {
          "id|+1": 1,
          time: "@datetime",
          name: "@ctitle()",
          describe: "@cparagraph()",
          phone: /^1[385][1-9]\d{8}/,
          "price|1-2999.2": 99.0,
          "class|1-6": 1,
          cover: ""
        }
      ]
    });
  }

  addGoods() {
    let goods = this.createGoods().list;
    goods.forEach(async item => {
      let data = [];
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          data.push(item[key]);
        }
      }
      data.push("public/index/img/good.jpeg");
      let res = await db.query("insert into goods values(?,?,?,?,?,?,?,?)", data);
    });
  }

  upload(request, response, next) {
    response.end(JSON.stringify({ code: 0 }));
  }

  insertGoods(data, id, cover) {
    let _this = this;
    return new Promise(async resolve => {
      let result = await db.query("insert into goods values(?,?,?,?,?,?,?,?,?,?);", [
        await _this.getNextGoodsId(),
        _this.getDateTime(),
        data.name,
        data.describe || "",
        data.userPhone,
        data.price,
        data.goodsClass,
        cover,
        goodsStatus['normal'],
        ''
      ]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, msg: "成功" });
    });
  }

  async getNextGoodsId() {
    let result = await db.query("select max(id) from goods");
    if (!result[0][0]["max(id)"]) return 0;
    return result[0][0]["max(id)"] * 1 + 1;
  }

  getGoodsClass() {
    return new Promise(async resolve => {
      let result = await this.readFile(path.resolve(__dirname, "../../public/goods/goodsClass.json"));
      if (result.code != 0) return resolve({ code: -1, err: result.err });
      resolve({ code: 0, data: result.data });
    });
  }

  getCollection(phone) {
    return new Promise(async resolve => {
      let collectList = [];
      let result = await db.query("select id,time from collect where phone=?", [phone]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      async.eachSeries(
        result[0],
        async item => {
          let result2 = await db.query("select * from goods where id=?", [item.id]);
          if (result2[1]) return resolve({ code: -1, err: result[1] });
          if (result2[0][0]) {
            result2[0][0].collectTime = item.time;
            collectList.push(result2[0][0]);
          }
        },
        () => {
          resolve({ code: 0, data: collectList.reverse() });
        }
      );
    });
  }

  getListByClass(goodsClass) {
    return new Promise(async resolve => {
      let querySql = "select * from goods where class=?";
      if (goodsClass == 0) {
        querySql = "select * from goods";
      }
      let result = await db.query(querySql, [goodsClass]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      return resolve({ code: 0, data: result[0] });
    });
  }

  getGoodsListByPhone(phone) {
    return new Promise(async resolve => {
      let result = await db.query("select * from goods where phone=?", [phone]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      return resolve({ code: 0, data: result[0] });
    });
  }

  getGoodsById(id) {
    return new Promise(async resolve => {
      let result = await db.query("select * from goods where id=?", [id]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      return resolve({ code: 0, data: result[0] });
    });
  }

  deleteGoodsById(id) {
    return new Promise(async resolve => {
      let result = await db.query("delete from goods where id=?", [id]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      return resolve({ code: 0, data: result[0] });
    });
  }

  changeGoodsStatusById(id, status = 'normal', orderId){
    return new Promise(async resolve => {
      if(orderId){
        let result = await db.query("update goods set status=?,order2=? where id=?", [goodsStatus[status], orderId, id]);
        if (result[1]) return resolve({ code: -1, err: result[1] });
        return resolve({ code: 0, data: result[0] });
      }else{
        let result = await db.query("update goods set status=? where id=?", [goodsStatus[status], id]);
        if (result[1]) return resolve({ code: -1, err: result[1] });
        return resolve({ code: 0, data: result[0] });
      }
    });
  }

  removeGoodsById(id){
    return new Promise(async resolve => {
      let result = await db.query("update goods set status=? where id=?", [goodsStatus.removed, id]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      return resolve({ code: 0, data: result[0] });
    });
  }

  getGoodsByOrder(orderId){
    return new Promise(async resolve => {
      let result = await db.query('select * from goods where order2=?', [orderId]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      return resolve({ code: 0, data: result[0] });
    });
  }


  /**
   * @method 订单进入失败状态后释放相关的作品
   * @param {*} orderId 
   */
  releaseGoodsByOrder(orderId){
    let that = this;
    return new Promise(async resolve => {
      let result = await this.getGoodsByOrder(orderId);
      if (result[1]) return resolve({ code: -1, err: result[1] });

      let goodsList = result.data;
      async.eachSeries(
        goodsList,
        async goodsItem => {
          let result2 = await that.changeGoodsStatusById(goodsItem.id, 'normal');
          if(result2[1]) throw new Error(result2.message);
        },
        err => {
          if(err) return resolve({code: -1, err});
          resolve({code: 0});
        }
      );
    });
  }
}

module.exports = new Goods();
