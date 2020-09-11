<template>
  <div class="container">
    <div class="operation-bar">这里会是一些对任务树的操作按钮等</div>
    <job-tree
      class="tree"
      :tree-cache="treeCaches.debug"
      :tree-data="jobTrees.debug"
      v-show="leftTab.name === 'debug'"
      @expand="expanedTreeNode"
      @select="selectTreeNode"
    />
    <job-tree
      class="tree"
      :tree-cache="treeCaches.myJob"
      :tree-data="jobTrees.myJob"
      v-show="leftTab.name === 'myJob'"
      @expand="expanedTreeNode"
      @select="selectTreeNode"
    />
    <job-tree
      class="tree"
      :tree-cache="treeCaches.allJob"
      :tree-data="jobTrees.allJob"
      v-show="leftTab.name === 'allJob'"
      @expand="expanedTreeNode"
      @select="selectTreeNode"
    />
  </div>
</template>

<script>
import JobTree from "../components/tree";
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
  components: {
    JobTree,
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  background: @base-bg-color;
  overflow: auto;
  .operation-bar {
    white-space: nowrap;
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