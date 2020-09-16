<template>
  <div class="container">
    <attached-header type="right">
      <div class="content">{{job}}</div>
    </attached-header>
  </div>
</template>

<script>
import AttachedHeader from "./attachedHeader";
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
  components: {
    AttachedHeader,
  },
};
</script>

<style lang="less" scoped>
.container {
  background: @base-bg-color;
  .content {
    padding: 10px;
    height: 100%;
    overflow: auto;
  }
}
</style>