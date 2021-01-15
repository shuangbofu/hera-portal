<template>
  <div class="container">
    <template v-if="jobOpRecord">
      <div class="record-list">
        <div
          v-for="(record, index) in jobOpRecord.list"
          :key="index"
          class="record-item"
        >
          <span style="margin-right: 30px">{{ record.createTime }}</span>
          <span
            style="font-weight: 600; min-width: 170px; display: inline-block"
            >{{ `${record.sso}(${record.gname})` }}</span
          >
          <a @click="getRecordDetail(record)" v-if="isLink(record.type)"
            >{{ record.type }}
            <a-icon
              v-if="!(record.type === '更新脚本内容')"
              :type="record.changeObj && record.visible ? 'down' : 'up'"
            />
          </a>
          <span v-else> {{ record.type }}</span>

          <template v-if="record.changeObj">
            <div
              v-if="!(record.type === '更新脚本内容')"
              class="change-content"
              v-show="record.visible"
            >
              {{ record.changeObj.oldVal }}
              <span style="margin: 0 10px"
                ><a-icon type="right" v-for="i in [1, 2, 3, 4]" :key="i"
              /></span>
              {{ record.changeObj.newVal }}
            </div>
          </template>
        </div>
      </div>
      <a @click="more" v-if="!jobOpRecord.loadedAll">查看更多</a>
      <div v-else>全部加载完毕</div>

      <a-modal
        wrapClassName="dialog"
        :visible="visible"
        @cancel="
          () => {
            visible = false;
          }
        "
        width="80%"
        :closable="false"
        :mask="true"
        :destroyOnClose="true"
        :footer="null"
        v-if="compareObj"
      >
        <code-compare
          style="height: 60vh"
          class="compare-container"
          :origin="compareObj.origin"
          :now="compareObj.now"
          :lang="job.lang"
        />
      </a-modal>
    </template>
  </div>
</template>

<script>
import CodeCompare from "../../components/codeCompare";
import { getJobRecordDetail } from "@/api/develop";
import commonMixin from "@/mixins/common";
function isLink(type) {
  return Object.keys(map).includes(type);
}
const map = {
  任务配置: "selfConfigs",
  定时表达式: "cronExpression",
  "任务开启/关闭状态": "auto",
  更新脚本内容: "script"
};
export default {
  mixins: [commonMixin],
  data() {
    return { visible: false, compareObj: null };
  },
  components: { CodeCompare },
  methods: {
    isLink,
    more() {
      this.$store.dispatch("develop/getJobRecords", {
        pageSize: this.jobOpRecord.pageSize,
        offset: this.jobOpRecord.offset + this.jobOpRecord.pageSize,
        jobId: this.job.id
      });
    },
    getRecordDetail(record) {
      if (record.changeObj) {
        this.setChangeVisible(record);
        return;
      }
      const type = record.type;
      getJobRecordDetail({ id: record.logId, type }).then(data => {
        const changeObj = {
          oldVal: record.content,
          newVal: data.content
        };
        this.$set(record, "changeObj", changeObj);
        this.setChangeVisible(record);
      });
    },
    setChangeVisible(record) {
      this.$set(record, "visible", !record.visible);
      if (record.type === "更新脚本内容") {
        this.compareObj = {
          origin: { description: "", content: record.changeObj.oldVal },
          now: {
            description: "",
            content: record.changeObj.newVal
          }
        };
        this.visible = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  padding: 15px;
  height: 100%;
  overflow: auto;
  .record-list {
    .record-item {
      margin-bottom: 10px;
      font-size: 13px;
      .change-content {
        width: auto;
        font-size: 12px;
        margin-top: 5px;
        background-color: @editor-bg-color;
        padding: 4px 10px;
      }
      .compare-container {
        margin-top: 5px;
        border: 1px solid @editor-border-color;
        height: 20vh;
      }
    }
  }
}
</style>