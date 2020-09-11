<template>
  <global-layout>
    <transition name="page-toggle">
      <router-view />
    </transition>
  </global-layout>
</template>

<script>
import GlobalLayout from "@/layout/GlobalLayout";
export default {
  components: { GlobalLayout }
};
</script>

<style lang="less">
.page-toggle-enter-active {
  transition: all 0.2s ease-in 0.25s;
}
.page-toggle-leave-active {
  transition: all 0.2s ease-out 0s;
}
.page-toggle-enter,
.page-toggle-leave-to {
  opacity: 0;
  padding: 0px;
}
</style>