<template>
  <q-page>
    <div class="print-hide">
      <div class="row" style="background-color: #daf8e1">
        <div v-if="datasourceNgay.length == 0" class="col-8 text-blue text-bold" style="font-size: 18px">
          Import kế hoạch xuất hàng
        </div>
        <div v-else class="col-8 text-blue text-bold" style="font-size: 18px">
          Kế hoạch xuất hàng
        </div>
        <div class="col-4 cursor-pointer text-blue text-bold" style="font-size: 18px" align="right"
          @click="showChooseDate = true">
          Ngày <span class="text-amber-14">{{ datevn }}</span>
        </div>
      </div>
    </div>
    <div>
      <div class="row q-ma-sm q-pa-sm">
        <div class="col-md-12">
          <div class="large-12 medium-12 small-12 cell">
            <label v-if="datasourceNgay.length == 0">
              <b>Vui lòng ấn chọn file cần tải lên :</b>
              <input class="q-ml-sm" type="file" id="file" ref="file" @change="onChange" />
            </label>
          </div>
        </div>
      </div>
      <div id="q-app" v-if="datasourceNgay.length == 0">
        <div class="q-pa-md">
          <!-- <q-table title="Danh sách ký gửi" :data="data[0]" :columns="columns"></q-table> -->
          <DxDataGrid :data-source="data[0]" :word-wrap-enabled="true" :no-data-text="'Không có dữ liệu !'"
            :show-borders="true" :show-row-lines="true" :show-column-lines="true">
            <DxEditing :allow-updating="true" :allow-deleting="true" mode="row" />
            <DxColumn data-field="Consigment" caption="Consigment" />
            <DxColumn data-field="Kho_IKEA" caption="Kho IKEA" />
            <DxColumn data-field="mahang" caption="Mã hàng" />
            <DxColumn data-field="tenhang" caption="Tên hàng" />
            <DxColumn data-field="diadiem" caption="Địa điểm" />
            <DxColumn data-field="SL" caption="Số lượng" data-type="number" :width="80" />
          </DxDataGrid>
        </div>
      </div>
    </div>
    <div class="row" v-if="datasourceNgay.length == 0">
      <div class="col-12">
        <q-btn v-show="!disable" class="float-right q-ma-md" color="primary" text-color="white" label="Thêm"
          @click="onClick" />
      </div>
    </div>
    <div id="q-app" v-if="datasourceNgay.length != 0">
      <div class="q-pa-md">
        <!-- <q-table title="Danh sách ký gửi" :data="data[0]" :columns="columns"></q-table> -->
        <DxDataGrid :data-source="datasourceNgay" :word-wrap-enabled="true" :no-data-text="'Không có dữ liệu !'"
          :show-borders="true" :show-row-lines="true" :show-column-lines="true" @row-updating="updatedata"
          @row-removing="deletedata">
          <DxEditing :allow-updating="true" :allow-deleting="true" mode="row" />
          <DxColumn data-field="consigment" caption="Consigment" />
          <DxColumn data-field="kho_IKEA" caption="Kho IKEA" />
          <DxColumn data-field="mahang" caption="Mã hàng" />
          <DxColumn data-field="tenhang" caption="Tên hàng" />
          <DxColumn data-field="diadiem" caption="Địa điểm" />
          <DxColumn data-field="sl" caption="Số lượng" data-type="number" :width="80" />
           <DxColumn data-field="Ghepcong" caption="Chuyển YS" :width="60"/>
        </DxDataGrid>
      </div>
    </div>
    <q-dialog v-model="showChooseDate" class="q-pa-md">
      <div>
        <div>
          <q-date v-model="toDate" title="Chọn ngày" simple today-btn mask="MM-DD-YYYY" />
        </div>
        <div class="q-pa-md q-gutter-sm" align="right" style="background-color: #fff;">
          <q-btn color="primary" label="Đồng ý" @click="changeDate" />
          <q-btn color="red" label="Hủy" @click="showChooseDate = false" />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
import { Notify, Loading, QSpinnerIos } from "quasar";
import XLSX from "xlsx";
import moment from "moment";
import {
  DxDataGrid,
  DxColumn,
  DxLookup,
  DxEditing
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxLookup,
    SendMessage,
    OrderHeader,
    OrderApproved,
    DxEditing
  },
  data() {
    return {
      data: [],
      disable: false,
      toDate: null,
      showChooseDate: false,
      datasourceNgay: [],
      checkSuccess: []
    };
  },
  methods: {
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("base", ["IMPORT_ACCOUNTS"]),
    ...mapActions("orderMetas", []),
    ...mapActions("prod", ['IMPORT_KYGUI', "GET_KYGUI", "updateRowImportKHXH", "deleteRowImportKHXH"]),
    formatDate(value) {
      return moment(value).format("YYYY-MM-DD 00:00:00.000")
    },
    changeDate() {
      this.toDate = moment(this.toDate).format("YYYY-MM-DD 00:00:00.000");
      this.load();
      this.showChooseDate = false
    },
    async onSelectionChanged(e) {
      this.departmentId = e.id;
      console.log("e", e.id);
    },
    async load() {
      const data = await this.GET_KYGUI(this.toDate)
      this.datasourceNgay = data.data
      this.datevn = moment(this.toDate).format('DD/MM/YYYY');
    },
    async updatedata(e) {
      let payload = e.key
      const data = await this.updateRowImportKHXH(payload)
      if (data.meta.success) {
        this.$q.notify({
          message: 'Thành công !!!',
          color: 'positive'
        })
      } else {
        this.$q.notify({
          message: 'Thất bại !!!',
          color: 'negative'
        })
      }
    },
    async deletedata(e) {
      let payload = e.key
      const data = await this.deleteRowImportKHXH(payload)
      console.log('payload', data)
      if (data.meta.success) {
        this.$q.notify({
          message: 'Thành công !!!',
          color: 'positive'
        })
      } else {
        this.$q.notify({
          message: 'Thất bại !!!',
          color: 'negative'
        })
      }
    },
    async onClick() {
      this.resultData = this.data[0]
      console.log('resultData : ', this.resultData)
      if (this.selected) {
        if (this.resultData.length > 0) {
          let result = [];
          let IMPORT_KYGUI = this.IMPORT_KYGUI;
          let resultData = this.resultData;
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
          console.log("this.ngaytao", moment(this.toDate).format('YYYY/MM/DD'))
          dataSlice[0].forEach(element => {
            element.nguoitao = this.userInfo.id
            element.ngaytao = moment(this.toDate).format('YYYY/MM/DD');
          });
          console.log('dataSlice', dataSlice[0])
          const data = await this.IMPORT_KYGUI(dataSlice[0])
          console.log('data', data)
          if (data.meta.success) {
            this.load()
            this.$q.notify({
              message: "thành công !!!",
              color: "positive"
            })
          } else {
            this.$q.notify({
              message: "Thất bại!!!",
              color: "negative"
            })
          }
          this.$refs.file.value = null;
          this.data.pop();
          if (result) {
            this.resultData = [];
          } else {
            Notify.create({
              message:
                "Xảy ra lỗi khi insert dữ liệu kiểm tra lại dữ liệu file!",
              color: "red",
            });
          }
        }
      } else {
        Notify.create({
          message: "Vui lòng chọn file cần import",
          color: "red",
        });
      }
    },
    get_header_row(sheet) {
      var headers = [],
        range = XLSX.utils.decode_range(sheet["!ref"]);
      var C,
        R = range.s.r; /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        var cell =
          sheet[
          XLSX.utils.encode_cell({ c: C, r: R })
          ]; /* find the cell in the first row */
        var hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    },
    async onClick1(node) {
      console.log(node);
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
    workbook_to_json(workbook) {
      var result = {};
      workbook.SheetNames.forEach(function (sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName].w
        );
        if (roa.length > 0) {
          result[sheetName] = roa;
        }
      });
      return result;
    },
    async onChange(e) {
      this.selected = true;
      let departmentId = this.departmentId;

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
          console.log("dassss", workbook);

          results = XLSX.utils.sheet_to_json(worksheet, { raw: false });
          console.log("dassss", results);
          await results.forEach((e) => {
            this.resultData.push({
              Consigment: e.Consigment ? e.Consigment : null,
              Kho_IKEA: e.Kho_IKEA ? e.Kho_IKEA : null,
              mahang: e.mahang ? e.mahang : null,
              tenhang: e.tenhang ? e.tenhang : null,
              SL: e.SL ? e.SL : null,
              diadiem: e.diadiem ? e.diadiem : null,
            });
          });
          console.log("results", this.resultData);
          this.file = "";
        };
        reader.readAsArrayBuffer(f);
      }
      console.log("state", this.resultData);
      this.data.push(this.resultData);
      console.log("data", this.data);
    },
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo", "myFactoryInfor", "dsCongDoans"]),
  },
  created() {
    this.toDate = this.formatDate(new Date());
    this.datevn = moment(this.toDate).format('DD/MM/YYYY');
    let status = this.$route.query.status;
    this.load();
  },
  mounted() {
    this.dsCongDoans.forEach((element) => {
      element.label = element.name;
    });
    this.factory = this.dsCongDoans[0];
    this.departmentId = this.factory.id;
    this.options = this.dsCongDoans;
  },

};
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rich-media-node {
  width: 300px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: white;
  background-color: #f7c616;
  border-radius: 4px;
}

.spanA:hover {
  color: blue;
  padding: 4px 0;
  font-weight: bold;
}
</style>