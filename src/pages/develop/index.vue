<template>
  <div class="develop-container">
    <a-layout>
      <a-layout-header class="header">
        <main-header />
        <my-icon type="bpp-icon-edit-search" />
      </a-layout-header>
      <a-layout-content class="content">
        <main-content>
          <template v-slot:left-side>
            <tabs
              :tabs="tabs.left"
              :active="leftTab.name"
              @change="v => changeTab(v.name, 'left')"
            />
          </template>
          <template v-slot:right-side>
            <tabs
              :tabs="tabs.right"
              :active="rightTab.name"
              @change="v => changeTab(v.name, 'right')"
            />
          </template>
          <template v-slot:left>
            <content-left class="content-in" />
          </template>
          <template v-slot:center>
            <content-center class="content-in">
              <job-editor />
            </content-center>
          </template>
          <template v-slot:right>
            <right-attached class="content-in" />
          </template>
          <template v-slot:bottom>
            <footer-attached class="contnet-in" />
          </template>
        </main-content>
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
import MainHeader from "./main/header";
import MainFooter from "./main/footer";
import MainContent from "./main/content";
import ContentLeft from "./content/left";
import ContentCenter from "./content/center";
import RightAttached from "./content/right";
import FooterAttached from "./content/footer";
import JobEditor from './editor/index'

export default {
  mixins: [commonMixin],
  components: {
    MainHeader,
    MainFooter,
    MainContent,
    ContentLeft,
    ContentCenter,
    RightAttached,
    FooterAttached,
    Tabs,
    JobEditor
  },
  created() {
    this.initLocalInfo();
    this.initJobs();
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
    position: relative;
    border-bottom: 1px solid @editor-border-color;
    height: 45px;
    overflow: hidden;
  }
  .footer {
    position: relative;
    height: 45px;
    border-top: 1px solid @editor-border-color;
    overflow: hidden;
  }
  .content {
    height: calc(100vh - 130px);
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
    &:hover {
      background: @editor-button-hover-color;
    }
  }
}
</style>