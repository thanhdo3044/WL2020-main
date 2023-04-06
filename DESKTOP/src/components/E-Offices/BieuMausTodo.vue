<template>
  <div id="data-grid-demo">
    <DxTreeList
      :data-source="proposalForms"
      :show-borders="true"
      key-expr="id"
       parent-id-expr="parentId"
      @editing-start="logEvent('EditingStart')"
      @editorPreparing="onEditorPreparing"
      @init-new-row="onInitNewRow"
      @row-inserting="logEvent('RowInserting')"
      @row-inserted="onRowInserted"
      @row-updating="logEvent('RowUpdating')"
      @row-updated="onRowUpdated"
      @row-removing="logEvent('RowRemoving')"
      @row-removed="onRowRemoved"
    >
      <DxPaging :enabled="false" />
      <DxEditing
        :allow-updating="true"
        :allow-deleting="true"
        :allow-adding="true"
        mode="popup"
      >
        <DxPopup
          :show-title="true"
          :width="700"
          :height="525"
          title="Thông tin biểu mẫu"
        ></DxPopup>
      </DxEditing>
      <!-- <DxColumn data-field="id" width="100" alignment="center" caption="ID" /> -->
      <DxColumn data-field="name" caption="Tên biểu mẫu" />
      <DxColumn data-field="slug" caption="Chọn loại mẫu">
        <DxLookup
          :data-source="formTypes"
          value-expr="id"
          display-expr="name"
        />
      </DxColumn>
      <DxColumn
        data-field="status"
        caption="Tình trạng"
        :allowEditing="false"
      />
      <!-- <DxColumn
        data-field="createdAt"
        data-type="date"
        caption="Ngày tạo"
        :allowEditing="false"
      /> -->
      <!-- <DxColumn
        :width="170"
        data-field="accountId"
        caption="Tạo bởi"
        :allowEditing="false"
      /> -->
      <!-- <DxColumn
        data-field="updatedAt"
        data-type="date"
        caption="Cập nhật"
        :allowEditing="false"
      /> -->
      <!-- <DxColumn
        data-field="parentId"
        caption="parentId"
        :allowEditing="true"
      /> -->
    </DxTreeList>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import {
  DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxSorting,
  DxPaging,
  DxEditing,
  DxPopup,
  DxLookup,
  DxPosition,
  DxForm
} from 'devextreme-vue/tree-list';
import { DxTextArea } from "devextreme-vue/text-area";
import { DxItem } from "devextreme-vue/form";

export default {
  props: ["proposalForms"],
  data() {
    return {
      formTypes: [
        {
          id: "mua-hang",
          name: "Phiếu mua hàng"
        },
        {
          id: "thanh-toan",
          name: "Đề nghị thanh toán"
        },
        {
          id: "de-nghi-tam-ung",
          name: "Đề nghị tạm ứng"
        },
        {
          id: "dang-ky-xe",
          name: "Đặt xe đi công tác"
        },
        {
          id: "xac-nhan-cong",
          name: "Đơn xin xác nhận công"
        },
        {
          id: "de-nghi-luong",
          name: "Đề nghị lương - thưởng"
        },
        {
          id: "di-cong-tac",
          name: "Đề nghị đi công tác"
        },
        {
          id: "xin-ra-cong",
          name: "Đơn xin ra cổng"
        },
        {
          id: "xin-nghi-viec",
          name: "Đơn xin nghỉ"
        },
        {
          id: "de-nghi-tam-ung",
          name: "Đề nghị tạm ứng"
        },
        {
          id: "tuyen-nhan-vien",
          name: "Đề xuất tuyển nhân viên"
        },
        {
          id: "bien-ban-ban-giao",
          name: "Biên bản bàn giao"
        },
        {
          id: "van-phong-pham",
          name: "Đề xuất văn phòng phẩm"
        },
        {
          id: "sua-chua",
          name: "Đề xuất sửa chữa"
        },
        {
          id: "cap-bao-ho-lao-dong",
          name: "Đề xuất cấp bảo hộ lao động"
        }
        ,
        {
          id: "chuyen-nhan-vien",
          name: "Đề xuất chuyển nhân viên"
        },
        {
          id: "vat-tu",
          name: "Đề xuất cấp vật tư"
        }
        
      ]
    };
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "userInfo"])
  },
  methods: {
    ...mapActions("proposalForm", [
      "getAllProposalForms",
      "addProposalForm",
      "onRowInserted",
      "onRowUpdated",
      "onRowRemoved"
    ]),
    onEditorPreparing(e) {
      console.log(e);
      if (e.dataField === "id" || e.dataField === "accountId") {
        e.editorOptions.disabled = true;
      }
    },
    onInitNewRow(e) {
      e.data.accountId = this.userInfo.id;
      e.data.factoryId = this.myFactoryInfor.id;
      e.data.status = "Đang sửa dụng";
      console.log(this.userInfo, this.myFactoryInfor);
    },
    logEvent(e) {
      console.log(e);
    }
  },
  components: {
      DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  DxLookup,
  DxSorting,
  DxPaging,
  DxEditing,
  DxPopup,
  DxLookup,
  DxPosition,
  DxForm
  }
};
</script>
