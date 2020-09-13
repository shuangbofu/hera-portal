import axios from "@/utils/request.js";
export default {
  namespaced: true,
  state: {
    configs: {
      tabs: {
        left: [{
          name: 'debug',
          label: '任务调试',
          icon: 'code'
        }, {
          name: 'myJob',
          label: '我的任务',
          icon: 'my',
        },
        {
          name: 'allJob',
          label: '全部任务',
          icon: 'all'
        }],
        right: [{
          name: 'B',
          label: '基本信息',
          icon: 'info'
        },
        {
          name: 'dependency',
          label: "任务依赖",
          icon: 'dependency'
        },
        {
          name: 'A',
          label: '任务配置',
          icon: 'config'
        },
        {
          name: 'C',
          label: '告警配置',
          icon: 'alarm'
        }],
        bottom: [{
          name: 'B',
          label: '运行日志',
          icon: 'log'
        },
        {
          name: 'A',
          label: '操作记录',
          icon: 'operation'
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
      jobTab: '',
      onlyCenter: false,
      editorBottom: 'text'
    },
    jobTrees: {
      debug: [],
      allJob: [],
      myJob: []
    },
    jobList: []
  },
  getters: {
    tabs: state => state.configs.tabs,
    tab: state => state.layoutConfig.tab,
    tabConfgs: (state, getters) => getters.tab.configs,
    tabActive: (state, getters) => type => getters.tabConfgs[type].find(i => i.name === getters.tab.actives[type]),

    treeCache: (state) => state.treeCaches[state.layoutConfig.jobTab],
    flatJobsTree: (state) => {
      const jobsTree = state.jobTrees[state.layoutConfig.jobTab]
      const res = []
      if (jobsTree) {
        flatNodes(jobsTree, res)
      }
      return res
    },
    // 用于展示tab
    selectedJobNodes: (state, getters) => getters.treeCache?.selectedTabs.map(i => getters.flatJobsTree.find(j => j.key === i)),
    selectedJobNode: (state, getters) => getters.selectedJobNodes.find(i => i?.key === getters.selectedJobnodeKey),
    selectedJobnodeKey: (state, getters) => getters.treeCache.selectedKeys[0],

    editorBottomTabs: state => state.configs.editorBottomTabs
  },
  mutations: {
    toggleOnlyCenter(state) {
      state.layoutConfig.onlyCenter = !state.layoutConfig.onlyCenter
      setLocal(STORAGE_KEY_LAYOUT_INFO, state.layoutConfig)
    },
    setEditorBottom(state, name) {
      state.layoutConfig.editorBottom = name
    }
  },
  actions: {
    initLocalInfo({ state, getters, dispatch }) {
      initLocal(STORAGE_KEY_LAYOUT_INFO, info => {
        state.layoutConfig = info
      })
      initLocal(STORAGE_KEY_TREE_INFO, info => {
        state.treeCaches = info
      })
      const selectedKeys = getters.treeCache?.selectedKeys
      if (selectedKeys != null && selectedKeys[0]) {
        const id = selectedKeys[0].split('_')[1]
        if (id) {
          dispatch('getJob', { id })
        }
      }
    },
    initJobs({ state }) {
      axios.post("/scheduleCenter/init.do", {}).then((data) => {
        const allJob = [getTreeData(data.allJob)]
        const myJob = [getTreeData(data.myJob)]
        state.jobTrees.allJob = allJob
        state.jobTrees.myJob = myJob

        const jobTrees = state.jobTrees
        const treeCaches = state.treeCaches
        setTreeCache(treeCaches, jobTrees, 'allJob')
        setTreeCache(treeCaches, jobTrees, 'myJob')
      });
    },
    setTab({ state, getters, commit, dispatch }, { name, type }) {
      if (type == 'left') {
        state.layoutConfig.jobTab = name
        dispatch('getJob', { id: getters.selectedJobNode?.id, check: true })
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

      setLocal(STORAGE_KEY_LAYOUT_INFO, state.layoutConfig)
    },
    setTabResize({ getters }, { width, type }) {
      getters.tabActive(type).width = width
    },
    expanedTreeNode({ getters, dispatch }, keys) {
      getters.treeCache.expandedKeys = keys
      dispatch('saveTreeCache')

    },
    selectTreeNode({ getters, dispatch }, { key, selected, dic, id }) {
      console.log('selectNode', key)
      if (dic) {
        console.log(getters.treeCache.selectedKeys)
        return
      }
      const treeCache = getters.treeCache
      treeCache.selectedKeys = [key]
      if (selected) {
        return
      }
      if (!treeCache.selectedTabs.includes(key)) {
        treeCache.selectedTabs.push(key)
      }
      dispatch('saveTreeCache')
      dispatch('getJob', { id })
    },
    changeSelectedTab({ getters, dispatch }, { key, id }) {
      console.log('changeTab', key)
      if (key && getters.treeCache.selectedTabs.includes(key)) {
        return dispatch('getJob', { id, check: true }).then(() => {
          getters.treeCache.selectedKeys = [key]
          dispatch('saveTreeCache')
        })
      }
    },
    closeSelectedTab({ getters, dispatch }, key) {
      const tabs = getters.treeCache.selectedTabs
      let index = tabs.findIndex(i => i === key)
      if (index !== -1) {
        tabs.splice(index, 1)
        console.log(getters.selectedJobnodeKey === key)
        if (getters.selectedJobnodeKey === key) {
          index = index < tabs.length ? index : index - 1;
          const lastKey = tabs[index];
          const lastNode = getters.selectedJobNodes.find(i => i.key === lastKey)
          dispatch('changeSelectedTab', { key: lastKey, id: lastNode.id })
        } else {
          dispatch('saveTreeCache')
        }
        console.log(getters.selectedJobnodeKey)
      }
    },
    saveTreeCache({ state }) {
      console.log(state.treeCaches)
      setLocal(STORAGE_KEY_TREE_INFO, state.treeCaches)
    },
    getJob({ state }, { id, check }) {
      if (!id) {
        return new Promise((resolve) => { resolve() })
      }
      if (check) {
        if (state.jobList.findIndex(i => i.id === id) !== -1) {
          return new Promise((resolve) => { resolve() })
        }
      }
      return axios.get(`/scheduleCenter/getJobMessage.do?jobId=${id}`).then(data => {
        // 处理一下后端null。。
        data.script = data.script == null ? '' : data.script


        const job = state.jobList.find(i => i.id === id)
        if (job !== null) {
          state.jobList.push(data)
        } else {
          Object.assign(job, data)
        }
      })
    }
  }
}

// 扁平化树节点
function flatNodes(nodes, arr) {
  nodes.forEach(node => {
    arr.push(node)
    flatNodes(node.children, arr)
  })
}
function setTreeCache(caches, jobTrees, type) {
  const treeCache = caches[type]
  if (treeCache.expandedKeys.length === 0) {
    treeCache.expandedKeys = [jobTrees[type][0].key]
  }
}

function getTreeData(jobs) {
  return setUpJobs(jobs).find(i => i.origin.parent === 'group_0')
}

function setUpJobs(jobs) {
  jobs.forEach(job => {
    job.children = jobs.filter(i => i.parent === job.id)
  })
  return jobs.map(job => setUpJobNode(job))
}

function setUpJobNode(job) {
  const isDic = job.directory !== null
  const type = !isDic ? 'job' : (job.directory === 0 ? 'big_dic' : 'small_dic')
  return {
    id: job.jobId,
    isLeaf: !job.isParent || job.children.length === 0,
    key: 'node_' + job.id,
    title: job.jobName,
    origin: job,
    type,
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

function setLocal(key, value) {
  localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value))
}
function initLocal(key, callback) {
  const v = localStorage.getItem(STORAGE_KEY_PREFIX + key)
  if (v != null) {
    callback(JSON.parse(v))
  }
}