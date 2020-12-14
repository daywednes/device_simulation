<template>
  <div
    class=" common-function"
    style="text-align:right;
    display: inline-block;
    margin-left: 10px;
    float:right;"
  >
    <slot></slot>
    <!-- <el-button
      v-if="isShowFAVORITE"
      class="filter-item"
      type="primary"
      icon="el-icon-star-on"
      @click="fn_favorite()"
    >FAVORITE</el-button>-->
    <el-button
      v-if="isShowSEARCH"
      class="filter-item"
      type="primary"
      icon="el-icon-search"
      @click="fn_select()"
      >SEARCH</el-button
    >
    <el-button
      v-if="isShowEXCELDOWN"
      class="filter-item"
      type="primary"
      icon="el-icon-document-copy"
      @click="fn_excel()"
      >EXCELDOWN</el-button
    >
    <el-button
      v-if="isShowINIT"
      class="filter-item"
      type="primary"
      icon="el-icon-refresh-right"
      @click="fn_init()"
      >INIT</el-button
    >
    <el-button
      v-if="isShowDeploy"
      class="filter-item"
      type="primary"
      icon="el-icon-video-play"
      @click="fn_deploy()"
      >Deploy</el-button
    >
    <el-button
      v-if="isShowAllDistances"
      class="filter-item"
      type="primary"
      icon="el-icon-share"
      :disabled="isDisableAllDistances"
      @click="fn_calAllDistance()"
      >AllDistances</el-button
    >
    <el-button
      v-if="isShowLoad"
      class="filter-item"
      type="primary"
      icon="el-icon-video-play"
      :disabled="isDisableLoad"
      @click="fn_load()"
      >DispViewLoadBtn</el-button
    >
    <el-button
      v-if="isShowADD"
      class="filter-item"
      type="primary"
      icon="el-icon-plus"
      :disabled="isDisableAdd"
      @click="fn_add()"
      >ADD</el-button
    >
    <el-button
      v-if="isShowEdit"
      class="filter-item"
      type="primary"
      icon="el-icon-edit"
      :disabled="isDisableEdit"
      @click="fn_edit()"
      >EDIT</el-button
    >
    <el-button
      v-if="isShowDELETE"
      class="filter-item"
      type="primary"
      icon="el-icon-delete-solid"
      :disabled="isDisableDelete"
      @click="fn_delete()"
      >DELETE</el-button
    >
    <el-button
      v-if="isShowLoadDistance"
      class="filter-item"
      type="primary"
      icon="el-icon-video-play"
      :disabled="isDisableLoadDistance"
      @click="fn_loadDistance()"
      >EngineLoadRealDistBtn</el-button
    >
    <el-button
      v-if="isShowViewMap"
      class="filter-item"
      type="primary"
      icon="el-icon-map-location"
      :disabled="isDisableViewMap"
      @click="fn_pushMap()"
      >DispViewViewMapBtn</el-button
    >
    <el-button
      v-if="isShowViewChart"
      class="filter-item"
      type="primary"
      icon="el-icon-pie-chart"
      :disabled="isDisableViewChart"
      @click="fn_showChart()"
      >DispViewViewChartBtn</el-button
    >
    <el-button
      v-if="isShowImport"
      class="filter-item"
      type="primary"
      icon="el-icon-upload2"
      @click="fn_import()"
      >DispViewImportBtn</el-button
    >
    <el-button
      v-if="isShowRouteCompare"
      class="filter-item"
      type="primary"
      icon="el-icon-cherry"
      :disabled="isDisableRouteCompare"
      @click="fn_routeCompare()"
      >CompareSRouteBtn</el-button
    >
    <el-button
      v-if="isShowExport"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="fn_export()"
      :disabled="isDisableExport"
      >DispViewExportBtn</el-button
    >
    <el-button
      v-if="isShowSAVE"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="fn_save()"
      >SAVE</el-button
    >
    <el-button
      v-if="isShowLoadDefaultSetting"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="fn_loadDefaultSetting()"
      >LOADDEFAULTSETTING</el-button
    >
    <el-button
      v-if="isShowAnalyze"
      class="filter-item"
      type="primary"
      icon="el-icon-video-play"
      @click="fn_analyze()"
      >Analyze</el-button
    >
    <el-button
      v-if="isShowChangeCenter"
      class="filter-item"
      type="primary"
      icon="el-icon-video-play"
      @click="fn_changeCenter()"
      >ChangeShipmentCenter</el-button
    >
    <el-dropdown
      class="filter-item"
      split-button
      type="primary"
      v-if="isShowCalculate"
      @command="fn_calculateAll"
      @click="fn_calculate"
    >
      DispViewCalcCoordBtn
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="all">CalculateAll</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown
      class="filter-item"
      split-button
      type="primary"
      v-if="isShowFindRoute"
      @command="fn_findRoute"
    >
      FindRoute
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="all">FindRouteAll</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button
      v-if="isShowCLOSE"
      class="filter-item"
      type="primary"
      icon="el-icon-close"
      @click="fn_close()"
      >CLOSE</el-button
    >
  </div>
</template>

<script>
import { addClass, removeClass } from '@/utils';
import nestutils from '@/utils/nest-utils';

export default {
  name: 'CommonFunction',
  props: {
    isShowFAVORITE: {
      default: false,
      type: Boolean,
    },
    isShowEXCELDOWN: {
      default: false,
      type: Boolean,
    },
    isShowADD: {
      default: false,
      type: Boolean,
    },
    isShowDELETE: {
      default: false,
      type: Boolean,
    },
    isShowSAVE: {
      default: false,
      type: Boolean,
    },
    isShowCLOSE: {
      default: false,
      type: Boolean,
    },
    isShowINIT: {
      default: false,
      type: Boolean,
    },
    isShowSEARCH: {
      default: false,
      type: Boolean,
    },
    isShowImport: {
      default: false,
      type: Boolean,
    },
    isShowExport: {
      default: false,
      type: Boolean,
    },
    isDisableExport: {
      default: false,
      type: Boolean,
    },
    isShowLoadDistance: {
      default: false,
      type: Boolean,
    },
    isShowLoad: {
      default: false,
      type: Boolean,
    },
    isShowCalculate: {
      default: false,
      type: Boolean,
    },
    isShowFindRoute: {
      default: false,
      type: Boolean,
    },
    isShowDeploy: {
      default: false,
      type: Boolean,
    },
    isShowViewMap: {
      default: false,
      type: Boolean,
    },
    isDisableViewMap: {
      default: false,
      type: Boolean,
    },
    isShowViewChart: {
      default: false,
      type: Boolean,
    },
    isDisableViewChart: {
      default: false,
      type: Boolean,
    },
    isShowAnalyze: {
      default: false,
      type: Boolean,
    },
    isShowEdit: {
      default: false,
      type: Boolean,
    },
    isShowChangeCenter: {
      default: false,
      type: Boolean,
    },
    isShowAllDistances: {
      default: false,
      type: Boolean,
    },
    isDisableAllDistances: {
      default: false,
      type: Boolean,
    },
    isShowRouteCompare: {
      default: false,
      type: Boolean,
    },
    isDisableRouteCompare: {
      default: false,
      type: Boolean,
    },
    isDisableLoadDistance: {
      default: false,
      type: Boolean,
    },
    isDisableEdit: {
      default: false,
      type: Boolean,
    },
    isDisableDelete: {
      default: false,
      type: Boolean,
    },
    isDisableAdd: {
      default: false,
      type: Boolean,
    },
    isDisableLoad: {
      default: false,
      type: Boolean,
    },
    isShowLoadDefaultSetting: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      showLeft: true,
    };
  },
  computed: {
    userloginInfo() {
      return null;
    },
    webScenarioID() {
      return this.$store.getters.webScenarioID;
    },
  },
  methods: {
    checkPermission: function() {
      return true;
    },

    fn_favorite: function() {
      this.$emit('functionFavoritePage');
    },
    fn_excel: function() {
      this.$emit('functionExcelPage');
    },
    fn_select: function() {
      this.$emit('functionSearchPage');
    },
    fn_init: function() {
      this.$emit('functionInitPage');
    },
    fn_add: function() {
      if (this.checkPermission()) {
        this.$emit('functionAddPage');
      }
    },
    fn_edit: function() {
      if (this.checkPermission()) {
        this.$emit('functionEditPage');
      }
    },
    fn_delete: function() {
      if (this.checkPermission()) {
        this.$emit('functionDeletePage');
      }
    },
    fn_save: function() {
      if (this.checkPermission()) {
        this.$emit('functionSavePage');
      }
    },
    fn_import: function() {
      if (this.checkPermission()) {
        this.$emit('functionImportPage');
      }
    },
    fn_export: function() {
      this.$emit('functionExportPage');
    },
    fn_loadDistance: function() {
      this.$emit('functionLoadDistancePage');
    },
    fn_load: function() {
      this.$emit('functionLoadPage');
    },
    fn_calculateAll: function(command) {
      if (this.checkPermission()) {
        this.$emit('functionCalculateAllPage');
      }
    },
    fn_calculate: function() {
      if (this.checkPermission()) {
        this.$emit('functionCalculatePage');
      }
    },
    fn_findRoute: function(command) {
      this.$emit('functionFindRoute', command);
    },
    fn_changeCenter: function(command) {
      this.$emit('functionChangeCenter', command);
    },
    fn_analyze: function(command) {
      this.$emit('functionAnalyze', command);
    },
    fn_deploy: function(command) {
      this.$emit('functionDeploy', command);
    },
    fn_pushMap: function(command) {
      this.$emit('functionPushMap', command);
    },
    fn_showChart: function(command) {
      this.$emit('functionShowChart', command);
    },
    fn_calAllDistance: function(command) {
      if (this.checkPermission()) {
        this.$emit('functionCalAllDistances');
      }
    },
    fn_routeCompare: function(command) {
      this.$emit('funcitonRouteCompare', command);
    },
    fn_close: function() {
      this.$store.dispatch('tagsView/delSelectedView').then(() => {
        let latestView = this.$store.state.tagsView.visitedViews.slice(-1)[0];
        if (latestView) {
          this.$router.push(latestView.fullPath);
        } else {
          // now the default is to redirect to the home page if there is no tags-view,
          // you can adjust it according to your needs.
          if (latestView == null || latestView === undefined) {
            this.$router.push('/');
          } else if (latestView.name === 'Dashboard') {
            // to reload home page
            this.$router.replace({ path: '/redirect' + view.fullPath });
          } else {
            this.$router.push('/');
          }
        }
      });
    },
    fn_loadDefaultSetting: function() {
      this.$emit('functionLoadDefaultSetting');
    },
  },
};
</script>
