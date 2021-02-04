import axios from "@/utils/request.js";

const alarmTypes = ['邮件', '微信', '电话']
export function getScheduledJob(id) {
  return new Promise((res, rej) => {
    return axios.get(`/scheduleCenter/getJobMessage.do?jobId=${id}`).then(data => {
      // 处理一下数据格式（script null等。。）
      const script = data.script == null ? '' : data.script
      const description = data.description == null ? '' : data.description
      const focusUsers = str2Arr(data.focusUser)
      const adminUsers = str2Arr(data.uidS)
      const valid = data.auto === '开启'
      const dependencyArr = str2Arr(data.dependencies, ',').map(i => Number(i))
      const repeat = data.repeatRun > 0
      const retryTimes = Number(data.configs['roll.back.times'] || 0)
      const retryWaitTime = Number(data.configs['roll.back.wait.time'] || 1)
      const priorityLevel = Number(data.configs['run.priority.level'] || 3)

      const alarmLevelCode = alarmTypes.findIndex(i => i == data.alarmLevel)

      const estimatedEndHourArr = data.estimatedEndHour.split(":").map(i => Number(i))

      let cronExpressionArr = str2Arr(data.cronExpression)
      if (data.scheduleType === 0) {
        if (cronExpressionArr.length === 0) {
          cronExpressionArr = ['0', '0', '3', '*', '*', '?']
        }
      }
      const dependencyPeriod = {
        '无': 'NONE',
        '自依赖，依赖于当前任务的上一周期': 'SELF_LAST'
      }[data.cycle]

      delete data.configs['roll.back.times']
      delete data.configs['roll.back.wait.time']
      delete data.configs['run.priority.level']

      const areaIds = data.areaId.split(',').map(i => Number(i.trim())).filter(i => i !== '')

      let lang = 'shell'
      const type = data.runType;
      if (["Spark", "Hive"].includes(type)) {
        lang = "sql";
      } else if (type === "Shell") {
        lang = "shell";
      } else if (type === "Python") {
        lang = "python";
      }

      res({
        ...data,
        script,
        description,
        focusUsers,
        adminUsers,
        valid,
        dependencyArr,
        repeat,
        retryTimes,
        retryWaitTime,
        priorityLevel,
        areaIds,
        versions: [],
        lang,

        alarmLevelCode, estimatedEndHourArr, cronExpressionArr,
        dependencyPeriod,

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

export function getNewstJobContent(id) {
  return new Promise((res, rej) => {
    return getScheduledJob(id).then(data => {
      return res({ script: data.script, selfConfigs: data.selfConfigs })
    }).catch(msg => rej(msg))
  })
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
  job.cronExpression = job.cronExpressionArr.map(i => i === '' ? '*' : i).join(' ')
  job.dependencies = job.dependencyArr.join(',')
  job.cycle = job.dependencyPeriod

  if (job.adminUsers) {
    updatePermission({ uIdS: JSON.stringify(job.adminUsers), id: job.id, type: 'JOB' })
  }

  Object.keys(job).forEach(key => {
    if (!updateFields.includes(key)) {
      delete job[key]
    }
  })
  return post('/scheduleCenter/updateJobMessage.do', { ...data, id })
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

export function updateGroup(id, data) {
  const groupId = `group_${id}`
  const updateFields = ['name',
    'description',
    'selfConfigs',
    'resource']

  if (data.adminUsers) {
    updatePermission({ uIdS: JSON.stringify(data.adminUsers), id: groupId, type: 'GROUP' })
  }

  Object.keys(data).forEach(key => {
    if (!updateFields.includes(key)) {
      delete data[key]
    }
  })
  return post('/scheduleCenter/updateGroupMessage.do', { groupId, ...data })
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
          `<div style="font-weight: bold;display:flex;">日志提示：
           <span class="error"  style="margin-right: 10px">错误日志</span>
           <span class="hera" style="margin-right: 10px">赫拉日志</span>
           <span class="console" >控制台日志</span>
        </div><br>` + data.log
            .replace(/<b>HERA#<\/b>((.|\n)*?<br>)/g, '<div class="hera">$1</div>')
            .replace(/<b>CONSOLE#<\/b>((.|\n)*?<br>)/g, '<div class="console">$1</div>')
            .replace(/<font style="color:red">/g, '<font class="error">')
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

export function previewJobScript(actionId) {
  return axios.get(`/scheduleCenter/previewJob.do?actionId=${actionId}`)
}

export function getJobOperators(id, isGroup) {
  const finalId = isGroup ? `group_${id}` : id;
  const type = isGroup ? 'GROUP' : 'JOB'
  return new Promise((res, rej) => {
    axios.get(`/scheduleCenter/getJobOperator?jobId=${finalId}&type=${type}`).then(data => {
      res(data.allUser.map(i => i.name))
    }).catch(msg => rej(msg))
  })
}


export function focusJobOrNot(id, focus) {
  return post(`/scheduleCenter/${!focus ? 'delMonitor' : 'addMonitor'}`, { id })
}

export function setJobValidOrNot(id, valid) {
  return post('/scheduleCenter/updateSwitch', { id, status: valid ? 1 : 0 })
}

export function generateVersion(jobId) {
  return post('/scheduleCenter/generateVersion', { jobId })
}

export function deleteJobOrGroup(id, type) {
  const isJob = type === 'job'
  return post('/scheduleCenter/deleteJob.do', {
    id: !isJob ? `group_${id}` : id,
    type: isJob ? 'JOB' : 'GROUP'
  })
}

export function runJob(actionId, triggerType) {
  return axios.get(`/scheduleCenter/manual.do?actionId=${actionId}&triggerType=${triggerType}`)
}

export function updatePermission(data) {
  return post('/scheduleCenter/updatePermission', data)
}

export function cancelJob(jobId, historyId) {
  return axios.get(`/scheduleCenter/cancelJob.do?historyId=${historyId}&jobId=${jobId}`)
}

export function copyJob(jobId, name) {
  return post(`/scheduleCenter/copyJob.do`, { copyJobId: jobId, name })
}

export function moveNode(id, from, to) {
  return axios.get(`/scheduleCenter/moveNode?id=${id}&parent=${to}&lastParent=${from}`)
}

export function updateResource(fileFrom) {
  return post('/uploadResource/upload.do', { fileFrom, file_id: 0 })
}



export function fetchJobGraphdata(jobId, type, dayNum) {
  return post('/scheduleCenter/getJobImpactOrProgress', { jobId, type, dayNum })
}

export function getRecords({ offset, pageSize, jobId, type }) {
  return axios.get(`/record/find?pageSize=${pageSize}&offset=${offset}&jobId=${jobId}&type=${type}`)
}

export function getRecordDetail({ id, logType, type }) {
  return new Promise((res, rej) => {
    return axios.get(`/record/now?logId=${id}&logType=${logType}&type=${type}`).then(data => res(fixRecordContent({ content: data.content, type }))).catch(msg => rej(msg))
  })
}

export function getJobRecords({ offset, pageSize, jobId }) {
  return new Promise((res, rej) => {
    return getRecords({ offset, pageSize, jobId, type: 'job' }).then(data => {
      data.rows.forEach(row => fixRecordContent(row))
      res(data)
    }).catch(msg => rej(msg))
  })
}

function fixRecordContent(data) {
  const content = data.content
  const type = data.type
  if (type === '任务配置') {
    if (isJson(content)) {
      const json = JSON.parse(content)
      delete json['roll.back.times']
      delete json['roll.back.wait.time']
      delete json['run.priority.level']
      data.content = obj2Str(json)
    }
  } else if (type === '任务开启/关闭状态') {
    data.content = Number(content) > 0 ? '开启' : '关闭'
  }
  return data
}

export function getJobRecordDetail({ id, type }) {
  return getRecordDetail({ id, logType: 'job', type })
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

// common 

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

function str2Arr(str, split) {
  if (!split) {
    split = /\s+/
  }
  if (str === '' || !str) {
    return []
  }
  str = str.replace('[', '').replace(']', '').trim();
  if (str === '') {
    return []
  }
  return str.split(split)
}

function obj2Str(obj) {
  return Object.keys(obj).map(key => {
    return key + ' = ' + obj[key]
  }).join('\n')
}