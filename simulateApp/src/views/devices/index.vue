<template>
  <div class="components-container">
    <div
      style="postion: relative; margin-left: 5px; float:left;"
      :style="{
        width: this.isShowLeft ? 'calc(100% - 700px)' : '100%',
      }"
    >
      <!-- transition: this.isShowLeft ? '0.2s ease' : '0.6s ease', -->
      <CommonFunction
        style="float: left; margin-left: 10px; text-align: left; width:100%;"
        :isShowADD="true"
        :isShowDELETE="false"
        @functionAddPage="
          () => {
            showDialogDevices = true;
            getTagsList();
          }
        "
        @functionDeletePage="fn_delete"
      /><el-input
        placeholder="Type something"
        prefix-icon="el-icon-search"
        v-model="textSearch"
      >
      </el-input>
      <SingleDevice
        @click.native="fn_compoClick(device)"
        style="margin: 15px;"
        v-for="device in devicesList"
        :key="device.id"
        :item="device"
      />
      <el-dialog title="New Device" :visible.sync="showDialogDevices">
        <el-form class="login-form-log" autocomplete="on" label-position="left">
          <el-form-item prop="DeviceName">
            <span style="margin-left:10px;font-size: large;"> Name</span>
            <el-input
              ref="DeviceName"
              v-model="DeviceForm.name"
              style="color: black;"
              placeholder="Device Name"
              name="DeviceName"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-form-item prop="description">
            <span style="margin-left:10px;font-size: large;"> Description</span>
            <el-input
              ref="DeviceType"
              v-model="DeviceForm.description"
              style="color: black;"
              placeholder="Device Description"
              name="DeviceType"
              type="text"
              tabindex="2"
              autocomplete="on"
            />
          </el-form-item>
          <el-form-item prop="tagsName">
            <span style="margin-left:10px;font-size: large;">
              Tags Of Device
            </span>
            <el-select
              v-model="DeviceForm.tagsName"
              multiple
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in optionsTag"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-button
            type="primary"
            style="width:100%;margin-bottom:10px;"
            @click="createDeviceEntity"
            >Create Device</el-button
          >
        </el-form>
      </el-dialog>
    </div>
    <RightPanelExtra
      :showLeft="isShowLeft"
      @leftPanelIsShow="leftPanelIsShow"
      @leftPanelIsHide="leftPanelIsHide"
    >
      <div class="tab-container">
        <el-tabs v-model="editableTabsValue" type="border-card">
          <el-tab-pane name="1" label="Details">
            <keep-alive>
              <DeviceDetails
                ref="deviceDetails"
                :item="selectedDevice"
                @refreshUI="refreshUI"
              />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </div>
    </RightPanelExtra>
  </div>
</template>
<style scoped>
.el-select {
  width: 300px;
}
</style>
<script>
import RightPanelExtra from '@/components/RightPanelExtra';
import DeviceDetails from '@/views/devices/DeviceDetails';
import SingleDevice from '@/components/SingleDevice';
import CommonFunction from '@/components/CommonFunction';
import FontResizableContainer from '@/components/FontResizableContainer';
import UltimateTable from '@/components/UltimateTable';
import { mapGetters } from 'vuex';
import { getDevices, createDevice, deleteDevice } from '@/api/device';
import { getTags } from '@/api/tags';

export default {
  name: 'Devices',
  components: {
    CommonFunction,
    UltimateTable,
    SingleDevice,
    RightPanelExtra,
    DeviceDetails,
  },
  data() {
    return {
      textSearch: '',
      DeviceForm: {
        name: '',
        DeviceType: '',
        DeviceLabel: '',
        description: '',
        tags: '',
        tagsName: '',
        orgId: '',
      },
      showDialogDevices: false,
      editableTabsValue: '1',
      isShowLeft: false,
      tableConfig: [
        {
          adding: false,
          updating: false,
          uploading: false,
          loading: false,
          lockingPopup: false,
          total: 0,
          page: 1,
          limit: 20,
        },
      ],
      tableData: [
        {
          attr: 'Created',
          label: 'Created time',
          permission: 'READ',
          width: 250,
        },
        { attr: 'Name', label: 'Name', width: 250 },
        { attr: 'Asset', label: 'Asset type', width: 250 },
        { attr: 'Label', label: 'Label', width: 250 },
        { attr: 'Customer', label: 'Customer', width: 250 },
        { attr: 'Public', label: 'Public', width: 250 },
        { attr: 'addrId', permission: 'N' },
        { attr: '_index', permission: 'N' },
        { attr: '_checked', permission: 'N' },
      ],
      multipleSelection: [],
      optionsTag: [],
      devicesList: [],
      devicesListTmp: [],
      queryCondition: { ...DEFAULT_SEARCH_QUERY },
      ds_master: [],
      ds_commonCode: {},
      selectedDevice: {
        name: '',
        DeviceType: '',
        DeviceLabel: '',
        description: '',
        tags: '',
        orgId: '',
        zoneId: '',
      },
      uploadProgress: { ...DEFAULT_PROGRESS },
    };
  },
  mounted: function() {
    this.getDevicesList(this.orgId);
  },
  watch: {
    orgId(val, old) {
      this.DeviceForm.orgId = val;
      this.getDevicesList(val);
    },
    textSearch(val, old) {
      this.searchDevice(val);
    },
  },
  computed: {
    orgId() {
      if (this.$store.getters.orgId == null) {
        this.$alert('empty');
      }

      this.DeviceForm.orgId = this.$store.getters.orgId;
      return this.$store.getters.orgId;
    },
  },
  methods: {
    getTagsList() {
      getTags().then(response => {
        this.optionsTag = response;
      });
    },
    searchDevice(txt) {
      if (txt && txt.length > 0) {
        this.devicesList = this.devicesListTmp.filter(
          device =>
            device.name.trim().toUpperCase().includes(txt.toUpperCase()) ||
            device.description.trim().toUpperCase().includes(txt.toUpperCase()) ||
            device.tags
              .map(tag => tag.trim().toUpperCase())
              .includes(txt.toUpperCase()),
        );
      } else {
        this.devicesList = this.devicesListTmp;
      }
    },
    leftPanelIsShow: function() {
      this.isShowLeft = true;
    },
    leftPanelIsHide: function() {
      this.isShowLeft = false;
    },
    checkDuplicate: function(row) {
      // NetworkService.NETWORK.validateDeviceCode(row.deviceCd).then(res => {
      //   if (!isGtoResponseSuccess(res)) {
      //     return false;
      //   }
      //   row._checked = true;
      //   return true;
      // });
      return true;
    },
    fn_select: function() {},
    fn_init: function() {
      this.uploadProgress = { ...DEFAULT_PROGRESS };
      this.multipleSelection = [];
      this.queryCondition = { ...DEFAULT_SEARCH_QUERY };
      this.ds_master = [];
      this.ds_master2 = [];
      this.selectedDevice = null;
      this.tableConfig = [
        {
          adding: false,
          updating: false,
          uploading: false,
          loading: false,
          total: 0,
          page: 1,
          limit: 20,
        },
        { adding: false, updating: false, loading: false },
      ];
    },
    fn_add: function(item) {
      // item.isCreate = true;
      // this.tableConfig[0].lockingPopup = true;
      // NetworkService.NETWORK.createShippingLocation(item).then(res => {
      //   this.tableConfig[0].lockingPopup = false;
      //   if (!isGtoResponseSuccess(res)) {
      //     return;
      //   }
      //   this.fn_select();
      //   this.tableConfig[0].adding = false;
      // });
    },
    fn_delete: function() {},
    fn_export: function() {
      let date = new Date();
      exportByDataModel(
        this.ds_master,
        this.tableData,
        `[DeviceS]_[${date.getFullYear()}${date.getMonth() +
          1}${date.getDate()}]`,
      );
    },
    fn_rowClick: function(currentRow) {
      this.selectedDevice = currentRow;
    },
    fn_compoClick: function(item) {
      this.selectedDevice = item;
      this.isShowLeft = true;
    },
    fn_findRoute: function(command) {},
    createDeviceEntity() {
      if (!this.DeviceForm.orgId && this.DeviceForm.orgId.length < 1) {
        this.$alert('Please create Organization first');
      }

      if (!this.DeviceForm.name || this.DeviceForm.name.length < 1) {
        this.$alert('Please input name');
        return;
      }
      if (
        !this.DeviceForm.description ||
        this.DeviceForm.description.length < 1
      ) {
        this.$alert('Please input description');
        return;
      }
      createDevice(this.DeviceForm).then(response => {
        this.refreshUI();
      });
    },
    getDevicesList(val) {
      getDevices(val).then(response => {
        response.forEach(row => {
          row.zoneId = row.zone ? row.zone.id : null;
          row.orgId = row.org ? row.org.id : null;
        });

        this.devicesListTmp = response;
        this.devicesList = this.devicesListTmp;
        
        this.$store.dispatch('user/updateDevices', response);
      });
    },
    refreshUI() {
      this.DeviceForm.name = '';
      this.textSearch = '';
      this.DeviceForm.description = '';
      this.DeviceForm.tagsName = '';
      this.getDevicesList(this.orgId);
      this.isShowLeft = false;
      this.showDialogDevices = false;
    },
  },
};
const DEFAULT_SEARCH_QUERY = {
  ctKey: null,
  logGrpCd: null,
  loadId: null,
  loadDesc: null,
  equipTyp: null,
  strdDate: null,
  customerId: null,
  carrierId: null,
  COMMON_PARAM: {
    startIndex: 0,
    pageSize: 100,
    sortConditions: [],
    orCondition: false,
  },
};
const DEFAULT_ITEM = {
  orgId: -1,
  zoneId: -1,
  _index: -1,
  _checked: false,
};
const DEFAULT_PROGRESS = {
  showed: false,
  percent: 0,
  message: '',
};
</script>
