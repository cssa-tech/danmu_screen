// store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    cloud: null
  },
  mutations: {
    initCloud(state, cloudInstance) {
      state.cloud = cloudInstance;
    }
  },
  actions: {
    // 可在 actions 中加入其他逻辑
  }
});
