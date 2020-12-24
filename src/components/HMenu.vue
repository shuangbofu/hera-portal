<template>
  <div>
    <div class="tabs-container">
      <div v-for="tab in tabs" :key="tab.name" @click="change(tab)">
        <div
          :class="[
            'tab',
            tab.name === tabActive ? 'active' : '',
            !tab.children || tab.children.length === 0 ? 'child' : '',
            tab.disabled ? 'disabled' : '',
          ]"
          :style="{
            'padding-left': level * 10 + 10 + 'px',
          }"
        >
          <my-icon
            class="icon"
            :type="`hera_icon_${tab.icon || tab.name}`"
            style="margin-right: 6px"
          />
          <span>{{ tab.label }}</span>
        </div>
        <template v-if="tab.children && tab.children.length > 0">
          <h-menu
            v-model="value"
            :tabs="tab.children"
            @update="change"
            :level="level + 1"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: Array,
    level: {
      default: 0,
      type: Number,
      require: false
    },
    value: [Boolean, Number, String]
  },
  name: "HMenu",
  model: {
    prop: "value",
    event: "change"
  },
  computed: {
    tabActive() {
      return this.value;
    }
  },
  methods: {
    change(tab) {
      if (tab.disabled) {
        return;
      }
      if (!tab.children?.length > 0) {
        if (this.level > 0) {
          this.$emit("update", tab);
        } else {
          this.$emit("change", tab.name);
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.tabs-container {
  display: flex;
  flex-direction: column;
  background-color: @base-bg-color;
  overflow: hidden;
  .tab {
    padding: 2px 25px;
    line-height: 35px;
    font-size: 15px;
    user-select: none;
    white-space: nowrap;
    cursor: default;
    .icon {
      margin: 0 10px;
    }
    &.child {
      cursor: pointer;
      &:hover {
        background-color: @hover-bg-color;
        color: @text-color;
      }
      &.disabled {
        color: @editor-gray-color;
        cursor: default;
      }
    }
    &.active {
      &,
      &.icon {
        font-weight: 500;
        color: @primary-color;
      }
      border-right: 2px solid @primary-color!important;
    }
  }
}
</style>