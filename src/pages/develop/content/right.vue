<template>
  <div class="container">
    <attached-header type="right">
      <div class="content" v-if="job">
        <job-info
          v-if="rightTab.name === 'job'"
          :data="job"
          :active="rightTab.name"
        />
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
};
</script>

<style lang="less" scoped>
.container {
  background: @base-bg-color;
  .content {
    padding: 10px;
    height: 100%;
    overflow: auto;
  }
}
</style>