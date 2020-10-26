<template>
  <div
    v-show="visible"
    class="menu"
    :style="{
      top: top,
      left: left,
    }"
  >
    <div>选项</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      top: "",
      left: "",
    };
  },
  methods: {
    show() {
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