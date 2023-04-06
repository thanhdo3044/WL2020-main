<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-10 top-title" align="center" >
            BIÊN BẢN NGHIỆM THU GỖ XẺ TƯƠI
          </div>
         </div>
                  
                   <div class="row justify-end">
          
              <div class="row" align="left">
                    BM-COC-01B
                    <br>
                    Ngày ban hành:20/06/2018
                    <br>
                    Lần ban hành 03
                   </div>
            </div>
          <div class="row print-hide justify-end">
            <div class="row">
              <q-btn
                outline
                color="primary"
                icon="edit"
                :disable="!showEdit"
                label="Để lại"
                @click="goEdit"
              />
            </div>
            <div class="row print-hide" align="right">
              <q-btn color="primary" icon="print" @click="view(phieunhapkho.sophieu)" />
            </div>
          </div>
        
      </q-card-section>
    
        <table
          class="tableprint"
          cellspacing="0"
          style="border-collapse:collapse; width:100%"
        >
          <tbody>
            <tr>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; height:21px; vertical-align:bottom; white-space:nowrap"
              >
                <b>Đơn vị giao hàng :</b>&nbsp; {{ phieunhapkho.name }}
              </td>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; height:21px; vertical-align:bottom; white-space:nowrap"
              >
                Số phiếu : {{ phieunhapkho.sophieu }}
              </td>
            </tr>
            <tr>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
              >
                <b>Địa chỉ : </b>{{ phieunhapkho.NCC_ADDRESS }}
              </td>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
              >
                Biển số xe: {{ phieunhapkho.BIENSOXE }}
              </td>
            </tr>
            <tr>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
              >
                <b>Kho nhập : </b>{{ phieunhapkho.tenkho }}
              </td>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
              >
                Ngày Nhập : {{ phieunhapkho.ngaynhapht }}
              </td>
            </tr>
            <tr>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
              >
                <b>Trạng thái MT</b>: FSC100%&nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp;Nhóm SP: W5
              </td>
              <td
                style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
              >
                Mã lô gỗ nhập : {{ phieunhapkho.MALOGONHAP}}
              </td>
            </tr>
             <tr>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
             <b>Loại gỗ: Acacia Mangium</b></td>
           <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
           </td>
        </tr>
          </tbody>
        </table>
     
     

      <q-card-section align="center" width="100%">
        <DxDataGrid
          :data-source="dataSource"
          :show-borders="true"
          :no-data-text="'Không có dữ liệu !'"
          :show-column-lines="true"
          :show-row-lines="true"
          :allow-column-resizing="true"
         
       @row-updated="update"
          key-expr="id"
          :selection="{ mode: 'multiple' }"
          @selection-changed="onSelectionChanged"
        >
          <DxEditing
                :allow-updating="true"
            
           
                mode="popp"
            />
          <!-- <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Chi tiết phiếu nhập kho  '+ phieunhapkho.sophieu"
            /> -->
          <!-- <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/> -->
          <DxColumn
            caption="STT"
            data-field="id"
            format="fixedPoint"
            alignment="center"
            width="80"
            cell-template="cellTemplate"
          />
          <!-- <DxColumn
            caption="Số phiếu nhập"
            data-field="SOPHIEUNHAP"
            alignment="center"
            width="120"
          /> -->
          <DxColumn caption="Qui Cách" alignment="center">
            <DxColumn
              caption="Dầy"
              data-field="DAY"
              format="fixedPoint"
              alignment="center"
              
            />
            <DxColumn
              caption="Rộng"
              data-field="RONG"
              format="fixedPoint"
              alignment="center"
              width="50"
            />
            <DxColumn
              caption="Dài"
              data-field="CAO"
              format="fixedPoint"
              alignment="center"
             
            />
          </DxColumn>
          <DxColumn
            data-field="sobo"
            caption="Số bó"
            alignment="center"
         
          />
          <DxColumn
            data-field="sothanh_bo"
            caption="Số thanh/bó"
            alignment="center"
            
          />
          <DxColumn
            data-field="Tổng số thanh"
            caption="Tổng số thanh"
            data-type="number"
            format="fixedpoint"
            alignment="center"
           
            :calculate-cell-value="calculateTongThanh"
          />
          <DxColumn
            data-field="KHOILUONG"
            caption="Khối lượng(m³)"
            format="##0.####"
            alignment="center"
            
            :calculate-cell-value="calculateKL"
          />
        
              <DxColumn data-field="MALOGONHAP" caption="Mã lô gỗ" width="150" />
                <DxColumn
                caption="Xếp Pallet"
                data-field="PALLET"
                alignment="center"
              />
          <DxColumn data-field="NOTE" caption="Ghi chú" width="150" />
          <DxSummary>
            <DxTotalItem
              column="SOPHIEUNHAP"
              summary-type="count"
             
              display-format="Tổng cộng : "
              show-in-column="sobo"
            />
            <DxTotalItem
              column="Tổng số thanh"
              summary-type="sum"
              display-format="{0}"
            />
            <DxTotalItem
              column="KHOILUONG"
              summary-type="sum"
              value-format="###0.####"
              display-format="{0}"
            />
          </DxSummary>
          <template #cellTemplate="cell">
            <p>{{ cell.data.rowIndex + 1 }}</p>
          </template>
          <template #cellTemplateOverPlan="cell">
            <span style="font-weight:700;color:red" v-if="cell.data.value === 1"
              >Ngoài kế hoạch</span
            >
            <span v-else></span>
          </template>
        </DxDataGrid>
      </q-card-section>
      <table
        class="tableprint"
        cellspacing="0"
        style="border-collapse:collapse; width:100%"
      >
        <tbody>
          <div class="row mt-5">
            <div class="col-4  text-center">
              <b>Người giao</b>
            </div>
            <div class="col-4  text-center">
              <b>Người nhận</b>
            </div>
            <div class="col-4  text-center">
              <b>Thủ kho</b>
            </div>
          </div>
          <div class="row mt5"><br /><br /><br /><br /></div>
          <div class="row mt-5">
            <div class="col-4  text-center">
              <h3></h3>
            </div>
            <div class="col-4  text-center">
              <span id="daiDienXSX_Ky">{{ getDaiDienKho(phieunhapkho.sophieu)}}</span>
            </div>
            <div class="col-4 text-center">
              <span id="nguoilapbb">{{ userInfo.lastName}}</span>
            </div>
          </div>
        </tbody>
      </table>
    </q-card>
    <q-page-sticky
      class="print-hide"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        fab
        icon="add"
        @click="goAdd(phieunhapkho.sophieu)"
        color="primary"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport,
  DxHeaderFilter,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
  DxLookup,
  DxRequiredRule,
  DxEditing
} from "devextreme-vue/data-grid";
import FormNhapKho from "../../../components/NLG/FormNhapKho";
import BoxSoPhieu from "../../../components/NLG/BoxSoPhieuInfo";
import { mapGetters } from "vuex";
import { roundNumber } from '../../../utils/utils';
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxExport,
    DxHeaderFilter,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
    DxEditing,
    FormNhapKho,
    BoxSoPhieu
  },
   computed: {
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("nlg", ["getKhoByAccount", "getAllKhos", "phieuNhapKhos", "getDaiDienKho"])
  },
  data() {
    return {
      dataSource: [],
      phieunhapkho: {},
      guid: "",
      idSelect: null,
      showEdit: false,
      showForm: true
    };
  },
  created() {
    this.load();
    this.loadDetail();
  },
  methods: {
    view(guid) {
        this.$router.push({
        path: "/nlg-view-phieu-nhap-kho/",
        query: { guid: guid.replace("/", "-") }
      });
      //window.print();
    },
    async goEdit() {
      this.$router.push({
        name: "edit-detail-nlg",
        params: { id: this.idSelect }
      });
    },
    goAdd(guid) {
      // const guid = this.phieunhapkho.sophieu.replace('/','-')
      // console.log(guid)
      // showNotifySuccess('Tạo phiếu thành công số phiếu :'+phieunhap.NUM+'/'+phieunhap.MONTH)
      //this.$router.push('/nlg-nhap-kho1')
      this.$router.push("/nlg-add-detail/" + guid.replace("/", "-"));
    },
    onSelectionChanged({ selectedRowsData }) {
      this.idSelect = selectedRowsData[0].id;
      this.showEdit = true;
    },
    async load() {
      const guid = this.$route.query.guid.replace("-", "/");

      if (guid) {
        this.guid = guid;
        const data1 = await this.$store.dispatch("nlg/GET_DS_PHIEU_NHAP_KHO3", {
          guid: guid
        });
        this.phieunhapkho = data1.data[0];
      }
    },
        async update(e){
            
            const data = await this.$store.dispatch('nlg/EDIT_NHAP_KHO',e.data)
            // console.log(e)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
    async loadDetail() {
      const guid = this.$route.query.guid.replace("-", "/");
      if (guid) {
        this.guid = guid;
        const data = await this.$store.dispatch("nlg/GET_DS_NHA_CUNG_CAP1", {
          guid: guid
        });
        if (data.data) this.dataSource = data.data;
        // console.log(guid)
      }
    },
    onEditorPreparing(e) {
      if (e.dataField === "id") {
        e.editorOptions.disabled = true;
      }
    },
    calculateTongThanh(rowData) {
      return rowData.sobo * rowData.sothanh_bo;
    },
    calculateKL(rowData) {
      if (rowData.DAY==55 && rowData.RONG == 55 && rowData.CAO == 1270 )
         return (
        roundNumber(((rowData.sobo *
          rowData.sothanh_bo *
          rowData.DAY *
          rowData.RONG *
          rowData.CAO)*3.14 /
        4000000000
      ),4));
      else
      return (
        roundNumber(((rowData.sobo *
          rowData.sothanh_bo *
          rowData.DAY *
          rowData.RONG *
          rowData.CAO) /
        1000000000
      ),4));
    },
    sumTongThanhGrid(data) {
      console.log(data);
      return `First: `;
    }
  }
};
</script>

<style></style>
