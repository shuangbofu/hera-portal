<template>
  <div class="container" v-if="treeData.length > 0">
    <a-tree
      :blockNode="true"
      show-icon
      :draggable="true"
      :tree-data="treeData"
      :selectedKeys.sync="treeCache.selectedKeys"
      :expandedKeys.sync="treeCache.expandedKeys"
      @expand="
        (keys, { expanded, node }) => $emit('expand', { keys, expanded, node })
      "
      @select="selectNode"
      @rightClick="rightClick"
      @dragend="dragNodeEnd"
      @dragenter="dragNodeEnter"
      @dragstart="dragNodeStart"
    >
      <template slot-scope="{ expanded, type, selected }" slot="dic">
        <a-icon
          :class="['tree-icon', type, selected ? 'selected' : '']"
          theme="filled"
          :type="expanded ? 'folder-open' : 'folder'"
        ></a-icon>
      </template>
      <template slot-scope="{ type, selected }" slot="job">
        <a-icon
          :class="['tree-icon', type, selected ? 'selected' : '']"
          theme="filled"
          type="file"
        ></a-icon>
      </template>
      <template slot="title" slot-scope="data">
        <span :class="{ title: true, selected: data.selected }">
          <span v-if="!data.dataRef.dic && depSetting.showId"
            >[{{ data.origin.id }}] </span
          >{{ data.title }}</span
        >
      </template>
    </a-tree>
    <right-menu ref="rightMenu" />
  </div>
</template>

<script>
import { moveNode } from "@/api/develop";
import RightMenu from "./rightMenu";
export default {
  props: {
    treeData: {
      type: Array,
      required: true,
      default: () => []
    },
    treeCache: {
      type: Object,
      default: () => {
        return { expandedKeys: [], selectedKeys: [] };
      }
    }
  },
  data() {
    return {
      dragNodeInfo: {
        from: null,
        to: null
      }
    };
  },
  components: { RightMenu },
  computed: {
    depSetting() {
      return this.$store.getters["develop/depSetting"];
    }
  },
  methods: {
    selectNode(_, { node }) {
      this.$emit("select", {
        key: node.dataRef.key,
        selected: node.selected,
        dic: node.dataRef.dic,
        id: node.dataRef.id
      });
    },
    rightClick({ node }) {
      const dataRef = node.dataRef;
      let menus = [];
      if (dataRef.dic) {
        if (dataRef.type === "small_dic") {
          menus.push("新建任务");
        } else {
          menus.push("新建文件夹");
        }
      } else {
        menus.push("复制");
      }
      this.$refs.rightMenu.show(
        menus.concat(["重命名", "移动", "删除"]),
        order => {
          this.$emit("menuClick", order, {
            ...dataRef.origin,
            key: dataRef.key
          });
        }
      );
    },
    dragNodeEnd() {
      const info = this.dragNodeInfo;
      if (info.from && info.to) {
        const id = info.from.dic ? `group_${info.from.id}` : info.from.id;
        const from = info.from.origin.parent;
        const to = `group_${info.to.id}`;
        if (from === to) {
          return;
        }
        moveNode(id, from, to).then(() => {
          this.$store.dispatch("develop/initJobs").then(() => {
            this.$message.success("移动成功！");
          });
        });
      }
    },
    dragNodeEnter({ node }) {
      if (node.dataRef.dic) {
        this.dragNodeInfo.to = node.dataRef;
      } else {
        this.dragNodeInfo.to = null;
      }
    },
    dragNodeStart({ node }) {
      this.dragNodeInfo.from = node.dataRef;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  // padding: 4px 2px;
  .tree-icon {
    font-size: 15px;
    margin-right: 4px;
    &.big_dic {
      color: @editor-tree-icon1-color;
    }
    &.small_dic {
      color: @editor-tree-icon2-color;
    }
    &.job {
      color: @editor-tree-icon1-color;
    }
    &.selected {
      &.big_dic {
        color: @editor-tree-icon3-color;
      }
      &.small_dic {
        color: @editor-tree-icon4-color;
      }
    }
  }
}
</style>

<style lang="less">
.ant-tree {
  li {
    padding: 0 !important;
  }
  .action {
    color: @editor-tree-icon1-color;
  }
  .title {
    font-size: 13px;
    padding: 0 6px;
    color: @editor-tree-title-color;
    &.selected {
      color: #ffffff !important;
    }
  }
  .tree-icon {
    font-size: 15px;
  }
}
.ant-tree-child-tree > li:first-child {
  padding-top: 2px;
}
.ant-tree-switcher-icon {
  color: @editor-tree-icon1-color;
}
.ant-tree li .ant-tree-node-content-wrapper {
  padding: 0;
  padding-left: 4px;
  border-radius: 0;
  &:hover {
    background: @editor-tree-hover-color!important;
  }
  &.ant-tree-node-selected {
    background: @editor-tree-active-color!important;
  }
}
.ant-tree #treeitem:hover {
  background: @editor-tree-hover-color!important;
}
</style>