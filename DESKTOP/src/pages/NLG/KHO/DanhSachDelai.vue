<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-10 top-title">
            Danh sách để lại
          </div>
          <q-btn
            color="primary"
            icon="assignment_return"
            :disable="!showEdit"
            label="Trả về"
            @click="confirmTrave = true"
          />
           <q-btn
            color="primary"
            icon="assignment_return"
            :disable="!showEdit"
            label="Nhập lại"
            @click="confirmMualai = true"
          />
        </div>
        <div class="row">
              <q-btn
                outline
                color="primary"
                icon="edit"
                :disable="!showEdit"
                label="Để lại"
                @click="goEdit"
              />
            </div>
      </q-card-section>
      <q-separator spaced />
      
      <q-card-section>
        <DxDataGrid
          :data-source="dataSource"
          :show-borders="true"
          :no-data-text="'Không có dữ liệu !'"
          :show-column-lines="true"
          :allow-column-resizing="true"
          @row-updated="update"
          key-expr="ID"
          :selection="{ mode: 'multiple' }"
          @selection-changed="onSelectionChanged"
        >
          <DxEditing 
        :allow-updating="true"
      />
          <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Danh sách để lại'"
          />
          <DxSearchPanel
            :visible="true"
            :placeholder="'Tìm kiếm'"
            :width="400"
          />
          <DxColumn
            caption="STT"
            data-field="ID"
            format="fixedPoint"
            alignment="center"
            width="50"
            cell-template="cellTemplate"
          />
          <DxColumn
            data-field="SOPHIEU"
            caption="Số Phiếu"
            alignment="center"
            width="120"
          />
          <DxColumn
            data-field="CREATED_AT"
            caption="Ngày nhập kho"
            alignment="center"
            width="100"
            data-type="date"
            format="dd/MM/yyyy"
          />
          <DxColumn caption="Qui Cách" alignment="center">
            <DxColumn
              caption="Dầy"
              data-field="DAY"
              format="fixedPoint"
              alignment="center"
              width="50"
            />
            <DxColumn
              caption="Rộng"
              data-field="RONG"
              format="fixedPoint"
              alignment="center"
              width="50"
            />
            <DxColumn
              caption="Dài"
              data-field="CAO"
              format="fixedPoint"
              alignment="center"
              width="50"
            />
          </DxColumn>
          <DxColumn
            data-field="SOBO"
            caption="Số bó"
            alignment="center"
            width="70"
          />
          <DxColumn
            data-field="SOTHANHBO"
            caption="Số thanh/bó"
            alignment="center"
            width="80"
          />
          <DxColumn
            data-field="KHOILUONG"
            caption="Khối lượng(m³)"
            format="##0.####"
            alignment="center"
            width="120"
          />

          <DxColumn data-field="NAME_NCC" caption="NCC" />
          <DxColumn data-field="BIENSOXE" caption="Biển số xe" />
          <DxColumn data-field="NOTE" caption="Ghi chú" width="120" />
          <DxSummary>
            <DxTotalItem
              column="ID"
              summary-type="count"
              value-format="fixedpoint"
              display-format="Tổng cộng : "
              show-in-column="CREATED_AT"
            />
            <DxTotalItem
              column="KHOILUONG"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
          </DxSummary>
          <template #cellTemplate="cell">
            <p>{{ cell.data.rowIndex + 1 }}</p>
          </template>
          <template #cellTemplateOverPlan="cell">
            <span style="font-weight:700;color:red" v-if="cell.data.value === 1"
              >Ngoài kế hoạch</span
            >
            <span v-else></span>
          </template>
        </DxDataGrid>
      </q-card-section>
    </q-card>
    <q-dialog v-model="confirmTrave" persistent>
      <q-card style="min-width:400px">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">
              Xác nhận trả về cho nhà cung cấp
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="trave"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
     <q-dialog v-model="confirmMualai" persistent>
      <q-card style="min-width:400px">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">
              Xác nhận mua lại cho nhà cung cấp
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="mualai"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxEditing,
  DxSummary,
  DxTotalItem
} from "devextreme-vue/data-grid";
import { showNotifySuccess, showNotifyError } from "../../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxExport,
    DxEditing,
    DxSummary,
    DxTotalItem
  },
  data() {
    return {
      dataSource: [],
      dupplicateNcc: [],
      showEdit: false,
      makho: null,
      year: null,
      phieu: 0,
      maphieu: 0,
      maphieuNL:0,
      phieuNL:0,
      dskhos: [],
      dataTrave: [],
      confirmTrave: false,
      confirmMualai: false
    };
  },
  created() {
      const today = new Date();
      const currentYear = today.getFullYear();
      this.year = currentYear;
    console.log('nguoi tao:',this.userInfo.account)
    this.makho = this.getKhoByAccount(this.userInfo);
    // this.loadkho();
    this.loadDelai();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("nlg", ["getKhoByAccount", "getAllKhos", "phieuNhapKhos"])
  },
  methods: {
    async trave() {
      console.log(this.dataTrave);
      const data2 = await this.$store.dispatch(
        "nlg/GET_TAO_PHIEU_TRAVE",
        this.dataTrave[0].MAKHO
      );
      if (!data2.data.length) this.maphieu = 1;
      else {
        for (let i = 0; i < data2.data.length; i++) {
          let vitri = data2.data[i].sophieu.trim().indexOf(".");
          this.phieu = parseInt(data2.data[i].sophieu.trim().slice(0, vitri));

          if (this.phieu > this.maphieu) {
            this.maphieu = this.phieu;
          }
        }
        this.maphieu++;
      }
      let cmonth = new Date().getMonth();

      const payload = {
        sophieutrave:
          this.maphieu + "." + (cmonth + 1)+''+this.year.toString().slice(2,4) + this.dataTrave[0].MAKHO,
        dataDelai: this.dataTrave,
        makho: this.dataTrave[0].MAKHO,
        CREATE_BY: this.userInfo.account,
        mancc: this.dataTrave[0].MA_NCC
      };
      const data = await this.$store.dispatch("nlg/TRA_VE", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.$router.push("/nlg-ds-tra-ve/");
      } else {
        showNotifyError();
      }
    },
    async goEdit() {
      this.$router.push({
        name: "edit-detail-nlg",
        params: { id: this.dataTrave[0].ID }
      });
    },
     async mualai() {
      console.log(this.dataTrave[0].MA_NCC);
      const data2 = await this.$store.dispatch(
        "nlg/GET_TAO_PHIEU_NHAPLAI",
        this.dataTrave[0].MAKHO
      );
      if (!data2.data.length) this.maphieuNL = 1;
      else {
        for (let i = 0; i < data2.data.length; i++) {
          let vitri = data2.data[i].sophieu.trim().indexOf("M");
          this.phieuNL = parseInt(data2.data[i].sophieu.trim().slice(0, vitri));

          if (this.phieuNL > this.maphieuNL) {
            this.maphieuNL = this.phieuNL;
          }
        }
        this.maphieuNL++;
      }
      let cmonth = new Date().getMonth();

      const payload = {
        sophieutrave:
          this.maphieuNL + "ML." + (cmonth + 1)+this.year+ this.dataTrave[0].MAKHO,
        dataDelai: this.dataTrave,
        makho: this.dataTrave[0].MAKHO,
        CREATE_BY: this.userInfo.account,
        mancc: this.dataTrave[0].MA_NCC
      };
      const data = await this.$store.dispatch("nlg/MUA_LAI", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.$router.push("/nlg-ds-mua-lai/");
      } else {
        showNotifyError();
      }
    },
     async update(e){
            
            const data = await this.$store.dispatch('nlg/EDIT_NHAP_KHO_NL',e.data)
            // console.log(e)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
    async loadkho() {
      const duppp = [];
      const data = await this.$store.dispatch("nlg/GET_DS_KHO");
      data.data.forEach(e => {
        duppp.push({
          text: (e.name = e.tenkho),
          value: e.makho
        });
      });
      this.dupplicateNcc = duppp;

      this.dskhos = data.data;
    },
    async loadDelai() {
      const data = await this.$store.dispatch("nlg/GET_DS_DELAI", this.makho);
      this.dataSource = data.data;
    },

    calculateTongThanh(rowData) {
      return rowData.SOBO * rowData.SOTHANHBO;
    },
    onSelectionChanged({ selectedRowsData }) {
      this.idSelect = selectedRowsData[0].ID;
      this.showEdit = true;
      this.dataTrave = selectedRowsData;
    },
    eventChonKho(e) {
      this.makho = e.value;
      this.loadDelai();
    }
  }
};
</script>

<style></style>
