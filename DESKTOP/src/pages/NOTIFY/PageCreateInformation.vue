<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary print-hide">
      <div class="row">
        <div class="col-6 top-title text-orange">Tạo thông báo mới</div>
        <div class="col-6"></div>
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
        <div class="row">
          <div class="col-2">
            <label class="text-bold" for="fname">Thông báo số</label>
          </div>
          <div class="col-4">
            <input class="text-bold" type="text" v-model="code" />
          </div>
          <div class="col-1"></div>
          <div class="col-2">
            <label class="text-bold" for="fname">Ngày gửi thông báo</label>
          </div>
          <div class="col-3">
            <q-input style="padding:0px" readonly dense filled v-model="date" mask="####-##-##">        
            </q-input>
          </div>
        </div>
        <div class="row">
          <div class="col-2">
            <label class="text-bold" for="fname">Về việc</label>
          </div>
          <div class="col-10">
            <input type="text" v-model="veViec" placeholder="Về việc.." />
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
        <div class="row">
          <div class="col-2">
            <label class="text-bold" for="subject">Nội dung</label>
          </div>
          <div class="col-10">
            <q-editor v-model="description" min-height="5rem" />
          </div>
        </div>
        <div class="row">
          <div class="col-2"></div>
          <div class="col-10">
            <q-uploader
              style="width: 620px"
              label="Upload File "
              :factory="uploadFile"
              accept=".jpg,.pdf,.png"
            >
            </q-uploader>
          </div>
        </div>
        <div class="row">
          <div class="col-2"></div>
          <div class="col-10" style="color: red">
            (Chỉ Upload File có định dạng <b>pdf, png, jpg</b> - dung lượng
            không vượt quá 5MB)
          </div>
        </div>
      </form>
    </div>
    <div class="row">
      <DxTreeList
        class="col-6"
        id="departments"
        :data-source="getSources"
        :column-auto-width="true"
        :show-row-lines="true"
        :show-borders="true"
        :expanded-row-keys="expandedRowKeys"
        key-expr="id"
        parent-id-expr="parentId"
        :selected-row-keys="selectedItemKeys"
        @selection-changed="selectionChanged"
      >
        <DxSelection mode="multiple" :recursive="true" />
        <DxPaging :enabled="true" :page-size="40" />
        <DxFilterRow :visible="true" />

        <DxColumn data-field="id" :visible="false" />
        <DxColumn
          :width="120"
          data-field="parentId"
          caption="Bộ phận/Phòng ban"
          :visible="false"
        >
          <DxLookup
            :data-source="departments"
            display-expr="name"
            value-expr="id"
          />
        </DxColumn>
        <DxColumn
          data-field="name"
          caption="Chọn phòng ban để nhận thông báo"
          css-class="cell-information"
        >
          <DxValidationRule type="required" />
        </DxColumn>
      </DxTreeList>
      <div class="col-1">
        <q-checkbox color="orange" class="text-orange text-bold" v-model="sendManager" label="Chỉ gửi đến trưởng bộ phận" />
      </div>
      <div class="col-1">
        <input
          type="button"
          v-on:click="onUploadFile"
          value="Tạo thông báo"
        />
      </div>
      
    </div>
  </q-page>
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
      dataTemp: [],
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
        console.log("dataTemp", this.dataTemp.departmentId);
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
      console.log(this.departments);
      return [];
    },
  },
  created() {
    this.date = moment().format("YYYY-MM-DD");
    this.checkCode();
    this.loadUsers();
    console.log(this.$store.state.base.userInfo.departmentId);
  },
  mounted() {
    this.loadDepartment();
  },
  methods: {
    onEditorPreparing(e) {
      if (e.dataField === "Head_ID" && e.row.data.ID === 1) {
        e.editorOptions.disabled = true;
        e.editorOptions.value = null;
      }
    },
    async checkCode() {
      // format 100-21/TB-WL
      let data = await this.$store.dispatch("NOTIFY/getCodeInNotify");
      console.log("data", data);
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
          axios
            .post("https://app.woodsland.com.vn:3003/uploadfile", formData)
            .then((res) => {
              showNotifySuccess();
            })
            .catch((err) => {
              showNotifyError();
            });
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

    async onUploadFile() {
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
          .onOk(() => {
            // danh sách các bộ phận nhận được thông báo
            this.dataTemp = JSON.stringify(this.dataTemp);
            console.log("date", this.date);
            let payload = {
              subDescription: this.subDescription,
              description: this.description,
              imageUrl: this.imageUrl,
              accountId: this.userInfo.id,
              confirm: this.confirm ? 1 : 0,
              permission: this.dataTemp == null ? null : this.dataTemp,
              code: this.code,
              date: this.date,
              veViec: this.veViec,
              sendManager: this.sendManager,
            };
            this.$store.dispatch("NOTIFY/INSERT_INFORMATION", payload);
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

input[type="text"],
select,
textarea {
  width: 100%;
  padding: 12px;
  /* border: 1px solid #ccc; */
  /* border-radius: 4px;
  resize: vertical; */
}

label {
  padding: 12px 12px 12px 0;
  display: inline-block;
}

input[type="button"] {
  background-color: #1b5e20;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
}

input[type="submit"]:hover {
  background-color: #45a049;
}

.container {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
}

.col-25 {
  float: left;
  width: 25%;
  margin-top: 6px;
}

.col-75 {
  float: left;
  width: 75%;
  margin-top: 6px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

/* Responsive layout - when the screen is less than 600px wide, make the two columns stack on top of each other instead of next to each other */
@media screen and (max-width: 600px) {
  .col-25,
  .col-75,
  input[type="submit"] {
    width: 100%;
    margin-top: 0;
  }
}
</style>