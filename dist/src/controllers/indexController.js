"use strict";
const utils = require('../lib/utils');
module.exports = {
    async getIndexImg(req, res, next) {
        let result;
        const data = await utils.getDirInfo('public/index/img');
        if (data.code == 0) {
            result = data.data.map(item => {
                return 'localhost:' + global.port + '/index/img/' + item;
            });
            res.send({ code: 0, msg: '获取成功', data: result }).end();
        }
    }
};
