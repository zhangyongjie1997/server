const mongoConfig = require('../lib/config').mongoConfig
const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect(mongoConfig.path, {useNewUrlParser: true}, (err, db) => {
  console.log(db)
})

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
  console.log(arguments)
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
    require: true,
  },
  content: {
    type: String,
  },
  time: {
    type: String
  },
  author: {
    type: Object,
    require: true
  },
  goods: {
    type: String
  },
  child_comment: []
})

const Shop = mongoose.model('shop', shopSchema);
const Comment = mongoose.model('comment', commentSchema);


exports.Shop = Shop;
exports.Comment = Comment;