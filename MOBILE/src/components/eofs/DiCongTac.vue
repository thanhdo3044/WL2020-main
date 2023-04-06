<template>
  <q-card-section>
        <div  class="flex">
          <q-input
      class="q-mt-sm q-pr-sm"
      style="width: 50% !important"
      outlined
      v-model="order.OrderMeta[0].fullName"
      label="Tên tôi là : "
      :readonly="disable"
    />
        <q-input
        style="width: 50% !important"
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].maNV"
        label="Mã nhân viên : "
        :readonly="disable"
        />
        </div>
        <div class="flex">
            <q-input
            style="width: 50% !important"
            class="q-mt-sm q-pr-sm"
            outlined
            v-model="order.OrderMeta[0].position"
            label="Chức vụ : "
            :readonly="disable"
            />
            <q-input
            style="width: 50% !important"
            class="q-mt-sm"
            outlined
            v-model="order.OrderMeta[0].department"
            label="Phòng ban/bộ phận : "
            :readonly="disable"/>
        </div>
       <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do đi công tác : "
        :readonly="disable"
        />
            <div class="col">
          <div class="text-h8">Thời gian từ :</div>
          <div class="">
                      <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
      </div>
        <div class="col ">
        <div class="text-h8">Thời gian đến :</div>
        <div class="">
                    <q-input class="q-mb-sm" filled v-model="order.OrderMeta[0].dateEnd">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateEnd" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                  </div>
      </div>
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].locationWork"
        label="Nơi đi công tác : "
        :readonly="disable"
        />
         <footerCard :order="order" :nextId="nextId"></footerCard>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DxDateBox from 'devextreme-vue/date-box';
import footerCard from 'components/eofs/Shared/footerCard'
import DxButton from 'devextreme-vue/button';
import { DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup } from 'devextreme-vue/data-grid';
export default {
    components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup,
    DxDateBox,
    footerCard
  },
  props: ["metaValue", "disable","oneOrder"],
  async created(){
    // this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.order.OrderMeta[0].department);
    this.status = this.$route.query.status;
    console.log('status',this.status)
    console.log('dsCongDoans',this.dsCongDoans)
    console.log('userInfo',this.userInfo)
    // this.nameDepartment = this.dsCongDoans.find(e => e.id ==  this.userInfo.departmentId)
    // console.log('a',this.nameDepartment)
    // if (this.$route.query.id) {
    //   this.getOneOrder(this.$route.query.id).then(res => {
    //     if (res.data.data.Requests.length) this.disable = true;
    //     this.metaValue = Object.assign(
    //       this.metaValue,
    //       JSON.parse(res.data.data.OrderMeta[0].metaValue)[0]
    //     );
    //   });
    // } else {
    //   this.$router.push({
    //     path: "/tao-de-xuat"
    //   });
    // }
     this.status = this.$route.query.status;
    console.log("status", this.status);
    console.log("dsCongDoans", this.dsCongDoans);
    console.log("userInfo", this.userInfo);
    this.order.Requests.sort(this.compareValues('star','asc'))
    let idDis= null;
    for(let i = 0 ; i<this.order.Requests.length ; i++){
      if(this.order.Requests[i].id == this.$route.query.id){
        console.log(this.order.Requests[i])
        idDis = this.order.Requests[i].star
         console.log('idDis',idDis)
      }
    }
    this.nextId = this.order.Requests.find(
      e=> e.star > idDis
    )
    console.log('data',this.nextId)
  },
  data(){
      return{            
            events:[],
            nameDepartment: {},
            status:"",
            phoneNumber:"",
            nameDepartmentName:null,
            nextId:null
      }
  },computed:{
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["userInfo","dsCongDoans"]),
  },
  methods:{
    compareValues(key,order='asc'){
      return function(a, b) {
        if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // nếu không tồn tại
          return 0;
        }

        const varA = (typeof a[key] === 'string') ?
          a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
          b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return (
          (order == 'desc') ? (comparison * -1) : comparison
        );
      };
    },
    ...mapActions("base",["GET_DEPARTMENTSBYID"]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta","deleteOrderMeta","updateOrderMeta"]),
  }
};
</script>
