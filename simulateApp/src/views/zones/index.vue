<template>
  <div class="components-container">
    <div
      style="postion: relative; margin-left: 5px; float:left;"
      :style="{
        width: this.isShowLeft ? 'calc(100% - 700px)' : '100%',
      }"
    >
      <!-- transition: this.isShowLeft ? '0.2s ease' : '0.6s ease', -->
      <!-- <CommonFunction
        style="float: left; margin-left: 10px; text-align: left; width:100%;"
        :isShowADD="true"
        :isShowDELETE="false"
        @functionAddPage="showDialogZones = true"
        @functionDeletePage="fn_delete"
      />
      <el-input
        placeholder="Type something"
        prefix-icon="el-icon-search"
        v-model="textSearch"
      >
      </el-input> -->
      <!-- <div
        style="display: inline-flex; float: left; width: 100%;line-height: 36px;"
      >
        <el-input
          placeholder="Type something"
          prefix-icon="el-icon-search"
          style="width: 30%;"
          v-model="textSearch"
        >
        </el-input>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="fn_add()"
          >ADD</el-button
        >
      </div> -->
      <SingleZone
        @click.native="fn_compoClick(zone)"
        style="margin: 15px;"
        v-for="zone in zonesList"
        :key="zone.id"
        :item="zone"
      />
      <el-dialog title="New Zone" :visible.sync="showDialogZones">
        <el-form class="login-form-log" autocomplete="on" label-position="left">
          <el-form-item prop="ZoneName">
            <span style="margin-left:10px;font-size: large;"> Name</span>
            <el-input
              ref="ZoneName"
              v-model="ZoneForm.name"
              style="color: black;"
              placeholder="Zone Name"
              name="ZoneName"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-form-item prop="description">
            <span style="margin-left:10px;font-size: large;"> Description</span>
            <el-input
              ref="ZoneType"
              v-model="ZoneForm.description"
              style="color: black;"
              placeholder="Zone Description"
              name="ZoneType"
              type="text"
              tabindex="2"
              autocomplete="on"
            />
          </el-form-item>
          <el-button
            type="primary"
            style="width:100%;margin-bottom:10px;"
            @click="createZoneEntity"
            >Create Zone</el-button
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
              <ZoneDetails
                ref="zoneDetails"
                :item="selectedZone"
                @refreshUI="refreshUI"
              />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane name="2" label="List Devices">
            <keep-alive>
              <DevicesOfZone
                ref="devicesOfZone"
                :zone="selectedZone"
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
import DevicesOfZone from '@/views/zones/DevicesOfZone';
import ZoneDetails from '@/views/zones/ZoneDetails';
import SingleZone from '@/components/SingleZone';
import CommonFunction from '@/components/CommonFunction';
import FontResizableContainer from '@/components/FontResizableContainer';
import UltimateTable from '@/components/UltimateTable';
import { mapGetters } from 'vuex';
import { getZones, createZone, deleteZone } from '@/api/zone';

export default {
  name: 'Zones',
  components: {
    CommonFunction,
    UltimateTable,
    SingleZone,
    RightPanelExtra,
    ZoneDetails,
    DevicesOfZone,
  },
  data() {
    return {
      textSearch: '',
      ZoneForm: {
        name: '',
        ZoneType: '',
        ZoneLabel: '',
        description: '',
        orgId: '',
      },
      showDialogZones: false,
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
      zonesList: [],
      zonesListTmp: [],
      queryCondition: { ...DEFAULT_SEARCH_QUERY },
      selectedZone: { ...DEFAULT_ITEM },
      ds_master: [],
      ds_commonCode: {},
      selectedZone: {
        name: '',
        ZoneType: '',
        ZoneLabel: '',
        description: '',
        orgId: '',
      },
      uploadProgress: { ...DEFAULT_PROGRESS },
    };
  },
  mounted: function() {
    this.getZonesList(this.orgId);
  },
  watch: {
    orgId(val, old) {
      this.ZoneForm.orgId = val;
      this.getZonesList(val);
    },
    textSearch(val, old) {
      this.searchZone(val);
    },
  },
  computed: {
    orgId() {
      if (this.$store.getters.orgId == null) {
        this.$alert('empty');
      }

      this.ZoneForm.orgId = this.$store.getters.orgId;
      return this.$store.getters.orgId;
    },
  },
  methods: {
    searchZone(txt) {
      if (txt && txt.length > 0) {
        this.zonesList = this.zonesListTmp.filter(
          zone =>
            zone.name
              .trim()
              .toUpperCase()
              .includes(txt.toUpperCase()) ||
            zone.description
              .trim()
              .toUpperCase()
              .includes(txt.toUpperCase()),
        );
      } else {
        this.zonesList = this.zonesListTmp;
      }
    },
    leftPanelIsShow: function() {
      this.isShowLeft = true;
    },
    leftPanelIsHide: function() {
      this.isShowLeft = false;
    },
    checkDuplicate: function(row) {
      // NetworkService.NETWORK.validateZoneCode(row.zoneCd).then(res => {
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
      this.selectedZone = null;
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
        `[ZoneS]_[${date.getFullYear()}${date.getMonth() +
          1}${date.getDate()}]`,
      );
    },
    fn_rowClick: function(currentRow) {
      this.selectedZone = currentRow;
    },
    fn_compoClick: function(item) {
      this.selectedZone = item;
      this.isShowLeft = true;
    },
    fn_findRoute: function(command) {},
    createZoneEntity() {
      if (!this.ZoneForm.orgId && this.ZoneForm.orgId.length < 1) {
        this.$alert('Please create Organization first');
      }
      if (!this.ZoneForm.name || this.ZoneForm.name.length < 1) {
        this.$alert('Please input name');
        return;
      }
      if (!this.ZoneForm.description || this.ZoneForm.description.length < 1) {
        this.$alert('Please input description');
        return;
      }
      createZone(this.ZoneForm).then(response => {
        this.refreshUI();
      });
    },
    getZonesList(val) {
      getZones(val).then(response => {
        this.zonesListTmp = response;
        this.zonesList = this.zonesListTmp;

        this.$store.dispatch('user/updateZones', response);
      });
    },
    refreshUI() {
      this.ZoneForm.name = '';
      this.ZoneForm.description = '';
      this.textSearch = '';
      this.getZonesList(this.orgId);
      this.isShowLeft = false;
      this.showDialogZones = false;
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
  _index: -1,
  _checked: false,
};
const DEFAULT_PROGRESS = {
  showed: false,
  percent: 0,
  message: '',
};
</script>
