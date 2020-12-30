<template>
  <div class="container">
    <div
      class="publish-list"
      v-if="data.publishes && data.publishes.length > 0"
    >
      <div
        v-for="(pub, index) in data.publishes"
        :key="index"
        class="publish-item"
      >
        <span
          style="
            background-color: #87d068;
            font-size: 5px;
            color: #fff;
            padding: 2px 4px;
          "
          v-if="pub.current"
          >最新发布</span
        >
        {{ pub.description }}
        <a-tag>{{ pub.username }}</a-tag>
        <a-badge :color="pub.stateInfo.color" :text="pub.stateInfo.text" />
        <div class="time">{{ parseTime(pub.gmtCreate) }}</div>
        <div class="link-list">
          <a class="link" @click="codeCompare(pub)">对比当前</a>
          <a
            class="link"
            :disabled="
              pub.current ||
              !pub.lastVersion ||
              (!lastestPublish && lastestPublish)
            "
            @click="lastestCodeCompare(pub)"
            >对比发布</a
          >
          <a
            class="link"
            style="margin-left: 5px"
            v-if="pub.state === 'padding'"
            @click="cancel(pub)"
            >取消</a
          >
        </div>
      </div>
    </div>
    <div v-else style="text-align: center; padding-top: 20px">没有发布</div>
    <code-compare ref="codeCompareRef" />
  </div>
</template>

<script>
import CodeCompare from "../dialog/codeCompare";
import { parseTime } from "@/utils/date";

function getCodeInfo(data, description) {
  return {
    script: data.script,
    selfConfigs: data.selfConfigs,
    description:
      description || "[" + data.description + "] " + parseTime(data.gmtCreate)
  };
}

export default {
  props: ["data"],
  data() {
    return {};
  },
  components: {
    CodeCompare
  },
  computed: {
    lastestPublish() {
      return this.data.publishes.find(i => i.current);
    }
  },
  methods: {
    parseTime,
    codeCompare(pub) {
      this.$refs.codeCompareRef.show(
        pub.jobRunType,
        getCodeInfo(pub),
        getCodeInfo(this.data, "现在的代码")
      );
    },
    lastestCodeCompare(pub) {
      this.$refs.codeCompareRef.show(
        pub.jobRunType,
        getCodeInfo(this.lastestPublish || pub.lastVersion),
        getCodeInfo(pub)
      );
    },
    cancel(pub) {
      this.$store
        .dispatch("develop/cancelJobPublish", {
          pubId: pub.id,
          jobId: pub.jobId
        })
        .then(() => {
          this.$message.success("取消成功!");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  .publish-list {
    .publish-item {
      padding: 10px 15px;
      border-bottom: 1px solid @editor-border-color;
      .time {
        font-size: 10px;
      }
      .link {
        margin-right: 10px;
        // color: @primary-color;
        font-weight: 500;
        font-size: 11px;
      }
    }
  }
}
</style>