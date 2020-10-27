<template>
  <div class="container">
    <attached-header type="right" v-if="infoData">
      <div class="content">
        <job-info
          v-if="rightTab.name === 'job'"
          :is-group="isGroup"
          :data="infoData"
          :active="rightTab.name"
        />
        <template v-else-if="rightTab.name === 'dependency'"> </template>
      </div>
    </attached-header>
  </div>
</template>

<script>
import JobInfo from "../job/jobInfo";
import AttachedHeader from "./attachedHeader";
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
  components: {
    AttachedHeader,
    JobInfo,
  },
  computed: {
    isGroup() {
      return this.group;
    },
    infoData() {
      // 空位合并操作符
      return this.isGroup ?? this.job;
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