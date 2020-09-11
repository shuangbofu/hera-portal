<template>
  <div class="container">
    <div class="operation-bar">
      <a-icon class="icon" type="save" />
      <a-icon class="icon" type="reload" />
    </div>
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
  .operation-bar {
    padding: 4px 10px;
    height: 30px;
    line-height: 30px;
    display: flex;
    border-bottom: 1px solid @editor-border-color;
    .icon {
      margin-right: 4px;
      font-weight: bold;
      padding: 4px;
      &:hover {
        background: @editor-button-hover-color;
      }
    }
  }
}
</style>