<template>
  <div>dashboard</div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState("setting", ["theme", "weekMode", "lang"]),
  },
  methods: {
    ...mapMutations("setting", ["setTheme"]),
  },
};
</script>

<style>
</style>