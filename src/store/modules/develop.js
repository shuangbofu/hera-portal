import {
  getScheduledJob,
  initScheduledJobs,
  getScheduledGroup,
  getAllAreas,
  createJobGroup,
  createJob,
  getJobLogList,
  getLog,
  getJobVersions,
  runJob
} from '@/api/develop'
import Vue from 'vue'
export default {
  namespaced: true,
  state: {
    configs: {
      tabs: {
        left: [
          //   {
          //   name: 'debug',
          //   label: '任务调试',
          //   icon: 'code'
          // }, 
          {
            name: 'myJob',
            label: '我的任务',
            icon: 'my',
          },
          {
            name: 'allJob',
            label: '全部任务',
            icon: 'all'
          }],
        right: [
          {
            name: 'job',
            label: '信息配置',
            icon: 'info'
          },
          {
            name: 'dependency',
            label: "任务依赖",
            icon: 'dependency',
            private: 'job'
          },
          {
            name: 'jobRunningList',
            label: '正在运行',
            icon: 'dependency',
            private: 'group'
          },
          {
            name: 'jobErrorList',
            label: '失败记录',
            icon: 'dependency',
            private: 'group'
          }
        ],
        bottom: [{
          name: 'log',
          label: '运行日志',
          icon: 'runlog'
        },
        {
          name: 'opLog',
          label: '操作记录',
          icon: 'oplog'
        }]
      },
      editorBottomTabs: [{
        name: 'text',
        label: '文本',
      }, {
        name: 'config',
        label: '配置项'
      }]
    },
    treeCaches: {
      debug: { expandedKeys: [], selectedKeys: [], selectedTabs: [] },
      allJob: { expandedKeys: [], selectedKeys: [], selectedTabs: [] },
      myJob: { expandedKeys: [], selectedKeys: [], selectedTabs: [] }
    },
    layoutConfig: {
      tab: {
        configs: { left: [], right: [], bottom: [] },
        actives: { left: null, right: null, bottom: null },
      },
      leftTab: '',
      onlyCenter: false,
      editorBottom: 'text',
      confEditorWidth: 50,
      logContainerWidth: 20
    },
    jobTrees: {
      debug: [],
      allJob: [],
      myJob: []
    },
    jobList: [],
    areas: [],
    logRecords: []
  },
  getters: {
    tabs: (state, getters) => {
      const tabs = state.configs.tabs
      return {
        ...tabs,
        right: tabs.right.filter(i => !i.private || i.private === (getters.isSelectedGroup ? 'group' : 'job'))
      }
    },
    rightTabs: (state, getters) => getters.tabs.right,

    tab: state => state.layoutConfig.tab,
    tabConfgs: (state, getters) => getters.tab.configs,
    tabActive: (state, getters) => type => getters.tabConfgs[type].find(i => i.name === getters.tab.actives[type]),

    treeCache: (state) => state.treeCaches[state.layoutConfig.leftTab],
    selectedTabKeys: (state, getters) => getters.treeCache.selectedTabs,

    selectedKey: (state, getters) => getters.treeCache?.selectedKeys[0],

    flatAllTreeNodes: (state) => type => {
      const jobsTree = state.jobTrees[type]
      const res = []
      if (jobsTree) {
        flatNodes(jobsTree, res)
      }
      return res
    },
    flatJobsTrees: (state, getters) => type => getters.flatAllTreeNodes(type).filter(i => !i.dic),
    flatGroupTrees: (state, getters) => type => getters.flatAllTreeNodes(type).filter(i => i.dic),

    // 任务tab的nodes
    selectedTabNodes: (state, getters) => getters.treeCache?.selectedTabs
      .map(i => getters.flatJobsTrees(state.layoutConfig.leftTab)
        .find(j => j.key === i)),

    // 选中状态中的node
    selectedTabNode: (state, getters) => {
      return getters.flatAllTreeNodes(state.layoutConfig.leftTab)
        .find(i => i.key === getters.selectedKey)
    },
    isSelectedGroup: (state, getters) => getters.selectedKey?.includes('group'),

    editorBottomTabs: state => state.configs.editorBottomTabs,

    // 日志列表
    logRecord: (state, getters) => {
      if (getters.isSelectedGroup) {
        return {}
      }
      const id = getters.selectedTabNode?.origin?.id
      if (!id) {
        return {}
      }
      return state.logRecords.find(i => i.jobId === id)
    }
  },
  mutations: {
    toggleOnlyCenter(state) {
      state.layoutConfig.onlyCenter = !state.layoutConfig.onlyCenter
      this.commit('develop/saveLocalLayout')
    },
    setEditorBottom(state, name) {
      state.layoutConfig.editorBottom = name
      this.commit('develop/saveLocalLayout')
    },
    setConfEditorWidth(state, value) {
      state.layoutConfig.confEditorWidth = value
      this.commit('develop/saveLocalLayout')
    },
    setLogContainerWidth(state, value) {
      state.layoutConfig.logContainerWidth = value
      this.commit('develop/saveLocalLayout')
    },
    saveLocalLayout(state) {
      console.log('save local[layout]')
      writeToLocal(STORAGE_KEY_LAYOUT_INFO, state.layoutConfig)
    },
    saveTreeCache(state) {
      console.log('save local[treeCaches]')
      writeToLocal(STORAGE_KEY_TREE_INFO, state.treeCaches)
    },
  },
  actions: {
    /**
     * 从浏览器本地还原数据
     * @param {*} param0 
     */
    restoreLocal({ state, getters, dispatch }) {
      dispatch('initAreas')
      readFromLocal(STORAGE_KEY_LAYOUT_INFO, info => {
        state.layoutConfig = info
      })
      readFromLocal(STORAGE_KEY_TREE_INFO, info => {
        state.treeCaches = info
      })
      const selectedKey = getters.selectedKey
      if (selectedKey) {
        const groupId = selectedKey.split('_')[2]
        if (groupId) {
          dispatch('getGroup', groupId)
        } else {
          dispatch('getJobByKey', { key: selectedKey })
        }
      }
    },
    runJob({ dispatch }, { jobId, actionId, triggerType }) {
      return runJob(actionId, triggerType).then(() => {
        dispatch('getJobLogList', { pageSize: 10, offset: 0, jobId })
      })
    },
    getJobVersions({ state }, { jobId }) {
      return getJobVersions(jobId).then(data => {
        state.jobList.find(i => i.id === jobId).versions = data
      })
    },
    /**
     * 获取日志列表
     * @param {*} param0 
     * @param {*} param1 
     */
    getJobLogList({ state, dispatch }, { pageSize, offset, jobId }) {
      getJobLogList(pageSize, offset, jobId).then(data => {
        const exist = state.logRecords.findIndex(i => i.jobId === jobId) !== -1
        console.log(exist)
        if (!exist) {
          state.logRecords.push({
            pageSize,
            offset,
            jobId,
            list: data.rows,
            current: data.rows[0]?.id
          })
          console.log(state.logRecords)
        } else {
          const logRecord = state.logRecords.find(i => i.jobId === jobId)
          logRecord.list = data.rows
          const logItemId = data.rows[0]?.id
          logRecord.current = logItemId
          dispatch('getLogContent', { logItemId, jobId })
        }
      })
    },
    getLogContent({ state }, { logItemId, jobId }) {
      getLog(logItemId, jobId).then(data => {
        console.log(data)
        const logRecord = state.logRecords.find(i => i.jobId === jobId)
        if (logRecord) {
          const index = logRecord.list.findIndex(j => j.id === logItemId)
          const logItem = logRecord.list[index]
          Vue.set(logItem, 'status', data.status)
          Vue.set(logItem, 'log', data.log)
        }
      })
    },
    /**
     * 初始化（我的任务和所有任务）
     * @param {*} param0 
     */
    initJobs({ state, dispatch }) {
      return initScheduledJobs()
        .then((data) => {
          leftTabs.forEach(tab => {
            if (tab !== 'debug') {
              const treeData = [getTreeData(data[tab])]
              state.jobTrees[tab] = treeData
              const treeCahce = state.treeCaches[tab]
              if (treeCahce.expandedKeys.length === 0) {
                treeCahce.expandedKeys = [state.jobTrees[tab][0].key]
              }
              dispatch('setNodeDatas', { type: tab, datas: state.jobList })
            }
          })
        });
    },
    /**
     * 初始化区域变量
     * @param {*} param0 
     */
    initAreas({ state }) {
      getAllAreas().then(data => {
        state.areas = data
      })
    },
    setTab({ state, getters, commit, dispatch }, { name, type }) {
      if (type == 'left') {
        state.layoutConfig.leftTab = name
        dispatch('getJobByKey', { key: getters.selectedKey, check: true })
      }
      const tab = state.layoutConfig.tab
      const tabConfigs = tab.configs[type]
      let config = tabConfigs.find(i => i.name === name)
      if (!config) {
        config = { name, width: { right: 28, left: 20, bottom: 20 }[type] }
        tabConfigs.push(config)
      }
      const onlyCenter = state.layoutConfig.onlyCenter

      const activeTabName = tab.actives[type]
      const isClose = !onlyCenter && activeTabName != null && activeTabName === name
      tab.actives[type] = isClose ? null : name
      if (onlyCenter) {
        commit('toggleOnlyCenter')
      }
      commit('saveLocalLayout')
    },
    resizeTab({ getters, commit }, { width, type }) {
      getters.tabActive(type).width = width
      commit('saveLocalLayout')
    },
    setExpanedTreeNodes({ getters, commit }, keys) {
      console.log(keys)
      getters.treeCache.expandedKeys = keys
      commit('saveTreeCache')
    },
    expandTreeNode({ getters, dispatch }, key) {
      const keys = getters.treeCache.expandedKeys
      console.log(keys, key)
      if (!keys.includes(key)) {
        keys.push(key)
        dispatch('setExpanedTreeNodes', keys)
      }
    },
    /**
     * 选择树节点
     * @param {*} param0 
     * @param {*} param1 
     */
    selectTreeNode({ getters, commit, dispatch }, { key, selected, dic, id }) {
      const treeCache = getters.treeCache
      treeCache.selectedKeys = [key]
      if (dic) {
        dispatch('getGroup', id)
      } else {
        if (!treeCache.selectedTabs.includes(key)) {
          treeCache.selectedTabs.push(key)
        }
        dispatch('getJob', { id, check: true })
      }
      if (selected) {
        return
      }
      // 如果切换时right tab不存在要设置为第一个tab
      const rightTab = getters.tab.actives['right']
      if (rightTab && !getters.rightTabs.find(i => i.name === rightTab)) {
        dispatch('setTab', { name: getters.rightTabs[0].name, type: 'right' })
      }
      commit('saveTreeCache')
    },
    /**
     * 切换标签
     * @param {*} param0 
     * @param {*} key 
     */
    switchSelectedTab({ getters, commit, dispatch }, key) {
      if (key && getters.treeCache.selectedTabs.includes(key)) {
        console.log('changeTab2' + key)
        return dispatch('getJobByKey', { key, check: true }).then(() => {
          getters.treeCache.selectedKeys = [key]
          commit('saveTreeCache')
        })
      }
    },
    /**
     * 关闭标签
     * @param {*} param0 
     * @param {*} key 
     */
    closeTab({ getters, commit, dispatch }, key) {
      const tabs = getters.treeCache.selectedTabs
      let index = tabs.findIndex(i => i === key)
      if (index !== -1) {
        tabs.splice(index, 1)
        if (getters.selectedKey === key) {
          index = index < tabs.length ? index : index - 1;
          const lastKey = tabs[index];
          if (lastKey) {
            dispatch('switchSelectedTab', lastKey)
          } else {
            getters.treeCache.selectedKeys = []
            commit('saveTreeCache')
          }
        } else {
          commit('saveTreeCache')
        }
      }
    },
    /**
     * 关闭所有标签
     * @param {*} param0 
     */
    closeAllTabs({ commit, getters }) {
      getters.treeCache.selectedTabs = []
      getters.treeCache.selectedKeys = []
      commit('saveTreeCache')
    },
    /**
     * 关闭右侧所有标签
     * @param {*} param0 
     * @param {*} key 
     */
    closeAllRightTabs({ commit, getters }, key) {
      const tabs = getters.treeCache.selectedTabs
      let index = tabs.findIndex(i => i === key)
      const currentIndex = tabs.findIndex(i => i === getters.selectedKey)
      if (index < currentIndex) {
        getters.treeCache.selectedKeys = [key]
      }
      if (index !== -1) {
        index++;
        tabs.splice(index, tabs.length - index)
        commit('saveTreeCache')
      }
    },
    /**
     * 关闭其他标签
     * @param {*} param0 
     * @param {*} key 
     */
    closeOtherTabs({ dispatch, commit, getters }, key) {
      const currentKey = getters.selectedKey
      getters.treeCache.selectedTabs = [key]
      if (key === currentKey) {
        commit('saveTreeCache')
      } else {
        dispatch('switchSelectedTab', key)
      }
    },
    /**
     * 根据key获取任务数据
     * @param {*} param0 
     * @param {*} param1 
     */
    getJobByKey({ dispatch }, { key, check }) {
      const id = Number(key?.split('_')[1])
      return dispatch('getJob', { id: id ? Number(id) : null, check })
    },
    /**
     * 获取任务数据
     * @param {*} param0 
     * @param {*} param1 
     */
    getJob({ state, dispatch }, { id, check }) {
      if (!id) {
        return new Promise((r) => { r() })
      }
      if (check) {
        if (state.jobList.findIndex(i => i.id === id) !== -1) {
          return new Promise((r) => { r() })
        }
      }
      getScheduledJob(id).then(data => {
        const job = state.jobList.find(i => i.id === id)
        if (job !== null) {
          state.jobList.push(data)
          leftTabs.forEach(type => {
            dispatch('setNodeData', { type, data })
          })
        } else {
          Object.assign(job, data)
        }
        dispatch('getJobLogList', { pageSize: 10, offset: 0, jobId: id })
      })
      // TODO 任务调度是不同的请求
    },
    setNodeData({ getters }, { type, data }) {
      const node = getters.flatJobsTrees(type).find(i => i.id === data.id)
      if (node) {
        // node.origin = { ...data }
        Object.assign(node.origin, data)
      }
    },
    setNodeDatas({ dispatch }, { type, datas }) {
      datas.forEach(data => {
        dispatch('setNodeData', { type, data })
      })
    },
    /**
     * 获取文件夹数据
     * @param {*} param0 
     * @param {*} id 
     */
    getGroup({ getters }, id) {
      if (!id) {
        return new Promise((r) => { r() })
      }
      return getScheduledGroup(id).then(data => {
        leftTabs.forEach(type => {
          // TODO 
          if (type !== 'debug') {
            const node = getters.flatGroupTrees(type).find(i => i.id === data.id)
            if (node) {
              // node.origin = { ...data }
              Object.assign(node.origin, data)
            }
          }
        })
      })
    },
    createGroup({ dispatch }, { requestData, parentKey }) {
      return createJobGroup(requestData).then(() => {
        dispatch('initJobs').then(() => {
          dispatch('expandTreeNode', parentKey)
        })
      })
    },
    createJob({ dispatch }, { requestData, parentKey }) {
      return createJob(requestData).then(data => {
        dispatch('initJobs').then(() => {
          const id = Number(data)
          const newKey = `node_${id}`
          dispatch('expandTreeNode', parentKey)
          dispatch('selectTreeNode', {
            key: newKey,
            selected: false,
            dic: false,
            id
          })
        })
      })
    }
  }
}

const leftTabs = ['allJob', 'myJob', 'debug']

// 扁平化树节点
function flatNodes(nodes, arr) {
  nodes.forEach(node => {
    arr.push(node)
    flatNodes(node.children, arr)
  })
}

function getTreeData(jobs) {
  return setUpJobs(jobs).find(i => i.origin.parent === 'group_0')
}

/**
 * 转换成树结构
 * @param {*} jobs 
 */
function setUpJobs(jobs) {
  jobs.forEach(job => {
    job.children = jobs.filter(i => i.parent === job.id)
  })
  return jobs.map(job => setUpJobNode(job))
}

/**
 * 递归转换树节点
 * @param {*} job 
 */
function setUpJobNode(job) {
  const isDic = job.directory !== null
  const type = !isDic ? 'job' : (job.directory === 0 ? 'big_dic' : 'small_dic')
  return {
    id: job.jobId,
    isLeaf: !job.isParent || job.children.length === 0,
    key: 'node_' + job.id,
    title: job.jobName,
    origin: {
      ...job,
      id: job.jobId,
      type
    },
    type,
    dic: isDic,
    children: job.children.map(i => setUpJobNode(i)),
    scopedSlots: {
      icon: isDic ? 'dic' : 'job',
      title: 'title'
    }
  }
}

const STORAGE_KEY_LAYOUT_INFO = "layout"
const STORAGE_KEY_TREE_INFO = "tree"
const STORAGE_KEY_PREFIX = "hera_"

function writeToLocal(key, value) {
  localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value))
}
function readFromLocal(key, callback) {
  const v = localStorage.getItem(STORAGE_KEY_PREFIX + key)
  if (v != null) {
    callback(JSON.parse(v))
  }
}