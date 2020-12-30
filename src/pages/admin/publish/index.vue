<template>
  <div class="publish-container">
    <div style="margin-bottom: 10px; display: flex; align-items: center">
      <a-select
        size="small"
        @change="init"
        style="width: 120px; margin-right: 15px"
        v-model="filter.state"
        :options="stateOptions"
      />
      <a-input
        size="small"
        style="width: 120px; margin-right: 20px"
        v-model="filter.jobId"
        placeholder="任务ID"
        @pressEnter="init"
      >
      </a-input>
      <a-radio-group v-model="filter.mode" @change="init">
        <a-radio value="auditor">审核</a-radio>
        <a-radio value="application">申请</a-radio>
      </a-radio-group>
    </div>
    <a-table
      style="height: 100%"
      :ellipsis="true"
      size="small"
      :columns="columns"
      :data-source="publishes"
      :pagination="pagination"
      :loading="loading"
      rowKey="id"
      @change="changePagination"
    >
      <div slot="description" slot-scope="description, row">
        <span
          style="
            background-color: #87d068;
            font-size: 5px;
            color: #fff;
            padding: 2px 4px;
          "
          v-if="row.current"
          >最新发布</span
        >
        {{ description }}
      </div>
      <div slot="jobTitle" slot-scope="row" style="position: relative">
        <div style="position: relative">{{ row.jobName }}({{ row.id }})</div>
      </div>
      <div slot="lastVersion" slot-scope="row">
        <template v-if="row.lastVersion">
          <a-tag>{{ row.lastVersion.description }}</a-tag>
        </template>
        <template v-else-if="row.current"> - </template>
        <template v-else> 无 </template>
      </div>
      <div slot="stateInfo" slot-scope="stateInfo">
        <a-badge :color="stateInfo.color" :text="stateInfo.text" />
      </div>
      <div slot="action" slot-scope="row">
        <a @click="compare(row)" :disabled="!row.lastVersion">代码对比</a>
        <template v-if="row.state === 'padding' && filter.mode === 'auditor'">
          <a-divider type="vertical" />
          <a @click="pass(row)">通过</a>
          <a-divider type="vertical" />
          <a @click="reject(row)">拒绝</a>
        </template>
        <template v-else-if="row.state === 'error'">
          <a-divider type="vertical" />
          <a @click="retry(row)">重试</a>
        </template>
        <template
          v-if="row.state === 'padding' && filter.mode === 'application'"
        >
          <a-divider type="vertical" />
          <a @click="cancel(row)">取消</a>
        </template>
        <template
          v-if="row.state === 'success' && row.current && row.last !== 0"
        >
          <a-divider type="vertical" />
          <a @click="rollback(row)">回滚</a>
        </template>
      </div>
    </a-table>
    <code-compare ref="codeCompareRef" />
  </div>
</template>

<script>
// import HSelect from "@/components/HSelect";
import CodeCompare from "../../develop/dialog/codeCompare";
import { parseTime } from "@/utils/date";
import {
  getJobPublishes,
  // getLastJobPublish,
  passJobPublish,
  retryJobPublish,
  cancelJobPublish,
  rollbackPublish
} from "@/api/job/publish";
const stateOptions = [
  { value: "padding", label: "待审批" },
  { value: "success", label: "成功" },
  { value: "cancelled", label: "已取消" },
  { value: "rejected", label: "已拒绝" },
  { value: "error", label: "失败" },
  { value: "rolledBack", label: "已回滚" },
  { value: "", label: "所有状态" }
];
const columns = [
  {
    dataIndex: "description",
    title: "发布描述",
    scopedSlots: {
      customRender: "description"
    }
  },
  {
    title: "任务名",
    key: "jobTitle",
    customRender: (_, record) => {
      return `${record.jobName}(${record.jobId})`;
    }
  },
  {
    key: "lastVersion",
    title: "线上",
    scopedSlots: {
      customRender: "lastVersion"
    }
  },
  {
    title: "状态",
    dataIndex: "stateInfo",
    scopedSlots: { customRender: "stateInfo" }
  },
  {
    dataIndex: "username",
    title: "申请人"
  },
  {
    dataIndex: "auditorName",
    title: "审核人"
  },
  {
    title: "创建时间",
    dataIndex: "gmtCreate",
    customRender: text => {
      return parseTime(text);
    }
  },
  {
    title: "操作时间",
    dataIndex: "opTime",
    customRender: text => {
      if (text === 0) {
        return "-";
      }
      return parseTime(text);
    }
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: {
      customRender: "action"
    }
  }
];
function getCodeInfo(data, description) {
  return {
    script: data.script,
    selfConfigs: data.selfConfigs,
    description:
      description || "[" + data.description + "] " + parseTime(data.gmtCreate)
  };
}
export default {
  data() {
    return {
      stateOptions,
      columns,
      publishes: [],
      loading: false,
      pagination: {
        showTotal: total => `共${total}条`,
        total: 0,
        current: 1,
        pageSize: 15
      },
      filter: {
        mode: "auditor",
        state: "padding",
        jobId: ""
      }
    };
  },
  components: {
    CodeCompare
    // HSelect
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      getJobPublishes(this.pagination.pageSize, this.pagination.current, {
        ...this.filter,
        state: this.filter.state === "" ? null : this.filter.state
      }).then(data => {
        this.pagination = {
          current: data.pageNum,
          pageSize: data.pageSize,
          total: data.total
        };
        this.publishes = data.list;
        this.loading = false;
      });
    },
    compare(pub) {
      this.$refs.codeCompareRef.show(
        pub.jobRunType,
        getCodeInfo(pub.lastVersion),
        getCodeInfo(pub)
      );
    },
    pass(pub) {
      passJobPublish(pub.id).then(() => {
        this.$message.success("通过成功!");
        this.init();
      });
    },
    retry(pub) {
      retryJobPublish(pub.is).then(() => {
        this.$message.success("重试成功!");
        this.init();
      });
    },
    cancel(pub) {
      cancelJobPublish(pub.id).then(() => {
        this.$message.success("取消成功!");
        this.init();
      });
    },
    rollback(pub) {
      rollbackPublish(pub.id).then(() => {
        this.$message.success("回滚成功!");
        this.init();
      });
    },
    changePagination(p) {
      this.pagination = { ...p };
      this.init();
    }
  }
};
</script>

<style lang="less" scoped>
.publish-container {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
}
</style>