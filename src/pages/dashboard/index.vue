<template>
  <div class="container">
    <div class="infos">
      <div v-for="info in jobQueueInfos" :key="info.host" class="info">
        <div class="title">
          {{ info.host }}
          <a-tag
            v-if="info.isMaster"
            color="blue"
            style="margin-left: 6px; margin-right: 0px"
            >master</a-tag
          >
          <a-tag color="orange" style="margin-left: 6px">{{ info.type }}</a-tag>
        </div>
        <div class="content">
          <div class="texts">
            <span style="margin-right: 10px">核心数：{{ info.cores }}</span>
            <span style="margin-right: 10px"
              >总内存：{{ info.memTotal.toFixed(2) }}</span
            >
            <span style="margin-right: 10px"
              >cpu负载：{{ info.cpuLoadPerCore }}</span
            >
            <div>
              <span style="margin-right: 10px">心跳：{{ info.date }}</span>
            </div>
          </div>
          <div class="progress">
            内存使用率：
            <a-progress
              style="margin-left: 10px"
              type="circle"
              :percent="info.memRatePrecent"
              :width="50"
              :strokeColor="getStrokeColor(info.memRatePrecent)"
            />
          </div>
        </div>
        <div class="lists">
          <div class="list-tabs">
            <div
              :class="[
                'list-tab',
                tab.name === listActiveTabs[info.host] ? 'active' : '',
              ]"
              v-for="tab in tabs"
              :key="tab.name"
              @click="change(info.host, tab.name)"
            >
              {{ tab.label }} ({{ info[tab.name].length }})
            </div>
          </div>
          <div class="list-content">
            <div
              class="content-item"
              v-for="(item, index) in info[listActiveTabs[info.host]]"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="charts">
      <div
        class="chart"
        :key="index"
        v-for="(chartOption, index) in chartOptions"
      >
        <div class="title">
          {{ chartOption.title.text }}
        </div>
        <v-chart
          :style="chartOption.style"
          :ref="`chart-${index}`"
          theme="test"
          :options="chartOption"
        />
      </div>
    </div>
  </div>
</template>


<script>
const tabs = [
  { label: "调度任务", name: "running" },
  { label: "手动执行", name: "manualRunning" },
  { label: "开发任务", name: "debugRunning" },
  { label: "重跑任务", name: "rerunRunning" },
  { label: "超级恢复", name: "superRunning" }
];
function getStrokeColor(num) {
  if (num < 50) {
    return "#5cb87a";
  } else if (50 <= num && num < 80) {
    return "#e6a23c";
  } else {
    return "#f56c6c";
  }
}
import { mapState, mapMutations } from "vuex";
import {
  getJobQueue,
  getAllJobStatusDetail,
  getJobRunTimeTop10,
  getJobStatus
} from "@/api/dashboard";
import {
  getJobInfoBar,
  getJobInfoPie,
  getJobInfoLine1,
  getJobInfoLine2
} from "./paint";

export default {
  data() {
    return {
      jobQueueInfos: [],
      tabs,
      listActiveTabs: {},
      interval: null,
      chartOptions: []
    };
  },
  computed: {
    ...mapState("setting", ["theme", "weekMode", "lang"])
  },
  created() {
    this.initQueueInfo();
    this.interval = setInterval(() => {
      this.initQueueInfo();
    }, 5000);
  },
  mounted() {
    this.createCharts();
  },
  destroyed() {
    clearInterval(this.interval);
    this.interval = null;
  },
  methods: {
    createCharts() {
      this.addChart("实时任务状态", getJobInfoPie, getJobStatus, {
        width: "400px"
      });
      this.addChart("任务时长TOP10", getJobInfoBar, getJobRunTimeTop10, {
        width: "800px"
      });
      this.addChart("任务执行情况", getJobInfoLine1, getAllJobStatusDetail, {
        width: "750px"
      });
      this.addChart("任务执行次数", getJobInfoLine2, getAllJobStatusDetail, {
        width: "750px"
      });
    },
    addChart(title, optionFunc, reqFuc, style) {
      reqFuc().then(data => {
        const option = optionFunc(data);
        option.title = { text: title };
        option.style = Object.assign(
          { padding: "10px 10px 25px 10px", margin: "0 auto" },
          style
        );
        this.chartOptions.push(option);
      });
    },
    getStrokeColor,
    ...mapMutations("setting", ["setTheme"]),
    initQueueInfo() {
      getJobQueue().then(data => {
        let arr = [];
        Object.keys(data).forEach(key => {
          const type = key.split("-")[0];
          const value = data[key];
          const host = value.host;
          const index = arr.findIndex(i => i.host === host);
          if (index == -1 && type === "worker") {
            arr.push({
              type,
              memRatePrecent: Number((value.memRate * 100).toFixed(2)),
              ...value
            });
            this.listActiveTabs[host] = this.listActiveTabs[host] ||  "running";
          } else {
            arr[index].isMaster = true;
          }
        });
        this.jobQueueInfos = arr;
      });
    },
    change(host, value) {
      this.$set(this.listActiveTabs, host, value);
      this.$set(this, "listActiveTabs", {
        ...this.listActiveTabs,
        host: value
      });
    }
  }
};
</script>
<style lang="less">
.echarts {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
<style lang="less" scoped>
.container {
  background-color: @base-bg-color;
  .infos {
    display: flex;
    padding: 20px;
    padding-bottom: 0;
    .info {
      width: 600px;
      border: 1px solid @editor-border-color;
      background-color: @base-bg-color;
      margin: 0 20px 20px 0;
      .content {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .texts {
          font-size: 10px;
        }
        .progress {
          border: 1px solid @editor-border-color;
          padding: 5px 10px;
          .ant-progress-text {
            font-size: 9px;
          }
        }
      }
      .lists {
        height: 150px;
        .list-tabs {
          line-height: 25px;
          height: 29px;
          display: flex;
          margin-left: 10px;
          .list-tab {
            cursor: default;
            padding: 2px 12px;
            font-size: 12px;
            &:hover {
              background-color: @hover-bg-color;
            }
            &.active {
              border-bottom: 2px solid @primary-color!important;
            }
          }
        }
        .list-content {
          padding: 10px;
          text-align: center;
          display: flex;
          flex-wrap: wrap;
          overflow: auto;
          .content-item {
            font-size: 10px;
            margin: 0 10px 10px 0;
            background-color: @editor-bg-color;
            padding: 4px 10px;
          }
        }
      }
      .title {
        padding: 4px 6px;
        background-color: @editor-bg-color;
      }
    }
  }
  .charts {
    height: 100%;
    width: 100%;
    padding: 20px;
    padding-top: 0;
    display: flex;
    flex-wrap: wrap;
    .chart {
      flex: 1 1 auto;
      margin-right: 20px;
      margin-bottom: 20px;
      border: 1px solid @editor-border-color;
      height: 400px;
      .title {
        padding: 4px 6px;
        background-color: @editor-bg-color;
      }
    }
  }
}
</style>