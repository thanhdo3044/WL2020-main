<template>
  <q-page class="q-pa-sm">
    <q-card-section class="bg-primary print-hide">
      <div class="row">
        <div class="col-6 top-title text-orange">Tạo mẫu khai báo</div>
        <div class="col-6" align="right"></div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="container">
        <q-input v-model="title" label="Tiêu đề" />
        <div class="w-100">
          <span style="">Nội dung</span>
          <q-editor v-model="description" min-height="5rem" />
          <div class="w-100" align="right">
            <q-radio
              v-model="location"
              val="top"
              label="Nội dung được hiển thị đầu trang"
            />
            <q-radio
              v-model="location"
              val="bottom"
              label="Nội dung được hiển thị cuối trang"
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section v-for="(value, index) in listQuestion" :key="index">
      <div class="container">
        <div class="row">
          <div class="col-8">
            <q-input v-model="value.question" label="Nhập tiêu đề" />
          </div>
          <div class="col-4">
            <q-select
              dense
              v-model="value.type"
              :options="options"
              label="Chọn kiểu"
            />
          </div>
        </div>
        <div
          v-for="(option, index2) in value.options"
          :key="index2"
          class="row"
        >
          <div
            v-if="
              value.type.value === 'radio' || value.type.value === 'checkbox'
            "
            class="col-1"
          >
            <span
              v-if="value.type.value === 'radio'"
              style="font-size: 30px; height: 100%"
              class="material-icons"
            >
              radio_button_unchecked
            </span>
            <span
              v-if="value.type.value === 'checkbox'"
              style="font-size: 30px; height: 100%"
              class="material-icons"
            >
              check_box_outline_blank
            </span>
          </div>
          <div
            v-if="
              value.type.value === 'radio' || value.type.value === 'checkbox'
            "
            class="col-11"
          >
            <q-input v-model="option.option" :label="'Lựa chọn ' + index2" />
          </div>
        </div>
        <div class="row">
          <div class="col-10">
            <q-btn
              @click="addOption(index)"
              color="white"
              label="Add option"
              text-color="black"
              icon="add"
            />
            &nbsp;&nbsp;
            <q-btn
              @click="deleteOption(index)"
              color="white"
              label="Delete option"
              text-color="black"
              icon="clear"
            />
          </div>
          <div class="col-2">
            <q-toggle v-model="value.required" label="Bắt buộc" />
          </div>
        </div>
      </div>
    </q-card-section>
    <div class="row" style="width: 50%; margin: 0 auto">
      <div class="col-6">
        <q-btn
          @click="addQuestion"
          round
          color="white"
          text-color="black"
          icon="add"
        />
        &nbsp;
        <q-btn
          @click="deleteQuestion"
          round
          color="white"
          text-color="black"
          icon="clear"
        />
      </div>
      <div class="col-6" align="right">
        <q-btn
          @click="createForm"
          color="positive"
          text-color="black"
          label="Tạo mẫu"
        />
      </div>
    </div>
    <div class="row" style="width: 50%; margin: 0 auto">
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
      <div class="col-6">
        <q-checkbox color="orange" class="text-orange text-bold" v-model="sendManager" label="Chỉ gửi đến trưởng bộ phận" />
      </div>
      
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
      title: null,
      description: "",
      location: "top",
      options: [
        {
          label: "Chọn một",
          value: "radio",
        },
        {
          label: "Chọn nhiều",
          value: "checkbox",
        },
        {
          label: "Tự điền",
          value: "text",
        },
        {
          label: "Ngày giờ",
          value: "date",
        },
      ],
      listQuestion: [
        {
          question: null,
          type: {
            label: "Chọn một",
            value: "radio",
          },
          required: false,
          options: [
            {
              option: null,
            },
          ],
        },
      ],
      departments: [],
      sendManager: false,
      dataTemp: [],
      expandedRowKeys: [1],
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
  mounted() {
    this.loadDepartment();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
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
  methods: {
    ...mapActions("formRegister", [
      "insertFormRegister",
      "insertFormQuestion",
      "insertQuestionOption",
      "insertFormRoleDepartment",
    ]),
    addQuestion() {
      const question = {
        question: null,
        type: {
          label: "Chọn một",
          value: "radio",
        },
        required: false,
        options: [
          {
            option: null,
          },
        ],
      };
      this.listQuestion.push(question);
    },
    deleteQuestion() {
      this.listQuestion.pop();
    },
    deleteOption(index) {
      this.listQuestion[index].options.pop();
    },
    addOption(index) {
      this.listQuestion[index].options.push({ option: null });
    },
    async createForm() {
      if (this.dataTemp.length == 0) {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng chọn Phòng Ban trước khi tạo thông báo ! </span>`,
          persistent: true,
        });
      } else {
        console.log("listQuestion", this.listQuestion);
      const payload = {
        title: this.title,
        description: this.description,
        location: this.location,
        accountId: this.userInfo.id,
      };
      const data = await this.insertFormRegister(payload);
      this.createFormRoleDepartment(data[0].ID);
      if (data.length > 0) {
        let i = 1;
          this.listQuestion.forEach((el) => {
            this.createFormQuestion(data[0].ID, el, i);
            i++;
          });
      }
      }
      
    },
    async createFormRoleDepartment(formId){
      const payload = {
        formId: formId,
        permission: this.dataTemp.departmentId,
        sendManager: this.sendManager ? 1 : 0,
        accountId: this.userInfo.id
      }
      const data = await this.insertFormRoleDepartment(payload);
    },
    async createFormQuestion(id, question, index) {
      const payload = {
        formId: id,
        index: index,
        title: question.question,
        type: question.type.value,
        required: question.required ? 1 : 0,
        accountId: this.userInfo.id,
      };
      const data = await this.insertFormQuestion(payload);
      console.log("question", data.length);
      if (data.length > 0) {
          question.options.forEach((el) => {
            if (
              question.type.value == "radio" ||
              question.type.value == "checkbox"
            ) {
              this.createQuestionOption(data[0].ID, el.option);
            }
          });
      }
    },
    async createQuestionOption(id, option) {
      const payload = {
        questionId: id,
        option: option,
        accountId: this.userInfo.id,
      };
      const data = await this.insertQuestionOption(payload);
    },
    async loadDepartment() {
      const { data } = await this.$store.dispatch("base/GET_DEPARTMENTS_FULL", {
        factoryId: 102627
      });
      this.departments = data;
    },
  },
};
</script>

<style>
.container {
  width: 50%;
  margin: 0 auto;
  border: 2px solid #21ba45;
  padding: 10px;
  border-radius: 5px;
  -moz-box-shadow: 3px 3px #666;
  -webkit-box-shadow: 3px 3px #666;
  box-shadow: 3px 3px #666;
}
</style>