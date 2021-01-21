<template>
  <div class="container">
    <attached-header type="bottom">
      <job-log-container v-if="bottomTab.name === 'log'" />
      <job-op-record-container v-if="bottomTab.name === 'opLog'" />
    </attached-header>
  </div>
</template>

<script>
import commonMixin from "@/mixins/common";
import AttachedHeader from "./attachedHeader";
import JobLogContainer from "../editor/jobLogContainer";
import JobOpRecordContainer from "../editor/jobOpRecordContainer";
export default {
  mixins: [commonMixin],
  components: {
    AttachedHeader,
    JobLogContainer,
    JobOpRecordContainer
  }
};
</script>

<style lang="less" scoped>
.container {
  background: @base-bg-color;
}
</style>