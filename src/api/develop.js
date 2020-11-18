import axios from "@/utils/request.js";

const alarmTypes = ['邮件', '微信', '电话']
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
      const retryTimes = Number(data.configs['roll.back.times'] || 0)
      const retryWaitTime = Number(data.configs['roll.back.wait.time'] || 1)
      const priorityLevel = Number(data.configs['run.priority.level'] || 3)

      const alarmLevelCode = alarmTypes.findIndex(i => i == data.alarmLevel)

      const estimatedEndHourArr = data.estimatedEndHour.split(":").map(i => Number(i))
      const cronExpressionArr = str2Arr(data.cronExpression)

      if (cronExpressionArr.length === 0) {
        for (let i = 0; i < 6; i++) {
          cronExpressionArr.push('')
        }
      }

      // const 

      // const dependencyPeriod = {
      //   '无': 'NONE',
      //   '自依赖，依赖于当前任务的上一周期': 'SELF_LAST'
      // }[data.cycle]

      delete data.configs['roll.back.times']
      delete data.configs['roll.back.wait.time']
      delete data.configs['run.priority.level']

      const areaIds = data.areaId.split(',').map(i => Number(i.trim())).filter(i => i !== '')

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
        areaIds,

        alarmLevelCode, estimatedEndHourArr, cronExpressionArr,
        // dependencyPeriod,

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
      const adminUsers = str2Arr(data.uIdS)

      res({
        ...data,
        parent: `group_${data.parent}`,

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
  return new Promise((res, rej) => {
    axios.get('/scheduleCenter/getAllArea').then(data => {
      data.forEach(area => {
        area.name = {
          all: '全部',
          AY: '中国区',
          IND: '印度区',
          US: '美国区',
          EU: '欧洲区',
          UE: '美东区',
          WE: '西欧区',
        }[area.name] || area.name
      })
      res(data)
    }).catch(msg => { rej(msg) })
  })
}

export function getHostGroups() {
  return axios.get('/scheduleCenter/getHostGroupIds')
}

export function getJobLogList(pageSize, offset, jobId) {
  return axios.get(`/scheduleCenter/getJobHistory.do?pageSize=${pageSize}&offset=${offset}&jobId=${jobId}`)
}

export function getLog(logId, jobId) {
  return new Promise((res, rej) => {
    axios.get(`/scheduleCenter/getLog.do?id=${logId}&jobId=${jobId}`).then(data => {
      if (data?.log) {
        //eslint-disable-next-line
        data.log =
          `<div style="font-weight: bold">
          日志提示：
           <span class="error"  style="margin-right: 10px">错误日志</span>
           <span class="hera" style="margin-right: 10px">赫拉日志</span>
           <span class="console" >控制台日志</span>
        </div><br>` + data.log
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

export function getJobOperators(jobId) {
  return new Promise((res, rej) => {
    axios.get(`/scheduleCenter/getJobOperator?jobId=${jobId}&type=JOB`).then(data => {
      res(data.allUser.map(i => i.name))
    }).catch(msg => rej(msg))
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

  job.areaId = job.areaIds.join(',')
  job.runPriorityLevel = job.priorityLevel
  job.rollBackTimes = job.retryTimes
  job.rollBackWaitTime = job.retryWaitTime
  job.repeatRun = job.repeat ? 1 : 0

  job.offset = job.alarmLevelCode
  job.estimatedEndHour = job.estimatedEndHourArr.join(':')
  job.cronExpression = job.cronExpressionArr.filter(i => i !== '').join(' ')
  job.dependencies = job.dependencyArr.join(',')

  updatePermission({ uIdS: JSON.stringify(job.adminUsers), id: job.id, type: 'JOB' })

  Object.keys(job).forEach(key => {
    if (!updateFields.includes(key)) {
      delete job[key]
    }
  })
  return post('/scheduleCenter/updateJobMessage.do', { ...data, id })
}

export function updatePermission(data) {
  return post('/scheduleCenter/updatePermission', data)
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