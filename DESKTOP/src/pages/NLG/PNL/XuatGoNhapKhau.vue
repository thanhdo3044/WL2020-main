<template>
  <q-page class="q-pa-md">
    <q-card-section>
      <q-btn
        color="red"
        icon="assignment_return"
        label="Xuất gỗ"
        @click="confirmphieu = true"
      />
      <q-btn
        color="primary"
        icon="assignment_return"
        label="Nhập gỗ"
        @click="confirmNhapPhieu = true"
      />
      <div class="row">
        <div class="col-2">
          <q-select
            color="grey-3"
            label-color="orange"
            filled
            v-model="department"
            :options="departments"
            label="Chọn công đoạn"
            @input="onChange"
            dense
          />
        </div>
        <div class="col-2">
          <q-input
            color="grey-3"
            readonly
            label-color="orange"
            outlined
            v-model="code"
            label="Mã biên bản"
            dense
          >
            <template v-slot:append>
              <q-icon name="work" color="orange" />
            </template>
          </q-input>
        </div>
        <div class="col-2"></div>
        <q-input
          dense
          readonly
          class="col-2"
          filled
          label="Ngày nhập"
          v-model="date"
        >
        </q-input>
        <q-input
          dense
          class="col-2"
          filled
          label="Biển số xe"
          v-model="licensePlates"
        >
        </q-input>
        <q-input
          dense
          class="col-2"
          filled
          label="Mã phiếu"
          v-model="formCode"
        >
        </q-input>
      </div>
    </q-card-section>
    <q-card-section>
      <DxDataGrid
        id="gridContainer"
        :data-source="dataSource"
        :show-borders="true"
        :word-wrap-enabled="true"
        :show-row-lines="true"
        :show-column-lines="true"
        @row-updating="rowUpdating"
        :no-data-text="'Không có dữ liệu'"
      >
        <DxFilterRow :visible="true" />
        <DxHeaderFilter :visible="true" />
        <DxEditing :allow-updating="true" mode="cell" />
        <DxScrolling mode="infinite" />
        <DxColumn data-field="NAME" caption="Nhóm Quy Cách" width="400" />
        <DxColumn
          data-field="HEIGHT"
          caption="Cao"
          width="80"
          alignment="center"
        />
        <DxColumn
          data-field="WIDTH"
          caption="Rộng"
          width="80"
          alignment="center"
        />
        <DxColumn
          data-field="LENGTH"
          caption="Dài"
          width="80"
          alignment="center"
        />
        <DxColumn
        v-if="!isNhapKhau"
          data-field="QUANTITY"
          caption="SL cấp thực tế"
          width="100"
          alignment="center"
        >
          <DxValidationRule type="required" />
        </DxColumn>
        <DxColumn
        v-if="!isNhapKhau"
          data-field="KL"
          caption="KL cấp thực tế"
          width="100"
          alignment="center"
          format="#,##0.######"
          :calculate-cell-value="calculateTongThanh"
        />
        <DxColumn
        v-if="isNhapKhau"
          data-field="KL"
          caption="KL cấp thực tế"
          width="100"
          alignment="center"
          format="#,##0.######"
        />
        <DxColumn
          data-field="destinationId"
          caption="Công đoạn nhận - nguồn nhập"
          width="200"
        >
          <DxLookup
            :data-source="congdoannhans"
            display-expr="label"
            value-expr="id"
          />
          <DxValidationRule type="required" />
        </DxColumn>
        <DxColumn data-field="note" caption="Ghi chú" />
      </DxDataGrid>
    </q-card-section>
    <q-dialog v-model="confirmphieu" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">Xác nhận xuất gỗ</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="xuatGo"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmNhapPhieu" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">Xác nhận nhập gỗ</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="xuatGo"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../../ultils";
import moment from "moment";
import {
  DxDataGrid,
  DxColumn,
  DxScrolling,
  DxEditing,
  DxLookup,
  DxValidationRule,
  DxFilterRow,
  DxHeaderFilter,
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxScrolling,
    DxEditing,
    DxLookup,
    DxValidationRule,
    DxFilterRow,
    DxHeaderFilter,
  },
  data() {
    return {
      dataSource: [],
      code: null,
      confirmphieu: false,
      confirmNhapPhieu: false,
      licensePlates: '',
      formCode: '',
      isNhapKhau: false,
      department: null,
      departments: [
        {
          label: "Kho BTP (TH)",
          value: 102628,
        },
        {
          label: "Kho gỗ nhập khẩu (TH)",
          value: 102629,
        },
      ],
      date: moment().format("DD/MM/YYYY"),
      listXuatGo: [],
      congdoannhans: [
        // {
        //   label: "Nhà máy CBG Quang Minh",
        //   id: 102427,
        // },
        {
          label: "Nhà máy CBG Thuận Hưng",
          id: 100000,
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 100004,
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 100005,
        },
        {
          label: "Khác",
          id: 199999,
        },
      ],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  created() {
    this.onChange();
  },
  methods: {
    ...mapActions("nlg", [
      "getCodeInXuatGo",
      "getItemInXuatGoNhapKhau",
      "getItemInXuatGoBTP",
      "insertXuatGoNhapKhau",
    ]),
    async onChange() {
      // format TH-000001
      let data = await this.getCodeInXuatGo();
      console.log(data.data);
      if (data.data.length === 0) {
        this.code = "NK-000001";
        console.log("code: ", this.code);
      } else {
        let number = data.data[0].number;
        let length = number.length;
        number = number.substring(length - 6, number.length);
        console.log("number", number);
        number = parseInt(number);
        number = number + 1;
        let value = "";
        if (number < 10) {
          value = "00000" + number.toString();
        } else if (number < 100) {
          value = "0000" + number.toString();
        } else if (number < 1000) {
          value = "000" + number.toString();
        } else if (number < 10000) {
          value = "00" + number.toString();
        } else if (number < 100000) {
          value = "0" + number.toString();
        } else {
          value = number.toString();
        }
        this.code = "NK-" + value;
      }
      this.dataSource = [];
      if(this.department.value === 102629){
        let data = await this.getItemInXuatGoNhapKhau();
       this.dataSource = data.data;
       this.isNhapKhau = true;
      }else{
        let data = await this.getItemInXuatGoBTP();
       this.dataSource = data.data;
       this.isNhapKhau = false;
      }
    },
    async rowUpdating(e) {
      console.log("rowUpdating", e);
      console.log("e.oldData.QUANTITY", e.oldData.QUANTITY);
      console.log("e.newData.destinationId", e.newData.destinationId);
      if (
        e.newData.QUANTITY != 0 &&
        e.newData.destinationId != null &&
        this.department != null
      ) {
        console.log("step2");
        if(this.isNhapKhau){
          const element = {
          itemId: e.oldData.ID,
          length: e.oldData.LENGTH,
          width: e.oldData.WIDTH,
          height: e.oldData.HEIGHT,
          volumn: e.oldData.VOLUMN,
          destinationId: e.newData.destinationId,
          quantity: null,
        };
        this.listXuatGo.push(element);
        }else{
          const element = {
          itemId: e.oldData.ID,
          length: e.oldData.LENGTH,
          width: e.oldData.WIDTH,
          height: e.oldData.HEIGHT,
          volumn: e.newData.QUANTITY * e.oldData.VOLUMN,
          destinationId: e.newData.destinationId,
          quantity: e.newData.QUANTITY,
        };
        this.listXuatGo.push(element);
        }
        
        console.log("listXuatGo ", listXuatGo);
      }
    },
    calculateTongThanh(rowData) {
      if (rowData.LENGTH > 0) {
        rowData.KL = rowData.VOLUMN * rowData.QUANTITY;
      }
      return rowData.KL;
    },
    async xuatGo() {
      if (this.department == null) {
        this.$q.notify({
          message: "Bạn chưa chọn công đoạn",
          color: "purple",
          icon: "announcement",
        });
      } else {
        const payload = {
          week: moment().week(),
          year: moment().year(),
          number: this.code,
          accountId: this.userInfo.id,
          factoryId: this.userInfo.factoryId,
          sourceId: this.department.value,
          licensePlates: this.licensePlates,
          formCode: this.formCode,
          xuatGos: this.listXuatGo,
        };
        if (this.confirmphieu) {
          payload.xuatNhap = "xuat";
        } else {
          payload.xuatNhap = "nhap";
        }
        const result = await this.insertXuatGoNhapKhau(payload);
        if (result.meta.success) {
          this.listXuatGo = [];
          this.dataSource = [];
          this.department = null;
          this.onChange();
          
          showNotifySuccess("Tạo thành công !");
        } else {
          showNotifyError();
        }
      }
    },
  },
};
</script>

<style>
#gridContainer {
  height: 800px;
}
</style>