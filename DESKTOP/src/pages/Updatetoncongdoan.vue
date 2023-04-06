<template>
  <q-page >
    <div>
      <div class="row" style="background-color: #daf8e1">
        <div class="col-6 text-blue text-bold" style="font-size: 18px">
          Cập nhật tồn từng công đoạn
        </div>
      </div>
    </div>
    <q-card>
     
        <div class="row">
          <label>
            <input
            
              style="width: 150px"
              type="file"
              id="file"
              ref="file"
              @change="onChange"
              class="custom-file-input"
            />
          </label>
            <q-btn
        
          class="col-1 q-ml-sm"
          style="height: 42px; margin-top: 8px; width: 150px"
          color="positive"
          outlined
          label="Gửi phê duyệt"
          @click="confirmphieu = true"
        />
    
        </div>
     
      <q-card-section>
        <DxDataGrid
          id="gridContainer"
          :data-source="dataSource"
          :show-row-lines="true"
          :show-column-lines="true"
          :show-borders="true"
          :word-wrap-enabled="true"
       
        >
        <DxGroupPanel
                :visible="true"
                :empty-panel-text="'Kéo một tiêu đề cột vào đây để nhóm theo cột đó'"
              />
          <DxSorting mode="none" />
          <!-- <DxScrolling mode="infinite" /> -->
          <DxExport :enabled="true" file-name="sản lượng" />
           <DxFilterRow :visible="true" />
            <DxHeaderFilter :visible="true" />
             <DxPager
        :visible="true"
        :allowed-page-sizes="pageSizes"
        :display-mode="displayMode"
        :show-page-size-selector="showPageSizeSelector"
        :show-info="true"
        :show-navigation-buttons="showNavButtons"
      />
             <DxSearchPanel
                :visible="true"
                :width="240"
                placeholder="Tìm kiếm..."
              />
            <!-- <DxColumn
            data-field="TT"
            caption="STT"
            :allowEditing="false"
            :width="60"
             sort-order="asc"
            :group-index="0"
            :visible="false"
            css-class="rowBG"
            
          /> -->
          <DxColumn
            data-field="stepId"
            caption="ID Công đoạn"
            :width="320"
            css-class="rowBG"
               sort-order="asc"
          
            
          />
          <DxColumn
            data-field="congdoan"
            caption="Ten công đoạn"
            :width="320"
            css-class="rowBG"
               sort-order="asc"
          />
          <DxColumn
            data-field="ITEM_ID"
            :width="120"
            caption="ID"
            alignment="center"
            css-class="rowBG"
          />
          <DxColumn
            data-field="name"
            :width="420"
            caption="Sản phẩm"
            alignment="left"
            css-class="rowBG"
          />

          <DxColumn
            data-field="QUANTITY"
            :width="120"
            caption="số lượng"
             :allowEditing="false"
            alignment="center"
            css-class="rowBG"
          />
           <DxColumn
            data-field="market_code"
            :width="120"
            caption="Màu"
             :allowEditing="false"
            alignment="center"
            css-class="rowBG"
          />
          
         
        </DxDataGrid>
          <q-dialog v-model="confirmphieu" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title text-positive">
              Xác nhận cập nhập tồn công đoạn
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Hủy" color="orange" v-close-popup />
          <q-btn
            label="Đồng ý"
            @click="nhaphesoquydoi"
            color="positive"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    
       
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxScrolling,
  DxSorting,
  DxEditing,
  DxButton,
  DxColumn,
  DxLoadPanel,
  DxExport,
  DxPager,
  DxSearchPanel,
  DxLookup,
  DxGroupPanel,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupItem,
  DxSummary,
} from "devextreme-vue/data-grid";
import { showNotifySuccess, showNotifyError } from "../ultils";
import { mapActions, mapGetters } from "vuex";
import XLSX from "xlsx";
import moment from "moment";
//import { insertHeSoQuyDoi } from '../store/vcn/actions';
export default {
  data() {
    return {
      dataSource: [],
      showVolumnColumn: true,
      year: moment().year(),
      month: moment().month() + 1,
      listWeek: [],
      chonCongDoans: [],
      dulieu: [],
      dataUSD:[],
      showNhaptigiaUSD:false,
      xoahs:true,
      confirmphieu: false,
      confirmphieuxoa: false,
      chonFactoryId: null,
      idDepartment: null,
      capnhat:true,
      
       displayMode: 'full',
      pageSizes: [10, 20, 'all'],
      showPageSizeSelector: true,
       showNavButtons: true,
    //   options: [
    //     {
    //       id: 100000,
    //       label: "NM CBG Thuận Hưng",
    //     },
    //     {
    //       id: 102339,
    //       label: "NM CBG YS1A",
    //     },
    //     {
    //       id: 102340,
    //       label: "NM CBG YS1B",
    //     },
    //     {
    //       id: 102366,
    //       label: "NM CBG TB",
    //     },
    //   ],
    };
  },
  components: {
    DxDataGrid,
    DxScrolling,
    DxSorting,
    DxColumn,
    DxExport,
    DxLookup,
    DxPager,
    DxEditing,
    DxButton,
    DxSearchPanel,
    DxLoadPanel,
    DxGroupPanel,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupItem,
    DxSummary,
  },
  created() {
  
    this.loadData();
  },
  methods: {
    ...mapActions("prod", [
      "getsanluongquidoi",
      "getTongCongByDepartment",
      "insertToncongdoan",
      "xoaHesoquidoi",
    ]),
     ...mapActions("messages", ["sendNotificationMail"]),
    changeDate() {
      this.loadData();
    },
    changeFactory() {
      this.loadData();
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
     async xoahesoquydoi(){
const dataxoa = await this.xoaHesoquidoi({
   nam:this.year,
 
});
if (dataxoa.meta.success) {
          showNotifySuccess();
         this.loadData();
        } else {
          showNotifyError();
        }
     },
    async nhaphesoquydoi(){
      let resultData = this.dataSource;
       function chunk_inefficient(arr, chunkSize) {
            var array = arr;
            return [].concat.apply(
              [],
              array.map(function (elem, i) {
                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
              })
            );
          }
           let dataSlice = chunk_inefficient(resultData, 100);
            dataSlice.forEach(async (item) => {
             
const data = await this.insertToncongdoan({
   nam:this.year,
   createdBy: this.userInfo.id,
    hesoquidoi: item,
});
              
if (data.meta.success) {
          showNotifySuccess();
        //  let baseUrl = null;
        // if (process.env.PROD) {
        //   baseUrl = `https://app.woodsland.com.vn:2002/#/bc-chenh-lech-ton`;
        // } else {
        //   baseUrl = `http://localhost:5000/#/bc-chenh-lech-ton`;
        // }

      
        //   let payloadMail = {
        //     baseUrl: baseUrl,
        //     email: "tuyetdtb@woodsland.com.vn",
        //     accountId: this.userInfo.id,
        //     toAccountId: 101687,
        //     subject: `Có tồn được cập nhật mới`,
        //     title: "Vào đây để đi tới phê duyệt",
        //     dataBody: `Mời bạn vào phê duyệt`,
        //   };

        // await this.sendNotificationMail(payloadMail);    
         this.loadData();
        } else {
          showNotifyError();
        }
            });
    },
    //     async loadTYGIA(){
    //       this.showNhaptigiaUSD = true
    //   const payload = {
   
    //     year: this.year,
    //   }
    //   const data = await this.$store.dispatch(
    //     "prod/GET_ALL_TY_GIA_USD",
    //     payload
    //   );
    //   this.dataUSD = data.data;
    // },
    //   async addTYGIA(){
    //     if (this.heSo) {
    //   const payload = {
    //     CREATED_BY: this.userInfo.id,
    //       TY_GIA_USD : this.heSo,
    //       year: this.year,
    //   }
    //   const data = await this.$store.dispatch(
    //     "prod/INSERT_TY_GIA_USD",
    //     payload
    //   );
    //   if(data.meta.success){
    //     showNotifySuccess();
    //     this.heSo = null;
    //     this.loadTYGIA();
    //   }else{
    //     showNotifyError();
    //   }
    //    }else{
    //     this.$q.dialog({
    //       title: "Lỗi",
    //       message: "Vui lòng nhập đầy đủ thông tin !",
    //     });
    //   }
    //   },
 async onChange(e) {
      e.stopPropagation();
      e.preventDefault();

      var files, i, f;
      this.file = this.$refs.file.files[0];

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

          results = XLSX.utils.sheet_to_json(worksheet, { raw: false });
    
    this.dataSource = results
    //    await results.forEach((e) => {
    //         let index = this.dataSource.push({
    //           account: e.account,
    //    });
            
    //       });
console.log('SL qui doi:',this.dataSource)
          // this.state.tickets = results;
          this.file = "";
        };
        reader.readAsArrayBuffer(f);
      }
    },
    // async loadData() {
    //   this.dataSource= [];
    //   this.dataSource = await this.getsanluongquidoi({
      
    //     nam: this.year,
     
    //   });
    //   console.log('dai:',this.dataSource.length)
    //   if (this.dataSource.length>0) {this.capnhat = false; this.xoahs = true }
    //   else { this.capnhat = true;this.xoahs = false} 
    // },
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
};
</script>
<style >
.custom-file-input::-webkit-file-upload-button {
  visibility: hidden;
}
.custom-file-input::before {
  content: "Import từ Excel";
  display: inline-block;
  background: linear-gradient(top, #f9f9f9, #e3e3e3);
  border: 0px solid #999;
  border-radius: 3px;
  padding: 7px 8px;
  -webkit-user-select: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14pt;
  margin-top: 8px;
  background-color:#FFC107;
 color:white
}
.custom-file-input:hover::before {
  border-color: black;
}
.custom-file-input:active::before {
  background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
}
.dx-datagrid-headers .Quydoi {
  color: white;
  background-color: #607d8b;
}
</style>
