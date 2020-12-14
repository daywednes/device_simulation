<template>
  <div class="app-container" style=" background-color: rgb(240, 242, 245);">
    <el-row
      style="background:#fff;padding:10px 10px;margin:10px; text-align:left;"
      ><el-input
        placeholder="Search"
        prefix-icon="el-icon-search"
        style="width: 30%; margin-right: 10px;"
        v-model="textSearch"
      >
      </el-input>
    </el-row>
    <el-row style="background:#fff;padding:30px;margin:10px; text-align:left;">
      <h1>All Activity For {{ orgName }}</h1>
      <hr />
      <br />
      <el-col :span="12">
        <el-timeline  style="max-height: 65vh;overflow: auto; padding:10px;">
          <el-timeline-item
            v-for="(item, index) of timelineFilter"
            :key="index"
            :lastTimeUpdate="item.lastTimeUpdate"
            placement="top"
          >
            <el-card>
              <el-row>
                <el-col :xs="4" :sm="4" :lg="4">
                  <img
                    v-if="logo"
                    :src="logo"
                    style="float: left; height: 50px;"
                  />
                </el-col>
                <el-col :xs="12" :sm="12" :lg="12">
                  {{ item.name }}
                  <br />
                  {{ item.description }}
                </el-col>
                <el-col :xs="8" :sm="8" :lg="8">
                  {{ item.lastTimeUpdate }}
                </el-col>
              </el-row>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-col>
      <el-col :span="12" style="float:right">
        <el-row style="margin :20px; font-size: medium;">
          <span class="demonstration"
            >Select a date to view or click and drag for a date range
          </span>
          <br />
          <el-date-picker
            v-model="daterange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :picker-options="pickerOptions"
            @change="searchActivity"
          >
          </el-date-picker>
        </el-row>
        <el-row style="margin :20px; font-size: medium;">
          <span class="demonstration">Filter by Hub </span>
          <br />
          <el-select
            v-model="valueHub"
            clearable
            filterable
            placeholder="All Hubs"
            @change="change"
          >
            <el-option
              v-for="item in hubs"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-row>
        <el-row style="margin :20px; font-size: medium;">
          <span class="demonstration">Filter by Zone Interface </span>
          <br />
          <el-select
            v-model="valueZone"
            clearable
            filterable
            placeholder="All Zone Interface"
          >
            <el-option
              v-for="item in zones"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import logoSimpleThings from '@/assets/img_src/simple_things_logo.png';
import { getActivityById, getActivity } from '@/api/activity';
import { getZonesHub } from '@/api/zone';
export default {
  name: 'Activity',
  computed: {
    orgName() {
      if (this.$store.getters.orgId == null) {
        this.$alert('empty');
      }
      let orgId = this.$store.getters.orgId;
      let orgs = this.$store.getters.orgs;
      return orgs && orgs.length > 0
        ? orgs.find(x => x.id == orgId).name
        : null;
    },
    hubs() {
      return this.$store.getters.hubs;
    },
    timeline() {
      return this.$store.getters.timeline;
    },
  },
  watch: {
    textSearch(val) {
      this.searchActivity(this.daterange);
    },
    timeline(val) {
      this.getFullActitivy();
      this.searchActivity(this.daterange);
    },
  },
  mounted: function() {
    this.getActivityList();
    this.getFullActitivy();
  },
  data() {
    return {
      logo: logoSimpleThings,
      daterange: null,
      pickerOptions: {
        shortcuts: [
          {
            text: 'Last week',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: 'Last month',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: 'Last 3 months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      options: [
        {
          value: 'Option1',
          label: 'Option1',
        },
        {
          value: 'Option2',
          label: 'Option2',
        },
        {
          value: 'Option3',
          label: 'Option3',
        },
        {
          value: 'Option4',
          label: 'Option4',
        },
        {
          value: 'Option5',
          label: 'Option5',
        },
      ],
      valueHub: null,
      valueZone: null,
      textSearch: null,
      zones: [],
      timelineFilter: [],
    };
  },
  methods: {
    getActivityList() {
      this.$store.dispatch('user/updateActivity');
    },
    change(val) {
      this.valueZone = null;
      this.zones = null;
      this.textSearch = null;
      this.daterange = null;
      this.filterByHub(val);
      getZonesHub(val).then(response => {
        this.zones = response;
      });
    },
    searchActivity(val) {
      this.filterByHub(this.valueHub);
      if (val) {
        let fromDate = Date.parse(val[0]);
        let toDate = Date.parse(val[1]);
        this.timelineFilter = this.timelineFilter.filter(
          x =>
            Date.parse(x.lastTimeUpdate) >= fromDate &&
            Date.parse(x.lastTimeUpdate) <= toDate,
        );
      }
      if (this.textSearch) {
        this.timelineFilter = this.timelineFilter.filter(
          x =>
            x.name
              .trim()
              .toUpperCase()
              .includes(this.textSearch.toUpperCase()) ||
            x.description
              .trim()
              .toUpperCase()
              .includes(this.textSearch.toUpperCase()),
        );
      }
    },
    filterByHub(val) {
      if (val) {
        this.timelineFilter = this.timeline.filter(x => x.hubId == val);
      } else {
        this.getFullActitivy();
      }
    },
    filterByZone(val) {
      if (val) {
      }
    },
    getFullActitivy() {
      this.timelineFilter = [];
      this.timelineFilter = [...this.timeline];
    },
  },
};
</script>
