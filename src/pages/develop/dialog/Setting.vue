<template>
  <a-modal
    wrapClassName="setting-dialog"
    :visible="visible"
    @cancel="close"
    width="250px"
    :closable="false"
    :mask="true"
    :destroyOnClose="true"
    :centered="true"
    :footer="null"
  >
    <div class="container">
      <!-- {{ setting }} -->
      <div class="content">
        <div class="form-line">
          <!-- <div class="title">显示任务ID</div> -->
          <a-checkbox v-model="setting.showId">
            树结构和标签显示任务ID
          </a-checkbox>
        </div>
        <div class="form-line">
          <!-- <div class="title">显示任务ID</div> -->
          <a-checkbox v-model="setting.showTabs">
            开启多标签显示切换
          </a-checkbox>
        </div>
        <div class="form-line">
          <!-- <div class="title">显示任务ID</div> -->
          <a-checkbox v-model="setting.hideEmptyFolder">
            不显示空文件夹
          </a-checkbox>
        </div>
        <div class="form-line">
          <a-checkbox v-model="setting.compareBeforeSave">
            保存前进行代码比较
          </a-checkbox>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  data() {
    return { visible: false };
  },
  watch: {
    setting: {
      handler() {
        this.$store.commit("develop/saveLocalLayout");
      },
      deep: true
    }
  },
  computed: {
    setting() {
      return this.$store.getters["develop/depSetting"];
    }
  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    }
  }
};
</script>

<style lang="less">
.setting-dialog {
  .ant-modal-content {
    background: @editor-bg-color;
    .ant-modal-body {
      padding: 0;
      font-size: 12px;
    }
  }
}
</style>
<style lang="less" scoped>
.container {
  background: @base-bg-color;
  position: relative;
  padding: 20px;
  height: 20vh;
  user-select: none;
  overflow: auto;
  .content {
    .form-line {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 12px;
      .title {
        margin-right: 10px;
        width: 100px;
      }
    }
  }
}
</style>