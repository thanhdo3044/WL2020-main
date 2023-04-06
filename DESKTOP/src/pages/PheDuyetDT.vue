<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="row" style="background-color: #daf8e1">
      <div class="col-6 text-blue text-bold" style="font-size: 18px">
        Định tuyến sản phẩm CBG
      </div>
    </div>
    <div class="row">
      <div class="col-5" style="padding-right: 5px">
        <q-card style="min-width: 70%">
          <q-table title="Cấu thành chưa duyệt" :data="data" :columns="columns" row-key="maso" selection="single"
            :selected.sync="selected" @update:selected="showDinhTuyen" />
        </q-card>
      </div>
      <div class="col-7" style="padding-left:5px ; ">
        <div v-show="isShowSelected">
          <q-card style="margin-bottom: 15px;">
            <q-table title="Cấu thành cũ" :data="dataDinhTuyenCu" :columns="columnsDinhTuyenCu" row-key="maso" />
          </q-card>
          <q-card>
            <q-table title="Cấu thành mới" :data="dataDinhTuyenMoi" :columns="columnsDinhTuyenMoi" row-key="maso" />
            <div class="q-pa-md q-gutter-sm" align="right">
              <q-btn color="positive" glossy label="Phê duyệt" @click="showDialogPheDuyet" />
              <q-btn color="deep-orange" glossy label="Từ chối" @click="showDialogTuChoiPheDuyet" />

            </div>
          </q-card>
        </div>
      </div>
    </div>
    <!-- xác nhận phê duyệt định tuyến-->
    <q-dialog v-model="isShowDialogPheDuyet">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Bạn chắc chắn muốn phê duyệt định tuyến : <label
              style="text-transform: uppercase;font-weight: bold;">{{selected == null ? null : selected[0].namesp}}
            </label>.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Ok" color="primary" @click="PheDuyet" />
          <q-btn flat label="Hủy" color="primary" v-close-popup @click="hideDialogPheDuyet" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Từ chối phê duyệt định tuyến-->
    <q-dialog v-model="isShowDialogTuChoiPheDuyet">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Bạn chắc chắn muốn từ chối phê duyệt định tuyến : <label
              style="text-transform: uppercase;font-weight: bold;">{{selected == null ? null : selected[0].namesp}}
            </label>.</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Ok" color="primary" @click="tuChoiPheDuyet" />
          <q-btn flat label="Hủy" color="primary" v-close-popup @click="hideDialogTuChoiPheDuyet" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {

  data() {
    return {
      columns: [
        { name: 'Mã số', align: 'left', label: 'Mã số', field: 'maso' },
        { name: 'Tên sản phẩm', align: 'left', label: 'Tên sản phẩm', field: 'namesp' },
        { name: 'Người sửa', align: 'left', label: 'Người sửa', field: 'updateBy' },
      ],
      data: [],
      columnsDinhTuyenCu: [
        { name: 'Mã số', align: 'left', label: 'Mã số', field: 'stepcode' },
        { name: 'Tên định tuyến', align: 'left', label: 'Tên', field: 'stepname' },
        { name: 'Thứ tự', align: 'left', label: 'Thứ tự', field: 'order' },
      ],
      dataDinhTuyenCu: [],
      columnsDinhTuyenMoi: [
        { name: 'Mã số', align: 'left', label: 'Mã số', field: 'stepcode' },
        { name: 'Tên định tuyến', align: 'left', label: 'Tên', field: 'stepname' },
        { name: 'Thứ tự', align: 'left', label: 'Thứ tự', field: 'order' },
      ],
      dataDinhTuyenMoi: [],
      selected: [{
        namesp: ''
      }],
      isShowSelected: false,
      allRouting: [],
      routingByItemID: [],
      allTempRouting: [],
      isShowDialogPheDuyet: false,
      isShowDialogTuChoiPheDuyet: false
    }
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("prod",
      [
        "getRoutingTemplate",
        "getAllRoutingTemplate",
        "getAllRouting",
        "pheDuyetDinhTuyen",
        "tuChoiPheDuyetDinhTuyen"
      ]),
    async loadData() {
      this.routingByItemID = await this.getRoutingTemplate();
      this.allTempRouting = await this.getAllRoutingTemplate()
      this.data = []
      this.routingByItemID.data.forEach(e => {
        this.data.push({
          idsp: e.ITEM_ID,
          maso: e.CODE,
          namesp: e.NAME,
          updateBy: e.LAST_NAME,
        })
      });
      this.allRouting = await this.getAllRouting()

    },
    async showDinhTuyen() {
      if (this.selected) {
        this.isShowSelected = true
      } else {
        this.isShowSelected = false
      }
      const routingById = this.allRouting.data.filter(f => f.ITEM_ID == this.selected[0].idsp)
      this.dataDinhTuyenCu = []
      routingById.forEach(e => {
        this.dataDinhTuyenCu.push({
          routingID: e.ID,
          idsp: e.ITEM_ID,
          idstep: e.STEP_ID,
          stepcode: e.StepCode,
          stepname: e.StepName,
          order: e.ORDER
        })
      });
      const tempByItemId = this.allTempRouting.data.filter(f => f.ITEM_ID == this.selected[0].idsp)
      console.log("tempByItemId : ")
      console.log(tempByItemId)
      this.dataDinhTuyenMoi = []
      tempByItemId.forEach(e => {
        this.dataDinhTuyenMoi.push({
          idroutingtemp: e.ID,
          idsp: e.ITEM_ID,
          idstep: e.STEP_ID,
          stepcode: e.CODE,
          stepname: e.NAME,
          order: e.ORDER,
          createdBy: e.CREATE_BY,
          createdDate: e.CREATE_DATE
        })
      });
    },
    showDialogPheDuyet() {
      this.isShowDialogPheDuyet = true
    },
    hideDialogPheDuyet() {
      this.isShowDialogPheDuyet = false
    },
    async PheDuyet() {
      let payload = []
      this.dataDinhTuyenMoi.forEach(e => {
        payload.push({
          idsp: e.idsp,
          idstep: e.idstep,
          order: e.order,
          createdBy: e.createdBy,
          createdDate: e.createdDate
        })
      });
      const data = await this.pheDuyetDinhTuyen(payload)
      if (data.meta.success) {
        this.isShowDialogPheDuyet = false
        this.isShowSelected = false
        this.loadData()
        this.$q.notify({
          message: 'Phê duyệt thành công',
          type: 'positive',
        })
      } else {
        this.$q.notify({
          message: 'Không thành công',
          type: 'negative',
        })
      }
    },
    showDialogTuChoiPheDuyet() {
      this.isShowDialogTuChoiPheDuyet = true
    },
    hideDialogTuChoiPheDuyet() {
      this.isShowDialogTuChoiPheDuyet = false
    },
    async tuChoiPheDuyet() {
      console.log('this.selected')
      console.log(this.selected)
      const payload = []
      payload.push({
        idsp: this.selected[0].idsp
      })
      const data = await this.tuChoiPheDuyetDinhTuyen(payload)
      if (data.meta.success) {
        this.isShowDialogTuChoiPheDuyet = false
        this.isShowSelected = false
        this.loadData()
        this.$q.notify({
          message: 'Từ chối thành công',
          type: 'positive',
        })
      } else {
        this.$q.notify({
          message: 'Không thành công',
          type: 'negative',
        })
      }
    }
  },
  async created() {
    this.loadData();
  },
}
</script>
