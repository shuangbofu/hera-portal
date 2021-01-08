<template>
  <div style="padding: 20px">
    <h2>
      旧版调度中心地址
      <h5 style="margin-top: 5px">{{ countDownLabel }}后失效</h5>
    </h2>
    <template v-if="key !== ''">
      <a style="font-size: 25px" :href="link" target="_blank">{{ link }}</a>
      <div style="margin-top: 20px">
        <a-button type="primary" @click="refreshKey" size="small"
          >立即刷新</a-button
        >
        <a-button style="margin: 0 20px" @click="copy(link)" size="small"
          >复制到剪贴板</a-button
        >

        <a-input-number
          size="small"
          v-model="value"
          :min="1"
          :max="60"
        ></a-input-number>
        <a-button style="margin-left: -1px" size="small" @click="resetCache()"
          >设置</a-button
        >
      </div>
    </template>
    <h5 v-else style="margin-top: 5px">没有权限</h5>
  </div>
</template>

<script>
import axios from "@/utils/request.js";
export default {
  data() {
    return {
      key: "",
      duration: 0,
      createTime: 0,
      countDownInterval: null,
      countDownLabel: "",
      value: 0
    };
  },
  computed: {
    link() {
      const host = window.location.host;
      return `${host}/scheduleCenter?key=${this.key}`;
    }
  },
  created() {
    this.countDown();
    this.refreshKey();
  },
  destroyed() {
    this.clearCountDown();
  },
  methods: {
    countDown() {
      this.countDownInterval = setInterval(() => {
        console.log(this.createTime);
        const end_time = this.createTime / 1000 + this.duration * 60; //终止时间
        var curr_time = parseInt(Date.parse(new Date()) / 1000);
        var diff_time = parseInt(end_time - curr_time); // 倒计时时间差
        // var h = Math.floor(diff_time / 3600);
        var m = Math.floor((diff_time / 60) % 60);
        var s = Math.floor(diff_time % 60);
        this.countDownLabel = `${m}分${s}秒`;
        if (diff_time <= 0) {
          this.countDownLabel = "";
          this.refreshKey();
        }
      }, 1000);
    },
    clearCountDown() {
      clearInterval(this.countDownInterval);
      this.countDownLabel = "";
      this.countDownInterval = null;
    },
    refreshKey() {
      axios.get("/key").then(data => {
        this.key = data.key;
        this.duration = data.duration;
        this.value = this.duration;
        this.createTime = data.createTime;
      });
    },
    resetCache() {
      axios.post(`/resetCache?duration=${this.value}`).then(() => {
        this.$message.success("设置成功! ");
        this.refreshKey();
      });
    },
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
    }
  }
};
</script>

<style>
</style>