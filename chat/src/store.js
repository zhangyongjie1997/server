import Vue from "vue";
import Vuex from "vuex";
import utils from './lib/utils'
import createPersistedState from 'vuex-persistedstate'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);
let state = {
  user:{}
}
const getters = {
  phone : state => state.user.phone,
  token: state => state.user.token,
  get: state => key => state[key]
}
const mutations = {
  setUser(state, user){
    state.user = user;
  },
  clear(state){
    state = {}
  },
  loginout(state){
    state.user = {}
    utils.clearStorage();
  },
  set(state, property, value, deepProperty){
    if(state[property] instanceof Object){
      if(deepProperty){
        state[property] = Object.assign(state[property], {
          deepProperty: value
        })
      }else{
        state[property] = value;
      }
    }else{
      state[property] = value;
    }
  }
}
function getProxy(initState){
  return new Proxy(initState, {
    set: function (target, property, value, receiver) {
      utils.setLocalStorage(property, value);
      target[property] = value;
      return true;
    }
  });
}
export default new Vuex.Store({
  state,
  mutations,
  getters: getters,
  actions: {},
  plugins: [createLogger(), createPersistedState({
    storage: window.sessionStorage
  })]
});
