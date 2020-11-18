<template>
  <div class="container">
    <a-collapse v-model="collapseActive" :bordered="false">
      <a-collapse-panel key="1" header="基础信息">
        <!-- <a-icon
          slot="extra"
          type="setting"
          @click="(e) => handleClick('basic', e)"
        /> -->
        <a-descriptions :column="1" size="small">
          <a-descriptions-item label="ID" span="1"
            >{{ data.id }}
          </a-descriptions-item>
          <a-descriptions-item label="名称"
            >{{ data.name }}
          </a-descriptions-item>
          <a-descriptions-item label="描述"
            >{{ data.description }}
          </a-descriptions-item>
          <a-descriptions-item label="所有人"
            >{{ data.owner }}
          </a-descriptions-item>
          <a-descriptions-item label="关注人">
            <template v-if="data.focuUsers && data.focusUsers.length > 0">
              <a-tag :key="idx" v-for="(user, idx) in data.focusUsers">
                {{ user }}
              </a-tag>
            </template>
            <template v-else> 无 </template>
          </a-descriptions-item>
          <a-descriptions-item label="管理员">
            <template v-if="data.adminUsers && data.adminUsers.length > 0">
              <a-tag :key="idx" v-for="(user, idx) in data.adminUsers">
                {{ user }}
              </a-tag>
            </template>
            <template v-else> 无 </template>
          </a-descriptions-item>
          <template v-if="!isGroup">
            <a-descriptions-item label="任务类型"
              >{{ data.runType }}
            </a-descriptions-item>
            <a-descriptions-item label="调度类型"
              >{{ ["定时调度", "依赖调度"][data.scheduleType] }}
            </a-descriptions-item>
            <a-descriptions-item label="调度">
              <div class="dot-inner">
                <a-badge
                  :color="data.valid ? '#87d068' : '#f50'"
                  :text="data.valid ? '开启' : '关闭'"
                />
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="机器组"
              >{{ data.hostGroupName }}
            </a-descriptions-item>
            <a-descriptions-item label="区域">
              {{ areas }}
            </a-descriptions-item>
          </template>
        </a-descriptions>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="任务配置" v-if="!isGroup">
        <!-- <a-icon
          slot="extra"
          type="setting"
          @click="(e) => handleClick('conf', e)"
        /> -->
        <a-descriptions :column="1" size="small">
          <a-descriptions-item
            v-if="data.scheduleType === 0"
            label="定时表达式"
          >
            {{ data.cronExpression }}
          </a-descriptions-item>
          <template v-else>
            <a-descriptions-item label="依赖任务">
              <a-tag :key="idx" v-for="(de, idx) in data.dependencyArr">
                {{ de }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="依赖周期"
              >{{ data.cycle }}
            </a-descriptions-item>
          </template>
          <a-descriptions-item label="重复执行"
            >{{ data.repeat ? "是" : "否" }}
          </a-descriptions-item>
          <a-descriptions-item label="重试次数"
            >{{ data.retryTimes }}
          </a-descriptions-item>
          <a-descriptions-item label="重试间隔（分）"
            >{{ data.retryWaitTime }}
          </a-descriptions-item>
          <a-descriptions-item label="优先级"
            >{{ data.priorityLevel }}
          </a-descriptions-item>
          <!-- </template> -->
        </a-descriptions></a-collapse-panel
      >
      <a-collapse-panel key="3" header="告警配置" v-if="!isGroup">
        <!-- <a-icon
          slot="extra"
          type="setting"
          @click="(e) => handleClick('alarm', e)"
        /> -->
        <a-descriptions :column="1" size="small">
          <a-descriptions-item label="预计结束时长（分）"
            >{{ data.mustEndMinute }}
          </a-descriptions-item>
          <a-descriptions-item label="预计结束"
            >{{ data.estimatedEndHour }}
          </a-descriptions-item>
          <a-descriptions-item label="告警等级"
            >{{ data.alarmLevel }}
          </a-descriptions-item>
        </a-descriptions>
      </a-collapse-panel>
    </a-collapse>
    <!-- <a-modal
      :mask="false"
      :visible="v != null"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      width="50%"
      @cancel="v = null"
    >
      <conf-setting :data="data"> </conf-setting>
    </a-modal> -->
  </div>
</template>

<script>
// import { ConfSetting } from "./confSetting";
export default {
  props: ["data", "active", "isGroup"],
  data() {
    return {
      collapseActive: [1, 2, 3],
      v: null,
      confirmLoading: false,
    };
  },
  components: {
    // ConfSetting,
  },
  computed: {
    areas() {
      return this.$store.state.develop.areas
        .filter((i) => this.data.areaIds.includes(i.id))
        .map((i) => i.name)
        .join(",");
    },
  },
  methods: {
    handleClick(v, e) {
      this.v = v;
      e.stopPropagation();
    },
    handleOk() {
      console.log("ok");
      this.v = null;
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  // margin: 0 5%;
}
</style>
<style lang="less">
.dot-inner {
  display: flex;
  .ant-badge-status-dot {
    height: 8px;
    width: 8px;
  }
  .ant-badge-status-text {
    font-size: 13px;
  }
}
.ant-divider-horizontal.ant-divider-with-text-center,
.ant-divider-horizontal.ant-divider-with-text-left,
.ant-divider-horizontal.ant-divider-with-text-right {
  margin: 6px 0;
}
.ant-collapse {
  border: 0 !important;
}
.ant-collapse-content {
  background: @base-bg-color !important;
  font-size: 11px !important;
}
.ant-collapse-header {
  padding: 6px 12px !important;
  padding-left: 40px !important;
  background: @base-bg-color !important;
}
.ant-descriptions-row .ant-descriptions-item span {
  font-size: 13px;
}
</style>