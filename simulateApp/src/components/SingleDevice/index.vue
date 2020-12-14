<template>
  <el-card
    class="box-card"
    style=" width: 500px; float:left; min-height: 200px;"
  >
    <div slot="header" class="clearfix">
      <svg-icon
        style="margin-left:10px;font-size: large;"
        icon-class="example"
      />
      <span style="margin-left:10px;font-size: medium;">{{ item.name }} </span>
      <!-- deleteDeviceSimulation -->
      <el-button
        style="float:right;"
        type="primary"
        icon="el-icon-delete-solid"
        @click="deleteDeviceSimulation"
      >
      </el-button>
    </div>
    <div style="  white-space: break-spaces;">
      <span style="margin:0px 0px 10px 0px;display:block; font-size: medium;"
        >Status:
      </span>

      <el-select v-model="item.status" clearable filterable>
        <el-option label="Available to Connect" value="Available to Connect">
        </el-option>
        <el-option label="Connected" value="Connected"> </el-option>
        <el-option label="Disconnected" value="Disconnected"> </el-option>
      </el-select>
      <span style="margin:0px 0px 10px 0px;display:block; font-size: medium;"
        >Message:
      </span>
      <el-input
        class="inputKaban"
        style="min-width: 400px; font-size: large;"
        placeholder="Please input"
        v-model="item.message"
      ></el-input>
      <span style="margin:10px 0px 10px 0px;display:block; font-size: medium;"
        >Location Type:
      </span>
      <el-select
        v-model="item.locationType"
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
      <!-- <span style="margin:10px 0px 10px 0px;display:block; font-size: medium;"
        >Sensor Type:</span
      >
      <el-input
        class="inputKaban"
        style="min-width: 400px; font-size: large;"
        placeholder="Please input"
        v-model="item.sensorType"
      ></el-input> -->
      <span style="margin:10px 0px 10px 0px;display:block; font-size: medium;"
        >Device Group:</span
      >
      <el-select v-model="item.deviceGroup" filterable>
        <el-option label="Zone Input" value="Zone Input"> </el-option>
        <el-option label="Zone Output" value="Zone Output"> </el-option>
        <el-option label="Contact Sensor" value="Contact Sensor"> </el-option>
        <el-option label="Motion Sensor" value="Motion Sensor"> </el-option>
        <el-option label="Radar Sensor" value="Radar Sensor"> </el-option>
        <el-option label="Camera" value="Camera"> </el-option>
      </el-select>
      <!-- <el-button type="primary" icon="el-icon-share"> </el-button>
      <el-button type="primary" icon="el-icon-s-custom"> </el-button>
      <el-button type="primary" icon="el-icon-s-data"> </el-button>
      <el-button type="primary" icon="el-icon-delete-solid"> </el-button> -->
      <br />
      <el-button
        class="filter-item"
        type="primary"
        style="margin-top:20px;"
        icon="el-icon-s-promotion"
        @click="
          () => {
            showAddHUBDialog = true;
          }
        "
      >
        Sent Device Message Status
      </el-button>
    </div>
  </el-card>
</template>
<style scoped>
.box-card {
  width: 600px;
  max-width: 100%;
  margin: 5px auto;
}
.item-btn {
  margin-bottom: 15px;
  margin-left: 0px;
}
.block {
  padding: 25px;
}
</style>
<script>
import { getTags, getTagsById } from "@/api/tags";
import { deleteDeviceStatus } from "@/api/deviceStatus";
export default {
  data() {
    return {
      itemTags: [],

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
  props: {
    item: {
      type: Object,
      required: true
    },
    isDefine: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  watch: {
    item(val, old) {
      this.getTagsDeviceList();
    }
  },
  mounted: function() {
    this.getTagsDeviceList();
  },
  computed: {
    language() {
      if (this.$store.getters.language == null) {
        this.handleSetLanguage("ENG");
      }
      return this.$store.getters.language;
    }
  },
  methods: {
    deleteDeviceSimulation() {
      // this.saveChangesHub();
      if (!this.item.id) {
        // this.$store.dispatch("user/updateDeviceStatus", []);
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      deleteDeviceStatus(this.item.id)
        .then(response => {
          this.$emit("refreshUI");
        })
        .catch(() => {
          this.$alert("Remove Fail !!!");
        })
        .finally(() => {
          // clearInterval(this.runInterval);
          loading.close();
        });
    },
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch("app/setLanguage", lang);
      this.$message({
        message: "Switch Language Success",
        type: "success"
      });
    },

    getTagsDeviceList() {
      getTagsById(this.item.id).then(response => {
        this.itemTags = response.map(x => x.name)
          ? response.map(x => x.name)
          : [];
      });
    }
  }
};
</script>
