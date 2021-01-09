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
          <div style="margin-bottom: 10px">
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
          内存使用率：
          <a-progress
            class="progress"
            type="circle"
            :percent="info.memRatePrecent"
            :width="60"
            :strokeColor="getStrokeColor(info.memRatePrecent)"
          />
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
          <div style="padding: 10px">
            <div
              style="margin-bottom: 2px"
              v-for="(item, index) in info[listActiveTabs[info.host]]"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
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
// import mockData from "./mockdata.json";
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
import { getJobQueue } from "@/api/dashboard";
export default {
  data() {
    return {
      jobQueueInfos: [],
      tabs,
      listActiveTabs: {}
    };
  },
  computed: {
    ...mapState("setting", ["theme", "weekMode", "lang"])
  },
  created() {
    this.initQueueInfo();
  },
  methods: {
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
            this.listActiveTabs[host] = "running";
          } else {
            arr[index].isMaster = true;
          }
        });
        this.jobQueueInfos = arr;
      });
      // const data = mockData;
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

<style lang="less" scoped>
.container {
  // padding: 20px;
  background-color: @base-bg-color;
  .infos {
    // background-color: @editor-bg-color;
    display: flex;
    padding: 20px;
    .info {
      border: 1px solid @editor-border-color;
      background-color: @base-bg-color;
      margin: 0 20px 20px 0;
      .content {
        padding: 10px;
        .progress {
          margin-right: 10px;
        }
      }
      .lists {
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
      }
      .title {
        padding: 4px 6px;
        background-color: @editor-bg-color;
      }
    }
  }
}
</style>