<template>
  <a-modal
    wrapClassName="create-job-dialog"
    :visible="visible"
    @cancel="close"
    width="60%"
    :closable="false"
    :mask="true"
    :destroyOnClose="true"
    :centered="true"
    :footer="null"
  >
    <div class="container">
      <div class="divider-box" title="基础信息">
        <div class="content">
          <div class="form-line">
            <div class="title">调度类型：</div>
            <h-select
              style="width: 200px"
              v-model="job.scheduleType"
              :options="[
                { label: '定时调度', value: 0 },
                { label: '依赖调度', value: 1 },
              ]"
            >
            </h-select>
          </div>
        </div>
      </div>
      <div class="divider-box" title="任务配置">
        <div class="content">ddd</div>
      </div>
      <div class="divider-box" title="告警配置">
        <div class="content">ddd</div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import HSelect from "../components/HSelect";
export default {
  data() {
    return {
      job: {},
      visible: false,
      callback: null,
    };
  },
  components: { HSelect },
  methods: {
    show(job, callback) {
      this.job = { ...job };
      this.callback = callback;
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  padding: 20px;
  height: 60vh;
  user-select: none;
  .divider-box {
    position: relative;
    border-top: 0.5px solid @editor-border2-color;
    background: @editor-bg-color;
    // margin-bottom: 20px;
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
      .form-line {
        display: flex;
        align-items: center;
        .title {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>