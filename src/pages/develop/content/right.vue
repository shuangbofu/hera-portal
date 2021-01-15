<template>
  <div class="container">
    <attached-header type="right" v-if="infoData">
      <template v-slot:header>
        <a-icon
          v-if="rightTab.name === 'job'"
          class="icon"
          type="setting"
          @click="openConfSetting"
        />
        <my-icon
          v-if="rightTab.name === 'dependency'"
          @click="openDependencyGraph"
          type="hera_icon_fullscreen"
          class="icon"
        />
      </template>
      <div class="content">
        <job-info
          v-if="rightTab.name === 'job'"
          :is-group="isSelectedGroup"
          :data="infoData"
          :active="rightTab.name"
        />
        <job-publish v-else-if="rightTab.name === 'publish'" :data="infoData" />
        <template v-else-if="rightTab.name === 'dependency'">
          <job-dependency :jobId="infoData.id" />
        </template>
      </div>
    </attached-header>
    <conf-setting ref="confSettingRef" />
    <job-dependency-dialog ref="jobDependencyDialogRef" />
  </div>
</template>

<script>
import JobInfo from "../job/jobInfo";
import AttachedHeader from "./attachedHeader";
import ConfSetting from "../dialog/ConfSetting";
import JobPublish from "../job/jobPublish";
import commonMixin from "@/mixins/common";
import JobDependency from "../job/dependencyGraph";
import JobDependencyDialog from "../dialog/dependencyGraph";
export default {
  mixins: [commonMixin],
  components: {
    AttachedHeader,
    JobInfo,
    ConfSetting,
    JobPublish,
    JobDependency,
    JobDependencyDialog
  },
  computed: {
    infoData() {
      return this.isSelectedGroup ? this.group : this.job;
    }
  },
  methods: {
    openConfSetting() {
      this.$refs.confSettingRef.show(
        { infoData: this.infoData, isGroup: this.isSelectedGroup },
        res => {
          Object.assign(this.infoData, res);
          this.$message.success("更新成功！");
        }
      );
    },
    openDependencyGraph() {
      this.$refs.jobDependencyDialogRef.show(this.job.id);
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  background: @base-bg-color;
  .content {
    height: 100%;
    overflow: auto;
  }
}
</style>