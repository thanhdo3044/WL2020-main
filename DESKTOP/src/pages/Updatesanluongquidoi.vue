<template>
  <q-page>
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-9 text-blue text-bold" style="font-size: 18px">
          Cập nhật tỷ lệ công đoạn và đơn giá sản phẩm (USD)
        </div>
        <div class="col-3" lign="right" style="font-size: 16px">
          <DateBox
            :value="date"
            :onChange="chonNgay"
            :displayFormat="'dd/MM/yyyy'"
            :title="'Ngày áp dụng:'"
            :width="10"
          />
        </div>
      </div>
    </div>
    <q-card>
      <div class="row">
        <!-- <q-select
            class="col-12 col-md-2 q-pa-sm"
            label-color="orange"
            dense
            filled
            @input="changeFactory"
            v-model="idDepartment"
            :options="options"
            label="Chọn nhà máy"
          /> -->
        <q-input
          label="Năm"
          class="col-12 col-md-1 q-pa-sm"
          label-color="orange"
          v-model.number="year"
          @input="loadData"
          type="number"
          filled
          dense
        />
        <label>
          <input
            v-show="capnhat"
            style="width: 150px"
            type="file"
            id="file"
            ref="file"
            @change="onChange"
            class="custom-file-input"
          />
        </label>
        <q-btn
          v-show="capnhat"
          class="col-1 q-ml-sm"
          style="height: 42px; margin-top: 8px; width: 120px"
          color="positive"
          outlined
          label="Cập nhật"
          @click="confirmphieu = true"
        />
        <q-btn
          v-show="xoahs"
          class="col-1 q-ml-sm"
          style="height: 42px; margin-top: 8px; width: 120px"
          color="red"
          outlined
          label="Thêm mới"
          @click="confirmphieuxoa = true"
        />
        <q-btn
          style="height: 42px; margin-top: 8px; width: 180px; margin-left: 10px"
          color="positive"
          label="Nhập tỷ giá USD"
          @click="loadTYGIA"
        />
        <q-btn
          style="height: 42px; margin-top: 8px; width: 180px; margin-left: 10px"
          color="positive"
          label="Cập nhật TLCD"
          @click="capnhatCD"
        />
        <q-btn
          style="height: 42px; margin-top: 8px; width: 180px; margin-left: 10px"
          color="positive"
          label="Cập nhật PUA"
          @click="capnhatPUA"
        />
              <q-btn
          style="height: 42px; margin-top: 8px; width: 180px; margin-left: 10px"
          color="positive"
          label="Cập nhật sấy phôi"
          @click="capnhatSP"
        />
      </div>

      <q-card-section>
        <DxDataGrid
          id="gridContainer"
          :data-source="dataSource"
          :show-row-lines="true"
          :show-column-lines="true"
          :show-borders="true"
          :word-wrap-enabled="true"
        >
          <DxGroupPanel
            :visible="true"
            :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
          />
          <DxEditing :allow-updating="true" mode="cell" />
          <DxSorting mode="none" />
          <!-- <DxScrolling mode="infinite" /> -->
          <DxExport :enabled="true" file-name="sản lượng" />
          <DxFilterRow :visible="true" />
          <DxHeaderFilter :visible="true" />
          <DxPager
            :visible="true"
            :allowed-page-sizes="pageSizes"
            :display-mode="displayMode"
            :show-page-size-selector="showPageSizeSelector"
            :show-info="true"
            :show-navigation-buttons="showNavButtons"
          />
          <DxSearchPanel
            :visible="true"
            :width="240"
            placeholder="Tìm kiếm..."
          />
          <!-- <DxColumn
            data-field="TT"
            caption="STT"
            :allowEditing="false"
            :width="60"
             sort-order="asc"
            :group-index="0"
            :visible="false"
            css-class="rowBG"
            
          /> -->
          <DxColumn
            data-field="STEP_NAME"
            caption="Công đoạn"
            :width="320"
            css-class="rowBG"
            sort-order="asc"
            :group-index="1"
          />
          <DxColumn
            data-field="ITEM_ID"
            :width="120"
            caption="ID"
            alignment="center"
            :allowEditing="false"
            css-class="rowBG"
          />
          <DxColumn
            data-field="sanpham"
            :width="420"
            caption="Sản phẩm"
            alignment="left"
            :allowEditing="false"
            css-class="rowBG"
          />

          <DxColumn
            data-field="TYLE"
            :width="120"
            caption="Tỷ lệ công đoạn"
            :allowEditing="false"
            alignment="center"
            css-class="rowBG"
          />
            <DxColumn
            data-field="NgayapdungTLCD"
            caption="Ngày áp dụng TLCD"
            alignment="center"
            format="dd/MM/yyyy"
            dataType="date"
            :width="150"
            :allowEditing="false"
          />
           <DxColumn
            data-field="CNTYLE"
            :width="120"
            caption="Cập nhật tỷ lệ công đoạn"
            alignment="center"
            css-class="rowBG"
          />
          <DxColumn
            data-field="PUA"
            :width="120"
            caption="PUA"
            :allowEditing="false"
            alignment="center"
            css-class="rowBG"
          />
          <DxColumn
            data-field="NgayapdungPUA"
            caption="Ngày áp dụng PUA"
            alignment="center"
            format="dd/MM/yyyy"
            dataType="date"
            :width="150"
            :allowEditing="false"
          />
          <DxColumn
            data-field="CNPUA"
            :width="120"
            caption="Cập nhật PUA"
            alignment="center"
            css-class="rowBG"
          />
        </DxDataGrid>
        <q-dialog v-model="confirmphieu" persistent>
          <q-card style="min-width: 400px">
            <q-card-section class="row items-center">
              <div class="row">
                <div class="col-12 top-title text-positive">
                  Xác nhận cập nhập tỷ lệ quy đổi
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn label="Hủy" color="orange" v-close-popup />
              <q-btn
                label="Đồng ý"
                @click="nhaphesoquydoi"
                color="positive"
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog v-model="showNhaptigiaUSD" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6 text-blue">Nhập tỷ giá USD</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                label="Tỷ giá USD"
                label-color="amber"
                v-model.number="heSo"
                type="number"
                outlined
              />
            </q-card-section>
            <q-card-section class="q-pt-none">
              <DxDataGrid
                :data-source="dataUSD"
                :word-wrap-enabled="true"
                :show-borders="true"
                :show-row-lines="true"
                :hover-state-enabled="true"
                key-expr="ID"
              >
                <DxColumn
                  :width="150"
                  data-field="CREATED_AT"
                  caption="Ngày áp dụng"
                />
                <DxColumn
                  :width="150"
                  data-field="TY_GIA_USD"
                  caption="Tỷ giá"
                />
              </DxDataGrid>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn color="positive" @click="addTYGIA" label="Thêm" />
              <q-btn color="orange" label="Hủy" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
          <q-dialog v-model="showNhapSP" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6 text-blue">Nhập đơn giá sấy phôi</div>
            </q-card-section>
             <q-card-section class="q-pt-none">
                 <div
           class="col-6 cursor-pointer text-blue text-bold"
          style="font-size: 18px"
          align="left"
          @click="showChooseDate = true"
        > Ngày áp dụng: 
   <span class="text-amber-14">{{ tuNgay }}</span>
                 </div>
           </q-card-section>
              <q-card-section class="q-pt-none">
              <q-input
                label="Đơn giá sấy phôi"
                label-color="amber"
                v-model.number="DgSp"
                type="number"
                outlined
              />
            </q-card-section>
                     <q-card-section class="q-pt-none">
             <q-select
        outlined
        label-color="orange"
        v-model="idDepartment"
        :options="options"
        label="Chọn nhà máy"
      />
                  </q-card-section>
              <q-card-actions align="right" class="text-primary">
              <q-btn color="positive" @click="adddongiaSP" label="Cập nhật" />
              <q-btn color="orange" label="Hủy" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog v-model="confirmphieuxoa" persistent>
          <q-card style="min-width: 400px">
            <q-card-section class="row items-center">
              <div class="row">
                <div class="col-12 top-title text-positive">
                  Xác nhận cập nhật thêm hệ số
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn label="Hủy" color="orange" v-close-popup />
              <q-btn
                label="Đồng ý"
                @click="xoahesoquydoi"
                color="positive"
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
      <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxScrolling,
  DxSorting,
  DxEditing,
  DxButton,
  DxColumn,
  DxLoadPanel,
  DxExport,
  DxPager,
  DxSearchPanel,
  DxLookup,
  DxGroupPanel,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import { showNotifySuccess,formatDateISO,formatDateVN, showNotifyError } from "../ultils";
import { mapActions, mapGetters } from "vuex";
import DateBox from "../components/commons/DateBox";
import DialogSelectDate from "../components/commons/DialogSelectFromDate";
import XLSX from "xlsx";
import moment from "moment";
//import { insertHeSoQuyDoi } from '../store/vcn/actions';
export default {
  data() {
    return {
      dataSource: [],
      showVolumnColumn: true,
      year: moment().year(),
      month: moment().month() + 1,
      listWeek: [],
      chonCongDoans: [],
        showChooseDate: false,
      DgSp:null,
      heSo:null,
     fromDate: moment().format("YYYY-MM-DD"),
      dulieu: [],
  
     options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 102340,
          code: "YS1B",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
        },
      ],
      date:null,
      dataUSD: [],
      showNhaptigiaUSD: false,
      showNhapSP:false,
      xoahs: true,
      confirmphieu: false,
      confirmphieuxoa: false,
      chonFactoryId: null,
     idDepartment: {
        label: "Nhà máy CBG Thuận Hưng",
        factoryId: 100000,
        code: "TH",
      },
      capnhat: true,

      displayMode: "full",
      pageSizes: [10, 20, "all"],
      showPageSizeSelector: true,
      showNavButtons: true,
      //   options: [
      //     {
      //       id: 100000,
      //       label: "NM CBG Thuận Hưng",
      //     },
      //     {
      //       id: 102339,
      //       label: "NM CBG YS1A",
      //     },
      //     {
      //       id: 102340,
      //       label: "NM CBG YS1B",
      //     },
      //     {
      //       id: 102366,
      //       label: "NM CBG TB",
      //     },
      //   ],
    };
  },
  components: {
    DxDataGrid,
    DxScrolling,
    DxSorting,
    DxColumn,
    DateBox,
    DxExport,
    DxLookup,
    DxPager,
    DxEditing,
    DxButton,
    DxSearchPanel,
    DxLoadPanel,
    DxGroupPanel,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupItem,
    DxSummary,
    DialogSelectDate,
  },
  created() {
     this.fromDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate());
    this.loadData();
  },
  methods: {
    ...mapActions("prod", [
      "getsanluongquidoi",
      "getTongCongByDepartment",
      "insertHesoquidoi",
      "insertHesoquidoiTL",
      "xoaHesoquidoi",
    ]),
       cancelChooseDate() {
      this.showChooseDate = false;
    },
      async chooseDate(f, t) {
      this.fromDate = f;
      this.showChooseDate = false;
     
    },
    changeDate() {
      this.loadData();
    },
    changeFactory() {
      this.loadData();
    },
    fixdata(data) {
      var o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
     chonNgay(e){
        this.date= e.value
    },
    async xoahesoquydoi() {
      this.dataSource = [];
      this.capnhat = true;
      this.xoahs = false;
      // const dataxoa = await this.xoaHesoquidoi({
      //    nam:this.year,

      // });
      // if (dataxoa.meta.success) {
      //           showNotifySuccess();
      //          this.loadData();
      //         } else {
      //           showNotifyError();
      //         }
    },
        async capnhatPUA(){
 let nhappua = [];
      this.dataSource.forEach((d) => {
        if (d.CNPUA > 0) nhappua.push(d);
      });
           this.dulieupua = nhappua;
      if (this.date) {
      const data = await this.insertHesoquidoiTL({
          nam: this.year,
          createdBy: this.userInfo.id,
          hesoquidoi: this.dulieupua,
          ngayapdung:formatDateISO(this.date),
          tyle:'PUA'
        });
      if (data.meta.success) {
        showNotifySuccess();
        // this.$router.push("/bang-xuat-go/");
        this.loadData();
    
      } else {
        showNotifyError();
      }
} else   
this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">chọn ngày áp dụng cho giá! </span>`,
          persistent: true,
        });
    },
    async capnhatCD(){
 let nhapcd = [];
      this.dataSource.forEach((d) => {
        if (d.CNTYLE > 0) nhapcd.push(d);
      });
           this.dulieucd = nhapcd;
      if (this.date) {
      const data = await this.insertHesoquidoiTL({
          nam: this.year,
          createdBy: this.userInfo.id,
          hesoquidoi: this.dulieucd,
          ngayapdung:formatDateISO(this.date),
          tyle:'CD'
        });
      if (data.meta.success) {
        showNotifySuccess();
        // this.$router.push("/bang-xuat-go/");
        this.loadData();
    
      } else {
        showNotifyError();
      }
} else   
this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">chọn ngày áp dụng cho giá! </span>`,
          persistent: true,
        });
    },
    async nhaphesoquydoi() {
      let resultData = this.dataSource;
      function chunk_inefficient(arr, chunkSize) {
        var array = arr;
        return [].concat.apply(
          [],
          array.map(function (elem, i) {
            return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
          })
        );
      }
      let dataSlice = chunk_inefficient(resultData, 100);
      dataSlice.forEach(async (item) => {
        const data = await this.insertHesoquidoi({
          nam: this.year,
          createdBy: this.userInfo.id,
          hesoquidoi: item,
          ngayapdung:formatDateISO(this.date),
        });
        if (data.meta.success) {
          showNotifySuccess();
          this.loadData();
        } else {
          showNotifyError();
        }
      });
    },
    async loadTYGIA() {
      this.showNhaptigiaUSD = true;
      const payload = {
        year: this.year,
      };
      const data = await this.$store.dispatch(
        "prod/GET_ALL_TY_GIA_USD",
        payload
      );
      this.dataUSD = data.data;
    },
        async capnhatSP() {
      this.showNhapSP = true;
    
    },
    async adddongiaSP(){
if (this.DgSp) {
  console.log('chao')
        const payload = {
          CREATED_BY: this.userInfo.id,
          dongia: this.DgSp,
          ngayapdung: formatDateISO(this.fromDate),
          factoryId:this.idDepartment.factoryId,
        };
        const data = await this.$store.dispatch(
          "prod/INSERT_DON_GIA_SAY",
          payload
        );
        if (data.meta.success) {
          showNotifySuccess();
          this.heSo = null;
    
        } else {
          showNotifyError();
        }
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Vui lòng nhập đầy đủ thông tin !",
        });
      }
    },
    async addTYGIA() {
      if (this.heSo && this.date) {
        const payload = {
          CREATED_BY: this.userInfo.id,
          TY_GIA_USD: this.heSo,
          CREATED_AT: formatDateISO(this.date),
        };
        const data = await this.$store.dispatch(
          "prod/INSERT_TY_GIA_USD",
          payload
        );
        if (data.meta.success) {
          showNotifySuccess();
          this.heSo = null;
          this.loadTYGIA();
        } else {
          showNotifyError();
        }
      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Vui lòng nhập đầy đủ thông tin tỷ giá và ngày áp dụng!",
        });
      }
    },
    async onChange(e) {
      e.stopPropagation();
      e.preventDefault();

      var files, i, f;
      this.file = this.$refs.file.files[0];

      for (i = 0, f = this.file; i < 1; ++i) {
        var reader = new FileReader(),
          name = f.name;
        let results = [];
        this.resultData = [];
        reader.onload = async (e) => {
          let data = e.target.result,
            fixedData = await this.fixdata(data),
            workbook = XLSX.read(btoa(fixedData), {
              type: "base64",
              cellDates: true,
              dateNF: "dd/mm/yyyy",
            }),
            firstSheetName = workbook.SheetNames[0],
            worksheet = workbook.Sheets[firstSheetName];

          // this.state.headers = this.get_header_row(worksheet);

          results = XLSX.utils.sheet_to_json(worksheet, { raw: false });

          this.dataSource = results;
          //    await results.forEach((e) => {
          //         let index = this.dataSource.push({
          //           account: e.account,
          //    });

          //       });
          console.log("SL qui doi:", this.dataSource);
          // this.state.tickets = results;
          this.file = "";
        };
        reader.readAsArrayBuffer(f);
      }
    },
    async loadData() {
      this.dataSource = [];
      this.dataSource = await this.getsanluongquidoi({
        nam: this.year,
      });
      console.log("dai:", this.dataSource.length);
      if (this.dataSource.length > 0) {
        this.capnhat = false;
        this.xoahs = true;
      } else {
        this.capnhat = true;
        this.xoahs = false;
      }
    },
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
      tuNgay() {
      return formatDateVN(this.fromDate);
    },
  },
};
</script>
<style >
.custom-file-input::-webkit-file-upload-button {
  visibility: hidden;
}
.custom-file-input::before {
  content: "Import từ Excel";
  display: inline-block;
  background: linear-gradient(top, #f9f9f9, #e3e3e3);
  border: 1px solid #999;
  border-radius: 3px;
  padding: 7px 8px;
  -webkit-user-select: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14pt;
  margin-top: 8px;
  background-color: #ffc107;
  color: white;
}
.custom-file-input:hover::before {
  border-color: black;
}
.custom-file-input:active::before {
  background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
}
.dx-datagrid-headers .Quydoi {
  color: white;
  background-color: #607d8b;
}
</style>
