export default {
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
        name: 'publish',
        label: '任务发布',
        icon: 'publish',
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
  }, {
    name: 'preview',
    label: '预览'
  }]
}