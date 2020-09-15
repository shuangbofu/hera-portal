<template>
  <div class="container">
    <div class="operation-bar">
      <my-icon
        :class="['icon', button.icon, !job && button.disabled ? 'disabled' : '']"
        v-for="button in buttons"
        :key="button.icon"
        :type="`hera_icon_${button.icon}`"
      />
    </div>
  </div>
</template>

<script>
const buttons = [
  {
    icon: "save",
    disabled: true,
  },
  {
    icon: "refresh",
  },
  {
    icon: "play",
    disabled: true,
  },
  {
    icon: "compare",
  },
  { icon: "history" },
  { icon: "rollback" },
];
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
  data() {
    return { buttons };
  },
};
</script>

<style lang="less" scoped>
.container {
  .operation-bar {
    padding: 4px 0;
    height: 30px;
    display: flex;
    box-sizing: border-box;
    border-bottom: 1px solid @editor-border-color;
    .icon {
      border-radius: 2px;
      line-height: 28px;
      font-size: 19px;
      margin-left: 4px;
      font-weight: bold;
      padding: 0 2px;
      color: @editor-icon2-color;
      &:last-child {
        margin-right: 3px;
      }
      &.play {
        color: @editor-green2-color;
      }
      &.disabled {
        color: @editor-gray-color;
      }
      &.compare {
        color: @editor-blue-color;
      }
      &.history,
      &.rollback,
      &.save {
        font-size: 18px;
      }
    }
  }
}
</style>