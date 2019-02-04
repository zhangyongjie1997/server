"use strict";
const user = require('../models/user');
module.exports = (request, response, next) => {
    let data = request.body;
    user.findUserByPhone(data.phone).then(res1 => {
        if (res1.length < 1) {
            let { phone = '', nick_name = '', password = '', sex = '' } = data;
            user.addUser([phone, password, nick_name, sex]).then(res2 => {
                if (res2) {
                    response.end(JSON.stringify({
                        code: 0,
                        msg: 'success'
                    }));
                }
            }).catch(err => {
                console.log(err);
                response.end(JSON.stringify({ code: -1, msg: err.message }));
            });
        }
        else {
            response.end(JSON.stringify({
                code: -1,
                msg: '手机号已存在'
            }));
        }
    });
};
