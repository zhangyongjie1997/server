const mongoConfig = require('../lib/config').mongoConfig
const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect(mongoConfig.path, {useNewUrlParser: true}, 
  (err, db) => {

  })

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