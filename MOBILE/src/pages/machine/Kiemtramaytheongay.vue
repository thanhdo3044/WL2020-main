<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto text-white">Kiểm tra bảo dưỡng máy cấp  {{cap}}</div>
      </div>
    </div>
    <div class="row">
      <div class="col-8 q-pa-sm">
        <q-select
        dark
          filled
          label-color="amber"
          v-model="factory"
          @input="chonNhaMay"
          label="Chọn nhà máy"
          :options="options"
        />
      </div>
        <div class="col-4 q-pa-sm">
        <q-select
        dark
          filled
          label-color="amber"
          v-model="cap"
          @input="chonNhaMay"
          label="Cấp BD"
          :options="capbaocao"
        />
      </div>
    </div>
       <div v-if="cap==1 || cap ==3" class="row">
      <q-input
      label-color="amber"
      label="Chọn ngày"
   
      dark
        fill-mask
        mask="####-##-## ##:##"
        class="col-12 q-pa-sm"
        filled
        v-model="startTime"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date @input="chonNhaMay" mask="YYYY-MM-DD HH:mm" v-model="startTime">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup     label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
     <div v-if="cap==2" class="row">
        <div v-if="cap==2" class="col-6 col-md-1 q-pa-sm">
          <q-input filled @input="chonNhaMay" label-color="amber" v-model.number="week" type="number" label="Tuần"
            dark />
        </div>
          <div v-if="cap==2" class="col-6 col-md-1 q-pa-sm">
          <q-input filled @input="chonNhaMay" label-color="amber" v-model.number="year" type="number" label="Năm"
            dark />
        </div>
     </div>
    <div class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          filled
          label-color="amber"
          v-model="tenMay"
          use-input
          input-debounce="0"
          label="Chọn mã máy"
          @input="chonMay"
          :options="mays"
          @filter="filterMachine"
        />
      </div>
    </div>
        <div v-if="cap==3" class="row">
      <div class="col-12 q-pa-sm">
        <q-select
        dark
          filled
          label-color="amber"
          v-model="tenphankiemtra"
          use-input
          input-debounce="0"
          label="Chọn phàn kiểm tra"
          @input="chonMay"
          :options="phankiemtra"
        
        />
      </div>
    </div>
    <div class="row">
      <div class=" q-pa-sm" style="color: orange; font-weight: bold; display: block">Tên máy:</div>
      <div class=" q-pa-sm" style="color: white;font-weight: bold; display: block">{{ machineName }}</div>
    </div>
 
    <q-separator spaced />
    <div v-if="tenMay" class="row justify-center">
      <div 
        class="col-12 col-sm-6 col-md-4 col-lg-3 q-ma-xs"
        v-for="(item, index) in data"
        v-bind:key="item.id"
      >

        <q-card >
         
          <q-separator></q-separator>
          <q-card-section>
            <div class="row">
              <div class="col-7">
                <p class="prodTextNormal">
                 {{ index + 1 }}. {{ item.require }}
                </p>
              <p v-if="item.nguyennhan && item.status == false" class="prodTextNormal" style="color:orange">
             Nguyên nhân: {{ item.nguyennhan }}
                </p>
                  <p v-if="item.cachkhacphuc && item.status == false" class="prodTextNormal" style="color:orange">
             Cách khắc phục: {{ item.cachkhacphuc }}
                </p>
                 <p v-if="item.thoigian && item.status == false" class="prodTextNormal" style="color:orange">
             Thời gian: {{ item.thoigian }}
                </p>
                  <p v-if="item.ghichu && item.status == false" class="prodTextNormal" style="color:orange">
             Ghi chú: {{ item.ghichu }}
                </p>
              </div>
              <div class="col-5" align="right">
                <q-checkbox
                 color="positive"
                 @input="tinhtrangstt(item.status,index)"
                  v-model="item.status"
                  label="ĐẠT"
               :disable="item.checkk"
                />
                <br>
              <q-btn    
                 v-show="tinhtrang2[index]"          
                  color="orange"
                  label="Không đạt"
                  @click="showTinhTrang(item)"
                />   
              </div>
            </div>
               <div class="row"></div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-if="tenMay"  class="row">
      <div class="col-3"></div>
      <div class="col-6" align-v="center">
        <q-btn v-if="dulieu.length == 0 && data.length>0"
          color="primary"
          class="full-width"
          label="Hoàn thành"
          @click="onSubmit"
        />
        <q-btn v-if="dulieu.length > 0 && dulieu[0].SX_VERIFY_BY == null && isSXVerify == true"
          color="primary"
          class="full-width"
          label="Sản xuất xác nhận"
          @click="onSubmitSX"
        />
      </div>
    </div>
     <q-dialog v-model="tinhtrang1" persistent >
      <q-card style="min-width: 80%">
        <q-card-section >
          <div >
             <q-input v-model="nguyennhan1" style="font-style: italic" label-color="orange" label="Nguyên nhân:" />
            <q-input v-model="cachkhacphuc1" style="font-style: italic"  label="Cách khắc phục:" label-color="orange"/>
            <q-input v-model="thoigian1" style="font-style: italic"  label="Thời gian dự kiến hoàn thành:" label-color="orange"/>
            <q-input v-model="ghichu1" style="font-style: italic"  label="Ghi chú:" label-color="orange"/>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn
            flat
            label="Đồng ý"
            @click="settinhtrang"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { showNotifyError,getWeekNumber, showNotifySuccess } from '../../utils/utils';
export default {
  data() {
    return {
      startTime: null,
      tinhtrang1:false,
      tinhtrang2:[true,true,true,true,true,true,true],
       nguyennhan1: null,
       cachkhacphuc1:null,
       isSXVerify:false,
       thoigian1:null,
       week:0,
      factory: {
        label: "NM CBG Thuận Hưng",
        factoryId: 100000,
      },
      phankiemtra:[
        {
          value:'PHAN_CO',
          label:'Phần cơ'
        },
        {
          value:'PHAN_CO_MAY_FINGER',
          label:'Phần cơ máy Finger'
        },
        {
          value:'BANG_TAI_TRUNG_GIAN',
          label:'Băng tải trung gian'
        },
         {
          value:'MAY_GHEP_DOC',
          label:'Máy ghép dọc'
        },
       {
          value:'PHAN_KHI',
          label:'Phần khí'
        },
         {
          value:'PHAN_THUY_LUC',
          label:'Phần thủy lực'
        },
        {
          value:'PHAN_DIEN',
          label:'Phần điện'
        },
      ],
        data: [
        {
          checkName: "",
          require: "Hệ thống khí có rò rỉ không?",
          status: false,
          group: "",
          tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 1,
        },
        {
          checkName: "",
          require: "Áp lực làm việc đúng tiêu chuẩn?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 2,
        },
        {
          checkName: "",
          require:
            "Hệ thống tỳ, kẹp hoạt động?",
          status: false,
          group: "",
           tinhtrang:null,
           nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 3,
        },
        {
          checkName: "",
          require: "Hệ thống bôi trơn hoạt động?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 4,
        },
        {
          checkName: "",
          require: "Động cơ hoạt động?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 5,
        },
        {
          checkName: "",
          require: "Các bộ truyền hoạt động?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 6,
        },
        {
          checkName: "",
          require: "Hệ dao cắt hoạt động bình thường?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 7,
        },
       ],
       cap:1,
         capbaocao:[1,2,3],
      options: [
        {
          label: "NM CBG Thuận Hưng",
          factoryId: 100000,
          code: "TH",
        },
        {
          label: "NM CBG Yên Sơn",
          factoryId: 102340,
          code: "YS",
        },
        {
          label: "NM CBG Thái Bình",
          factoryId: 102366,
          code: "TB",
        },
      ],
     dulieu:[],
      tenMay: null,
      tenphankiemtra:null,
      machineName: "",
      mays: [],
      arrMays: [],
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  async created() {
    this.startTime = moment().format("YYYY-MM-DD HH:mm");
     const today = new Date();
    this.week = getWeekNumber(today);
     const currentYear = today.getFullYear();
    this.year = currentYear;
   this.chonNhaMay();
    this.loadPermission();
  },
  methods: {
    ...mapActions("machine", ["getMachineByFactoryId", "nhommaycap2", "insertManagedMachineday","getkiemtramayFactoryId","getkiemtramaycap2","insertManagedMachinecap3"
    ,"updateManagedMachineday","updateManagedMachinecap2","updateManagedMachinecap3","insertManagedMachinecap2","getdulieukiemtramaycap2","getkiemtramaycap3","getdulieukiemtramaycap3"]),
    ...mapActions("requests", [
      "getTokenFCM"
    ]),
     ...mapActions("production", [
      "getPermissionInScreen"
    ]),
    async chonNhaMay() {
    //     const today = new Date();
    // this.week = getWeekNumber(today);
    //  const currentYear = today.getFullYear();
    // this.year = currentYear;
      this.tenMay = null;
      this.mays = [];
      this.arrMays = [];
      this.machineName = null;
      console.log('cap:',this.cap)
      if (this.cap == 1) {
        let payload = {
      
        starTime: moment(this.startTime).format("YYYY-MM-DD 00:00:01"),
        endTime: moment(this.startTime).format("YYYY-MM-DD 23:59:50"),
        factoryId: this.factory.factoryId,
    
      };
      let machine = await this.getMachineByFactoryId(payload);
      machine.forEach((s) => {
        if (s.CREATE_BY != null && s.SX_VERIFY_BY == null)
        this.mays.push({
          value: s.machineId ,
          label: s.machineId + "-Đã kiểm tra-SX chưa XN",
          name: s.NAME,
        });
        else
         if (s.CREATE_BY != null && s.SX_VERIFY_BY != null)
        this.mays.push({
          value: s.machineId ,
          label: s.machineId +"-Đã kiểm tra-SX đã XN",
          name: s.NAME,
        });
        else 
         this.mays.push({
          value: s.machineId ,
          label: s.machineId ,
          name: s.NAME,
        });
        return;
      });
      this.arrMays = this.mays;
      if (!machine) this.data =  [
        {
          checkName: "",
          require: "Hệ thống khí có rò rỉ không?",
          status: false,
          group: "",
          tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 1,
        },
        {
          checkName: "",
          require: "Áp lực làm việc đúng tiêu chuẩn?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 2,
        },
        {
          checkName: "",
          require:
            "Hệ thống tỳ, kẹp hoạt động?",
          status: false,
          group: "",
           tinhtrang:null,
           nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 3,
        },
        {
          checkName: "",
          require: "Hệ thống bôi trơn hoạt động?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 4,
        },
        {
          checkName: "",
          require: "Động cơ hoạt động?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 5,
        },
        {
          checkName: "",
          require: "Các bộ truyền hoạt động?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 6,
        },
        {
          checkName: "",
          require: "Hệ dao cắt hoạt động bình thường?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 7,
        },
       ]
      }
      if (this.cap == 2){
let payload = {
  cap:this.cap
}
  let maycap2s =   await this.nhommaycap2(payload);
   maycap2s.forEach((s) => {
      
        this.mays.push({
          value: s.MANHOMMAY ,
          label: s.NHOMMAY ,
          name: s.NHOMMAY,
        });
   })
     this.arrMays = this.mays;
      }
  if (this.cap == 3){
let payload = {
  cap:this.cap
}
  let maycap3s =   await this.nhommaycap2(payload);
   maycap3s.forEach((s) => {
      
        this.mays.push({
          value: s.MANHOMMAY ,
          label: s.NHOMMAY ,
          name: s.NHOMMAY,
        });
   })
     this.arrMays = this.mays;
      }
    },
    filterMachine(val, update) {
      if (val === "") {
        update(() => {
          this.mays = this.arrMays;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.mays = this.arrMays.filter(function (str) {
          return str.value.toLowerCase().includes(needle);
        });
      });
    },
    tinhtrangstt(value,k){
      if (value)
          this.tinhtrang2[k] = false
          else this.tinhtrang2[k] = true
    },
    settinhtrang(){
const index = this.data.findIndex((d) => d.id == this.itemSelect.id);
this.data[index].nguyennhan = this.nguyennhan1
this.data[index].cachkhacphuc = this.cachkhacphuc1
this.data[index].thoigian = this.thoigian1
this.data[index].ghichu = this.ghichu1
this.nguyennhan1 = null;
this.cachkhacphuc1 = null;
this.thoigian1 = null;
this.ghichu1=null;
    },
    showTinhTrang(item){
      this.itemSelect = item;
          this.tinhtrang1 = true;

    },
    async chonMay() {
      this.data = [];
      if (this.cap == 1) {
      this.machineName = this.tenMay.name;
           let payload = {
         tenMay:this.tenMay.value,
        starTime: moment(this.startTime).format("YYYY-MM-DD 00:00:01"),
        endTime: moment(this.startTime).format("YYYY-MM-DD 23:59:50"),
        factoryId: this.factory.factoryId,
    
      };
       this.dulieu = await this.getkiemtramayFactoryId(payload);
      if (this.dulieu.length>0) {
        this.data = []
         this.tinhtrang2 = [false,false,false,false,false,false,false],
        this.dulieu.forEach(e =>{
          this.data.push({
          require: e.MUC_KIEM_TRA,
          status: e.TRANGTHAI,
          group: "",
           tinhtrang:null,
          nguyennhan: e.NGUYENNHAN,
          cachkhacphuc:e.CACHKHACPHUC,
          thoigian:e.THOIGIAN,
          ghichu:e.GHICHU,
          checkk:true,
          id: e.KT_ID,
          })
        })
      }
 else { this.data =  [
        {
          checkName: "",
          require: "Hệ thống khí có rò rỉ không?",
          status: false,
          group: "",
          tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 1,
        },
        {
          checkName: "",
          require: "Áp lực làm việc đúng tiêu chuẩn?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 2,
        },
        {
          checkName: "",
          require:
            "Hệ thống tỳ, kẹp hoạt động?",
          status: false,
          group: "",
           tinhtrang:null,
           nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 3,
        },
        {
          checkName: "",
          require: "Hệ thống bôi trơn hoạt động?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 4,
        },
        {
          checkName: "",
          require: "Động cơ hoạt động?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 5,
        },
        {
          checkName: "",
          require: "Các bộ truyền hoạt động?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 6,
        },
        {
          checkName: "",
          require: "Hệ dao cắt hoạt động bình thường?",
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
          id: 7,
        },
       ]
        this.tinhtrang2=[true,true,true,true,true,true,true];
 }
      }
      if (this.cap == 2){
        this.machineName = this.tenMay.name;
            let payload1 = {
         tenMay:this.tenMay.value,
        week: this.week,
        nam:this.year,
        factoryId: this.factory.factoryId,
    
      };
       this.dulieu = await this.getdulieukiemtramaycap2(payload1);
       if (this.dulieu.length>0){
  this.data = []
      let j=0
        this.dulieu.forEach(e =>{
             this.tinhtrang2[j] = false
          j=j+1;
          this.data.push({
          require: e.MUC_KIEM_TRA,
          status: e.TRANGTHAI,
          group: "",
           tinhtrang:null,
          nguyennhan: e.NGUYENNHAN,
          cachkhacphuc:e.CACHKHACPHUC,
          thoigian:e.THOIGIAN,
          ghichu:e.GHICHU,
          checkk:true,
         
          })
        })
       } else {
        let payload = {
          cap:this.cap,
          manhommay:this.tenMay.value
        }
        this.dulieuc2 = await this.getkiemtramaycap2(payload);
 
        this.data = [];
        let i=0;
         this.dulieuc2.forEach(e =>{
          this.tinhtrang2[i] = true
          i=i+1;
          this.data.push({
          require: e.MUC_KIEM_TRA,
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
       
          })
        })
       }
      }
      if (this.cap == 3 && this.tenMay && this.tenphankiemtra){
         this.machineName = this.tenMay.name;
                  let payload1 = {
         tenMay:this.tenMay.value,
           starTime: moment(this.startTime).format("YYYY-MM-DD 00:00:01"),
        endTime: moment(this.startTime).format("YYYY-MM-DD 23:59:50"),
        month:moment(this.startTime).month()+1,
        year:moment(this.startTime).year(),
        phankiemtra:this.tenphankiemtra.value,
        factoryId: this.factory.factoryId,
    
      };
       this.dulieu = await this.getdulieukiemtramaycap3(payload1);
    //   if (!this.dulieu) this.dulieu = []
       if (this.dulieu.length>0){
  this.data = []
      let j=0
        this.dulieu.forEach(e =>{
             this.tinhtrang2[j] = false
          j=j+1;
          this.data.push({
          require: e.MUC_KIEM_TRA,
          status: e.TRANGTHAI,
          group: "",
           tinhtrang:null,
          nguyennhan: e.NGUYENNHAN,
          cachkhacphuc:e.CACHKHACPHUC,
          thoigian:e.THOIGIAN,
          ghichu:e.GHICHU,
          checkk:true,
         
          })
        })
       } else {
         let payload = {
          cap:this.cap,
          manhommay:this.tenMay.value,
          phankiemtra:this.tenphankiemtra.value
        }
        this.dulieuc3 = await this.getkiemtramaycap3(payload);
 
        this.data = [];
        let i=0;
         this.dulieuc3.forEach(e =>{
          this.tinhtrang2[i] = true
          i=i+1;
          this.data.push({
          require: e.MUC_KIEM_TRA,
          status: false,
          group: "",
           tinhtrang:null,
          nguyennhan: null,
          cachkhacphuc:null,
          thoigian:null,
          ghichu:null,
          checkk:false,
       
          })
        })
      }
      }
    },
 async onSubmitSX() {
   if (this.cap == 1){
      let payload2 = {
         tenMay:this.tenMay.value,
         createdBy: this.userInfo.id,
        starTime: moment(this.startTime).format("YYYY-MM-DD 00:00:01"),
        endTime: moment(this.startTime).format("YYYY-MM-DD 23:59:50"),
        factoryId: this.factory.factoryId,
      };
      let data = await this.updateManagedMachineday(payload2);

      if(data.meta.success){
        showNotifySuccess();
           this.machineName = null;
        this.tenMay = null;
      this.chonNhaMay();
  //  this.data.forEach(e =>{
  //       e.status = false;
  //     })
      
      }else{
        showNotifyError();
      }
   }
   if (this.cap == 2){
        let payload2 = {
         tenMay:this.tenMay.value,
         createdBy: this.userInfo.id,
        week: this.week,
        nam: this.year,
        factoryId: this.factory.factoryId,
      };
      let data = await this.updateManagedMachinecap2(payload2);

      if(data.meta.success){
        showNotifySuccess();
           this.machineName = null;
        this.tenMay = null;
      this.chonNhaMay();
      
      }else{
        showNotifyError();
      }
   }
    if (this.cap == 3){
        let payload2 = {
         tenMay:this.tenMay.value,
         createdBy: this.userInfo.id,
         starTime: moment(this.startTime).format("YYYY-MM-DD 00:00:01"),
        endTime: moment(this.startTime).format("YYYY-MM-DD 23:59:50"),
        phankiemtra:this.tenphankiemtra.value,
        factoryId: this.factory.factoryId,
      };
      let data = await this.updateManagedMachinecap3(payload2);

      if(data.meta.success){
        showNotifySuccess();
           this.machineName = null;
        this.tenMay = null;
      this.chonNhaMay();
      
      }else{
        showNotifyError();
      }
   }
 },
 async loadPermission() {
      console.log("path", this.$route.path);
      const payloadPermission = {
        path: this.$route.path,
        accountId: this.userInfo.id,
      };
      this.listPermission = await this.getPermissionInScreen(payloadPermission);
      this.listPermission.data.forEach((el) => {
        if (el.CODE == "approve") {
          this.isSXVerify = true;
        }
     
      });
 },
    async onSubmit() {
   if (this.cap ==1){
      let payload2 = {
        machineId: this.tenMay.value,
        type: "trouble",
        starTime: this.startTime,
        createdBy: this.userInfo.id,
        factoryId: this.factory.factoryId,
        data:this.data,
        
      };
      let data = await this.insertManagedMachineday(payload2);

      if(data.meta.success){
        showNotifySuccess();
           this.machineName = null;
        this.tenMay = null;
      this.chonNhaMay();
   this.data.forEach(e =>{
        e.status = false;
      })
      
      }else{
        showNotifyError();
      }
   }
   if (this.cap ==2){
  let payload2 = {
        machineId: this.tenMay.value,
        type: "trouble",
        week: this.week,
         nam: this.year,
        createdBy: this.userInfo.id,
        factoryId: this.factory.factoryId,
        data:this.data,
        
      };
      let data = await this.insertManagedMachinecap2(payload2);

      if(data.meta.success){
        showNotifySuccess();
           this.machineName = null;
        this.tenMay = null;
      this.chonNhaMay();
   this.data.forEach(e =>{
        e.status = false;
      })
      
      }else{
        showNotifyError();
      }
   }
   if (this.cap ==3){
  let payload2 = {
        machineId: this.tenMay.value,
        type: "trouble",
        starTime: this.startTime,
        createdBy: this.userInfo.id,
        factoryId: this.factory.factoryId,
        phankiemtra:this.tenphankiemtra.value,
        data:this.data,
        
      };
      let data = await this.insertManagedMachinecap3(payload2);

      if(data.meta.success){
        showNotifySuccess();
           this.machineName = null;
        this.tenMay = null;
      this.chonNhaMay();
   this.data.forEach(e =>{
        e.status = false;
      })
      
      }else{
        showNotifyError();
      }
   }   
    },
  },
};
</script>