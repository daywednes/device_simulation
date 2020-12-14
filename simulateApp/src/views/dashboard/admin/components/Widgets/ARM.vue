<template>
  <div class="chart-wrapper" style="overflow: auto;">
    <div v-if="isBeARM">
      DISARMED
      <br />
      <img class="img-circle" style="background: #13ce66;margin:10px;" />
      <p>Ready to Arm</p>
      <el-button
        style="font-size: large; padding: 10px 0px; width:240px;"
        type="primary"
        round
        @click="
          () => {
            activeScreen = 0;
            dialogVisible = true;
          }
        "
        >ARM</el-button
      >
    </div>
    <div v-if="isBeDISARMED">
      ARMED
      <!-- [ AWAY, STAY OR SLEEP ] -->
      <br />
      <img class="img-circle" style="background: RED; margin:10px;" />

      <p>[ Date and Time Arrived ]</p>
      <el-button
        style="font-size: large; padding: 10px 0px; width:240px;"
        type="primary"
        round
        @click="
          () => {
            activeScreenDISARMED = 1;
            dialogVisibleDISARMED = true;
          }
        "
        >DISSARM</el-button
      >
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      append-to-body
      style="text-align: center"
    >
      <!-- Select mode -->
      <div v-if="activeScreen == 0">
        <h1>CHOOSE AN ARMING MODE</h1>
        <br />
        <el-button
          style="font-size: large; padding: 10px 0px; width:240px;"
          type="primary"
          round
          @click="
            () => {
              activeScreen = 1;
              publishMode = 'away';
            }
          "
          >AWAY</el-button
        >
        <p>All sensors trigger alarm</p>
        <el-button
          style="font-size: large; padding: 10px 0px; width:240px;"
          type="primary"
          round
          @click="
            () => {
              activeScreen = 1;
              publishMode = 'stay';
            }
          "
          >STAY</el-button
        >
        <p>only stay mode sensors trigger alarm</p>
        <el-button
          style="font-size: large; padding: 10px 0px; width:240px;"
          type="primary"
          round
          @click="
            () => {
              activeScreen = 1;
              publishMode = 'sleep';
            }
          "
          >SLEEP</el-button
        >
        <p>sleep mode sensors trigger alarm with no entry delay</p>
      </div>

      <!-- Enter Password -->
      <div v-if="activeScreen == 1">
        <h1>ENTER YOUR PIN</h1>
        <div class="input-wrapper">
          <PincodeInput :secure="true" v-model="code" />
        </div>
        <br />
        <el-button
          style="font-size: large; padding: 10px 0px; width:240px;"
          type="primary"
          round
          @click="
            () => {
              activeScreen = 2;
            }
          "
          >NEXT</el-button
        >
      </div>

      <!-- Custom Arm -->
      <div v-if="activeScreen == 2">
        <h3>ARM BLOCKING ZONES MUST BE CLEARED OR BYPASSED BEFORE ARMING</h3>

        <div class="container">
          <img class="img-circle" style="background: red; " />
          <div class="centered">
            <countTo
              style="font-size: xx-large; color white"
              ref="countDown"
              :startVal="startVal"
              :decimals="0"
              :endVal="endVal"
              :duration="duration"
              :autoplay="true"
              :useEasing="false"
              @callback="finishARM"
            ></countTo>
          </div>
        </div>
        <!-- <el-button
          style="font-size: large; padding: 10px 0px; margin:10px; width:100px;"
          type="warning"
          round
          @click="startCountDown"
          >Start</el-button
        >
        <br /> -->
        <el-button
          style="font-size: large; padding: 10px 0px; width:300px;"
          type="primary"
          round
          @click="pauseResume"
          >Cancel</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisibleDISARMED"
      width="50%"
      :before-close="handleClose"
      append-to-body
      style="text-align: center"
    >
      <!-- Enter Password -->
      <div v-if="activeScreenDISARMED == 1">
        <h1>ENTER YOUR PIN</h1>
        <div class="input-wrapper">
          <PincodeInput :secure="true" v-model="code" />
        </div>
        <br />
        <el-button
          style="font-size: large; padding: 10px 0px; width:240px;"
          type="primary"
          round
          @click="finishDISARM"
          >NEXT</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
div.vue-pincode-input-wrapper {
}

input.vue-pincode-input {
}
.container {
  position: relative;
  text-align: center;
  color: white;
}

.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.img-circle {
  margin: 20px;
  border-radius: 50%;
  width: 120px;
  height: 120px;
}
p {
  font-size: small;
  margin: 5px;
}
</style>
<script>
import countTo from 'vue-count-to';
import PincodeInput from 'vue-pincode-input';
import logoSimpleThings from '@/assets/img_src/simple_things_logo.png';
import { updateautomationsByName, getAutomations } from '@/api/automations';
import Vue from 'vue';
export default {
  components: { countTo, PincodeInput },
  data() {
    return {
      startVal: 5,
      endVal: 0,
      duration: 5000,
      activeScreen: 0,
      activeScreenDISARMED: 0,
      dialogVisibleDISARMED: false,
      code: '',
      publishMode: '',
      dialogVisible: false,
      isBeARM: true,
      isBeDISARMED: false,
      innerVisible: false,
      logo: logoSimpleThings,
      items: [
        {
          icon: 'Front-door',
          name: 'Front-door',
          status: 'Opened',
          time: '1:22p',
        },
        {
          icon: 'Front-door',
          name: 'Front-door',
          status: 'Closed',
          time: '2:34p',
        },
        {
          icon: 'Bedroom Window',
          name: 'Bedroom Window',
          status: 'Opened & Closed',
          time: '3:40p',
        },
        {
          icon: 'Drive Way',
          name: 'Face Detected',
          status: 'Opened',
          time: '5:22p',
        },
        {
          icon: 'Drive Way',
          name: 'Face Detected',
          status: 'Closed',
          time: '5:42p',
        },
      ],
    };
  },
  watch: {
    orgId(val, old) {
      this.checkStatus();
    },
  },
  mounted() {
    this.checkStatus();
  },
  computed: {
    orgId() {
      if (this.$store.getters.orgId == null) {
        this.$alert('empty');
      }

      return this.$store.getters.orgId;
    },
  },

  methods: {
    checkStatus() {
      getAutomations(this.orgId).then(response => {
        response.forEach(row => {
          console.log(row);
          if (row.name == 'stay' && row.activated == true) {
            this.isBeARM = false;
            this.isBeDISARMED = true;
            this.publishMode = 'stay';
            return;
          }

          if (row.name == 'away' && row.activated == true) {
            this.isBeARM = false;
            this.isBeDISARMED = true;
            this.publishMode = 'away';
            return;
          }

          if (row.name == 'sleep' && row.activated == true) {
            this.isBeARM = false;
            this.isBeDISARMED = true;
            this.publishMode = 'sleep';
            return;
          }
        });
      });
    },
    startCountDown() {
      this.$refs.countDown.start();
    },
    async finishARM() {
      const loadingAutomation = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });

      updateautomationsByName({
        name: this.publishMode,
        description: this.publishMode,
        activated: true,
        orgId: this.orgId,
      })
        .then(response => {
          this.isBeARM = false;
          this.isBeDISARMED = true;
          this.dialogVisible = false;
          response.event = 'update';
          console.log(response);
          Vue.$wamp.publish('io.crossbar.demo.pubsub.404893', [
            JSON.stringify(response),
          ]);
        })
        .catch(mess => {
          this.$alert('This organization did not set up this alarm mode');
        })
        .finally(() => {
          loadingAutomation.close();
        });
    },
    async finishDISARM() {
      const loadingAutomation = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });

      updateautomationsByName({
        name: this.publishMode,
        description: this.publishMode,
        activated: false,
        orgId: this.orgId,
      })
        .then(response => {
          this.isBeARM = true;
          this.isBeDISARMED = false;
          this.dialogVisibleDISARMED = false;
          response.event = 'update';
          console.log(response);
          Vue.$wamp.publish('io.crossbar.demo.pubsub.404893', [
            JSON.stringify(response),
          ]);
        })
        .catch(mess => {
          this.$alert('This organization did not set up this alarm mode');
        })
        .finally(() => {
          loadingAutomation.close();
        });
    },
    pauseResume() {
      this.dialogVisible = false;
      this.$refs.countDown.pauseResume();
    },
    updateStatus(status) {
      const loadingAutomation = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      updateautomationsByName({
        name: 'away',
        description: 'away',
        activated: status,
        orgId: this.orgId,
      })
        .then(response => {
          return true;
        })
        .catch(mess => {
          this.$alert('This organization did not set up this alarm mode');
          return false;
        })
        .finally(() => {
          loadingAutomation.close();
        });
    },
    handleClose(done) {
      this.$confirm('Are you sure to close this dialog?')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  },
};
</script>
