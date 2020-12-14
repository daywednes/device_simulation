<template>
  <div class="dashboard-editor-container">
    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->

    <el-row
      style="background:#fff;padding:10px 10px;margin:10px 10px 10px 10px; text-align:right;"
    >
      <el-button
        v-if="!isEdited"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="isEdited = true"
        >Edit</el-button
      >
      <el-button
        v-if="isEdited"
        class="filter-item"
        type="primary"
        icon="el-icon-success"
        @click="isEdited = false"
        >Done</el-button
      >

      <!-- <el-checkbox v-model="isEdited">Edit</el-checkbox> -->
    </el-row>

    <RightPanel
      :showLeft="isEdited"
      @leftPanelIsShow="leftPanelIsShow"
      @leftPanelIsHide="leftPanelIsHide"
    >
      <div
        style="background: white; height:80vh; margin-top:10px; padding:10px; overflow:auto;"
      >
        <div
          @drag="drag(item)"
          @dragend="dragend(item)"
          draggable="true"
          unselectable="on"
          style="background: wheat; margin:20px;"
          class="chart-wrapper"
          v-for="item in widgetsList"
          :key="item.i"
        >
          <!-- <component :is="item.component" /> -->
          {{ item.i }}
        </div>
      </div>
    </RightPanel>
    <div id="content">
      <grid-layout
        ref="gridlayout"
        :style="{
          width: this.isEdited ? 'calc(100% - 300px)' : '100%',
          transition: 'all 1s cubic-bezier(0.7, 0.3, 0.1, 1)',
        }"
        :layout.sync="layout"
        :col-num="colNum"
        :row-height="160"
        :is-draggable="isEdited"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="true"
        :prevent-collision="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
      >
        <grid-item
          class="chart-wrapper"
          style="background: white"
          v-for="item of layout"
          :key="item.i"
          :static="item.isStatic"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
        >
          <component :is="item.component" />
          <span v-if="isEdited" class="remove" @click="removeItem(item.i)"
            >x</span
          >
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script>
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};

let mouseXY = { x: null, y: null };
let DragPos = { x: null, y: null, w: 2, h: 2, i: 'Drag' };

import RightPanel from '@/components/RightPanelExtra';
import weatherBG from '@/assets/img_src/weather_bg.png';
import logoSimpleThings from '@/assets/img_src/simple_things_logo.png';
import lasthourBG from '@/assets/img_src/lasthour_bg.png';
import VueGridLayout from 'vue-grid-layout';
import LAST12HOURS from './components/Widgets/LAST12HOURS';
import WEATHER from './components/Widgets/WEATHER';
import LASTESTACTIVITY from './components/Widgets/LASTESTACTIVITY';
import ADDDEVICES from './components/Widgets/ADDDEVICES';
import ADDAUTOMATION from './components/Widgets/ADDAUTOMATION';
import ZONES from './components/Widgets/ZONES';
import DISARMED from './components/Widgets/DISARMED';
import ARMBYPASS from './components/Widgets/ARMBYPASS';
import ARM from './components/Widgets/ARM';
import SECURITYSENSORS from './components/Widgets/SECURITYSENSORS';
import CITYZEN from './components/Widgets/CITYZEN';

export default {
  name: 'DashboardAdmin',

  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    LAST12HOURS,
    WEATHER,
    LASTESTACTIVITY,
    ADDDEVICES,
    ADDAUTOMATION,
    ZONES,
    DISARMED,
    ARM,
    ARMBYPASS,
    CITYZEN,
    SECURITYSENSORS,
    RightPanel,
  },

  mounted() {
    document.addEventListener(
      'dragover',
      function(e) {
        mouseXY.x = e.clientX;
        mouseXY.y = e.clientY;
      },
      false,
    );
  },

  data() {
    return {
      colNum: 5,
      isEdited: false,
      isEdited: false,
      dragItem: {},
      lineChartData: lineChartData.newVisitis,
      weatherimg: weatherBG,
      lasthourimg: lasthourBG,
      logo: logoSimpleThings,
      items: [
        {
          icon: 'Front-door',
          name: 'Front-door',
          status: 'Opened',
          time: '1:22p',
        },
        {
          icon: 'Front-door',
          name: 'Front-door',
          status: 'Closed',
          time: '2:34p',
        },
        {
          icon: 'Bedroom Window',
          name: 'Bedroom Window',
          status: 'Opened & Closed',
          time: '3:40p',
        },
        {
          icon: 'Drive Way',
          name: 'Face Detected',
          status: 'Opened',
          time: '5:22p',
        },
      ],
      layout: [
        {
          x: 0,
          y: 0,
          w: 2,
          h: 2,
          i: 'ARM',
          component: 'ARM',
          isStatic: true,
        },
        {
          x: 0,
          y: 2,
          w: 2,
          h: 1,
          i: 'SECURITY SENSORS',
          component: 'SECURITYSENSORS',
          isStatic: false,
        },
        {
          x: 0,
          y: 3,
          w: 2,
          h: 2,
          i: 'CITYZEN',
          component: 'CITYZEN',
          isStatic: false,
        },
        {
          x: 2,
          y: 0,
          w: 2,
          h: 1,
          i: 'WEATHER',
          component: 'WEATHER',
          isStatic: false,
        },
        {
          x: 2,
          y: 1,
          w: 2,
          h: 2,
          i: 'LASTEST ACTIVITY',
          component: 'LASTESTACTIVITY',
        },
        {
          x: 2,
          y: 3,
          w: 3,
          h: 2,
          i: 'LAST 12 HOURS',
          component: 'LAST12HOURS',
        },
        {
          x: 4,
          y: 0,
          w: 1,
          h: 1,
          i: 'ZONES',
          component: 'ZONES',
          isStatic: false,
        },
        {
          x: 4,
          y: 1,
          w: 1,
          h: 1,
          i: 'ADD DEVICES',
          component: 'ADDDEVICES',
          isStatic: false,
        },
        {
          x: 4,
          y: 2,
          w: 1,
          h: 1,
          i: 'ADD AUTOMATION',
          component: 'ADDAUTOMATION',
          isStatic: false,
        },
      ],
      widgetsList: [
        // {
        //   x: 0,
        //   y: 0,
        //   w: 2,
        //   h: 2,
        //   i: 'DISARMED',
        //   component: 'DISARMED',
        //   isStatic: true,
        // },
        // {
        //   w: 2,
        //   h: 2,
        //   i: 'ARM',
        //   component: 'ARM',
        //   isStatic: true,
        // },
        // {
        //   w: 2,
        //   h: 2,
        //   i: 'ARMBYPASS',
        //   component: 'ARMBYPASS',
        //   isStatic: true,
        // },
        {
          x: 0,
          y: 2,
          w: 2,
          h: 1,
          i: 'SECURITY SENSORS',
          component: 'SECURITYSENSORS',
          isStatic: false,
        },
        {
          x: 0,
          y: 3,
          w: 2,
          h: 2,
          i: 'CITYZEN',
          component: 'CITYZEN',
          isStatic: false,
        },
        {
          x: 2,
          y: 0,
          w: 2,
          h: 1,
          i: 'WEATHER',
          component: 'WEATHER',
          isStatic: false,
        },
        {
          x: 2,
          y: 1,
          w: 2,
          h: 2,
          i: 'LASTEST ACTIVITY',
          component: 'LASTESTACTIVITY',
        },
        {
          x: 2,
          y: 3,
          w: 3,
          h: 2,
          i: 'LAST 12 HOURS',
          component: 'LAST12HOURS',
        },
        {
          x: 4,
          y: 0,
          w: 1,
          h: 1,
          i: 'ZONES',
          component: 'ZONES',
          isStatic: false,
        },
        {
          x: 4,
          y: 1,
          w: 1,
          h: 1,
          i: 'ADD DEVICES',
          component: 'ADDDEVICES',
          isStatic: false,
        },
        {
          x: 4,
          y: 2,
          w: 1,
          h: 1,
          i: 'ADD AUTOMATION',
          component: 'ADDAUTOMATION',
          isStatic: false,
        },
      ],
    };
  },
  methods: {
    removeItem: function(val) {
      const index = this.layout.map(item => item.i).indexOf(val);
      this.layout.splice(index, 1);
    },
    leftPanelIsShow: function() {
      this.isEdited = true;
    },
    leftPanelIsHide: function() {
      this.isEdited = false;
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
    drag: function(item) {
      let parentRect = document
        .getElementById('content')
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (
        mouseInGrid === true &&
        this.layout.findIndex(item => item.i === 'drop') === -1
      ) {
        this.layout.push({
          x: (this.layout.length * 2) % (this.colNum || 5),
          y: this.layout.length + (this.colNum || 5), // puts it at the bottom
          w: item.w,
          h: item.h,
          i: 'drop',
        });
      }
      let index = this.layout.findIndex(item => item.i === 'drop');
      if (index !== -1) {
        try {
          this.$refs.gridlayout.$children[
            this.layout.length
          ].$refs.item.style.display = 'none';
        } catch {}
        let el = this.$refs.gridlayout.$children[index];
        el.dragging = {
          top: mouseXY.y - parentRect.top,
          left: mouseXY.x - parentRect.left,
        };
        let new_pos = el.calcXY(
          mouseXY.y - parentRect.top,
          mouseXY.x - parentRect.left,
        );
        if (mouseInGrid === true) {
          this.$refs.gridlayout.dragEvent(
            'dragstart',
            'drop',
            new_pos.x,
            new_pos.y,
            item.h,
            item.w,
          );
          DragPos.i = String(index);
          DragPos.x = this.layout[index].x;
          DragPos.y = this.layout[index].y;
          DragPos.w = item.w;
          DragPos.h = item.h;
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.dragEvent(
            'dragend',
            'drop',
            new_pos.x,
            new_pos.y,
            item.h,
            item.w,
          );
          this.layout = this.layout.filter(obj => obj.i !== 'drop');
        }
      }
    },
    dragend: function(item) {
      let parentRect = document
        .getElementById('content')
        .getBoundingClientRect();
      let mouseInGrid = false;
      if (
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (mouseInGrid === true) {
        this.$refs.gridlayout.dragEvent(
          'dragend',
          'drop',
          DragPos.x,
          DragPos.y,
          item.h,
          item.w,
        );
        this.layout = this.layout.filter(obj => obj.i !== 'drop');
        // UNCOMMENT below if you want to add a grid-item

        this.layout.push({
          x: DragPos.x,
          y: DragPos.y,
          w: item.w,
          h: item.h,
          i: DragPos.i,
          component: item.component,
          isStatic: item.isStatic,
        });
        // this.$refs.gridLayout.dragEvent(
        //   'dragend',
        //   DragPos.i,
        //   DragPos.x,
        //   DragPos.y,
        //   item.h,
        //   item.w,
        // );
        try {
          this.$refs.gridLayout.$children[
            this.layout.length
          ].$refs.item.style.display = 'block';
        } catch {}
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.remove {
  position: absolute;
  right: 2px;
  top: 0;
  cursor: pointer;
}
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 20px;
    text-align: center;
    font-weight: bold;
    font-size: large;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
