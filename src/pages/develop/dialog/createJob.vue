<template>
  <a-modal
    wrapClassName="create-job-dialog"
    :visible="visible"
    @cancel="close"
    width="240px"
    :closable="false"
    :mask="true"
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
        ref="nameInput"
      >
        <template slot="prefix">
          <span v-if="isCreateJob" :class="['icon', jobType]">
            {{ jobType.substring(0, 1) }}
          </span>
          <a-icon
            type="folder"
            theme="filled"
            :class="['group-icon', groupType]"
            v-else-if="isCreateGroup"
          />
          <template v-else-if="isRename">
            <a-icon
              v-if="obj.type.includes('dic')"
              type="folder"
              theme="filled"
              :class="['group-icon', obj.type]"
            />
            <span v-else :class="['icon', obj.runType]">
              {{ (obj.runType || "?").substring(0, 1) }}
            </span>
          </template>
        </template>
      </a-input>
      <div class="type-select">
        <template v-if="isCreateJob">
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
        </template>
        <template v-else-if="isCreateGroup">
          <div
            v-for="type in groupTypes"
            :key="type.name"
            :class="['type', type.name === groupType ? 'active' : '']"
            @click="groupType = type.name"
          >
            <a-icon
              type="folder"
              theme="filled"
              :class="['group-icon', type.name]"
            />
            {{ type.title }}
          </div>
        </template>
      </div>
    </div>
  </a-modal>
</template>

<script>
const jobTypes = ["Spark", "Hive", "Shell"];
const groupTypes = [
  {
    name: "big_dic",
    title: "大目录",
  },
  { name: "small_dic", title: "小目录" },
];
export default {
  data() {
    return {
      jobTypes,
      groupTypes,
      visible: false,
      jobType: "Spark",
      groupType: "small_dic",
      name: "",
      data: {},
      callback: null,
    };
  },
  computed: {
    oldName() {
      return this.obj?.name.split("(")[0];
    },
    obj() {
      return this.data.obj;
    },
    title() {
      return this.data.order;
    },
    isCreateJob() {
      return this.title === "新建任务";
    },
    isRename() {
      return this.title === "重命名";
    },
    isCreateGroup() {
      return this.title === "新建文件夹";
    },
    isCopy() {
      return this.title === '复制'
    }
  },
  methods: {
    show(data, callback) {
      this.data = data;
      if (this.isRename) {
        this.name = this.oldName;
      }
      this.visible = true;
      this.callback = callback;
      this.$nextTick(() => {
        this.$refs.nameInput.focus();
      });
    },
    submit() {
      let result = {};
      if (this.name.trim() === "") {
        this.$message.error("name不能为空！");
        return;
      }
      this.visible = false;
      if (this.isCreateGroup) {
        result = {
          directory: this.groupType === "big_dic" ? 0 : 1,
          name: this.name,
          parentId: this.obj.id,
        };
      } else if (this.isCreateJob) {
        result = {
          runType: this.jobType.toLowerCase(),
          name: this.name,
          parentId: `group_${this.obj.id}`,
        };
      } else if(this.isCopy) {
        result = {
          name: this.name
        }
      }
      this.callback(this.data.order, result);
      close()
    },
    close() {
      this.visible = false;
      this.jobType = "Spark";
      this.groupType = "small_dic";
      this.name = "";
      console.log("close", this.name);
    },
  },
};
</script>

<style lang="less">
.create-job-dialog {
  .ant-modal-content {
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
  .group-icon {
    font-size: 14px;
    margin-right: 6px;
    &.big_dic {
      color: @editor-tree-icon1-color;
    }
    &.small_dic {
      color: @editor-tree-icon2-color;
    }
    &.active {
      &.big_dic {
        color: @editor-tree-icon3-color;
      }
      &.small_dic {
        color: @editor-tree-icon4-color;
      }
    }
  }
}
.container {
}
</style>