<template>
  <div class="container">
    <div class="operation-container operation-bar">
      <h-select
        style="width: 60px; margin-right: 10px"
        v-model="dayNum"
        :options="dayNumOptions"
        @change="fetchDataAndShow(type)"
      />
      <a-radio-group
        size="small"
        :options="[
          { label: '下游', value: 'down' },
          { label: '上游', value: 'up' },
        ]"
        v-model="type"
        @change="fetchDataAndShow(type)"
      />

      <a-radio-group
        style="margin-left: 10px"
        size="small"
        :options="[
          { label: '横向', value: 'LR' },
          { label: '纵向', value: 'TB' },
        ]"
        v-model="rankdir"
        @change="fetchDataAndShow(type)"
      />
    </div>
    <div class="text-container">
      <span v-if="hoverNode"
        >{{ hoverNode.remark }}
        <span v-if="hoverNode.remark === 'start_node'"
          >, 鼠标放在节点上查看执行情况</span
        ></span
      >
    </div>
    <div class="graph-container">
      <slot>
        <svg class="graph" id="graph" height="100%" width="100%">
          <g />
        </svg>
      </slot>
    </div>
  </div>
</template>

<script>
const dayNumOptions = [
  { label: "今天", value: 0 },
  { label: "昨天", value: 1 },
  { label: "前天", value: 2 },
  { label: "三天前", value: 3 },
  { label: "四天前", value: 4 },
  { label: "五天前", value: 5 },
  { label: "六天前", value: 6 }
  // { label: "一周前", value: 7 }
];
import * as d3 from "d3";
import dagreD3 from "dagre-d3";
const render = new dagreD3.render();
import HSelect from "@/components/HSelect";
import { fetchJobGraphdata } from "@/api/develop";

//根据状态获得颜色 from 原hera
function getColor(auto, status) {
  // 判断是否关闭，0表示关闭，特殊颜色显示
  if (auto == null) {
    return "#bd16ff";
  } else if (auto == 0) {
    return "#919191";
  } else if (status.includes("success"))
    // return "#37b55a";
    return "#60A766";
  else if (status.includes("running")) return "#f5c66f";
  // return "#f0ab4e";
  // else return "#f77";
  return "#D6595D";
}

function distinct(arr, k) {
  let result = [];
  let t = {};
  for (let obj of arr) {
    if (!t[obj[k]]) {
      result.push(obj);
      t[obj[k]] = 1;
    }
  }
  return result;
}

const cache = {};
export default {
  name: "dependency-graph",
  props: {
    jobId: {
      reuqire: true,
      type: [String, Number]
    },
    graphName: {
      require: false,
      default: () => "graph",
      type: String
    }
  },
  data() {
    return {
      dayNumOptions,
      dayNum: 0,
      edges: [],
      nodes: [],
      hoverNode: null,
      type: "down",
      rankdir: "TB", // LR
      visible: false
    };
  },
  mounted() {
    this.cacheDraw();
  },
  watch: {
    jobId: function() {
      this.cacheDraw();
    },
    hoverNode: function(val) {
      this.save2Cache(val, "hoverNode");
    },
    type: function(val) {
      this.save2Cache(val, "type");
    },
    dayNum: function(val) {
      this.save2Cache(val, "dayNum");
    },
    rankdir: function(val) {
      this.save2Cache(val, "rankdir");
    }
  },
  components: { HSelect },
  methods: {
    getInitTranslateValue(graph) {
      const rankdir = this.rankdir;
      return {
        height: rankdir === "TB" ? 20 : graph.height / 2 - 20,
        width: rankdir === "LR" ? 20 : graph.width / 2 - 20
      };
    },
    save2Cache(val, k) {
      let node = cache[this.jobId];
      if (node) {
        node[k] = val;
      }
    },
    cacheDraw() {
      const c = cache[this.jobId];
      if (c) {
        this.draw(c.nodes, c.edges);
        this.hoverNode = c.hoverNode;
        this.type = c.type;
        this.dayNum = c.dayNum;
        this.rankdir = c.rankdir;
      } else {
        this.hoverNode = null;
        this.dayNum = 0;
        const dom = document.querySelector(`#${this.graphName} g`);
        while (dom.firstChild) {
          dom.removeChild(dom.firstChild);
        }
        this.fetchDataAndShow(this.type);
      }
    },
    fetchDataAndShow(type) {
      if (!type) {
        return;
      }
      this.type = type;
      fetchJobGraphdata(this.jobId, type === "up" ? 0 : 1, this.dayNum).then(
        data => {
          // up nodeB -> nodeA
          // down nodeA -> nodeB
          const edges = data.edges.map(i => {
            return {
              source: type === "up" ? i.nodeB.nodeName : i.nodeA.nodeName,
              target: type === "up" ? i.nodeA.nodeName : i.nodeB.nodeName
            };
          });

          const nodes = data.edges
            .map(i => {
              return [i.nodeA, i.nodeB];
            })
            .flatMap(i => i)
            .map(i => {
              return {
                label: i.nodeDesc,
                id: i.nodeName,
                style: `fill: ${getColor(i.auto, i.remark)}`,
                class: "graph-node",
                remark: i.remark
              };
            });
          this.draw(distinct(nodes, "id"), edges);
          this.edges = edges;
          this.nodes = nodes;
          this.hoverNode = nodes.find(i => i.id === 0);
          cache[this.jobId] = {
            edges,
            nodes,
            type: this.type,
            hoverNode: this.hoverNode,
            dayNum: this.dayNum,
            rankdir: this.rankdir
          };
        }
      );
    },
    draw(nodes, edges) {
      var g = new dagreD3.graphlib.Graph()
        .setGraph({
          rankdir: this.rankdir
          //  rankdir: "LR"
        })
        .setDefaultEdgeLabel(() => {
          return {};
        });
      nodes.forEach(item => g.setNode(item.id, item));
      edges.forEach(item => g.setEdge(item.source, item.target, {}));
      var svg = d3.select(`#${this.graphName}`),
        inner = svg.select("g");

      //缩放
      var zoom = d3
        .zoom()
        .on("zoom", () => inner.attr("transform", d3.event.transform));
      svg.call(zoom);

      render(inner, g);
      svg.call(zoom.transform, d3.zoomIdentity.translate(20, 20).scale(0.75));

      inner.selectAll(".graph-node").on("mousemove", e => {
        this.hoverNode = nodes.find(i => i.id === Number(e));
      });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  background-color: @editor-bg-color;
  .operation-container {
    display: flex;
    height: 40px;
    padding: 7px;
  }
  .text-container {
    padding: 2px;
    height: 80px;
    min-height: 80px;
    font-size: 10px;
    overflow: auto;
    background-color: @base-bg-color;
    border-top: 1px solid @editor-border-color;
  }
  .graph-container {
    padding: 10px;
    background-color: @editor-bg-color;
    height: calc(100% - 120px);
    width: 100%;
    border-top: 1px solid @editor-border-color;
  }
}
</style>
<style lang="less">
.operation-container {
  .ant-radio-wrapper {
    font-size: 10px;
    margin-right: 4px;
    span.ant-radio + * {
      padding-right: 2px;
      padding-left: 2px;
    }
  }
}
.graph {
  font-size: 14px;
  .node rect {
    stroke: #606266;
    stroke-width: 1;
    // fill: #fff;
  }
  .graph-node {
    rect {
    }
    text {
    }
  }

  .edgePath path {
    stroke: #606266;
    fill: #333;
    stroke-width: 1.5px;
  }
}
</style>