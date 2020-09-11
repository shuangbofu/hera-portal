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
          name: 'A',
          label: '任务配置',
          icon: 'config'
        },
        //  {
        //   name: 'ddd',
        //   label: '配置项',
        //   icon: 'config'
        // },
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
      }
    },
    layoutConfig: {
      tab: {
        left: {
          name: null,
          width: null
        },
        right: {
          name: null,
          width: null
        },
        bottom: {
          name: null
        }
      }
    },
    jobs: {
      allJob: [],
      myJob: []
    }
  },
  getters: {
    tabs: state => state.configs.tabs,
    tab: state => state.layoutConfig.tab,
    jobs: (state, getters) => getters.tab.left.name ? state.jobs[getters.tab.left.name] : []
  },
  mutations: {
    setTab(state, { name, type }) {
      const tab = state.layoutConfig.tab
      const key = `${type}`
      const origin = tab[key]
      const isClose = origin.name === name
      origin.width = isClose ? null : (origin.width || { right: 28, left: 20 }[type])
      origin.name = isClose ? null : name
      console.log(origin)
      saveLocalInfo(state.layoutConfig)
    },
    setTabResize(state, { width, type }) {
      const origin = state.layoutConfig.tab[`${type}`]
      origin.width = width
      saveLocalInfo(state.layoutConfig)
    }
  },
  actions: {
    initLocalInfo({ state }) {
      state.layoutConfig = getLocalInfo()
    },
    initJobs({ state }) {
      axios.post("/scheduleCenter/init.do", {}).then((data) => {
        state.jobs.allJob = [getTreeData(data.allJob)]
        state.jobs.myJob = [getTreeData(data.myJob)]
        console.log(state.jobs)
      });
    }
  }
}

function getTreeData(jobs) {
  return setUpJobs(jobs).find(i => i.origin.parent === 'group_0')
}

function setUpJobs(jobs) {
  jobs.forEach(job => {
    job.children = jobs.filter(i => i.parent === job.id)
  })
  return jobs.map(job => setUpJob(job))
}

function setUpJob(job) {
  const isDic = job.directory !== null
  const type = !isDic ? 'job' : (job.directory === 0 ? 'big_dic' : 'small_dic')
  return {
    id: job.id,
    isLeaf: !job.isParent || job.children.length === 0,
    key: 'node_' + job.id,
    title: job.jobName,
    origin: job,
    type,
    children: job.children.map(i => setUpJob(i)),
    scopedSlots: {
      icon: isDic ? 'dic' : 'job',
      title: 'title'
    }
  }
}

const STORAGE_KEY_LAYOUT_INFO = "layoutConfig"
const STORAGE_KEY_PREFIX = "hera_"

function saveLocalInfo(info) {
  setLocal(STORAGE_KEY_LAYOUT_INFO, info)
}
function getLocalInfo() {
  const info = getLocal(STORAGE_KEY_LAYOUT_INFO)
  return info || { tab: { left: {}, right: {}, bottom: {} } }
}

function setLocal(key, value) {
  localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value))
}
function getLocal(key) {
  const v = localStorage.getItem(STORAGE_KEY_PREFIX + key)
  if (v != null) {
    return JSON.parse(v)
  }
  return null;
}