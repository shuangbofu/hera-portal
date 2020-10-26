<template>
  <div v-show="visble" class="menu">
    <div>testddd</div>
  </div>
</template>

<script>
export default {
  // data() {
  //   return {
  //     visible: false,
  //   };
  // },
  props: ["visible"],
  watch: {
    visible(oldVal, newVal) {
      if (!oldVal && newVal) {
        const menu = document.querySelector(".menu");
        menu.style.left = event.clientX + 20 + "px";
        menu.style.top = event.clientY - 10 + "px";
        document.addEventListener("click", this.foo);
      } else if (oldVal && !newVal) {
        this.foo();
      }
    },
  },
  methods: {
    foo() {
      // this.visible = false;
      this.$emit("update:visible", false);
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
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  border-radius: 1px;
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