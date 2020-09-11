<template>
  <div class="container">
    <div class="header">{{tabs.bottom.find(i=>i.name === bottomTab.name).label}}</div>
    {{bottomTab}},{{treeCaches}}
  </div>
</template>

<script>
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
};
</script>

<style lang="less" scoped>
.container {
  background: @base-bg-color;
  .header {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    background: @editor-bg-color;
    border-bottom: 1px solid @editor-border-color;
  }
}
</style>