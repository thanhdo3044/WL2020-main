 <template>
  <q-page>
    <q-banner class="bg-primary text-orange">
      <div class="text-h6 orange">
        <span color="orange">Nhập tồn kho gỗ sau sấy</span>
      </div>
    </q-banner>
    <div>
      <!-- <div class="q-pa-md" style="max-width: 300px">
        <div class="q-gutter-md">
          <q-select
            outlined
            v-model="factory"
            :options="options"
            :disabled="!disabled"
            @input="onSelectionChanged"
            label="Chọn phòng ban"
          />
        </div>
      </div> -->
      <div class="row q-ma-sm q-pa-sm">
        <div class="col-md-12">
          <div class="large-12 medium-12 small-12 cell">
            <label>
              <b>Vui lòng ấn chọn file cần tải lên :</b>
              <input
                class="q-ml-sm"
                type="file"
                id="file"
                ref="file"
                @change="onChange"
              />
            </label>
          </div>
        </div>
      </div>
      <div id="q-app">
        <div class="q-pa-md">
          <q-table
            title="Danh sách Sản phẩm"
            :data="data[0]"
            :columns="columns"
          ></q-table>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <q-btn
            v-show="!disable"
            class="float-right q-ma-md"
            color="primary"
            text-color="white"
            label="Nhập"
            @click="onClick"
          />
        </div>
      </div>
    </div>
    <!-- <order-files></order-files> -->
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

export default {
  data() {
    return {
      columns: [
        { label: "Ngày tháng", field: "date", sortable: true },

        { name: "date_of_birth", label: "Mã quy cách", field: "itemId" },
        { name: "gender", label: "Nguồn phôi", field: "nguonPhoi" },
        { name: "date_of_birth1", label: "Khối lượng", field: "quantity" },

        { name: "date_of_birth2", label: "Ghi chú", field: "description" },

        // departmentId: 100071,
        // name: e.NAME ? e.NAME : null,
        // code: e.CODE ? e.CODE : null,
        // quantity: e.QUANTITY ? e.QUANTITY : 0,
        // palletFull : e.PALLET_FULL ? e.PALLET_FULL : 0,
        // palletTop1: e.PALLET_TOP1 ? e.PALLET_TOP1 : 0,
        // palletTop2: e.PALLET_TOP2 ? e.PALLET_TOP2 : 0,
        // description: e.DESCRIPTION ? e.DESCRIPTION :null,
        // destination: e.DESTINATION ? e.DESTINATION : null,
        // nguonPhoi: e.NGUON_PHOI ? e.NGUON_PHOI : null,
        // created: e.CREATED ? e.CREATED :moment().subtract(10, 'days').calendar(),
        // { name: "nation", label: "Dân tộc", field: "nation" },
        // { name: "identification", label: "Số CMND", field: "identification" },
        // {
        //   name: "identification_date",
        //   label: "Ngày cấp",
        //   field: "identification_date",
        // },
        // {
        //   name: "identification_address",
        //   label: "Nơi cấp",
        //   field: "identification_address",
        // },
        // { name: "academic_level", label: "Trình độ", field: "academic_level" },

        // {
        //   name: "job",
        //   label: "Nghề",
        //   field: "job",
        //   sortable: true,
        //   sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        // },
        // {
        //   name: "status_profile",
        //   label: "Tình trạng hồ sơ",
        //   field: "status_profile",
        //   sortable: true,
        //   sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        // },
        // { name: "date_in", label: "Ngày vào", field: "date_in" },
        // {
        //   name: "address_contract",
        //   label: "Nơi ký HĐ",
        //   field: "address_contract",
        // },
        // {
        //   name: "status_contract",
        //   label: "Tình trạng hợp đồng",
        //   field: "status_contract",
        // },
        // {
        //   name: "date_start_contract",
        //   label: "Từ ngày",
        //   field: "date_start_contract",
        // },
        // {
        //   name: "date_end_contract",
        //   label: "Đến ngày",
        //   field: "date_end_contract",
        // },
        // {
        //   name: "date_end_order",
        //   label: "Ngày nhận đơn xin nghỉ",
        //   field: "date_end_order",
        // },
        // {
        //   name: "terminate_contract",
        //   label: "Ngày nghỉ việc",
        //   field: "terminate_contract",
        // },
        // {
        //   name: "social_insurance_number",
        //   label: "CẬP NHẬT SỐ SỔ BHXH",
        //   field: "social_insurance_number",
        // },
      ],
      data: [],
      disable: false,
      factory: null,
      options: null,
      departmentId: null,
      count: 0,
      disabled: true,
      file: "",
      uploadPercentage: 0,
      disabledToggle: false,
      computerEquipment2: null,
      priorityLevel2: null,
      separator: "cell",
      selected: false,
      events: [],
      nameDepartment: {},
      status: "",
      phoneNumber: "",
      nameDepartmentName: null,
      dataAddRow: [],
      activeFormAdd: false,
      activeFormEdit: false,
      intendedUse: "",
      metaValue: {
        kinhGui:
          "Ban TGĐ - Trưởng phòng/phó phòng ban :  -	GĐSX/Phó GĐSX/Phụ trách nhà máy :",
        noiDungTT: "",
        soTien: 0,
        vietBangChu: "",
        kemTheo: "",
        STT: "12",
        locationWork: "",
        position: "",
        position2: "",
        number: "",
        timeRecruit: "",
        description: "",
        fullName: "",
        fullName2: "",
        maNV: "",
        department: "",
        department2: "",
        stepDepartment: "",
        lyDo: "",
        dateStart: "",
        dateEnd: "",
        selection1: null,
        selection2: null,
        selection3: null,
        selection4: null,
        selection: null,
        thoiGianMangThai: "",
        xinRaCong: "",
        luongHienTai: "",
        luongDeXuat: "",
        thoiGianTangLuongGanNhat: "",
        phoneNumber: "",
      },
    };
  },
  components: {
    SendMessage,
    OrderHeader,
    OrderApproved,
  },
  methods: {
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("production", ["IMPORT_TON_DAU_KY"]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addorderMeta",
      "addMulRowAccount",
    ]),

    async updateITEMPACKAGE(PACKAGE_ID, xuatton) {
      const payload = {
        PACKAGE_ID,
        itemId: this.item.value,

        quantity: xuatton,
      };
      const data = await this.$store.dispatch(
        "production/INSERT_ITEM_IN_PACKAGE",
        payload
      );
    },
    async onSelectionChanged(e) {
      this.departmentId = e.id;
      console.log("e", e.id);
    },
    async onClick() {
      if (this.selected) {
        if (this.resultData.length > 0) {
          // this.resultData.forEach(async (e) => {
          //   // const data2 = await this.$store.dispatch(
          //   //   "production/INSERT_PACKAGE",
          //   //   {
          //   //     departmentId: 102484,
          //   //     quantity: e.quantity,
          //   //     itemId: e.itemId,
          //   //     stepNextId:e.destination,
          //   //     PO:e.poId,
          //   //     createdBy: this.userInfo.id,
          //   //     factoryId:this.userInfo.factoryId,
          //   //     TYPE_ID: 100026,
          //   //   }
          //   // );
          //   console.log({
          //     departmentId: 102484,
          //     quantity: e.quantity,
          //     itemId: e.itemId,
          //     stepNextId: e.destination,
          //     PO: e.poId,
          //     createdBy: this.userInfo.id,
          //     factoryId: this.userInfo.factoryId,
          //     TYPE_ID: 100026,
          //   });
          //   // return;
          //   if (data2.meta.success) {
          //     console.log("ID:", data2.data[0].ID);
          //     this.updateITEMPACKAGE(data2.data[0].ID, e.quantity);
          //   }
          // });
          let result = [];
          let IMPORT_TON_DAU_KY = this.IMPORT_TON_DAU_KY;
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

          // console.log("slice", resultData.chunk_inefficient(100), resultData);
          let dataSlice = chunk_inefficient(resultData, 100);
          dataSlice.forEach(async (item) => {
            const data = await IMPORT_TON_DAU_KY(item);
            if (data) {
              Notify.create({
                message: "Thành công",
                color: "green",
              });
            }
          });

          // resultData.forEach(async function(item,index) {
          //   if(count<100){
          //     result.push(item)
          //     count++;
          //     console.log('if',count,index)
          //   }if(count>=100){
          //     await addMulRowAccount(result);
          //     result=[];
          //     count = 0;
          //     console.log('else',result,count,index,resultData.length-1);
          //   }
          //           console.log(count)

          // })
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
      console.log("a");
      e.stopPropagation();
      e.preventDefault();

      console.log("DROPPED");
      console.log("file", e);
      var files, i, f;
      this.file = this.$refs.file.files[0];

      console.log("files", files);
      console.log("this.files", this.file);
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
          results.shift();
          await results.forEach((e) => {
            if (e.QUANTITY) {
              this.resultData.push({
                departmentId: 102484,
                quantity: e.QUANTITY ? e.QUANTITY : 0,
                quantity_au: e.QUANTITY ? e.QUANTITY : 0,
                nguonPhoi: e.NGUON_PHOI ? e.NGUON_PHOI : null,
                itemId: e.ITEM_ID ? e.ITEM_ID : null,
                description: e.DESCRIPTION ? e.DESCRIPTION : null,
                selection: e.SELECTION ? e.SELECTION : null,
                date: moment(e.CREATED, "DD-MM-YYYY").format("YYYY-MM-DD"),
                month: moment(e.CREATED, "DD-MM-YYYY").format("MM"),
                week: moment(e.CREATED, "DD-MM-YYYY").format("WW"),
                createdBy: this.userInfo.id,
              });
            }
          });
          console.log("results", this.resultData);

          // this.state.tickets = results;
          this.file = "";
        };
        reader.readAsArrayBuffer(f);
      }
      console.log("state", this.resultData);
      this.data.push(this.resultData);
      console.log("dât", this.data[0]);
    },
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo", "myFactoryInfor", "dsCongDoans"]),
  },
  created() {
    this.metaValue.fullName = this.userInfo.lastName;
    this.metaValue.position = this.userInfo.position;
    this.metaValue.phoneNumber = this.userInfo.PHONE;
    this.metaValue.maNV = this.userInfo.id;
    let status = this.$route.query.status;

    // if (this.$route.query.id) {
    //   this.getOneOrder(this.$route.query.id).then(res => {
    //     if (res.data.data.Requests.length) this.disable = true;
    //     this.metaValue = Object.assign(
    //       this.metaValue,
    //       JSON.parse(res.data.data.OrderMeta[0].metaValue)[0]
    //     );
    //   });
    // }
    // else {
    //   this.$router.push({
    //     path: "/tao-de-xuat"
    //   });
    // }
  },
  mounted() {
    console.log("status", this.dsCongDoans);
    this.dsCongDoans.forEach((element) => {
      element.label = element.name;
    });
    console.log("status", moment("2021-12-31").format("DD-MM-YYYY"));

    this.factory = this.dsCongDoans[0];
    this.departmentId = this.factory.id;
    this.options = this.dsCongDoans;
    console.log("id", this.departmentId);
  },

  // watch: {
  //   disable(newValue) {
  //     if (newValue) {
  //       this.addorderMeta({
  //         ...this.order.OrderMeta[0],
  //         metaValue: JSON.stringify([this.metaValue])
  //       });
  //     }
  //   }
  // }
};
</script>
