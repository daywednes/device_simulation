<template lang="pug">
.node(:class="[selected(), node.name] | kebab", :style="{opacity: node.data.importance, background : node.data.color ?'#008837' : '#FF8837'}")
  .row
    // Inputs
    .input(v-for='input in inputs()')
      Socket(v-socket:input="input", type="input", :socket="input.socket")
      .input-title(v-show='!input.showControl()') 
      .input-control(
        v-show='input.showControl()'
        v-control="input.control"
      )
    //- img.image(:src="require('../../../../assets/images/npm.svg')")
    .title  {{node.name}}
    // Outputs
    .output(v-for='output in outputs()')
      .output-title
      Socket(v-socket:output="output", type="output", :socket="output.socket")
  .row(vertical)
    //- a.shield-container(:href="'https://www.npmjs.com/package/'+node.data.name" target="_blank")
    //-   img.shield(:src="'https://img.shields.io/npm/v/'+node.data.name+'.svg'")
    
    .name  {{'Organization: ' +node.data.org.name}}
    .name  {{'Zone: ' +(node.data.zone ? node.data.zone.name : "")}}
    .name  {{'Lable: ' +node.data.tags}}
</template>

<script>
import VueRender from 'rete-vue-render-plugin';

export default {
  mixins: [VueRender.mixin],
  components: {
    Socket: VueRender.Socket
  }
}
</script>

<style lang="sass" scoped>
$color: #008837
$color2: #FF8837
  
.node
  border-radius: 0
  border: none
  .row
    min-width: 350px
    display: flex
    &[vertical]
      flex-direction: column
  &:hover
    background: $color
  .image
    height: 100px
    width: 230px
    flex: 1
  .inputs, .outputs
    margin-top: 1em
  .name
    white-space: break-spaces
    text-align: left
    color: white
    font-size: 24px
    margin: 0.2em 0.7em
  .title
    white-space: break-spaces
    text-align: center
    color: white
    font-size: 36px
    width: 100%
    margin: 0.2em 0.7em
  .shield-container
    padding: 0 1em
    .shield
      display: block
      margin: 1em auto
      height: 40px
</style>
