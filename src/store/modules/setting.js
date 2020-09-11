import config from '@/config'
export default {
  namespaced: true,
  state: {
    ...config
  },
  getters: {

  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme
    },
  },
}