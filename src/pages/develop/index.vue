<template>
  <div class="develop-container">
    <a-layout>
      <a-layout-header class="header">
        <main-header />
      </a-layout-header>
      <a-layout-content :class="{ content: true, fullscreen: fullscreen }">
        <main-center>
          <template v-slot:left-side>
            <tabs
              :tabs="tabs.left"
              :active="leftTab.name"
              @change="(v) => changeTab(v.name, 'left')"
            />
          </template>
          <template v-slot:right-side>
            <tabs
              :tabs="tabs.right"
              :active="rightTab.name"
              @change="(v) => changeTab(v.name, 'right')"
            />
          </template>
          <template v-slot:left>
            <content-left class="content-in" />
          </template>
          <template v-slot:center>
            <content-center class="content-in" />
          </template>
          <template v-slot:right>
            <right-attached class="content-in" />
          </template>
          <template v-slot:bottom>
            <footer-attached class="content-in" />
          </template>
        </main-center>
      </a-layout-content>
      <a-layout-footer class="footer">
        <main-footer />
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import commonMixin from "@/mixins/common";
import Tabs from "./components/tabs";
import MainHeader from "./structure/header";
import MainFooter from "./structure/footer";
import MainCenter from "./structure/center";
import ContentLeft from "./content/left";
import ContentCenter from "./content/center";
import RightAttached from "./content/right";
import FooterAttached from "./content/footer";

export default {
  mixins: [commonMixin],
  components: {
    MainHeader,
    MainFooter,
    MainCenter,
    ContentLeft,
    ContentCenter,
    RightAttached,
    FooterAttached,
    Tabs,
  },
  created() {
    this.initJobs().then(() => {
      this.restoreLocal();
    });
  },
  computed: {},
  methods: {},
};
</script>

<style lang="less" scoped>
.develop-container {
  .header,
  .content,
  .footer {
    background: @editor-bg-color;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
    & > div {
      height: 100%;
    }
  }
  // header和footer固定高度
  .header {
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid @editor-border-color;
    height: 55px;
    overflow: hidden;
  }
  .footer {
    box-sizing: border-box;
    position: relative;
    height: 45px;
    border-top: 1px solid @editor-border-color;
    overflow: hidden;
  }
  .content {
    box-sizing: border-box;
    height: calc(100vh - 140px);
    &.fullscreen {
      height: calc(100vh - 100px);
    }
    .content-in {
      height: 100%;
    }
    overflow: hidden;
  }
}
</style>


<style lang="less">
.operation-bar {
  .icon {
    padding: 4px;
    border-radius: 2px;
    cursor: initial;
    &:hover {
      background: @editor-button-hover-color;
    }
    &.disabled {
      color: @editor-gray-color!important;
    }
  }
}
</style>