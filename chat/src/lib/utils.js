export default {
  setLocalStorage(name, value){
    localStorage.setItem('chat' + name, value instanceof Object ? JSON.stringify(value) : value);
  },
  getLocalStorage(name){
    return localStorage.getItem('chat' + name) || false;
  },
  clearStorage(){
    localStorage.clear();
  },
  getJsonStringify(value){
    if(typeof value != 'string'){
      return JSON.stringify(value)
    }
  },
  deepCopy(obj) {
    let that = this;
    if(!(obj instanceof Object)) return obj;
    if(Array.isArray(obj)) return arrayCopy(obj);
    let data = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        data[key] = obj[key] instanceof Object ?
         Array.isArray(obj[key]) ?
          arrayCopy(obj[key]) :
          that.deepCopy(obj[key]) :
            obj[key];
      }
    }
  
    function arrayCopy(arr) {
      let resArr = [];
      arr.forEach(element => {
        resArr.push(that.deepCopy(element));
      });
      return resArr;
    }
    return data;
  }
}