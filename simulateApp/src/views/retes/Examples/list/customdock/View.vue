<template lang="pug">
Card.view()
  p(slot="title")
    Icon(type="md-list")
    |  Automations
  Button(slot="extra" shape="circle" size="small" icon="md-add" @click="addModule()")

  RadioGroup(v-model="module" vertical)
    Radio(v-for="(module, key) in modules" :key="key" :label="key" @click="openModule(key)")
      span {{key}}
</template>

<script>
import Vue from 'vue'

export default {
  props: ['editor', 'modules', 'resize'],
  data() {
    return {
      module: null
    }
  },
  watch: {
    async module(curr, prev) {
      if (prev) { this.modules[prev].data = this.editor.toJSON() }

      await this.editor.fromJSON(this.modules[curr].data)

      this.editor.trigger('process')
      this.resize()
    }
  },
  mounted() {
    this.module = 'Automation'
  },
  methods: {
    initialData() {
      return { id: 'retejs@0.1.0', nodes: {}}
    },
    addModule() {
      Vue.set(this.modules, 'Automation ' + Object.keys(this.modules).length + ' ', { data: this.initialData() })
      this.$forceUpdate()
    },
    openModule(name) {
      this.module = name
    }
  }
}
</script>

<style lang="sass" scoped>
.view
  position: absolute
  right: 0
  top: 0
  margin: 0
</style>
