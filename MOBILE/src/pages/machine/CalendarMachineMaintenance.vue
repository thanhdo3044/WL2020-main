<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto text-white">Lịch bảo dưỡng máy nhà máy : {{ factory.label }}</div>
      </div>
      <div class="col-12 q-pa-sm">
        <q-select dark label-color="amber" filled v-model="factory" label="Chọn nhà máy" :options="options"
          @input="filterByFactory" />
      </div>
      <div class="col-12 q-pa-sm">
        <q-input dark label-color="amber" fill-mask mask="####-##-## ##:##" class="col-12 q-pa-sm" filled
          label="Thời gian bắt đầu bảo dưỡng" v-model="startTime">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date mask="YYYY-MM-DD HH:mm" v-model="startTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <q-separator spaced />
      <div class="col-12 q-pa-sm">
        <div class="col-10" align-v="center">
          <q-btn color="primary" style="width : 50%;" label="Tìm kiếm" @click="onSearch" />
        </div>
      </div>
    </div>
    <div>
      <div class="col-12 q-pa-sm" v-for="(data, key) in datas" :key="key">
        <q-card class="my-card text-white" style="background: #607883">
          <div class="q-pa-sm">
            <q-select dark label-color="amber" :value="data.MACHINE_ID" label="Mã máy" readonly />
          </div>
          <div class="row">
            <div class="q-pa-sm" style="color: orange; font-weight: bold; display: block">Tên máy:</div>
            <div class="q-pa-sm" style="color: white;font-weight: bold; display: block">{{ data.MACHINE_NAME }}</div>
          </div>
          <div class="q-pa-sm">
            <q-select dark label-color="amber" :value="data.START_TIME" label="Thời gian bắt đầu bảo dưỡng" readonly>
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-select>
          </div>
          <div class="q-pa-sm">
            <q-select dark label-color="amber" :value="data.DESCRIPTION" label="Lý do bảo dưỡng" readonly />
          </div>
          <div class="q-pa-sm">
            <q-select dark label-color="amber" :value="data.INTEND_TIME" label="Thời gian dự kiến hoàn thành" readonly>
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-select>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { DxDataGrid, DxColumn } from "devextreme-vue/data-grid";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
export default {
  components: { DxDataGrid, DxColumn },
  data() {
    return {
      datas: [],
      factory: [],
      startTime: null,
      intendTime: null,
      initialPagination: {
        rowsPerPage: 15
      },
      options: [
        {
          label: "NM CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "NM CBG Yên Sơn 1",
          factoryId: 102340,
          code: "YS1",
        },

        {
          label: "NM CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
        },
      ],

    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  async created() {
    this.checkAccountInfor()
  },
  methods: {
    ...mapActions("machine", ["getMachineByFactoryId", "getMachineMaintenance"]),
    async getMachineMaintain() {
    },
    async filterByFactory() {
      this.datas = await this.getMachineMaintenance();
      this.datas = this.datas.filter(f => f.FACTORY_ID == this.factory.factoryId)
    },
    async onSearch() {
      this.datas = await this.getMachineMaintenance();
      if (this.factory.length == 0) {
        this.datas = [];
        this.$q.notify({
          message: 'Vui lòng chọn nhà máy',
          color: 'negative'
        })
      } else if (this.startTime == null) {
        this.datas = [];
        this.$q.notify({
          message: 'Vui lòng chọn thời gian bảo dưỡng',
          color: 'negative'
        })
      } else {
        this.datas = this.datas.filter(f => f.FACTORY_ID == this.factory.factoryId && f.START_TIME >= moment(this.startTime).format('DD-MM-YYYY'))
      }
    },
    async checkAccountInfor() {
      console.log('this.userInfo.id', this.userInfo)
      if (this.userInfo.factoryId == 100000) {
        this.factory = {
          label: "NM CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        }
      } else if (this.userInfo.factoryId == 102340 || this.userInfo.factoryId == 100004) {
        this.factory = {
          label: "NM CBG Yên Sơn 1",
          factoryId: 102340,
          code: "YS1",
        }
      }
      else if (this.userInfo.factoryId == 102366) {
        this.factory = {
          label: "NM CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
        }
      }
      this.filterByFactory();
    }
  },
};
</script>
<style>

</style>