<template>
  <div class="container">
    <div class="group-container" v-if="isSelectedGroup">
      <conf-editor :data="group" v-if="group.configs" />
    </div>
    <div class="job-container" v-else>
      <div
        class="tabs"
        ref="tabs"
        v-if="selectedTabNodes && selectedTabNodes.length > 0"
      >
        <template v-for="(node, index) in selectedTabNodes">
          <div
            v-if="node"
            :class="{
              tab: true,
              active: selectedKey === node.key,
            }"
            :key="index"
            @click="click(node)"
            @dblclick="doubleClick"
            @contextmenu.prevent="rightClick(node)"
          >
            <div :class="['title']">
              <span :class="['icon', node.origin.runType]">{{
                getTypeLabel(node)
              }}</span>
              <div>
                <span v-show="depSetting.showId">[{{ node.origin.id }}] </span
                >{{ node.title }}
              </div>
              <a-badge
                color="#F5C66F"
                class="edited-badge"
                v-if="node.origin.edited"
              />
            </div>
            <a-icon
              class="close-icon"
              type="close"
              v-on:click.stop="closeTab(node.key)"
            />
          </div>
        </template>
      </div>
      <div v-else class="empty">没有打开任务</div>
      <div
        v-if="selectedTabNode"
        :style="{
          height: `calc(100% - ${tabsHeight}px)`,
        }"
      >
        <template v-if="job">
          <job-editor />
        </template>
        <div class="loading" v-else>正在数据加载，请稍等……</div>
      </div>
    </div>
    <right-menu ref="rightMenu" />
  </div>
</template>

<script>
import JobEditor from "../editor/index";
import ConfEditor from "../editor/confEditor";
import commonMixin from "@/mixins/common";
import RightMenu from "../components/rightMenu";
export default {
  data() {
    return {
      tabsHeight: 0,
    };
  },
  watch: {
    "selectedTabNodes.length": {
      handler(old, newVal) {
        if (newVal !== old) {
          this.updateTabsHeight();
        }
      },
    },
    "leftTab.width": {
      handler() {
        this.updateTabsHeight();
      },
    },
    "rightTab.width": {
      handler() {
        this.updateTabsHeight();
      },
    },
  },
  components: {
    ConfEditor,
    JobEditor,
    RightMenu,
  },
  mixins: [commonMixin],
  created() {
    setTimeout(() => {
      this.updateTabsHeight();
    }, 500);
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.updateTabsHeight();
    });
  },
  methods: {
    updateTabsHeight() {
      this.$nextTick(() => {
        const height = this.$refs.tabs?.offsetHeight;
        if (height) {
          this.tabsHeight = height;
        }
      });
    },
    getTypeLabel(node) {
      return node?.origin.runType?.substring(0, 1).toLowerCase() ?? "?";
    },
    click(node) {
      this.switchSelectedTab(node.key);
    },
    doubleClick() {
      this.toggleOnlyCenter();
    },
    rightClick(node) {
      const key = node.key;
      const tabKeys = this.selectedTabKeys;
      const menuFuns = {
        关闭: (key) => this.closeTab(key),
        关闭其他: (key) => this.closeOtherTabs(key),
        关闭右侧所有: (key) => this.closeAllRightTabs(key),
        全部关闭: () => this.closeAllTabs(),
      };
      const menus = Object.keys(menuFuns);
      if (tabKeys.findIndex((i) => i === key) + 1 === tabKeys.length) {
        menus.splice(2, 1);
      }
      if (tabKeys.length === 1) {
        menus.splice(1, 2);
      }
      this.$refs.rightMenu.show(menus, (order) => menuFuns[order](key));
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  word-break: break-all;
  background: @base-bg-color;
  overflow: hidden;
  .job-container {
    height: 100%;
    .tabs {
      width: calc(100% + 1px);
      margin-right: -1px;
      display: flex;
      flex-wrap: wrap;
      margin-right: 1px;
      .tab {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1 1 auto;
        font-size: 14px;
        height: 30px;
        width: auto;
        padding: 4px 0;
        background: @editor-bg-color;
        border: 1px solid @editor-border-color;
        border-top-width: 0 !important;
        border-left-width: 0 !important;
        .title {
          position: relative;
          padding: 0 20px;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          .icon {
            display: block;
            margin-right: 5px;
            font-size: 9px;
            font-weight: bold;
            border-radius: 50%;
            width: 15px;
            height: 15px;
            text-align: center;
            // color: #324853;
            color: @editor-icon2-color;
            background-color: @editor-gray-color;
            line-height: 17px;
            &.Spark {
              // color: #f50;
              line-height: 15px;
              color: #324853;
              background-color: @editor-origin-color;
            }
            &.Hive {
              // color: #87d068;
              line-height: 16px;
              color: #324853;
              background-color: @editor-green-color;
            }
            &.Shell {
              // color: #ffb800;
              line-height: 15px;
              color: #324853;
              background-color: @editor-yellow-color;
            }
          }
          .edited-badge {
            position: absolute;
            right: 0;
          }
        }
        &:hover {
          background-color: @hover-bg-color;
        }
        &.active {
          border-bottom: 2px solid @primary-color!important;
          background: @base-bg-color;
        }
        .close-icon {
          margin-right: 5px;
          color: @editor-icon-color;
          font-size: 10px;
          &:hover {
            // color: @text-color;
            // color: rgba(0, 0, 0, 0.05);
          }
        }
      }
    }
    .loading,
    .empty {
      position: absolute;
      top: 30%;
      text-align: center;
      width: 100%;
      font-size: 14px;
      font-weight: 500;
      color: @text-color-second;
    }
  }
  .group-container {
    height: 100%;
  }
}
</style>