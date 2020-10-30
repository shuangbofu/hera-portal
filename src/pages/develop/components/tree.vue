<template>
  <div class="container" v-if="treeData.length > 0">
    <a-tree
      :blockNode="true"
      show-icon
      :tree-data="treeData"
      :selectedKeys.sync="treeCache.selectedKeys"
      :expandedKeys.sync="treeCache.expandedKeys"
      @expand="(keys) => $emit('expand', keys)"
      @select="selectNode"
      @rightClick="rightClick"
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
        <span :class="{ title: true, selected: data.selected }">{{
          data.title
        }}</span>
      </template>
    </a-tree>
    <right-menu @click="menuClick" ref="rightMenu" />
  </div>
</template>

<script>
import RightMenu from "./rightMenu";
export default {
  props: {
    treeData: {
      type: Array,
      required: true,
      default: () => [],
    },
    treeCache: {
      type: Object,
      default: () => {
        return { expandedKeys: [], selectedKeys: [] };
      },
    },
  },
  data() {
    return {};
  },
  components: { RightMenu },
  methods: {
    selectNode(_, { node }) {
      this.$emit("select", {
        key: node.dataRef.key,
        selected: node.selected,
        dic: node.dataRef.dic,
        id: node.dataRef.id,
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
      }
      this.$refs.rightMenu.show(menus.concat(["重命名", "移动", "删除"]), {
        ...dataRef.origin,
        key: dataRef.key,
      });
    },
    menuClick(data) {
      this.$emit("menuClick", data);
    },
  },
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