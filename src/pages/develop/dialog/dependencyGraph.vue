<template>
  <a-modal
    v-if="jobId"
    wrapClassName="run-option-dialog"
    :visible="visible"
    @cancel="close"
    width="90%"
    :closable="false"
    :mask="true"
    :destroyOnClose="true"
    :centered="true"
    :footer="null"
  >
    <dependency-graph
      ref="dg"
      style="height: calc(90vh - 80px)"
      :jobId="jobId"
      :modal="true"
      graphName="graph2"
    >
      <svg class="graph" id="graph2" height="100%" width="100%">
        <g />
      </svg>
    </dependency-graph>
  </a-modal>
</template>

<script>
import DependencyGraph from "../job/dependencyGraph";
export default {
  data() {
    return {
      visible: false,
      jobId: null
    };
  },
  components: {
    DependencyGraph
  },
  methods: {
    show(jobId) {
      this.jobId = jobId;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.dg.cacheDraw();
      });
    },
    close() {
      this.jobId = null;
      this.visible = false;
    }
  }
};
</script>

<style>
</style>