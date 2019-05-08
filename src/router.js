const express = require('express')
const path = require('path')
const fs = require('fs')
const jwt = require("./lib/jwt")
const multer = require('multer')
const router = express.Router()
const UserController = require('./controllers/userController')
const goodsController = require('./controllers/goodsController')
const orderController = require('./controllers/orderController')

const userController = new UserController()

const upload = multer({ dest: './uploads/' })

router.options('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.send(200);
  res.end();
});

router.all('*', (req, res, next) => {
  let data = req.body;
  req.url = req.url.replace('/api', '');
  console.log(',请求路径:' + req.url + '请求参数:'+ JSON.stringify(data));
  if(req.headers.host.indexOf('localhost') > -1 || req.headers.host.indexOf('127.0.0.1') > -1){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  }
  if(req.url.indexOf('/static') != -1){
    req.url = decodeURIComponent(req.url);
  }
  res.header("X-Powered-By",'3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  jwt.verify(req, res, next);
  //next();
});

// //token验证
// router.all('*', jwt.verify);
//注册
router.post('/user/register', userController.register.bind(userController));
//登录
router.post('/user/login', userController.login.bind(userController));
//换头像
router.post('/user/avatar', upload.single('avatar'), userController.avatarUpload.bind(userController));
//修改个人信息
router.post('/user/editInfo', userController.editInfo.bind(userController));
//修改密码
router.post('/user/changePwd', userController.changePwd.bind(userController));
//收藏
router.post('/user/collect', userController.collect.bind(userController));
//获取用户信息
router.post('/user/getUserByPhone', userController.getUserByPhone.bind(userController));
//首页列表
router.get('/goods/indexList', goodsController.getIndexList.bind(goodsController));
//添加购物车
router.post('/user/addShop', userController.addShop.bind(userController));
//购物车中是否已存在某商品
router.post('/user/shopHadGoods', userController.shopHadGoods.bind(userController));
//获取购物车
router.post('/user/getShop', userController.getShop.bind(userController));
//购物车编辑提交
router.post('/user/editShopSubmit', userController.editShopSubmit.bind(userController));
//上传
router.post('/goods/upload', upload.fields([{name: 'cover', maxCount: 1}, {name:'detail', maxCount: 99}]), goodsController.upload.bind(goodsController));
//分类获取商品
router.get('/goods/classList', goodsController.getListByClass.bind(goodsController));
//获取个人商品
router.post('/goods/personalGoods', goodsController.getGoodsListByPhone.bind(goodsController));
//判断有没有收藏
router.post('/user/judgeCollect', userController.judgeCollect.bind(userController));
//获取个人收藏
router.post('/goods/getCollect', goodsController.getCollecion.bind(goodsController));
//获取商品分类
router.get('/goods/getGoodsClass', goodsController.getGoodsClass.bind(goodsController));
//首页轮播图
router.get('/index/swiper', goodsController.getIndexImg.bind(goodsController));
///goods/getOne
router.post('/goods/getOne', goodsController.getOneGoods.bind(goodsController));
//支付回调
router.all('/pay/callback', orderController.verifyCallback.bind(orderController));
//支付
router.post('/pay/pay', goodsController.payGoods.bind(goodsController));
//下架商品
router.post('/goods/delete', goodsController.deleteGoods.bind(goodsController));
//提交订单
router.post('/user/orderCommit', orderController.orderCommit.bind(orderController));
//订单支付
router.post('/order/pay', orderController.pay.bind(orderController));
//取消订单
router.post('/order/cancel', orderController.orderCancel.bind(orderController));
//获取个人订单
router.post('/order/personalOrder', orderController.personalOrder.bind(orderController));
//获取订单状态
router.post('/user/orderStatus', orderController.getOrderStatus.bind(orderController));
//添加评论
router.post('/user/comment/create', userController.createComment.bind(userController));
//获取顶层评论
router.post('/user/getComment0', userController.getComment_layer0.bind(userController));
//dbtest
router.all('/mongo', goodsController.dbtest.bind(goodsController));
//获取城市列表
router.get('/user/cityList', userController.getCityList.bind(userController));

router.get('/index.html', (req, res, next) => {
  readfile((data) => {
    res.header('Content-Type','text/html');
    res.end(data);
  });
});

router.get('/index', (req, res, next) => {
  res.header('Content-Type','text/html');
  res.render('index.html', {});
});

function readfile(callback) {
  fs.readFile(path.join(__dirname, "./", './views', "index.html"), "utf-8", (err, data) => {
    if (err || data.length == 0) {
      callback && callback(err);
    } else {
      callback && callback(data);
    }
  });
}

module.exports = router;