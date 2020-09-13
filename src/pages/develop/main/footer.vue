<template>
  <div class="container">
    <tabs
      class="tabs"
      mode="horizontal"
      :tabs="tabs.bottom"
      :active="bottomTab.name"
      @change="v => changeTab(v.name, 'bottom')"
    />
  </div>
</template>

<script>
import Tabs from "../components/tabs";
import commonMixin from "@/mixins/common";
export default {
  mixins: [commonMixin],
  components: { Tabs },
};
</script>

<style lang="less" scoped>
.container {
  .tabs {
    padding-left: 24px;
    height: 25px;
  }
}
</style>