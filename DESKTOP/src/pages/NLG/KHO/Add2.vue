<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-10 top-title">
            Nhập kho
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="widget-container">
          <SelectBoxHinhThuc
            :defaultValue="ht"
            :dataSource="hinhthucnhap"
            :title="'Hình thức nhập'"
            :onChange="eventChonHinhThuc"
          />
          <SelectBoxQuiCach
            :dataSource="quicachs"
            :title="'Chọn qui cách :'"
            :displayColumn="'code'"
            :searchColumn="'code'"
            :onChange="eventChonQuiCach"
          />

          <div class="dx-field">
            <div class="dx-field-label">Số bó</div>
            <div class="dx-field-value">
              <DxNumberBox :value="sobo" @value-changed="changeSoBo" />
            </div>
          </div>
          <div class="dx-field">
            <div class="dx-field-label">Số thanh/bó</div>
            <div class="dx-field-value">
              <DxNumberBox
                :value="sothanhbo"
                @value-changed="changeSoThanhBo"
              />
            </div>
          </div>
          <!-- <div class="dx-field">
                    <div class="dx-field-label">Để lại</div>
                    <div class="dx-field-value">
                    <DxNumberBox :value="delai" @value-changed="eventChangeDelai"/>
                    </div>
                </div> -->
          <div class="dx-field">
            <div class="dx-field-label">Ghi chú</div>
            <div class="dx-field-value">
              <DxTextBox @value-changed="changeNote" />
            </div>
          </div>
        </div>
        <div class="dx-field">
         <div class="dx-field-label"> </div>
          <div class="dx-field-value">
            <q-checkbox
          
              v-model="selection"
              label="Xếp Pallet"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          outline
          color="primary"
          @click="showConfirm = true"
          icon="save_alt"
          label="Lưu lại"
        />
      </q-card-actions>
    </q-card>

    <!-- <q-dialog 
    v-if="TONGSOTHANHCONLAI < (sobo*sothanhbo)" 
    v-model="showConfirm" 
    persistent>
      <q-card style="min-width:400px">
        <q-card-section class="row items-center">
          <div class="row top-title" style="color:red">số lượng vượt quá 105% Bạn có muốn nhập ?</div>
        </q-card-section>
        <q-card-section>
          <p>Qui cách : {{ this.quicachName }}</p>
          <p>Số bó: {{ this.sobo }}</p>
          <p>Số thanh / bó: {{ this.sothanhbo }}</p>
          <p>Ghi chú : {{ this.note }}</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Tiếp tục nhập kho"
            @click="save"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
      <q-dialog v-model="showConfirm" 
   persistent>
      <q-card style="min-width:400px">
        <q-card-section class="row items-center">
          <div class="row top-title">nhập kho </div>
        </q-card-section>
        <q-card-section>
          <p>Qui cách : {{ this.quicachName }}</p>
          <p>Số bó: {{ this.sobo }}</p>
          <p>Số thanh / bó: {{ this.sothanhbo }}</p>
          <p>Ghi chú : {{ this.note }}</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng Ý"
            @click="save"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  <div>
      <div class="dx-field-value">
              <DxNumberBox :value="TONGSOTHANHCONLAINCC" @value-changed="changeSoBo1" />
            </div>
            <div>
    <q-btn
                outline
                color="primary"
                icon="edit"
              
                label="Số lượng thanh có thể nhập"
             
              />
            </div>
  </div>
    <q-card-section>
      <q-separator spaced />

      <DxDataGrid
        :data-source="dataSource"
        :show-borders="true"
        :no-data-text="'Không có dữ liệu !'"
        :show-column-lines="true"
        :allow-column-resizing="true"
        @row-removed="del"
       @row-updated="update"
        :selection="{ mode: 'multiple' }"
          @selection-changed="onSelectionChanged"
        @editorPreparing="onEditorPreparing"
      >
        <DxEditing 
        :allow-updating="true"
        :allow-deleting="true" mode="popup" />
        <DxExport
          :enabled="false"
          :allow-export-selected-data="false"
          :file-name="'Chi tiết phiếu nhập kho  '"
        />
        <!-- <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/> -->
        <DxColumn
          caption="STT"
          data-field="id"
          format="fixedPoint"
          alignment="center"
          width="80"
          cell-template="cellTemplate"
          :allowEditing="false"
        />
        <DxColumn
          caption="Số Phiếu Nhập"
          data-field="SOPHIEUNHAP"
          alignment="center"
          width="120"
          :allowEditing="false"
        />
        <DxColumn caption="Qui Cách" alignment="center">
          <DxColumn
            caption="Dầy"
            data-field="DAY"
            format="fixedPoint"
            alignment="center"
            width="80"
            :allowEditing="false"
          />
          <DxColumn
            caption="Rộng"
            data-field="RONG"
            format="fixedPoint"
            alignment="center"
            width="80"
            :allowEditing="false"
          />
          <DxColumn
            caption="Dài"
            data-field="CAO"
            format="fixedPoint"
            alignment="center"
            width="80"
            :allowEditing="false"
          />
        </DxColumn>
        <DxColumn
          data-field="sobo"
          caption="Số bó"
          alignment="center"
          width="100"
        />
        <DxColumn
          data-field="sothanh_bo"
          caption="Số thanh/bó"
          alignment="center"
          width="100"
        />
        <DxColumn
          data-field="KHOILUONG"
          caption="Khối lượng(m³)"
          format="##0.####"
          alignment="center"
          width="120"
          :allowEditing="false"
          :calculate-cell-value="calculateKL"
        />

        <DxColumn data-field="NOTE" caption="Ghi chú" width="100" />
        <DxSummary>
          <DxTotalItem
            column="id"
            summary-type="count"
            value-format="fixedpoint"
            display-format="Tổng cộng : "
            show-in-column="SOBO"
          />
          <DxTotalItem
            column="Tổng số thanh"
            summary-type="sum"
            value-format="fixedpoint"
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
import { DxNumberBox, DxCheckBox, DxTextBox } from "devextreme-vue";
import SelectBoxQuiCach from "../../../components/commons/SelectBox";
import SelectBoxHinhThuc from "../../../components/commons/SelectBox";
import { showNotifySuccess, showNotifyError } from "../../../ultils";
import moment from 'moment';
export default {
  components: {
    SelectBoxQuiCach,
    DxNumberBox,
    SelectBoxHinhThuc,
    DxCheckBox,
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
    DxTextBox
  },
  data() {
    return {
      quicachs: [],
      khoiluongthang: [],
      nccthang: [],
      kltungkho: 0,
      mau:0,
      selection:false,
      VUOTNCC:false,
      vuotkho:0,
      klkhothang: 0,
      klnccthang: [],
      sobo: 0,
      sobo1:0,
      sothanhbo: 0,
      DAY: 0,
      thang:0,
      nam:0,
      RONG: 0,
      makho: "",
      mancc: "",
      MALOGONHAP:"",
      manvl: "",
      today:"",
      kho: "",
      over_lan:0,
      Tongklncc: 0,
      TONGSOTHANHCONLAI: 0, //vượt 105%
       TONGSOTHANHCONLAI1: 0, //vượt 120%
       TONGSOTHANHCONLAINCC:0,//vượt kho
      Tongklthang: 0,
      tongkhoiluongQC:0,
      khoiluong: 0,
      tongthanh: 0,
      nhom: "",
      ht: "0",
      hinhthucnhap: [
        {
          id: "0",
          name: "Bình thường"
        },
        { id: "H", name: "Nhập Hạ Cấp" },
        { id: "C", name: "Nhập Loại C" },
        { id: "L", name: "Nhập hàng loại" }
      ],
      delai: false,
      note: "",
      fixkho:null,
      khackho: true,
      quicach: 0,
      showConfirm: false,
      dataSource: [],
      phieunhapkho: {},
      guid: "",
      idSelect: null,
      showEdit: false,
      showForm: true,
      quicachName: "" 
    };
  },
  created() {
      this.loadDetail();
    this.loadngaythang().then(() => {
  
   
    this.loadkhoiluong();
      this.loadkhoiluongnhapthang();
       this.loadKL();
       this.tongklQC();
    });
  },
  methods: {
    async save() {
     // this.vuotkho = 0
      let TH_THANH_KHO = 0;
      this.mau = 0
      
      this.over_lan = 0
      this.TONGSOTHANHCONLAI = 0
      this.TONGSOTHANHCONLAI1 = 0
      console.log('KL QC',this.tongkhoiluongQC)
     if (this.fixkho == 1) {
      TH_THANH_KHO = parseInt(
        ((this.kltungkho - this.klkhothang) * 1000000000) /
          (this.DAY * this.RONG * this.DAI)
      );
     }
     else {
           TH_THANH_KHO = parseInt(
        ((this.tongkhoiluongQC - this.klkhothang) * 1000000000) /
          (this.DAY * this.RONG * this.DAI)
      );
     }
     if (this.mancc.trim()== 'TH') {
        this.TONGSOTHANHCONLAI = parseInt(
        ((this.Tongklncc*1.1 - this.Tongklthang) * 1000000000) /
          (this.DAY * this.RONG * this.DAI)
      );
     } else {
      this.TONGSOTHANHCONLAI = parseInt(
        ((this.Tongklncc*1.05 - this.Tongklthang) * 1000000000) /
          (this.DAY * this.RONG * this.DAI)
      );
     }
       this.TONGSOTHANHCONLAI1 = parseInt(
        ((this.Tongklncc*1.2 - this.Tongklthang) * 1000000000) /
          (this.DAY * this.RONG * this.DAI)
      );
      this.tongthanh = parseFloat(parseFloat(this.sobo) * this.sothanhbo);
      // this.Tongklthang += (this.DAY*this.RONG*this.DAI*this.sobo*this.sothanhbo)/1000000000

      console.log('KL NCC',this.Tongklncc);
      console.log('KL NCC',this.Tongklthang);
       console.log('KL NCC',this.TONGSOTHANHCONLAI1);
       console.log('KL NCC',this.tongthanh);
       this.loadkhoiluongnhapthang();
      // if (TH_THANH_KHO < this.tongthanh) {

      
      //   this.$q.dialog({
      //     html: true,
      //     title: "Nhập kế hoạch",
      //     message:
      //       "Bạn đã nhập quá <br> khối lượng kế hoạch: " + 
      //       // this.tongkhoiluongQC +
      //       //this.kltungkho +
      //       "<br> Tổng thanh có thể nhập:" +
      //       TH_THANH_KHO
      //   });
      // } 
      // else {
        
         console.log('khác kho:',this.khackho )
        
        if (this.TONGSOTHANHCONLAI < this.tongthanh) {
          this.over_lan = 1
          // this.$q
          //   .dialog({
          //     html: true,
          //     title: "Nhập kế hoạch",
          //     message:
          //       "Bạn đã nhập quá 105% KH tổng<br> khối lượng kế hoạch: " +
          //       this.Tongklncc +
          //       "<br> Tổng thanh có thể nhập:" +
          //       this.TONGSOTHANHCONLAI
          //   })
          //   .onOk(() => {
          //     // console.log('OK')
          //   })
          //   .onCancel(() => {
          //     // console.log('Cancel')
          //   })
          //   .onDismiss(() => {
          //     // console.log('I am triggered on both OK and Cancel')
          //   });
        } 
         if (this.TONGSOTHANHCONLAI1 < this.tongthanh){
           
          //  if(this.VUOTNCC == false){
          //    return this.$q.dialog({
          //     title: "Lỗi",
          //     message: "Giao vượt quá 120% kế hoạch!",
          //   });
          //  } else 
           this.over_lan = 2
         } 
         if (this.Tongklncc == 0) {
            this.over_lan = 1
         }
         if (this.kltungkho &&  parseInt(
        ((this.kltungkho - this.klkhothang) * 1000000000) /
          (this.DAY * this.RONG * this.DAI)) < this.tongthanh)
          {
            if (this.makho.trim() =='TH_TB_YS1' || this.makho.trim() =='TH_TB' || this.makho.trim() =='TH_YS1'
            || this.makho.trim() =='TB_YS1'){
                         this.vuotkho = 1
            } else 
           this.vuotkho = 1

          }
         if(this.khackho == true ){
                 showNotifyError("QC này không thuộc kho đề nghị liên hệ phòng NLG!");
        } else {
       
          if (this.sobo > 0 && this.sothanhbo > 0) {
            const payload = {
              sophieunhap: this.$route.params.guid.replace("-", "/"),
              CODE: this.quicachName,
              DAY: this.DAY,
              RONG: this.RONG,
              CAO: this.DAI,
              sobo: this.sobo,
              sothanh_bo: this.sothanhbo,
              CODENHOM: this.nhom,
              khacKho: this.khackho,
              delai: this.delai ? "Y" : "N",
              note: this.note,
              delFlag: "N",
              MANVL: this.manvl,
              qc_inspector: "N",
               createBy:this.$store.state.base.userInfo.account,
              SAMPLEQTY: 2,
              OVER_PLAN:this.over_lan,
              longit: this.mau,
              MALOGONHAP:this.MALOGONHAP,
              vuotkho:this.vuotkho,
              QTY: 0,
              PALLET: this.selection
              //notehc:this.ht
            };
            // console.log(data.data[0].RESULT)
            const data = await this.$store.dispatch("nlg/NHAP_KHO", payload);
            this.sobo = 0;
            this.sothanhbo = 0;
            this.selection = false
            this.loadDetail();
            //  this.loadkhoiluong()

            // console.log(this.Tongklncc)

            if (data.data[0].RESULT) {
              showNotifySuccess();
              this.$router.go(-1);
            } else {
              showNotifyError(data.data[0].MESSAGE);
            }
          } else {
            showNotifyError("Vui lòng nhập đầy đủ thông tin !");
          }
       // }
          
   }
    },
    async loadngaythang() {
let guid = this.$route.params.guid.replace("-", "/");
 const data5 = await this.$store.dispatch("nlg/GET_NGAY_THANG", {
          guid: guid
        });
            console.log('ngay nhap:',data5.data[0].ngaynhap)
            this.today = data5.data[0].ngaynhap
            this.thang = moment(this.today).format('M')
        this.nam = moment(this.today).format('YYYY')
    },
    async loadDetail() {
      const guid = this.$route.params.guid.replace("-", "/");
      //console.log(guid)
      if (guid) {
        this.guid = guid;
        const data = await this.$store.dispatch("nlg/GET_DS_NHA_CUNG_CAP1", {
          guid: guid
        });
        if (data.data) this.dataSource = data.data;

      }
    },
    async loadkhoiluong() {
      const guid = this.$route.params.guid.replace("-", "/");
      // console.log(guid)
      if (guid) {
        this.guid = guid;
        const data2 = await this.$store.dispatch("nlg/GET_NCC_THANG", {
          guid: guid,
          thang: this.thang, nam: this.nam
        });
        if (data2.data) {
          this.quicachs = data2.data;
        }
        console.log('ngày nhập',data2.data[0].ngaynhapkho)
       // this.today = data2.data[0].ngaynhapkho
      
        this.MALOGONHAP = data2.data[0].MALOGONHAP
        this.mancc = data2.data[0].MANCC;
        this.kho = data2.data[0].MAKHO.toString().trim();
      }
    },
    async loadKL() {
      const guid = this.$route.params.guid.replace("-", "/");
      // console.log(guid)
      if (guid) {
        this.guid = guid;
        const data1 = await this.$store.dispatch("nlg/GET_NCC_THANG1", {
          guid: guid,
          kho: this.nhom, thang: this.thang, nam: this.nam
        });
        if (data1.data) this.nccthang = data1.data;
        for (let i = 0; i < this.nccthang.length; i++) {
          this.Tongklncc += data1.data[i].PLANQTY ;
        }
      }
      
    },
    onSelectionChanged({ selectedRowsData }) {
      this.idSelect = selectedRowsData[0].id;
      this.showEdit = true;
    },
    async loadklkho() {
      const data2 = await this.$store.dispatch("nlg/GET_TONG_DINH_MUC_KHO", {
        makho: this.kho,
        nhom: this.nhom, thang: this.thang, nam: this.nam
      });
         this.fixkho = data2.data[0].fixkho
      this.kltungkho = data2.data[0].KLTUNGKHO*1.05;
    },
    async tongklQC(){
                 const data2 = await this.$store.dispatch("nlg/GET_TONG_DINH_MUC_KHOQC2", {
        
        nhom: this.nhom
      });
      this.tongkhoiluongQC = data2.data[0].KLTUNGKHO* 1.05
    },
    async loadkhoiluongnhapthang() {
      const guid = this.mancc.trim();
      //console.log(guid1)
      const data = await this.$store.dispatch("nlg/GET_NHAP_THANG", {
        guid: guid,
        nhom: this.nhom, thang: this.thang, nam: this.nam
      });
      this.klnccthang = data.data;
      this.Tongklthang = data.data[0].KLT;
      const data2 = await this.$store.dispatch("nlg/GET_NHAP_THANG_VUOT", {
        guid: guid,
        nhom: this.nhom, thang: this.thang, nam: this.nam
      });
      console.log('vuot:',data2.data.length)
              if(data2.data.length>0) this.VUOTNCC =  true
    },
    async loadKLkhothang() {
      const data = await this.$store.dispatch("nlg/GET_NHAP_THANG1", {
        makho: this.kho,
        nhom: this.nhom, thang: this.thang, nam: this.nam
      });
      this.klkhothang = data.data[0].KLT;
    },
    async eventChonQuiCach(e) {
      this.TONGSOTHANHCONLAI = 0
      this.TONGSOTHANHCONLAI1=0
      this.TONGSOTHANHCONLAINCC = 0
      this.khackho = true
      this.vuotkho = 0
      console.log('OK:',this.kho)
      if (this.kho.trim() != this.quicachs.find(q => {
              return q.id === e.value;
            }).KHO.trim() && this.quicachs.find(q => {
              return q.id === e.value;
            }).chankhackho == 1) {
               this.quicachs.find(q => {
              return q.id === e.value;
            }).code = ''
            return    this.$q.dialog({
              title: "Lỗi",
              message: "không được nhập khác kho!",
            });
             
            }

      this.$q
        .dialog({
          title: "Alert",
          message:
            "Quy cách thuôc kho: " +
            this.quicachs.find(q => {
              return q.id === e.value;
            }).KHO
        })
        .onOk(() => {
          // console.log('OK')
        });
      if (
        this.quicachs.find(q => {
          return q.id === e.value;
        }).dacbiet == "D"
      ) {
        this.manvl =
          this.quicachs.find(q => {
            return q.id === e.value;
          }).code + "l2";
      } else {
        if (
          this.quicachs.find(q => {
            return q.id === e.value;
          }).dacbiet == "H"
        ) {
          this.manvl =
            this.quicachs.find(q => {
              return q.id === e.value;
            }).code + "l1";
        } else {
          this.manvl = this.quicachs.find(q => {
            return q.id === e.value;
          }).code;
        }
      }
  
      this.Tongklncc = 0;
      this.Tongklthang = 0;
     
    //  this.VUOTNCC = this.quicachs.find(q => {
    //     return q.id === e.value;
    //   }).VUOTNCC;
       
      this.quicach = e.value;
      this.quicachName = this.quicachs.find(q => {
        return q.id === e.value;
      }).code;
      this.DAY = this.quicachs.find(q => {
        return q.id === e.value;
      }).DAY;
      this.RONG = this.quicachs.find(q => {
        return q.id === e.value;
      }).RONG;
      this.DAI = this.quicachs.find(q => {
        return q.id === e.value;
      }).DAI;
      this.nhom = this.quicachs.find(q => {
        return q.id === e.value;
      }).nhom;
      this.makho = this.quicachs
        .find(q => {
          return q.id === e.value;
        })
        .KHO.trim();
      this.loadkhoiluongnhapthang();
    await this.loadKL();
      this.loadKLkhothang();
    //  if (this.makho.trim() == 'TH' && (this.kho == 'YS1'||this.kho == 'TB') )
    //     this.vuotkho = 2
      const data3 = await this.$store.dispatch("nlg/GET_NCC_THANG2", {
        guid: this.makho
      });
      for (let j = 0; j < data3.data.length; j++) {
        if (this.kho == data3.data[j].MAKHO.toString().trim()) {
          this.khackho = false;
        } 
     
      }
      this.loadklkho();
       this.tongklQC();
      // this.loadklkho()
      this.TONGSOTHANHCONLAINCC = parseInt(
        ((this.Tongklncc - this.Tongklthang) * 1000000000) /
          (this.DAY * this.RONG * this.DAI));
       this.TONGSOTHANHCONLAI = parseInt(
        ((this.Tongklncc*1.05 - this.Tongklthang) * 1000000000) /
          (this.DAY * this.RONG * this.DAI)
      );
      console.log('KL con lai:',this.TONGSOTHANHCONLAI)
    },
    async del(e) {
       console.log('ID:',e.data.id)
      const payload = {
        id: e.data.id,

        delFlag: "Y"
      };
      const data3 = await this.$store.dispatch("nlg/EDIT_NHAP_KHO", payload);
      if (data.meta.success) {
        showNotifySuccess();
      } else {
        showNotifyError();
      }
    },
     async update(e){
            
            const data = await this.$store.dispatch('nlg/EDIT_NHAP_KHO',e.data)
        
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
        },
    changeSoBo(e) {
      this.sobo = e.value;
    },
      changeSoBo1(e) {
      this.sobo1 = e.value;
     
    },
    them(){
      this.sobo = this.sobo + this.sobo1;
      this.sobo1 = 0
    },
    changeSoThanhBo(e) {
      this.sothanhbo = e.value;
    },
    eventChonHinhThuc(e) {
      this.ht = e.value;
    },
    eventChangeDelai(e) {
      this.delai = e.value;
    },
    changeNote(e) {
      this.note = e.value;
    },
    calculateTongThanh(rowData) {
      return rowData.sobo * rowData.sothanh_bo;
    },
    calculateKL(rowData) {
      return (
        (rowData.sobo *
          rowData.sothanh_bo *
          rowData.DAY *
          rowData.RONG *
          rowData.CAO) /
        1000000000
      );
    },
    sumTongThanhGrid(data) {
      //  console.log(data)
      return `First: `;
    }
  }
};
</script>

<style></style>
