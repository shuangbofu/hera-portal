<template>
  <div class="log-container" v-show="!isSelectedGroup">
    <div class="button-list"></div>
    <div class="log-main" v-if="logRecord">
      <split-pane :show="[width, true]" @resize="resize">
        <div slot="left" class="main">
          <div class="header"></div>
          <div class="content log-list">
            <div
              @click="logRecord.current = item.id"
              :class="[
                'log-item',
                realCurrentLogItemId === item.id ? 'active' : '',
              ]"
              v-for="(item, index) in logRecord.list"
              :key="index"
            >
              {{ item.id }}
            </div>
          </div>
        </div>
        <div slot="right" class="main">
          <div class="header"></div>
          <p class="content text" v-html="currentLogItem.log"></p>
        </div>
      </split-pane>
    </div>
  </div>
</template>

<script>
import SplitPane from "@/components/splitPane";
import commonMixin from "@/mixins/common";
export default {
  data() {
    return {
      logs: [],
      currentLogItemId: null,
    };
  },
  components: {
    SplitPane,
  },
  mixins: [commonMixin],
  watch: {
    realCurrentLogItemId(newVal) {
      if (newVal) {
        this.getLogContent({ logItemId: newVal, jobId: this.logRecord?.jobId });
      }
    },
  },
  computed: {
    width() {
      return this.layoutConfig.logContainerWidth;
    },
    realCurrentLogItemId() {
      return this.currentLogItemId || this.logRecord?.current;
    },
    currentLogItem() {
      return (
        this.logRecord?.list?.find((i) => i.id === this.realCurrentLogItemId) ||
        {}
      );
    },
  },
  created() {
    console.log("create log container");
  },
  methods: {
    resize(v) {
      this.setLogContainerWidth(v);
    },
  },
};
</script>

<style lang="less" scoped>
.log-container {
  height: 100%;
  width: 100%;
  display: flex;
  .button-list {
    width: 30px;
    height: 100%;
    border-right: 1px solid @editor-border-color;
    background: @editor-bg-color;
  }
  .log-main {
    width: calc(100% - 30px);
    height: 100%;
    .main {
      height: 100%;
      overflow: hidden;
      .header {
        height: 30px;
        border-bottom: 1px solid @editor-border-color;
        background: @editor-bg-color;
      }
      .content {
        height: calc(100% - 30px);
        overflow: auto;
        &.text {
          font-size: 13px;
          padding: 20px 15px;
        }
        &.log-list {
          .log-item {
            padding: 2px 10px;
            display: flex;
            align-items: center;
            cursor: default;
            font-size: 12px;
            &.active {
              background: @editor-tree-active-color;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
}
</style>