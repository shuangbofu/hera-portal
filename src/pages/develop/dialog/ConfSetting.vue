<template>
  <a-modal
    wrapClassName="conf-setting-dialog"
    :visible="visible"
    @cancel="close"
    width="36%"
    :closable="false"
    :mask="true"
    :destroyOnClose="true"
    :centered="true"
    :footer="null"
  >
    <div class="container" v-if="job.id">
      <div class="divider-box" title="基础信息">
        <div class="content">
          <div class="form-line">
            <div class="title">任务名称</div>
            <a-input size="small" style="width: 240px" v-model="job.name">
            </a-input>
          </div>
          <div class="form-line" style="align-items: flex-start">
            <div class="title">任务描述</div>
            <a-input
              type="textarea"
              size="small"
              style="width: 240px"
              v-model="job.description"
            >
            </a-input>
          </div>
          <div class="form-line">
            <div class="title">机器组：</div>
            <h-select
              style="width: 240px"
              v-model="job.hostGroupId"
              :options="
                hostGroups.map((i) => {
                  return { value: i.id, label: i.name };
                })
              "
            />
          </div>
          <div class="form-line">
            <div class="title">区域：</div>
            <h-select
              :multiple="true"
              style="width: 240px"
              v-model="job.areaIds"
              :options="
                areas.map((i) => {
                  return { value: i.id, label: i.name };
                })
              "
            />
          </div>
          <div class="form-line">
            <div class="title">管理员：</div>
            <h-select
              :multiple="true"
              style="width: 240px"
              v-model="job.adminUsers"
              :options="allUser"
            />
          </div>
        </div>
      </div>
      <div class="divider-box" title="任务配置">
        <div class="content">
          <div class="form-line">
            <div class="title">调度类型：</div>
            <h-select
              style="width: 240px"
              v-model="job.scheduleType"
              :options="[
                { label: '定时调度', value: 0 },
                { label: '依赖调度', value: 1 },
              ]"
            />
          </div>
          <div class="form-line" v-if="job.scheduleType === 1">
            <div class="title">依赖任务：</div>
            <h-select
              style="width: 240px"
              :multiple="true"
              v-model="job.dependencyArr"
              :options="
                allJobs.map((i) => {
                  return { value: i.id, label: i.name };
                })
              "
            />
          </div>
          <div class="form-line" v-if="job.scheduleType === 0">
            <div class="title">定时表达式：</div>
            <template v-for="(value, index) in job.cronExpressionArr">
              <a-input
                size="small"
                style="font-size: 10px; margin-right: 2px; width: 38.3px"
                :key="index"
                v-model="job.cronExpressionArr[index]"
              ></a-input>
            </template>
          </div>
          <div class="form-line">
            <div class="title">依赖周期：</div>
            <h-select
              style="width: 240px"
              v-model="job.cycle"
              :options="['无', '自依赖，依赖于当前任务的上一周期']"
            />
          </div>
          <div class="form-line">
            <div class="title">重复执行：</div>
            <a-checkbox
              size="small"
              v-model="job.repeat"
              style="font-size: 10px"
              >是否重复执行</a-checkbox
            >
          </div>
          <div class="form-line">
            <div class="title">重试次数：</div>
            <h-select
              style="width: 240px"
              v-model="job.retryTimes"
              :options="[0, 1, 2, 3, 4]"
            />
          </div>
          <div class="form-line">
            <div class="title">重试间隔(分)：</div>
            <h-select
              style="width: 240px"
              v-model="job.retryWaitTime"
              :options="[1, 10, 30, 60, 120]"
            />
          </div>
          <div class="form-line">
            <div class="title">优先级：</div>
            <h-select
              style="width: 240px"
              v-model="job.priorityLevel"
              :options="
                ['高', '中', '低'].map((i, idx) => {
                  return { label: i, value: idx + 1 };
                })
              "
            />
          </div>
        </div>
      </div>
      <div class="divider-box" title="告警配置">
        <div class="content">
          <div class="form-line">
            <div class="title">告警等级：</div>
            <h-select
              style="width: 240px"
              v-model="job.alarmLevelCode"
              :options="
                ['邮件', '微信', '电话'].map((i, idx) => {
                  return { label: i, value: idx };
                })
              "
            />
          </div>
          <div class="form-line">
            <div class="title">预计时长：</div>
            <a-input-number
              :min="0"
              size="small"
              style="margin-right: 2px; font-size: 10px; width: 70px"
              :formatter="(value) => `${value}分钟`"
              :parser="(value) => value.replace('分钟', '')"
              v-model="job.mustEndMinute"
            />
          </div>
          <div class="form-line">
            <div class="title">预计结束：</div>
            <a-input-number
              :min="0"
              :max="24"
              size="small"
              placeholder="时"
              style="margin-right: -1px; font-size: 10px; width: 60px"
              :formatter="(value) => `${value}时`"
              :parser="(value) => value.replace('时', '')"
              v-model="job.estimatedEndHourArr[0]"
            />
            <a-input-number
              :min="0"
              :max="60"
              size="small"
              placeholder="分"
              style="font-size: 10px; width: 60px"
              :formatter="(value) => `${value}分`"
              :parser="(value) => value.replace('分', '')"
              v-model="job.estimatedEndHourArr[1]"
            />
          </div>
        </div>
      </div>
      <div style="width: 100%; position: absolute; bottom: 20px; right: 20px">
        <div class="button active" style="float: right" @click="submit">
          确认
        </div>
        <div class="button" style="float: right" @click="close">取消</div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import HSelect from "../components/HSelect";
import { getJobOperators } from "@/api/develop";
export default {
  data() {
    return {
      job: {},
      visible: false,
      callback: null,
      jobBackup: {},
      allUser: [],
    };
  },
  components: { HSelect },
  computed: {
    areas() {
      return this.$store.state.develop.areas;
    },
    hostGroups() {
      return this.$store.state.develop.hostGroups;
    },
    allJobs() {
      return this.$store.getters["develop/allJobs"];
    },
  },
  methods: {
    show(job, callback) {
      getJobOperators(job.id).then((data) => {
        this.allUser = data;
        this.job = JSON.parse(JSON.stringify(job));
        this.jobBackup = JSON.parse(JSON.stringify(job));
        this.callback = callback;
        this.visible = true;
      });
    },
    close() {
      this.visible = false;
      this.job = this.jobBackup;
    },
    submit() {
      this.$store
        .dispatch("develop/updateJob", {
          id: this.job.id,
          data: this.job,
          refresh: false,
        })
        .then(() => {
          this.visible = false;
          this.callback(this.job);
        });
    },
  },
};
</script>

<style lang="less">
.conf-setting-dialog {
  .ant-modal-content {
    background: @editor-bg-color;
    .ant-modal-body {
      padding: 0;
      font-size: 12px;
    }
  }
}
</style>
<style lang="less" scoped>
.container {
  position: relative;
  padding: 20px;
  height: 80vh;
  user-select: none;
  overflow: auto;
  .divider-box {
    position: relative;
    border-top: 0.5px solid @editor-border2-color;
    background: @editor-bg-color;
    &::before {
      content: attr(title);
      position: absolute;
      left: 20px;
      transform: translateX(-50%);
      -webkit-transform: translate(-50%, -50%);
      background: @editor-bg-color;
      padding: 0 10px;
      font-size: 14px;
    }
    .content {
      padding: 20px;
      margin-left: 10px;
      margin-top: 10px;
      .form-line {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .title {
          margin-right: 10px;
          width: 100px;
        }
      }
    }
  }
  .button {
    text-align: center;
    padding: 5px 16px;
    // cursor: pointer;
    margin-right: 10px;
    &:hover {
    }
    &.active {
      background: @editor-tree-active-color;
      color: #ffffff;
    }
  }
}
</style>