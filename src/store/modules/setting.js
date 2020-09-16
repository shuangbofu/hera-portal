import config from '@/config'
export default {
  namespaced: true,
  state: {
    ...config,
    fullscreen: false
  },
  getters: {

  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme
    },
    toggleFullScreen(state) {
      state.fullscreen = !state.fullscreen
    }
  },
}