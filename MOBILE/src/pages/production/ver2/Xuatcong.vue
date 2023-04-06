<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto">Xuất công </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select v-model="congdoan" @input="chonCongdoan" :options="congdoans" label="Tổ" />
    
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
          clearable
          @input="chonItem"
          use-input
          input-debounce="0"
          @filter="searchItem"
          style="font-family:'Time New Roman';font-size:16px"
          v-model="item"
          behavior="dialog"
          :options="items"
          label="Sản phẩm/Chi tiết"
        />
      </div>
    </div>
    <!-- <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
          clearable
          style="font-family:'Time New Roman';font-size:16px"
          v-model="market"
          :options="markets"
          label="Màu"
        />
      </div>
    </div> -->
   

    <div class="row" v-if="congdoan!==null && item!==null">
      <div class="col-12 q-pa-sm">
        <q-select
         
          filled
          @input="showConfirmDialog"
          style="font-family:'Time New Roman';font-size:16px"
          v-model="nguonPhoi"
          :options="nguonPhois"
          label="Nguồn phôi"
          
        />
      </div>
    </div>
     <div class="row" v-if="card">
      <div class="col-6 q-pa-sm">
        <q-input v-model="quantity" type="text" label="Số lượng" />
      </div>
      <div class="col-6 q-pa-sm">
        <q-input readonly v-model="unit" type="text" label="Đơn vị " />
      </div>
    
    </div>
       <div class="col-6 q-pa-sm" v-if="card">
        <q-input readonly v-model="tonkho" type="text" label="tồn kho" />
      </div>
        <!-- <div class="col-6 q-pa-sm" v-if="card">
        <q-input readonly v-model="thuchien" type="text" label="Khối lượng còn thực hiện" />
      </div> -->
    <div class="row">
      <div class="col-12">
        <q-btn color="primary" class="full-width" label="Xuất công" @click="onClick" />
      </div>
    </div>
     <!-- <q-dialog v-model="card" persistent>
      <q-card style="min-width:400px">
        <q-card-section class="row items-center">
          <div class="row top-title">Bạn đã chắc chắn ?</div>
        </q-card-section>
        <q-card-section>
          <p>Khối lượng tồn kho: {{tonkho}} </p>
        <p>Khối lượng còn thực hiện: {{po.conThucHien}} </p>
        </q-card-section>
         <div class="row">
      <div class="col-6 q-pa-sm">
        <q-input v-model="quantity" type="text" label="Số lượng" />
      </div>
      <div class="col-6 q-pa-sm">
        <q-input readonly v-model="unit" type="text" label="Đơn vị " />
      </div>
    </div>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Xuất tồn"
            @click="onClick"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  </q-page>
  
</template>

<script>
import { showNotifySuccess } from "../../../utils/utils";
//import { showLoadingIos, closeLoading,generateUUID, formatDateISO } from '../../../utils/utils'
import { mapGetters, mapActions } from "vuex";
export default {
  //20q1070
  data() {
    return {
      congdoan: null,
      congdoans: [],
      item: null,
      items: [],
      num:[],
      po:[],
      GUID:"",
      card:true,
      code:[],
      tonkho:0,
      thuchien:0,
      unit: "",
      quantity: "",
      itemDupplicate: [],
      market: null,
      markets: [
        { label: "Màu Cafe", value: "CAFE" },
        { label: "Màu Xám", value: "XAM" },
        { label: "Màu Đen", value: "DEN" },
        { label: "Màu Trắng", value: "TRANG" },
      ],
       showConfirm: false,
      nguonPhoi: null,
      nguonPhois: [
        { label: "NM CBG Thuận Hưng", value: "NM CBG Thuận Hưng" },
        { label: "Yên Sơn 1a", value: "Yên Sơn 1a" },
        { label: "Yên Sơn 1b", value: "Yên Sơn 1b" },
        { label: "Thái Bình", value: "Thái Bình" },
     
      ],
      allMarket: [],
    };
  },
    computed:{
       
        ...mapGetters("base",["userInfo"])
    },
  created() {
    this.$store.getters["base/mySources"].forEach((s) => {
      this.congdoans.push({
        value: s.id,
        label: s.name,
      });
    });
    this.loadItem();
   
   
    this.getMarket();
  },

  methods: {
      ...mapActions("po", [
      "getAllLsx",
      "getPosByNumberAndStep",
      "getAllNguonPhoi",
      "resetPos",
      "themTonKeHoach2"
    ]),
      ...mapActions("production", [
      "getAllKeHoachSanXuatConLais",
      "getPoByCode",
      "addPackage",
      "getDinhMucs",
      "getTyLeTHs",
      "getlenhsx"
    ]),
    async showConfirmDialog() {
         console.log('ton kho:')
      this.thuchien = 0
    //   if (this.congdoan.value && this.item.value && this.nguonPhoi ){
      const payload = {
        Nameid: this.item.label
    
      };
      const data = await this.$store.dispatch(
        "production/KL_TON_CONG",
        payload
      );
     

      console.log('ton kho:',data.data)
      if (data.data.length >0) {
     this.tonkho = data.data[0].KL
    
     }
    //   else {
    //    this.$q.dialog({
    //       title: "Lỗi",
    //       message: "không có khối lượng tồn kho!"
    //       });
    //   }
      let departentId = this.congdoan.value
      let itemId =  this.item.value
     
    //        const   data1 = await this.getAllLsx({departentId,itemId});
    //  this.num = data1.data
    //  for (let i = 0; i < this.num.length; i++){
    // let code1 = this.num[i].code;
    //  this.po = await this.getPoByCode({ code1 });
    //  this.thuchien += this.po.conThucHien
   
    //       } 
    //       if (this.thuchien < 0) this.thuchien = 0
    //           if (this.po && data.data.length >0) this.card = true;
    //      this.$q.loading.hide();
    //      }else
    //    this.$q.dialog({
    //       title: "Lỗi",
    //       message: "Nhập đầy đủ thông tin!"
    //       });
    },
    
    async loadItem() {
      const data = await this.$store.dispatch("production/SP_VANITY", {
        factoryId: 100000,
      });
this.items = data
    //   data.data.forEach((d) => {
      
    //     this.items.push({
    //       label: d.cp,
    //       value: d.cp,
    //       unit: "bộ",
    //     });
    //   });
    console.log('QC:',data)
      this.itemDupplicate = this.items;
    },
    async getMarket() {
      // const data = await this.$store.dispatch('production/GET_MARKET')
      // data.data.forEach(element => {
      //   this.allMarket.push(
      //      {label:element.name, value:element.code,prodId:element.productId}
      //   )
      // });
    },
    //  filterFn(val, update) {
    //   if (val === "") {
    //     update(() => {
    //       this.options = this.numbers;
    //     });
    //     return;
    //   }

    //   update(() => {
    //     const needle = val.toLowerCase();
    //     this.options = this.numbers.filter(
    //       v => v.toLowerCase().indexOf(needle) > -1
    //     );
    //   });
    // },
  //   mounted() {
  //   this.options = this.numbers;
  // },
    async chonItem(val) {
      this.market = null;
      this.nguonPhoi = null;
      // if (this.item) {
      //   this.unit = "(" + this.item.unit.name + ")";
      // }
    },
    async onClick() {
   // this.po = []
    //  let departentId = this.congdoan.value
    //   let itemId =  this.item.value
     
    //        const   data1 = await this.getAllLsx({departentId,itemId});
    //  this.num = data1.data
    //  this.code = this.num.find(q => { 
    //    return q.stepId == this.congdoan.value && q.itemId == this.item.value
    //  }).code
      if (parseFloat(this.quantity) > 0) {
         this.xuaton = this.quantity
       

       // for (let i = 0; i < this.num.length; i++) {
          //let code1 = this.num[0].code;
          //this.po = this.lenhsanxuat[i]
          //this.po = await this.getPoByCode({ code1 });
          // if (conlai <this.po.conThucHien) {
          //   await this.createPackage(100026,conlai);
           // conlai = conlai - this.po.conThucHien;
        //  }
       // }
      }
//    let  code1 = this.num[0].code
// this.po = await this.getPoByCode({ code1 });
//      console.log('lệnh sx:',this.num.length)
     if (this.quantity > this.tonkho ){
       this.$q.dialog({
          title: "Lỗi",
          message: "Nhập quá khối lượng tồn kho!"
          });
     } else {
      
     
               
      
     
 
        
 const payload = {
         
        departmentId: this.congdoan.value,
        stepNextId:  this.congdoan.value,
        itemId: this.item.value,
        TYPE_ID: 100026,
        createBy:this.userInfo.id,
        factoryId: 100000,
        quantity: this.xuaton,
        PO: "VA",
      };
       const data2 = await this.$store.dispatch(
        "production/INSERT_PACKAGE",
        payload
      );
      
      if (data2.meta.success){
          this.GUID = data2.data[0].GUID
      console.log('ID:',data2.data[0].ID)
      this.updateITEMPACKAGE(data2.data[0].ID,this.xuaton)
      }
        showNotifySuccess();
       
        
        this.xuaton = 0;
      
     }
  
       const payload = {
        departmentId: this.congdoan.value,
        itemId: this.item.value,
        quantity: -this.quantity,
        marketCode: this.item.market,
        nguonPhoi: this.nguonPhoi ? this.nguonPhoi.value : null,
        poNumber: this.GUID
      };
      const data = await this.$store.dispatch(
        "production/NHAP_TON_DAU_KY",
        payload
      );
       
    console.log('ID:',this.GUID)
    
       
     this.showConfirmDialog();
     
    },
    
  
    async updateITEMPACKAGE(PACKAGE_ID,xuatton){
        console.log('SP:',this.item.value)
       const payload = {
           
        PACKAGE_ID,
        itemId: this.item.value,
   
        quantity: xuatton
       
      };
       const data = await this.$store.dispatch(
        "production/INSERT_ITEM_IN_PACKAGE",
        payload
      );
    },
    chonCongdoan(v) {this.nguonPhoi = null },
    searchItem(val, update) {
      let itemDupplicate = [];
      if (val === "") {
        update(() => {
          this.items = this.itemDupplicate;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.items = this.itemDupplicate.filter((v) => {
          const quicach = v.label.toString().toLowerCase();
          if (quicach.indexOf(needle) > -1) {
            return v;
          }
        });
      });
    },
  },
};
</script>

<style>
</style>