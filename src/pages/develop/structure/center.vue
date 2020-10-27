<template>
  <div class="container">
    <div class="tabs-container left">
      <slot name="left-side" />
    </div>
    <div class="center">
      <split-pane
        :show="[true, bottomTab.width]"
        @resize="(v) => changeTabSize(100 - v, 'bottom')"
        mode="horizontal"
      >
        <template slot="left">
          <split-pane
            :show="[leftTab.width, true]"
            @resize="(v) => changeTabSize(v, 'left')"
          >
            <template slot="left">
              <slot name="left" />
            </template>
            <template slot="right">
              <split-pane
                :show="[true, rightTab.width]"
                @resize="(v) => changeTabSize(100 - v, 'right')"
              >
                <template slot="left">
                  <slot name="center" />
                </template>
                <template slot="right">
                  <slot name="right" />
                </template>
              </split-pane>
            </template>
          </split-pane>
        </template>
        <template slot="right">
          <slot name="bottom" />
        </template>
      </split-pane>
    </div>
    <div class="tabs-container right">
      <slot name="right-side" />
    </div>
  </div>
</template>

<script>
import SplitPane from "@/components/splitPane";
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
  data() {
    return {};
  },
  components: {
    SplitPane,
  },
  methods: {
    resize() {},
  },
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;
  .tabs-container {
    width: 25px;
    &.left {
      border-right: 1px solid @editor-border-color;
    }
    &.right {
      border-left: 1px solid @editor-border-color;
    }
  }
  .center {
    position: relative;
    width: calc(100% - 40px);
  }
}
</style>