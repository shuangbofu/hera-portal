<template>
  <div class="select-container" id="test">
    <div class="select-show" v-on:click="showOptions">
      <div v-if="valueIsArray && multiple" class="option-list">
        <div
          class="option"
          v-for="(option, index) in selectedOptions"
          :key="index"
        >
          {{ option.label }}
          <a-icon
            @click.stop="chooseOption(option)"
            type="close"
            style="font-size: 10px"
          />
        </div>
        <a-input
          v-if="filterable"
          size="small"
          v-model="filterValue"
          @click="resetFilterValue"
        />
      </div>
      <div v-else style="display: flex; justify-content: space-between">
        <div class="option" style="margin-left: 4px; display: flex">
          <a-input
            :placeholder="
              selectedOptions.length > 0 ? selectedOptions[0].label : ''
            "
            v-if="filterable"
            size="small"
            v-model="filterValue"
            @click="resetFilterValue"
          />
          <template v-else>
            <div v-if="selectedOptions.length > 0">
              {{ selectedOptions[0].label }}
            </div>
          </template>
        </div>
        <a-icon
          class="caret"
          :type="'caret-' + (optionVisible ? 'up' : 'down')"
        />
      </div>
    </div>
    <div style="position: relative">
      <div :class="['select-options']" v-show="optionVisible">
        <div
          v-for="(option, index) in filterOptions"
          :key="index"
          :class="['option', isActive(option) ? 'active' : '']"
          @click="chooseOption(option)"
        >
          <div class="label">
            <div>{{ option.label }}</div>
            <div v-if="isActive(option) && multiple && valueIsArray">
              <a-icon type="check" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      optionVisible: false,
      filterValue: ""
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: [Boolean, Number, String, Array],
    options: Array,
    multiple: {
      require: false,
      type: Boolean
    },
    filterable: {
      require: false,
      type: Boolean,
      default: false
    }
  },
  computed: {
    selectedOptions() {
      const values = this.valueIsArray ? this.value : [this.value];
      return this.realOptions.filter(option => values.includes(option.value));
    },
    valueIsArray() {
      return Array.isArray(this.value);
    },
    realOptions() {
      return this.options.map(i => {
        return typeof i === "object" ? i : { value: i, label: i };
      });
    },
    filterOptions() {
      const value = this.filterValue;
      if (value.trim().length === 0) {
        return this.realOptions;
      }
      return this.realOptions.filter(
        i => i.label.includes(value) || i.value.toString().includes(value)
      );
    }
  },
  created() {
    window.addEventListener("click", this.clickOther);
  },
  destroyed() {
    window.removeEventListener("click", this.clickOther);
  },
  methods: {
    resetFilterValue() {
      if (this.selectedOptions.length > 0 && this.filterValue) {
        this.filterValue = "";
      }
    },
    isActive(option) {
      const value = this.value;
      if (this.valueIsArray) {
        return value.includes(option.value);
      } else {
        return value === option.value;
      }
    },
    showOptions() {
      this.optionVisible = !this.optionVisible;
    },
    chooseOption(option) {
      let res = option.value;
      if (this.multiple) {
        const arr = [...this.value];
        const index = arr.findIndex(i => i === option.value);
        if (index === -1) {
          arr.push(option.value);
        } else {
          arr.splice(index, 1);
        }
        res = arr;
      }
      this.$emit("change", res);
      if (!this.multiple) {
        this.optionVisible = false;
      }
      this.filterValue = "";
    },
    clickOther(e) {
      const ele = this.$el.querySelector(".select-options");
      const show = this.$el.querySelector(".select-show");
      // 显示点击
      if (show && (show === e.target || show.contains(e.target))) {
        return;
      }
      if (ele && !ele.contains(e.target)) {
        if (this.optionVisible) {
          this.optionVisible = false;
        }
      }
    }
  }
};
</script>

<style lang="less">
.select-container {
  position: relative;
  .select-show {
    padding: 0 2px;
    border: 1px solid @editor-border-color;
    background: @base-bg-color;
    cursor: initial;
    user-select: none;
    min-height: 24px;
    .option-list {
      min-height: 24px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      height: 100%;
      // line-height: 24px;
      .option {
        border: 1px solid @editor-border-color;
        height: 18px;
        font-size: 10px;
        line-height: 18px;
        margin-right: 2px;
        white-space: pre;
        margin: 1px 1px;
      }
    }
    .option,
    .caret {
      margin-top: 1px;
      line-height: 20px;
    }
    input {
      border: none;
      height: 18px;
      font-size: 10px;
      padding: 2px;
    }
  }
  .select-options {
    width: 100%;
    position: absolute;
    top: 0;
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
        background: @editor-tree-hover-color;
        color: #ffffff;
      }
      &:hover {
        color: #ffffff;
        background: @editor-tree-active-color;
      }
      .label {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>