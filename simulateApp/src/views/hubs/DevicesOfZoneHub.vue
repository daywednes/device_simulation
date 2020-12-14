<template>
  <div>
    <CommonFunction
      :isShowINIT="false"
      :isShowADD="true"
      :isShowDELETE="true"
      :isShowEdit="false"
      @functionAddPage="fn_add"
      @functionEditPage="tableConfig[0].updating = true"
      @functionImportPage="tableConfig[0].uploading = true"
      @functionInitPage="fn_init"
      @functionDeletePage="removeFromZone"
      @functionExportPage="fn_export"
    />

    <div class="filter-container" style="float:left; width:100%">
      <!-- grid table -->
      <div
        style="postion: relative; margin-left: 5px; float:right; width:100%;"
      >
        <div class="label-title" style="min-height: 30px;">
          <el-col :span="12">
            <!-- <i class="icon el-icon-star-on" /> -->
            <!-- <FontResizableContainer tag="label" increment="4px" class="label">{{$t('LoadDispTitle')}}</FontResizableContainer> -->
          </el-col>
        </div>
        <UltimateTable
          :lockingPopup="tableConfig[0].lockingPopup"
          :progress="uploadProgress"
          :dataValue="ds_master"
          :dataModel="tableData"
          v-loading="tableConfig[0].loading"
          :rowKey="row => (row ? row._index : null)"
          :currentRowKey="selectedZone._index"
          :commonCodes="ds_commonCode"
          :adding="tableConfig[0].adding"
          :updating="tableConfig[0].updating"
          :uploading="tableConfig[0].uploading"
          :paginationData="tableConfig[0]"
          :permission="
            ['INSERT', selectedZone._index != -1 ? 'UPDATE' : ''].join('|')
          "
          :newItem="{
            _checked: false,
          }"
          @row-click="fn_rowClick"
          @stop-insert="tableConfig[0].adding = false"
          @stop-update="tableConfig[0].updating = false"
          @stop-upload="tableConfig[0].uploading = false"
          @on-paging="fn_select"
          @selection-change="handleSelectionChange"
        />
      </div>
      <!-- end grid table -->
    </div>
    <el-dialog
      :title="'Add device to zone' + this.zone.name"
      :visible.sync="showDialogDeviceList"
    >
      <el-form class="login-form-log" autocomplete="on" label-position="left">
        <el-select
          v-model="value"
          multiple
          filterable
          remote
          reserve-keyword
          style="width:300px;margin:10px;"
          placeholder="Please enter a keyword"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          style="width:30%;margin:10px;"
          @click="addDeviceToZone"
          >Add Device</el-button
        >
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import CommonFunction from '@/components/CommonFunction';
import FontResizableContainer from '@/components/FontResizableContainer';
import UltimateTable from '@/components/UltimateTable';
import {
  addToZone,
  removeFromZone,
  getDevicesByZone,
  getDevices,
  createDevice,
  deleteDevice,
} from '@/api/device';

export default {
  name: 'DevicesOfZoneHub',
  components: {
    FontResizableContainer,
    CommonFunction,
    UltimateTable,
  },
  props: {
    zone: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      options: [],
      value: [],
      list: [],
      loading: false,
      showDialogDeviceList: false,
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
        { attr: 'name', label: 'Name', width: 250 },
        { attr: 'description', label: 'Description', width: 250 },
        {
          attr: 'created',
          label: 'Created time',
          permission: 'READ',
          width: 250,
        },
        { attr: 'favoriteCount', label: 'Favorite Count', width: 250 },
        { attr: 'addrId', permission: 'N' },
        { attr: '_index', permission: 'N' },
        { attr: '_checked', permission: 'N' },
      ],
      multipleSelection: [],
      queryCondition: { ...DEFAULT_SEARCH_QUERY },
      selectedZone: { ...DEFAULT_ITEM },
      ds_master: [],
      ds_commonCode: {},
      uploadProgress: { ...DEFAULT_PROGRESS },
    };
  },
  mounted: function() {
    this.getDevicesByZoneList();
    this.getDevicesAvailList(this.orgId);
  },
  computed: {
    orgId() {
      if (this.$store.getters.orgId == null) {
        this.$alert('empty');
      }
      return this.$store.getters.orgId;
    },
  },
  watch: {
    orgId(val, old) {
      this.getDevicesAvailList(val);
      this.$emit('refreshUI');
    },
    zone(val, old) {
      this.getDevicesByZoneList();
    },
  },
  methods: {
    getDevicesAvailList(val) {
      this.options = [];
      this.value = [];
      getDevices(val).then(response => {
        this.list = response
          .filter(x => x.zone == null)
          .map(item => {
            return { value: item.id, label: item.name };
          });
      });
    },
    getDevicesByZoneList() {
      getDevicesByZone(this.zone.id).then(response => {
        this.ds_master = response;
      });
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
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
      this.selectedZone = { ...DEFAULT_ITEM };
      this.ds_master = [];
      this.ds_master2 = [];
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fn_add: function() {
      this.getDevicesAvailList(this.orgId);
      this.showDialogDeviceList = true;
    },
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
    fn_compoClick: function(currentRow) {
      this.isShowLeft = true;
    },
    addDeviceToZone() {
      if (!this.value || this.value.length < 1) {
        this.$alert('Please select device');
        return;
      }
      this.value.forEach(async element => {
        addToZone({ zoneId: this.zone.id, deviceId: element }).then(res => {
          this.getDevicesByZoneList();
        });
      });

      this.showDialogDeviceList = false;

      // addToZone({
      //   zoneId: this.zone.id,
      //   deviceIds: this.multipleSelection.map(a => a.foo),
      // }).then(() => {
      //   this.showDialogDeviceList = false;
      //   this.getDevicesByZoneList();
      // });
    },
    removeFromZone() {
      if (!this.multipleSelection || this.multipleSelection.length < 1) {
        this.$alert('Please select device');
        return;
      }
      this.multipleSelection.forEach(async element => {
        removeFromZone({ zoneId: this.zone.id, deviceId: element.id }).then(
          res => {
            this.getDevicesByZoneList();
          },
        );
      });
      this.showDialogDeviceList = false;

      // removeFromZone({
      //   zoneId: this.zone.id,
      //   deviceIds: this.multipleSelection.map(a => a.foo),
      // }).then(() => {
      //   this.showDialogDeviceList = false;
      //   this.getDevicesByZoneList();
      // });
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
