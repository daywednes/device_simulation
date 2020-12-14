<template>
  <div class="chart-wrapper" style="height:140px;">
    SECURITY SENSORS
    <br />
    <div style="
    width: 100%;
    justify-content: center;
    overflow: auto;
    display: inline-flex;">
      <div
        v-for="(item, index) of items"
        :key="index"
        style=" text-align: center; margin: 10px 20px; float: left;"
      >
        <el-row>
          <img v-if="logo" :src="logo" style=" height: 35px;" />
        </el-row>
        <el-row>
          {{ item.name }}
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import logoSimpleThings from '@/assets/img_src/simple_things_logo.png';
export default {
  data() {
    return {
      logo: logoSimpleThings,
      items: [
        {
          icon: 'doors',
          name: 'doors',
        },
        {
          icon: 'windows',
          name: 'windows'
        },
        {
          name: 'motion',
          icon: 'motion'
        },
        {
          name: 'locks',
          icon: 'locks'
        },
        {
          name: 'cameras',
          icon: 'cameras',
          
        },
      ],
    };
  },
};
</script>
