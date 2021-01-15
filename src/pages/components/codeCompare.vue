<template>
  <div>
    <div class="description-list">
      <span class="description">
        {{ origin.description }}
      </span>
      <span class="description">
        {{ now.description }}
      </span>
    </div>
    <MonacoEditor
      style="height: calc(100% - 20px)"
      v-model="now.content"
      :original="origin.content"
      :theme="theme"
      :language="lang"
      :diff-editor="true"
      :options="{
        fontSize: 13,
        automaticLayout: true,
        readOnly: true,
      }"
    />
  </div>
</template>

<script>
import MonacoEditor from "monaco-editor-vue";
export default {
  props: ["origin", "now", "lang", "theme"],
  components: { MonacoEditor }
};
</script>

<style lang="less">
.description-list {
  background: @editor-bg-color;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-bottom: 1px solid @editor-border-color;
  .description {
    flex: 1 0 0;
  }
}
</style>