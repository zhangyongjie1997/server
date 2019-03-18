const aliPayHelper = require('../pay/AliPayHelper')
const utils = require('../lib/utils')
const api = require('../request/request')
const iconv = require('iconv-lite')
const Alipay = require('../pay/alipay')
const path = require('path')

class payController{
  constructor(){}
  verifyCallback(req, res, next){
    aliPayHelper.verifySign(req.body);
  }
  pay(req, res, next){
    const ali = new Alipay({
      appId: '2016092600599391',
      notifyUrl: 'http://39.107.88.223/api/pay/callback',
      rsaPrivate: path.resolve(__dirname, '../../https/pay_private.pem'),
      rsaPublic: path.resolve(__dirname, '../../https/pay_public.pem'),
      sandbox: true,
      signType: 'RSA2'
    });

    let url=  ali.webPay({
      body: "ttt",
      subject: "ttt1",
      outTradeId: utils.getTimestamp(),
      timeout: '90m',
      amount: "0.1",
      sellerId: '',
      product_code: 'FAST_INSTANT_TRADE_PAY',
      goods_type: "1",
      return_url: "127.0.0.1:3000",
    });
    let url_API = 'https://openapi.alipaydev.com/gateway.do?' + url;
    res.json({url: url_API});
  }
}

module.exports = new payController();