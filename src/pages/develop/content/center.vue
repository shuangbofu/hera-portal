<template>
  <div class="container" v-if="job">
    <div class="tabs" ref="tabs">
      <template v-for="(node, index) in selectedJobNodes">
        <div
          v-if="node"
          :class="{
          'tab':true,
          'active':selectedJobnodeKey === node.key
        }"
          :key="index"
          @click="changeSelectedTab(node)"
          @dblclick="doubleClick"
        >
          {{node.title}}
          <a-icon
            theme="filled"
            class="close-icon"
            type="close-circle"
            v-on:click.stop="closeSelectedTab(node.key)"
          />
        </div>
      </template>
    </div>
    <div :style="{
        height: `calc(100% - ${tabsHeight}px)`,
    }">
      <slot />
    </div>
  </div>
</template>

<script>
import commonMixin from "@/mixins/common";
export default {
  data() {
    return {
      tabsHeight: 0,
    };
  },
  watch: {
    "selectedJobNodes.length": {
      handler(old, newVal) {
        if(newVal !== old) {
          this.updateTabsHeight()
        }
      },
    },
    'leftTab.width': {
      handler() {
        this.updateTabsHeight()
      }
    },
    'rightTab.width': {
      handler() {
        this.updateTabsHeight()
      }
    }
  },
  mixins: [commonMixin],
  created() {
    setTimeout(() => {
      this.updateTabsHeight()
    }, 500);
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.updateTabsHeight()
    });
  },
  computed: {
  },
  methods: {
    updateTabsHeight() {
      this.$nextTick(() => {
        const height =  this.$refs.tabs?.offsetHeight;
        if(height) {
          this.tabsHeight = height 
          console.log(height)
        }
      })
    },
    doubleClick() {
      this.toggleOnlyCenter();
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
      flex: 4 0.2 auto;
      padding: 4px 10px;
      font-size: 14px;
      height: 30px;
      box-sizing: border-box;
      background: @editor-bg-color;
      border: 1px solid @editor-border-color;
      border-top-width: 0 !important;
      border-left-width: 0 !important;
      &:hover {
        background-color: @hover-bg-color;
      }
      &.active {
        border-bottom: 2px solid @primary-color!important;
        background: @base-bg-color;
      }
      .close-icon {
        color: @text-color-second;
        font-size: 11px;
        &:hover {
          color: @text-color;
        }
      }
    }
  }
}
</style>