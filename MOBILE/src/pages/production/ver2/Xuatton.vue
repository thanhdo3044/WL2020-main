<template>
  <q-page class="q-pa-md bg-blue-grey-7">
     <app-bar class="text-white">Xuất phôi tại tổ</app-bar>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
         label-color="amber"
          v-model="congdoan"
          @input="chonCongdoan"
          :options="congdoans"
          label="Tổ"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          clearable
          @input="showConfirmDialog"
          use-input
           label-color="amber"
          input-debounce="0"
          @filter="searchItem"
          style="font-family: 'Time New Roman'; font-size: 16px"
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
        dark
        label-color="amber"
          clearable
          style="font-family: 'Time New Roman'; font-size: 16px"
          v-model="market"
          :options="markets"
          label="Loại QC"
        />
      </div>
    </div> -->
    <div class="row" v-if="congdoan !== null && item !== null">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          @input="onChange"
          label-color="amber"
          v-model="idDepartment"
          :options="options"
          label="Chọn nhà máy hoặc khách hàng"
        />
        <q-select
        dark
          use-input
          @input="showConfirmDialog"
          label-color="amber"
          v-model="department"
          :options="departments"
          @filter="filterFn1"
          label="Chọn nơi xuất đến"
        />
      </div>
    </div>
    <div class="row" v-if="card">
      <div class="col-6 q-pa-sm">
        <q-input dark  label-color="amber" v-model="quantity" type="text" label="Số lượng" />
      </div>
      <div class="col-6 q-pa-sm">
        <q-input dark label-color="amber" readonly v-model="unit" type="text" label="Đơn vị " />
      </div>
    </div>
     <div class="col-12 q-pa-sm">
        <q-input label-color="amber" dark v-model="description" type="text" label="Ghi chú" />
      </div>
    <div class="col-6 q-pa-sm" v-if="card">
      <q-input dark label-color="amber" readonly v-model="tonkho" type="text" label="Tồn kho" />
    </div>
    <!-- <div class="col-6 q-pa-sm" v-if="card">
        <q-input readonly v-model="thuchien" type="text" label="Khối lượng còn thực hiện" />
      </div> -->
    <div class="row">
      <div class="col-12">
        <q-btn
          color="primary"
          class="full-width"
          label="Xuất tồn"
          @click="onClick"
        />
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
import AppBar from "../../../components/AppBar";
//import { showLoadingIos, closeLoading,generateUUID, formatDateISO } from '../../../utils/utils'
import { mapGetters, mapActions } from "vuex";
export default {
  //20q1070
  components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      congdoan: null,
      congdoans: [],
      item: null,
      items: [],
      num: [],
      code1: "",
      po: [],
      description: "",
      card: true,
      code: [],
      tonkho: 0,
      thuchien: 0,
      unit: "",
      idDepartment: "",
      quantity: "",
      itemDupplicate: [],
      market: null,
      department: null,
      departments: [],
      options: [
        {
          label: "Nhà máy CBG Thuận Hưng",
          factoryId: 100000,
          value: 100000,
          code: "TH",
        },
        // {
        //   label: "NM CBG Yên Sơn 1A",
        //   factoryId: 100003,
        //   value: 102339,
        //   code: "YS1A",
        // },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          factoryId: 100004,
          value: 102340,
          code: "YS1",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          factoryId: 100005,
          value: 102366,
          code: "TB",
        },
        //  {
        //   label: "Nhà máy CBG Quang Minh",
        //   factoryId: 102427,
        //   value: 102427,
        //   code: "QM",
        // },
         {
          label: "NM Nam Hồng(DA)",
          factoryId: 102423,
          value: 102423,
          code: "NH",
        },
         {
          label: "Khách hàng",
          factoryId: 199999,
          value: 199999,
          code: "KH",
        },
      ],
       
      ngay: "20210901",
      markets: [
        // { label: "Màu Cafe", value: "CAFE" },
        // { label: "Màu Xám", value: "XAM" },
        // { label: "Màu Đen", value: "DEN" },
        // { label: "Màu Trắng", value: "TRANG" },
           { label: "Chờ xử lý", value: "CXL" },
             { label: "Chính phẩm", value: "CP" },
      ],
      khachang:[],
      showConfirm: false,
      nguonPhoi: null,
      nguonPhois: [
        { label: "Tại tổ", value: "Tại tổ" },
        { label: "Yên Sơn 1a", value: "Yên Sơn 1a" },
        { label: "Yên Sơn 1b", value: "Yên Sơn 1b" },
        { label: "Thái Bình", value: "Thái Bình" },
        { label: "Mua ngoài", value: "Mua ngoài" },
      ],
      allMarket: [],
    };
  },
  computed: {
    ...mapGetters("base", ["congDoans", "userInfo"]),
  },
  async created() {
    this.$store.getters["base/mySources"].forEach((s) => {
      this.congdoans.push({
        value: s.id,
        label: s.name,
        factoryId:s.factoryId,
      });
    });

    this.loadItem();
    this.getMarket();

    this.aardestinations = await this.$store.dispatch("base/getAllCongDoans");

    
  },

  methods: {
    ...mapActions("po", [
      "getAllLsx",
      "getPosByNumberAndStep",
      "getAllNguonPhoi",
      "resetPos",
      "themTonKeHoach2",
    ]),
    ...mapActions("production", [
      "getAllKeHoachSanXuatConLais",
      "getPoByCode",
      "addPackage",
      "getDinhMucs",
      "getTyLeTHs",
      "getlenhsx",
    ]),
    async showConfirmDialog() {
      this.ngay = "20210926";
      this.tonkho = 0;

      //this.card = true
      if (this.item) {
        this.unit = "(" + this.item.unitId + ")";
      }
      this.thuchien = 0;
      if (this.congdoan.value && this.item.value) {
        if (this.congdoan.value == 102488) this.ngay = "20220428";
        if (this.congdoan.value == 102487) this.ngay = "2022-06-09 11:30:00";
        if (this.congdoan.value == 102608) this.ngay = "20211015";
          if (this.congdoan.value == 102493) this.ngay = "20220606";
        if (this.congdoan.value == 102495 || this.congdoan.value == 102494)
          this.ngay = "20220609";
        if ( this.congdoan.value == 102543)
          this.ngay = "20220425";
          if (this.congdoan.value == 102460 ) this.ngay = '2022-04-07 13:00:00'
        const payload = {
          departmentId: this.congdoan.value,
          itemId: this.item.value,
          day: this.item.day,
          rong: this.item.rong,
          dai: this.item.dai,
          nguonPhoi: "Tại tổ",
          luaPhoi: this.luaPhoi ? this.luaPhoi.value : null,
          ngay: this.ngay,
        };
        const data = await this.$store.dispatch(
          "production/KL_TON_DAU_KY",
          payload
        );

        // console.log('ton kho:',data.data)
        if (data.data.length > 0) {
          this.tonkho = data.data[0].tonkho;
        }
        //   }
        //   else {
        //    this.$q.dialog({
        //       title: "Lỗi",
        //       message: "không có khối lượng tồn kho!"
        //       });
        //   }

        let departentId = this.congdoan.value;
        let itemId = this.item.value;

        const data1 = await this.getAllLsx({ departentId, itemId });
    
        this.num = data1.data;

        //  for (let i = 0; i < this.num.length; i++){
        // let code1 = this.num[i].code;
        //  this.po = await this.getPoByCode({ code1 });
        if (this.num.length > 0) this.thuchien = this.num[0].conthuhien;

        //       }
        //if (this.thuchien < 0) this.thuchien = 0
        //  if (data1.data.length >0)     this.card = true
        this.$q.loading.hide();
      } else
        this.$q.dialog({
          title: "Lỗi",
          message: "Nhập đầy đủ thông tin!",
        });
    },
    async filterFn1(val, update) {
      if (val === "") {
        update(() => {
          this.departments = this.op;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.departments = this.op.filter((v) => {
          const quicach = v.label.toString().toLowerCase();
          if (quicach.indexOf(needle) > -1) {
            return v;
          }
        });
      });
    },
    async onChange(value) {
   let destinations = []
         this.khachang = await this.$store.dispatch("production/getkhachhang");
      this.fa = value.factoryId;
      if (this.fa ==  199999)
    {
         this.khachang.forEach((d) =>{
           destinations.push({
             label:d.ten_kh,
             value:199999,
             ma:d.ma_kh,
           })
         })
    } else {
       destinations = this.aardestinations.filter(
        (o) => (o.factoryId == value.value || o.factoryId == value.factoryId) && (o.TYPE2 == 'to' || o.TYPE2 == 'kho' || o.TYPE2 == 'nhaMay')
      );
      destinations.map((element) => {
        element.label = element.NAME;
        element.value = element.ID;
      });
    }
      this.op = destinations;
     
    },
    async loadItem() {
      const data = await this.$store.dispatch("production/ACTION_FETCH_ITEMS", {
        factoryId: 100000,
      });
      data.forEach((d) => {
        const itemNameConvert = `[${d.id}][${d.code}] ${d.name} (${d.height}*${d.width}*${d.length})`;
        this.items.push({
          label: itemNameConvert,
          value: d.id,
          unit: d.unitId,
          day: d.height,
          rong: d.width,
          dai: d.length,
        });
      });
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
      this.card = true;
      if (this.item) {
        this.unit = "(" + this.item.unit.name + ")";
      }
    },
    async onClick() {
      this.fa = this.fa1
      // this.po = []
      //  let departentId = this.congdoan.value
      //   let itemId =  this.item.value

      //        const   data1 = await this.getAllLsx({departentId,itemId});
      //  this.num = data1.data
      //  this.code = this.num.find(q => {
      //    return q.stepId == this.congdoan.value && q.itemId == this.item.value
      //  }).code
      if (parseFloat(this.quantity) > 0) {
        this.xuaton = this.quantity;
        this.code1 = this.department.value;
        if (
          this.num.length > 0 &&
          (this.congdoan.value == 100274 || this.congdoan.value == 100264)
        ) {
          this.code1 = this.num[0].code;
          if (this.thuchien < this.quantity) {
            return this.$q.dialog({
              html: true,
              title: "Lỗi",
              message:
                "Giao vượt quá kế hoạch của LSX:" +
                this.num[0].number +
                "<br>SL còn phải làm của lệnh:" +
                this.thuchien,
            });
          }
        } else this.code1 = this.idDepartment.value;
if (this.idDepartment.value == 199999)
{
  this.code1 = this.department.ma
}
if (this.congdoan.value == 102488 || this.congdoan.value == 102848 ||this.congdoan.value == 102859) this.fa = 100004
if (this.congdoan.value == 102460 || this.congdoan.value == 102860) this.fa = 100005
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
      //  if (this.num.length>0){
      //        if (this.quantity > this.thuchien) {
      //           this.$q.dialog({
      //           title: "Lỗi",
      //           message: "Nhập quá kế hoạch!"
      //           });
      //        } else{
      //          for (let i = 0; i < this.num.length; i++){
      //             let code1 = this.num[i].code;
      //      this.po = await this.getPoByCode({ code1 });

      //         console.log('con thực hiện:',this.po.conThucHien)
      //         if (this.xuaton > 0 && this.po.conThucHien > 0){
      //         if (this.xuaton <= this.po.conThucHien){

      //  const payload = {

      //         departmentId: this.congdoan.value,
      //         stepNextId: this.department.value,
      //         itemId: this.item.value,
      //         TYPE_ID: 100026,
      //         createBy:this.userInfo.id,
      //         factoryId: this.idDepartment.factoryId,
      //         quantity: this.xuaton,
      //         PO: this.num[i].code,
      //       };
      //        const data2 = await this.$store.dispatch(
      //         "production/INSERT_PACKAGE",
      //         payload
      //       );

      //       if (data2.meta.success){
      //       console.log('ID:',data2.data[0].ID)
      //       this.updateITEMPACKAGE(data2.data[0].ID,this.xuaton)
      //       }
      //         showNotifySuccess();

      //         this.xuaton = 0;
      //       }else {
      //          const payload = {

      //         departmentId: this.congdoan.value,
      //         stepNextId: 102460,
      //         itemId: this.item.value,
      //         TYPE_ID: 100026,
      //         createBy:this.userInfo.id,
      //         factoryId: this.idDepartment.factoryId,
      //         quantity: this.po.conThucHien,
      //         PO: this.num[i].code,
      //       };
      //        const data2 = await this.$store.dispatch(
      //         "production/INSERT_PACKAGE",
      //         payload
      //       );

      //       if (data2.meta.success){
      //       console.log('ID:',data2.data[0].ID)
      //       this.updateITEMPACKAGE(data2.data[0].ID,this.po.conThucHien)
      //       }
      //         showNotifySuccess();

      //          this.xuaton = this.xuaton - this.po.conThucHien

      //      }
      //          }

      //      }
      //       //  const payload = {
      //       //   departmentId: this.congdoan.value,
      //       //   itemId: this.item.value,
      //       //   quantity: -this.quantity,
      //       //   marketCode: this.market ? this.market.value : null,
      //       //   nguonPhoi: this.nguonPhoi ? this.nguonPhoi.value : null,
      //       // };
      //       // const data = await this.$store.dispatch(
      //       //   "production/NHAP_TON_DAU_KY",
      //       //   payload
      //       // );

      //      }
      //       this.quantity = "";
      //      this.showConfirmDialog();
      //  } else {
      const payload = {
        departmentId: this.congdoan.value,
        stepNextId: this.department.value,
        itemId: this.item.value,
        TYPE_ID: 100026,
        createBy: this.userInfo.id,
        factoryId: this.fa,
        quantity: this.xuaton,
        PO: this.code1,
        marketCode: this.description,
       // ghichu:this.market ? this.market.value : null,
      };
      const data2 = await this.$store.dispatch(
        "production/INSERT_PACKAGE",
        payload
      );

      if (data2.meta.success) {
        console.log("ID:", data2.data[0].ID);
        const data3 = this.updateITEMPACKAGE(data2.data[0].ID, this.xuaton);
      }
      showNotifySuccess();

      //}
    },

    async updateITEMPACKAGE(PACKAGE_ID, xuatton) {
      const payload = {
        PACKAGE_ID,
        itemId: this.item.value,

        quantity: xuatton,
      };
      const data = await this.$store.dispatch(
        "production/INSERT_ITEM_IN_PACKAGE",
        payload
      );
      if (data.meta.success) {
        this.quantity = "";
        this.showConfirmDialog();
      }
    },
    chonCongdoan(v) {
      this.nguonPhoi = null;
      this.fa1 = v.factoryId
    },
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