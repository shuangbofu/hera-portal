<template>
  <div :class="[theme.mode, 'container']">
    <div
      v-for="t in tabs.left"
      :key="t.name"
      :class="{'tab':true,'active': tab.left.name === t.name}"
      @click="changeTab(t.name, 'left')"
    >
      <div class="label">
        {{t.label}}
        <my-icon class="icon" :type="`hera_icon_${t.icon}`" />
      </div>
    </div>
  </div>
</template>

<script>
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
};
</script>

<style lang="less" scoped>
@import "tab";
</style>