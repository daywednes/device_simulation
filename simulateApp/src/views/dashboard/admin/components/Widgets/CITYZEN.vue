<template>
  <div>
    <div class="chart-wrapper">
      CITYZEN

      <div style="height:280px; overflow-x: auto;">
        <el-row
          :gutter="32"
          v-for="(item, index) of items"
          :key="index"
          style="width: 95%;
            text-align: left; margin: 10px; "
        >
          <el-col :xs="20" :sm="20" :lg="20">
           <p> {{ item.status }}</p>
            {{ item.name }}
           <p> {{ item.address }}</p>
          </el-col>
          <el-col :xs="4" :sm="4" :lg="4">
            {{ item.time }}
          </el-col>
          <!-- <hr
            style=" position: absolute;left: 0;bottom: 0;width: 100%;margin: 0;"
          /> -->
        </el-row>
        more
      </div>
    </div>
  </div>
</template>
<style scoped>
p{
    font-size: small;
    color: darkgray;
    font-weight: 400;
}
</style>

<script>
import logoSimpleThings from '@/assets/img_src/simple_things_logo.png';
export default {
  data() {
    return {
      logo: logoSimpleThings,
      items: [
        {
          address: 'Front-door Address',
          name: 'Front-door',
          status: 'Opened',
          time: '1:22p',
        },
        {
          address: 'Bedroom Address',
          name: 'Bedroom',
          status: 'Closed',
          time: '2:34p',
        }
      ],
    };
  },
};
</script>
