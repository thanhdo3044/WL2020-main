<template>
  <q-page class="q-pa-md">
      <div class="row justify-center">
          <div class="col-8 col-sm-6 prodTextTitle">
              Bảng giá chờ duyệt
          </div>
          <!-- <div class="col-2" align="right">
              <q-btn v-show="showApproval" @click="confirm_approval=true" icon="check" color="primary" glossy label="Duyệt" />
          </div>
          <div class="col-2" align="right">
              <q-btn  v-show="showApproval" @click="confirm_reject = true" icon="close" color="amber" glossy label="Từ chối" />
          </div> -->
      </div>
      <div class="row justify-center q-mt-md">
          <div class="col-12 col-sm-8">
             <q-card class="my-card">
                 <q-card-section>
                     <div class="text-h6">Yêu cầu phê duyệt số {{info.ID}}</div>
                     <div class="text-subtitle2">{{info.CREATED_AT}}</div>
                 </q-card-section>
                 <q-card-section>
                      <DxPivotGrid
                id="pivotgrid"
                ref="grid"
                :data-source="dataSource"
                
                :allow-filtering="true"
                :show-borders="true"
                :show-column-grand-totals="false"
                :show-row-grand-totals="false"
                :show-row-totals="false"
                :show-column-totals="false"
                >
                <!-- <DxFieldChooser
                    :enabled="true"
                    :height="400"
                /> -->
                </DxPivotGrid>
                <q-separator spaced />
                <h5>Lý do cập nhật : </h5>
                <p>{{info.REQ_NOTE}}</p>
                 </q-card-section>
             </q-card>
          </div>
          <div class="col-12 col-sm-3 q-ml-sm">
              <q-card class="my-card">
                  <q-card-section>
                      <div class="text-h6">Phê duyệt</div>
                  </q-card-section>
                  <q-card-section>
                      <p class="woodText">Ngày Áp dụng</p>
                     <q-input filled v-model="approvalDate" mask="date" :rules="['date']">
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="approvalDate" @input="() => $refs.qDateProxy.hide()" />
                        </q-popup-proxy>
                        </q-icon>
                    </template>
                    </q-input>
                    <p class="woodText">Lý do</p>
                    <q-input
                        v-model="app_reason"
                        filled
                        type="textarea"
                        />
                    <div class="row q-mt-sm" >
                        <div class="col-6">
                            <q-btn  v-show="showApproval" @click="confirm_reject = true"  color="amber" glossy label="Từ chối" />
                        </div>
                        <div class="col-6" align="right">
                            <q-btn v-show="showApproval" @click="confirm_approval=true"  color="primary" glossy label="Duyệt" />
                        </div>
                    </div>
                  </q-card-section>
              </q-card>
          </div>
      </div>
       <q-dialog v-model="confirm_approval" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Bạn đã chắc chắn !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" @click="approval_confirm" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirm_reject" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Bạn đã chắc chắn !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" @click="approval_reject" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  DxPivotGrid,
  DxFieldChooser
} from 'devextreme-vue/pivot-grid';
import { date, QSpinnerIos } from 'quasar'
export default {
    components: {
        DxPivotGrid,
        DxFieldChooser
    },
    data() {
        return {
            dataPrices:[],
            dataSource:[],
            confirm_reject:false,
            confirm_approval:false,
            info: {},
            showApproval : false,
            approvalDate:'',
            app_reason:''
        }
    },
    created() {
        let newDate = new Date()
        let fDateFormat = date.formatDate(newDate,'YYYY/MM/DD')
        this.approvalDate = fDateFormat
      

        let reqId = this.$route.params.id
        this.initData(reqId)
        
    },
    methods: {
        approval_confirm(){
            this.approval(1)
        },
        approval_reject(){
            this.approval(2)
        },
        async approval(appStatus){
            let payload = {
                reqId: this.$route.params.id,
                status: appStatus,
                approvalDate:this.approvalDate,
                approvalReson:this.app_reason
            }
            let data = await this.$store.dispatch('nlvan/APPROVAL_PRICE',payload)
            if (data.meta.success===true) {
                this.$q.notify({
                    message:'Phê duyệt thành công !',
                    color:'green'
                })
                this.$route.go(-1)
            }else {
                this.$q.notify({
                     message:data.meta.messages.message,
                    color:'red'
                })
            }
        },
        async initData(id){
            let data = await this.$store.dispatch('nlvan/GET_PRICE_BY_REQID',id)
            this.dataPrices =data.data.detail
            this.info = data.data.info
            if (this.info.APPROVAL_STATUS===0) {
                this.showApproval = true
            }
            let source = {
                fields: [{
                    caption: 'ITYPE',
                    width: 120,
                    dataField: 'ITYPE',
                    area: 'row',
                    expanded: true,
                }, {
                    caption: 'ITEM_NAME',
                    dataField: 'ITEM_NAME',
                    area: 'row',
                    width: 150,
                    expanded: true,
                }, {
                    dataField: 'WTYPE_NAME',
                    area: 'column',
                    expanded: true,
                }, {
                    dataField: 'DTYPE_NAME',
                    area: 'column',
                    expanded: true,
                }, {
                    caption: 'ĐG Hiện tại',
                    dataField: 'CUR_PRICE',
                    dataType: 'number',
                    summaryType: 'sum',
                    area: 'data',
                    format:"fixedPoint"
                },
                {
                    caption: 'ĐG mới',
                    dataField: 'PRICE',
                    dataType: 'number',
                    summaryType: 'sum',
                    area: 'data',
                    format:"fixedPoint"
                }],
                store: data.data.detail
            }
            this.dataSource = source
        }
    }
}
</script>

<style>

</style>