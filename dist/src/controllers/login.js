"use strict";
const user = require('../models/user');
const jwt = require("../lib/jwt");
module.exports = (request, response, next) => {
    if (!request.body.password) {
        return response.end(JSON.stringify({
            code: -1,
            msg: '密码不能为空'
        }));
    }
    let data = request.body;
    user.findUserByPhone(data.phone).then(res => {
        if (res.length < 1) {
            response.end(JSON.stringify({
                code: -1,
                msg: "用户不存在"
            }));
        }
        else {
            if (res[0].password = data.password) {
                const payload = {
                    phone: res[0].phone
                };
                let token = jwt.getToken(payload);
                user.addLoginUser(data.phone, token);
                response.end(JSON.stringify({
                    code: 0,
                    msg: "登录成功",
                    data: {
                        token,
                        phone: res[0].phone,
                        nick_name: res[0].nick_name || '默认'
                    }
                }));
            }
            else {
                response.end(JSON.stringify({
                    code: -1,
                    msg: '密码不正确'
                }));
            }
        }
    }).catch(err => {
    });
};
