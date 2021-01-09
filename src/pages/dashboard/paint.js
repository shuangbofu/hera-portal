export function getBasicOption(xData, legendData, ySeries) {
  const option = {
    xAxis: {
      type: 'category',
      data: xData
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      data: legendData,
    },
    yAxis: {
      type: 'value'
    },
    series: ySeries.map(i => {
      return {
        ...i,
        // itemStyle: { normal: { label: { show: true } } }
      }
    })
  };
  return option;
}

function getDefaultPieOption() {
  return {
    title: {
      text: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: [],
    },
    series: [
      {
        name: '运行状态',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}

const statusMappings = [{ name: 'running', label: '正在运行', color: '#f5c66f' }, { name: 'success', label: '运行成功', color: '#60A766' }, { name: 'failed', label: '运行失败', color: '#D6595D' }]
const mappings2 = [{ name: "jobTime", label: "今日" }, { name: "yesterdayTime", label: "昨日" }];
const mappings3 = [{ name1: 'runFailed', name2: 'failed', label1: '运行失败次数', label2: '失败任务数' }, { name1: 'runSuccess', name2: 'success', label1: '运行成功次数', label2: '成功任务数' }]

export function getJobInfoPie(data) {
  data = data.map(i => {
    return {
      value: i.num || 0,
      name: i.status
    };
  })

  const option = getDefaultPieOption()
  option.legend = {
    ...option.legend,
    data: statusMappings.map(i => i.label),
    formatter: name => {
      const mapping = statusMappings.find(i => i.label === name)
      const value = data.find(i => i.name === mapping.name)?.value
      return `${mapping.label} (${value})`
    }
  }
  option.series[0].data = data.map(i => {
    const mapping = statusMappings.find(j => j.name === i.name)
    return {
      ...i,
      name: mapping.label,
      itemStyle: { color: mapping.color },
    }
  })
  return option
}

export function getJobInfoBar(data) {
  return getBasicOption(data.map(i => i.jobId),
    mappings2.map(i => i.label),
    mappings2.map(i => {
      return {
        name: i.label,
        type: "bar",
        data: data.map(j => j[i.name])
      };
    }))
}

export function getJobInfoLine1(data) {
  const dates = Object.keys(data).filter(key => key.includes('-'))
  const seriesData = mappings3.map(i => {
    return {
      ...i,
      data: dates.map(j => eval(data[j].filter(k => k.status.toLowerCase() === i.name2).map(k => k.num).join('+')) || 0)
    }
  })
  return getJobInfoLine(2, dates, seriesData)
}

export function getJobInfoLine2(data) {
  const dates = data[mappings3[0].name1].filter(i => i.curDate).map(i => i.curDate)
  const seriesData = mappings3.map(i => {
    return {
      ...i,
      data: data[i.name1].filter(i => i.curDate).map(i => i.num)
    }
  })
  return getJobInfoLine(1, dates, seriesData)
}

export function getJobInfoLine(index, xData, ySeriesData) {
  const labelName = `label${index}`
  const nameName = `name${index}`
  const option = getBasicOption(xData, mappings3.map(i => i[labelName]), ySeriesData.map(i => {
    return {
      data: i.data,
      name: mappings3.find(j => j[nameName] === i[nameName])[labelName],
      type: 'line',
      stack: '总量',
      areaStyle: {},
      label: {
        normal: {
          show: true,
          position: 'top'
        }
      },
      // itemStyle: { color: statusMappings.find(j => i[nameName].toLowerCase().includes(j.name))?.color },
    }
  }))
  option.tooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  }
  option.xAxis.boundaryGap = false
  return option
}
