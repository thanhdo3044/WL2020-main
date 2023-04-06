<template>
  <q-page class="q-pa-md" style="font-family: 'Times New Roman', Times, serif;">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-10 top-title">
            BẢNG KÊ VÀ SỐ LIỆU NGHIỆM THU GỖ XẺ
          </div>
          <div class="col-2 print-hide" align="right">
            <q-btn color="primary" label="Hoàn thành" @click="completed" />
          </div>
        </div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <BoxSoPhieu :phieunhapkho="phieunhapkho" />
      </q-card-section>
      <!-- :onAdaptiveDetailRowPreparing="onRowClick"
          :onRowClick="onRowClick" -->
      <q-card-section v-if="dataSourceF && dataSourceF.length">
        <DxTreeList
          id="dataSource"
          :data-source="dataSourceF"
          :show-borders="true"
          :show-row-lines="true"
          :column-auto-width="true"
          :word-wrap-enabled="true"
          :auto-expand-all="true"
          :expanded-row-keys="expandedRowKeys"
          :selected-row-keys="selectedRowKeys"
          :editor-preparing="onRowClick"
          :onEditorPrepared="onRowClick"
          key-expr="id"
          parent-id-expr="ID_DT"
          class="text-color"
        >
          <DxSearchPanel :visible="false" :width="250" />
          <DxHeaderFilter :visible="false" />
          <DxColumnChooser :enabled="false" />

          <!-- <DxColumn
                caption="STT"
                data-field="ID"
                format="fixedPoint"
                alignment="center"
                width="50"
                cell-template="cellTemplate1"
              /> -->

           <DxColumn
            caption="STT"
            data-field="id"
            alignment="center"
            width="50"
            cell-template="cellTemplate"
          />

          <DxColumn
            :width="180"
            data-field="TYPE"
            caption="Loại"
            cell-template="typeTemplate"
          />
          <DxColumn caption="Qui Cách" alignment="center">
            <DxColumn
              caption="Dầy"
              data-field="DAY"
              format="fixedPoint"
              alignment="center"
              width="60"
              
            />
            <DxColumn
              caption="Rộng"
              data-field="RONG"
              format="fixedPoint"
              alignment="center"
              width="60"
              
            
            />
            <DxColumn
              caption="Dài"
              data-field="CAO"
              format="fixedPoint"
              alignment="center"
              width="60"
             
            />
          </DxColumn>
          <DxColumn data-field="SOBO" caption="Số bó" width="80"
          cell-template="cellTemplateSOBO"
          > </DxColumn>
          <template #cellTemplateSOBO="cell">
            <div
              class="fake-link"
               v-if="cell.data.data.ID_DT == 0"
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px">
                  <b style="text-color:blue">{{ cell.data.data.SOBO }}</b>
                </div> 
            </div
            >
            <!-- <div v-else>{{ options.data.data.TYPE }}</div> -->
          </template>
          <DxColumn data-field="SOTHANH_BO" caption="số thanh/bó" width="80"
          cell-template="cellTemplateSOTHANH_BO"
          >
            
          </DxColumn>
          <template #cellTemplateSOTHANH_BO="cell">
            <div
              class="fake-link"
               v-if="cell.data.data.ID_DT == 0"
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px">
                  <b style="text-color:blue">{{ cell.data.data.SOTHANH_BO }}</b>
                </div> 
            </div
            >
            <!-- <div v-else>{{ options.data.data.TYPE }}</div> -->
          </template>
          <DxColumn
            data-field="sothanh"
            caption="Số thanh giao"
            format="fixedpoint"
            alignment="center"
            width="80"
            cell-template="cellTemplateSoThanh"
          >
          </DxColumn>
          <DxColumn data-field="GAPDOI" 
          cell-template="cellTemplateGapDoi"
          caption="Gấp đôi" width="80">
          </DxColumn>
          <DxColumn
            data-field="SLMAU"
            caption="SL Mẫu"
            format="fixedpoint"
            alignment="center"
            width="80"
            cell-template="cellTemplateSLMAU"
          >
          </DxColumn>
          <template #cellTemplateSLMAU="cell">
            <div
              class="fake-link"
               v-if="cell.data.data.ID_DT == 0"
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px">
                  <b style="text-color:blue">{{ cell.data.data.SLMAU }}</b>
                </div> 
            </div
            >
            <!-- <div v-else>{{ options.data.data.TYPE }}</div> -->
          </template>
          <DxColumn
            data-field="QTY"
            caption="SL ĐẠT"
            alignment="center"
            width="80"
          
          >
          </DxColumn>
          <template #cellTemplateQTY="cell">
            <div
              class="fake-link"
              v-if="cell.data.data.ID_DT == 0"
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px">
                  <b style="text-color:blue">{{ cell.data.data.QTY }}</b>
                </div> 
            </div
            >
            <!-- <div v-else>{{ options.data.data.TYPE }}</div> -->
          </template>
          <DxColumn
            data-field="TYLE"
            caption="Tỷ lệ"
            alignment="center"
            format="#0.## %"
            cell-template="cellTemplateTYLE"
          >
          </DxColumn>
          <template #cellTemplateTYLE="cell">
            <div
              class="fake-link"
              v-if="cell.data.data.ID_DT == 0"
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px">
                  <b style="text-color:blue">{{ ((cell.data.data.TYLE)*100).toFixed(2)  }} %</b>
                </div> 
            </div
            >
            <div v-else>{{ ((cell.data.data.TYLE)*100).toFixed(2)  }} %</div>
          </template>  
          <DxColumn
            data-field="KHOILUONG"
            caption="Khối lượng"
            format="#0.#### m³"
            alignment="center"
            cell-template="cellTemplateKHOILUONG"
          >
          </DxColumn>
          <template #cellTemplateKHOILUONG="cell">
            <div
              class="fake-link"

             v-if="cell.data.data.ID_DT == 0"
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px">
                  <b style="text-color:blue">{{ parseFloat(cell.data.data.KHOILUONG).toFixed(4) }}</b>
                </div> 
            </div
            >
            <!-- <div v-else>{{ options.data.data.TYPE }}</div> -->
          </template>

           <DxColumn
           style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px"
            data-field="NOTE"
            caption="Ghi chú"
            alignment="center"
            width="120"
            cell-template="cellTemplateNOTE"
          >
          </DxColumn>
          <template #cellTemplateNOTE="cell">
            <div
              class="fake-link"
              v-if="cell.data.data.ID_DT == 0"
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px">
                  <b style="text-color:blue">{{ cell.data.data.NOTE }}</b>
                </div> 
            </div
            >
            <!-- <div v-else>{{ options.data.data.TYPE }}</div> -->
          </template>

          <template #typeTemplate="options">
            <div
              class="fake-link"
              v-if="options.data.data.ID_DT == 0"
              @click="go(options.data.data.id)"
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px"><b style="text-color:blue">Chính phẩm</b></div> </div
            >
            <div v-else>{{ options.data.data.TYPE }}</div>
          </template>
          <template #cellTemplateSoThanh="cell">
            <div
              class="fake-link"
              v-if="cell.data.data.ID_DT == 0"
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px">
                  <b style="text-color:blue">{{ cell.data.data.sothanh }}</b>
                </div> 
            </div
            >
            <!-- <div v-else>{{ options.data.data.TYPE }}</div> -->
          </template>
          <template #cellTemplateDay="cell">
            <div
              class="fake-link"
              v-if="cell.data.data.ID_DT == 0"
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px">
                  <b style="text-color:blue">{{ cell.data.data.DAY }}</b>
                </div> 
            </div
            >
            <!-- <div v-else>{{ options.data.data.TYPE }}</div> -->
          </template>
          <template #cellTemplateRong="cell">
            <div
              class="fake-link"
              v-if="cell.data.data.ID_DT == 0"
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px">
                  <b style="text-color:blue">{{ cell.data.data.RONG }}</b>
                </div> 
            </div
            >
            <!-- <div v-else>{{ options.data.data.TYPE }}</div> -->
          </template>
          <template #cellTemplateCao="cell">
            <div
              class="fake-link"
              v-if="cell.data.data.ID_DT == 0"
              ><div class="text" style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px">
                  <b style="text-color:blue">{{ cell.data.data.CAO }}</b>
                </div> 
            </div
            >
            <!-- <div v-else>{{ options.data.data.TYPE }}</div> -->
          </template>
          <template #cellTemplateGapDoi="cell">
             <!-- {{cell.data.data.GAPDOI == null ? ' ' : cell.data.data.GAPDOI}} -->
            <p   v-if="cell.data.data.GAPDOI == null" ></p>
            <p   v-else-if="cell.data.data.GAPDOI.toString().trim() == 'N'" ></p>
            <p style="border-radius:5px;width: 100% ; height:100% ; background-color:	#ffe9b8 ; padding:5px" v-else>Gấp đôi</p>
            
          </template>
           <template #cellTemplate="cell">
             
            <p  v-if="cell.data.data.ID_DT == 0 && (cell.data.data.TYLE == 0 || cell.data.data.TYLE == 0) " style="border-radius:50%;width: 100% ; height:100% ; background-color:	#FF0000 ; padding:5px" >{{cell.data.rowIndex + 1 }}</p>
           
          </template>
        </DxTreeList>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import BoxSoPhieu from "../../../components/NLG/BoxSoPhieuInfo";
import {
  DxTreeList,
  DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel
} from "devextreme-vue/tree-list";
import { showNotifySuccess, showNotifyError } from "../../../ultils";
export default {
  components: {
    BoxSoPhieu,
    DxTreeList,
    DxColumn,
    DxColumnChooser,
    DxHeaderFilter,
    DxSearchPanel
  },
  data() {
    return {
      phieunhapkho: {},
      dataSource: [],
      thutu:0,
      f_kho: null,
      expandedRowKeys: [1, 2],
      selectedRowKeys: []
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    dataSourceF() {
      return this.dataSource.map(d => (d.ID_DT ? d : { ...d, ID_DT: 0 }));
    }
  },
  created() {
    console.log("ksjdfkjkd")
    this.load().then(() => {
      this.loadCP();
    });
    // this.onEditorPreparing(e);
  },
  methods: {
    onCellHoverChanged(e){
      console.log('onCellHoverChanged',e.cellElement.className)
      e.cellElement.className = 'row-Red';  
    },
    onRowClick(e){
      console.log('onRowClick',e)
      e.rowElement.className = 'dx-row dx-data-row dx-row-lines dx-column-lines row-Red'; 
      e.element.className = 'dx-widget dx-visibility-change-handler dx-treelist row-Red';
      for(let i = 0 ; i <e.cells.length ; i++){
      e.cells[i].cellElement.className = 'dx-treelist-cell-expandable row-Red';   
      }
    },
    onEditorPreparing(e){
        console.log('onEditorPreparing',e) 
    },
    async completed() {
      const payload = {
        delFlag: "N",
        tinhtien: "Y",
        hacap: "N",
        ALLOWMODIFY: "N",
        QC_STAFF: this.userInfo.account,
        id: this.phieunhapkho.id
      };
      const data = await this.$store.dispatch(
        "nlg/UPDATE_PHIEU_NHAP_KHO3",
        payload
      );
      if (data.meta.success) {
        showNotifySuccess();
       this.$router.push('/nlg-bb-nghiem-thu/'+this.phieunhapkho.sophieu.replace('/','-'))
      } else {
        showNotifyError();
      }
    },
    go(guid) {
      console.log(guid);
      this.$router.push({ name: "add-nghiem-thu", params: { id: guid } });
    },
    async load() {
      const guid = this.$route.query.plan.replace("-", "/");
      if (guid) {
        this.guid = guid;
        const data = await this.$store.dispatch("nlg/GET_DS_PHIEU_NHAP_KHO3", {
          guid: guid.replace("-", "/")
        });
        this.phieunhapkho = data.data[0];
      }
    },
    async loadCP() {
      const guid = this.$route.query.plan.replace("-", "/");
      if (guid) {
        this.guid = guid;
        const data = await this.$store.dispatch(
          "nlg/GET_BB_NGHIEM_THU",
          guid.replace("-", "/")
        );
        this.dataSource = data.data;
      }
    },
    print() {
      window.print();
    }
  }
};
</script>

<style lang="css">
.text:hover{
  color:blueviolet;
  
}
.row-Red{
  background-color: #ccc;
  border: 1px solid black !important;
}
.text-color{
  font-family: 'Times New Roman', Times, serif;
}
</style>
