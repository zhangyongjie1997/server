"use strict";
const mysql = require('mysql');
const pool = mysql.createPool(require('../lib/config').dbConfig);
let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                resolve([null, err]);
            }
            else {
                connection.query(sql, values, (err, rows) => {
                    resolve([rows, err]);
                    connection.release();
                });
            }
        });
    });
};
module.exports = {
    query
};
