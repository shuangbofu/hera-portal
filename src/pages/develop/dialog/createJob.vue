<template>
  <a-modal
    wrapClassName="create-job-dialog"
    :visible="visible"
    @cancel="
      visible = false;
      jobType = 'Spark';
      name = '';
    "
    width="240px"
    :closable="false"
    :mask="false"
    :destroyOnClose="true"
    :centered="true"
    :footer="null"
  >
    <div class="container">
      <div class="title">
        {{ title }}
      </div>
      <a-input
        size="small"
        v-model="name"
        @pressEnter="submit"
        :placeholder="`${oldName}/`"
      >
        <span v-if="isCreateJob" :class="['icon', jobType]" slot="prefix">
          {{ jobType.substring(0, 1) }}
        </span>
      </a-input>
      <div class="type-select" v-if="isCreateJob">
        <div
          :class="['type', type === jobType ? 'active' : '']"
          v-for="type in jobTypes"
          :key="type"
          @click="jobType = type"
        >
          <span :class="['icon', type]">
            {{ type.substring(0, 1) }}
          </span>
          <span>{{ type }}</span>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
const jobTypes = ["Spark", "Hive", "Shell"];
export default {
  data() {
    return {
      jobTypes,
      visible: false,
      jobType: "Spark",
      name: "",
      obj: {},
    };
  },
  computed: {
    oldName() {
      return this.obj.data?.name.split("(")[0];
    },
    title() {
      return this.obj.title;
    },
    isCreateJob() {
      return this.title === "新建任务";
    },
    isRename() {
      return this.title === "重命名";
    },
  },
  methods: {
    show(obj) {
      this.obj = obj;
      if (this.isRename) {
        this.name = this.oldName;
      }
      this.visible = true;
    },
    submit() {
      this.visible = false;
      console.log(this.name);
    },
  },
};
</script>

<style lang="less">
.create-job-dialog {
  .ant-modal-content {
    // box-shadow: none;
    border: 1px solid @editor-border-color;
    box-shadow: 0 4px 12px @editor-bg-color!important;
    background: @editor-bg-color;
    .ant-modal-body {
      padding: 0;
      font-size: 12px;
      .title {
        text-align: center;
        padding: 4px 0;
        background: @editor-bg-color;
      }
      .ant-input-affix-wrapper .ant-input-prefix {
        left: 10px;
      }
      .ant-input {
        font-size: 12px;
        &,
        &:focus,
        &:hover {
          border-left: none;
          border-right: none;
        }
      }
      .type-select {
        margin-top: 10px;
        background: @base-bg-color;
        .type {
          padding: 2px 10px;
          display: flex;
          align-items: center;
          cursor: default;
          &.active {
            background: @editor-tree-active-color;
            color: #ffffff;
          }
        }
      }
    }
  }
  .icon {
    display: block;
    margin-right: 5px;
    font-size: 9px;
    font-weight: bold;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    text-align: center;
    // color: #324853;
    color: @editor-icon2-color;
    background-color: @editor-gray-color;
    line-height: 17px;
    &.Spark {
      // color: #f50;
      line-height: 15px;
      color: #324853;
      background-color: @editor-origin-color;
    }
    &.Hive {
      // color: #87d068;
      line-height: 16px;
      color: #324853;
      background-color: @editor-green-color;
    }
    &.Shell {
      // color: #ffb800;
      line-height: 15px;
      color: #324853;
      background-color: @editor-yellow-color;
    }
  }
}
.container {
}
</style>