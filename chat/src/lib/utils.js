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
  }
}