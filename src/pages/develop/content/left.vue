<template>
  <div class="container">
    <attached-header type="left">
      <job-tree
        v-for="tab in ['allJob', 'myJob', 'debug']"
        :key="tab"
        class="tree"
        :tree-cache="treeCaches[tab]"
        :tree-data="jobTrees[tab]"
        v-show="leftTab.name === tab"
        @expand="setExpanedTreeNodes"
        @select="selectTreeNode"
        @menuClick="menuClick"
      />
    </attached-header>
    <create-job-dialog @submit="submit" ref="createJobDialogRef" />
  </div>
</template>

<script>
import CreateJobDialog from "../dialog/createJob";
import AttachedHeader from "./attachedHeader";
import JobTree from "../components/tree";
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
  components: {
    JobTree,
    AttachedHeader,
    CreateJobDialog,
  },
  methods: {
    menuClick(data) {
      const { order } = data;
      if (order === "删除") {
        console.log("delete");
      } else {
        this.$refs.createJobDialogRef.show(data);
      }
    },
    submit({ order, obj, result }) {
      console.log(order, obj, result);
      if (order === "新建文件夹") {
        console.log(obj);
        this.createGroup({ parentKey: obj.key, requestData: result });
      } else if (order === "新建任务") {
        this.createJob({ parentKey: obj.key, requestData: result });
      }
    },
  },
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