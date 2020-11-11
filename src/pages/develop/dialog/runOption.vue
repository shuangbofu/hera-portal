<template>
  <a-modal
    wrapClassName="run-option-dialog"
    :visible="visible"
    @cancel="close"
    width="240px"
    :closable="false"
    :mask="true"
    :destroyOnClose="true"
    :centered="true"
    :footer="null"
  >
    <div class="title">运行任务</div>
    <a-select v-model="option.actionId" style="width: 100%" size="small">
      <a-select-option v-for="(v, index) in versions" :key="index" :value="v">
        {{ v }}
      </a-select-option>
    </a-select>
    <div class="type-select">
      <div
        :class="['type', type.value === option.triggerType ? 'active' : '']"
        v-for="type in triggerTypes"
        :key="type.value"
        @click="option.triggerType = type.value"
      >
        <span>{{ type.label }}</span>
      </div>
    </div>
    <div class="button" @click="submit">确定</div>
  </a-modal>
</template>

<script>
const triggerTypes = [
  { value: 2, label: "手动执行" },
  { value: 3, label: "手动恢复" },
  { value: 6, label: "超级恢复" },
];
export default {
  data() {
    return {
      triggerTypes,
      versions: [],
      option: {
        actionId: "",
        triggerType: 2,
      },
      visible: false,
      callback: null,
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.callback = null;
      this.option = {
        actionId: "",
        triggerType: 2,
      };
    },
    show(versions, callback) {
      this.versions = versions;
      this.option.actionId = versions[0];
      this.visible = true;
      this.callback = callback;
    },
    submit() {
      this.callback(this.option);
      this.visible = false;
    },
  },
};
</script>

<style lang="less">
.run-option-dialog {
  .ant-modal-content {
    background: @editor-bg-color;
    .ant-modal-body {
      padding: 0;
      font-size: 12px;
    }
  }
  .title {
    text-align: center;
    padding: 4px 0;
    background: @editor-bg-color;
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
  .button {
    margin-top: 10px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    border-top: 1px solid @editor-border-color;
    background: @editor-bg-color;
    &:hover {
      color: #ffffff;
      background: @editor-tree-active-color;
    }
  }
  .ant-select-selection {
    font-size: 12px;
  }
}
</style>