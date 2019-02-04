"use strict";
const express = require('express');
const path = require('path');
const fs = require('fs');
const url = require('url');
const router = express.Router();
const userController = require('./controllers/userController');
const indexController = require('./controllers/indexController');
const jwt = require("./lib/jwt");
const goods = require('./controllers/goods');
const multer = require('multer');
const upload = multer({ dest: './uploads/' });
router.all('*', (req, res, next) => {
    let data = req.body;
    console.log('请求参数:' + JSON.stringify(data) + ',请求路径:' + req.url);
    if (req.headers.host.indexOf('localhost') > -1 || req.headers.host.indexOf('127.0.0.1') > -1) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    }
    res.header("X-Powered-By", '3.2.1');
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
        }
        else {
            callback && callback(data);
        }
    });
}
router.use(jwt.verify);
router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.post('/user/avatar', upload.single('avatar'), userController.avatarUpload);
router.post('/user/editInfo', userController.editInfo);
router.post('/user/collect', userController.collect);
router.get('/goods/indexList', goods.getIndexList);
router.post('/goods/upload', upload.single('avatar'), goods.upload);
router.get('/goods/getGoodsClass', goods.getGoodsClass);
router.get('/index/swiper', indexController.getIndexImg);
router.get('/index.html', (req, res, next) => {
    readfile((data) => {
        res.header('Content-Type', 'text/html');
        res.end(data);
    });
});
router.get('/index', (req, res, next) => {
    res.header('Content-Type', 'text/html');
    res.render('index.html', {});
});
module.exports = router;
