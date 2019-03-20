const mongoConfig = require('../lib/config').mongoConfig
const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect(mongoConfig.path, {useNewUrlParser: true}, (err, db) => {})

/* 链接成功 */
mongoose.connection.on('connected', function() {
  console.log('Mongoose connection open');
});

// 链接异常
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error:' + err);
});

// 链接断开
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose connection disconnected');
});

const shopSchema = new Schema({
  phone: {
    type: String,
    require: true
  },
  idList: {
    type: Array
  }
});

const commentSchema = new Schema({
  id: {
    type: String,
    require: true
  }
});

const Shop = mongoose.model('shop', shopSchema);
const Comment = mongoose.model('comment', commentSchema);

// class Schema{
//   constructor(obj){
//     this.obj = obj;
//   }
//   model(){
//     return mongoose.model();
//   }
// }

exports.Shop = Shop;
exports.Comment = Comment;