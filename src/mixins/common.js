import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapState("develop", ["configs"]),
    ...mapState("setting", ["theme"]),
    ...mapGetters("develop", ["tab", 'tabs', 'jobs']),
  },
  methods: {
    ...mapMutations("develop", ["setTab", 'setTabResize']),
    changeTab(name, type) {
      this.setTab({
        name,
        type
      })
    },
    changeTabSize(width, type) {
      this.setTabResize({
        width, type
      })
    },
    getTab(type) {
      return this.tab[type]
    },
    ...mapActions('develop', ['initLocalInfo', 'initJobs'])
  },
}