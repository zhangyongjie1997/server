let orderTimeout = 1000 * 60 * 15;

module.exports = {
  secret: 'chat',
  // dbConfig: {
  //   host: 'localhost',
  //   user: 'root',
  //   password: 'root',
  //   database: 'test',
  //   port: '3306',
  // },
  // mongoConfig: {
  //   host: '//39.107.88.223',
  //   port: '21710',
  //   datebase: 'test',
  //   path: 'mongodb://39.107.88.223/test'
  // },
  dbConfig: {
    host: 'localhost',
    user: 'zhangyongjie',
    password: 'Zyj19970716',
    database: 'test',
    port: '3306',
  },
  mongoConfig: {
    host: '//127.0.0.1',
    port: '21710',
    datebase: 'test',
    path: 'mongodb://localhost/test'
  },
  uploadPath: 'public/uploads/',
  orderStatus: {
    fail: -1, //已取消或者未支付导致订单关闭
    open: 0, //已支付
    close: 1, //已完成
    wait: 2, //待支付
  },
  goodsStatus: {
    normal: 0,
    removed: -1,
    selled: 1
  },
  shopStatus: {
    normal: 0,
    booked: 1
  },
  orderTimeout
}