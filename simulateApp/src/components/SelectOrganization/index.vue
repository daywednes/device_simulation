<template>
  <div
    style="float: left; align-self: center; display:inherit; padding-left: 20px; width: 300px;"
  >
    <el-dropdown
      class="el-dropdown-box"
      trigger="click"
      @command="handleCommand"
    >
      <span class="el-dropdown-link">
        Organization Name: {{ organization.name
        }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item disabled>Manage Organizations</el-dropdown-item>
        <el-dropdown-item command="switchOrg"
          >Switch Organization</el-dropdown-item
        >
        <el-dropdown-item command="addOrg"
          >Add A New Organization</el-dropdown-item
        >
        <el-dropdown-item command="editOrg"
          >Edit This Organization</el-dropdown-item
        >
        <el-dropdown-item disabled divided>Manage Hubs</el-dropdown-item>
        <el-dropdown-item command="addHub">Add A New Hub</el-dropdown-item>
        <el-dropdown-item command="editHub">Edit Hubs</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- Edit Organization -->
    <el-dialog title="" :visible.sync="showEditDialog">
      <div style=" width:100%; float: right; display: inline-flex;">
        <div style="width: 50%; margin-right: 30px;word-break: break-word;">
          <h1>
            Edit Organization
          </h1>
          <h2>
            Organizations contain 1 or more Hubs, collecttions of alarm zones
            and devices. You can use them to manage security for multiple
            locations.
          </h2>
        </div>
        <div style="width: 50%; margin-top:50px;">
          <el-form
            class="login-form-log"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="orgName">
              <!-- <span style="margin-left:10px;font-size: x-large;"> Name</span> -->
              <el-input
                ref="orgName"
                v-model="organization.name"
                style="color: black;"
                placeholder="Organization Name"
                name="orgName"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>
            <el-form-item prop="description">
              <!-- <span style="margin-left:10px;font-size: x-large;"> Description</span> -->
              <el-input
                ref="orgDescription"
                v-model="organization.description"
                style="color: black;"
                placeholder="Organization Description"
                name="orgDescription"
                type="textarea"
                tabindex="2"
                :rows="3"
                autocomplete="on"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div style=" width:100%;margin-bottom:10px; ">
        <el-button type="info" @click="cancelPopup">Cancel</el-button>
        <el-button type="primary" style="float: right" @click="editOrganization"
          >Edit Organization</el-button
        >
      </div>
    </el-dialog>

    <!-- Add Organization -->
    <el-dialog title="" :visible.sync="showAddDialog">
      <div style=" width:100%; float: right; display: inline-flex;">
        <div style="width: 50%; margin-right: 30px;word-break: break-word;">
          <h1>
            New Organization
          </h1>
          <h2>
            Organizations contain 1 or more Hubs, collecttions of alarm zones
            and devices. You can use them to manage security for multiple
            locations.
          </h2>
        </div>
        <div style="width: 50%; margin-top:50px;">
          <el-form
            class="login-form-log"
            style=""
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="orgName">
              <!-- <span style="margin-left:10px;font-size: x-large;"> Name</span> -->
              <el-input
                ref="orgName"
                v-model="organizationForm.name"
                style="color: black;"
                placeholder="Organization Name"
                name="orgName"
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
                ref="orgDescription"
                v-model="organizationForm.description"
                style="color: black;"
                placeholder="Organization Description"
                name="orgDescription"
                type="textarea"
                tabindex="2"
                :rows="3"
                autocomplete="on"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div style=" width:100%;margin-bottom:10px; ">
        <el-button type="info" @click="cancelPopup">Cancel</el-button>
        <el-button
          type="primary"
          style="float: right"
          @click="createOrganization"
          >Create Organization</el-button
        >
      </div>
    </el-dialog>

    <!-- Add Hub -->
    <el-dialog title="" :visible.sync="showAddHUBDialog">
      <div
        v-if="!hubList || hubList.length == 0"
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
        v-if="hubList && hubList.length > 0"
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
        <el-button type="primary" style="float: right" @click="createHub"
          >Create Hub</el-button
        >
      </div>
    </el-dialog>

    <!-- Switch Organization -->
    <el-dialog :visible.sync="showSwitchDialog">
      <div style=" width:100%; float: right; display: inline-flex;">
        <div style="width: 50%; margin-right: 30px;word-break: break-word;">
          <h1>
            Switch Organization
          </h1>
          <h2>
            Organizations contain 1 or more Hubs, collecttions of alarm zones
            and devices. You can use them to manage security for multiple
            locations.
          </h2>
        </div>
        <div style="width: 50%; margin-top:50px;">
          <el-select
            v-model="organizationId"
            style="align-self: center; text-align-last: left;inline-size: fit-content;margin: 0 30px 0 10px;"
            @change="updateOrgID(organizationId)"
          >
            <el-option
              style="align-self: center; text-align-last: left;"
              v-for="(item, index) in orgList"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
              {{ item.name }}</el-option
            >
          </el-select>
        </div>
      </div>
      <div style=" width:100%;margin-bottom:10px; ">
        <el-button type="info" @click="cancelPopup">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
/* .el-dropdown el-dropdown-item{
  text-transform: uppercase;
}
.el-dropdown-item{
  text-transform: uppercase;
} */
.el-button {
  padding: 10px;
  border: 0px;
}
.el-select-dropdown__item {
  padding: 0px;
  margin: 5px;
  height: 50px;
  line-height: 50px;
}
.item-btn {
  margin-bottom: 15px;
  margin-left: 0px;
}
.block {
  padding: 25px;
}
.el-dropdown-link {
  padding: 5px;
  cursor: pointer;
  border: 2px black;
  width: 300px;
  /* color: #509EFF; */
}
.el-dropdown-box {
  border: 1px solid black;
  float: right;
  margin: 5px;
  line-height: 38px;
  vertical-align: middle;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>

<script>
import { getOrgs, createOrg, deleteOrg, updateOrg } from '@/api/org';
import { getHubs, createHub, deleteHub } from '@/api/hubs';
export default {
  data() {
    return {
      organization: {},
      organizationId: '',
      orgList: [],
      hubList: [],
      showAddDialog: false,
      showAddHUBDialog: false,
      showSwitchDialog: false,
      showEditDialog: false,
      showEditHUBDialog: false,
      organizationForm: {
        name: '',
        description: '',
      },
      hubForm: {
        name: '',
        description: '',
        option: '',
        orgId: '',
      },
    };
  },

  created() {
    this.getOrgList();
  },
  watch: {
    orgList(val, old) {
      if (val && val.length > 0) {
        this.organization = val[val.length - 1];
        this.organizationId = val[val.length - 1].id;
      }
      this.$store.dispatch('user/updateOrgID', this.organizationId);
      this.getHubsList(this.organizationId);
    },
  },
  computed: {
    language() {
      if (this.$store.getters.language == null) {
        this.handleSetLanguage('ENG');
      }
      return this.$store.getters.language;
    },
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'addOrg':
          this.showAddDialog = true;
          break;
        case 'addHub':
          this.showAddHUBDialog = true;
          break;
        case 'switchOrg':
          this.showSwitchDialog = true;
          break;
        case 'editOrg':
          this.showEditDialog = true;
          break;
        case 'editHub':
          this.showEditHUBDialog = true;
          break;
      }
    },
    fn_delete(id) {
      // this.$alert('Delete'+ tmp)
      // return;
      if (this.orgList.length < 2) {
        this.$alert('This is the last organization.');
        return;
      }
      deleteOrg(id).then(response => {
        this.organization = {};
        this.organizationId = '';
        // this.organization.name = '';
        this.$store.dispatch('user/updateOrgID', '');
        this.getOrgList();
      });
    },
    getOrgList() {
      getOrgs().then(response => {
        this.orgList = response;
        3;
        this.$store.dispatch('user/updateOrgs', response);
      });
      // .catch(error => {
      //   console.log(error);
      //   store.dispatch('user/logout');
      // });
    },
    getHubsList(orgId) {
      getHubs(orgId).then(response => {
        this.hubList = response;
        this.$store.dispatch('user/updateHubs', response);
      });
    },
    updateOrgID(id) {
      this.organization = this.orgList.find(x => x.id == id);
      this.$store.dispatch('user/updateOrgID', id);
      this.organizationId = id;
      this.showSwitchDialog = false;
    },
    createHub() {
      if (!this.hubForm.name || this.hubForm.name.length < 1) {
        this.$alert('Please input name');
        return;
      }
      if (!this.hubForm.description || this.hubForm.description.length < 1) {
        this.$alert('Please input description');
        return;
      }
      this.hubForm.orgId = this.organizationId;
      createHub(this.hubForm).then(response => {
        this.getOrgList();
        this.showAddHUBDialog = false;
      });
    },
    cancelPopup() {
      this.showAddDialog = false;
      this.showAddHUBDialog = false;
      this.showSwitchDialog = false;
      this.showEditDialog = false;
      this.showEditHUBDialog = false;
      this.organizationForm.name = '';
      this.organizationForm.description = '';
      this.hubForm.name = '';
      this.hubForm.description = '';
    },
    createOrganization() {
      if (
        !this.organizationForm.name ||
        this.organizationForm.name.length < 1
      ) {
        this.$alert('Please input name');
        return;
      }
      if (
        !this.organizationForm.description ||
        this.organizationForm.description.length < 1
      ) {
        this.$alert('Please input description');
        return;
      }
      createOrg(this.organizationForm)
        .then(response => {
          this.getOrgList();
          this.showAddDialog = false;
          this.organizationForm.name = '';
          this.organizationForm.description = '';
        })
        .catch((mess) => {
          this.organizationForm.name = '';
          this.organizationForm.description = '';
          this.$alert('This organization name is exist');
        });
    },
    editOrganization() {
      if (!this.organization.name || this.organization.name.length < 1) {
        this.$alert('Please input name');
        return;
      }
      if (
        !this.organization.description ||
        this.organization.description.length < 1
      ) {
        this.$alert('Please input description');
        return;
      }
      updateOrg(this.organization).then(response => {
        this.getOrgList();
        this.showEditDialog = false;
      });
    },
  },
};
</script>
