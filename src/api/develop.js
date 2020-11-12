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
        areaId,

        selfConfigs: obj2Str(data.configs),

        rollBackTimes: retryTimes,
        rollBackWaitTime: retryWaitTime,
        runPriorityLevel: priorityLevel
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
  return new Promise((res, rej) => {
    return axios.get(`/scheduleCenter/getGroupMessage.do?groupId=group_${id}`).then(data => {
      const focusUsers = str2Arr(data.focusUser)
      const adminUsers = str2Arr(data.uidS)

      res({
        ...data,

        selfConfigs: obj2Str(data.configs),

        focusUsers,
        adminUsers
      })
    }).catch(msg => {
      rej(msg)
    })
  })
}

export function createJobGroup(data) {
  return post('/scheduleCenter/addGroup.do', data)
}

export function createJob(data) {
  return post('/scheduleCenter/addJob.do', data)
}

export function getAllAreas() {
  return axios.get('/scheduleCenter/getAllArea')
}

export function getJobLogList(pageSize, offset, jobId) {
  return axios.get(`/scheduleCenter/getJobHistory.do?pageSize=${pageSize}&offset=${offset}&jobId=${jobId}`)
}

export function getLog(logId, jobId) {
  return new Promise((res, rej) => {
    axios.get(`/scheduleCenter/getLog.do?id=${logId}&jobId=${jobId}`).then(data => {
      if (data?.log) {
        //eslint-disable-next-line
        data.log = data.log
          .replace(/<b>HERA#<\/b>((.|\n)*?<br>)/g, '<div class="hera">$1</div>')
          .replace(/<b>CONSOLE#<\/b>((.|\n)*?<br>)/g, '<div class="console">$1</div>')
          .replace(/<font style="color:red">/g, '<font class="error">')
        // .replace(/CONSOLE#/g, '【控制台】').replace(/HERA#/g, '【赫拉】 ')
      }
      res(data)
    }).catch(msg => {
      rej(msg)
    })
  })
}

export function getJobVersions(jobId) {
  return new Promise((res, rej) => {
    axios.get(`/scheduleCenter/getJobVersion.do?jobId=${jobId}`).then(data => {
      res(data.map(i => i.id))
    }).catch(msg => {
      rej(msg)
    })
  })
}

export function runJob(actionId, triggerType) {
  return axios.get(`/scheduleCenter/manual.do?actionId=${actionId}&triggerType=${triggerType}`)
}

export function updateJob(id, data) {
  const job = data

  // 更新接口的字段如下：
  const updateFields = [
    "name", "rollBackTimes", "rollBackWaitTime",
    "runType", "runPriorityLevel", "offset",
    "description", "scheduleType", "cronExpression",
    "dependencies", "cycle", "hostGroupId",
    "mustEndMinute", "estimatedEndHour", "areaId",
    "repeatRun", "selfConfigs", "script"]

  Object.keys(job).forEach(key => {
    if (!updateFields.includes(key)) {
      delete job[key]
    }
  })
  return post('/scheduleCenter/updateJobMessage.do', { ...data, id })
}

export function cancelJob(jobId, historyId) {
  return axios.get(`/scheduleCenter/cancelJob.do?historyId=${historyId}&jobId=${jobId}`)
}

function post(url, data) {
  return axios.post(url, objToParams(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
}

function objToParams(obj) {
  const params = new URLSearchParams()
  for (let key in obj) {
    params.append(key, obj[key])
  }
  return params
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

function obj2Str(obj) {
  return Object.keys(obj).map(key => {
    return key + ' = ' + obj[key]
  }).join('\n')
}