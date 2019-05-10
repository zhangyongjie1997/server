const db = require('../db/db');
const user = require('./user');


class Order {
  addOrder(order) {
    return new Promise(async resolve => {
      let result = await db.query("insert into order2 values(?,?,?,?,?)", [order.id, order.amount, order.phone, order.status, order.shop]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      await user.changeShopStatus(order.shop, 'booked');
      resolve({ code: 0, data: result[0] });
    });
  }

  orderStatusChange(orderId, status) {
    return new Promise(async resolve => {
      let result = await db.query('update order2 set status=? where id=?', [status, orderId]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, data: result[0] });
    });
  }

  getOrderById(orderId) {
    return new Promise(async resolve => {
      let result = await db.query('select * from order2 where id=?', [orderId]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, data: result[0] });
    });
  }
  
  getOrderByPhone(phone) {
    return new Promise(async resolve => {
      let result = await db.query('select * from order2 where phone=?', [phone]);
      if (result[1]) return resolve({ code: -1, err: result[1] });
      resolve({ code: 0, data: result[0] });
    });
  }
}

module.exports = new Order();