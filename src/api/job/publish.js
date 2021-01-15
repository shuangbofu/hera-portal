import axios from "@/utils/request.js";

export function getJobPublishes(pageSize, pageNum, filter) {
  pageSize = pageSize || 10
  pageNum = pageNum || 1
  return newPormise(axios.post('/jobPublish/page', {
    pageSize, pageNum, filter: { ...filter }
  }), data => {
    return { ...data, list: addStateInfo(data.list) }
  })
}

export function getLastJobPublish(jobId) {
  return newPormise(axios.get(`/jobPublish/last?jobId=${jobId}`), data => addStateInfo(data))
}

export function getJobPublishList(jobId) {
  return newPormise(axios.get(`/jobPublish/list?jobId=${jobId}`), data => addStateInfo(data))
}

export function createJobPublish({ jobId, description, configs, script, auditor }) {
  return axios.post('/jobPublish', { jobId, description, configs, script, auditor })
}

export function cancelJobPublish(id) {
  return axios.post('/jobPublish/cancel', { description: '', id })
}

export function passJobPublish(id) {
  return axios.post(`/jobPublish/pass/${id}`)
}

export function rollbackPublish(id) {
  return axios.post(`/jobPublish/rollback/${id}`)
}

export function retryJobPublish(id) {
  return axios.post(`/jobPublish/retry/${id}`)
}

export function forbidSave() {
  return axios.post('/jobPublish/forbidSave')
}

function newPormise(promise, trans) {
  return new Promise((res, rej) => promise.then(data => res(trans(data))).catch(msg => rej(msg)))
}

function addStateInfo(obj) {
  if (Array.isArray(obj)) {
    const list = obj;
    return list.map(i => addStateInfo(i))
  } else {
    return {
      ...obj,
      stateInfo: stateInfoMap[obj.state],
      selfConfigs: getSelfConfigs(obj.configs)
    }
  }
}
function getSelfConfigs(configs) {
  return Object.keys(configs)
    .map(key => key + " = " + configs[key])
    .join("\n");
}

const stateInfoMap = {
  padding: { color: "#ffb800", text: "待审批" },
  success: { color: "#87d068", text: "成功" },
  cancelled: { color: "#909399", text: "已取消" },
  rejected: { color: "#f50", text: "已拒绝" },
  error: { color: '#f50', text: '失败' },
  rolledBack: { color: '#909399', text: '已回滚' }
};
