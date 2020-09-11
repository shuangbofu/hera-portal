<template>
  <div class="container">
    <split-pane
      v-on:resize="resize"
      :min-percent="10"
      :default-percent="defaultPrecent"
      :split="mode"
      v-if="showAll"
      class="split-pane"
    >
      <template slot="paneL">
        <slot name="left" />
      </template>
      <template slot="paneR">
        <slot name="right" />
      </template>
    </split-pane>
    <div v-else-if="showLeft" class="container">
      <slot name="left" />
    </div>
    <div v-else class="container">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
var isBoolean = function (obj) {
  return (
    obj === true || obj === false || toString.call(obj) === "[object Boolean]"
  );
};
export default {
  props: {
    show: {
      default: () => [true, true],
      type: Array,
    },
    mode: {
      default: "vertical",
      type: String,
      required: false,
    },
  },
  computed: {
    showLeft() {
      return this.show[0];
    },
    showRight() {
      return this.show[1];
    },
    showAll() {
      return this.showLeft && this.showRight;
    },
    defaultPrecent() {
      if (isBoolean(this.show[0])) {
        return 100 - this.show[1];
      } else if (isBoolean(this.show[1])) {
        return this.show[0];
      } else {
        return 20;
      }
    },
  },
  methods: {
    resize(v) {
      this.$emit("resize", v);
    },
    test() {
      if (isBoolean(this.show[0])) {
        return 100 - this.show[1];
      } else if (isBoolean(this.show[1])) {
        return this.show[0];
      } else {
        return 20;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  display: block !important;
  height: 100%;
  width: 100%;
}
</style>
<style lang="less">
.splitter-pane {
  padding: 0 !important;
  background: @base-bg-color;
}
</style>