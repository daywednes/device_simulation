<template>
  <span class="ellipsis-text">
    <el-tooltip
      v-if="showToolTip"
      effect="dark"
      placement="left"
      :open-delay="0"
    >
      <div style="max-width: 200px" slot="content">{{ value }}</div>
      <span>{{ value }}</span>
    </el-tooltip>
    <span v-if="!showToolTip">{{ value }}</span>
  </span>
</template>
<script>
import { Tooltip } from "element-ui";

export default {
  name: "EllipsisText",
  components: {
    [Tooltip.name]: Tooltip
  },
  props: {
    value: {
      required: true
    },
    showToolTip: {
      default: true,
      type: Boolean,
      required: false
    }
  }
};
</script>
