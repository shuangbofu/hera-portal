<template>
  <div class="container">
    <div class="main">
      <MonacoEditor
        v-if="layoutConfig.editorBottom === 'text'"
        class="editor"
        v-model="job.script"
        :theme="editorTheme"
        :language="job.lang"
        :options="{
          fontSize: 13,
          automaticLayout: true,
        }"
      />
      <template v-else-if="layoutConfig.editorBottom === 'config'">
        <conf-editor :data="job" v-if="job.configs" />
      </template>
      <template v-else>
        <sql-preview
          :data="job"
          @preview="(v) => previewJobScript({ actionId: v, jobId: job.id })"
        />
      </template>
    </div>
    <div class="footer">
      <div class="tabs">
        <div
          @click="setEditorBottom(tab.name)"
          :class="[
            'tab',
            tab.name === layoutConfig.editorBottom ? 'active' : '',
          ]"
          v-for="tab in editorBottomTabs"
          :key="tab.name"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SqlPreview from "./sqlPreview";
import ConfEditor from "./confEditor";
import MonacoEditor from "monaco-editor-vue";
import commonMixin from "@/mixins/common";
export default {
  data() {
    return { test: "sdfsdfsf" };
  },
  components: {
    MonacoEditor,
    ConfEditor,
    SqlPreview
  },
  watch: {
    "job.script": function(newVal, oldVal) {
      if (newVal.id === oldVal.id && newVal !== oldVal) {
        this.setJobScriptEdited({ jobId: this.job.id, script: newVal });
      }
    },
    "job.selfConfigs": function(newVal, oldVal) {
      if (newVal !== oldVal) {
        // this.setJobEdited({jobId: this.})
      }
    }
  },
  mixins: [commonMixin],
  computed: {
    // lang() {
    //   const type = this.job.runType;
    //   if (["Spark", "Hive"].includes(type)) {
    //     return "sql";
    //   } else if (type === "Shell") {
    //     return "shell";
    //   } else if (type === "Python") {
    //     return "python";
    //   }
    //   return "shell";
    // },
    editorTheme() {
      return this.theme.mode === "light" ? "vs" : "vs-dark";
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  .main {
    position: relative;
    width: 100%;
    height: calc(100% - 30px);
  }
  .footer {
    position: absolute;
    top: calc(100% - 30px);
    width: 100%;
    height: 30px;
    background: @editor-bg-color;
    border-top: 1px solid @editor-border-color;
    .tabs {
      line-height: 25px;
      height: 29px;
      display: flex;
      margin-left: 10px;
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
}
</style>