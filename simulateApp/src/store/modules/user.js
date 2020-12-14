import { login, logout, getInfo, signup } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import router, { resetRouter } from '@/router';
import { getActivityById, getActivity } from '@/api/activity';

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  orgId: '',
  roles: [],
  orgs: [],
  hubs: [],
  devices: [],
  deviceGroups: [],
  zones: [],
  isSetup: false,
  isDrag: false,
  timeline: [],
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_ORGID: (state, orgId) => {
    state.orgId = orgId;
  },
  SET_ORGS: (state, orgs) => {
    state.orgs = orgs;
  },
  SET_HUBS: (state, hubs) => {
    state.hubs = hubs;
  },
  SET_ZONES: (state, zones) => {
    state.zones = zones;
  },
  SET_DEVICES: (state, devices) => {
    state.devices = devices;
  },
  SET_DEVICE_GROUPS: (state, deviceGroups) => {
    state.deviceGroups = deviceGroups;
  },
  SET_IS_SETUP: (state, isSetup) => {
    state.isSetup = isSetup;
  },
  SET_IS_DRAG: (state, isDrag) => {
    state.isDrag = isDrag;
  },
  SET_ACTIVITY: (state, activities) => {
    state.timeline = activities;
  },
  ADD_DEVICE_AVAILABLE: (state, deviceGroupName) => {
    let tmp = state.deviceGroups.find(x => x.deviceGroup == deviceGroupName);
    if (tmp) {
      tmp.availableDevices++;
    }
  },
  SUB_DEVICE_AVAILABLE: (state, deviceGroupName) => {
    let tmp = state.deviceGroups.find(x => x.deviceGroup == deviceGroupName);
    if (tmp) {
      tmp.availableDevices--;
    }
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const data = response;
          commit('SET_TOKEN', 'Bearer ' + data.accessToken);
          setToken('Bearer ' + data.accessToken);
          // generate accessible routes map based on roles
          // const accessRoutes = await dispatch('permission/generateRoutes', 'admin', { root: true })
          //     // dynamically add accessible routes
          // router.addRoutes(accessRoutes)

          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  updateOrgID({ commit }, id) {
    commit('SET_ORGID', id);
  },
  updateOrgs({ commit }, data) {
    commit('SET_ORGS', data);
  },
  updateHubs({ commit }, data) {
    commit('SET_HUBS', data);
  },
  updateDevices({ commit }, data) {
    commit('SET_DEVICES', data);
  },
  updateDeviceGroups({ commit }, data) {
    commit('SET_DEVICE_GROUPS', data);
  },
  addAvailableDevice({ commit }, data) {
    commit('ADD_DEVICE_AVAILABLE', data);
  },
  subAvailableDevice({ commit }, data) {
    commit('SUB_DEVICE_AVAILABLE', data);
  },
  updateActivity({ commit }) {
    return new Promise(resolve => {
      getActivity().then(response => {
        commit(
          'SET_ACTIVITY',
          response.sort((a, b) =>
            a.lastTimeUpdate < b.lastTimeUpdate ? 1 : -1,
          ),
        );
      });
      resolve();
    });
  },
  setActivity({ commit }, data) {
    commit('SET_ACTIVITY', data);
  },
  updateZones({ commit }, data) {
    commit('SET_ZONES', data);
  },
  setIsSetup({ commit }, data) {
    commit('SET_IS_SETUP', data);
  },
  setIsDrag({ commit }, data) {
    commit('SET_IS_DRAG', data);
  },

  signup({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      signup({ username: username.trim(), password: password })
        .then(response => {
          const data = response;
          // commit('SET_TOKEN', data.accessToken)
          // setToken(data.accessToken)
          // this.$alert('SUCCESS')
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const data = response;

          if (!data) {
            reject('Verification failed, please Login again.');
          }

          const { roles, name, avatar, introduction } = data;

          // roles must be a non - empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!');
          }

          commit('SET_ROLES', roles);
          commit('SET_NAME', name);
          commit('SET_AVATAR', avatar);
          commit('SET_INTRODUCTION', introduction);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      //     commit('SET_TOKEN', '')
      //     commit('SET_ROLES', [])
      //     removeToken()
      //     resetRouter()

      //     // reset visited views and cached views
      //     // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      //     dispatch('tagsView/delAllViews', null, { root: true })

      //     resolve()
      // }).catch(error => {
      //     reject(error)
      // })
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      removeToken();
      // resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token';

    commit('SET_TOKEN', token);
    setToken(token);

    // const { roles } = await dispatch('getInfo')

    resetRouter();

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', 'admin', {
      root: true,
    });
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
