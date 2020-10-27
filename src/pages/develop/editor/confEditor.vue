<template>
  <div class="container">
    <split-pane :show="[width, true]" @resize="resize">
      <MonacoEditor
        slot="left"
        class="editor"
        v-model="configText"
        :theme="theme"
        language="ini"
        :options="{
          fontSize: 13,
          automaticLayout: true,
        }"
      />
      <div slot="right" class="right-shower">
        <div class="ops operation-bar">
          <a-icon type="reload" @click="refresh" class="refresh-icon icon" />
          <a-radio-group
            size="small"
            :options="options"
            default-value="all"
            v-model="option"
            @change="changeRadio"
          />
          <a-input
            size="small"
            style="width: 150px"
            v-model="filterValue"
            placeholder="过滤条件"
          >
            <a-icon type="filter" slot="prefix" />
          </a-input>
        </div>
        <div class="confs">
          <a-collapse v-model="collapseActive" :bordered="false">
            <a-collapse-panel key="1" header="当前配置">
              <div
                :key="index1"
                v-for="(kv, index1) in filterConfigArr"
                class="conf-item"
              >
                <span class="key" @click="copy('${' + kv.key + '}')">{{
                  kv.key
                }}</span
                >:
                <span class="value" @click="copy(kv.value)">
                  {{ kv.value }}
                </span>
              </div>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="继承配置">
              <div
                :key="'herit_' + index"
                v-for="(kv, index) in filterInheritConfigArr"
                class="conf-item"
                :style="{
                  'text-decoration-line': configKeys.includes(kv.key)
                    ? 'line-through'
                    : '',
                }"
              >
                <span class="key" @click="copy('${' + kv.key + '}')">{{
                  kv.key
                }}</span>
                :
                <span class="value" @click="copy(kv.value)">
                  {{ kv.value }}
                </span>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>
    </split-pane>
  </div>
</template>

<script>
import SplitPane from "@/components/splitPane";
import MonacoEditor from "monaco-editor-vue";
const options = [
  { label: "所有", value: "all" },
  { label: "覆盖", value: "covered" },
  { label: "ZDT", value: "zdt" },
];
let option = "all";
function obj2Arr(obj) {
  const res = [];
  for (let key in obj) {
    res.push({
      key: key,
      value: obj[key],
    });
  }
  return res;
}
export default {
  props: ["data", "inherit"],
  data() {
    return {
      options,
      option: "",
      filterValue: "",
      collapseActive: [1, 2],
    };
  },
  created() {
    // 关闭右侧菜单是会重新create，从option中读取
    this.option = option;
  },
  components: {
    SplitPane,
    MonacoEditor,
  },
  computed: {
    width() {
      return this.$store.state.develop.layoutConfig.confEditorWidth;
    },
    theme() {
      return this.$store.state.setting.theme.mode === "light"
        ? "vs"
        : "vs-dark";
    },
    inheritConfigArr() {
      return obj2Arr(this.inherit);
    },
    configKeys() {
      return this.configArr.map((i) => i.key);
    },
    configArr() {
      return obj2Arr(this.data);
    },
    configText: {
      get() {
        let res = "";
        this.configArr.forEach((i) => {
          res += i.key + " = " + i.value + "\n";
        });
        return res;
      },
      set() {},
    },
    filterInheritConfigArr() {
      const option = this.option;
      let arr = this.inheritConfigArr;

      if (option === "covered") {
        arr = arr.filter((i) => this.configKeys.includes(i.key));
      } else if (option === "zdt") {
        arr = arr.filter((i) => i.value.includes("${zdt"));
      }
      return arr.filter((i) => i.key.includes(this.filterValue));
    },
    filterConfigArr() {
      const option = this.option;
      let arr = this.configArr;
      if (option === "covered") {
        const keys = this.filterInheritConfigArr.map((j) => j.key);
        arr = arr.filter((i) => keys.includes(i.key));
      } else if (option === "zdt") {
        arr = arr.filter((i) => i.value.includes("${zdt"));
      }
      return arr.filter((i) => i.key.includes(this.filterValue));
    },
  },
  methods: {
    changeRadio() {
      option = this.option;
    },
    resize(v) {
      this.$store.commit("develop/setConfEditorWidth", v);
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
    },
    refresh() {},
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  .left-editor,
  .right-shower .confs {
    height: 100%;
    padding: 15px;
    overflow: auto;
  }
  .left-editor {
    .conf-line {
      display: flex;
      margin-bottom: 10px;
      .key {
        width: calc(40% - 25px);
      }
      .equals {
        width: 10px;
        margin: 0 10px;
        text-align: center;
      }
      .value {
        width: calc(60% - 25px);
      }
      .close {
        margin-left: 10px;
      }
    }
  }
  .right-shower {
    height: 100%;
    overflow: hidden;
    .ops {
      background: @editor-bg-color;
      overflow: hidden;
      display: flex;
      padding: 2px 10px;
      height: 30px;
      border-bottom: 1px solid @editor-border-color;
      .refresh-icon {
        margin-right: 15px;
        line-height: 30px;
        padding: 0 4px;
      }
    }
    .confs {
      padding: 0;
      height: calc(100% - 30px);
      .conf-item {
        line-height: 26px;
        font-size: 14px;
        .key,
        .value {
          &.key {
            font-weight: 600;
          }
          padding: 4px;
          &:hover {
            background: @editor-tree-hover-color;
          }
        }
      }
    }
  }
}

.ant-divider-horizontal.ant-divider-with-text-center,
.ant-divider-horizontal.ant-divider-with-text-left,
.ant-divider-horizontal.ant-divider-with-text-right {
  margin: 6px 0;
  margin-top: 0;
}
.ant-collapse {
  border: 0;
}
</style>
<style lang="less">
.ant-radio-wrapper {
  font-size: 13px !important;
}
</style>