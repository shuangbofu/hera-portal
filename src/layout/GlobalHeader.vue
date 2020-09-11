<template>
  <a-layout-header :class="[headerTheme, 'admin-header']">
    <div class="admin-header-wide">
      <router-link to="/" class="logo">
        <img style="height: 40px; margin: 0 10px;" :src="logo" />
      </router-link>
      <div class="admin-header-menu">
        <i-menu
          style="height: 40px; line-height: 40px; white-space: break-spaces;"
          :theme="headerTheme"
          class="head-menu"
          mode="horizontal"
          :collapsed="collapsed"
          :options="menuData"
          @select="onSelect"
        />
      </div>
      <div :class="['admin-header-right', headerTheme]">
        <my-icon
          :class="['theme-toggle-button', [headerTheme]]"
          :type="`hera_icon_${{'light':'moon','night':'sun'}[headerTheme]}`"
          @click="$store.commit('setting/setTheme', {...theme, mode: {'light':'night','night':'light'}[headerTheme]})"
        />
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import lightLogo from "@/assets/logo_light.png";
import nightLogo from "@/assets/logo_night.png";
import IMenu from "./menu";
import { mapState } from "vuex";
let menuData = [];
export default {
  props: ["collapsed"],
  data() {
    return {
      menuData,
    };
  },
  components: {
    IMenu,
  },
  computed: {
    headerTheme() {
      return this.theme.mode;
    },
    ...mapState("setting", ["theme"]),
    logo() {
      const mode = this.theme.mode;
      if (mode == "light") {
        return lightLogo;
      }
      return nightLogo;
    },
  },
  beforeCreate() {
    menuData = this.$router.options.routes.find((item) => item.path === "/")
      .children;
  },
  methods: {
    toggleCollpased() {
      this.$emit("toggleCollpased");
    },
    onSelect() {},
  },
};
</script>

<style lang="less" scoped>
@import "index";
.trigger {
  font-size: 20px;
  line-height: 55px;
  padding: 0 16px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #ff6347;
  }
}
</style>
<style lang="less">
.ant-menu-horizontal > .ant-menu-item,
.ant-menu-horizontal > .ant-menu-submenu {
  font-size: 12px;
}

.ant-menu {
  border-bottom: 1px solid @editor-border-color!important;
  .ant-menu-item {
    border-bottom: 2px solid transparent !important;
    padding: 0 10px !important;
    & > a::before {
      bottom: 0 !important;
    }
  }
  &.ant-menu-dark .ant-menu-item-selected,
  .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
    background-color: transparent !important;
    a,
    a:hover {
      color: #ffffff !important;
      font-weight: bold;
    }
  }
}
</style>