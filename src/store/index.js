import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


import auth from './modules/auth';
import userTeams from './modules/userTeams';


export default new Vuex.Store({
  modules: {
    auth,
    userTeams
  },
  strict: true
})
