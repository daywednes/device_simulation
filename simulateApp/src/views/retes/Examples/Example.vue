<template lang="pug">
.example
  el-input.inline-input(
    placeholder='search...',
    autofocus,
    style='position: absolute; width: 200px; left: 2%',
    prefix-icon='el-icon-search',
    v-model='searchText'
  )
  CommonFunction(
    style='position: absolute;',
    :isShowDeploy='true',
    @functionDeploy='fn_deploy'
  )

  .view
    div(style='margin-top: 20px 0px;', ref='view')
    div(ref='extra')
</template>

<script>
import Vue from 'vue';
import CommonFunction from '@/components/CommonFunction';
import { getDevices } from '@/api/device';
import store from '@/store';
import Components from '@/views/retes/rete/components/customdevice';

export default {
  watch: {
    searchText(val) {
      this.searchDevice(val);
    },
    async devicesList(vals) {
      this.$refs.view.innerHTML = '';
      this.$refs.extra.innerHTML = '';
      this.$refs.extra.className = '';
      // if (this.editor) {
      //   await this.editor.destroy();
      //   await this.editor.clear();
      // }
      // if (this.engine) {
      //   await this.engine.destroy();
      //   await this.engine.abort();
      // }

      this.editor = null;
      this.engine = null;
      const { editor, engine } = await this.example.init(
        this.$refs.view,
        this.$refs.extra,
      );

      this.editor = editor;
      this.engine = engine;
      vals.map(item => {
        let tmpCom = new Components.DeviceComponent(item);
        this.editor.register(tmpCom);
        // this.engine.register(tmpCom);
      });
    },
  },
  props: ['example'],
  methods: {
    async init() {
      this.$refs.view.innerHTML = '';
      this.$refs.extra.innerHTML = '';
      this.$refs.extra.className = '';

      if (this.editor) {
        await this.editor.destroy();
      }
      if (this.engine) {
        await this.engine.destroy();
        await this.engine.abort();
      }

      const { editor, engine } = await this.example.init(
        this.$refs.view,
        this.$refs.extra,
      );

      this.editor = editor;
      this.engine = engine;
      if (this.devicesListTmp.length < 1) {
        await getDevices(store.getters.orgId).then(response => {
          this.devicesListTmp = response;
          this.$store.dispatch('user/updateDevices', response);

          response
            // .filter(x => x.zone == null)
            .map(item => {
              let tmpCom = new Components.DeviceComponent(item);

              editor.register(tmpCom);
              engine.register(tmpCom);
            });
        });
      }
    },
    fn_deploy() {
      const modes = [
        [
          {
            from_device_id: '1',
            to_device_id: '2',
            interval: 1,
            rpc: {
              name: 'procedure1',
              parameters: ['faster'],
            },
          },
        ],
        [
          {
            from_device_id: '1',
            to_device_id: '2',
            interval: 2,
            rpc: {
              name: 'procedure1',
              parameters: ['normal'],
            },
          },
        ],
        [
          {
            from_device_id: '1',
            to_device_id: '2',
            interval: 3,
            rpc: {
              name: 'procedure1',
              parameters: ['slower'],
            },
          },
        ],
      ];

      Vue.$wamp.publish('com.myapp.hello', [
        JSON.stringify(modes[this.counter % 3]),
      ]);
      this.counter = this.counter + 1;

      //let msg = 'Hello World from Nest App ' + this.counter;
      //Vue.$wamp.publish('com.myapp.hello', [msg]);
      //this.counter = this.counter + 1;
    },
    searchDevice(txt) {
      if (txt && txt.length > 0) {
        this.devicesList = this.devicesListTmp.filter(
          device =>
            device.name
              .trim()
              .toUpperCase()
              .includes(txt.toUpperCase()) ||
            (device.zone
              ? device.zone.name
                  .trim()
                  .toUpperCase()
                  .includes(txt.toUpperCase())
              : false) ||
            // device.description.toUpperCase().includes(txt.toUpperCase()) ||
            device.tags
              .map(tag => tag.trim().toUpperCase())
              .includes(txt.toUpperCase()),
        );
      } else {
        this.devicesList = this.devicesListTmp;
      }
    },
  },
  data() {
    return {
      editor: null,
      engine: null,
      counter: 1,
      searchText: '',
      devicesListTmp: [],
      devicesList: [],
    };
  },
  mounted() {
    this.init();
  },
  updated() {
    // this.init();
  },
  components: {
    Info,
    CommonFunction,
  },
};
</script>

<style lang="sass" scoped>
@import '../assets/styles/media.sass'

.example
  display: flex
  max-width: 100%
  padding: 2vh 0
  flex-direction: row-reverse
  +phone
    flex-direction: column !important
  .title
    display: block
    font-size: 120%
    margin-bottom: 1em
  .view
    flex: 2
    position: relative
    overflow: hidden
    float: left
    max-height: 140vh
    min-height: 80vh
    margin: 0px
    +phone
      max-height: 60vh
</style>
