<template>
  <q-card-section>
    <div class="q-gutter-sm text-primary text-h8">
        Chọn loại mẫu xin nghỉ :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
      <div v-if="order.OrderMeta[0].selection == null">
        <q-radio  dense v-model="metaValue.selection" val="Nghỉ phép" label="Nghỉ phép" color="teal"/>
        <q-radio  dense v-model="metaValue.selection" val="Nghỉ ốm" label="Nghỉ ốm" color="red"/>
        <q-radio  dense v-model="metaValue.selection" val="Nghỉ việc riêng có hưởng lương" label="Nghỉ việc riêng có hưởng lương" color="blue" />
        <q-radio  dense v-model="metaValue.selection" val="Xin nghỉ việc(kết thúc hợp đồng lao động)" label="Xin nghỉ việc(kết thúc hợp đồng lao động)" color="yellow"/>
        <q-radio  dense v-model="metaValue.selection" val="Xin nghỉ không lương" label="Xin nghỉ không lương" color="black"/>
        <q-radio  dense v-model="metaValue.selection" val="Xin nghỉ Thai sản" label="Xin nghỉ Thai sản" color="pink"/>
        </div>
        <div v-else>
          <span v-if="order.OrderMeta[0].selection == 'Nghỉ phép'">
              <q-radio  dense v-model="metaValue.selection" val="Nghỉ phép"  color="red"/>
          </span>
          <span v-else-if="order.OrderMeta[0].selection == 'Nghỉ ốm'">
              <q-radio  dense v-model="metaValue.selection" val="Nghỉ ốm"  color="red"/>
          </span>
          <span v-else-if="order.OrderMeta[0].selection == 'Nghỉ việc riêng có hưởng lương'">
              <q-radio  dense v-model="metaValue.selection" val="Nghỉ việc riêng có hưởng lương"  color="red"/>
          </span>
          <span v-else-if="order.OrderMeta[0].selection == 'Xin nghỉ việc(kết thúc hợp đồng lao động)'">
              <q-radio  dense v-model="metaValue.selection" val="Xin nghỉ việc(kết thúc hợp đồng lao động)"  color="red"/>
          </span>
          <span v-else-if="order.OrderMeta[0].selection == 'Xin nghỉ không lương'">
              <q-radio  dense v-model="metaValue.selection" val="Xin nghỉ không lương"  color="red"/>
          </span>
          <span v-else-if="order.OrderMeta[0].selection == 'Xin nghỉ Thai sản'">
              <q-radio  dense v-model="metaValue.selection" val="Xin nghỉ Thai sản"  color="red"/>
          </span>
          <span class="q-ml-sm" style="font-size:20px">{{metaValue.selection}}</span>
        </div>
    </div>
    <div v-if="metaValue.selection == 'Xin nghỉ việc(kết thúc hợp đồng lao động)'">
        <div v-if="order.status == 'Không được duyệt'">
          <q-input
        class="q-mt-sm"
        outlined
        v-model="metaValue.kinhGui"
        label="Kính gửi : "
        :readonly="!disable"
        />
        <div  class="flex">
          <q-input
      class="q-mt-sm q-pr-sm"
      style="width: 50% !important"
      outlined
      v-model="userInfo.lastName"
      label="Tên tôi là : "
      :readonly="!disable"
    />
        <q-input
        style="width: 50% !important"
        class="q-mt-sm"
        outlined
        v-model="userInfo.account"
        label="Mã nhân viên : "
        :readonly="!disable"
        />
        </div>
        
        <q-input
        class="q-mt-sm"
        outlined
        v-model="userInfo.position"
        label="Chức vụ : "
        :readonly="!disable"
        />
        <q-input
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="!disable"/>
        <div
        class="q-mt-sm"
        outlined
        > Nay tôi làm đơn này, kính xin Ban Tổng giám đốc cho tôi được nghỉ việc
        </div>
        <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">Từ ngày : </div>
                <div class="">
                  <DxDateBox
                    class="opa_1"
                    :value="order.OrderMeta[0].dateStart"
                    type="datetime"
                  />
                </div>
            </div>
      </div>
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do : "
        :readonly="!disable"
        />
        <div
        class="q-mt-sm"
        outlined
        >Vậy, kính mong Tổng Giám đốc, Cán bộ quản lý trực tiếp và Trưởng phòng Nhân sự xem xét cho tôi được chấm dứt hợp đồng.
            </br>Tôi xin chân thành cảm ơn ! 
        </div>
         <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta"  color="primary" text-color="white" label="Sửa" />

        </div>
        <div v-else>
          <q-input
        class="q-mt-sm"
        outlined
        v-model="metaValue.kinhGui"
        label="Kính gửi : "
        :readonly="disable"
        />
        <div  class="flex">
          <q-input
      class="q-mt-sm q-pr-sm"
      style="width: 50% !important"
      outlined
      v-model="userInfo.lastName"
      label="Tên tôi là : "
      :readonly="disable"
    />
        <q-input
        style="width: 50% !important"
        class="q-mt-sm"
        outlined
        v-model="userInfo.account"
        label="Mã nhân viên : "
        :readonly="disable"
        />
        </div>
        
        <q-input
        class="q-mt-sm"
        outlined
        v-model="userInfo.position"
        label="Chức vụ : "
        :readonly="disable"
        />
        <q-input
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
        <div
        class="q-mt-sm"
        outlined
        > Nay tôi làm đơn này, kính xin Ban Tổng giám đốc cho tôi được nghỉ việc
        </div>
        <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">Từ ngày : </div>
                <div class="">
                  <DxDateBox
                    class="opa_1"
                    :value="order.OrderMeta[0].dateStart"
                    type="datetime"
                  />
                </div>
            </div>
      </div>
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do : "
        :readonly="disable"
        />
        <div
        class="q-mt-sm"
        outlined
        >Vậy, kính mong Tổng Giám đốc, Cán bộ quản lý trực tiếp và Trưởng phòng Nhân sự xem xét cho tôi được chấm dứt hợp đồng.
            </br>Tôi xin chân thành cảm ơn ! 
        </div>
        </div>
        
    </div>
    <div v-if="metaValue.selection == 'Nghỉ phép' || metaValue.selection == 'Nghỉ ốm' || metaValue.selection == 'Nghỉ việc riêng có hưởng lương' &&   metaValue.selection != null">
        <div v-if="order.status == 'Không được duyệt'">
          <div class="flex">
          <q-input
          style="width:33.33% !important"
          class="q-mt-sm q-pr-sm"
          outlined
          v-model="userInfo.lastName"
          label="Tên tôi là : "
          :readonly="!disable"
        />
        <q-input
         style="width:33.33% !important"
        class="q-mt-sm q-pr-sm" 
        outlined
        v-model="userInfo.position"
        label="Chức vụ : "
        :readonly="!disable"
        />
        <q-input
         style="width:33.33% !important"
          class="q-mt-sm "
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="!disable"/>
        </div>
        <div class="row q-mt-sm" >
        <div class="col">
          <div class="">Thời gian từ :</div>
          <div class="">
            <DxDateBox
              :value="order.OrderMeta[0].dateStart"
              :disabled="!disable"
              type="datetime"
            />
          </div>
      </div>
        <div class="col q-pl-sm">
        <div class="text-h8">Thời gian đến :</div>
        <div class="">
          <DxDateBox
            :value="order.OrderMeta[0].dateEnd"
            :disabled="!disable"
            type="datetime"
          />
        </div>
      </div>

        </div>
        
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do : "
        :readonly="!disable"
        />
        <div class="flex">
        <q-select
        filled
        class="q-mt-sm q-pr-sm"
        v-model="metaValue.accountName"
        @input="changed"
        use-input
        :readonly="!disable"
        input-debounce="0"
        label="Người làm thay"
        :options="options"
        @filter="filterFn"
        style="width: 33.33% !important"
        behavior="dialog"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>    
        <q-input
        style="width: 33.33% !important"
        class="q-mt-sm q-pr-sm"
        outlined
        v-model="order.OrderMeta[0].position2"
        label="Chức vụ (người làm thay) : "
        :readonly="!disable"
        />
        <q-input
        style="width: 33.33% !important"
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].department2"
        label="Bộ phận (người làm thay): "
        :readonly="!disable"
        />
        </div>
         <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta"  color="primary" text-color="white" label="Sửa" />

        </div>
        <div v-else>
          <div class="flex">
          <q-input
          style="width:33.33% !important"
          class="q-mt-sm q-pr-sm"
          outlined
          v-model="userInfo.lastName"
          label="Tên tôi là : "
          :readonly="disable"
        />
        <q-input
         style="width:33.33% !important"
        class="q-mt-sm q-pr-sm" 
        outlined
        v-model="userInfo.position"
        label="Chức vụ : "
        :readonly="disable"
        />
        <q-input
         style="width:33.33% !important"
          class="q-mt-sm "
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
        </div>
        <div class="row q-mt-sm" >
        <div class="col">
          <div class="text-h8">Thời gian từ :</div>
          <div class="">
            <DxDateBox
              class="opa_1"
              :value="order.OrderMeta[0].dateStart"
              type="datetime"
            />
          </div>
      </div>
        <div class="col q-pl-sm">
        <div class="text-h8">Thời gian đến :</div>
        <div class="">
          <DxDateBox
            class="opa_1"
            :value="order.OrderMeta[0].dateEnd"
            type="datetime"
          />
        </div>
      </div>

        </div>
        
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do : "
        :readonly="disable"
        />
        <div class="flex">
          <q-select
        filled
        class="q-mt-sm q-pr-sm"
        v-model="metaValue.accountName"
        @input="changed"
        use-input
        :readonly="disable"
        input-debounce="0"
        label="Người làm thay"
        :options="options"
        @filter="filterFn"
        style="width: 33.33% !important"
        behavior="dialog"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>    
        <q-input
        style="width: 33.33% !important"
        class="q-mt-sm q-pr-sm"
        outlined
        v-model="order.OrderMeta[0].position2"
        label="Chức vụ (người làm thay) : "
        :readonly="disable"
        />
        <q-input
        style="width: 33.33% !important"
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].department2"
        label="Bộ phận (người làm thay): "
        :readonly="disable"
        />
        </div>
        </div>
        
        
        
    </div>
    <div v-if="metaValue.selection == 'Xin nghỉ Thai sản' && metaValue.selection != null">
        <div v-if="order.status == 'Không được duyệt'">
          <q-input
        class="q-mt-sm"
        outlined
        v-model="metaValue.kinhGui"
        label="Kính gửi : "
        :readonly="!disable"
        />
        <q-input
      class="q-mt-sm"
      outlined
      v-model="userInfo.lastName"
      label="Tên tôi là : "
      :readonly="!disable"
    />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="userInfo.account"
        label="Mã nhân viên : "
        :readonly="!disable"
        />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="userInfo.position"
        label="Chức vụ : "
        :readonly="!disable"
        />
        <q-input
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="!disable"/>
    <div
      class="q-mt-sm"
      outlined
    > Hôm nay, tôi viết đơn này xin trình bầy một việc như sau: 
    </div>
    <q-input
      class="q-mt-sm"
      outlined
      v-model="metaValue.thoiGianMangThai"
      label="Hiện tôi đang mang thai ở tháng thứ :"
      :readonly="!disable"
    />
    <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">Vậy tôi viết đơn này kính đề nghị Ban Lãnh đạo Công ty cho phép tôi được nghỉ sinh kể từ ngày  :</div>
                <div class="">
                  <DxDateBox
                    class="opa_1"
                    :value="order.OrderMeta[0].dateStart"
                    type="datetime"
                  />
                </div>
            </div>
      </div>
    <div
      class="q-mt-sm"
      outlined
    >(Có phiếu siêu âm thai kèm theo)
        </br>Tôi xin chân thành cảm ơn. 
    </div>
     <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta"  color="primary" text-color="white" label="Sửa" />
    
        </div>
        <div v-else>
          <q-input
        class="q-mt-sm"
        outlined
        v-model="metaValue.kinhGui"
        label="Kính gửi : "
        :readonly="disable"
        />
        <q-input
      class="q-mt-sm"
      outlined
      v-model="userInfo.lastName"
      label="Tên tôi là : "
      :readonly="disable"
    />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="userInfo.account"
        label="Mã nhân viên : "
        :readonly="disable"
        />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="userInfo.position"
        label="Chức vụ : "
        :readonly="disable"
        />
        <q-input
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
    <div
      class="q-mt-sm"
      outlined
    > Hôm nay, tôi viết đơn này xin trình bầy một việc như sau: 
    </div>
    <q-input
      class="q-mt-sm"
      outlined
      v-model="metaValue.thoiGianMangThai"
      label="Hiện tôi đang mang thai ở tháng thứ :"
      :readonly="disable"
    />
    <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">Vậy tôi viết đơn này kính đề nghị Ban Lãnh đạo Công ty cho phép tôi được nghỉ sinh kể từ ngày  :</div>
                <div class="">
                  <DxDateBox
                    class="opa_1"
                    :value="order.OrderMeta[0].dateStart"
                    type="datetime"
                  />
                </div>
            </div>
      </div>
    <div
      class="q-mt-sm"
      outlined
    >(Có phiếu siêu âm thai kèm theo)
        </br>Tôi xin chân thành cảm ơn. 
    </div>
        </div>
        
    </div>
    <div v-if="metaValue.selection == 'Xin nghỉ không lương' && metaValue.selection != null">
        <div v-if="order.status =='Không được duyệt'">
           <q-input
        class="q-mt-sm"
        outlined
        v-model="metaValue.kinhGui"
        label="Kính gửi : "
        :readonly="!disable"
        />
        <q-input
      class="q-mt-sm"
      outlined
      v-model="userInfo.lastName"
      label="Tên tôi là : "
      :readonly="!disable"
    />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="userInfo.account"
        label="Mã nhân viên : "
        :readonly="!disable"
        />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="userInfo.position"
        label="Chức vụ : "
        :readonly="!disable"
        />
        <q-input
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="!disable"/>
          <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">Hôm nay, tôi viết đơn này xin nghỉ không lương từ ngày :</div>
                <div class="">
                  <DxDateBox
                    class="opa_1"
                    :value="order.OrderMeta[0].dateStart"
                    type="datetime"
                  />
                </div>
            </div>
            <div class="col q-pl-sm">
              <div class="text-h8">Thời gian đến :</div>
              <div class="">
                <DxDateBox
                  class="opa_1"
                  :value="order.OrderMeta[0].dateEnd"
                  type="datetime"
                />
              </div>
            </div>
          </div>
    
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].description"
      label="Lý do : "
      :readonly="!disable"
    />
    <div
      class="q-mt-sm"
      outlined
    >Vậy tôi viết đơn này kính đề nghị các cấp quản lý cho phép tôi được nghỉ không lương.
        </br>Tôi xin chân thành cảm ơn. 
    </div>
     <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta"  color="primary" text-color="white" label="Sửa" />

        </div>
        <div v-else>
           <q-input
        class="q-mt-sm"
        outlined
        v-model="metaValue.kinhGui"
        label="Kính gửi : "
        :readonly="disable"
        />
        <q-input
      class="q-mt-sm"
      outlined
      v-model="userInfo.lastName"
      label="Tên tôi là : "
      :readonly="disable"
    />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="userInfo.account"
        label="Mã nhân viên : "
        :readonly="disable"
        />
        <q-input
        class="q-mt-sm"
        outlined
        v-model="userInfo.position"
        label="Chức vụ : "
        :readonly="disable"
        />
        <q-input
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
          <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">Hôm nay, tôi viết đơn này xin nghỉ không lương từ ngày :</div>
                <div class="">
                  <DxDateBox
                    class="opa_1"
                    :value="order.OrderMeta[0].dateStart"
                    type="datetime"
                  />
                </div>
            </div>
            <div class="col q-pl-sm">
              <div class="text-h8">Thời gian đến :</div>
              <div class="">
                <DxDateBox
                  class="opa_1"
                  :value="order.OrderMeta[0].dateEnd"
                  type="datetime"
                />
              </div>
            </div>
          </div>
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].description"
      label="Lý do : "
      :readonly="disable"
    />
    <div
      class="q-mt-sm"
      outlined
    >Vậy tôi viết đơn này kính đề nghị các cấp quản lý cho phép tôi được nghỉ không lương.
        </br>Tôi xin chân thành cảm ơn. 
    </div>
        </div>
       
    </div>
  </q-card-section>
</template>

<script>
import { mapGetters ,mapActions} from "vuex";
import DxButton from 'devextreme-vue/button';
import DxDateBox from 'devextreme-vue/date-box';
import axios from 'axios';
import { DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup } from 'devextreme-vue/data-grid';
export default {
    components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    DxDateBox
  },
  props: ["metaValue", "disable","order"],
  data(){
      return{
        myDepartment:null,
        stepDepartment:null,
        departments: [],
            events:[],
            options:null,
            nameDepartmentName:null,
            account:[],
            active:false
      }
  },
  async created(){
    let data = await this.GET_DEPARTMENTSALL();
    console.log('dataa',data)
    let account2 = await this.GET_ACCOUNTS();
    console.log('account2',account2)
    await account2.data.forEach(element => {
      this.account.push({
        value: element.id,
        label:"Mã NV: " + element.account + " - " + element.lastName,
        position: element.position,
        departmentId : element.departmentId
      });
    });
         console.log('account',this.account)
    // this.loadDepartment()
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.userInfo.department);
    await data.forEach(element => {
      this.departments.push({
        value: element.ID,
        label: element.NAME
      });
    });
    console.log('options',this.departments)
    
  },
  methods:{
    async loadData(id) {
      let data = null;
      try {
        data = await this.getOneOrder(id);
      } catch (error) {
        console.log(error);
      }

      if (!data)
        this.$router.push({
          path: "/tao-de-xuat"
        });
      this.order = data.data.data;
      console.log(data);
    },
   async changed(){
     
         console.log('changed')
      console.log('this.order.OrderMeta[0].position2 ',this.order.OrderMeta[0].position2 )
      console.log('this.metaValue.account2.id',this.metaValue.accountName)
        this.order.OrderMeta[0].position2 = this.metaValue.accountName.position
        let department222 = await this.GET_DEPARTMENTSBYID(this.metaValue.accountName.departmentId);
        console.log('department2',department222)
        this.order.OrderMeta[0].department2 = department222.NAME
        },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.account
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.account.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    ...mapActions("base",["GET_DEPARTMENTSBYID","GET_DEPARTMENTSALL","GET_ACCOUNTS"]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta","deleteOrderMeta","updateOrderMeta"]),
    ...mapActions("requests", ["deleteRequest","resetOrder"]),
    chonCongDoan(){
     console.log('myDepartment',this.myDepartment.value)
    },
    async loadDepartment() {
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS", {
        factoryId: this.myFactoryInfor.id
      });
      console.log('data',data.data)
      await data.data.forEach(e =>{
         this.departments.push({
           id: e.id,
           value: e.name
         })
      });
      console.log('this.departments',this.departments)
    },
    async updatedOrderMeta() {
      // this.active = false;
      //  this.disable = !this.disable;
         if(this.metaValue.selection == 'Xin nghỉ việc(kết thúc hợp đồng lao động)'){
          console.log('this.metaValue.account2.id',this.metaValue.accountName)
          let fullName = this.userInfo.lastName
          let selection = this.metaValue.selection
          let position = this.userInfo.position
          let maNV = this.userInfo.account
          let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
          let lyDo = this.order.OrderMeta[0].description
                  let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME

          await this.updateOrderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,selection,position,maNV,
            dateStart,lyDo,department
          })
          await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();
        }else if(this.metaValue.selection == 'Xin nghỉ không lương'){
           console.log('this.metaValue.account2.id',this.metaValue.accountName)
          let fullName = this.userInfo.lastName
          let selection = this.metaValue.selection
          let position = this.userInfo.position
          let maNV = this.userInfo.account
          let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
          let dateEnd = this.order.OrderMeta[0].dateEnd == null ? " " :this.order.OrderMeta[0].dateEnd
          let lyDo = this.order.OrderMeta[0].description
                  let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME

          await this.updateOrderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,selection,position,maNV,dateEnd,
            dateStart,lyDo,department
          });
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();
        }else if(this.metaValue.selection == 'Xin nghỉ Thai sản'){
           console.log('this.metaValue.account2.id',this.metaValue.accountName)
          let fullName = this.userInfo.lastName
          let selection = this.metaValue.selection
          let position = this.userInfo.position
          let maNV = this.userInfo.account
          let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
          let thoiGianMangThai = this.metaValue.thoiGianMangThai
                  let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME

          await this.updateOrderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,selection,position,maNV,thoiGianMangThai,
            dateStart,department
          });
          await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();
        }
        else{
          console.log('this.metaValue.account2.id',this.metaValue.accountName)
        let fullName = this.userInfo.lastName
        let fullName2 = this.metaValue.accountName.label == undefined ? ' ' : this.metaValue.accountName.label
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let maNV = this.userInfo.account
        let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
        let dateEnd = this.order.OrderMeta[0].dateEnd == null ? " " :this.order.OrderMeta[0].dateEnd
        let lyDo = this.order.OrderMeta[0].description == null ? " " : this.order.OrderMeta[0].description
        let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME

        let department2 = this.order.OrderMeta[0].department2 != null ? this.order.OrderMeta[0].department2 : ' ';
        let position2 = this.order.OrderMeta[0].position2 != null ? this.order.OrderMeta[0].position2 : ' ';
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,fullName2,selection,position,maNV,dateEnd,
          dateStart,lyDo,department2,position2,department
        });
          await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();
        }     
    }
  },
  computed: {
    
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["myFactoryInfor","userInfo","dsCongDoans"])
  },
   watch: {
     
    disable(newValue) {
      if (newValue) {
        if(this.metaValue.selection == 'Xin nghỉ việc(kết thúc hợp đồng lao động)'){
          console.log('this.metaValue.account2.id',this.metaValue.accountName)
          let fullName = this.userInfo.lastName
          let selection = this.metaValue.selection
          let position = this.userInfo.position
          let maNV = this.userInfo.account
          let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
          let lyDo = this.order.OrderMeta[0].description
                  let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME

          this.updateOrderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,selection,position,maNV,
            dateStart,lyDo,department
          })
        }else if(this.metaValue.selection == 'Xin nghỉ không lương'){
           console.log('this.metaValue.account2.id',this.metaValue.accountName)
          let fullName = this.userInfo.lastName
          let selection = this.metaValue.selection
          let position = this.userInfo.position
          let maNV = this.userInfo.account
          let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
          let dateEnd = this.order.OrderMeta[0].dateEnd == null ? " " :this.order.OrderMeta[0].dateEnd
          let lyDo = this.order.OrderMeta[0].description
                  let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME

          this.updateOrderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,selection,position,maNV,dateEnd,
            dateStart,lyDo,department
          })
        }else if(this.metaValue.selection == 'Xin nghỉ Thai sản'){
           console.log('this.metaValue.account2.id',this.metaValue.accountName)
          let fullName = this.userInfo.lastName
          let selection = this.metaValue.selection
          let position = this.userInfo.position
          let maNV = this.userInfo.account
          let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
          let thoiGianMangThai = this.metaValue.thoiGianMangThai
                  let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME

          this.updateOrderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,selection,position,maNV,thoiGianMangThai,
            dateStart,department
          })
        }
        else{
          console.log('this.metaValue.account2.id',this.metaValue.accountName)
        let fullName = this.userInfo.lastName
        let fullName2 = this.metaValue.accountName.label == undefined ? ' ' : this.metaValue.accountName.label
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let maNV = this.userInfo.account
        let dateStart = this.order.OrderMeta[0].dateStart == null ? " " :this.order.OrderMeta[0].dateStart
        let dateEnd = this.order.OrderMeta[0].dateEnd == null ? " " :this.order.OrderMeta[0].dateEnd
        let lyDo = this.order.OrderMeta[0].description == null ? " " : this.order.OrderMeta[0].description
        let department = this.nameDepartmentName.NAME == null ? " " : this.nameDepartmentName.NAME

        let department2 = this.order.OrderMeta[0].department2 != null ? this.order.OrderMeta[0].department2 : ' ';
        let position2 = this.order.OrderMeta[0].position2 != null ? this.order.OrderMeta[0].position2 : ' ';
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,fullName2,selection,position,maNV,dateEnd,
          dateStart,lyDo,department2,position2,department
        })
        }
        
       
      }
    }
  }
};
</script>
<style scoped>
.dx-texteditor.dx-editor-outlined.dx-state-disabled .dx-texteditor-input
{color: rgba(0,0,0,1) !important;}
</style>
