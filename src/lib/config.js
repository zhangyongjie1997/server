module.exports = {
  secret: 'chat',
  dbConfig: {
    host: 'localhost',
    user: 'zhangyongjie',
    password: 'Zyj19970716',
    database: 'test',
    port: '3306',
  },
  // dbConfig: {
  //   host: 'localhost',
  //   user: 'root',
  //   password: 'root',
  //   database: 'test',
  //   port: '3306',
  // },
  mongoConfig: {
    host: 'localhost',
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
  }
}