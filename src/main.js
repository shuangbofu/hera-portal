import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "@/utils/request.js";
import Antd from 'ant-design-vue'
import './theme/index.less'
import splitPane from 'vue-splitpane'
import { Icon } from 'ant-design-vue';
import ECharts from '@/plugins/echarts.js';

const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2056046_oyu9ehwl1s.js'
});

Vue.component('split-pane', splitPane);
Vue.component('my-icon', MyIcon)
Vue.component('v-chart', ECharts)
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(Antd)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
