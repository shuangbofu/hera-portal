<template>
  <div class="container">
    <div class="header">
      <div style="font-weight: 500;">预览任务版本</div>
      <h-select
        style="width: 200px; margin: 2px 5px;"
        v-model="data.previewActionId"
        :options="data.versions"
        @change="submit"
      />
    </div>
    <div class="sql-container">
      <MonacoEditor
        class="editor"
        v-model="previewScript"
        :theme="theme"
        :language="data.lang"
        :options="{
          fontSize: 13,
          readOnly: true,
          automaticLayout: true,
        }"
      />
      <div class="mask" v-if="notPreview">
        选择后显示
      </div>
    </div>
  </div>
</template>

<script>
import HSelect from '../components/HSelect'
import MonacoEditor from "monaco-editor-vue";
export default {
  props: ['data'],
  computed: {
    previewScript: {
      get() {
        return this.data.previewScript || this.data.script
      },
      set() {
        
      }
    },
    notPreview() {
      return !this.data.previewScript
    },
    theme() {
      return this.$store.state.setting.theme.mode === "light"
        ? "vs"
        : "vs-dark";
    },
  },
  methods: {
    submit(value) {
      this.$emit('preview',value)
    }
  },
  components: {
    MonacoEditor,
    HSelect
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  .header {
    background: @editor-bg-color;
    height: 30px;
    border-bottom: 1px solid @editor-border-color;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-size: 10px;;
  }
  .sql-container {
    height: calc(100% - 30px)
  }
  .mask {
    position: absolute;
    top: 30px;
    width: 100%;
    height: 100%;
    background: @editor-border-color;
    opacity:0.4;
    text-align: center;
  }
}

</style>