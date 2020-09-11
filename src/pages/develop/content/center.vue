<template>
  <div class="container">
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
          {{node.title}}--{{node.key}}
          <a-icon
            theme="filled"
            class="close-icon"
            type="close-circle"
            @click="closeSelectedTab(node.key)"
          />
        </div>
      </template>
    </div>
    <job-editor
      :style="{
        height: `calc(100% - ${tabsHeight}px)`
      }"
      :theme="theme.mode === 'light' ? 'vs' : 'vs-dark'"
      :job="job"
      v-if="job"
    />
  </div>
</template>

<script>
import JobEditor from "../job/index";
import commonMixin from "@/mixins/common";
export default {
  data() {
    return {
      tabsHeight: 0,
    };
  },
  watch: {
    "tabs.length": {
      handler(old, newVal) {
        console.log(old, newVal);
      },
    },
  },
  mixins: [commonMixin],
  components: {
    JobEditor,
  },
  created() {
    this.$nextTick(() => {
      console.log(this.$refs.tabs.offsetHeight);
    });
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.tabsHeight = this.$refs.tabs.offsetHeight;
    });
  },
  computed: {},

  methods: {
    doubleClick() {
      console.log("click");
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
  overflow: auto;
  overflow-x: hidden;
  .tabs {
    width: calc(100% + 1px);
    margin-right: -1px;
    display: flex;
    // width: 100%;
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
        font-size: 12px;
        &:hover {
          color: @text-color;
        }
      }
    }
  }
}
</style>