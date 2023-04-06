<template>
  <div class="layout-out ">
    <div class="containt">
      <q-card-section class=" print-hide">
        <div class="row">
          <div class="top-title tilte">Tạo Ticket</div>
          <!-- <div class="col-6"></div> -->
        </div>
      </q-card-section>
      <div class="container">
        <form action="/action_page.php">
          <!-- <div class="row">
          <div class="col-2">
            <label class="text-bold text-orange" for="confirm"
              >Yêu cầu xác nhận thông tin</label
            >
          </div>
          <div class="col-10">
            <q-checkbox readonly color="orange" v-model="confirm" />
          </div>
        </div> -->


          <div class="row layout-botton-all">
            <div class="col-201 lable-table">
              <label class="text-bold" for="fname">
                Gửi phòng ban
              </label>
              <span style="color: red;">*</span>
            </div>
            <div class="col-601">
              <q-select v-model="chonPhongBan" :options="optionPhongBan" v-on:input="onChangeDeparment" />
            </div>
            <div>
            </div>
          </div>

          <div class="row layout-botton-all">
            <div class="col-201 lable-table">
              <label class="text-bold" for="fname">
                Người tiếp nhận
              </label>
              <span style="color: red;">*</span>
            </div>
            <div class="col-601">
              <q-select dense v-model="chonNguoiNhan" :options="optionNguoiNhan" @input="HoiTro" />
            </div>
          </div>


          <div class="row layout-botton-all">
            <div class="col-201 lable-table">
              <label class="text-bold" for="fname">
                Chọn nhà máy
              </label>
              <span style="color: red;">*</span>
            </div>
            <div class="col-601">
              <q-select dense v-model="chonNhaMay" :options="optionNhaMay" />
            </div>
          </div>

          <div class="row layout-botton-all">
            <div class="col-201 lable-table">
              <label class="text-bold " for="fname">Tên ticket </label><span style="color: red;">*</span>
            </div>
            <div class="col-601">
              <q-input type="text" v-model="veViec" placeholder="Điền tên ticket" lazy-rules
                :rules="[val => val && val.length > 0 || '']" />
            </div>
          </div>

          <div class="row layout-botton-all">
            <div class="col-201 lable-table">
              <span class="text-bold" for="fname">
                Loại ticket
              </span>
              <span style="color: red;">*</span>
            </div>
            <div class="col-601">
              <q-select class="input-all-layout" v-model="baoLoi" :options="optionTicket" />
            </div>
          </div>

          <div class="row layout-botton-all" v-if="chonNguoiNhan">
            <div class="col-201 lable-table">
              <label class="text-bold" for="fname">
                Hạng mục
              </label>
              <span style="color: red;">*</span>
            </div>
            <div class="col-601">
              <q-select dense v-model="chon" :options="options" />
            </div>
          </div>

          <div class="row layout-botton-all">
            <div class="col-201 lable-table">
              <label class="text-bold" for="fname">
                Độ quan trọng
              </label>
              <span style="color: red;">*</span>
            </div>
            <div class="col-601">
              <q-select dense v-model="chonQuanTrong" :options="optionQuanTrong" />
            </div>
          </div>

          <!-- <div class="row">
          <div class="col-2">
            <label class="text-bold" for="lname">Tóm tắt</label>
          </div>
          <div class="col-10">
            <input
              type="text"
              v-model="subDescription"
              placeholder="Tóm tắt.."
            />
          </div>
        </div> -->
          <div class="row layout-botton-all">
            <div class="col-201 lable-table">
              <label class="text-bold " for="subject">Nội dung</label>
            </div>
            <div class="col-601">
              <q-editor v-model="description" min-height="5rem" />
            </div>
          </div>
          <div class="row layout-botton-all">
            <div class="col-201 lable-table">
              <label class="text-bold ">
                Mẫu văn bản (Nếu có)
              </label>
            </div>
            <div class="col-601">
              <q-uploader style="width: 100%;" label="Upload File " :factory="uploadFile"
                accept=".jpg,.pdf,.png,.xlsx,.docx">
              </q-uploader>
            </div>
          </div>
          <!-- <div class="row">
          <div class="col-2"></div>
          <div class="col-10" style="color: red">
            (Chỉ Upload File có định dạng <b>pdf, png, jpg</b> - dung lượng
            không vượt quá 5MB)
          </div>
        </div> -->
        </form>
        <div class="row layout-botton-all">
          <div class="col-701"></div>
          <div class="col-101" id="button-loction">
            <q-btn color="primary butont-click" v-on:click="onUploadFile" label="Tạo yêu cầu " />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  DxTreeList,
  DxEditing,
  DxColumn,
  DxValidationRule,
  DxLookup,
  DxPaging,
  DxFilterRow,
  DxSearchPanel,
  DxButton,
  DxSelection,
} from "devextreme-vue/tree-list";
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { showNotifyError, showNotifySuccess } from "../../ultils";

export default {
  components: {
    DxTreeList,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup,
    DxPaging,
    DxFilterRow,
    DxSearchPanel,
    DxButton,
    DxSelection,
  },

  data() {
    return {
      selectedFile: "",
      code: null,
      date: new Date(),
      veViec: "",
      subDescription: "",
      description: "",
      imageUrl: "",
      dataTemp: [102291],
      sendManager: false,
      thongbao: true,
      uploadfile: false,
      departments: [],
      listChangeDepartment: [],
      currentSelect: [],
      removeDepartment: [],
      users: [],
      expandedRowKeys: [1],
      dataProfile: null,
      confirm: true,
      options: [
        {
          label: "Phần cứng",
          value: "cung",
        },
        {
          label: "Phần mềm",
          value: "mem",
        },
        {
          label: "Số liệu",
          value: "solieu",
        },
        {
          label: "Khác",
          value: "khac",
        },

      ],
      chon: "",
      optionTicket: [
        {
          label: "Báo lỗi",
          value: "Báo lỗi"
        },
        {
          label: "Phê duyệt"
          , value: "Phê duyệt"
        }
      ],
      baoLoi: "",
      chonQuanTrong: "",
      optionQuanTrong: [{
        label: "Quan trọng",
        value: "Quan trọng"
      }, {
        label: "Trung bình",
        value: "Trung bình"
      }, {
        label: "Không quan trọng",
        value: "Không quan trọng"
      }],
      chonPhongBan: "",
      optionPhongBan: [],
      chonNguoiNhan: "",
      optionNguoiNhan: [],
      chonNhaMay: "",
      optionNhaMay: [
        { label: "Nhà máy Thuật Hưng", value: "Nhà máy Thuật Hưng" },
        { label: "Nhà máy Quang Minh", value: "Nhà máy Quang Minh" },
        { label: "Nhà máy Chiêm Hóa", value: "Nhà máy Chiêm Hóa" },
        { label: "Nhà máy Nam Hồng", value: "Nhà máy Nam Hồng" },
        { label: "Nhà máy Hà Giang", value: "Nhà máy Hà Giang" },
      ],
      popupOptions: {
        title: "Thông tin phòng ban",
        showTitle: true,
        width: 700,
      },
      type2s: [
        { id: "codien", value: "codien" },
        { id: "department", value: "department" },
        { id: "factory", value: "factory" },
        { id: "kho", value: "kho" },
        { id: "qc", value: "qc" },
        { id: "step", value: "step" },
        { id: "stock", value: "stock" },
        { id: "xuong", value: "xuong" },
      ],
      selectedItemKeys: [],
      selectedRowKeys: [],
      selectionChanged: ({ component }) => {
        const selectedData = component.getSelectedRowsData("all");
        const departmentId = [];
        if (selectedData.length > 0) {
          selectedData.forEach((el) => {
            departmentId.push(el.id);
          });
        }
        this.dataTemp = { departmentId };
        // console.log("dataTemp", this.dataTemp.departmentId);
      },

    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("base", ["myFactoryInfor"]),


    getSources() {
      if (this.departments && this.departments.length)
        return this.departments.map((d) => ({
          ...d,
          parentId: d.parentId ? d.parentId : 0,
        }));
      // console.log(this.departments);
      return [];
    },
  },
  created() {
    this.date = moment().format("YYYY-MM-DD");
    this.checkCode();
    this.loadUsers();
  },
  mounted() {
    this.loadDepartment();
  },

  methods: {
    ...mapActions("messages", ["sendNotificationMail"]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      ,
      "addMulRow",
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMeta"
    ]),
    HoiTro() {
      if (this.chonNguoiNhan.keyIdAccount === 108400) {
        const sub = {
          label: "Phần cứng",
          value: "cung",
        }
        this.chon = { ...sub }
      }
      if (this.chonNguoiNhan.keyIdAccount === 101735) {
        const sub = {
          label: "Số liệu",
          value: "solieu",
        }
        this.chon = { ...sub }
      }
      if (this.chonNguoiNhan.keyIdAccount === 101676) {
        const sub = {
          label: "Phần mềm",
          value: "mem",
        }
        this.chon = { ...sub }
      }
      // console.log("hien thi nguoi nhan",this.chonNguoiNhan);
    },
    async onChangeDeparment() {
      this.chonNguoiNhan = "";
      this.optionNguoiNhan = [];
      const payload = { key: '' };
      if (this.chonPhongBan.value != undefined) {
        payload.key = this.chonPhongBan.key;
      }
      const dataDepartmentAccount = await this.$store.dispatch("base/PUT_DEPARTMENTS_ACCOUNT_TICKET", payload);
      // console.log("dataDepartmentAccount: ", dataDepartmentAccount.data);
      if (this.chonPhongBan.value != undefined) {
        dataDepartmentAccount.data.forEach(item => {
          this.optionNguoiNhan.push({
            label: item.LAST_NAME,
            value: item.LAST_NAME,
            keyIdDepartment: item.departmentId,
            keyIdAccount: item.ID_ACCOUNT,
            email: item.EMAIL,
          })
        })
      }
      


    },
    onEditorPreparing(e) {
      if (e.dataField === "Head_ID" && e.row.data.ID === 1) {
        e.editorOptions.disabled = true;
        e.editorOptions.value = null;
      }
    },

    async checkCode() {
      // format 100-21/TB-WL
      let data = await this.$store.dispatch("NOTIFY/getCodeInNotify");
      // console.log("data", data);
      if (data.length > 0) {
        let number = data[0].CODE.substring(0, data[0].CODE.length - 9);
        number = parseInt(number) + 1;
        this.code = number + "-21/TB-WL"
      } else {
        this.code = "1-21/TB-WL";
      }
    },
    onInitNewRow(e) {
      e.data.factoryId = this.myFactoryInfor.id;
      this.loadUsers();
    },
    async loadDepartment() {
      const { data } = await this.$store.dispatch("base/GET_DEPARTMENTS_FULL", {
        factoryId: 102627
      });
      this.departments = data;
      const dataDepartment = await this.$store.dispatch("base/GET_DEPARTMENTS_TICKET");
      // console.log('phong ban ',dataDepartment);
      dataDepartment.data.forEach(item => {
        this.optionPhongBan.push({
          label: item.name,
          value: item.name,
          key: item.id,
        })
      })
    },
    async loadUsers() {
      const data = await this.$store.dispatch("base/GET_ACCOUNTS");
      this.users = data.data.filter((e) => e.createBy != 102089);
    },
    uploadFile(files) {
      if (this.veViec != "") {
        const selectedFile = files[0]; // accessing file
        this.selectedFile = selectedFile;
        this.imageUrl = this.selectedFile.name;
        this.thongbao = false;
        this.uploadfile = true;
        if (this.selectedFile.size > 5242880) {
          this.$q.dialog({
            html: true,
            message: `<span class="text-red">File upload lớn hơn dung lượng cho phép </span>`,
          });
        } else {
          const formData = new FormData();
          formData.append("myFile", this.selectedFile);
          if (process.env.PROD) {
            axios
              .post("https://app.woodsland.com.vn:3003/uploadfile", formData)
              .then((res) => {
                showNotifySuccess();
              })
              .catch((err) => {
                showNotifyError();
              });
          } else {
            axios
              .post("http://localhost:3004/uploadfile", formData)
              .then((res) => {
                showNotifySuccess();
              })
              .catch((err) => {
                showNotifyError();
              });
          }
        }
      } else {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập tiêu đề thông báo trước khi upload file ! </span>`,
          persistent: true,
        });
      }
    },

    onUploadFile() {
      if (this.veViec == "") {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập nội dung thông báo trước khi tạo thông báo ! </span>`,
          persistent: true,
        });
      } else if (this.dataTemp.length == 0) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng chọn Phòng Ban trước khi tạo thông báo ! </span>`,
          persistent: true,
        });
      } else {
        this.$q
          .dialog({
            title: "Tạo thông báo",
            message: "Bạn có muốn tạo thông báo?",
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            this.dataTemp = JSON.stringify(this.dataTemp);
            let payload = {
              subDescription: this.subDescription,
              description: this.description,
              imageUrl: this.imageUrl,
              accountId: this.userInfo.id,
              permission: 102291,
              veViec: this.veViec,
              nhomcongviec: this.chon.value,
              loaiTicket: this.baoLoi.value,
              doQuanTrong: this.chonQuanTrong.value,
              phongBan: this.chonPhongBan.value,
              nguoiDung: this.chonNguoiNhan.value,
              idNguoiDung: this.chonNguoiNhan.keyIdAccount,
              idPhongBan: this.chonNguoiNhan.keyIdDepartment,
              nhaMay: this.chonNhaMay.value,
            };
            // console.log("Hien thi id codne", payload);
            const dataP = await this.$store.dispatch("NOTIFY/INSERT_REQUEST", payload);
            let baseUrl = null;
            if (process.env.PROD) {
              baseUrl = `https://app.woodsland.com.vn:2002/#/edit-request`;
            } else {
              baseUrl = `http://localhost:5000/#/edit-request`;
            }
              if(payload.loaiTicket ==="Báo lỗi"){
                let payloadMail = {
                baseUrl: baseUrl,
                email: this.chonNguoiNhan.email,
                accountId: this.userInfo.id,
                toAccountId: this.chonNguoiNhan.keyIdAccount,
                subject: `Công việc của bạn :${payload.veViec}`,
                title: `Nhấn vào để xem công việc kỹ hơn về công việc của bạn !`,
                dataBody: `Mức độ quan trọng : ${payload.doQuanTrong}. Nhà máy làm việc: ${payload.nhaMay}.`,
              }
            }else{
                let payloadMail = {
                baseUrl: baseUrl,
                email: this.chonNguoiNhan.email,
                accountId: this.userInfo.id,
                toAccountId: this.chonNguoiNhan.keyIdAccount,
                subject: `Yêu cầu phê duyệt :${payload.veViec}`,
                title: `Nhấn vào để xem kỹ hơn thông tin cần phê duyệt của bạn !`,
                dataBody: `Mức độ quan trọng : ${payload.doQuanTrong}. Nhà máy làm việc: ${payload.nhaMay}.`,
              }
              // console.log("hien thi thu gui di", payloadMail);
              const sendTicket = await this.sendNotificationMail(payloadMail);
              }
            showNotifySuccess();
            this.$router.go();

          });
      }
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

.row::after {
  content: "";
  clear: both;
  display: block;
}

[class*="col-"] {
  float: left;
  /* padding: 15px; */
}



.container {
  border-radius: 5px;
  /* background-color: #f2f2f2; */
  padding: 20px;
}

.tilte {
  font-weight: 700;
  font-size: 40px;
}


.layout-botton-all {
  margin-bottom: 15px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

.lable-table {
  text-align: right;
  padding-right: 2%
}

.butont-click {
  min-width: 120px;
  margin-left: 15px;
}

.col-101 {
  width: 8.33%;
}

.col-201 {
  width: 16.66%;
}

.col-301 {
  width: 25%;
}

.col-401 {
  width: 33.33%;
}

.col-501 {
  width: 41.66%;
}

.col-601 {
  width: 50%;
}

.col-701 {
  width: 58.33%;
}

.col-801 {
  width: 66.66%;
}

.col-901 {
  width: 75%;
}

.col-1001 {
  width: 83.33%;
}

.col-1101 {
  width: 91.66%;
}

.col-1201 {
  width: 100%;
}



/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (max-width: 768px) {
  [class*="col-"] {
    width: 100%;
  }

  .lable-table {
    text-align: left;
  }

  .butont-click {
    min-width: 120px;
    margin-left: 0;
  }

}
</style>