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
    <create-job-dialog ref="createJobDialogRef" />
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
    menuClick(order, data) {
      if (order === "删除") {
        console.log("delete");
      } else {
        this.$refs.createJobDialogRef.show(
          { order, obj: data },
          (order, result) => {
            this.submit(order, data, result);
          }
        );
      }
    },
    submit(order, data, result) {
      console.log(order, data, result);
      if (order === "新建文件夹") {
        this.createGroup({ parentKey: data.key, requestData: result }).then(
          () => {
            this.$message.success("创建成功！");
          }
        );
      } else if (order === "新建任务") {
        this.createJob({ parentKey: data.key, requestData: result }).then(
          () => {
            this.$message.success("创建成功！");
          }
        );
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