<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary" style="font-weight: 700;">
        <div class="row">
          <div class="col-6 top-title color-while-title">Danh sách yêu cầu </div>

          <div class="col-6 top-title cursor-pointer color-while-title" align="right" @click="showChooseDate = true">
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
        </div>
      </q-card-section>
      <q-card-section>

        <!-- bang cong viec -->
        <div class="q-pa-md">
          <q-table title="Danh sách công việc" :data="rowsTable" :columns="columns" row-key="ID" binary-state-sort
            no-data-label="Tôi chưa tìm thấy dữ liệu của bạn" no-results-label="Kết quả tìm kiếm không thấy"
            :filter="filters" bordered>

            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width></q-th>
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td auto-width>
                  <!-- <q-btn size="sm" color="primary" round dense @click="xemchitiet(props)" /> -->
                  <q-btn size="sm" color="primary" round dense
                    @click="$router.push({ path: `/edit-request/information-request/${xemchitiet(props)}` })"></q-btn>
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
              <q-tr v-show="props" :props="props">
                <q-td colspan="100%">
                  <div class="text-left" style="color: red" v-if="props.row.pheDuyet === false"> Chưa được phê duyệt</div>
                  <div class="text-left" style="color: coral" v-if="props.row.pheDuyet === true"> Đã được phê duyệt</div>
                  <div class="text-left" style="color: blue" v-if="props.row.pheDuyet === null"> Đang đợi phê duyệt</div>
                </q-td>
              </q-tr>
            </template>

            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="filters" placeholder="Tìm kiếm">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:no-data="{ icon, message, filters }">
              <div class="full-width row flex-center q-gutter-sm">
                <q-icon size="2em" name="sentiment_dissatisfied" />
                <span>
                  Chà, điều này thật đáng buồn ... {{ message }}
                </span>
                <q-icon size="2em" :name="filters ? 'filter_b_and_w' : icon" />
              </div>
            </template>

          </q-table>
        </div>
      </q-card-section>
      <q-dialog v-model="editInformation" persistent>
        <q-card style="min-width: 70%">
          <q-card-section>
            <div class="text-h6">Tiêu đề</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input dense v-model="veViec" />
          </q-card-section>
          <q-card-section>
            <div class="text-h6">Tóm tắt</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input dense v-model="subDescription" />
          </q-card-section>
          <q-card-section>
            <div class="text-h6">Nội dung</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-editor v-model="description" min-height="5rem" />
          </q-card-section>
          <q-card-section>
            <q-uploader flat style="width: 620px" label="Upload File " :factory="uploadFile" accept=".jpg,.pdf,.png">
            </q-uploader>
            <div style="color: red">
              (Chỉ Upload File có định dạng pdf,png,jpg - dung lượng không vượt
              quá 5MB)
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Đóng" color="primary" v-close-popup />
            <q-btn flat label="Sửa thông báo" @click="onUploadFile" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="xemtiep" persistent>
        <q-card style="min-width: 70%">
          <q-card-section class="row items-center">
            <div class="">
              <div class="col-12 top-title">
                <b> {{ veViec }} </b>

              </div>
              <q-btn v-if="nguoiDung != null" color="primary" style="width: 220px;" @click="DoiNguoiLamViec()">không phải
                của tôi</q-btn>
              <br />
              <p style="margin-top: 5px;"></p>
              <q-btn :disable="!progress" v-if="pheDuyet === true" color="primary">
                Đồng ý
              </q-btn>
              <q-btn :disable="!progress" v-else-if="pheDuyet === false" color="negative">Không đồng ý</q-btn>
            </div>
          </q-card-section>

          <q-card-section align="left">

            <div>
              <div class="col-6 col-md-5 q-mt-sm">
                <p>{{ CONTENT }}</p>
              </div>
              <div v-if="imageUrl" class="col-6 col-md-5 q-mt-sm">
                <a :href="'http://localhost:3004/Attached/' + imageUrl" target="_blank">
                  <!-- <img v-bind:src="'http://localhost:3004/Attached/' + imageUrl" alt="File đính kèm" width="600"
                    height="auto" /> -->
                  <iframe v-bind:src="'http://localhost:3004/Attached/' + imageUrl" width="600" height="500"></iframe>
                </a>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat label="Đóng" @click="xemtiept" color="red" />
            <q-btn flat label="Không đồng ý" v-on:click="KhongDongY()" color="deep-orange" v-if="pheDuyet === true" />
            <q-btn flat label="Đồng ý" v-on:click="DongY()" color="primary" v-if="pheDuyet === false" />
            <div v-if="pheDuyet === null">
              <q-btn flat label="Không đồng ý" v-on:click="KhongDongY()" color="deep-orange" />
              <q-btn flat label="Đồng ý" v-on:click="DongY()" color="primary" />
            </div>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- them model -->
      <q-dialog v-model="SuaNguoiDung" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-white text-primary" style="width: 300px">
          <q-card-section>
            <div class="text-h6">Đổi người làm việc</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select dense v-model="chonNguoiNhan" :options="optionNguoiNhan" class="text-primary" />
          </q-card-section>

          <q-card-actions class="bg-primary text-white">
            <q-btn flat label="Hủy" v-close-popup />
            <q-btn flat label="Xác nhận" v-close-popup @click="ChuyenNguoiNhanViec()" />
          </q-card-actions>
        </q-card>
      </q-dialog>



      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6 text-red">Xác nhận</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <span class="text-red"> Bạn có muốn xóa thống báo: </span> {{ veViec }} ?
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="primary" v-close-popup />
            <q-btn flat label="Đồng ý" @click="removeInformation" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
    <!-- <DialogSelectDate :selectDate="chooseDate" :showChooseDate="showChooseDate" :cancelChooseDate="cancelChooseDate" /> -->

  </q-page>
</template> 

<script>
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxEditing,
  DxExport,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
  DxHeaderFilter,
  DxColumnChooser,
} from "devextreme-vue/data-grid";
import DialogSelectDate from "../../components/commons/DialogSelectFromDateToDate";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../../ultils";
import moment from "moment";
import axios from "axios";
import { showNotifySuccess, showNotifyError } from "../../ultils";

import PageInformationViewTicket from "./PageInformationViewTicket.vue";

// import e from "express";

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxEditing,
    DxExport,
    DialogSelectDate,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
    DxHeaderFilter,
    DxColumnChooser,
    PageInformationViewTicket,
  },
  data() {
    return {
      selectedFile: "",
      showChooseDate: false,
      dataSource: [],
      fromDate: null,
      toDate: null,
      id: null,
      xemtiep: false,
      veViec: "",
      subDescription: null,
      description: null,
      imageUrl: null,
      editInformation: false,
      uploadfile: false,
      thongbao: true,
      confirm: false,
      listDepartmentByInfoId: [],
      columns: [
        // { name: 'File đính kèm', align: 'center', label: 'File đính kèm', field: 'imageUrl', sortable: true },
        { name: 'veViec', align: 'left', label: 'Về việc', field: 'veViec', sortable: true, required: true, },
        { name: 'Người tạo', align: 'center', label: 'Người tạo', field: 'LAST_NAME', sortable: true },
        { name: 'Phòng ban nhận', align: 'center', label: 'Phòng ban nhận', field: 'phongBan', sortable: true },
        { name: 'Phòng ban giao', align: 'center', label: 'Phòng ban giao', field: 'phongban', sortable: true },
        { name: 'Độ quan trọng', align: 'center', label: 'Độ quan trọng', field: 'doQuanTrong', sortable: true, },
        { name: 'Công việc', align: 'center', label: 'Công việc', field: 'loaiTicket', sortable: true },
        { name: 'Người nhận việc', align: 'center', label: 'Người nhận việc', field: 'nguoiDung', sortable: true, },
      ],
      rowsTable: [],
      filters: '',
      alert: false,
      SuaNguoiDung: false,
      optionNguoiNhan: [],
      chonNguoiNhan: "",
      pheDuyet: "",
      nguoiDung: "",
      CONTENT: "",

    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
  },
  created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.load();
  },
  methods: {
    showListDepartment(rowData) {
      let listDepartment = "";
      if (this.listDepartmentByInfoId.length > 0) {
        this.listDepartmentByInfoId.forEach(el => {
          if (el.ID == rowData.ID) {
            listDepartment = listDepartment + el.NAME + " , ";
            // console.log("listDepartment", listDepartment);
          }
        });
      }
      listDepartment = listDepartment.substring(0, listDepartment.length - 2);
      rowData.listDepartment = listDepartment;
      return rowData;
    },
    cancelChooseDate() {
      this.showChooseDate = false;
    },
    async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
      await this.load();
    },
    // async onChange(value) {
    //   // console.log(value.id);

    //   await this.load();
    // },
    uploadFile(files) {
      const selectedFile = files[0]; // accessing file
      this.selectedFile = selectedFile;
      this.imageUrl = this.selectedFile.name;
      // console.log("image : ", this.imageUrl);
      this.thongbao = false;
      this.uploadfile = true;
      const formData = new FormData();
      formData.append("myFile", this.selectedFile);
      axios
        .post("https://app.woodsland.com.vn:3003/uploadfile", formData)
        .then((res) => {
          showNotifySuccess();
        })
        .catch((err) => {
          showNotifyError();
        });
    },
    async load() {
      let payload = {
        accountId: this.userInfo.id,
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
      };

      const data = await this.$store.dispatch("NOTIFY/GET_TICKET", payload);
      //   const data2 = await this.$store.dispatch("NOTIFY/GET_DEPARTMENT_BY_INFO");
      // console.log("Hien thi du lieu table", data.data);
      data.data.forEach(item => {
        if (item.hoanThanh === null) {
          this.rowsTable.push({
            veViec: item.veViec,
            subDescription: item.subDescription,
            phongban: item.phongban,
            phongBan: item.phongBan,
            loaiTicket: item.loaiTicket,
            imageUrl: item.imageUrl,
            doQuanTrong: item.doQuanTrong,
            description: item.description,
            LAST_NAME: item.LAST_NAME,
            ID: item.ID,
            CREATED_AT: item.CREATED_AT,
            pheDuyet: item.pheDuyet,
            nguoiDung: item.nguoiDung,
            idNguoiDung: item.idNguoiDung,
            idPhongBan: item.idPhongBan,
          })
        }

      })

    },
    async onSelectionChanged(e) {
      this.id = e.data.data.ID;
      this.veViec = e.data.data.veViec;
      this.subDescription = e.data.data.subDescription;
      this.description = e.data.data.description;
      this.imageUrl = e.data.data.imageUrl;
      this.editInformation = true;
    },
    xemchitiet(e) {
      this.veViec = e.row.veViec;
      this.id = e.row.ID;
      this.CONTENT = e.row.description
      this.imageUrl = e.row.imageUrl;
      this.pheDuyet = e.row.pheDuyet;
      this.nguoiDung = e.row.nguoiDung;
      this.phongBan = e.row.phongBan;
      this.idNguoiDung = e.row.idNguoiDung;
      this.idPhongBan = e.row.idPhongBan;
      this.xemtiep = true;
      // console.log("hien thi id", this.id);
      return this.id;
    },
    xemtiept() {
      this.xemtiep = false;
    },
    async removeInformation() {
      const payload = {
        id: this.id,
        imageUrl: this.imageUrl,
      };
      const data = await this.$store.dispatch("NOTIFY/DELETE_INFORMATION", payload);
      if (data.meta.success) {
        showNotifySuccess();
        this.load();
      } else {
        showNotifyError();
      }
      this.load();
    },
    onFileChange(e) {
      const selectedFile = e.target.files[0]; // accessing file
      this.selectedFile = selectedFile;
      this.imageUrl = this.selectedFile.name;
      this.thongbao = false;
      this.uploadfile = true;
    },
    async onUploadFile() {
      //   const formData = new FormData();
      //   formData.append("myFile", this.selectedFile);
      //  // console.log('tr:',formData.append)
      //   axios
      //     .post("http://localhost:3003/uploadfile", formData)
      //     .then((res) => {
      //       console.log(res);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      let payload = {
        ID: this.id,
        veViec: this.veViec,
        subDescription: this.subDescription,
        description: this.description,
        imageUrl: this.imageUrl,
        accountId: this.userInfo.id,
      };
      const data = await this.$store.dispatch(
        "NOTIFY/UPDATE_INFORMATION",
        payload
      );

      if (data.meta.success) {
        showNotifySuccess();
        this.load();
      } else {
        showNotifyError();
      }
    },
    async KhongDongY() {
      let payload = {
        ID: this.id,
        pheDuyet: 1,
      }
      const data = await this.$store.dispatch("NOTIFY/UPDATE_TICKET", payload);
      this.xemtiep = false;
      showNotifySuccess();
      await this.load();
    },
    async DongY() {
      let payload = {
        ID: this.id,
        pheDuyet: 0,
      }
      const data = await this.$store.dispatch("NOTIFY/UPDATE_TICKET", payload);
      this.xemtiep = false;
      showNotifySuccess();
      await this.load();
    },
    async DoiNguoiLamViec() {
      // this.xemtiep = false;
      let payload = {
        idNguoiDung: this.idNguoiDung,
        idPhongBan: this.idPhongBan,
      };
      const data = await this.$store.dispatch("base/GET_ACCOUNT_TICKET", payload);
      // console.log("du lie nguoi dung", data.data);
      this.SuaNguoiDung = true;
      this.chonNguoiNhan = "";
      this.optionNguoiNhan = [];
      data.data.forEach(item => {
        this.optionNguoiNhan.push({
          label: item.LAST_NAME,
          value: item.LAST_NAME,
          key: item.ID,
        })
      });
    },
    async ChuyenNguoiNhanViec() {
      let payload = {
        ID: this.id,
        nguoiDung: this.chonNguoiNhan.value,
        idNguoiDung: this.chonNguoiNhan.key,
      };
      // console.log("hien thi edit:",payload);
      const data = await this.$store.dispatch("NOTIFY/EDIT_USER_TICKET", payload);
      showNotifySuccess();
      await this.load();
    },
  },
};
</script>

<style>
.color-while-title {
  color: #fff
}
</style>