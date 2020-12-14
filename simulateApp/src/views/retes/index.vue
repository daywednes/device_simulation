<template lang="pug">
.example
  //- Info(:item="example")
  CommonFunction(
    style='position: absolute;bottom:0%',
    :isShowDeploy='true',
    @functionDeploy='fn_deploy'
  )

  //- .components 
  //-   .viewer(ref="viewer")
  .view(ref="viewer")
    div(style='margin-top: 20px;', ref='view')
    div(ref='extra')
    
  el-button(
    type="primary"
    style='position: absolute; width: 150px; right: 250px; top:0%',
    prefix-icon='el-icon-search',
    @click="saveChangesAutomation"
  ) Save Changes
  el-input.inline-input(
    placeholder='search...',
    autofocus,
    style='position: absolute; width: 200px; right: 30px; top:0%',
    prefix-icon='el-icon-search',
    v-model='searchText'
  )
  el-select( slot="prepend",
    style='position: absolute; width: 200px; right: 30px; top:50px',
    v-model='filterText')
    el-option(value='ALL') ALL  
    el-option(value='Devices') Devices
    el-option(value='Zones') Zones
    el-option(value='Events') Events
    el-option(value='Actions') Actions
    el-option(value='Logic') Logic
</template>

<script>
import Vue from 'vue';
import CommonFunction from '@/components/CommonFunction';
import { getDevices } from '@/api/device';
import { getZones } from '@/api/zone';
import { updateAutomation } from '@/api/automations';
import store from '@/store';
import Components from '@/views/retes/rete/components/customdevice';

import initViewer from './Examples/list/customdock';

export default {
  beforeDestroy: function() {
    this.saveChangesAutomation();
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  watch: {
    searchText(val) {
      this.searchDevice(val);
    },
    filterText(val) {
      this.searchDevice(this.searchText);
    },
    editorData(val, old) {
      this.resetInterval();
    },
    async componentsList(vals) {
      this.componentsListTmp.map(item => {
        let itemName = item.name.toLowerCase().replace(/\s/g, '-');
        let className = 'node ' + itemName.replace(/\s/g, '-');

        var x = document.getElementsByClassName(className);
        if (vals.includes(item)) {
          x[x.length - 1].style.contentVisibility = 'visible';
        } else {
          x[x.length - 1].style.contentVisibility = 'hidden';
        }
      });
    },
  },
  methods: {
    resetInterval() {
      if (this.autoSaveChecked) {
        if (this.runInterval) {
          clearInterval(this.runInterval);
        }
        this.runInterval = setInterval(this.saveChangesAutomation, 5000);
      }
    },
    async init() {
      this.$refs.view.innerHTML = '';
      this.$refs.extra.innerHTML = '';

      if (this.editor) {
        await this.editor.destroy();
      }
      if (this.engine) {
        await this.engine.destroy();
        await this.engine.abort();
      }

      const { editor, engine } = await initViewer(
        this.$refs.view,
        this.$refs.extra,
      );

      this.editor = editor;
      this.engine = engine;

      if (this.componentsListTmp.length < 1) {
        await getDevices(store.getters.orgId).then(response => {
          this.$store.dispatch('user/updateDevices', response);
          response
            // .filter(x => x.zone == null)
            .map(item => {
              item.type = 'Devices';
              item.color = null;
              let tmpCom = new Components.DeviceComponent(item);

              this.editor.register(tmpCom);
              this.engine.register(tmpCom);
            });

          this.componentsListTmp = response;
        });

        await getZones(store.getters.orgId).then(response => {
          this.$store.dispatch('user/updateZones', response);
          response
            // .filter(x => x.zone == null)
            .map(item => {
              // item.name = item.name +' - '+ this.item.name;
              item.name = item.name;
              item.type = 'Zones';
              item.color = '1';
              let tmpCom = new Components.ZoneComponent(item);

              this.editor.register(tmpCom);
              this.engine.register(tmpCom);
            });

          this.componentsListTmp = [...this.componentsListTmp, ...response];
        });
      }
      this.editor.fromJSON(JSON.parse(this.item.data));
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

      Vue.$wamp.publish('com.myapp.addAvailableDevice', [
        JSON.stringify(modes[this.counter % 3]),
      ]);
      this.counter = this.counter + 1;

      //let msg = 'Hello World from Nest App ' + this.counter;
      //Vue.$wamp.publish('com.myapp.hello', [msg]);
      //this.counter = this.counter + 1;
    },
    searchDevice(txt) {
      if (this.filterText != 'ALL') {
        this.componentsList = this.componentsListTmp.filter(
          device =>
            (this.filterText == 'ALL' || device.type == this.filterText) &&
            (device.name
              .trim()
              .toUpperCase()
              .includes(txt.toUpperCase()) ||
              (device.zone
                ? device.zone.name
                    .trim()
                    .toUpperCase()
                    .includes(txt.toUpperCase())
                : false)),
          // ||
          // device.description.toUpperCase().includes(txt.toUpperCase()) ||
          // device.tags
          //   .map(tag => tag.trim().toUpperCase())
          //   .includes(txt.toUpperCase())
        );
      } else if (txt && txt.length > 0) {
        this.componentsList = this.componentsListTmp.filter(
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
              : false),
          // ||
          // device.description.toUpperCase().includes(txt.toUpperCase()) ||
          // device.tags
          //   .map(tag => tag.trim().toUpperCase())
          //   .includes(txt.toUpperCase())
        );
      } else {
        this.componentsList = this.componentsListTmp;
      }
    },
    saveChangesAutomation() {
      this.item.data = JSON.stringify(this.editor.toJSON());
      updateAutomation(this.item)
        .then(() => {
          this.$message({
            type: 'success',
            message: 'Save Automation changes completed',
          });
        })
        .catch(() => {
          this.$message.error('Oops, this is a error save changes.');
        });

      clearInterval(this.runInterval);
    },
  },
  data() {
    return {
      editor: null,
      engine: null,
      counter: 1,
      searchText: '',
      filterText: 'ALL',
      componentsListTmp: [],
      componentsList: [],
      autoSaveChecked: true,
      runInterval: null,
    };
  },
  computed: {
    editorData() {
      if (this.editor == null) {
        return null;
      }

      return this.editor.toJSON();
    },
  },
  mounted() {
    this.init();
  },
  updated() {
    // this.init();
  },
  components: {
    CommonFunction,
  },
};
</script>
<style>
.ivu-card-bordered {
  margin: 30px 0px;
}
</style>

<style lang="sass" scoped>
@import './assets/styles/media.sass'

.example
  display: flex
  width: 100%
  padding: 3vh 0px
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
    width: 120%
    max-height: 140vh
    min-height: 80vh
    margin: 0px
    +phone
      max-height: 60vh
</style>
