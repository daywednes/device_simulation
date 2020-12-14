<!--<template>
  <div :style="resizable" class="resizable">
    <slot> </slot>
  </div>
</template>-->
<script>
import store from "@/store";
export default {
  name: "FontResizableContainer",
  functional: true,
  props: {
    increment: {
      default: "0px",
      type: String,
      required: false
    },
    tag: {
      default: "div",
      type: String,
      required: false
    }
  },
  render: function(createElement, context) {
    let { tag, increment } = context.props;
    let resizable = Object.assign(
      {
        "--global-font-size": `calc(${store.getters.size} + ${increment})`
      },
      context.data.staticStyle
    );

    return createElement(
      tag,
      {
        attrs: {
          class: [context.data.staticClass, "resizable"].join(" "),
          style: Object.keys(resizable).map(k => `${k}: ${resizable[k]}`).filter(val => val).join(";")
        }
      },
      context.children
    );
  }
};
</script>
