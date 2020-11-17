<template>
  <div class="container">
    <div class="header">
      {{ title }}
      <div class="operation-bar">
        <slot name="header" />
        <a-icon class="icon" type="minus" @click="close" />
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
import commonMixin from "@/mixins/common";
export default {
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  mixins: [commonMixin],
  computed: {
    title() {
      return this.tabs[this.type].find((i) => i.name === this.name).label;
    },
    name() {
      return this.tabActive(this.type).name;
    },
  },
  methods: {
    close() {
      this.changeTab(this.name, this.type);
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  background: @base-bg-color;
  height: 100%;
  .header {
    height: 30px;
    line-height: 30px;
    padding: 0 6px 0 10px;
    background: @editor-bg-color;
    border-bottom: 1px solid @editor-border-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }
  .content {
    height: calc(100% - 30px);
  }
}
</style>