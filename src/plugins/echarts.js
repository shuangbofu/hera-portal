import ECharts from 'vue-echarts' // 在 webpack 环境下指向 components/ECharts.vue
import theme from './theme.json'
// Map of China
// registering custom theme
ECharts.registerTheme('test', theme)

// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'

// 注册组件后即可使用

export default ECharts