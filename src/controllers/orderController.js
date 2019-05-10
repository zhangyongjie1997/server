const Utils = require("../lib/utils");
const Alipay = require("../pay/alipay");
const path = require("path");
const user = require("../models/user");
const { orderStatus } = require("../lib/config");
const goods = require("../models/goods");
const order = require("../models/order");
const async = require("async");

const ali = new Alipay({
  appId: "2016092600599391",
  notifyUrl: "http://zyjbiubiu.cn/api/pay/callback",
  rsaPrivate: path.resolve(__dirname, "../../https/pay_private.pem"),
  rsaPublic: path.resolve(__dirname, "../../https/pay_public.pem"),
  sandbox: true,
  signType: "RSA2"
});

class OrderController extends Utils {
  constructor() {
    super();
  }
  async verifyCallback(req, res, next) {
    //let result = ali.signVerify(req.body.sign);
    if (req.body.trade_status == "TRADE_SUCCESS") {
      let result = await order.orderStatusChange(orderStatus.close, req.body.out_trade_no);

      console.log(result);
    }
  }
  async pay(req, res) {
    let result = await order.getOrderById(req.body.orderId);
    if (result.code == -1) return that.sendError(res, result.err);
    let orderInfo = result.data[0];
    const orderObj = new Order(orderInfo.id, orderInfo.amount, orderInfo.phone, orderInfo.status);
    let payParams = orderObj.getParams();
    let url = ali.webPay(payParams);
    let url_API = "https://openapi.alipaydev.com/gateway.do?" + url;
    res.send({ code: 0, data: { orderId: orderObj.id, url: url_API } }).end();
  }
  static getAmount(goods) {
    let amount = 0;
    goods.forEach(item => {
      amount += item.price * item.shopCount;
    });
    return Number(amount).toFixed(2);
  }
  async personalOrder(req, res) {
    let result = await order.getOrderByPhone(req.body.userPhone);
    if (result.code == -1) return that.sendError(res, result.err);
    res.send({ code: 0, data: result.data, msg: "成功" }).end();
  }
  async orderCancel(req, res) {
    let result = order.orderStatusChange(orderStatus.fail, req.body.orderId);
    let result2 = await ali.close({
      outTradeId: req.body.out_trade_no,
      trade_no: req.body.trade_no,
      operator_id: "001"
    });
    if (result.code == -1) return that.sendError(res, result.err);
    res.send({ code: 0, msg: "成功" }).end();
  }
  async addOrder(goodsList, phone, shopId) {
    return new Promise(async resolve => {
      const orderObj = new Order(Utils.getTimestamp(), OrderController.getAmount(goodsList), phone, orderStatus.wait, shopId);
      async.eachSeries(
        goodsList,
        async goodsItem => {
          let result2 = await goods.changeGoodsStatusById(goodsItem.id, 'selled', orderObj.id);
          if(result2.code != 0) throw new Error(result2.err.message);
        },
        async (err) => {
          if(err){
            result.code = -1;
            result.err = err;
            return resolve(result);
          }
          let result = await order.addOrder(orderObj);
          result.order = orderObj;
          resolve(result);
        }
      );
    });
  }
  async orderCommit(req, res) {
    let that = this;
    let shop = await user.findShopByPhone(req.body.userPhone);
    if (shop.code == -1) return this.sendError(res, shop.err);
    let idList = shop.data.idList,
      goodsList = [];
    async.eachSeries(
      idList,
      async idItem => {
        let goodsItem = await goods.getGoodsById(idItem.id);
        if (goodsItem.code == -1) return this.sendError(res, goodsItem.err);
        goodsItem.data[0].shopCount = idItem.count;
        goodsList.push(goodsItem.data[0]);
      },
      async () => {
        let result = await that.addOrder(goodsList, req.body.userPhone, shop.data.id);
        if (result.code == -1) return that.sendError(res, result.err);
        that.startOrderJob(result.order.id);
        return res.send({ code: 0, data: result.order, msg: "成功" }).end();
      }
    );
  }

  startOrderJob(orderId){  //15分钟后判断订单是否超时
    setTimeout(async () => {
      let result = await order.getOrderById(orderId);
      if(result.code == -1) return startOrderJob(orderId);

      let orderObj = result.data[0];

      if(orderObj.status == 2){
        async.parallel(
          [changeStatus, releaseGoods],
          err => {}
        );
      }

      async function changeStatus(callback){
        await order.orderStatusChange(orderStatus.fail, orderObj.id);
        callback(null);
      }

      async function releaseGoods(callback){
        await goods.releaseGoodsByOrder(orderObj.id);
        callback(null);
      }
    }, 1000 * 60 * 15);  //设置订单的超时时间为15分钟
  }
  
  async getOrderStatus(req, res) {
    let result = await order.getOrderById(req.body.orderId);
    if (result.code == -1) return this.sendError(res, result.err);
    return res.send({ code: 0, data: result.data[0] }).end();
  }
}

class Order {
  constructor(id = "", amount = "", phone = "", status = "", shop = "") {
    var orderParams = {
      body: "ttt",
      subject: "订单支付",
      timeout: "90m",
      sellerId: "",
      outTradeId: Utils.getTimestamp(),
      product_code: "FAST_INSTANT_TRADE_PAY",
      goods_type: "1",
      return_url: "http://39.107.88.223/personal"
    };
    this.id = id;
    this.amount = amount;
    this.phone = phone;
    this.status = status;
    this.shop = shop;
    this.getParams = function() {
      return {
        ...orderParams,
        outTradeId: this.id,
        amount: this.amount
      };
    };
  }
}

module.exports = new OrderController();
