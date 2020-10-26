import axios from "@/utils/request.js";
export function getScheduledJob(id) {
  return new Promise((res, rej) => {
    return axios.get(`/scheduleCenter/getJobMessage.do?jobId=${id}`).then(data => {
      // 处理一下数据格式（script null等。。）
      const script = data.script == null ? '' : data.script
      const focusUsers = str2Arr(data.focusUser)
      const adminUsers = str2Arr(data.uidS)
      const valid = data.auto === '开启'
      const dependencyArr = str2Arr(data.dependencies)
      const repeat = data.reapeatRun > 0
      const retryTimes = data.configs['roll.back.times']
      const retryWaitTime = data.configs['roll.back.wait.time']
      const priorityLevel = Number(data.configs['run.priority.level'] || -1)

      delete data.configs['roll.back.times']
      delete data.configs['roll.back.wait.time']
      delete data.configs['run.priority.level']

      const areaId = Number(data.areaId)

      res({
        ...data,
        script,
        focusUsers,
        adminUsers,
        valid,
        dependencyArr,
        repeat,
        retryTimes,
        retryWaitTime,
        priorityLevel,
        areaId
      })
    }).catch(msg => {
      rej(msg)
    })
  })
}

export function initScheduledJobs() {
  return axios.post("/scheduleCenter/init.do", {})
}

export function getScheduledGroup(id) {
  return axios.get(`/scheduleCenter/getGroupMessage.do?groupId=group_${id}`)
}

export function getAllAreas() {
  return axios.get('/scheduleCenter/getAllArea')
}

function str2Arr(str) {
  if (str === '' || !str) {
    return []
  }
  str = str.replace('[', '').replace(']', '').trim();
  if (str === '') {
    return []
  }
  return str.split(/\s+/)
}