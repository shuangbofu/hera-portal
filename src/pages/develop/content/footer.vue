<template>
  <div class="container">
    <attached-header type="bottom">
      <job-log-container v-show="bottomTab.name === 'log'" />
    </attached-header>
  </div>
</template>

<script>
import commonMixin from "@/mixins/common";
import AttachedHeader from "./attachedHeader";
import JobLogContainer from "../editor/jobLogContainer";
export default {
  mixins: [commonMixin],
  components: {
    AttachedHeader,
    JobLogContainer,
  },
};
</script>

<style lang="less" scoped>
.container {
  background: @base-bg-color;
}
</style>