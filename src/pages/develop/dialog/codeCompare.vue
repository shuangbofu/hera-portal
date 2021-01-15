<template>
  <div>
    <a-modal
      wrapClassName="dialog"
      :visible="visible"
      @cancel="close"
      width="80%"
      :closable="false"
      :mask="true"
      :destroyOnClose="true"
      :footer="null"
      v-if="now && origin"
    >
      <div style="height: 80vh; position: relative; overflow: hidden">
        <code-compare
          v-if="tabActive"
          style="height: calc(100% - 40px)"
          :origin="{
            description: origin.description,
            content: origin[tabActive],
          }"
          :now="{ description: now.description, content: now[tabActive] }"
          :lang="tabActive === 'script' ? lang : 'ini'"
          :theme="theme"
        />
        <div class="tabs">
          <div
            @click="changeTab(tab)"
            :class="['tab', tab.value === tabActive ? 'active' : '']"
            v-for="tab in tabs"
            :key="tab.value"
          >
            {{ tab.label }}
          </div>
        </div>
        <div style="height: 20px; float: right">
          <slot></slot>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import CodeCompare from "../../components/codeCompare";
const tabs = [
  { value: "script", label: "文本" },
  { value: "selfConfigs", label: "配置项" }
];

export default {
  data() {
    return {
      tabs,
      tabActive: "script",
      visible: false,
      now: null,
      origin: null
    };
  },
  components: {
    CodeCompare
  },
  computed: {
    theme() {
      return this.$store.state.setting.theme.mode === "light"
        ? "vs"
        : "vs-dark";
    }
  },
  methods: {
    show(lang, origin, now) {
      this.lang = lang;
      this.origin = origin;
      this.now = now;
      this.visible = true;
    },
    changeTab(tab) {
      this.tabActive = null;
      this.$nextTick(() => {
        this.tabActive = tab.value;
      });
    },
    close() {
      this.visible = false;
      this.now = null;
      this.origin = null;
    }
  }
};
</script>

<style lang="less">
.dialog {
  .ant-modal-body {
    padding: 0;
  }
  .tabs {
    position: absolute;
    bottom: 0;
    left: 0;
    line-height: 25px;
    height: 29px;
    display: flex;
    .tab {
      padding: 2px 12px;
      font-size: 12px;
      &:hover {
        background-color: @hover-bg-color;
      }
      &.active {
        border-bottom: 2px solid @primary-color!important;
      }
    }
  }
}
</style>