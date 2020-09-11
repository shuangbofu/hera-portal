import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapState("setting", ["theme"]),
    ...mapState("develop", [
      'jobTrees',
      'treeCaches',
      'layoutConfig',
      'jobList'
    ]),
    ...mapGetters("develop", [
      'tabs', 'tabActive',
      'selectedJobNodes', 'selectedJobNode', 'selectedJobnodeKey'
    ]),
    onlyCenter() {
      return this.layoutConfig.onlyCenter
    },
    tab() {
      return function (type) {
        return !this.onlyCenter && this.tabActive(type) || {}
      }
    },
    leftTab() {
      return this.tab('left')
    },
    rightTab() {
      return this.tab('right')
    },
    bottomTab() {
      return this.tab('bottom')
    },
    job() {
      return this.jobList.find(i => i.id === this.selectedJobNode?.id)
    }
  },
  methods: {
    ...mapMutations("develop", ['toggleOnlyCenter']),
    ...mapActions('develop', [
      'initLocalInfo', 'initJobs',
      'setTabResize', 'setTab',
      'expanedTreeNode', 'selectTreeNode',
      'changeSelectedTab', 'closeSelectedTab'
    ]),
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
  },
}