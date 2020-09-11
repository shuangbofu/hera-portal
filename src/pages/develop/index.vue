<template>
  <div class="container">
    <a-layout>
      <a-layout-header class="header">
        <main-header />
        <my-icon type="bpp-icon-edit-search" />
      </a-layout-header>
      <a-layout-content class="content">
        <main-content>
          <template v-slot:left-side>
            <left-side />
          </template>
          <template v-slot:right-side>
            <right-side />
          </template>
          <template v-slot:left>
            <content-left class="content-in" />
          </template>
          <template v-slot:center>
            <content-main class="content-in" />
          </template>
          <template v-slot:right>
            <right-attached class="content-in" />
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
import MainHeader from "./main/header";
import MainFooter from "./main/footer";
import MainContent from "./main/content";
import LeftSide from "./side/left";
import RightSide from "./side/right";
import ContentLeft from "./content/left";
import ContentMain from "./content/main";
import RightAttached from "./content/right";
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
  components: {
    MainHeader,
    MainFooter,
    MainContent,
    LeftSide,
    RightSide,
    ContentLeft,
    ContentMain,
    RightAttached,
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
.container {
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
    border-bottom: 1px solid @editor-border-color;
    height: 45px;
  }
  .footer {
    height: 45px;
    border-top: 1px solid @editor-border-color;
  }
  .content {
    height: calc(100vh - 130px);
    .content-in {
      height: calc(100vh - 130px);
    }
    overflow: hidden;
  }
}
</style>