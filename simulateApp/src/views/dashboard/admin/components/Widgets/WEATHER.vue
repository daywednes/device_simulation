<template>
  <div
    class="chart-wrapper"
    style="color:white; 
    overflow: auto; height:130px; background: #101f3e;"
  >
    WEATHER
    <br />
    <img v-if="weatherimg" :src="weatherimg" style="height:80px;" />
  </div>
</template>

<script>
import weather_bg from '@/assets/img_src/weather_bg.png';
export default {
  data() {
    return {
      weatherimg: weather_bg,
    };
  },
};
</script>
