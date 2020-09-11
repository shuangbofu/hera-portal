<template>
  <div class="container">
    <div class="operation-bar">这里会是一些对树的操作按钮等</div>
    <job-tree class="tree" />
  </div>
</template>

<script>
import JobTree from "./tree";
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
  components: {
    JobTree,
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  background: @base-bg-color;
  overflow: auto;
  .operation-bar {
    height: 30px;
    background: @editor-bg-color;
    border-bottom: 1px solid @editor-border-color;
    padding: 5px;
  }
  .tree {
    height: calc(100% - 30px);
  }
}
</style>