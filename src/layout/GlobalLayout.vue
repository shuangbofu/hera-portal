<template>
  <a-layout>
    <global-header
      @toggleCollpased="() => (collapsed = !collapsed)"
      :collapsed="collapsed"
      v-if="!fullscreen"
    />
    <a-layout-content :class="{'main-content':true,'fullscreen': fullscreen}">
      <slot />
    </a-layout-content>
  </a-layout>
</template>

<script>
import GlobalHeader from "./GlobalHeader";
export default {
  data() {
    return {
      collapsed: false,
    };
  },
  created() {},
  components: {
    // GlobalSider,
    GlobalHeader,
  },
  computed: {
    fullscreen() {
      return this.$store.state.setting.fullscreen;
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  padding: 0 12px 0 0;
  -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: relative;
  height: 40px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  .trigger {
    font-size: 20px;
    line-height: 55px;
    padding: 0 16px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: #ff6347;
    }
  }
}
.sider {
  background: #fff;
  border-right: 1px solid #e6e6e6;
  -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.main-content {
  height: calc(100vh - 40px);
  background: #f6f6f6;
  // padding: 15px;
  // overflow: hidden;
  overflow: auto;
  &.fullscreen {
    height: 100%;
  }
}
</style>