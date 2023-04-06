<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                      BIÊN BẢN TRẢ NHẬP LẠI
                  </div>
                  <div class="row print-hide justify-end" >
            
              <div class="row print-hide" align="right">
                    <q-btn color="primary" icon="print"  @click="print" />
                  </div>
                  </div>
              </div>
          </q-card-section>
          <q-card-section>
             
  <table class="tableprint" cellspacing="0" style="border-collapse:collapse; width:100%" >
    <tbody>
        <tr>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; height:21px; vertical-align:bottom; white-space:nowrap">
            <b>Đơn vị nhận hàng :</b>&nbsp; {{phieunhapkho.NAME_NCC}}
            </td>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; height:21px; vertical-align:bottom; white-space:nowrap">
            Số phiếu : {{phieunhapkho.SOPHIEU}}
            </td>
        </tr>
        <tr>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
            <b>Địa chỉ : </b>{{phieunhapkho.NCC_ADDRESS}}
            </td>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
            Biển số xe: {{phieunhapkho.BIENSOXE}}</td>
        </tr>
        <tr>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
            <b>Kho nhập : </b>{{phieunhapkho.MAKHO}}</td>
        <td style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap">
            Ngày Nhập : {{phieunhapkho.CREATED_AT}}</td>
        </tr>
        
    </tbody>
    </table>

          </q-card-section>
          <q-separator spaced    />
         
          <q-card-section width = "100%">
            
            <DxDataGrid
                :data-source="dataSource"
                :show-borders="true"
                :no-data-text="'Không có dữ liệu !'"
                :show-column-lines="true"
                :allow-column-resizing="true"
                
                :selection="{ mode: 'single' }"
                @selection-changed="onSelectionChanged"
               
            >
            <!-- <DxExport
            :enabled="true"
            :allow-export-selected-data="false"
            :file-name="'Chi tiết phiếu nhập kho  '+ phieunhapkho.sophieu"
            /> -->
            <!-- <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/> -->
            <DxColumn
                caption="STT"
                data-field="ID"
               
                alignment="center"
                width="50"
                cell-template="cellTemplate"
              />
             
            <DxColumn
                caption="Qui Cách"
                alignment="center"
            >
              <DxColumn
                caption="Dầy"
                data-field="DAY"
                format="fixedPoint"
                alignment="center"
                width="50"
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
                width="50"
              />
            </DxColumn>
             <DxColumn
                data-field="SOBO"
                caption="Số bó"
                alignment="center"
                width="60"
            />
            <DxColumn
                data-field="SOTHANHBO"
                caption="Số thanh/bó"
                alignment="center"
                width="90"
            />
            <DxColumn
                data-field="Tổng số thanh"
                caption="Tổng số thanh"
                data-type="number"
                format="fixedpoint"
                alignment="center"
                width="120"
                :calculate-cell-value="calculateTongThanh"
            />
             <DxColumn
                data-field="KHOILUONG"
                caption="Khối lượng(m³)"
                format="##0.####"
                alignment="center"
                width="120"
                :calculate-cell-value="calculateKL"
            />
             <!-- <DxColumn
                caption="Kế hoạch"
                data-field="OVER_PLAN"
                cell-template="cellTemplateOverPlan"
                alignment="center"
              /> -->
            <DxColumn
                data-field="SOPHIEUNHAP"
                caption="Ghi chú"
                width="150"
            />
            <DxSummary>
             <DxTotalItem
                column="id"
                summary-type="count"
                value-format="fixedpoint"
                display-format="Tổng cộng : "
                show-in-column="SOPHIEU"
              />
              <DxTotalItem
                column="Tổng số thanh"
                summary-type="sum"
                value-format="fixedpoint"
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
              <p>{{cell.data.rowIndex+1}}</p>
            </template> 
             <template #cellTemplateOverPlan="cell">
              <span style="font-weight:700;color:red" v-if="cell.data.value===1">Ngoài kế hoạch</span>
              <span v-else></span>
            </template> 
            
            </DxDataGrid>
          </q-card-section>
           <table class="tableprint" cellspacing="0" style="border-collapse:collapse; width:100%" >
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
                                                        <div class="row mt5">
                                                            <br><br>
                                                        </div>
                                                        <div class="row mt-5">
                                                            <div class="col-4  text-center">
                                                                <h3></h3>
                                                            </div>
                                                            <div class="col-4  text-center">
                                                                <h3><span id="daiDienXSX_Ky"></span></h3>
                                                            </div>
                                                            <div class="col-4  text-center">
                                                                <h3><span id="nguoilapbb"></span></h3>
                                                            </div>
                                                        </div>
             </tbody>
           </table>
      </q-card>
      <!-- <q-page-sticky class="print-hide" position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" @click="goAdd(phieunhapkho.sophieu)" color="primary" />
      </q-page-sticky> -->
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
  DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem
} from 'devextreme-vue/data-grid';
import FormNhapKho from '../../../components/NLG/FormNhapKho'
import BoxSoPhieu from '../../../components/NLG/BoxSoPhieuInfo'
export default {
    components:{
       DxDataGrid,
      DxColumn,
      DxGrouping,
      DxGroupPanel,
      DxPager,
      DxPaging,
      DxSearchPanel,
      DxExport,DxHeaderFilter,DxSummary,DxGroupItem,
      DxTotalItem,
      FormNhapKho,
      BoxSoPhieu
    },
    data(){
        return {
            dataSource:[],
            phieunhapkho:{},
            guid:"",
            idSelect:null,
            showEdit:false,
            showForm:true
        }
    },
    created(){
      this.load()
     // this.loadDetail()
    },
    methods:{
        print(){
          window.print()
        },
        // async goEdit(){
        //   this.$router.push({name:'edit-detail-nlg',params:{id:this.idSelect}})
        // },
    //     goAdd(guid){

    //  // const guid = this.phieunhapkho.sophieu.replace('/','-')
    //  // console.log(guid)
    //                 // showNotifySuccess('Tạo phiếu thành công số phiếu :'+phieunhap.NUM+'/'+phieunhap.MONTH)
    //                  //this.$router.push('/nlg-nhap-kho1')
    //                 this.$router.push('/nlg-add-detail/'+guid.replace('/','-'))
    //     },
        onSelectionChanged({ selectedRowsData }){
          this.idSelect = selectedRowsData[0].id
          this.showEdit = true
        },
        async load(){
            const guid = this.$route.query.guid
          
            if (guid) {
              this.guid = guid
                const data1 = await this.$store.dispatch('nlg/GET_DS_PHIEU_NHAPLAI',{
                  guid:guid
                  })
                this.phieunhapkho =data1.data[0];
                this.dataSource = data1.data;
              
            }
        },
        async loadDetail(){
          const guid = this.$route.query.guid
            if (guid) {
              this.guid = guid
                const data = await this.$store.dispatch('nlg/GET_DS_NHA_CUNG_CAP1',{guid:guid})
                if(data.data)
                this.dataSource =data.data
               // console.log(guid)
            }
        
        },
        calculateTongThanh(rowData){
          return rowData.SOBO*rowData.SOTHANHBO
        },
        // calculateKL(rowData){
        //   return (rowData.sobo*rowData.sothanh_bo*rowData.DAY*rowData.RONG*rowData.CAO)/1000000000
        // },
        sumTongThanhGrid(data) {
          console.log(data)
          return `First: `;
        }
    }
}
</script>

<style>

</style>