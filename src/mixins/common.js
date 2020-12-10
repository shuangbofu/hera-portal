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
      'selectedTabNode', 'selectedTabNodes', 'selectedKey', 'selectedTabKeys', 'selectedTabNodeCrumbs',
      'isSelectedGroup',
      'editorBottomTabs',
      'logRecord',

      'depSetting'
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
      'setEditorBottom',
      'setLogContainerWidth'
    ]),
    ...mapActions('develop', [
      'restoreLocal', 'initJobs',
      'resizeTab', 'setTab',
      'setExpanedTreeNodes', 'selectTreeNode',
      'switchSelectedTab',
      'closeTab', 'closeAllTabs', 'closeAllRightTabs', 'closeOtherTabs',
      'createGroup', 'createJob',
      // 获取日志内容
      'getLogContent',
      'setJobScriptEdited',
      'cancelJob',
      'previewJobScript'
    ]),
    changeTab(name, type) {
      this.setTab({
        name,
        type
      })
    },
    changeTabSize(width, type) {
      this.resizeTab({ width, type })
    },
    getTab(type) {
      return this.tab[type]
    },
  },
}