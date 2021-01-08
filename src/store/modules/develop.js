import {
  getScheduledJob,
  initScheduledJobs,
  getScheduledGroup,
  getAllAreas,
  getHostGroups,
  createJobGroup,
  createJob,
  getJobLogList,
  getLog,
  getJobVersions,

  updateJob,

  runJob,
  cancelJob,

  focusJobOrNot, setJobValidOrNot,

  updateGroup,

  deleteJobOrGroup,
  previewJobScript,

  copyJob
} from '@/api/develop'
import Vue from 'vue'
import configs from './develop_configs'
export default {
  namespaced: true,
  state: {
    // 静态的配置
    configs,
    // 树和tab用到的
    treeCaches: {
      debug: { expandedKeys: [], selectedKeys: [], selectedTabs: [] },
      allJob: { expandedKeys: [], selectedKeys: [], selectedTabs: [] },
      myJob: { expandedKeys: [], selectedKeys: [], selectedTabs: [] }
    },
    // 布局配置
    layoutConfig: {
      tab: {
        configs: { left: [{ name: "myJob", width: 20 }], right: [], bottom: [] },
        actives: { left: 'myJob', right: null, bottom: null },
      },
      onlyCenter: false,
      editorBottom: 'text',
      confEditorWidth: 50,
      logContainerWidth: 20,
      setting: {
        showId: true,
        showTabs: true,
        hideEmptyFolder: true
      }
    },
    // 各种数据（任务详细、组（文件夹）详细、日志记录、环境信息）
    jobTrees: {
      debug: [],
      allJob: [],
      myJob: []
    },
    jobList: [],
    areas: [],
    hostGroups: [],
    logRecords: []
  },
  getters: {
    tabs: (state, getters) => {
      const tabs = state.configs.tabs
      return {
        ...tabs,
        // 右tab需要根据group/job显示不同列表
        right: tabs.right.filter(i => !i.private || i.private === (getters.isSelectedGroup ? 'group' : 'job'))
      }
    },
    tab: state => state.layoutConfig.tab,
    tabActive: (state, getters) => type => getters.tab.configs[type].find(i => i.name === getters.tab.actives[type]),
    leftTab: (state, getters) => getters.tab.actives['left'] || getters.tab.actives['left_backup'],

    // 根据左tab具体的树和tab用到的数据
    treeCache: (state, getters) => state.treeCaches[getters.leftTab],

    // 选过之后打开的tab的列表
    selectedTabKeys: (state, getters) => getters.treeCache.selectedTabs,

    // 树选中的key
    selectedKey: (state, getters) => getters.treeCache?.selectedKeys[0],

    // 树节点展开之后的所有节点（且根据left tab获得不同数据）
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

    // 当前tab下的所有任务
    allJobs: (state, getters) => getters.flatJobsTrees(getters.leftTab).map(i => i.origin),

    // 任务tab的nodes
    selectedTabNodes: (state, getters) => getters.treeCache?.selectedTabs
      .map(i => getters.flatJobsTrees(getters.leftTab)
        .find(j => j.key === i)),

    // 选中状态中的node
    selectedTabNode: (state, getters) => {
      return getters.flatAllTreeNodes(getters.leftTab)
        .find(i => i.key === getters.selectedKey)
    },

    // 选中的是任务还是组
    isSelectedGroup: (state, getters) => getters.selectedKey?.includes('group'),

    // 选中任务显示的面包屑
    selectedTabNodeCrumbs: (state, getters) => {
      const arr = []
      const root = getters.selectedTabNode
      if (root) {
        const allNodes = getters.flatAllTreeNodes(getters.leftTab)
        setUpCrumbs(root, allNodes, arr)
        arr.reverse()
        arr.push(root)
      }
      return arr
    },

    currentJob: (state, getters) => state.jobList.find(i => i.id === getters.selectedTabNode?.origin?.id),

    editorBottomTabs: state => state.configs.editorBottomTabs,

    /**
     * 日志列表
     */
    logRecord: (state, getters) => {
      if (getters.isSelectedGroup) {
        return {}
      }
      const id = getters.selectedTabNode?.origin?.id
      if (!id) {
        return {}
      }
      return state.logRecords.find(i => i.jobId === id)
    },

    depSetting: state => state.layoutConfig.setting
  },
  mutations: {
    clearAllCache() {
      removeFromLocal(STORAGE_KEY_TREE_INFO)
      removeFromLocal(STORAGE_KEY_LAYOUT_INFO)
    },
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
    /**
     * 保存布局到本地
     * @param {*} state 
     */
    saveLocalLayout(state) {
      console.log('保存布局信息到本地')
      writeToLocal(STORAGE_KEY_LAYOUT_INFO, state.layoutConfig)
    },
    /**
     * 保存树和tab数据（展开、选中）到本地
     * @param {*} state 
     */
    saveTreeCache(state) {
      console.log('保存tree、tab数据到本地')
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
      dispatch('getHostGroups')
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
    updateGroupConfigs(_, { groupId, selfConfigs }) {
      return updateGroup(groupId, { selfConfigs })
    },
    updateGroup({ dispatch }, { id, data, refresh }) {
      return updateGroup(id, { ...data }).then(() => {
        if (refresh) {
          dispatch('getGroup', id)
        }
      })
    },
    /**
     * 更新任务脚本和配置
     * @param {*} param0 
     * @param {*} param1 
     */
    updateJobScript({ dispatch, getters }, { id }) {
      const script = getters.currentJob.script
      const selfConfigs = getters.currentJob.selfConfigs
      return dispatch('updateJob', { id, data: { script, selfConfigs }, refresh: true }).then(() => {
        return dispatch('setJobScriptEdited', { jobId: id, script: null })
      })
    },
    /**
     * 更新任务
     * @param {*} _ 
     * @param {*} param1 
     */
    updateJob({ dispatch, state }, { id, data, refresh }) {
      const job = { ...state.jobList.find(i => i.id === id) }
      return updateJob(id, { ...job, ...data }).then(() => {
        // 刷新更新后的数据
        if (refresh) {
          dispatch('getJob', { id, check: false })
        }
      })
    },
    /**
     * 关注或者取关任务
     * @param {*} param0 
     * @param {*} param1 
     */
    focusJobOrNot({ state }, { id, focus, user }) {
      return focusJobOrNot(id, focus).then(() => {
        const users = state.jobList.find(i => i.id === id).focusUsers
        if (focus) {
          users.push(user)
        } else {
          const index = users.findIndex(i => i === user)
          if (index !== -1) {
            users.splice(index, 1)
          }
        }
      })
    },
    /**
     * 设置任务有/无效
     * @param {*} param0 
     * @param {*} param1 
     */
    setJobValidOrNot({ state }, { id, valid }) {
      return setJobValidOrNot(id, valid).then(() => {
        state.jobList.find(i => i.id === id).valid = valid
      })
    },
    setJobScriptEdited({ getters }, { jobId, script }) {
      // 遍历（我的任务和所有任务的对应任务），如果script===null，则表示已更新
      leftTabs.forEach(type => {
        const node = getters.flatJobsTrees(type).find(i => i.id === jobId)
        if (node) {
          const edited = script == null ? false : node.origin.script !== script
          Vue.set(node.origin, 'edited', edited)
        }
      })
    },
    cancelJob({ dispatch }, { jobId, logItemId }) {
      return cancelJob(jobId, logItemId).then(() => {
        return dispatch('getJobLogList', { pageSize: 10, offset: 0, jobId })
      })
    },
    /**
     * 运行任务
     * @param {*} param0 
     * @param {*} param1 
     */
    runJob({ dispatch, getters }, { jobId, actionId, triggerType }) {
      return runJob(actionId, triggerType).then(() => {
        // 如果没有打开bottom，获取日志时打开
        const tabActive = getters.tab.actives['bottom']
        if (tabActive == null) {
          dispatch('setTab', { name: 'log', type: 'bottom' })
        }
        return dispatch('getJobLogList', { pageSize: 10, offset: 0, jobId })
      })
    },
    /**
     * 获取任务版本号列表
     * @param {*} param0 
     * @param {*} param1 
     */
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
      return getJobLogList(pageSize, offset, jobId).then(data => {
        const rowLength = data.rows.length
        const exist = state.logRecords.findIndex(i => i.jobId === jobId) !== -1
        if (!exist) {
          state.logRecords.push({
            pageSize,
            offset,
            jobId,
            list: data.rows,
            loadedAll: data.rows.length < pageSize,
            current: data.rows[0]?.id
          })
        } else {
          const logRecord = state.logRecords.find(i => i.jobId === jobId)
          // 定时刷新时请求后的处理
          if (pageSize === 1 && rowLength === 1) {
            const logItem = data.rows[0]
            const logItemId = logItem.id
            Object.assign(logRecord.list.find(i => i.id === logItemId), logItem)
          } else if (offset === 0) {
            logRecord.list = data.rows
            const logItemId = data.rows[0]?.id
            logRecord.current = logItemId
            logRecord.loadedAll = rowLength < pageSize
            logRecord.offset = offset
            if (logItemId) {
              dispatch('getLogContent', { logItemId, jobId })
            }
          } else if (offset > logRecord.offset) {
            if (rowLength > 0) {
              logRecord.list = logRecord.list.concat(data.rows)
              logRecord.offset = offset
              logRecord.pageSize = pageSize
              logRecord.loadedAll = rowLength < pageSize
            }
          }
        }
      })
    },
    /**
     * 获取日志内容
     * @param {*} param0 
     * @param {*} param1 
     */
    getLogContent({ state }, { logItemId, jobId }) {
      getLog(logItemId, jobId).then(data => {
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
              const treeData = getTreeData(data[tab])
              if (treeData) {
                state.jobTrees[tab] = [treeData]
                const treeCahce = state.treeCaches[tab]
                if (treeCahce.expandedKeys.length === 0) {
                  treeCahce.expandedKeys = [state.jobTrees[tab][0].key]
                }
                dispatch('setNodeDatas', { type: tab, datas: state.jobList })
              }
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
    getHostGroups({ state }) {
      getHostGroups().then(data => {
        state.hostGroups = data
      })
    },
    /**
     * 设置tab，左右下的tab变动(选中、取消、切换）的时候都会调用
     * @param {*} param0 
     * @param {*} param1 
     */
    setTab({ state, getters, commit, dispatch }, { name, type }) {
      const tab = state.layoutConfig.tab
      const tabConfigs = tab.configs[type]
      let config = tabConfigs.find(i => i.name === name)
      if (!config) {
        config = { name, width: { right: 28, left: 20, bottom: 40 }[type] }
        tabConfigs.push(config)
      }
      const onlyCenter = state.layoutConfig.onlyCenter

      const activeTabName = tab.actives[type]
      const isClose = !onlyCenter && activeTabName != null && activeTabName === name
      tab.actives[type] = isClose ? null : name
      if (onlyCenter) {
        commit('toggleOnlyCenter')
      }
      if (type == 'left') {
        // 设置left_backup的目的是为了 当left tab关闭的时候依然能够显示center的内容
        tab.actives['left_backup'] = isClose ? name : null
        dispatch('getJobByKey', { key: getters.selectedKey, check: true })
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
      // 因为group和job的tab列表不一样，所以切换会出现不存在
      // 如果切换时right tab不存在要设置为第一个tab
      const rightTab = getters.tab.actives['right']
      if (rightTab && !getters.tabs.right.find(i => i.name === rightTab)) {
        dispatch('setTab', { name: getters.tabs.right[0].name, type: 'right' })
      }
      commit('saveTreeCache')
    },
    /**
     * 删除任务/组
     * @param {*} param0 
     * @param {*} data 
     */
    deleteJobOrGroup({ dispatch, state, commit, getters }, data) {
      return deleteJobOrGroup(data.id, data.type).then(() => {
        leftTabs.forEach(type => {
          const parentNode = getters.flatAllTreeNodes(type).find(i => i.key === `node_${data.parent}`)
          if (parentNode) {
            const index = parentNode.children.findIndex(i => i.key === data.key)
            if (index !== -1) {
              parentNode.children.splice(index, 1)
            }
            const treeCache = state.treeCaches[type]
            if (data.type === 'job') {
              dispatch('closeTab', data.key)
            } else {
              const flatAllTreeNodes = getters.flatAllTreeNodes(type)
              const selfNode = flatAllTreeNodes.find(i => i.key === `node_${data.id}`)
              const tabs = treeCache.selectedTabs
              const selectedKeys = treeCache.selectedKeys
              if (selfNode) {
                selfNode.children.forEach(n => {
                  const idx = tabs.findIndex(i => i === n.key)
                  if (idx !== -1) {
                    tabs.splice(idx, 1)
                  }
                  if (selectedKeys.includes(n.key)) {
                    treeCache.selectedKeys = []
                  }
                })
              }
              if (tabs.length > 0) {
                if (type === getters.leftTab) {
                  const tabKey = tabs[0]
                  const tabNode = flatAllTreeNodes.find(i => i.key === tabKey)
                  if (tabNode) {
                    dispatch('selectTreeNode', { key: tabs[0], selected: false, dic: false, id: tabNode.id })
                  }
                }
              }
            }
          }
          commit('saveTreeCache')
        })
      })
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
    previewJobScript({ state }, { jobId, actionId }) {
      return previewJobScript(actionId).then(data => {
        const job = state.jobList.find(i => i.id === jobId)
        Vue.set(job, 'previewScript', data)
      })
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
        if (!job) {
          state.jobList.push(data)
        } else {
          Object.assign(job, data)
        }
        leftTabs.forEach(type => {
          dispatch('setNodeData', { type, data })
        })
        dispatch('getJobLogList', { pageSize: 10, offset: 0, jobId: id })
        dispatch('getJobVersions', { jobId: id })
      })
      // TODO 任务调度是不同的请求
    },
    setNodeData({ getters }, { type, data }) {
      const node = getters.flatJobsTrees(type).find(i => i.id === data.id)
      if (node) {
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
              // Object.assign(node.origin, data)
              Vue.set(node, 'origin', { ...node.origin, ...data })
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
        const id = Number(data)
        dispatch('afterCreateJob', { id, parentKey })
      })
    },
    copyJob({ dispatch }, { jobId, name, parentKey }) {
      return copyJob(jobId, name).then(() => {
        dispatch('afterCreateJob', { id: jobId, parentKey })
      })
    },
    /**
     * 复制或者创建任务的时候需要选中并展开其父节点(文件夹)
     * @param {*} param0 
     * @param {*} param1 
     */
    afterCreateJob({ dispatch }, { id, parentKey }) {
      dispatch('initJobs').then(() => {
        const newKey = `node_${id}`
        dispatch('expandTreeNode', parentKey)
        dispatch('selectTreeNode', {
          key: newKey,
          selected: false,
          dic: false,
          id
        })
      })
    }
  }
}

const leftTabs = ['allJob', 'myJob', 'debug']


function setUpCrumbs(lastNode, all, res) {
  // console.log(lastNode.origin.parent)
  const node = all.find(i => `group_${i.id}` === lastNode.origin.parent && i.dic)
  if (node) {
    res.push(node)
    // console.log(node.id, node.title)
    setUpCrumbs(node, all, res)
  }
}

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
function removeFromLocal(key) {
  localStorage.removeItem(STORAGE_KEY_PREFIX + key)
}