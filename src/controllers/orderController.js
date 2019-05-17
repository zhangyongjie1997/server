const Utils = require("../lib/utils");
const Alipay = require("../pay/alipay");
const path = require("path");
const user = require("../models/user");
const { orderStatus, orderTimeout } = require("../lib/config");
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
      let result = await order.orderStatusChange(req.body.out_trade_no, orderStatus.close);

      console.log(result);
    }
  }

  async pay(req, res) {
    let result = await order.getOrderById(req.body.orderId);
    if (result.code == -1) return this.sendError(res, result.err);
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
    if (result.code == -1) return this.sendError(res, result.err);
    res.send({ code: 0, data: result.data, msg: "成功" }).end();
  }

  async orderCancel(req, res) {
    let result = await order.orderStatusChange(req.body.orderId, orderStatus.fail);

    await goods.releaseGoodsByOrder(req.body.orderId);
    if (result.code != 0) return this.sendError(res, result.err);
    res.send({ code: 0, msg: "成功" }).end();
  }

  async addOrder(goodsList, phone, shopId, address) {
    return new Promise(async resolve => {
      const orderObj = new Order(Utils.getTimestamp(), OrderController.getAmount(goodsList), phone, orderStatus.wait, shopId, address);
      async.eachSeries(
        goodsList,
        async goodsItem => {
          let result2 = await goods.changeGoodsStatusById(goodsItem.id, 'selled', orderObj.id);
          if(result2.code != 0) throw new Error(result2.err.message);
        },
        async (err) => {
          let result = await order.addOrder(orderObj);
          if(err){
            result.code = -1;
            result.err = err;
            return resolve(result);
          }
          result.order = orderObj;
          resolve(result);
        }
      );
    });
  }

  async orderCommit(req, res) {
    let that = this, address = req.body.address;
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
        let result = await that.addOrder(goodsList, req.body.userPhone, shop.data.id, address);
        if (result.code == -1) return that.sendError(res, result.err);
        that.startOrderJob(result.order.id);
        return res.send({ code: 0, data: result.order, msg: "成功" }).end();
      }
    );
  }

  getShopGoods(idList){
    return new Promise(resolve => {
      let goodsList = [];
      async.eachSeries(
        idList,
        async idItem => {
          let goodsItem = await goods.getGoodsById(idItem.id);
          if (goodsItem.code == -1) throw new Error(goodsItem.err.message);
          if(!goodsItem.data) return;
          goodsItem.data[0].shopCount = idItem.count;
          goodsList.push(goodsItem.data[0]);
        },
        (err) => {
          if(err) return resolve({code: -1, err});
          return resolve({ code: 0, data: goodsList});
        }
      );
    });
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
        await order.orderStatusChange(orderObj.id, orderStatus.fail);
        // await ali.close({
        //   outTradeId: req.body.out_trade_no,
        //   trade_no: req.body.trade_no,
        //   operator_id: "001"
        // });
        console.log('订单自动取消');
        callback(null);
      }

      async function releaseGoods(callback){
        await goods.releaseGoodsByOrder(orderObj.id);
        callback(null);
      }
    }, orderTimeout);  //设置订单的超时时间为15分钟
  }
  
  async getOrderStatus(req, res) {
    let result = await order.getOrderById(req.body.orderId);
    if (result.code == -1) return this.sendError(res, result.err);
    return res.send({ code: 0, data: result.data[0] }).end();
  }

  async getOrderDetail(req, res){
    let orderId = req.body.orderId;
    let result = await order.getOrderById(orderId);
    if (result.code == -1) return this.sendError(res, result.err);

    let orderInfo = result.data[0];
    let result2 = await user.findShopById(orderInfo.shop);
    if (result2.code == -1) return this.sendError(res, result.err);

    let shopInfo = result2.data, goodsList = [];
    let result3 = await this.getShopGoods(shopInfo.idList);
    if (result3.code == -1) return this.sendError(res, result.err);

    orderInfo.goods = result3.data;
    res.send({code: 0, data: orderInfo, msg: '成功'});
  }
}

class Order {
  constructor(id = "", amount = "", phone = "", status = "", shop = "", address = "") {
    var orderParams = {
      body: "给钱",
      subject: "订单支付",
      timeout: "90m",
      sellerId: "",
      outTradeId: Utils.getTimestamp(),
      product_code: "FAST_INSTANT_TRADE_PAY",
      goods_type: "1",
      return_url: "http://zyjbiubiu.cn/personal"
    };
    this.id = id;
    this.amount = amount;
    this.phone = phone;
    this.status = status;
    this.shop = shop;
    this.address = typeof address == 'string' ? address : JSON.stringify(address);
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
