<template>
  <div class="container">
    <div class="tabs">
      <div
        v-for="t in tabs.bottom"
        :key="t.name"
        :class="{'tab':true,'active': tab.bottom.name === t.name}"
        @click="changeTab(t.name, 'bottom')"
      >
        <div class="label">
          {{t.label}}
          <my-icon class="icon" :type="`hera_icon_${t.icon}`" />
        </div>
      </div>
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
  .tabs {
    display: flex;
    height: 25px;
    flex-direction: row;
    background: @editor-bg-color;
    border-bottom: 1px solid @editor-border-color;

    .tab {
      color: @title-color;
      display: block;
      height: 100%;
      padding: 0 15px;
      cursor: default;

      .label {
        height: 25px;
        margin: auto 0;
        text-align: center;
        line-height: 25px;
        font-size: 12px;
        .icon {
          font-size: 13px;
          margin-left: 4px;
        }
      }

      &.active {
        background: @active-bg-color !important;
        font-weight: 500;
      }

      &:hover {
        background-color: @hover-bg-color;
      }
    }
  }
}
</style>