<template>
  <div class="app-container">
    <el-tabs v-model="editableTabsValue" style="width:95%; position: absolute;">
      <!-- @tab-click="askForSave" -->
      <el-tab-pane label="" name="-1" v-if="!hubs || hubs.length == 0">
        <!-- <el-tab-pane label="Default" name="-1" > -->
        <div
          style="margin: 60px; text-align: -webkit-center;white-space: pre-wrap; word-wrap: break-word; font-size: 26px;"
        >
          <h1>Your new Hub is all set</h1>
          <br />
          <h1>
            You can start connecting devices to this Hub by pressing the +
            button
          </h1>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-for="(item, index) in hubs"
        :key="index"
        :label="item.name"
        :name="item.name"
      >
        <keep-alive>
          <!-- <DeviceStatus /> -->
          <div style="width:100%">
            <h1>{{ editableTabsValue }} - Simulation Devices Status</h1>
            <hr />
            <br />
            <draggable
              :list="deviceStatusList"
              v-bind="$attrs"
              class="board-column-content"
              style="width: 70%;float: left;"
              :set-data="setData"
            >
              <!-- <div v-for="element in list" :key="element.id" class="board-item">
        {{ element.name }} {{ element.id }}
      </div> -->
              <SingleDevice
                style="margin: 15px;"
                v-for="device in deviceStatusList"
                :key="device.id"
                :item="device"
                :isDefine="device.isDefine"
                @refreshUI="getDeviceStatusList"
              />
            </draggable>

            <div style="width:29%; height:100vh; float: right;">
              <el-card
                class="box-card"
                style=" width: 100%; float:left; min-height: 200px;"
              >
                <div slot="header" class="clearfix">
                  <svg-icon
                    style="margin-left:10px;font-size: large;"
                    icon-class="table"
                  />
                  <span style="margin-left:10px;font-size: large;"
                    >{{ item.name }} - {{ item.id }}
                  </span>
                </div>

                <el-button
                  class="filter-item"
                  type="primary"
                  icon="el-icon-attract"
                  style="margin: 20px;"
                >
                  Send All Devies Status
                </el-button>
                <hr />

                <el-select
                  v-model="item.locationType"
                  clearable
                  filterable
                  placeholder="Device ID"
                  style="margin: 20px;"
                >
                  <el-option
                    v-for="item in deviceStatusList"
                    :key="item.name"
                    :label="item.name + '-' + item.id"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
                <el-button
                  class="filter-item"
                  type="primary"
                  icon="el-icon-position"
                  style="margin: 0px 10px 20px 20px;"
                >
                  Send from Hub
                </el-button>

                <hr />

                <el-input
                  class="inputKaban"
                  style="font-size: large; margin: 20px; width: 80%"
                  placeholder="Please input your topic"
                ></el-input>
                <el-button
                  class="filter-item"
                  type="warning"
                  icon="el-icon-finished"
                  style="margin: 0px 10px 20px 20px;"
                >
                  Subcribe Topic
                </el-button>
                <hr />
                <el-input
                  style="color: black; margin-top:10px;"
                  placeholder="Message"
                  type="textarea"
                  :rows="5"
                  autocomplete="on"
                  :readonly="true"
                />
              </el-card>
            </div>
          </div>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>

    <div style=" position: absolute; width: 70%;">
      <el-input
        placeholder="Type something"
        prefix-icon="el-icon-search"
        style="width: 20%; margin-right: 10px;"
        v-model="textSearch"
      >
      </el-input>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="
          () => {
            showAddHUBDialog = true;
          }
        "
      >
        Add Hub
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="
          () => {
            showAddDialog = true;
          }
        "
      >
        Add Device Simulation
      </el-button>
    </div>

    <!-- <el-button
      style=" position: fixed; width:60px; height:60px; bottom:50px; right: 50px; font-size: 45px;"
      type="primary"
      icon="el-icon-circle-plus"
      circle
      @click="
        () => {
          active = 0;
          showAddDialog = true;
        }
      "
    ></el-button> -->

    <!-- Add Hub -->
    <el-dialog title="" :visible.sync="showAddHUBDialog">
      <div
        v-if="!hubs || hubs.length == 0"
        style=" width:100%; float: right; display: inline-flex;"
      >
        <div style="width: 50%; margin-right: 30px;word-break: break-word;">
          <h1>
            New Hub
          </h1>
          <h2>
            Hubs are the brains of your security system. Give your Hub a
            uniquename
          </h2>
          <h2 style="font-weight: normal; margin-top: 10px;">
            Example: Madroda House, Main Building, Basement
          </h2>
        </div>
        <div style="width: 50%; margin-top:50px;">
          <el-form
            class="login-form-log"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="hubName">
              <!-- <span style="margin-left:10px;font-size: x-large;"> Name</span> -->
              <el-input
                ref="hubName"
                v-model="hubForm.name"
                style="color: black;"
                placeholder="Hub Name"
                name="hubName"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>
            <el-form-item prop="description">
              <!-- <span style="margin-left:10px;font-size: x-large;">
                Description</span
              > -->
              <el-input
                ref="hubDescription"
                v-model="hubForm.description"
                style="color: black;"
                placeholder="Hub Description"
                name="hubDescription"
                type="textarea"
                tabindex="2"
                :rows="3"
                autocomplete="on"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div
        v-if="hubs && hubs.length > 0"
        style=" width:100%; float: right; display: inline-flex;"
      >
        <div style="width: 50%; margin-right: 30px;word-break: break-word;">
          <h1>
            Add a Hub
          </h1>
          <h2>
            How do you want to use this Hub ? You can extend your radio range,
            add security to separate location, or increase computing power.
          </h2>
        </div>
        <div style="width: 50%; margin-top:50px;">
          <el-form
            class="login-form-log"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="hubName">
              <!-- <span style="margin-left:10px;font-size: x-large;"> Name</span> -->
              <el-input
                ref="hubName"
                v-model="hubForm.name"
                style="color: black;"
                placeholder="Hub Name"
                name="hubName"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>
            <el-form-item prop="description">
              <!-- <span style="margin-left:10px;font-size: x-large;">
                Description</span
              > -->
              <el-input
                ref="hubDescription"
                v-model="hubForm.description"
                style="color: black;"
                placeholder="Hub Description"
                name="hubDescription"
                type="textarea"
                tabindex="2"
                :rows="3"
                autocomplete="on"
              />
              <el-radio-group
                v-model="hubForm.option"
                style="margin-top: 20px; font-size: 24px; display: table-caption;"
              >
                <el-radio :label="3">Extent Range</el-radio>
                <el-radio :label="6">New Location</el-radio>
                <el-radio :label="9">Increase Performance</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style=" width:100%;margin-bottom:10px; ">
        <el-button type="info" @click="cancelPopup">Cancel</el-button>
        <el-button
          :loading="loadingDevice"
          type="primary"
          style="float: right"
          @click="createHub"
          >Create Hub</el-button
        >
      </div>
    </el-dialog>

    <!-- Add Device Simulation -->
    <el-dialog title="" :visible.sync="showAddDialog">
      <h1>Simulation Deivce</h1>
      <hr />
      <el-row>
        <el-col :span="12">
          <el-row style="margin :20px; font-size: medium;">
            <span class="demonstration">Device Group </span>
            <br />
            <el-select v-model="selectedItem.deviceGroup" filterable>
              <el-option label="Zone Input" value="Zone Input"> </el-option>
              <el-option label="Zone Output" value="Zone Output"> </el-option>
              <el-option label="Contact Sensor" value="Contact Sensor">
              </el-option>
              <el-option label="Motion Sensor" value="Motion Sensor">
              </el-option>
              <el-option label="Radar Sensor" value="Radar Sensor"> </el-option>
              <el-option label="Camera" value="Camera"> </el-option>
            </el-select>
            <el-tooltip content="Global Size" effect="dark" placement="right">
              <div slot="content">
                Is this [Device Type] inside the home, <br />
                outside or at a perimeter entry point, <br />like a door or
                window ?
              </div>
              <i
                style="margin-left: 20px; font-size: large;"
                class="el-icon-warning-outline"
            /></el-tooltip>
          </el-row>
          <el-row style="margin :20px; font-size: medium;">
            <span class="demonstration">Device Name</span>
            <br />

            <el-input
              placeholder="Please input device name"
              v-model="selectedItem.name"
              style="width: 250px;"
            ></el-input>

            <el-tooltip effect="dark" placement="right">
              <div slot="content">
                Is this [Device Type] inside the home, <br />
                outside or at a perimeter entry point, <br />like a door or
                window ?
              </div>
              <i
                style="margin-left: 20px; font-size: large;"
                class="el-icon-warning-outline"
            /></el-tooltip>
          </el-row>
          <el-row style="margin :20px; font-size: medium;">
            <span class="demonstration"> Location type </span>
            <br />
            <el-select
              v-model="selectedItem.locationType"
              clearable
              filterable
              placeholder="All"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-tooltip effect="dark" placement="right">
              <div slot="content">
                Is this [Device Type] inside the home, <br />
                outside or at a perimeter entry point, <br />like a door or
                window ?
              </div>
              <i
                style="margin-left: 20px; font-size: large;"
                class="el-icon-warning-outline"
            /></el-tooltip>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row style="margin :20px; font-size: medium;">
            <span class="demonstration">Status </span>
            <br />
            <el-select v-model="selectedItem.status" clearable filterable>
              <el-option
                label="Available to Connect"
                value="Available to Connect"
              >
              </el-option>
              <el-option label="Connected" value="Connected"> </el-option>
              <el-option label="Disconnected" value="Disconnected"> </el-option>
            </el-select>
          </el-row>
          <el-row style="margin :20px; font-size: medium;">
            <span class="demonstration">Message </span>
            <br />

            <el-input
              placeholder="Please input device name"
              v-model="selectedItem.message"
              style="width: 250px;"
            ></el-input>
          </el-row>

          <el-row style="margin :20px; font-size: medium;">
            <el-button
              class="filter-item"
              type="success"
              icon="el-icon-edit"
              @click="addDeviceStatus"
              >Create Simulation Device</el-button
            >
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.board {
  width: 1000px;
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.rightMenu {
  position: fixed;
  bottom: 120px;
  right: 50px;
  background: lightgray;
  height: 60vh;
  margin-top: 10px;
  padding: 10px;
  text-align-last: center;
  border: 2px solid steelblue;
  border-radius: 20px;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4a9ff9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}
</style>
<style>
.el-tabs__nav-scroll {
  float: right;
}
</style>
<style scoped>
.el-select {
  width: 300px;
}
.el-button--medium.is-circle {
  padding: 0px;
}
.el-radio__label {
  font-size: 20px;
}

.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}
.chart-wrapper {
  background: #fff;
  padding: 20px 0px 20px 0px;
  text-align-last: left;
  font-weight: bold;
  font-size: small;
}
</style>
<script>
import draggable from "vuedraggable";
import FontResizableContainer from "@/components/FontResizableContainer";
import logoSimpleThings from "@/assets/img_src/simple_things_logo.png";
import deviceStatusInput from "@/assets/img_src/zonesInput.png";
import {
  getDeviceStatusById,
  createDeviceStatus,
  deleteDeviceStatus
} from "@/api/deviceStatus";
import { getHubs, createHub, deleteHub } from "@/api/hubs";
import { getTags, getTagsById } from "@/api/tags";
import SingleDevice from "@/components/SingleDevice";

export default {
  name: "Hubs",
  components: {
    SingleDevice,
    draggable
  },
  data() {
    return {
      selectedItem: { isDefine: false },
      itemTags: null,
      valueDeviceGroup: null,
      valueSensorType: null,
      valueLocationType: null,
      logo: logoSimpleThings,
      deviceStatusInputImg: deviceStatusInput,
      active: 0,
      autoSaveChecked: true,
      showAddDialog: false,
      showMenu: false,
      loadingDevice: false,
      showAddHUBDialog: false,
      textSearch: "",
      showDialogDeviceStatus: false,
      showZoneInput: false,
      editableTabsValue: "-1",
      isShowLeft: false,
      multipleSelection: [],
      optionsTag: [],
      deviceStatusList: [],
      deviceStatusListTmp: [],
      queryCondition: { ...DEFAULT_SEARCH_QUERY },
      selectedZone: { ...DEFAULT_ITEM },
      ds_master: [],
      ds_commonCode: {},
      group: "device",
      addDeviceZoneId: "",
      ZoneForm: {
        name: "",
        ZoneType: "",
        ZoneLabel: "",
        description: "",
        orgId: "",
        hubId: ""
      },
      hubForm: {
        name: "",
        description: "",
        option: "",
        orgId: ""
      },
      uploadProgress: { ...DEFAULT_PROGRESS },
      runInterval: null,
      widgetsList: [
        {
          i: "Zone Input",
          component: "DISARMED",
          isStatic: true
        },
        {
          i: "Zone Output",
          component: "DISARMED",
          isStatic: true
        },
        {
          i: "Contact Sensor",
          component: "DISARMED",
          isStatic: true
        },
        {
          i: "Motion Sensor",
          component: "DISARMED",
          isStatic: true
        },
        {
          i: "Radar Sensor",
          component: "DISARMED",
          isStatic: true
        },
        {
          i: "Camera",
          component: "DISARMED",
          isStatic: true
        }
      ],

      options: [
        {
          value: "Option1",
          label: "Option1"
        },
        {
          value: "Option2",
          label: "Option2"
        },
        {
          value: "Option3",
          label: "Option3"
        },
        {
          value: "Option4",
          label: "Option4"
        },
        {
          value: "Option5",
          label: "Option5"
        }
      ]
    };
  },
  mounted: function() {
    this.getHubsList();
    this.getTagsList();
    this.getDeviceStatusList();
  },
  beforeDestroy: function() {},
  watch: {
    orgId(val, old) {
      // this.saveChangesHub();
      this.getHubsList();
    },
    hubs(val, old) {
      if (val && val.length > 0) {
        this.editableTabsValue = val[val.length - 1].name;
      } else {
        this.editableTabsValue = "-1";
      }
    },
    deviceStatusList(val, old) {
      // this.resetInterval();
      if (val && val.length > 0) {
        this.addDeviceZoneId = val[val.length - 1].id;
      } else {
        this.addDeviceZoneId = null;
      }
    },
    textSearch(val, old) {
      this.searchZone(val);
    },
    autoSaveChecked(val, old) {
      if (val) {
        // this.resetInterval();
      } else {
        if (this.runInterval) {
          clearInterval(this.runInterval);
        }
      }
    },
    editableTabsValue(val, old) {
      // this.askForSave();

      if (this.deviceStatusList && this.deviceStatusList.length > 0) {
        // this.saveChangesHub(this.deviceStatusList);
      }
      this.ZoneForm.hubId = this.currentHubId;
      this.getDeviceStatusList();
    }
  },
  computed: {
    orgId() {
      if (this.$store.getters.orgId == null) {
        this.$alert("empty");
      }

      return this.$store.getters.orgId;
    },
    hubs() {
      return this.$store.getters.hubs;
    },
    currentHubId() {
      let tmpId = this.$store.getters.hubs.find(
        x => x.name == this.editableTabsValue
      );

      if (tmpId) {
        return tmpId.id;
      }

      return null;
    },
    zoneName() {
      let tmpName = this.deviceStatusList.find(
        y => y.id == this.addDeviceZoneId
      );
      if (tmpName) {
        return tmpName.name;
      }

      return null;
    }
  },
  methods: {
    addDeviceStatus() {
      this.selectedItem.hubId = this.currentHubId;

      if (!this.selectedItem.name || this.selectedItem.name.length < 1) {
        this.$alert("Please input name");
        return;
      }
      createDeviceStatus(this.selectedItem).then(response => {
        this.getDeviceStatusList();
        this.cancelPopup();
      });
    },
    // resetInterval() {
    //   if (this.autoSaveChecked) {
    //     if (this.runInterval) {
    //       clearInterval(this.runInterval);
    //     }
    //     // this.runInterval = setInterval(this.saveChangesHub, 5000);
    //   }
    // },
    getTagsList() {
      getTags().then(response => {
        this.optionsTag = response.map(x => x.name)
          ? response.map(x => x.name)
          : [];
      });
    },
    next() {
      if (this.active + 1 > 4) {
        this.active = 4;
      } else {
        this.active++;
      }
    },
    previous() {
      if (this.active - 1 < 0) {
        this.active = 0;
      } else {
        this.active--;
      }
    },
    cancelPopup() {
      this.showAddHUBDialog = false;
      this.showAddDialog = false;
      this.showDialogDeviceStatus = false;
      this.active = 0;
      this.hubForm.name = "";
      this.hubForm.description = "";
      this.loadingDevice = false;
    },
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData("Text", "");
    },
    addTab(targetName) {
      let newTabName = "New Tab " + this.hubs.length;
      this.hubs.push({
        title: "New Tab",
        name: newTabName,
        content: "New Tab content"
      });
      this.editableTabsValue = newTabName;
    },
    askForSave() {
      let oldList = this.deviceStatusList;
      if (oldList && oldList.length > 0) {
        this.$confirm(
          "Would you like to save changes of previous HUB ?",
          "Warning",
          {
            confirmButtonText: "YES",
            cancelButtonText: "NO",
            type: "warning"
          }
        )
          .then(() => {
            saveChanges(oldList);

            // this.$message({
            //   type: 'success',
            //   message: 'Save changes completed',
            // });
            return true;
          })
          .catch(() => {
            return false;
          });
      }
      return;
    },
    createHub() {
      this.hubForm.orgId = this.orgId;
      if (!this.hubForm.orgId && this.hubForm.orgId.length < 1) {
        this.$alert(
          "Please create Organization of Hub first" + this.ZoneForm.orgId
        );
      }
      if (!this.hubForm.name || this.hubForm.name.length < 1) {
        this.$alert("Please input hub name");
        return;
      }
      if (!this.hubForm.description || this.hubForm.description.length < 1) {
        this.$alert("Please input description");
        return;
      }

      this.loadingDevice = true;
      createHub(this.hubForm)
        .then(response => {
          this.getDeviceStatusList();
        })
        .catch(() => {
          this.loadingDevice = false;
        });
    },
    getHubsList() {
      this.editableTabsValue = "-1";
      this.$store.dispatch("user/updateHubs", []);
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      getHubs(this.orgId)
        .then(response => {
          this.$store.dispatch("user/updateHubs", response);
          this.cancelPopup();
        })
        .finally(() => {
          loading.close();
        });
    },
    getDeviceStatusList() {
      // this.saveChangesHub();
      if (!this.currentHubId) {
        // this.$store.dispatch("user/updateDeviceStatus", []);
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      getDeviceStatusById(this.currentHubId)
        .then(response => {
          this.deviceStatusListTmp = response;
          for (
            let index = 0;
            index < this.deviceStatusListTmp.length;
            index++
          ) {
            const element = this.deviceStatusListTmp[index];
            if (element.devices) {
              element.devices.sort((a, b) => (a.index > b.index ? 1 : -1));
            }
          }
          this.deviceStatusList = this.deviceStatusListTmp.sort((a, b) =>
            a.index > b.index ? 1 : -1
          );
          // this.$store.dispatch("user/updateDeviceStatus", response);
        })
        .catch(() => {
          // this.$store.dispatch("user/updateDeviceStatus", []);
        })
        .finally(() => {
          clearInterval(this.runInterval);
          loading.close();
        });
    }
  }
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
    orCondition: false
  }
};
const DEFAULT_ITEM = {
  _index: -1,
  _checked: false
};
const DEFAULT_PROGRESS = {
  showed: false,
  percent: 0,
  message: ""
};
</script>
