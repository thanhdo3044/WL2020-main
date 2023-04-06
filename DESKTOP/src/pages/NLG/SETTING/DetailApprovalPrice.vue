<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-12 top-title">Phê duyệt yêu cầu số {{no}}</div>
        </div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <div class="row">
          <div class="col-12 col-sm-6 q-pa-md">
              Chi tiết yêu cầu 
              <br>
            <DxDataGrid
              :data-source="dataSource"
              :show-borders="true"
              :no-data-text="'Không có dữ liệu !'"
              :show-column-lines="true"
              :allow-column-resizing="true"
            >
              <DxColumn data-field="maSP" caption="Mã sản phẩm" />
              <DxColumn
                data-field="giacu"
                caption="Giá cũ"
                data-type="number"
                format="fixedpoint"
              />
              <DxColumn
                data-field="COST"
                caption="Giá mới"
                data-type="number"
                format="fixedpoint"
              />
             
            </DxDataGrid>
          </div>
          <div class="col-12 col-sm-6 q-pa-md" v-show="showApproval">
            <div class="row">
              <div class="col-12">
                  <DateBox :value="date" :onChange="chonNgay"  :displayFormat="'dd/MM/yyyy'" :title="'Ngày áp dụng '"/>
                  <br>
                  ghi chú
                <q-input v-model="note" outlined type="textarea" />
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-12" align="right">
                <q-btn class="q-mr-sm" color="green" icon="check" label="Duyệt" @click="approval" />
                <q-btn class="q-ml-sm" color="red" icon="close" label="Từ chối" @click="reject" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
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
  DxEditing,
  DxRequiredRule,
  DxExport,
  DxHeaderFilter,
  DxSummary,
  DxGroupItem,
  DxTotalItem,
  DxLookup
} from "devextreme-vue/data-grid";
import DateBox from '../../../components/commons/DateBox'
import { showNotifySuccess, showNotifyError, formatDateISO } from '../../../ultils';
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxEditing,
    DxRequiredRule,
    DxExport,
    DxHeaderFilter,
    DxSummary,
    DxGroupItem,
    DxTotalItem,
    DxLookup,
    DateBox
  },
  data() {
    return {
      dataSource: [],
      no: "",
      note: "",
      date:'',
      showApproval:false,
      dataReq:{}
    };
  },
  created() {
    // this.load();
    Promise.all([this.loadReq(),this.load()])
  },
  methods: {
    chonNgay(e){
        this.date= e.value
    },
    approval() {
      if (this.date) {
        const payload = {
            no:this.$route.params.no,
            approvalType:'Y',
            uid:this.$store.state.base.userInfo.id,
            date:formatDateISO(this.date)
        }
        this.send(payload)
      }
       else {
            showNotifyError("Vui lòng nhập ngày áp dụng!");
          }
    },
    async send(payload){
        const data = await this.$store.dispatch('nlg/APPROVAL_PRICE',payload)
        if (data.meta.success) {
            showNotifySuccess()
            this.$router.go(-1)
        }else{
            showNotifyError()
        }
    },
    async loadReq(){
        const data = await this.$store.dispatch('nlg/GET_REQ_COST_BY_NO',this.$route.params.no)
        this.dataReq = data.data[0]
       console.log(this.dataReq)
        if (this.dataReq.approval.trim()==='P') {
            this.showApproval = true
        }
    },
    reject() {
        const payload = {
            uid:this.$store.state.base.userInfo.id,
            approvalType:'N',
            no:this.$route.params.no,
            date:formatDateISO(this.date)
        }
        this.send(payload)
    },
    async load() {
      this.no = this.$route.params.no;
      const data = await this.$store.dispatch(
        "nlg/GET_BANG_GIA_BY_REQ_NO",
        this.$route.params.no
      );
      this.dataSource = data.data;
    }
  }
};
</script>

<style>
</style>