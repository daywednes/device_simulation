<template>
  <div class="board-column">
    <!-- <div class="board-column-header">
      <i class="el-icon-edit" />
      {{ headerText }}
    </div> -->
    <draggable
      :list="list"
      v-bind="$attrs"
      class="board-column-content"
      :set-data="setData"
      :move="checkMove"
      @start="dragEvent(true)"
      @end="dragEvent(false)"
    >
      <!-- <div v-for="element in list" :key="element.id" class="board-item">
        {{ element.name }} {{ element.id }}
      </div> -->
      <!-- <SingleDevice
        style="margin: 15px;"
        v-for="device in list"
        :key="device.id"
        :item="device"
      /> -->
      <el-row
        :gutter="32"
        style="margin:10px 5px; width:95%; border-radius: 20px;"
        :style="{
          background: item.availableDevices > 0 ? 'white' : '#ffa9a9',
        }"
        class="chart-wrapper"
        v-for="item in list"
        :key="item.name"
      >
        <!-- <component :is="item.component" /> -->
        <el-col :xs="8" :sm="8" :lg="8">
          <img v-if="logo" :src="logo" style="float: left; height: 50px;" />
        </el-col>
        <el-col :xs="16" :sm="16" :lg="16">
          {{ item.name }}
          <br />
          {{ item.component }}
          <br />
          Available : {{ item.availableDevices }}
        </el-col>
        <!-- <hr
            style=" position: absolute;left: 0;bottom: 0;width: 100%;margin: 0;"
          /> -->
      </el-row>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import SingleDevice from '@/components/SingleDevice';
import logoSimpleThings from '@/assets/img_src/simple_things_logo.png';

export default {
  name: 'DragKanbanDemo',
  components: {
    draggable,
    SingleDevice,
  },
  data() {
    return {
      logo: logoSimpleThings,
    };
  },
  watch: {
    list(val, old) {
      // this.resetInterval();
    },
  },
  computed: {
    isDrag() {
      return this.$store.getters.isDrag;
    },
    isSetup() {
      return this.$store.getters.isSetup;
    },
  },
  props: {
    headerText: {
      type: String,
      default: 'Header',
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    dragEvent(value) {
      this.$store.dispatch('user/setIsDrag', value);
    },
    checkMove: function(evt) {
      if(this.isSetup){
        //  this.$alert('Please finish setup device.');
        return false;
      }

      if (
        (!evt.draggedContext.element.availableDevices &&
          evt.draggedContext.element.availableDevices == 0)
      ) {
        return false;
      }
      return true;
    },
    resetInterval: function() {
      // this.$emit('fn_resetInterval');
    },
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '');
    },
  },
};
</script>
<style lang="scss" scoped>
.chart-wrapper {
  background: #fff;
  padding: 20px 0px 20px 0px;
  text-align-last: left;
  font-weight: bold;
  font-size: medium;
}
.board-column {
  margin: 10px 0px;
  min-width: 200px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: transparent;
  border-radius: 3px;
  width: 100%;
  overflow: auto;
  height: 50vh;

  .board-column-header {
    height: 75px;
    line-height: 75px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
    font-size: 24px;
    text-align: start;
  }

  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: block;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .board-item {
      cursor: pointer;
      width: 260px;
      height: 64px;
      margin: 5px;
      float: left;
      background-color: #fff;
      text-align: left;
      line-height: 54px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
