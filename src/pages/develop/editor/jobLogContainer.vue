<template>
  <div class="log-container" v-show="!isSelectedGroup">
    <div class="button-list operation-bar">
      <template v-if="logRecord && logRecord.current">
        <my-icon
          @click="
            cancelJob({ jobId: logRecord.jobId, logItemId: currentLogItem.id })
          "
          type="hera_icon_stop"
          :class="[
            'icon',
            'stop',
            currentLogItem.status !== 'running' ? 'disabled' : '',
          ]"
        />
      </template>
    </div>
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
              <span style="font-weight: 600; margin-right: 10px">{{
                item.actionId.substring(0, item.actionId.length - 4)
              }}</span>
              {{ item.operator }}{{ item.triggerType }}
              <div :class="['status', item.status]">
                <my-icon
                  class="icon"
                  :type="`hera_icon_${
                    {
                      failed: 'error',
                      success: 'yes1',
                      running: 'loading',
                    }[item.status]
                  }`"
                />
                <span class="text">{{
                  {
                    failed: "ERROR",
                    success: "SUCCESS",
                    running: "RUNNING",
                  }[item.status]
                }}</span>
              </div>
            </div>
            <div
              class="see-more"
              @click="loadMoreLogs"
              v-if="
                !logRecord.loadedAll &&
                logRecord.list &&
                logRecord.list.length > 0
              "
            >
              查看更多
            </div>
            <div v-else class="loaded-all">全部加载完毕</div>
          </div>
        </div>
        <div slot="right" class="main">
          <div class="header log-header">
            <template v-if="currentLogItem.id">
              <div class="left">
                <div :class="['status', currentLogItem.status]">
                  <my-icon
                    class="icon"
                    :type="`hera_icon_${
                      {
                        failed: 'error',
                        success: 'yes1',
                        running: 'loading',
                      }[currentLogItem.status]
                    }`"
                  />
                  <span class="text">{{
                    {
                      failed: "运行失败",
                      success: "运行成功",
                      running: "运行中",
                    }[currentLogItem.status]
                  }}</span>
                </div>
                <div class="info">
                  <span style="font-size: 11px">
                    【{{ currentLogItem.triggerType }}】
                  </span>
                  {{ currentLogItem.startTime }} -
                  {{ currentLogItem.endTime }} -
                  {{ currentLogItem.durations }}

                  <span class="executeHost">
                    执行机器:
                    <span
                      class="text"
                      @click="copy(currentLogItem.executeHost)"
                      >{{ currentLogItem.executeHost }}</span
                    >
                  </span>
                </div>
              </div>
              <div class="right operation-bar">
                <my-icon
                  @click="visible = true"
                  type="hera_icon_fullscreen"
                  class="icon"
                />
              </div>
            </template>
          </div>
          <p
            class="content log-text"
            v-html="currentLogItem.log"
            ref="logTextRef"
          ></p>
        </div>
      </split-pane>
    </div>
    <a-modal
      wrapClassName="full-log-dialog"
      :visible="visible"
      @cancel="visible = false"
      width="80%"
      :closable="false"
      :mask="true"
      :destroyOnClose="true"
      :footer="null"
    >
      <div style="height: 80vh; position: relative; overflow: hidden">
        <p class="log-text" v-html="currentLogItem.log" ref="logTextRef"></p>
      </div>
    </a-modal>
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
      interval: null,
      visible: false,
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
    this.interval = setInterval(() => {
      const item = this.currentLogItem;
      const jobId = this.logRecord.jobId;
      if (item.endTime === "") {
        const offset = this.logRecord.list.findIndex((i) => i.id === item.id);
        console.log(offset);
        this.$store.dispatch("develop/getJobLogList", {
          pageSize: 1,
          offset,
          jobId,
        }).then(() => {
          // this.getLog(item,jobId)
          if (item.status === "running" && this.currentLogItem.startTime !== "") {
          console.log("fetch log");
          this.$store
            .dispatch("develop/getLogContent", {
              jobId,
              logItemId: item.id,
            })
            .then(() => {
              const ref = this.$refs.logTextRef;
              // 滚动到最底部
              if(ref) {
                ref.scrollTop = ref.scrollHeight;
              }
            });
        }
        });
      }
    }, 2000);
  },
  destroyed() {
    clearInterval(this.interval);
    this.interval = null;
  },
  methods: {
    resize(v) {
      this.setLogContainerWidth(v);
    },
    loadMoreLogs() {
      const jobId = this.logRecord.jobId;
      const offset = this.logRecord.offset + this.logRecord.pageSize;
      this.$store.dispatch("develop/getJobLogList", {
        pageSize: this.logRecord.pageSize,
        offset,
        jobId,
      });
    },
    // TODO 重复代码
    copy(copyText) {
      var textarea = document.createElement("textarea");
      textarea.textContent = copyText;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      if (success) {
        this.$message.success("复制成功！");
      }
      document.body.removeChild(textarea);
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
    padding-top: 5px;
    margin: 0 auto;
    .icon {
      width: 30px;
      width: 22px;
      margin: 0 4px;

      &.stop {
        color: @editor-red2-color;
      }
    }
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
        display: flex;
        align-items: center;
        &.log-header {
          justify-content: space-between;
          .left {
            display: flex;
            align-items: center;
          }
          .right {
            margin-right: 10px;
            .icon {
              // cursor: pointer;
            }
          }
        }
        .status {
          line-height: 30px;
          margin-right: 10px;
        }
        .info {
          font-size: 13px;
          color: @editor-icon2-color;
          .executeHost {
            font-weight: 500;
            font-size: 11px;
            margin-left: 10px;
            .text {
              padding: 2px 4px;
              &:hover {
                background: @editor-tree-hover-color;
              }
            }
          }
        }
      }
      .content {
        height: calc(100% - 30px);
        overflow: auto;

        &.log-text {
          font-size: 14px;
          padding: 20px 15px;
          user-select: text;
          background: @editor-bg3-color;
        }
        &.log-list {
          overflow: auto;
          position: relative;
          .log-item {
            position: relative;
            padding: 2px 10px;
            display: flex;
            align-items: center;
            cursor: default;
            font-size: 12px;
            white-space: nowrap;
            background: @base-bg-color;
            .status {
              background: inherit;
              position: absolute;
              // right: 30px;
              width: 90px;
              right: 0;
              // margin-right: 25px;
              padding-left: 10px;
            }
            &.active {
              background: @editor-tree-active-color;
              color: #ffffff;
            }
          }
          .see-more {
            cursor: pointer;
            &:hover {
              background: @editor-tree-hover-color;
            }
          }
          .loaded-all,
          .see-more {
            font-size: 12px;
            margin: 10px 0;
            text-align: center;
          }
        }
      }
      .status {
        display: flex;
        align-items: center;
        margin-left: 10px;
        justify-content: flex-start;
        width: 70px;
        .text {
          font-size: 12px;
          font-weight: 500;
        }
        .icon {
          font-weight: bold;
          font-size: 14px;
          margin-right: 4px;
        }
        &.failed {
          color: @editor-red2-color;
        }
        &.success {
          .icon {
            color: @editor-green2-color;
          }
        }
        &.running {
          .icon {
            color: @editor-yellow-color;
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
.error {
  color: @editor-red2-color;
}
.hera {
  // color: @editor-yellow2-color;
  color: #1890ff;
}
.console {
  color: @editor-green2-color;
}
.full-log-dialog {
  .ant-modal-body {
    padding: 5px;
  }
  .log-text {
    overflow: auto;
    height: 100%;
    background: @editor-bg3-color;
    padding: 20px 15px;
    user-select: text;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
      "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
}
</style>