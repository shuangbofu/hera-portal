<template>
  <div class="container">
    <attached-header type="left">
      <template v-slot:header>
        <span
          v-if="!filterVisible"
          style="margin-right: 5px; cursor: pointer"
          @click="search"
          >{{ filterValue }}</span
        >
        <a-icon class="icon" type="search" @click="search" />
        <div v-show="filterVisible" class="tree-filter operation-bar">
          <a-input
            size="small"
            style="margin: 0 5px"
            v-model="filterValue"
            ref="filterInput"
            placeholder="输入ID/名称过滤"
          ></a-input>
          <a-icon
            class="icon"
            type="close"
            style="margin-right: 5px"
            @click="filterVisible = false"
          />
        </div>
      </template>
      <job-tree
        v-for="tab in ['allJob', 'myJob', 'debug']"
        :key="tab"
        class="tree"
        :tree-cache="treeCaches[tab]"
        :tree-data="treeData(tab)"
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

function nodesAfterFilter(nodes, value, consumer) {
  let res = [];
  nodes.forEach((i) => {
    if (i.isLeaf) {
      if (!consumer) {
        consumer = (i, value) => {
          return i.title.includes(value);
        };
      }
      if (consumer(i, value)) {
        res.push(i);
      }
    } else {
      const line = {
        ...i,
        children: nodesAfterFilter(i.children, value, consumer),
      };
      if (line.children.length > 0 || consumer(i, value)) {
        res.push(line);
      }
    }
  });
  return res;
}

export default {
  mixins: [commonMixin],
  data() {
    return {
      filterVisible: false,
      filterValue: "",
    };
  },
  components: {
    JobTree,
    AttachedHeader,
    CreateJobDialog,
  },
  computed: {
    treeData() {
      return function (tab) {
        const treeData = this.jobTrees[tab];
        if (this.filterValue.trim() !== "") {
          const filterData = nodesAfterFilter(
            treeData,
            this.filterValue,
            (i, value) => {
              return (
                i.title.includes(value) || i.origin.id.toString() === value
              );
            }
          );
          return filterData;
        }
        return treeData;
      };
    },
  },
  methods: {
    search() {
      this.filterVisible = true;
      this.$nextTick(() => {
        this.$refs.filterInput.focus();
      });
    },
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
  .tree-filter {
    position: absolute;
    top: 29px;
    right: -1px;
    height: 35px;
    width: 200px;
    border-radius: 1px;
    border: 1px solid @editor-border-color;
    background: @editor-bg-color;
    z-index: 1000;
    display: flex;
    align-items: center;
  }
  .tree {
    // height: calc(100% - 30px);
    height: 100%;
  }
}
</style>