<template>
  <div class="container">
    <div class="publish-list">
      <div
        v-for="(pub, index) in data.publishes"
        :key="index"
        class="publish-item"
      >
        {{ pub.description }}
        <!-- <div v-for="(remark, idx) in pub.remarks" :key="idx">
          {{remark.content}}, {{remark.time}},{{remark.username}},{{remark.finalState}}
        </div> -->
        <a-tag>{{ pub.username }}</a-tag>
        <a-badge
          :color="stateInfoMap[pub.state].color"
          :text="stateInfoMap[pub.state].text"
        />
        <div class="time">{{ parseTime(pub.gmtCreate) }}</div>
        <div>
          <a class="link" @click="codeCompare(pub)">代码对比</a>
        </div>
      </div>
    </div>
    <a-modal
      wrapClassName="dialog"
      :visible="visible"
      @cancel="
        visible = false;
        compareCodes = null;
      "
      width="80%"
      :closable="false"
      :mask="true"
      :destroyOnClose="true"
      :footer="null"
      v-if="compareCodes"
    >
      <div style="height: 80vh; position: relative; overflow: hidden">
        {{ compareCodes.origin[compareCodes.tab] }}
        <MonacoEditor
          v-model="compareCodes.now[compareCodes.tab]"
          :original="compareCodes.origin[compareCodes.tab]"
          theme="vs"
          :language="compareCodes.tab === 'script' ? data.lang : 'json'"
          :diff-editor="true"
          :options="{
            fontSize: 13,
            automaticLayout: true,
          }"
        />
        <div class="tabs">
          <div
            @click="compareCodes.tab = tab.value"
            :class="['tab', tab.value === compareCodes.tab ? 'active' : '']"
            v-for="tab in tabs"
            :key="tab.value"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { parseTime } from "@/utils/date";
import MonacoEditor from "monaco-editor-vue";
const tabs = [
  { value: "script", label: "文本" },
  { value: "configs", label: "配置项" }
];
const stateInfoMap = {
  padding: { color: "#ffb800", text: "待审批" },
  success: { color: "#87d068", text: "成功" },
  cancelled: { color: "#909399", text: "取消" },
  rejected: { color: "#f50", text: "拒绝" }
};
export default {
  props: ["data"],
  data() {
    return {
      tabs,
      stateInfoMap,
      visible: false,
      compareCodes: null
    };
  },
  components: {
    MonacoEditor
  },
  computed: {
    theme() {
      return this.$store.state.setting.theme.mode === "light"
        ? "vs"
        : "vs-dark";
    }
  },
  methods: {
    parseTime,
    codeCompare(pub) {
      const origin = { script: pub.script, configs: pub.configs };
      const now = { script: this.data.script, configs: this.data.configs };
      this.compareCodes = { origin, now, tab: "script" };
      this.visible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  .publish-list {
    .publish-item {
      padding: 10px;
      border-bottom: 1px solid @editor-border-color;
      .time {
        font-size: 10px;
      }
      .link {
        color: @primary-color;
        font-weight: 500;
        font-size: 11px;
      }
    }
  }
}
</style>
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