<template>
  <div class="container">
    <h-menu class="tabs" v-model="tabActive" :tabs="tabs" />
    <div class="main-content">
      <publish v-if="tabActive === 'publish'" />
      <template v-else> 待开发 </template>
    </div>
  </div>
</template>

<script>
import Publish from "./publish/index";
import HMenu from "@/components/HMenu";
const tabs = [
  {
    name: "userManager",
    label: "用户管理",
    icon: "user",
    children: [
      { name: "user", label: "用户", icon: "my" },
      { name: "userGroup", label: "用户组", icon: "user" }
    ]
  },
  {
    name: "clusterManager",
    label: "机器管理",
    icon: "cluster",
    children: [
      { name: "machine", label: "机器" },
      { name: "machineGroup", label: "机器组" }
    ]
  },
  {
    name: "job",
    label: "任务管理",
    children: [
      { name: "publish", label: "发布", icon: "publish3" },
      { name: "search", label: "搜索" }
    ]
  },
  { name: "runlog", label: "系统日志" }
];

function setDisabled(tabs, enableArray) {
  tabs.forEach(i => {
    if (!i.children) {
      if (!enableArray.includes(i.name)) {
        i.disabled = true;
      }
    } else {
      setDisabled(i.children, enableArray);
    }
  });
}

setDisabled(tabs, ["publish"]);

export default {
  data() {
    return {
      tabs,
      tabActive: "publish"
    };
  },
  components: {
    Publish,
    HMenu
  },
  computed: {
    theme() {
      return this.$store.state.setting.theme.mode;
    }
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.container {
  padding: 10px;
  background-color: @editor-bg-color;
  display: flex;
  height: 100%;
  box-sizing: border-box;
  .tabs {
    width: 140px;
    height: 392px;
    background-color: @base-bg-color;
    border: 1px solid @editor-border-color;
    .tab {
      padding: 2px 12px;
      line-height: 30px;
      font-size: 14px;
      cursor: default;
      user-select: none;
      .icon {
        margin: 0 10px;
      }
      &:hover {
        background-color: @hover-bg-color;
      }
      &.active {
        border-left: 2px solid @primary-color!important;
      }
    }
  }
  .main-content {
    width: calc(100% - 150px);
    margin-left: 10px;
    height: 100%;
    border: 1px solid @editor-border-color;
    background-color: @base-bg-color;
  }
}
</style>