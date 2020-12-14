<template>
  <div class="components-container">
    <div
      v-if="!showAutomationDetail"
      style="postion: relative; margin-left: 5px; float:left; width: 100%;"
    >
      <h1>Automations</h1>
      <el-input
        placeholder="Type something"
        prefix-icon="el-icon-search"
        v-model="textSearch"
      >
      </el-input>
      <div >
        <div >
          <el-button
            style="margin:0px;padding:0px; background: transparent;border: transparent;margin: 7px;"
            @click="
              () => {
                showDialogAutomations = true;
              }
            "
          >
            <el-card
              class="box-card"
              style=" width: 250px; float:left; min-height: 250px; display: inline-block; text-align-last: center;"
            >
              <div style="margin-top:40px;   white-space: break-spaces;">
                <h1>New Automation</h1>
                <br />
                <span style="font-size: xxx-large;"
                  ><i class="el-icon-plus"
                /></span>
              </div>
            </el-card>
          </el-button>
          <SingleAutomation
            @showDetail="fn_compoClick(automation)"
            style="margin: 15px; display: inline-block;"
            v-for="automation in automationsList"
            :key="automation.id"
            :item="automation"
          />
        </div>
      </div>
      <br />

      <h1>Alarm Modes</h1>
      <el-input
        placeholder="Type something"
        prefix-icon="el-icon-search"
        v-model="textSearchDeployed"
      >
      </el-input>
      <div >
        <div >
          <el-button
            style="margin:0px;padding:0px; background: transparent;border: transparent;margin: 7px;"
            @click="
              () => {
                showDialogAlarm = true;
              }
            "
          >
            <el-card
              class="box-card"
              style=" width: 250px; float:left; min-height: 250px; display: inline-block; text-align-last: center;"
            >
              <div style="margin-top:40px;   white-space: break-spaces;">
                <h1>New</h1>
                <h1>Alarm Mode</h1>
                <br />
                <span style="font-size: xxx-large;"
                  ><i class="el-icon-plus"
                /></span>
              </div>
            </el-card>
          </el-button>
          <SingleAutomation
            @click.native="fn_compoClick(automation)"
            style="margin: 15px; display: inline-block;"
            v-for="automation in alarmsList"
            :key="automation.id"
            :item="automation"
          />
        </div>
      </div>
      <el-dialog title="New Automation" :visible.sync="showDialogAutomations">
        <el-form class="login-form-log" autocomplete="on" label-position="left">
          <el-form-item prop="AutomationName">
            <span style="margin-left:10px;font-size: large;"> Name</span>
            <el-input
              ref="AutomationName"
              v-model="AutomationForm.name"
              style="color: black;"
              placeholder="Automation Name"
              name="AutomationName"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-form-item prop="description">
            <span style="margin-left:10px;font-size: large;"> Description</span>
            <el-input
              ref="AutomationType"
              v-model="AutomationForm.description"
              style="color: black;"
              placeholder="Automation Description"
              name="AutomationType"
              type="text"
              tabindex="2"
              autocomplete="on"
            />
          </el-form-item>
          <el-button
            type="primary"
            style="width:100%;margin-bottom:10px;"
            @click="createAutomationEntity"
            >Create Automation</el-button
          >
        </el-form>
      </el-dialog>
      <el-dialog title="New Alarm Mode" :visible.sync="showDialogAlarm">
        <el-form class="login-form-log" autocomplete="on" label-position="left">
          <el-form-item prop="AlarmName">
            <span style="margin-left:10px;font-size: large;"> Name</span>
            <el-input
              ref="AlarmnName"
              v-model="AlarmForm.name"
              style="color: black;"
              placeholder="Alarm Mode Name"
              name="AlarmName"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-form-item prop="description">
            <span style="margin-left:10px;font-size: large;"> Description</span>
            <el-input
              ref="AutomationType"
              v-model="AlarmForm.description"
              style="color: black;"
              placeholder="Alarm Mode Description"
              name="AlarmDescription"
              type="text"
              tabindex="2"
              autocomplete="on"
            />
          </el-form-item>
          <el-button
            type="primary"
            style="width:100%;margin-bottom:10px;"
            @click="createAlarmEntity"
            >Create Alarm Mode</el-button
          >
        </el-form>
      </el-dialog>
    </div>
    <div v-if="showAutomationDetail">
      <el-button
        style="float:left;  margin-right: 20px"
        type="info"
        @click="
          () => {
            showAutomationDetail = false;
          }
        "
      >
        <i class="el-icon-back" />
      </el-button>
      <div style="float:left; width:60%">
        <h1>{{ selectedAutomation.name }}</h1>
        <hr />
        <h2>{{ selectedAutomation.description }}</h2>
      </div>
      <AutomationDetail :item="selectedAutomation" />
    </div>
  </div>
</template>
<style scoped>
.el-select {
  width: 300px;
}

.one-row {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}
.one-row-wrap {
  display: inline-flex;
  white-space: nowrap;
}

.box-card {
  width: 600px;
  max-width: 100%;
  margin: 10px auto;
}
</style>
<script>
import SingleAutomation from '@/components/SingleAutomation';
import AutomationDetail from '@/views/retes/index';
import nestutils from '@/utils/nest-utils';
import { mapGetters } from 'vuex';
import {
  getAutomations,
  createAutomation,
  deleteAutomation,
} from '@/api/automations';
import { getTags } from '@/api/tags';
import nestUtils from '@/utils/nest-utils';

export default {
  name: 'Automations',
  components: {
    SingleAutomation,
    AutomationDetail,
  },
  data() {
    return {
      textSearch: '',
      textSearchDeployed: '',
      AutomationForm: {
        name: '',
        description: '',
        type: nestutils.AUTOMATION_TYPE.AUTOMATION,
        orgId: '',
        status: 'CreatedAutomation',
        data: '',
      },
      AlarmForm: {
        name: '',
        description: '',
        type: nestutils.AUTOMATION_TYPE.ALARM,
        orgId: '',
        status: 'CreatedAutomation',
        data: '',
      },
      showDialogAutomations: false,
      showDialogAlarm: false,
      showAutomationDetail: false,
      editableTabsValue: '1',
      multipleSelection: [],
      optionsTag: [],
      automationsList: [],
      alarmsList: [],
      automationsListTmp: [],
      queryCondition: { ...DEFAULT_SEARCH_QUERY },
      ds_master: [],
      ds_commonCode: {},
      selectedAutomation: {
        name: '',
        AutomationType: '',
        AutomationLabel: '',
        description: '',
        tags: '',
        orgId: '',
        zoneId: '',
      },
      uploadProgress: { ...DEFAULT_PROGRESS },
    };
  },
  mounted: function() {
    this.getAutomationsList(this.orgId);
  },
  watch: {
    orgId(val, old) {
      this.AutomationForm.orgId = val;
      this.AlarmForm.orgId = val;
      this.getAutomationsList(val);
      this.showAutomationDetail = false;
    },
    textSearch(val, old) {
      this.searchAutomation(val);
    },
    textSearchDeployed(val, old) {
      this.searchAlarm(val);
    },
  },
  computed: {
    orgId() {
      if (this.$store.getters.orgId == null) {
        this.$alert('empty');
      }

      this.AutomationForm.orgId = this.$store.getters.orgId;
      this.AlarmForm.orgId = this.$store.getters.orgId;
      return this.$store.getters.orgId;
    },
  },
  methods: {
    getTagsList() {
      getTags().then(response => {
        this.optionsTag = response;
      });
    },
    searchAutomation(txt) {
      if (txt && txt.length > 0) {
        this.automationsList = this.automationsListTmp.filter(
          automation =>
            automation.type == nestUtils.AUTOMATION_TYPE.AUTOMATION &&
            (automation.name
              .trim()
              .toUpperCase()
              .includes(txt.toUpperCase()) ||
              automation.description
                .trim()
                .toUpperCase()
                .includes(txt.toUpperCase())),
        );
      } else {
        this.automationsList = this.automationsListTmp.filter(
          automation => automation.type == nestUtils.AUTOMATION_TYPE.AUTOMATION,
        );
      }
    },
    searchAlarm(txt) {
      if (txt && txt.length > 0) {
        this.alarmsList = this.automationsListTmp.filter(
          automation =>
            automation.type == nestUtils.AUTOMATION_TYPE.ALARM &&
            (automation.name
              .trim()
              .toUpperCase()
              .includes(txt.toUpperCase()) ||
              automation.description
                .trim()
                .toUpperCase()
                .includes(txt.toUpperCase())),
        );
      } else {
        this.alarmsList = this.automationsListTmp.filter(
          automation => automation.type == nestUtils.AUTOMATION_TYPE.ALARM,
        );
      }
    },
    fn_compoClick: function(item) {
      this.selectedAutomation = item;
      this.showAutomationDetail = true;
    },
    fn_findRoute: function(command) {},
    createAutomationEntity() {
      if (!this.AutomationForm.orgId && this.AutomationForm.orgId.length < 1) {
        this.$alert('Please create Organization first');
      }

      if (!this.AutomationForm.name || this.AutomationForm.name.length < 1) {
        this.$alert('Please input name');
        return;
      }
      if (
        !this.AutomationForm.description ||
        this.AutomationForm.description.length < 1
      ) {
        this.$alert('Please input description');
        return;
      }
      const loadingAutomation = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      createAutomation(this.AutomationForm)
        .then(response => {
          this.refreshUI();
        })
        .catch((mess) => {
          this.AutomationForm.name ='';
          this.AutomationForm.description ='';
          this.$alert('This automation name is exist');
        })
        .finally(() => {
          loadingAutomation.close();
        });
    },
    createAlarmEntity() {
      if (!this.AlarmForm.orgId && this.AlarmForm.orgId.length < 1) {
        this.$alert('Please create Organization first');
      }

      if (!this.AlarmForm.name || this.AlarmForm.name.length < 1) {
        this.$alert('Please input name');
        return;
      }
      if (
        !this.AlarmForm.description ||
        this.AlarmForm.description.length < 1
      ) {
        this.$alert('Please input description');
        return;
      }
      const loadingAlarm = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      createAutomation(this.AlarmForm)
        .then(response => {
          this.refreshUI();
        })
        .catch((mess) => {
          this.AlarmForm.name ='';
          this.AlarmForm.description ='';
          this.$alert('This alarm mode name is exist');
        })
        .finally(() => {
          loadingAlarm.close();
        });
    },
    getAutomationsList(val) {
      getAutomations(val).then(response => {
        response.forEach(row => {
          row.zoneId = row.zone ? row.zone.id : null;
          row.orgId = row.org ? row.org.id : null;
        });

        this.automationsListTmp = response;
        this.automationsList = this.automationsListTmp.filter(
          automation => automation.type == nestUtils.AUTOMATION_TYPE.AUTOMATION,
        );
        this.alarmsList = this.automationsListTmp.filter(
          automation => automation.type == nestUtils.AUTOMATION_TYPE.ALARM,
        );

        // this.$store.dispatch('user/updateAutomations', response);
      });
    },
    refreshUI() {
      this.AutomationForm.name = '';
      this.textSearch = '';
      this.textSearchDeployed = '';
      this.AutomationForm.description = '';
      this.getAutomationsList(this.orgId);
      this.isShowLeft = false;
      this.showDialogAutomations = false;
      this.showDialogAlarm = false;
      this.showAutomationDetail = false;
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
