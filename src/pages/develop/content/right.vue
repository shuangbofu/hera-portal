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
      </template>
      <div class="content">
        <job-info
          v-if="rightTab.name === 'job'"
          :is-group="isSelectedGroup"
          :data="infoData"
          :active="rightTab.name"
        />
        <template v-else-if="rightTab.name === 'dependency'"> </template>
        <job-publish v-else-if="rightTab.name === 'publish'" :data="infoData" />
      </div>
    </attached-header>
    <conf-setting ref="confSettingRef" />
  </div>
</template>

<script>
import JobInfo from "../job/jobInfo";
import AttachedHeader from "./attachedHeader";
import ConfSetting from "../dialog/ConfSetting";
import JobPublish from '../job/jobPublish'
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
  components: {
    AttachedHeader,
    JobInfo,
    ConfSetting,
    JobPublish
  },
  computed: {
    infoData() {
      return this.isSelectedGroup ? this.group : this.job;
    },
  },
  methods: {
    openConfSetting() {
      this.$refs.confSettingRef.show(
        { infoData: this.infoData, isGroup: this.isSelectedGroup },
        (res) => {
          Object.assign(this.infoData, res);
          this.$message.success("更新成功！");
        }
      );
    },
  },
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