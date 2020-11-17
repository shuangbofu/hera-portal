<template>
  <div class="select-container" id="test">
    <div class="show" v-on:click.stop="showOptions">
      <span style="margin-left: 4px">{{ selectedLabel }}</span>
      <a-icon :type="'caret-' + (optionVisible ? 'up' : 'down')" />
    </div>
    <div class="select-options" v-if="optionVisible">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="option"
        @click="chooseOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      optionVisible: false,
    };
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: [Boolean, Number, String, Array],
    options: Array,
  },
  computed: {
    selectedLabel() {
      const obj = this.options.find((i) => i.value === this.value);
      return obj?.label || this.value;
    },
  },
  created() {
    window.addEventListener("click", this.clickOther);
  },
  destroyed() {
    window.removeEventListener("click", this.clickOther);
  },
  methods: {
    showOptions() {
      this.optionVisible = !this.optionVisible;
    },
    chooseOption(option) {
      this.$emit("change", option.value);
      this.optionVisible = false;
    },
    selectBlur() {},
    clickOther(e) {
      const ele = this.$el.querySelector(".select-options");
      if (ele && !ele.contains(e.target)) {
        if (this.optionVisible) {
          this.optionVisible = false;
        }
      }
    },
  },
};
</script>

<style lang="less">
.select-container {
  position: relative;
  .show {
    padding: 2px;
    border: 1px solid @editor-border-color;
    background: @base-bg-color;
    cursor: initial;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .select-options {
    width: 100%;
    position: absolute;
    top: 22px;
    border: 1px solid @editor-border-color;
    z-index: 1000;
    background: @base-bg-color;
    max-height: 200px;
    overflow: auto;
    .option {
      padding: 2px 6px;
      cursor: initial;
      user-select: none;
      &:last-child {
        border-bottom-width: 0;
      }
      &.active {
        background: @editor-tree-active-color;
        color: #ffffff;
      }
      &:hover {
        color: #ffffff;
        background: @editor-tree-active-color;
      }
    }
  }
}
</style>