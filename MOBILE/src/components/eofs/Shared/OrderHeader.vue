<template>
  <div>
    <q-btn v-go-back.single icon="arrow_back" flat dense label="Quay lại" />
    <q-card class="my-card">
      <q-card-section class="bg-blue-grey text-white">
        <div class="text-h6">{{ order.title }} {{ order.number }}/{{year}}</div>
        <div class="text-subtitle2">
          <!-- NV đề xuất: {{ order.Account.account }} - {{ order.Account.lastName }} -->
        </div>
        <div class="text-subtitle2">
          <!-- Bộ phận làm việc: {{ order.Department.code }} -
          {{ order.Department.name }} -->
        </div>
        <q-badge color="primary">Ngày, giờ tạo đề xuất: {{ moment(order.createdAt).format('DD/MM/YYYY HH:mm') }}</q-badge>
        <div class="text-subtitle2">
          <q-badge :color="order.completed ? 'blue' : 'orange'">{{
            order.status
          }}</q-badge> 
          <q-badge style="margin-left:10px" v-if="order.activeSeen == 1 && order.slug == 'mua-hang'"> Vật tư: Đã xem </q-badge>
          <q-badge style="margin-left:10px" class="bg-orange" v-if="order.activeSeen == 0 && order.slug == 'mua-hang'"> Vật tư: Chưa xem </q-badge>
        </div>
        <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      header-class="text-bold"

      animated
    >
      <q-step
        v-for="(item,key) in order.Requests"
        :key="key"
        :name="item.id"
        :title="getAccountById(item.accountId).lastName"
        icon="settings"
        :caption="item.status == `Đã ký` ? `Đã duyệt : ${item.successRequest == null? '' : item.successRequest}  ${item.timeVTAccept != null ? item.timeVTAccept : ''} ${item.timeVTAcceptEnd !=null ? '--':''}  ${item.timeVTAcceptEnd == null? '' : item.timeVTAcceptEnd} ` : 'Chưa duyệt'"
        :done="item.status == 'Đã ký'"
      >
     
      </q-step>

      <!-- <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
      </q-step>

      <q-step
        :name="3"
        title="Ad template"
        icon="assignment"
        disable
      >
      </q-step>
 -->
      <!-- <q-step
        :name="4"
        title="Create an ad"
        icon="add_comment"
      >
        Try out different ad text to see what brings in the most customers, and learn how to
        enhance your ads using features like ad extensions. If you run into any problems with
        your ads, find out how to tell if they're running and how to resolve approval issues.
      </q-step> -->

      <!-- <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </template> -->
    </q-stepper>
      </q-card-section>
      
    </q-card>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';
import moment from 'moment';
export default {
  props: ["order"],
  data(){
    return{
      data:null,
      year:null,
      step:null
    }
  },
  computed:{
    ...mapGetters("orders", ["getAccountById", "accounts"]),
  },
  methods:{
    ...mapActions("base", ["GET_DEPARTMENTSBYID", "GET_DEPARTMENTSALL", "getAccountByID"]),
  },
  created(){
    console.log('order',this.order.Requests)
    this.data = this.order;
    console.log('this.data',this.data)
    this.year = moment().year()
  }
};
</script>