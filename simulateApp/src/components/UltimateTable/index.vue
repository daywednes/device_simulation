<template>
  <div>
    <el-table
      :data="dataValue"
      v-loading="loading"
      :max-height="maxHeight"
      :style="styleGrid"
      width="100%"
      @row-click="rowClick"
      @selection-change="selectionChange"
      @row-dblclick="rowDbClick"
      :row-key="rowKey"
      :current-row-key="currentRowKey"
      highlight-current-row
      border
    >
      <!-- Selection -->
      <el-table-column
        v-if="selection"
        type="selection"
        width="50px"
      ></el-table-column>
      <!-- Rows -->

      <template v-for="column in dataModel">
        <el-table-column
          show-overflow-tooltip
          v-if="
            hasPermission(column.permission || 'READ|INSERT|UPDATE', 'READ')
          "
          :width="column.width ? column.width : DEFAULT_WIDTH"
          :property="column.attr"
          :label="column.label"
          :key="column.attr"
        >
          <template slot-scope="{ row }">
            <EllipsisText :value="displayValue(row, column)" :showToolTip="false"/>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <pagination
      v-if="paging"
      :total="paginationData.total"
      :page.sync="paginationData.page"
      :limit.sync="paginationData.limit"
      @pagination="onPaging"
    />
    <el-dialog
      :title="title()"
      :visible.sync="showPopup"
      :before-close="closePopup"
      :width="popupSetting.width"
      :height="popupSetting.height"
      :append-to-body="true"
    >
      <div style="overflow: auto;">
        <!-- Popup Body -->
        <!-- Add and Edit form -->
        <el-form v-if="showPopup && !uploading" :model="tmpItem" :rules="buildRules()" ref="form">
          <template v-for="column in dataModel">
            <div
              v-if="
                hasPermission(
                  column.permission || 'READ|INSERT|UPDATE',
                  adding ? 'INSERT' : 'UPDATE'
                )
              "
              :key="column.attr"
              :style="
                `width: ${Math.floor(
                  100 / popupSetting.numberOfColumns
                )}%; float: left;`
              "
            >
              <el-form-item :label="column.label" :prop="attrConvert(column.attr)" :class="column.className">
                <template v-if="column.dataset">
                  <el-select v-model="tmpItem[attrConvert(column.attr)]" placeholder="">
                    <template v-if="commonCodes[column.dataset]">
                      <el-option
                        v-for="code of commonCodes[column.dataset]"
                        :key="code.SUBCD"
                        :value="code.SUBCD"
                        :label="code.CODENM"
                      />
                    </template>
                  </el-select>
                </template>
                <template v-else>
                  <el-input
                    v-model="tmpItem[attrConvert(column.attr)]"
                    v-if="
                      ['text', 'number', 'date'].includes(column.type || 'text')
                    "
                    :type="column.type || 'text'"
                    :required="
                      hasPermission(
                        column.permission,
                        adding ? 'INSERT*' : 'UPDATE*'
                      )
                    "
                    :disabled="hasPermission(
                        column.permission,
                        adding ? 'INSERT!' : 'UPDATE!'
                      )"
                    style="width: 200px; float: right; margin-right: 5px;"
                    class="filter-item"
                  />
                </template>
                <template v-if="column.buttons != undefined">
                  <el-button v-for="button in column.buttons"
                   :type="button.type || 'primary'"
                   :icon="button.icon" :key="button.text" 
                   :disabled="disabledButton(button)"
                   @click="onClickButton(button)">
                    {{button.text}}
                  </el-button>
                </template>
              </el-form-item>
            </div>
          </template>
          <div style="margin-right: 500px;">
          <!-- <template v-if="showRequired">
            EditFormRequiredField
          </template> -->
          </div>
        </el-form>
        <!-- End Add and Edit form -->

        <!-- Upload form -->
        <div v-if="showPopup && uploading">
          <label>FILENAME</label>
          <input type="file" 
            name="file" 
            v-on:change="onFileChange" 
            style="width: 200px;"
            class="filter-item"
            :disabled="lockingPopup"/>
            <template v-if="progress.showed">
              <el-progress :percentage="progress.percent" :color="progress.percent == 100 ? 'green' : 'orange'"></el-progress>
              <div style="text-align: center;">{{progress.message}}</div>
            </template>
        </div>
        <!-- End Upload form -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!uploading" :disabled="lockingPopup" @click="onSaveItem" type="primary" icon="el-icon-download">{{
         "Save"
        }}</el-button>
        <el-button v-if="uploading" :disabled="lockingPopup" @click="onUpload" type="primary" icon="el-icon-upload2">{{
          "Import"
        }}</el-button>
        <el-button @click="closePopup" :disabled="lockingPopup" type="danger" icon="el-icon-close">{{
          "Cancel"
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import EllipsisText from "@/components/EllipsisText";
import Pagination from "@/components/Pagination";
import nestutils from '../../utils/nest-utils';
import { hasPermission, val, sval, flattenObject, revertObject } from "@/utils/data-model-utils"
import { isNullOrEmpty } from '../../utils/validate';

export default {
  name: "UltimateTable",
  components: { Pagination, EllipsisText },
  props: {
    maxHeight: {
      default: "450px",
      type: String,
      required: false
    },
    dataValue: {
      type: Array,
      required: true
    },
    paging: {
      default: true,
      type: Boolean,
      required: false
    },
    paginationData: {
      default: () => ({
        total: 0,
        page: 0,
        limit: 0
      }),
      type: Object,
      required: false
    },
    popupSetting: {
      default: () => ({
        width: "50%",
        height: "80%",
        numberOfColumns: 2
      }),
      type: Object,
      required: false
    },
    dataModel: {
      default: [
        {
          attr: "",
          label: "",
          width: 0,
          dataset: "",
          formatter: () => {},
          permission: "READ|INSERT|UPDATE",
          type: "text"
        }
      ],
      type: Array,
      required: true
    },
    commonCodes: {
      type: Object,
      required: false
    },
    loading: {
      type: Boolean,
      required: false
    },
    rowKey: {
      default: row => {},
      type: Function,
      required: true
    },
    currentRowKey: {
      required: true
    },
    selection: {
      default: true,
      type: Boolean,
      required: false
    },
    permission: {
      default: "INSERT|UPDATE",
      type: String,
      required: false
    },
    adding: {
      default: false,
      type: Boolean,
      required: false
    },
    updating: {
      default: false,
      type: Boolean,
      required: false
    },
    uploading: {
      default: false,
      type: Boolean,
      required: false
    },
    lockingPopup: {
      default: false,
      type: Boolean,
      required: false
    },
    progress: {
      default: () => ({
        showed: false,
        percent: 0,
        message: ""
      }),
      type: Object,
      required: false
    },
    newItem: {
      default: () => ({}),
      type: Object,
      required: false
    },
    titleAddDialog: {
      default: null,
      type: String,
      required: false
    },
    titleEditDialog: {
      default: null,
      type: String,
      required: false
    },
    showRequired: {
      default: true,
      type: Boolean,
      required: false
    },
    dataValueDefault: {
      type: Object,
      required: false
    },
    styleGrid: {
      default: "",
      type: String,
      required: false
    },
  },
  data: function() {
    return {
      DEFAULT_WIDTH,
      selectedItem: { ...DEFAULT_ITEM },
      tmpItem: { ...DEFAULT_ITEM },
      file: null
    };
  },
  mounted() {
  },
  computed: {
    showPopup: {
      get() {
        return (
          (this.adding && this.hasPermission(this.permission, "INSERT")) ||
          (this.updating && this.hasPermission(this.permission, "UPDATE")) ||
          this.uploading
        );
      }
    },
    defaultRow: {
      get() {
        let newRow = {}
        for(let row of this.dataModel){
          newRow[row.attr]=''
          if(this.dataValueDefault != undefined && this.dataValueDefault[new Object(row.attr)] != undefined && this.dataValueDefault[new Object(row.attr)] != '') {
            newRow[row.attr] = this.dataValueDefault[new Object(row.attr)];
          }
        }
        return newRow
      }
    }
  },
  watch: {
    adding: function(val) {
      if (val) {
        if (this.hasPermission(this.permission, "INSERT")) {
          this.tmpItem = {...this.defaultRow, ...this.newItem, _index: this.dataValue.length };
        } else {
          this.stopInsert()
        }
      }
    },
    updating: function(val) {
      if (val) {
        if (this.hasPermission(this.permission, "UPDATE")) {
          this.tmpItem = this.flatToTmp(this.selectedItem);
        } else {
          this.stopUpdate()
        }
      }
    },
    currentRowKey: function(val) {
      let foundItem = this.dataValue.find(item => item._index == val);
      this.selectedItem = foundItem || DEFAULT_ITEM;
    }
  },
  methods: {
    hasPermission,
    sval,
    val,
    attrConvert: (attr) => attr.replace(/[.]/g, "__"),
    attrRevert: (attr) => attr.replace(/__/g, "."),
    flatToTmp: function(val) {
      return flattenObject(this.dataModel, val, this.attrConvert)
    },
    tmpToObj: function(val) {
      return revertObject(this.dataModel, val, this.attrConvert, this.attrRevert)
    },
    onPaging: function() {
      this.$emit(ON_PAGING_EVENT);
    },
    stopInsert: function(confirm = false) {
      if (confirm && !nestutils.confirmOnDiscardChanges()) {
        return
      }
      this.$emit(STOP_INSERT_EVENT);
    },
    stopUpdate: function(confirm = false) {
      if (confirm && !nestutils.confirmOnDiscardChanges()) {
        return
      }
      this.$emit(STOP_UPDATE_EVENT);
    },
    stopUpload: function(confirm = false) {
      if (confirm && !nestutils.confirmOnDiscardChanges()) {
        return
      }
      this.$emit(STOP_UPLOAD_EVENT);
    },
    selectionChange: function(val) {
      this.$emit(SELECTION_CHANGE_EVENT, val);
    },
    onInsert: function(item) {
      this.validateForm(() => {
        this.$emit(ON_INSERT_EVENT, item);
      });
    },
    onUpdate: function(item) {
      this.validateForm(() => {
        this.$emit(ON_UPDATE_EVENT, item);
      });
    },
    onUpload: function() {
      this.$emit(ON_UPLOAD_EVENT, this.file);
    },
    rowClick: function(row) {
      this.$emit(ROW_CLICK_EVENT, row);
    },
    rowDbClick: function(row) {
      this.$emit(ROW_DB_CLICK_EVENT, row)
    },
    onFileChange: function(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        this.file = null
        return
      }
      this.file = files[0]
    },
    validateForm: function(success) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          success();
        }
      });
    },
    onClickButton: function(button) {
      button.click(this.tmpItem)
    },
    buildRules: function() {
      let rules = this.dataModel.reduce((acc, item) => {
        if (
          this.hasPermission(
            item.permission,
            this.adding ? "INSERT*" : "UPDATE*"
          )
        ) {
          acc[this.attrConvert(item.attr)] = [
            {
              required: true,
              message: this.$i18n.t(item.label) + " " + this.$i18n.t('SHOULD_NOT_EMPTY'),
              trigger: "blur"
            }
          ]
        }
        // INPUT RULES
        if (!isNullOrEmpty(item.rules)) {
          let listRule = acc[this.attrConvert(item.attr)];
          if (!listRule) {
            listRule = []
            acc[this.attrConvert(item.attr)] = listRule
          }
          item.rules.forEach(rule => {
            // CUSTOM RULES
            if (!isNullOrEmpty(rule.validator)) {
              let convertRule = {
                validator: function(thisRule, value, callback) {
                  if(!rule.validator(this.tmpItem)) {
                    callback(new Error(this.$i18n.t(rule.message)))
                  }
                  callback()
                }.bind(this),
                trigger: rule.trigger
              }
              listRule.push(convertRule)
            } else {
              // NORMAL RULES
              listRule.push(rule)
            }
          })
        }
        return acc;
      }, {});
      return rules;
    },
    displayValue: function(row, column) {
      let val = this.val(row, column.attr);
      if (column.dataset) {
        return this.formatterAttr(column.dataset, val);
      }
      if (typeof column.formatter == "function") {
        return column.formatter(val);
      }
      return val;
    },
    formatterAttr: function(ds, val) {
      var dataset = this.commonCodes[ds];
      var result;
      if (!dataset || !(result = dataset.find(item => item.SUBCD == val))) {
        return val;
      }
      return result.CODENM;
    },
    closePopup: function() {
      if (this.lockingPopup) {
        return;
      }
      if (this.adding) {
        this.stopInsert(this.tmpItem, true);
      } else if (this.updating) {
        this.stopUpdate(this.tmpItem, true);
      } else if (this.uploading) {
        this.stopUpload(true);
      }
    },
    onSaveItem: function() {
      if (this.adding) {
        this.onInsert(this.tmpToObj(this.tmpItem));
      } else if (this.updating) {
        this.onUpdate(this.tmpToObj(this.tmpItem));
      }
    },
    title: function() {
      // if (this.adding) {
      //   if(this.titleAddDialog != null) {
      //     return this.titleAddDialog
      //   }else {
      //     return this.$i18n.t('ADD')
      //   }
      // }
      // if (this.updating) {
      //   if(this.titleEditDialog != null) {
      //     return this.titleEditDialog
      //   }else {
      //     return this.$i18n.t('DispViewEditBtn')
      //   }
      // }
      // if (this.uploading) {
      //   return this.$i18n.t('DispViewImportBtn')
      // }
      return ''
    },
    disabledButton(button) {
      if (this.updating) {
        if(button.isDisableUpdt != null & button.isDisableUpdt != undefined) {
          return button.isDisableUpdt;
        }
      }else {
        return button.disabled(this.tmpItem);
      }

      
        
    }
  }
};

const ON_PAGING_EVENT = "on-paging";
const STOP_INSERT_EVENT = "stop-insert";
const STOP_UPDATE_EVENT = "stop-update";
const STOP_UPLOAD_EVENT = "stop-upload";
const SELECTION_CHANGE_EVENT = "selection-change";
const ON_INSERT_EVENT = "on-insert";
const ON_UPDATE_EVENT = "on-update";
const ON_UPLOAD_EVENT = "on-upload";
const ROW_CLICK_EVENT = "row-click";
const ROW_DB_CLICK_EVENT = "row-dblclick";

const DEFAULT_WIDTH = 80;
const DEFAULT_ITEM = {
  _index: -1
};
</script>
<style>
.el-dialog__header {
    text-align: center;
    font-weight: bold;
}
.el-form-item__error {
  color: red;
  font-style: italic;
  font-family: Arial;
}
.one-button-field .el-input {
  width: 200px !important;
}
.el-select {
  width: 250px ;
}
.el-table {
  min-height: 100px;
}
</style>
