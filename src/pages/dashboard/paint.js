function getDefaultPieOption() {
  return {
    title: {
      text: '',
      subtext: 'xxxxx',
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
export function getJobInfoPie(data) {
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
      itemStyle: { color: mapping.color }
    }
  })
  return option
}

export function getJobInfoBar(xData, ySeriesData) {
  option = {
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: {
      type: 'value'
    },
    series: ySeriesData.map(i => {
      return {
        type: 'bar',
        data: i
      }
    })
  };
  return option;

}