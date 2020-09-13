<template>
  <div class="container">
    <attached-header type="bottom">{{bottomTab}},{{treeCaches}}</attached-header>
  </div>
</template>

<script>
import commonMixin from "@/mixins/common";
import AttachedHeader from './attachedHeader'
export default {
  mixins: [commonMixin],
    components: {
    AttachedHeader
  }
};
</script>

<style lang="less" scoped>
.container {
  background: @base-bg-color;
}
</style>