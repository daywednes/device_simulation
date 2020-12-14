<template>
  <el-form class="login-form-log" autocomplete="on" label-position="left">
    <el-form-item prop="ZoneId">
      <span style="margin-left:10px;font-size: large;"> ID</span>
      <el-input
        ref="ZoneId"
        v-model="item.id"
        style="color: black;"
        placeholder="Zone Id"
        name="ZoneId"
        type="text"
        tabindex="1"
        autocomplete="on"
        :readonly='true'
      /> </el-form-item
    ><el-form-item prop="ZoneName">
      <span style="margin-left:10px;font-size: large;"> Name</span>
      <el-input
        ref="ZoneName"
        v-model="item.name"
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
        v-model="item.description"
        style="color: black;"
        placeholder="Zone Description"
        name="ZoneType"
        type="text"
        tabindex="2"
        autocomplete="on"
      />
    </el-form-item>
    <!-- <el-form-item prop="label">
      <span style="margin-left:10px;font-size: large;"> Label</span>
      <el-input
        ref="ZoneType"
        v-model="ZoneForm.ZoneLabel"
        style="color: black;"
        placeholder="Label"
        name="Label"
        type="text"
        tabindex="2"
        autocomplete="on"
      />
    </el-form-item>
    <el-form-item prop="label">
      <el-checkbox label="Test Zone" style="display:block; font-size: large;">
      </el-checkbox>
    </el-form-item>
    <el-form-item prop="description">
      <span style="margin-left:10px;font-size: large;"> Description</span>
      <el-input
        ref="ZoneForm"
        v-model="ZoneForm.ZoneDescription"
        style="color: black;"
        placeholder="Description"
        name="ZoneDescription"
        type="textarea"
        tabindex="2"
        :rows="3"
        autocomplete="on"
      />
    </el-form-item> -->

    <!-- <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
        </el-tooltip> -->
    <el-button
      type="primary"
      style="width:48%;margin-bottom:10px;"
      @click="updateZoneEntity"
      >Update Zone</el-button
    >
    <el-button
      style="width:48%;margin-bottom:10px; background:red; color:white;"
      @click="deleteZoneEntity"
      >Delete Zone</el-button
    >
  </el-form>
</template>

<script>
import { updateZone, deleteZone } from '@/api/zone';

export default {
  name: 'ZoneHubDetails',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      ZoneForm: {
        ZoneName: '',
        ZoneType: '',
        ZoneLabel: '',
        ZoneDescription: '',
      },
    };
  },
  mounted: function() {},
  methods: {
    updateZoneEntity() {
      if (!this.item.name || this.item.name.length < 1) {
        this.$alert('Please input name');
        return;
      }
      if (!this.item.description || this.item.description.length < 1) {
        this.$alert('Please input description');
        return;
      }
      updateZone(this.item).then(response => {
        this.$emit('refreshUI');
      });
    },
    deleteZoneEntity() {
      deleteZone(this.item.id).then(response => {
        this.$emit('refreshUI');
      });
    },
  },
};
</script>
