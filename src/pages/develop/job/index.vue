<template>
  <div class="container">
    <div class="text">
      <MonacoEditor
        class="editor"
        v-model="job.script"
        :theme="theme"
        language="sql"
        :options="{
        readOnly: true,
        fontSize: 13
      }"
      />
    </div>
  </div>
</template>

<script>
import MonacoEditor from "monaco-editor-vue";
export default {
  props: {
    job: {
      type: Object,
    },
    theme: {
      type: String,
      default: "vs",
    },
  },
  components: {
    MonacoEditor,
  },
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  width: 100%;
  .text {
    position: relative;
    height: 100%;
  }
}
</style>