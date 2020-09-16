<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
import themeUtil from "@/utils/themeUtil";
import { mapState, mapMutations } from "vuex";

moment.locale("zh-cn");
export default {
  name: "App",
  data() {
    return {
      zh_CN,
    };
  },
  created() {
    document.cookie =
      "HERA_Token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzc29JZCI6IjIwIiwic3NvX25hbWUiOiJmc2IiLCJhdWQiOiIyZGZpcmUiLCJpc3MiOiJoZXJhIiwiZXhwIjoxNjAwNDE4NjA1LCJ1c2VySWQiOiIyMCIsImlhdCI6MTYwMDE1OTQwNSwidXNlcm5hbWUiOiJoZXJhIn0.ZRUh2pk3JrE0xlunb3EEqZBJLX9VAtLmbPAZ-fT1gIY";
    let theme = localStorage.getItem("theme");
    if (theme) {
      theme = JSON.parse(theme);
      this.setTheme(theme);
    }
  },
  computed: {
    ...mapState("setting", ["theme"]),
  },
  watch: {
    "theme.mode": function (val) {
      // let closeMessage = this.$message.loading(
      //   `您选择了主题模式 ${val}, 正在切换...`
      // );
      localStorage.setItem("theme", JSON.stringify(this.theme));
      themeUtil.changeThemeColor(this.theme.color, val);
      // .then(() => {
      //   setTimeout(closeMessage, 1000);
      // });
    },
    "theme.color": function (val) {
      // console.log(this.theme);
      // let closeMessage = this.$message.loading(
      //   `您选择了主题色 ${val}, 正在切换...`
      // );
      themeUtil.changeThemeColor(val, this.theme.mode);
      // .then(() => {
      //   setTimeout(closeMessage, 1000);
      // });
    },
  },
  methods: {
    ...mapMutations("setting", ["setTheme"]),
  },
};
</script>
<style lang="less">
:global {
  //页面切换动画
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
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  // color: #2c3e50;
}

// #nav {
//   padding: 30px;
// }

// #nav a {
//   font-weight: bold;
//   color: #2c3e50;
// }

// #nav a.router-link-exact-active {
//   color: #42b983;
// }
</style>
