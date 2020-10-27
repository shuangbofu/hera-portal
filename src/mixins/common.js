import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapState("setting", ["theme", 'fullscreen']),
    ...mapState("develop", [
      'jobTrees',
      'treeCaches',
      'layoutConfig',
      'jobList',
    ]),
    ...mapGetters("develop", [
      'tabs', 'tabActive',
      'selectedJobNodes', 'selectedJobNode', 'selectedJobNodeKey',
      'selectedGroupNode',
      'editorBottomTabs'
    ]),
    onlyCenter() {
      return this.layoutConfig.onlyCenter
    },
    tab_() {
      return function (type) {
        return !this.onlyCenter && this.tabActive(type) || {}
      }
    },
    leftTab() {
      return this.tab_('left')
    },
    rightTab() {
      return this.tab_('right')
    },
    bottomTab() {
      return this.tab_('bottom')
    },
    job() {
      return this.jobList.find(i => i.id === this.selectedJobNode?.id)
    },
    group() {
      return this.selectedGroupNode?.origin
    }
  },
  methods: {
    ...mapMutations("develop", [
      'toggleOnlyCenter',
      'setEditorBottom'
    ]),
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