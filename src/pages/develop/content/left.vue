<template>
  <div class="container">
    <attached-header type="left">
      <template v-slot:header>
        <span
          v-if="!filterObj.visible"
          style="margin-right: 5px; cursor: pointer"
          @click="search"
          >{{ filterObj.value }}</span
        >
        <a-icon class="icon" type="search" @click="search" />
        <div v-show="filterObj.visible" class="tree-filter operation-bar">
          <a-input
            size="small"
            style="margin: 0 5px"
            v-model="filterObj.text"
            @pressEnter="startFilter"
            ref="filterInput"
            placeholder="ID/名称回车过滤,多个空格分隔"
          ></a-input>
          <a-icon
            class="icon"
            type="close"
            style="margin-right: 5px"
            @click="filterObj.visible = false"
          />
        </div>
      </template>
      <job-tree
        v-for="tab in ['allJob', 'myJob', 'debug']"
        :key="tab"
        class="tree"
        :tree-cache="treeCache(tab)"
        :tree-data="treeData(tab)"
        v-show="leftTab.name === tab"
        @expand="obj => changeFilteredExpanedTreeNodes(tab, obj)"
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
      if (consumer(line, value) || line.children.length > 0) {
        res.push(line);
      }
    }
  });
  return res;
}
let filterCopy = {visible: false, value: '',text: '',excludeNodes:[]}
export default {
  mixins: [commonMixin],
  data() {
    return {
      filterObj: {visible: false, value: '',text: '',excludeNodes:[]}
    };
  },
  watch: {
    filterObj: {
      handler(newVal) {
        Object.assign(filterCopy, newVal)
      },
      deep: true
    }
  },
  components: {
    JobTree,
    AttachedHeader,
    CreateJobDialog,
  },
  created() {
    this.filterObj = {...filterCopy}
  },
  computed: {
    treeDataTuple() {
      return function (tab) {
        const treeData = this.jobTrees[tab];
        const expandedNodes = []
        const filterData = nodesAfterFilter(
          treeData,
          this.filterObj.value,
          (i, value) => {
            value = value.trim()

            // 值为空
            if(value === '') {
              return this.ignoreEmpty(i);
            }

            // 多个ID名称(空格分隔)
            const f = value => {
              let ret = i.title.includes(value) || i.origin.id.toString() === value
              if(i.children.filter(i=>i.searched).length > 0 || ret) {
                i.searched = true
                if(!i.isLeaf) {
                  expandedNodes.push(i)
                }
              }
              // 忽略空文件夹
              this.ignoreEmpty(i)
              return ret
            }

            if(value.includes(' ')) {
              const valueArr = value.split(' ')
              if(valueArr) {
                return valueArr.map(value => f(value)).filter(i=>i).length > 0
              }
            }
            // 名称/单个ID
            return f(value)
          }
        );
        return {filterData, expandedNodes}
      };
    },
    treeData() {
      return function (tab) {
        return this.treeDataTuple(tab).filterData
      }
    },
    treeCache() {
      return function(tab) {
        const treeCache = this.treeCaches[tab]
        // 过滤之后所有满足条件展开的(父)结点
        const expandedKeys = this.treeDataTuple(tab).expandedNodes.map(i=>i.key)
        // 过滤之后关闭过的结点
        const excludeExpandedKeys = this.filterObj.excludeNodes
        const filterExpanedKeys = expandedKeys.filter(i=>excludeExpandedKeys.length === 0 || !excludeExpandedKeys.includes(i))
        // 查询后展开的结点
        return expandedKeys.length>0 ? {...treeCache, expandedKeys: filterExpanedKeys} : treeCache
      }
    }
  },
  methods: {
    changeFilteredExpanedTreeNodes(tab, {expanded, node}) {
      // 过滤之前展开的结点
      const originKeys = [...this.treeCaches[tab].expandedKeys]
      // 记录滤之后结点的展开/闭合
      const excludes = this.filterObj.excludeNodes
      const expandedkey = node.dataRef.key
      if(!expanded) {
        excludes.push(expandedkey)
      } else {
        const index = excludes.findIndex(i=>expandedkey===i)
        if(index !== -1) {
          excludes.splice(index, 1)
        }
      }
      this.setExpanedTreeNodes(originKeys)
    },
    startFilter() {
      this.filterObj.value = this.filterObj.text
      this.filterObj.excludeNodes = []
    },
    ignoreEmpty(i) {
      return (this.depSetting.hideEmptyFolder && i.dic)
      ? i.children.filter(i=>!i.dic).length > 0  
      : true
    },
    search() {
      this.filterObj.visible = true;
      this.$nextTick(() => {
        this.$refs.filterInput.focus();
      });
    },
    menuClick(order, data) {
      if (order === "删除") {
        this.$store.dispatch('develop/deleteJobOrGroup', data).then(() => {
          this.$message.success('删除成功! ')
        })
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
      console.log(order)
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
      } else if(order === '复制') {
        this.copyJob({parentKey:data.parent, jobId: data.id, name: result.name}).then(() => {
          this.$message.success('复制成功! ')
        })
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
    width: 220px;
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