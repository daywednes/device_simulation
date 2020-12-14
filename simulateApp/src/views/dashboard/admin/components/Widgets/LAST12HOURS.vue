<template>
  <div
    class="chart-wrapper"
    style="color:white; height:300px; 
    overflow: auto; background: #333333;"
  >
    LAST 12 HOURS
    <br />
    <img v-if="lasthourimg" :src="lasthourimg" />
  </div>
</template>

<script>
import lasthourBG from '@/assets/img_src/lasthour_bg.png';
export default {
  data() {
    return {
      lasthourimg: lasthourBG,
    };
  },
};
</script>
