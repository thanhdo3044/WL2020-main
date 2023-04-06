<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-sm-6">
        <q-card class="q-pa-md">
          <div class="row">
            <div class="col-12">
              <p class="prodTextTitle">Kiểm tra thông tin pallet</p>
            </div>
          </div>
          <div class="row">
            <div class="col-8 q-pa-xs">
              <q-input ref="self1" @clear="clearCode"  clearable  outlined v-model.number="palletCode" label="Số pallet" />
            </div>
            <div v-if="showButtonCheck" class="col-4 q-pa-xs">
              <q-btn
                class="full-width"
                @click="check"
                style="height: 100%;"
                label="Kiểm tra"
                stack
                glossy
                color="blue"
              />
            </div>
            <div v-else class="col-4 q-pa-sm justify-center">
              <q-spinner-ios color="primary" size="4em" />
            </div>
          </div>
        </q-card>
      </div>
    </div>
    <div v-if="showFakeKeyboard" class="row justify-center q-mt-md">
      <div class="col-12 col-sm-6" >
        <div class="row justify-center" style="text-align: center;">
          <div class="col-4 q-ms-sm" v-for="number in 12" :key="number">
            <div v-if="number<10" @click="inputCode(number)" class="fakeKeyboard">{{number}}</div>
            <div v-if="number===11" @click="inputCode(0)" class="fakeKeyboard">0</div>
            <div v-if="number===10" style="min-height:80px"></div>
            <div v-if="number===12" style="background-color:red" @click="clearCode" class="fakeKeyboard">Xóa</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDetail">
      <div class="row justify-center">
        <div class="col-12 col-sm-6">
          <div v-if="showButtonConfirm&&toStep.package.find(pa=>{ return pa.destinationId===toStep.stepNextId}).verifyBy===''" class="row q-ma-sm">
            <q-btn
              class="full-width"
              @click="showDialog=true"
              style="height: 100%;"
              label="Nhận pallet"
              stack
              glossy
              color="secondary"
            />
          </div>
          <div v-else>
            <div v-show="showPendingConfirm" style="text-align: center;" class="col-12 q-pa-sm">
              <q-spinner-ios color="primary" size="4em" />
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="prodTextTitle" style="color:orange">Thông tin pallet {{pallet.code}}</div>
          </div>
          <div class="row mobile-only"  v-if="pallet.item!==undefined&&pallet.item.length>1">
            <div class="col-12 col-md-6 q-mt-md" v-for="item in pallet.item" v-bind:key="item.id">
              <q-card class="my-card" style="min-width:100%">
                <q-card-section>
                  <p class="prodTextTitle">{{ item.name || '????' }}</p>
                  <p class="prodTextTitle">(QC: {{item.height+' '+item.width+' '+item.length}})</p>
                  <div
                    class="text-subtitle2"
                  >Số lượng : {{item.quantity}} ({{item.unit.name||'Thanh'}})</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div v-else class="row justify-center">
            <div class="col-12">
              <q-card class="my-card q-mt-md" style="min-width:100%">
                <q-card-section>
                  <div
                    class="prodTextTitle"
                  >{{ pallet.item[0].name || '????' }} (QC: {{pallet.item[0].height+' '+pallet.item[0].width+' '+pallet.item[0].length}})</div>
                  <div
                    class="text-subtitle2"
                  >Số lượng : {{pallet.inventory}} ({{pallet.item[0].unit.name||'Thanh'}})</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
        
        <div class="col-12 col-sm-6 q-ma-sm">
          <q-card class="my-card q-pa-xs">
            <q-card-section>
              <div class="prodTextTitle">Thông tin các công đoạn đã qua</div>
            </q-card-section>
            <div v-for="(step,index) in pallet.step" :key="step.id">
              <q-item>
                <q-item-section avatar>
                  <div class="row">
                    <div class="col-12">
                      <q-chip>
                        <q-avatar color="blue">{{index+1}}</q-avatar>
                        <div class="prodTextTitle">{{step.stepName}}</div>
                      </q-chip>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-card-section>
                <div class="row">
                  <div class="col-6">
                    <div
                      class="prodTextTitle"
                      style="background-color:#52f783;padding:10px"
                    >SL đạt : {{step.pass}}</div>
                  </div>
                  <div class="col-6">
                    <div
                      class="prodTextTitle"
                      style="background-color:#faa652;padding:10px"
                    >SL lỗi : {{step.notPass}}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">Ngày làm việc : {{step.package[0].createDate}}</div>
                </div>
                <div class="row">
                  <div class="col-12">Người làm : {{step.package[0].createName}}</div>
                </div>
                <div class="row">
                  <div class="col-12">Xuất đến  : {{step.stepNextName}}</div>
                </div>
                <div v-show="step.package[0].verifyName" class="row">
                  <div class="col-12">Nhân bởi   : {{step.package[0].verifyName}}</div>
                </div>
                <div class="row">
                  <div class="col-12">Ngày nhận  : {{step.package[0].verifyDate || 'Chưa nhận'}} </div>
                </div>
              </q-card-section>
              <q-separator />
            </div>
          </q-card>
        </div>
      </div>
    </div>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Bạn đã chắc chắn ? !</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="recive" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import TableCOC from "../../components/prod/TableCOC";
export default {
  components: {
    "table-coc": TableCOC
  },
  data() {
    return {
      palletCode: "",
      showButtonCheck: true,
      pallet: {},
      showDetail: false,
      showButtonConfirm: false,
      mySources: [],
      showDialog: false,
      toStep:{},
      showPendingConfirm:false,
      stepTarget:{},
      path:null,
      showFakeKeyboard:true
    };
  },
  created() {
    const queryPalletCode = this.$route.query.code;
    const pathRedirect = this.$route.query.path
    if (pathRedirect) {
      this.path =pathRedirect
    }
    if (queryPalletCode&&queryPalletCode.length===8) {
      this.palletCode=queryPalletCode
      const payload = {
        token: this.$store.state.production.userInfo.token,
        palletCode: queryPalletCode.trim()
      };
      this.loaData(payload)
    }
    this.mySources = this.$store.getters["production/mySources"];
  },
  methods: {
    clearCode(){
      this.$refs.self1.blur()
      this.showFakeKeyboard = true
      this.palletCode=''
    },
    loaData(payload){
      this.showFakeKeyboard = false
      this.$store
      .dispatch("production/ACTION_GET_DETAIL_PALLET", payload)
      .then(res => {
        if (res.data.meta.success === true) {
          this.pallet = res.data.data;
          this.showButtonCheck = true;
          this.$root.$emit("reload")
          this.showDetail = true;
          let isExist = false;
          const palletToDestiantionId = res.data.data.step.slice(-1).pop();
          this.stepTarget = palletToDestiantionId
          this.toStep = res.data.data.step.slice(-1).pop()
          if (
            this.mySources.findIndex(s => {
              return s.id === palletToDestiantionId.stepNextId;
            }) !== -1
          ) {
            this.showButtonConfirm = true;
            this.showFakeKeyboard = false
          }
        } else {
          this.$q.notify({
            message: res.data.meta.messages.message,
            color: "red"
          });
          this.showButtonCheck = true;
          this.showFakeKeyboard = true
        }
      })
      .catch((err) => {
        this.showButtonCheck = true;
        this.showFakeKeyboard = true
        this.palletCode=''
         this.$q.notify({
            message: 'Không tìm thấy pallet',
            color: "red"
          });
          
      });
    },
    async recive() {
      this.showDialog = false
      this.showButtonConfirm = false
      this.showPendingConfirm = true
      let packageAvailible = this.toStep.package.find(p=>{return p.destinationId==this.stepTarget.stepNextId})
      const payload = {
        token: this.$store.state.production.userInfo.token,
        packageId: packageAvailible.id
      };
      let res = await this.$store.dispatch(
        "production/ACTION_RECIVED_PALLET",
        payload
      );
      if (res.meta.success === true) {
        this.$q.notify({
          message:
            "Đã nhận pallet về công đoạn " +
            this.toStep.stepNextName,
          color: "green"
        });
        this.showPendingConfirm = false;
        if (this.path) {
          this.$router.push('/'+this.path)
        }
      } else {
        this.$q.notify({
          message: res.meta.messages.message,
          color: "red"
        });
        this.showButtonConfirm = true
        this.showPendingConfirm = false;
      }
    },
    inputCode(numb){
      if (this.palletCode===null) {
        this.palletCode=''
      }
      this.palletCode+=numb.toString()
    },
    check() {
      if (this.palletCode.toString().length === 8) {
        this.showButtonCheck = false;
        const payload = {
          token: this.$store.state.production.userInfo.token,
          palletCode: this.palletCode
        };
        this.loaData(payload)
      } else {
        this.$q.notify({
          message: "Số pallet không chính xác !",
          color: "red"
        });
      }
    }
  }
};
</script>

<style>
.fakeKeyboard{
    min-height: 80px;
    border: 2px solid black;
    border-radius: 25px;
    padding: 20px;
    margin: 5px;
    font-size: 25px;
    font-weight: 900;
}
</style>