import utils from './utils'

function createHandler(key, lskey){
  return {
    set: function (target, property, value, receiver) {
      let item;
      if(lskey){
        item = utils.getLocalStorage(lskey) || {};
        item[key] = value;
        utils.setLocalStorage(lskey, item);
      }else{
        utils.setLocalStorage(key, value);
      }
      Reflect.set(target, property, value, receiver);
    }
  }
}

module.exports = (state, keys = []) => {
  let obj = Object.assign({}, state);
  keys.forEach(item => {
    if(obj[item] instanceof Object){
      Object.keys(obj[item]).forEach(item2 => {
        obj[item][item2] = new Proxy(obj[item][item2], createHandler(obj[item][item2], obj[item]));
      })
    }else{
      obj[item] = new Proxy(obj[item], createHandler(obj[item]))
    }
  });
}