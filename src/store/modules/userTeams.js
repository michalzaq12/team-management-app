
import apiService from '@/api'

const state = {
  teams: []
};

const getters = {
  allTeams (state) {
    return state.teams;
  },
  allConfirmedTeams(state) {
    return state.teams.filter(el => el.confirmed);
  },
  allTeamsWhereUserIsLeader(state){
    return state.teams.filter(el => el.role === 'leader');
  }
};

const actions = {
  fetchTeams ({commit, rootGetters}) {
    return new Promise(((resolve, reject) => {
      apiService
        .get(`/users/${rootGetters['auth/userId']}/team-memberships`)
        .then(({data: memberships}) => {
          const promises = [];
          const teams = [];

          for(const el of memberships){
            const teamPromise = apiService.get(`/teams/${el.team.id}`).then(({data: team}) => {
              teams.push({
                membership_id: el.id,
                confirmed: el.confirmed,
                role: el.role,
                ...team});
            });
            promises.push(teamPromise);
          }

          Promise.all(promises)
            .catch(reject)
            .finally(() => {
              commit('setTeams', teams);
              resolve();
          })

        }).catch(reject);
    }))

  },
};

const mutations = {
  setTeams(state, teams){
    state.teams = teams;
  },
  clean(state){
    state.teams = []
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
