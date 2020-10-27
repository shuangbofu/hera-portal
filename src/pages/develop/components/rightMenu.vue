<template>
  <div
    v-show="visible"
    class="menu"
    :style="{
      top: top,
      left: left,
    }"
  >
    <div>
      <a-menu slot="overlay" size="small">
        <template v-for="menu in menus">
          <a-menu-item :key="menu.title" v-show="!menu.dic || (dic && menu.dic)"
            >{{ menu.title }}
          </a-menu-item>
          <a-divider :key="`${menu.title}-`" v-if="menu.divider && dic" />
        </template>
      </a-menu>
    </div>
  </div>
</template>

<script>
const menus = [
  { title: "新建文件夹", dic: true },
  { title: "新建任务", dic: true, divider: true },
  { title: "重命名" },
  { title: "移动" },
  { title: "删除" },
];
export default {
  data() {
    return {
      visible: false,
      top: "",
      left: "",
      dic: false,
      menus,
    };
  },
  methods: {
    show(isDic) {
      this.dic = isDic;
      this.visible = true;
      this.left = event.clientX + 20 + "px";
      this.top = event.clientY - 10 + "px";
      document.addEventListener("click", this.foo);
    },
    foo() {
      this.visible = false;
      document.removeEventListener("click", this.foo);
    },
  },
};
</script>

<style lang="less">
.menu {
  user-select: none;
  // width: 100px;
  min-width: 80px;
  width: auto;
  background-color: #f4f4f4;
  position: fixed;
  background: #fff;
  z-index: 999;
  // box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.2);
  // box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  background: @editor-bg-color;
  border: 1px solid @editor-border-color;
}

.menu .link {
  &:hover {
    background-color: #f0f8ff;
    color: inherit;
  }
  cursor: pointer;
  height: 40px;
  font-size: 14px;
  line-height: 24px;
  padding: 10px;
  display: block;
  color: #444;
  padding: 8px 16px;
  border-bottom: 1px solid #f9f9f9;
}
.ant-menu-vertical > .ant-menu-item,
.ant-menu-vertical-left > .ant-menu-item,
.ant-menu-vertical-right > .ant-menu-item,
.ant-menu-inline > .ant-menu-item,
.ant-menu-vertical > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-vertical-left > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-vertical-right > .ant-menu-submenu > .ant-menu-submenu-title,
.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  height: 25px !important;
  line-height: 25px !important;
}
.ant-menu-vertical .ant-menu-item:not(:last-child),
.ant-menu-vertical-left .ant-menu-item:not(:last-child),
.ant-menu-vertical-right .ant-menu-item:not(:last-child),
.ant-menu-inline .ant-menu-item:not(:last-child) {
  margin-bottom: 2px;
}
.ant-divider-horizontal {
  margin: 2px 0 !important;
}
</style>