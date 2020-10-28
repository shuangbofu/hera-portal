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
      'selectedTabNode', 'selectedTabNodes', 'selectedKey', 'selectedTabKeys',
      'isSelectedGroup',
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
      return this.jobList.find(i => i.id === this.selectedTabNode?.origin?.id)
    },
    group() {
      return this.selectedTabNode.origin
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
      'switchSelectedTab',
      'closeTab', 'closeAllTabs', 'closeAllRightTabs', 'closeOtherTabs'
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