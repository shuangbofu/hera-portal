<template>
  <div :class="['container', mode]">
    <div
      v-for="t in tabs"
      :key="t.name"
      :class="{'tab':true,'active': active === t.name}"
      @click="change(t)"
    >
      <div class="label">
        <my-icon class="icon" :type="`hera_icon_${t.icon}`" />
        {{t.label}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      required: true,
      type: String,
      default: "",
    },
    tabs: {
      type: Array,
      requried: true,
    },
    mode: {
      type: String,
      default: "vertical",
    },
  },
  methods: {
    change(t) {
      this.$emit("change", t);
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  background: @editor-bg-color;
  height: inherit;
  width: inherit;
  &.horizontal {
    // height: 25px;
    flex-direction: row;
    border-bottom: 1px solid @editor-border-color;
    .tab {
      width: inherit;
      height: 100%;
      padding: 0 12px;
      .label {
        width: 100%;
        height: 25px;
        margin: auto 0;
        line-height: 25px;
        .icon {
          font-size: 13px;
          margin-right: 5px;
        }
      }
    }
  }
  .tab {
    color: @title-color;
    display: block;
    width: 100%;
    padding: 12px 0;
    cursor: default;

    .label {
      // width: 20px;
      margin: 0 auto;
      text-align: center;
      line-height: 15px;
      font-size: 12px;

      .icon {
        font-size: 13px;
        margin-bottom: 5px;
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
</style>