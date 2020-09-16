<template>
  <div class="container" v-if="treeData.length > 0">
    <a-tree
      show-icon
      :tree-data="treeData"
      :selectedKeys.sync="treeCache.selectedKeys"
      :expandedKeys.sync="treeCache.expandedKeys"
      @expand="keys => $emit('expand',keys)"
      @select="selectNode"
    >
      <template slot-scope="{expanded,type,selected}" slot="dic">
        <a-icon
          :class="['tree-icon',type, selected ? 'selected':'']"
          theme="filled"
          :type="expanded ? 'folder-open': 'folder'"
        ></a-icon>
      </template>
      <template slot-scope="{type,selected}" slot="job">
        <a-icon :class="['tree-icon',type, selected ? 'selected':'']" theme="filled" type="file"></a-icon>
      </template>
      <template slot="title" slot-scope="data">
        <span :class="{'title':true, selected: data.selected}">{{data.title}}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>
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
  methods: {
    selectNode(_, { node }) {
      this.$emit("select", {
        key: node.dataRef.key,
        selected: node.selected,
        dic: node.dic,
        id: node.dataRef.id,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 4px 2px;
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
    padding: 1px 0 !important;
  }
  .action {
    color: @editor-tree-icon1-color;
  }
  .title {
    font-size: 14px;
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
.ant-tree li span.ant-tree-switcher,
.ant-tree li span.ant-tree-iconEle {
  width: 20px;
  height: 20px !important;
}

.ant-tree-child-tree > li:first-child {
  padding-top: 2px;
}
.ant-tree-switcher-icon {
  color: @editor-tree-icon1-color;
}
// .ant-tree li .ant-tree-node-content-wrapper:hover {
//   background: inherit;
// }
.ant-tree li .ant-tree-node-content-wrapper {
  padding: 0;
  padding-left: 6px;
  &:hover {
    // background: inherit;
    background: @editor-tree-hover-color!important;
  }
  &.ant-tree-node-selected {
    background: @editor-tree-active-color!important;
  }
}
</style>