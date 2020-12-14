<template>
  <el-form class="login-form-log" autocomplete="on" label-position="left">
    <el-form-item prop="DeviceId">
      <span style="margin-left:10px;font-size: large;"> ID</span>
      <el-input
        ref="DeviceId"
        v-model="item.id"
        style="color: black;"
        placeholder="Device Id"
        name="DeviceId"
        type="text"
        tabindex="1"
        autocomplete="on"
        :readonly="true"
      /> </el-form-item
    ><el-form-item prop="DeviceName">
      <span style="margin-left:10px;font-size: large;"> Name</span>
      <el-input
        ref="DeviceName"
        v-model="item.name"
        style="color: black;"
        placeholder="Device Name"
        name="DeviceName"
        type="text"
        tabindex="1"
        autocomplete="on"
      />
    </el-form-item>
    <el-form-item prop="description" v-if="item.user">
      <span style="margin-left:10px;font-size: large;"> Create By</span>
      <el-input
        ref="DeviceUser"
        v-model="item.user.username"
        style="color: black;"
        placeholder="User name"
        name="DeviceUser"
        type="text"
        tabindex="2"
        autocomplete="on"
        :readonly="true"
      />
    </el-form-item>
    <el-form-item prop="label">
      <span style="margin:0 10px;font-size: large;">Manage by</span>

      <el-select v-model="item.orgId" placeholder="Select">
        <el-option
          v-for="item in orgList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="zoneId">
      <span style="margin:0 10px;font-size: large;"> Assign to Zone</span>
      <el-select v-model="item.zoneId" clearable placeholder="Select">
        <el-option
          v-for="item in optionsZone"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <span style="margin:0 10px;font-size: large;"> Tags Of Device </span>
      <el-select
        v-model="itemTags"
        multiple
        filterable
        allow-create
        default-first-option
      >
        <el-option
          v-for="item in optionsTag"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="description">
      <span style="margin-left:10px;font-size: large;"> Description</span>
      <el-input
        ref="DeviceForm"
        v-model="item.description"
        style="color: black;"
        placeholder="Description"
        name="DeviceDescription"
        type="textarea"
        tabindex="2"
        :rows="3"
        autocomplete="on"
      />
    </el-form-item>
    <el-button
      type="primary"
      style="width:48%;margin-bottom:10px;"
      @click="updateDeviceEntity"
      >Update Device</el-button
    >
    <el-button
      style="width:48%;margin-bottom:10px; background:red; color:white;"
      @click="deleteDeviceEntity"
      >Delete Device</el-button
    >
  </el-form>
</template>

<style scoped>
.el-select {
  width: 300px ;
}
</style>
<script>
import { updateDevice, deleteDevice } from '@/api/device';
import { getTags, getTagsById } from '@/api/tags';
import { getZones } from '@/api/zone';
import { getOrgs } from '@/api/org';

export default {
  name: 'DeviceDetails',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      optionsZone: [],
      optionsTag: [],
      itemTags: [],
      orgList: [],
      loadTagDone: false,
      DeviceForm: {
        DeviceName: '',
        DeviceType: '',
        DeviceLabel: '',
        DeviceDescription: '',
      },
    };
  },
  watch: {
    orgId(val, old) {
      this.isShowLeft = false;
      this.getZonesList(val);
      this.getOrgList();
    },
    item(val, old) {
      this.loadTagDone = false;
      this.itemTags = val.tags
    },
  },
  computed: {
    orgId() {
      if (this.$store.getters.orgId == null) {
        this.$alert('empty');
      }
      return this.$store.getters.orgId;
    },
  },
  mounted: function() {
    this.getZonesList(this.orgId);
    this.getOrgList();
    this.getTagsList();
    this.itemTags = this.item.tags;
  },
  methods: {
    getOrgList() {
      getOrgs().then(response => {
        this.orgList = response;
        this.$store.dispatch('user/updateOrgs', response);
      });
    },
    getZonesList(val) {
      getZones(val).then(response => {
        this.optionsZone = response;
        this.$store.dispatch('user/updateZones', response);
      });
    },
    getTagsList() {
      getTags().then(response => {
        this.optionsTag = response.map(x => x.name)
          ? response.map(x => x.name)
          : [];
      });
    },
    // async getTagsDeviceList(deivceId) {
    //   await getTagsById(deivceId).then(response => {
    //     this.itemTags = response.map(x => x.name)
    //       ? response.map(x => x.name)
    //       : [];
    //     this.loadTagDone = true;
    //   });
    // },
    updateDeviceEntity() {
      if (!this.item.name || this.item.name.length < 1) {
        this.$alert('Please input name');
        return;
      }
      if (!this.item.description || this.item.description.length < 1) {
        this.$alert('Please input description');
        return;
      }
      this.item.tags = this.itemTags;
      updateDevice(this.item).then(response => {
        this.getTagsList();
        this.$emit('refreshUI');
      });
    },
    deleteDeviceEntity() {
      deleteDevice(this.item.id).then(response => {
        this.$emit('refreshUI');
      });
    },
  },
};
</script>
