<template>
  <div>
    <div style="height: 40px;">
      <router-link to="/">
        <img
          v-if="!collapsed"
          style="margin-left: 6px; user-select:none"
          src="@/assets/logo2.png"
          class="sidebar-logo"
        />
        <img v-else src="@/assets/logo_collapsed.png" />
      </router-link>
    </div>
    <i-menu
      style="height: 64px; line-height: 64px;"
      theme="light"
      :collapsed="collapsed"
      :menu-data="menuData"
      @select="onSelect"
    />
  </div>
</template>

<script>
import IMenu from "./menu";
let menuData = [];
export default {
  props: ["collapsed"],
  data() {
    return {
      menuData
    };
  },
  components: {
    IMenu
  },
  beforeCreate() {
    menuData = this.$router.options.routes.find(item => item.path === "/")
      .children;
  },
  methods: {
    onSelect() {}
  }
};
</script>

<style>
</style>
