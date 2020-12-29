<template>
  <a-modal
    wrapClassName="option-dialog"
    :visible="visible"
    @cancel="close"
    width="540px"
    :closable="false"
    :mask="true"
    :destroyOnClose="true"
    :centered="true"
    :footer="null"
  >
    <div class="title">上传资源</div>
    <div class="main">
      <a-upload
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
      >
        <a-button size="small"> <a-icon type="upload" />选择文件 </a-button>
      </a-upload>
      <a-button
        size="small"
        type="primary"
        style="margin-top: 5px"
        :disabled="fileList.length === 0"
        :loading="uploading"
        @click="handleUpload"
      >
        {{ uploading ? "上传中" : "上传" }}
      </a-button>
      <div class="file-list" v-if="fileInfos.length > 0">
        <div
          style="padding: 5px 10px"
          v-for="(file, index) in fileInfos"
          :key="index"
        >
          {{ file.name }}
          <a-badge
            style="margin-left: 10px"
            :color="stateInfoMap[file.state].color"
            :text="stateInfoMap[file.state].text"
          />
          <div class="msg">{{ file.msg }}</div>
        </div>
      </div>
      <div
        style="margin-top: 10px"
        v-if="cache.length > 0"
        class="resource-list"
      >
        已上传资源列表：
        <div
          style="padding: 5px 10px; margin-top: 5px"
          v-for="(path, index) in cache"
          :key="index"
        >
          {{ path }}
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
const cacheKey = "hera_resources_cache";
const stateInfoMap = [
  { color: "#ffb800", text: "上传中" },
  { color: "#909399", text: "待上传" },
  { color: "#f50", text: "上传失败" },
  { color: "#87d068", text: "上传成功" }
];
export default {
  data() {
    return {
      stateInfoMap,
      visible: false,
      fileList: [],
      fileInfos: [],
      uploading: false,
      cache: []
    };
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleUpload() {
      const fileList = this.fileList;
      fileList.forEach((file, idx) => {
        let index = this.fileInfos.findIndex(i => i.uid === file.uid);
        if (index === -1) {
          this.fileInfos.push({ uid: file.uid, state: 1, name: file.name });
          index = this.fileInfos.length - 1;
        }
        const fileInfo = this.fileInfos[index];
        if (fileInfo.state > 0 && fileInfo.state < 3) {
          const formData = new FormData();
          formData.append("fileFrom", file);
          formData.append("file_id", idx);
          fileInfo.state = 0;
          this.$axios
            .post("/uploadResource/upload.do", formData)
            .then(data => {
              console.log(data);
              try {
                const split = data.split("[上传成功]: ");
                console.log(split);
                const path = split[1].replace("<br>", "");
                this.save2Local(path);
                fileInfo.msg = path;
              } catch (msg) {
                console.log(msg);
              }
              fileInfo.state = 3;
            })
            .catch(msg => {
              fileInfo.msg = msg;
              fileInfo.state = 2;
            });
        }
      });
    },
    save2Local(path) {
      this.cache.push(path);
      localStorage.setItem(cacheKey, JSON.stringify(this.cache));
    },
    getCacheFromLocal() {
      this.cache = JSON.parse(localStorage.getItem(cacheKey) || "[]");
    },
    close() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  background-color: @base-bg-color;
  padding: 10px;
  .file-list,
  .resource-list {
    margin-top: 10px;
    border: 1px solid @editor-border-color;
    .msg {
      margin-top: 4px;
      background-color: @editor-bg-color;
      padding: 2px 4px;
    }
  }
}
</style>