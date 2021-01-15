<template>
  <a-modal
    wrapClassName="option-dialog"
    :visible="visible"
    @cancel="close"
    width="240px"
    :closable="false"
    :mask="true"
    :destroyOnClose="true"
    :centered="true"
    :footer="null"
  >
    <div class="title">发布任务</div>
    <a-textarea
      placeholder="发布描述"
      size="small"
      v-model="option.description"
      @pressEnter="submit"
    >
    </a-textarea>
    <h-select
      :filterable="true"
      v-model="option.auditor"
      :options="
        users.map((i) => {
          return { label: i.name, value: i.id };
        })
      "
    />
  </a-modal>
</template>

<script>
import { getAllUsers } from "@/api/other";
import HSelect from "@/components/HSelect";
export default {
  data() {
    return {
      callback: null,
      visible: false,
      option: { description: "" },
      users: []
    };
  },
  created() {
    getAllUsers().then(data => {
      this.users = data;
    });
  },
  components: { HSelect },
  methods: {
    close() {
      this.option = {};
      this.visible = false;
    },
    show(callback) {
      this.visible = true;
      this.callback = callback;
    },
    submit() {
      if (this.option.description.trim() === "") {
        this.$message.error("不能为空");
        return;
      }
      this.callback(this.option);
      this.close();
    }
  }
};
</script>

<style lang="less">
.option-dialog {
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
}
</style>