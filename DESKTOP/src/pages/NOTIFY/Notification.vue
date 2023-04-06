<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col-6 top-title text-blue" ><b>DANH SÁCH THÔNG BÁO </b></div>
       <div
          class="col-6 top-title text-orange cursor-pointer"
          align="right"
          @click="showChooseDate = true"
        >
          Từ ngày {{ tuNgay }} đến {{ denNgay }}
        </div>
    </div>
    <div class="row q-mt-sm">
    
    </div>
    <div class="row q-mt-sm justify-center">
   
    </div>
   
    <q-separator spaced />
      <div
        class="col-12 q-mt-sm"
        v-for="thongbao in tintuc"
        v-bind:key="thongbao.id"
      >
        <q-card v-if="thongbao.accountId == null" style="background-color:#ddd">
         
       <q-card-section  class="row items-center">
          <div class="row" style="font-size:20px">
            <div>
            <b>  {{ thongbao.veViec}} </b>
            </div>
          </div>
        </q-card-section>
        <q-card-section align="left">
         
          <div >
         
            <div class="col-12 col-md-5 q-mt-sm">
          {{ thongbao.SUMMARY}}
            </div>
            
                <div class="col-12 col-md-5 q-mt-sm">
                <q-btn flat label="xem chi tiết" color="red" @click="cancel(thongbao.ID,thongbao.accountId,thongbao.veViec,thongbao.SUMMARY,thongbao.CONTENT,thongbao.imageUrl)" />
            </div>
       
          </div>
        </q-card-section>
          </q-card>
            <q-card v-if="thongbao.accountId" >
         
       <q-card-section  class="row items-center">
          <div class="row">
            <div class="col-12 top" style="font-size:20px">
            <b>  {{ thongbao.veViec}} </b>
            </div>
          </div>
        </q-card-section>
        <q-card-section align="left">
         
          <div >
         
            <div class="col-12 col-md-5 q-mt-sm">
          {{ thongbao.SUMMARY}}
            </div>
            
                <div class="col-12 col-md-5 q-mt-sm">
                <q-btn flat label="Xem chi tiết" color="red" @click="cancel(thongbao.ID,thongbao.accountId,thongbao.veViec,thongbao.SUMMARY,thongbao.CONTENT,thongbao.imageUrl)" />
            </div>
       
          </div>
        </q-card-section>
          </q-card>
           <q-separator />
           <q-dialog v-model="xemtiep" persistent>
      <q-card style="min-width: 70%">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">
            <b>  {{TITLE}} </b>
            </div>
          </div>
        </q-card-section>
        
          
        <q-card-section align="left">
         
          <div >
            
            <div class="col-12 col-md-5 q-mt-sm">
          {{ SUMMARY}}
            </div>
            
          
            <div  class="col-6 col-md-5 q-mt-sm" >
              <p v-html="CONTENT" ></p>
            </div>
             <div v-if="imageUrl" class="col-6 col-md-5 q-mt-sm" >
               <a :href="'https://app.woodsland.com.vn:3003/Attached/' + imageUrl" target="_blank">
                   <img
                         v-bind:src="'https://app.woodsland.com.vn:3003/Attached/' + imageUrl"
                          alt="File đính kèm"
                          width="180"
                          height="auto"
                      
                        />
                        </a>
            </div>
             
       
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Đóng" color="red" @click="xemtiept" />
        
        </q-card-actions>
       
      </q-card>
    </q-dialog>    
          <!-- <q-card-actions align="right">
            <q-btn
              dense
              icon="cloud_download"
              @click="
                layPackageIds(myDepartment.value, item.itemId, item.CREATE_BY,item.quantity)
              "
              no-caps
              color="primary"
              label="Nhận"
            ></q-btn>
          </q-card-actions> -->
        
      </div>
    <DialogSelectDate
      :selectDate="chooseDate"
      :showChooseDate="showChooseDate"
      :cancelChooseDate="cancelChooseDate"
    />
    
  </q-page>
</template>

<script>
import { fasSmileWink } from "@quasar/extras/fontawesome-v5";
import DialogSelectDate from "../../components/commons/DialogSelectFromDateToDate";
import {
  formatDateISO,
  getFisrtDayOfMonth,
  formatDateVN,
} from "../../ultils";
export default {
  name: 'Error404',
   components: {
  
    DialogSelectDate,
  },
  data(){
    return{
      xemtiep:false,
      thutu:0,
      tintuc:[],
      showChooseDate: false,
      fromDate: null,
      toDate: null,
      iconfasSmileWink:fasSmileWink
    };
  },
   computed: {
    tuNgay() {
      return formatDateVN(this.fromDate);
    },
    denNgay() {
      return formatDateVN(this.toDate);
    },
    
  },
    methods: { 
       cancelChooseDate() {
      this.showChooseDate = false;
    },
       async chooseDate(f, t) {
      this.fromDate = f;
      this.toDate = t;
      this.showChooseDate = false;
     
      this.createItem();
    },
       cancel(ID,accountId,TITLE,SUMMARY,CONTENT,imageUrl) {
      this.xemtiep = true;
      this.infoId = ID;
      this.accountId = accountId;
      this.TITLE = TITLE;
      this.SUMMARY = SUMMARY;
      this.CONTENT = CONTENT;
      this.imageUrl = imageUrl;
      if (this.accountId == null)
      {
       const  payload = {
             accountId: this.$store.state.base.userInfo.id,
             infoId: this.infoId
     }
     const data =  this.$store.dispatch('NOTIFY/UPDATE_FORM_TIN_TUC',payload)
      }
    },
    async  xemtiept() {
      this.xemtiep = false;
    this.createItem()
    },
       async  createItem() {
         this.tintuc = []
           const  payload = {
             accountId: this.$store.state.base.userInfo.id,
               fromDate: formatDateISO(this.fromDate),
          toDate: formatDateISO(this.toDate),
     }
      const data = await this.$store.dispatch('NOTIFY/VIEW_TIN_TUC',payload)
       
   
 
    data.data.forEach((element) => {
      this.thutu = 0
     
        if (element.permission){
         const userStr = JSON.parse(element.permission);
         for (let i = 0; i < userStr.departmentId.length; i++)
{
  
   if (userStr.departmentId[i] == this.$store.state.base.userInfo.departmentId)
   this.thutu = 1
}

if (this.thutu == 1)
this.tintuc.push(element);
        }
    });

      const  payload1 = {
             ID: this.$store.state.base.userInfo.departmentId,
             infoId: this.tintuc[0].ID
     }
      const data1 = await this.$store.dispatch('NOTIFY/VIEW_PHONG_BAN',payload1)
  if (data1.data.length >0) this.showChooseItem = true;
      const  payload2 = {
             accountId: this.$store.state.base.userInfo.id,
             infoId: this.tintuc[0].ID
     }
     const data2 = await this.$store.dispatch('NOTIFY/VIEW_FORM_TIN_TUC',payload2)
     if (data2.data.length >0) this.showChooseItem = false
    }

    },
      async created() {
         this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    this.fromDate = getFisrtDayOfMonth(new Date());
    this.createItem()
      }
};
</script>
