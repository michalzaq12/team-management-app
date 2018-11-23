
import apiService from '@/api'
import authService from '@/api/auth'

const state = {
  user: authService.hasToken() ? authService.getPayload() : {},
  isAuthenticated: authService.hasToken()
};

const getters = {
  userId (state) {
    //TODO
    return state.user.sub;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  }
};

const actions = {
  login ({commit}, credentials) {
    return apiService
      .post('/session', credentials)
      .then(({data}) => {
        commit('setAuth', data.auth_token);
      })
  },
  logout ({commit}) {
    //TODO
    // return apiService.delete('/session').then(() => {
    //   commit('purgeAuth');
    // })
    commit('purgeAuth');
  }
};

const mutations = {
  setAuth(state, token) {
    state.isAuthenticated = true;
    state.user = authService.getPayload(token);
    authService.saveToken(token);
    apiService.setHeader()
  },
  purgeAuth(state) {
    state.isAuthenticated = false;
    state.user = {};
    authService.destroyToken();
    apiService.removeHeader();
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
