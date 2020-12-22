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
    <a-textarea size="small" v-model="option.description" @pressEnter="submit">
    </a-textarea>
   </a-modal>
</template>

<script>
export default {
  data() {return {callback:null,visible: false, option:{description: ''}}},
  methods: {
    close() {
      this.option = {}
      this.visible = false
    },
    show(callback) {
      this.visible = true;
      this.callback = callback;
    },
    submit() {
      this.callback(this.option)
      this.close()
    },
  }
}
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