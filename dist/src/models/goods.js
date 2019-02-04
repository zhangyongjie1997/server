"use strict";
const Mock = require('mockjs');
const fs = require('fs');
const utils = require('../lib/utils');
const db = require('../db/db');
class Goods {
    constructor() { }
    async getIndexList() {
        let data = [];
        return new Promise(async (resolve, reject) => {
            let res = await db.query('select * from goods');
            if (res[1])
                return resolve({
                    code: -1,
                    err: res[1]
                });
            resolve({
                code: 0,
                data: res[0]
            });
        });
    }
    createGoods() {
        return Mock.mock({
            'list|25': [{
                    'id|+1': 1,
                    "time": "@datetime",
                    "name": "@ctitle()",
                    "describe": "@cparagraph()",
                    'phone': /^1[385][1-9]\d{8}/,
                    'price|1-2999.2': 99.00
                }]
        });
    }
    addGoods() {
        let goods = this.createGoods().list;
        goods.forEach(item => {
            let data = [];
            data.push(item['id']);
            data.push(item['time']);
            data.push(item['name']);
            data.push(item['describe']);
            data.push(item['phone']);
            data.push(item['price']);
            db.query('insert into goods value(?,?,?,?,?,?)', data);
        });
    }
    upload(request, response, next) {
        response.end(JSON.stringify({
            code: 0
        }));
    }
    uploadSingleFile(req, res, path) {
        return new Promise(async (resolve, reject) => {
            let tmp_path = req.file.path;
            let target_path = 'uploads/' + req.body.phone;
            let file_name = req.file.originalname;
            let result = await utils.writeSingleFile(target_path, file_name, tmp_path);
            if (result.code == 0) {
                resolve({
                    code: 0,
                    path: result.path
                });
            }
            else {
                resolve({
                    code: -1,
                    err: result.err
                });
            }
        });
    }
    getGoodsClass() {
        return new Promise(async (resolve, reject) => {
            let result = await utils.readFile('public/goods/goodsClass.json');
            if (result.code != 0)
                return resolve({ code: -1, err: result.err });
            resolve({ code: 0, data: result.data });
        });
    }
}
module.exports = new Goods();
