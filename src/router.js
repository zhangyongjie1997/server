const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const userController = require('./controllers/userController')
const jwt = require("./lib/jwt")
const goodsController = require('./controllers/goodsController')
const multer = require('multer')

const upload = multer({ dest: './uploads/' })

router.all('*', (req, res, next) => {
  let data = req.body;
  console.log('请求参数:'+ JSON.stringify(data)+',请求路径:' + req.url);
  if(req.headers.host.indexOf('localhost') > -1 || req.headers.host.indexOf('127.0.0.1') > -1){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  }
  res.header("X-Powered-By",'3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
router.options('*', (req, res, next) => {
  res.send(200);
  res.end();
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
//token验证
router.use(jwt.verify);
//注册
router.post('/user/register', userController.register);
//登录
router.post('/user/login', userController.login);
//换头像
router.post('/user/avatar', upload.single('avatar'), userController.avatarUpload);
//修改个人信息
router.post('/user/editInfo', userController.editInfo);
//收藏
router.post('/user/collect', userController.collect);
//首页列表
router.get('/goods/indexList', goodsController.getIndexList);
//上传
router.post('/goods/upload', upload.fields([{name: 'cover', maxCount: 1}, {name:'detail', maxCount: 99}]), goodsController.upload);
//分类获取商品
router.get('/goods/classList', goodsController.getListByClass);
//获取个人收藏
router.post('/goods/getCollect', goodsController.getCollecion);
//获取商品分类
router.get('/goods/getGoodsClass', goodsController.getGoodsClass);
//首页轮播图
router.get('/index/swiper', goodsController.getIndexImg);

router.get('/index.html', (req, res, next) => {
  readfile((data) => {
    res.header('Content-Type','text/html');
    res.end(data);
  });
});

router.get('/index', (req, res, next) => {
  res.header('Content-Type','text/html');
  res.render('index.html', {});
})

module.exports = router;