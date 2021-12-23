import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    auth:{},
    loginOrSignup:false,
  },
  getters:{
    gettersAuth(state){
      return state.auth;
    } 
  },
  mutations:{
    setAuth(state,payload){
      state.auth=payload
      console.log(state.auth,"on store")
    }
  },
  actions:{
    actionAuth(context,request){
      context.commit("setAuth",request)
    }
  }
})

export default store;