const db = require("../db/db");
const Utils = require("../lib/utils");
const { Shop } = require("../db/mongo");
const async = require("async");
const { orderStatus } = require("../lib/config");

class User extends Utils {
  constructor() {
    super();
    this.promiseify = this.promiseify;
  }

  findUserByPhone(phone) {
    return new Promise(async (resolve, reject) => {
      let res = await db.query("select * from user where phone=(?)", [phone]);
      if (res[1]) return reject(res[1]);
      resolve(res[0]);
    });
  }

  addUser(data) {
    return new Promise(async (resolve, reject) => {
      let res = await db.query("insert into user values(?,?,?,?,?)", data);
      if (res[1]) return reject(res[1]);
      let newUserList = await this.findUserByPhone(data[0]);
      resolve(newUserList[0]);
    });
  }

  findLoginByPhone(phone) {
    return new Promise(async (resolve, reject) => {
      let res = await db.query("select * from login where phone=(?)", [phone]);
      if (res[1]) return reject(res[1]);
      resolve(res[0]);
    });
  }

  async addLoginUser(phone, token) {
    let res = await this.findLoginByPhone(phone);
    if (res.length > 0) {
      db.query("update login set token=(?) where phone=(?)", [token, phone]);
    } else {
      db.query("insert into login values(?,?)", [phone, token]);
    }
  }

  updateInfo(userPhone, phone, nick_name) {
    return new Promise(async (resolve, reject) => {
      let result = await db.query("update user set phone=(?),nick_name=(?) where phone=(?)", [
        phone,
        nick_name,
        userPhone
      ]);
      if (result[1]) {
        resolve({ code: -1, err: result[1] });
      } else {
        let newUserList = await this.findUserByPhone(phone);
        resolve({ code: 0, data: newUserList[0] });
      }
    });
  }

  changePwd(phone, pwd) {
    return new Promise(async resolve => {
      let result = await db.query("update user set password=? where phone=?", [phone, pwd]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, data: result[0] });
    });
  }

  findCollect(phone, id) {
    return new Promise(async (resolve, reject) => {
      if (!phone && !id) {
      }
      let result = await db.query(
        `select * from collect ${phone ? (id ? " where phone=(?) and id=(?)" : " where phone=(?)") : ""}`,
        [phone, id]
      );
      if (result[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, data: result[0] });
    });
  }

  getCollectCount() {
    return new Promise(async (resolve, reject) => {
      let result = await db.query("select count(id) as count,id,phone from collect group by id");
      if (result[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, data: result[0] });
    });
  }

  /**
   *
   * @param {*} phone
   * @param {*} id
   */
  collect(phone, id) {
    return new Promise(async (resolve, reject) => {
      let collect = await this.findCollect(phone, id),
        result;
      if (collect.code == 0) {
        if (collect.data.length <= 0) {
          result = await db.query("insert into collect values(?,?,?)", [phone, id, this.formatDate(new Date())]);
          if (result[1]) return resolve({ code: -1, err: result[1] });
          resolve({ code: 0, msg: "收藏成功" });
        } else {
          result = await db.query("delete from collect where phone=(?) and id=(?)", [phone, id]);
          if (result[1]) return resolve({ code: -1, err: result[1] });
          resolve({ code: 1, msg: "取消收藏成功" });
        }
      } else {
        resolve({ code: -1, err: collect.err });
      }
    });
  }

  /**
   *
   * @param {*} path
   * @param {*} phone
   */
  updateAvatar(path, phone) {
    db.query("update user set avatar=(?) where phone=(?)", [path, phone]);
  }

  /**
   *
   * @param {*} req
   */
  uploadAvatar(req) {
    return new Promise(async (resolve, reject) => {
      let ExtensionName = req.file.mimetype.split("/")[1];
      let tmp_path = req.file.path;
      let target_path = "uploads/" + req.body.phone;
      let file_name = "avatar." + ExtensionName;
      let result = await this.writeSingleFile(target_path, file_name, tmp_path);
      if (result.code == 0) {
        resolve({ code: 0, path: result.path });
      } else {
        resolve({ code: -1, err: result.err });
      }
    });
  }

  userWriteSingleFile(req, res, path, avatar) {
    return new Promise(async (resolve, reject) => {
      let tmp_path = req.file.path;
      let target_path = "uploads/" + req.body.phone;
      let file_name = avatar || req.file.originalname;
      let result = await this.writeSingleFile(target_path, file_name, tmp_path);
      if (result.code == 0) {
        resolve({ code: 0, path: result.path });
      } else {
        resolve({ code: -1, err: result.err });
      }
    });
  }

  getOneCollect(phone, id) {
    return new Promise(async resolve => {
      let result = await db.query("select * from collect where phone=? and id=?", [phone, id]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, data: result[0] });
    });
  }

  findShopByPhone(phone) {
    return new Promise(resolve => {
      Shop.findOne(
        {
          phone
        },
        (err, result) => {
          if (err) return resolve({ code: -1, err });
          return resolve({ code: 0, data: result });
        }
      );
    });
  }

  addShop(phone, list) {
    return new Promise(async resolve => {
      Shop.updateOne({ phone }, { idList: list }, (err, result) => {
        if (err) return resolve({ code: -1, err });
        return resolve({ code: 0, data: result });
      });
    });
  }

  addNewShop(phone, id, count) {
    return new Promise(resolve => {
      new Shop({ phone, idList: [{ id, count }] }).save((err, result) => {
        if (err) return resolve({ code: -1, err });
        return resolve({ code: 0, data: result });
      });
    });
  }

  deleteFormCollectAll(id) {
    return new Promise(async resolve => {
      let result = await db.query("delete from collect where id=?", [id]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, data: result[0] });
    });
  }

  deleteFromShopAll(id) {
    return new Promise(resolve => {
      Shop.find({}, (err, data) => {
        if (err) return resolve({ code: -1, err });
        async.eachSeries(
          data,
          async shopItem => {
            if (shopItem.idList.indexOf(Number(id)) != -1 || shopItem.idList.indexOf(String(id)) != -1) {
              let list = shopItem.idList.filter(item => item != id);
              await this.addShop(shopItem.phone, list);
            }
          },
          (err, result) => {
            if (err) return resolve({ code: -1, err });
            return resolve({ code: 0 });
          }
        );
      });
    });
  }

  /**
   * @method 添加评论，分两种情况，noPath，添加回复或者是添加root
   * @param {*} data 
   * @param {*} noPath 
   */
  createComment(data, noPath) {
    return new Promise(async resolve => {
      let commentId = Utils.getTimestamp(), commentType = 0;
      if(noPath) commentType = 1;
      let result = await db.query("insert into comment values(?,?,?,?,?)", [
        commentId,
        data.content,
        data.goodsId,
        data.userPhone,
        commentType
      ]);
      if (result[1]) return resolve({ code: -1, err: result[1] });

      if (!noPath) {
        let result2 = await db.query("insert into comment_path values(?,?,?)", [commentId, commentId, 0]);
        if (result2[1]) return resolve({ code: -1, err: result2[1] });
      }

      resolve({ code: 0, data: { commentId } });
    });
  }

  /**
   * @method 为每个评论建立层级关系
   * @param {*} commentId 
   * @param {*} parentCommentId 
   */
  addPath(commentId, parentCommentId) {
    return new Promise(async resolve => {
      let result = await db.query(
        "insert into comment_path (comment, sub_comment, depath) select cp.comment, ?, cp.depath+1 from comment_path as cp where cp.sub_comment=? union all select ?, ?, 0",
        [commentId, parentCommentId, commentId, commentId]
      );
      if (result[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, data: { commentId } });
    });
  }

  /**
   * @method 获取root评论
   * @param {*} goodsId 
   */
  getComment0(goodsId) {
    return new Promise(async resolve => {
      let result = await db.query("select c.*,u.* from comment c join user u on(c.user=u.phone) where c.goods=? and c.type=0", [
        goodsId
      ]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, data: result[0] });
    });
  }

  /**
   * @method 查找root下的所有回复
   * @param {*} commentId 
   */
  getSubComment(commentId) {
    let that = this;
    return new Promise(async resolve => {
      let result = await db.query(
        "select c.*,cp.*,u.* from comment c join comment_path cp on (c.id = cp.sub_comment) join user u on (c.user=u.phone) where cp.comment=? and c.type=1",
        [commentId]
      );

      if (result[1]) return resolve({ code: -1, err: result[1] });

      let childComments = result[0];
      async.eachSeries(
        childComments,
        async childCommentItem => {
          if(childCommentItem.depath >= 1){  //如果不是直接回复的root，就查找他的父级
            let parent = await that.getParentComment(childCommentItem.id);
            if (parent.code == -1) throw new Error(result.err.message);
            childCommentItem.parent = parent.data[0];
          }
        },
        (err) => {
          if (result.code == -1) throw new Error(result.err.message);
          resolve({ code: 0, data: childComments });
        }
      );
    });
  }

  /**
   * @method 获取父级
   * @param {*} commentId 
   */
  getParentComment(commentId){
    return new Promise(async resolve => {
      //获取父id
      let result = await db.query('select comment from comment_path where sub_comment=? and depath=1', [commentId]);
      if (result[1]) return resolve({ code: -1, err: result[1] });

      let result2 = await db.query('select c.*,u.* from comment c join user u on(c.user=u.phone) where c.id=?', [result[0][0].comment]);
      if (result2[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, data: result2[0] });

    });
  }
  getComment1(goodsId) {
    return new Promise(async resolve => {
      let result = await db.query(
        "select c.*,u.* from comment c join user u on(c.user=u.phone) where c.goods=?", 
        [goodsId]
      );
      console.log(result);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, data: result[0] });
    });
  }
}
module.exports = new User();
