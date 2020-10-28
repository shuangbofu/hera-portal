<template>
  <div
    v-if="visible"
    class="menu"
    :style="{
      top: top,
      left: left,
    }"
  >
    <a-menu slot="overlay" size="small">
      <template v-for="menu in menus">
        <a-sub-menu
          class="sub-menu"
          v-if="menu.children && menu.children.length > 0"
          :key="menu.title"
        >
          <span slot="title">{{ menu.title }}</span>
          <a-menu-item
            class="menu-item"
            v-for="m in menu.children"
            :key="m.title"
            @click="onClick(menu.title)"
          >
            {{ m.title }}
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item
          class="menu-item"
          :key="menu.title"
          @click="onClick(menu.title)"
          v-else
        >
          {{ menu.title }}
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>


<script>
/**
 * 两层菜单。。
 */
function str2Menu(arr) {
  return arr.map((i) => {
    let res = i;
    if (!(i instanceof Object)) {
      res = {
        title: i,
      };
    }
    return {
      ...res,
      children: str2Menu(res.children || []),
    };
  });
}
export default {
  data() {
    return {
      visible: false,
      top: "",
      left: "",
      menus: [],
      obj: {},
    };
  },
  components: {},
  methods: {
    show(menus, obj) {
      this.menus = str2Menu(menus);
      this.visible = true;
      this.obj = obj;
      this.left = event.clientX + 10 + "px";
      this.top = event.clientY + "px";
      document.addEventListener("click", this.foo);
      // document.addEventListener("contextmenu", this.foo);
    },
    foo() {
      this.visible = false;
      document.removeEventListener("click", this.foo);
      // document.removeEventListener("contextmenu", this.foo);
    },
    onClick(v) {
      this.$emit("click", { order: v, obj: this.obj });
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
  // background: @editor-bg-color;
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
</style>
<style lang="less">
.menu {
  .ant-menu {
    background: @editor-bg-color!important;
    border-right: none !important;
  }

  .ant-divider-horizontal {
    margin: 2px 0 !important;
  }
  .menu-item,
  .sub-menu > .ant-menu-submenu-title {
    background: @editor-bg-color!important;
    margin: 0 !important;
    height: 25px !important;
    line-height: 26px !important;
    font-size: 13px;
    &:hover {
      background: @editor-tree-active-color!important;
      color: #ffffff;
      .ant-menu-submenu-arrow {
        &::before,
        &::after {
          background: #ffffff !important;
        }
      }
    }
  }
}
</style>