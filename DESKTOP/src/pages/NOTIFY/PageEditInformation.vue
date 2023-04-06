<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section class="bg-primary">
        <div class="row">
          <div class="col-6 top-title text-orange">Danh sách thông báo</div>

          <div
            class="col-6 top-title cursor-pointer text-orange"
            align="right"
            @click="showChooseDate = true"
          >
            Từ ngày {{ tuNgay }} đến {{ denNgay }}
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <DxDataGrid
              :data-source="dataSource"
              :word-wrap-enabled="true"
              :show-borders="true"
              :no-data-text="'Nhấn xem báo cáo để lấy dữ liệu'"
              :show-column-lines="true"
              :show-row-lines="true"
              :allow-column-resizing="true"
            >
              <!-- <DxEditing :allow-updating="true" mode="cell" /> -->
              <!-- <DxColumnChooser :enabled="true" />
              <DxHeaderFilter :visible="true" />
              <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              /> -->
              <DxGrouping :auto-expand-all="true" />
              <DxColumn
                data-field="ID"
                caption="#"
                :visible="false"
                css-class="mau-edit-information"
              />
              <DxColumn
                data-field="veViec"
                caption="Về Việc"
                css-class="mau-edit-information"
              />
              <DxColumn
                data-field="subDescription"
                caption="Tóm tắt"
                css-class="mau-edit-information"
              />
              <DxColumn
                data-field="imageUrl"
                caption="File đính kèm"
                css-class="mau-edit-information"
              />
              <DxColumn
                data-field="LAST_NAME"
                caption="Người tạo"
                css-class="mau-edit-information"
              />
              <DxColumn
                data-field="CREATED_AT"
                caption="Ngày tạo"
                data-type="date"
                format="dd/MM/yyyy HH:mm:ssZ"
                css-class="mau-edit-information"
              />
              <DxColumn
                data-field="listDepartment"
                caption="Danh sách phòng ban"
                data-type="date"
                css-class="mau-edit-information"
                :calculate-cell-value="showListDepartment"
              />
              <!-- <DxColumn
                alignment="center"
                :allowEditing="false"
                caption="Chỉnh sửa"
                width="100"
                cell-template="del-cell"
                css-class="mau-edit-information"
              />
              <template #del-cell="cell">
                <span class="fake-link" @click="onSelectionChanged(cell)"
                  >Sửa</span
                >
              </template> -->
              <DxColumn
                v-if="userInfo.id === 100400 || userInfo.id === 102089"
                alignment="center"
                :allowEditing="false"
                caption="Xóa"
                width="100"
                cell-template="del-cell2"
                css-class="mau-edit-information"
              />
              <template #del-cell2="cell">
                <span class="fake-link" @click="onRemove(cell)">Xóa</span>
              </template>
              <!-- <DxExport
                :enabled="true"
                :allow-export-selected-data="false"
                :file-name="
                  'Dữ liệu sản xuất chi tiết từ ngày ' +
                  tuNgay +
                  ' đến ngày ' +
                  denNgay
                "
              />
              <DxSearchPanel
                :visible="true"
                :placeholder="'Tìm kiếm'"
                :width="400"
              /> -->
            </DxDataGrid>
          </div>
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
            <q-uploader
              flat
              style="width: 620px"
              label="Upload File "
              :factory="uploadFile"
              accept=".jpg,.pdf,.png"
            >
            </q-uploader>
            <div style="color: red">
              (Chỉ Upload File có định dạng pdf,png,jpg - dung lượng không vượt
              quá 5MB)
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Đóng" color="primary" v-close-popup />
            <q-btn
              flat
              label="Sửa thông báo"
              @click="onUploadFile"
              color="primary"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section>
          <div class="text-h6 text-red">Xác nhận</div>
        </q-card-section>
          <q-card-section class="q-pt-none">
          <span class="text-red"> Bạn có muốn xóa thống báo: </span>  {{ veViec }} ?
        </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="primary" v-close-popup />
            <q-btn
              flat
              label="Đồng ý"
              @click="removeInformation"
              color="primary"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
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
  },
  data() {
    return {
      selectedFile: "",
      showChooseDate: false,
      dataSource: [],
      fromDate: null,
      toDate: null,
      id: null,
      veViec: "",
      subDescription: null,
      description: null,
      imageUrl: null,
      editInformation: false,
      uploadfile: false,
      thongbao: true,
      confirm: false,
      listDepartmentByInfoId: [],
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
     showListDepartment(rowData){
      let listDepartment = "";
      if(this.listDepartmentByInfoId.length > 0){
        this.listDepartmentByInfoId.forEach(el => {
        if(el.ID == rowData.ID){
          listDepartment = listDepartment + el.NAME + " , ";
          console.log("listDepartment", listDepartment);
        }
      });
      }
      listDepartment = listDepartment.substring(0, listDepartment.length - 2);
      rowData.listDepartment = listDepartment;
      return rowData.listDepartment;
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
    async onChange(value) {
      // console.log(value.id);

      await this.load();
    },
    uploadFile(files) {
      const selectedFile = files[0]; // accessing file
      this.selectedFile = selectedFile;
      this.imageUrl = this.selectedFile.name;
      console.log("image : ", this.imageUrl);
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
        fromDate: moment(this.fromDate).format("YYYY-MM-DD 00:00:00"),
        toDate: moment(this.toDate).format("YYYY-MM-DD 23:59:59"),
      };

      const data = await this.$store.dispatch("NOTIFY/INFORMATIONS", payload);
      const data2 = await this.$store.dispatch("NOTIFY/GET_DEPARTMENT_BY_INFO");
      this.listDepartmentByInfoId = data2.data;
      this.dataSource = data.data;
    },
    async onSelectionChanged(e) {
      this.id = e.data.data.ID;
      this.veViec = e.data.data.veViec;
      this.subDescription = e.data.data.subDescription;
      this.description = e.data.data.description;
      this.imageUrl = e.data.data.imageUrl;
      this.editInformation = true;
    },
    onRemove(e) {
      this.veViec = e.data.data.veViec;
      this.id = e.data.data.ID;
      this.imageUrl = e.data.data.imageUrl;
      this.confirm = true;
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
  },
};
</script>

<style>

</style>