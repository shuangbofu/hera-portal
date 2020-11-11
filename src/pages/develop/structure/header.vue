<template>
  <div class="container">
    <div class="operation-bar">
      <template v-for="(button, index) in buttons">
        <a-tooltip :key="index" :mouseEnterDelay="0.6">
          <template slot="title">{{ button.tip }}</template>
          <my-icon
            @click="buttonClick(button.icon)"
            :class="[
              'icon',
              button.icon,
              !job && button.disabled ? 'disabled' : '',
            ]"
            :type="`hera_icon_${button.icon}`"
          />
        </a-tooltip>
        <a-divider type="vertical" v-if="button.divider" :key="`d_${index}`" />
      </template>
      <my-icon
        @click="full"
        class="icon"
        :type="`hera_icon_fullscreen${fullscreen ? '-exit' : ''}`"
      />
      <my-icon
        :class="['icon', [theme.mode]]"
        :type="`hera_icon_${{ light: 'moon', night: 'sun' }[theme.mode]}`"
        @click="
          $store.commit('setting/setTheme', {
            ...theme,
            mode: { light: 'night', night: 'light' }[theme.mode],
          })
        "
      />
    </div>
    <div class="crumbs">hera分布式调度 > test > echoTest</div>
    <run-option-dialog ref="runOptionRef" />
  </div>
</template>

<script>
import screenfull from "screenfull";
import RunOptionDialog from "../dialog/runOption";
const buttons = [
  { icon: "setting", tip: "设置" },
  { icon: "clean", tip: "清理浏览器缓存", divider: true },
  { icon: "search", tip: "查找任务" },
  { icon: "refresh", divider: true, tip: "刷新" },
  { icon: "save", disabled: true, tip: "保存" },
  { icon: "play", disabled: true, divider: true, tip: "运行" },
  // { icon: "config", disabled: true, tip: "配置" },
  // { icon: "yes", disabled: true, tip: "开启任务", divider: true },
  { icon: "compare", disabled: true, tip: "比较代码" },
  { icon: "history", disabled: true, tip: "历史代码" },
  { icon: "rollback", disabled: true, tip: "回滚", divider: true },
];
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
  data() {
    return { buttons };
  },
  components: { RunOptionDialog },
  methods: {
    full() {
      screenfull.toggle();
      this.$store.commit("setting/toggleFullScreen");
    },
    buttonClick(name) {
      console.log(name);
      if (name === "refresh") {
        this.$store.dispatch("develop/initJobs").then(() => {
          this.$message.success("刷新成功！");
        });
      } else if (name === "play") {
        const jobId = this.job.id;
        this.$store.dispatch("develop/getJobVersions", { jobId }).then(() => {
          this.$refs.runOptionRef.show(this.job.versions, (data) => {
            this.$store.dispatch("develop/runJob", { ...data, jobId });
          });
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  .operation-bar {
    padding: 4px 0;
    height: 30px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid @editor-border-color;
    .icon {
      border-radius: 2px;
      font-size: 17px;
      margin-left: 4px;
      font-weight: bold;
      padding: 2px 4px;
      color: @editor-icon2-color;
      &:last-child {
        margin-right: 3px;
      }
      &.play {
        color: @editor-green2-color;
      }
      &.compare,
      &.yes {
        color: @editor-blue-color;
      }
      &.refresh,
      &.compare,
      &.history {
        font-size: 18px;
      }
      &.play {
        font-size: 19px;
      }
      &.disabled {
        color: @editor-gray-color;
      }
      &.night {
        color: rgb(250, 219, 20);
      }
    }
    .ant-divider {
      height: 18px;
      background-color: @editor-icon-color;
      margin-left: 4px;
      margin-right: 0;
    }
  }
  .crumbs {
    height: 25px;
    font-size: 10px;
    font-weight: bold;
    line-height: 25px;
    margin-left: 10px;
  }
}
</style>
<style lang="less">
.ant-tooltip {
  top: 75px !important;
  .ant-tooltip-arrow {
    display: none;
  }
  .ant-tooltip-inner {
    border-radius: 0;
    font-size: 12px !important;
    min-height: auto;
    // min-height: 30px;
    padding: 3px 8px;
    background: @editor-bg2-color;
    border: 1px solid @editor-border-color;
    box-shadow: none;
    color: @editor-icon2-color;
  }
}
</style>