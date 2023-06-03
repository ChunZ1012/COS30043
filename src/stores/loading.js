export default {
  namespaced: true,
  state: {
    isLoading: {
      type:Boolean,
      default: false
    }
  },
   // Mutations for sync
   mutations: {
    setLoadingStatus(state, isLoading) {
      state.isLoading = isLoading;
    }
  },
  // Actions for async
  actions: {
    setLoadingStatusAsync({ commit, state }, isLoading) {
      commit('setLoadingStatus', isLoading);
    }
  },
  getters: {
    isLoading: state => state.isLoading
  },
}