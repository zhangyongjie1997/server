const goods = require("../models/goods");
const user = require("../models/user");
const Utils = require("../lib/utils");
const path = require("path");
const async = require("async");
const orderController = require("./orderController");
const UserController = require("./userController");
const { Shop } = require("../db/mongo");

class GoodsController extends Utils {
  async dbtest(req, res) {
    // new Shop({
    //   phone: '18522787303',
    //   idList: [1,2,3]
    // }).save(function(err, result){
    //   console.log(err, result)
    // });
    Shop.remove({ phone: "18522787303" }, () => {
      console.log(arguments);
    });
    //await user.deleteFromShopAll();
  }
  async getIndexList(req, res, next) {
    let that = this;
    let {sort, userPhone = 0} = req.query;
    let list = await goods.getIndexList();
    let collectList = await user.findCollect(userPhone);
    let collectListAll = await user.getCollectCount();
    if (list.code == 0) {
      let data = list.data;
      data = that.collectNum(data, collectListAll.data, collectList.data,userPhone);
      this.sortList(data, sort);
      setTimeout(() => {
        res.send({ code: 0, msg: "获取成功", data: data.slice(0, 8) }).end();
      }, 1000);
    } else {
      this.sendError(res, list.err);
    }
  }

  collectNum(dataList, collectList = [], userCollect = []) {
    dataList = dataList.map(item => {
      item.collectCount = 0;
      item.collected = userCollect.some(item2 => {
        return item2.id == item.id;
      });
      collectList.forEach(item3 => {
        if (item3.id == item.id) {
          item.collectCount = item3.count;
        }
      });
      return item;
    });
    return dataList;
  }

  async getIndexImg(req, res, next) {
    let result;
    const data = await this.getDirInfo(path.resolve(__dirname, "../../public/index/swiper"));
    if (data.code == 0) {
      result = data.data.map(item => {
        return "public/index/swiper/" + item;
      });
      res.send({ code: 0, msg: "获取成功", data: result }).end();
    }
  }
  async upload(req, res, next) {
    let result = await this.addGood(req.files, req.body.userPhone, req.body, res);
    if (result.code != 0) {
      return this.sendError(res, result.err);
    }
    res.send({ code: 0, msg: "上传成功" }).end();
  }

  uploadSingleFile(req, res, path) {
    return new Promise(async resolve => {
      
      let tmp_path = req.file.path;
      let target_path = "uploads/" + req.body.phone;
      let file_name = req.file.originalname;

      let result = await this.writeSingleFile(target_path, file_name, tmp_path);
      if (result.code == 0) {
        resolve({ code: 0, path: result.path });
      } else {
        resolve({ code: -1, err: result.err });
      }
    });
  }

  addGood(files, phone, data, res) {
    return new Promise(async resolve => {
      let cover;
      const target_path = "uploads/" + phone + "/goods";
      const result = await this.dir_exist_create(target_path);
      if (result.code != 0) return this.sendError(res, result.err);

      const result2 = await this.getDirInfo(target_path);
      if (result2.code != 0) return this.sendError(res, result2.err);

      const goodNo = result2.data.length + 1;
      const target_path2 = target_path + "/good" + goodNo;

      const result3 = await this.dir_exist_create(target_path2);
      if (result3.code != 0) return this.sendError(res, result3.err);

      for (const key in files) {
        const target_path3 = target_path2 + "/" + key;
        const result4 = await this.dir_exist_create(target_path3);

        if (result4.code != 0) return this.sendError(res, result4.err);

        files[key].forEach(async file => {
          const tmp_path = file.path;
          const file_name = file.originalname;

          if (key == "cover") {
            cover = (target_path3 + "/" + file_name).replace("uploads/", "static/");
          }

          const result5 = await this.writeSingleFile(target_path3, file_name, tmp_path);
          if (result5.code != 0) return this.sendError(res, result5.err);
        });
      }

      let result6 = await goods.insertGoods(data, goodNo, cover);
      if (result6.code != 0) return this.sendError(res, result6.err);

      resolve({ code: 0, msg: "上传成功" });
    });
  }

  async getGoodsClass(req, res, next) {
    let classList = await goods.getGoodsClass();
    if (classList.code != 0) return this.sendError(res, classList.err);
    res.send({ code: 0, msg: "获取成功", data: classList.data }).end();
  }
  async getCollecion(req, res, next) {
    let collectList = await goods.getCollection(req.body.userPhone);
    if (collectList.code != 0) return this.sendError(res, collectList.err);
    let currentPage = req.body.currentPage || 0,
      pageSize = req.body.pageSize || 0;
    let list = collectList.data.slice(pageSize * currentPage, pageSize * (currentPage + 1));
    res
      .send({
        code: 0,
        msg: "获取成功",
        data: {
          data: list,
          count: collectList.data.length
        }
      })
      .end();
  }
  async getListByClass(req, res, next) {
    let that = this;
    let classList = await goods.getListByClass(req.query.goodsClass);
    this.sortList(classList.data, req.query.sort);
    if (classList.code != 0) return this.sendError(res, classList.err);
    let collectListAll = await user.getCollectCount();
    classList.data = that.collectNum(classList.data, collectListAll.data);
    res.send({ code: 0, msg: "获取成功", data: classList.data || [] }).end();
  }
  async getGoodsListByPhone(req, res, next) {
    let that = this;
    let goodsList = await goods.getGoodsListByPhone(req.body.userPhone);
    if (goodsList.code != 0) return this.sendError(res, goodsList.err);
    let currentPage = req.body.currentPage || 0,
      pageSize = req.body.pageSize || 0;
    let list = goodsList.data
      .sort((a, b) => {
        if (this.getTimestamp(a.time) > this.getTimestamp(b.time)) return -1;
        return 1;
      })
      .slice(pageSize * currentPage, pageSize * (currentPage + 1));
    res
      .send({
        code: 0,
        msg: "获取成功",
        data: {
          data: list,
          count: goodsList.data.length
        }
      })
      .end();
  }
  payGoods(req, res) {
    let goodsInfo = [];
    async.map(req.body.goodsList, mapFunc, finalFunc);
    async function mapFunc(item, cb) {
      let result = await goods.getGoodsById(item);
      if (result.code != 0) return this.sendError(res, result.err);
      goodsInfo.push(result.data);
    }
    function finalFunc(err) {
      err && this.sendError(res, err);
      let url = orderController.pay(goodsInfo);
      res.send({ code: 0, data: url });
    }
  }

  deleteGoods(req, res) {
    let body = req.body;
    UserController.userVerify(body.userPhone, body.password).then(async result => {
      if (result.code != 0) return this.sendError(res, result.err);

      let result2 = await goods.changeGoodsStatusById(body.goodsId, "removed");
      if (result2.code != 0) return this.sendError(res, result2.err);

      // let result2 = await goods.deleteGoodsById(body.goodsId);
      // if (result2.code != 0) return this.sendError(res, result2.err);

      // let result3 = await user.deleteFormCollectAll(body.goodsId);
      // if (result3.code != 0) return this.sendError(res, result2.err);

      let result4 = await user.deleteFromShopAll(body.goodsId);
      if (result4.code != 0) return this.sendError(res, result2.err);

      res.send({ code: 0, msg: "删除成功" }).end();
    });
  }

  async resell(req, res) {
    let result = await goods.changeGoodsStatusById(req.body.goodsId, "normal");
    if (result.code != 0) return this.sendError(res, result.err);
    res.send({ code: 0, msg: "上架成功" }).end();
  }

  async getOneGoods(req, res) {
    let result = await goods.getGoodsById(req.body.id);
    if (result.code != 0) return this.sendError(res, result.err);
    res.send({ code: 0, data: result.data[0], msg: "获取成功" });
  }

}

module.exports = new GoodsController();
