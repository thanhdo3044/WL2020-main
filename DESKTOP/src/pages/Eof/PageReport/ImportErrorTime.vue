 <template>
  <q-page>
    <q-banner class="bg-primary text-orange">
      <div class="text-h6 orange">
        <span color="orange">Thêm dữ liệu lỗi chấm công</span>
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
          class="my-sticky-header-column-table "
            title="Danh sách lỗi chấm công"
            :data="data[0]"
            :separator="separator"
            :columns="columns"
          >
            <template v-slot:top-right>
            <q-btn
              color="primary"
              icon-right="archive"
              label="Xuất dữ liệu "
              no-caps
              @click="exportTable"
            />
          </template>
          </q-table>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <q-btn
            v-show="!disable"
            class="float-right q-ma-md"
            color="primary"
            text-color="white"
            label="Thêm"
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
import { v4 as uuidv4 } from "uuid";
import SendMessage from "components/eof/Shared/SendMessage.vue";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import OrderApproved from "components/eof/Shared/OrderApproved.vue";
import { Notify, Loading, QSpinnerIos } from "quasar";
import XLSX from "xlsx";
import moment from "moment";
import { exportFile } from 'quasar'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {

  data() {
    return {
      columns: [
        {
          name: "ACCOUNT",
          required: true,
          label: "Mã nhân viên",
          align: "left",
          field: (row) => row.account,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "LAST_NAME",
          align: "center",
          label: "Tên nhân viên",
          field: "last_name",
          sortable: true,
        },
        { name: "ACCOUNT", label: "Ngày tháng",  sortable: true, field: "date" },
        { name: "STATUS1", label: "Trạng thái vào", field: "status1" },
        { name: "TIME1", label: "Thời gian vào", field: "timeIn" },
        { name: "STATUS2", label: "Trạng thái ra", field: "status2" },
        { name: "TIME2", label: "Thời gian ra", field: "timeOut" },
        
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
      dataAccountAll:[],
      dataSendEmail:[]
    };
  },
  components: {
    SendMessage,
    OrderHeader,
    OrderApproved,
  },
  methods: {
    ...mapActions("ordersm", ["getAllAccounts", "getAllDepartments"]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests","addOrder"]),
    ...mapActions("production", ["IMPORT_TON_DAU_KY"]),
    ...mapActions("document", ["importDocument","getDocument"]),
    ...mapActions("messages", ["sendErrorTimeMail"]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addorderMeta",
      "addMulRowAccount",
    ]),
    exportTable () {
      // naive encoding to csv format
      const content = [ this.columns.map(col => wrapCsvValue(col.label)) ].concat(
        this.data.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')
      console.log('content',content)
      const status = exportFile(
        `file_loi_cham_cong.csv`,
        content,'text/csv'
      )
      console.log('statuss',status)
      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }else{
        this.$q.notify({
          message: 'Đã tải file xuống thành công...',
          color: 'primary',
          icon: 'warning'
        })
      }
    },
    async onSelectionChanged(e) {
      this.departmentId = e.id;
      console.log("e", e.id);
    },
     async unique(arr) {
        this.dataSendEmail = await Array.from(new Set(arr)) //
    },
    async onClick() {
      if (this.selected) {
        if (this.resultData.length > 0) {
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
          
          // await this.importDocument(this.resultData)
             let dataSendMail = []
             this.resultData.forEach(async e =>{
               dataSendMail.push(e.email);
               let payload ={
                 item: { 
                   id: uuidv4(),
                   accountId : e.accountId,
                   proposalFormId: 1042,
                   departmentId: e.departmentId,
                   title: e.title,
                   factoryId: e.factoryId,
                   slug: e.slug 
                  },
                  orderMeta:{
                    hoursIn: e.timeIn,
                    hoursOut: e.timeOut,
                    maNV:e.account,
                    fullName:e.fullName,
                    date:e.date
                  }
               }
              await this.addOrder(payload)
               Notify.create({
                message: "Thành công",
                color: "green",
              });

            })
            await this.unique(dataSendMail);
            console.log('dataSendEmail',this.dataSendEmail)
            let url = "";
            if(process.env.DEV){
              url ="http://localhost:8080/#/tao-de-xuat"
            }else{
              url ="https://app.woodsland.com.vn:1001/#/tao-de-xuat"
            }
            this.sendErrorTimeMail({userName:this.userInfo.id , email : this.dataSendEmail , url : url})
          // console.log("slice", resultData.chunk_inefficient(100), resultData);
          let dataSlice = chunk_inefficient(resultData, 100);
          // dataSlice.forEach(async (item) => {
          //   const data = await this.importDocument(item);
          //   if (data) {
          //     Notify.create({
          //       message: "Thành công",
          //       color: "green",
          //     });
          //   }
          // });

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
          await results.forEach(async (e) => {
              
              this.resultData.push({
                fullName:await this.getAccount(3,e) ,
                account: e.ACCOUNT.toUpperCase() == null ? '' :e.ACCOUNT.toUpperCase(),
                status1: e.STATUS1 == null ? '' :  e.STATUS1,
                status2: e.STATUS2 == null ? '' :  e.STATUS2,
                last_name: e.LAST_NAME == null ? '' :  e.LAST_NAME,
                date: moment(e.DATE, "DD-MM-YYYY").format("DD-MM-YYYY"),
                timeIn: e.TIME1,
                timeOut: e.TIME2,
                accountId: await this.getAccount(1,e) ,
                proposalFormId: 1042,
                departmentId: await this.getAccount(2,e),
                title: 'Phiếu xác nhận công',
                factoryId: 100000,
                slug: 'xac-nhan-cong',
                email:await this.getAccount(4,e)
              });
          });
          console.log("results", this.resultData);

          // this.state.tickets = results;
          this.file = "";
        };
        reader.readAsArrayBuffer(f);
      }
      this.data.push(this.resultData);
    },
    async getAccount(option,data){
      console.log('data',data)
      if(option == 1){
        let data2 =  await this.dataAccountAll.data.find(element => element.account == data.ACCOUNT.toUpperCase())
        console.log('data2',data2)
        return data2 ? data2.id : 0
      }else if(option == 2){
        let data2 =  await this.dataAccountAll.data.find(element => element.account == data.ACCOUNT.toUpperCase())
        return data2? data2.departmentId : 0
      }else if(option == 3){
        let data2 =  await this.dataAccountAll.data.find(element => element.account == data.ACCOUNT.toUpperCase())
        return data2? data2.lastName : ''
      }else if(option == 4){
        let data2 =  await this.dataAccountAll.data.find(element => element.account == data.ACCOUNT.toUpperCase())
        return data2? data2.email : ''
      }
     
    }
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo", "myFactoryInfor", "dsCongDoans"]),
  },
  async created() {
    this.dataAccountAll = await this.getAllAccounts();
    console.log('lalaa',this.dataAccountAll.data)
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
<style lang="sass">
#drop 
  border: 2px dashed #bbb;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  padding: 25px;
  text-align: center;
  font: 20pt bold, "Vollkorn";
  color: #bbb;

.my-sticky-header-column-table
  /* height or max-height is important */
  height: auto

  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 100%

  td:first-child
    /* bg color is important for td; just specify one */
    background-color: #c1f4cd !important

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0
</style>

