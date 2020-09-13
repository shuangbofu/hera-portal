<template>
  <div class="container">
    <attached-header type="left">
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
    </attached-header>
  </div>
</template>

<script>
import AttachedHeader from './attachedHeader'
import JobTree from "../components/tree";
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
  components: {
    JobTree,
    AttachedHeader
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  background: @base-bg-color;
  overflow: auto;
  .tree {
    // height: calc(100% - 30px);
    height: 100%;
  }
}
</style>