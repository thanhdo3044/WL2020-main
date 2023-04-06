<template>
<q-page class="bg-blue-grey-7" style="min-height:700px">
<div >
    <!-- <div v-for="(request,index) in requestsTodo.data" :key="index">
        <div @click="pushList(request)">
            {{request.id}}
        </div>
    </div> -->
    <div class="bg-amber-2 q-mt-sm text-h6  text-center" style="padding:12px">
      Ủy quyền phê duyệt
    </div>

    <div class="q-ma-sm">
      <q-select
      dark
      label-color="amber"
        class="q-mt-sm"
        label="Người được ủy quyền"
        transition-show="flip-up"
        transition-hide="flip-down"
        filled
        v-model="authority"
        :readonly="statusAuthority"
        :options="listAuthority"
        v-if="statusAuthority == false"
        style="width: 100%"
      />
      <q-input
      dark
      label-color="amber"
        v-if="statusAuthority == false"
        class="q-mt-sm"
        filled
        v-model="timeStartAuthority"
        label="Ủy quyền từ ngày : "
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date dark v-model="timeStartAuthority" mask="DD-MM-YYYY">
                <div class="row items-start justify-start">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
      label-color="amber"
      dark
        v-if="statusAuthority == false"
        class="q-mt-sm"
        filled
        v-model="timeEndAuthority"
        label="Ủy quyền đến ngày : "
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date dark v-model="timeEndAuthority" mask="DD-MM-YYYY">
                <div class="row items-start justify-start">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div
        style="padding:5px; border-radius:5px"
        class="bg-primary text-white  q-mt-sm row"
      >
        <div class=" text-center" style="align-item:center;font-size:18px">
          Danh sách phiếu có thể ủy quyền :
        </div>
      </div>
      <q-card class="q-pa-sm q-mb-sm q-mt-sm bg-blue-grey-7">
        <q-tree
        dark
          class="col-12 col-sm-6"
          :nodes="customize"
          node-key="label"
          tick-strategy="leaf"
          :ticked.sync="ticked"
          :expanded.sync="expanded"
        >
          <template v-slot:default-header="prop">
            <div class="row items-center">
              <div class="text-weight-bold text-white q-ml-sm">
                {{ prop.node.label }}
              </div>
            </div>
          </template>
          <template v-slot:body-story="prop">
            <span class="text-weight-thin">The story is:</span>
            {{ prop.node.story }}
          </template>

          <template v-slot:body-toggle="prop">
            <p class="text-caption">{{ prop.node.caption }}</p>
            <q-toggle
              v-model="prop.node.enabled"
              label="I agree to the terms and conditions"
            />
          </template>
        </q-tree>
        <div class="text-white">Phiếu đã chọn : {{ ticked }}</div>
      </q-card>
      <q-btn class="q-mt-sm bg-primary text-white shadow-8" @click="check"
        >Xác nhận</q-btn
      >
      <q-btn
        class="q-mt-sm q-ml-sm bg-primary text-white shadow-8"
        @click="dialogHistory = true"
        >Lịch sử ủy quyền</q-btn
      >
      <q-dialog
        v-model="dialogHistory"
        style="z-index:1 !important"
        transition-show="rotate"
        transition-hide="rotate"
      >
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div
              class="text-h6 bg-primary text-white shadow-8"
              style="padding:5px; border-radius:5px"
            >
              Lịch sử ủy quyền
            </div>
            <q-space />
            <q-btn
              class="bg-orange text-white"
              size="16px"
              icon="directions"
              push
              round
              dense
              v-close-popup
            />
          </q-card-section>

          <q-card-section>
            <q-list separator>
              <q-item
                class="q-mt-sm bg-cyan-1 shadow-8 text-black"
                v-for="(data, index) in PermissionAuthorised.data.data.filter(
                  e => e.slug
                )"
                :key="index"
              >
                <q-item-section>
                  <b>{{ data.name }}</b
                  ><br />
                  Người Được ủy quyền : <b>{{ data.LAST_NAME }}</b
                  ><br />
                  Từ ngày : {{ data.timeStartAuthority }}<br />
                  Đến ngày : {{ data.timeEndAuthority }}<br />
                  Ngày tạo ủy quyền :
                  {{ moment(data.createdAtAutho).format("l") }}<br />
                </q-item-section>
                <q-item-section side>
                  <q-icon
                    style="padding:5px ; border-radius:50%;font-size:20px"
                    @click="del(data)"
                    class="bg-red shadow-6"
                    push
                    round
                    dense
                    name="delete"
                    color="white"
                  />
                  <q-icon
                    style="padding:5px ; border-radius:50%;font-size:20px"
                    push
                    round
                    dense
                    @click="edit(data)"
                    class="q-mt-lg shadow-6 bg-orange"
                    name="edit"
                    color="white"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <q-dialog
      v-model="dialogEdit"
      style="z-index:999999 !important"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card>
        <q-card-section>
          <q-card-section
            class="bg-primary text-white"
            style="padding:5px ; border-radius:5px;font-size:20px"
          >
            Chỉnh sửa ủy quyền
          </q-card-section>
          <div class="q-mt-sm q-ml-sm text-bold">{{ formDataEdit.name }}</div>
          <q-select
            class="q-mt-sm"
            label="Người được ủy quyền"
            transition-show="flip-up"
            transition-hide="flip-down"
            filled
            v-model="authority"
            :readonly="statusAuthority"
            :options="listAuthority"
            style="width: 100%"
          />
          <q-input
            class="q-mt-sm"
            filled
            v-model="formDataEdit.timeStartAuthority"
            label="Ủy quyền từ ngày : "
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="formDataEdit.timeStartAuthority"
                    mask="DD-MM-YYYY"
                  >
                    <div class="row items-start justify-start">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            class="q-mt-sm"
            filled
            v-model="formDataEdit.timeEndAuthority"
            label="Ủy quyền đến ngày : "
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="formDataEdit.timeEndAuthority"
                    mask="DD-MM-YYYY"
                  >
                    <div class="row items-start justify-start">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn
            v-close-popup
            @click="activeEdit"
            class="q-mt-lg"
            label="Xác nhận"
            color="teal"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</q-page>
  
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { matMenu } from "@quasar/extras/material-icons";
import { uid } from "quasar";
import moment from "moment";
import axios from "axios";
import { Notify, Loading, QSpinnerIos } from "quasar";
// import {
//   DxTreeList,
//   DxColumn,
//   DxSelection,
//   DxSorting
// } from "devextreme-vue/tree-list";

export default {
  methods: {
    ...mapActions("requests", ["getAllRequests"]),
    ...mapActions("base", ["GET_DEPARTMENTSBYID", "getAccountByID"]),
    ...mapActions("requests", [
      "getOneRequest",
      "addRequest",
      "completedRequest",
      "cancelRequest",
      "activeRequestsMeta",
      "completedTimeVT",
      "deleteReqAuthority",
      "isAuthority",
      "permissionAuthorised",
      "getPermissionAuthorised",
      "editPermissionAuthorised",
      "delPermissionAuthorised"
    ]),
    ...mapActions("orders", ["getOneOrder", "sendToApproved", "getAllOrders"]),

    //   menuExpandedRowKeys(e){
    //     console.log('menuExpandedRowKeys',e)
    // },
    //  menuSelectedRowKeys(e){
    //    console.log('menuExpandedRowKeys',e)
    // },
    async del(e) {
      console.log(e);
      let payload = {
        accountId: this.userInfo.id,
        id: e.idAutho
      };
      await this.delPermissionAuthorised(payload);
      this.loadData();
    },
    async edit(e) {
      this.dialogEdit = true;
      console.log(e);
      this.formDataEdit.name = e.name;
      this.formDataEdit.timeStartAuthority = e.timeStartAuthority;
      this.formDataEdit.timeEndAuthority = e.timeEndAuthority;
      this.formDataEdit.accountIdAuthorised = this.authority.value;
      this.formDataEdit.id = e.idAutho;
    },
    async activeEdit() {
      let payload = {
        accountIdAuthorised: this.authority.value,
        timeEndAuthority: this.formDataEdit.timeEndAuthority,
        timeStartAuthority: this.formDataEdit.timeStartAuthority,
        id: this.formDataEdit.id,
        accountId: this.userInfo.id
      };
      console.log("payloadActive", payload);
      if (payload.accountIdAuthorised != null) {
        await this.editPermissionAuthorised(payload);
        await this.loadData();
      } else {
        Notify.create({
          type: "negative",
          message: "Vui lòng chọn người được ủy quyền!"
        });
      }
    },
    async checkAllReq(value, evt) {
      console.log("value", value);
      if (value) {
        console.log("listReq", this.listReq);
      }
    },
    async getAccount(id) {
      let dataAccount = await this.getAccountByID(id);
      return dataAccount;
    },
    async check() {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn thực sự muốn Ủy quyền?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(async () => {
          if (this.authority.value == null) {
            console.log("menuSelectedRowKeys", this.menuSelectedRowKeys);
            Notify.create({
              type: "negative",
              message: "Vui lòng chọn người được ủy quyền!"
            });
          } else {
            console.log("listReq", this.listReq);
            console.log("menuSelectedRowKeys", this.menuSelectedRowKeys);
            let payload = {
              id: this.userInfo.id,
              permissonAuthorised: []
            };
            let dataPush = [];
            console.log("this.listParentNS", this.listParentNS);
            for (let i = 0; i < this.listParentNS.length; i++) {
              if (this.listParentNS[i].label == this.ticked[i]) {
                dataPush.push({
                  id: this.listParentNS[i].id
                });
              }
            }
            this.ticked.filter(e => {
              this.listParentVT.filter(el => {
                if (e == el.label) {
                  dataPush.push({
                    id: el.id
                  });
                }
              });
              this.listParentBuyItem.filter(el => {
                if (e == el.label) {
                  dataPush.push({
                    id: el.id
                  });
                }
              });
              this.listParentOutGate.filter(el => {
                if (e == el.label) {
                  dataPush.push({
                    id: el.id
                  });
                }
              });
            });
            console.log("dataPush", dataPush);
            await dataPush.forEach(e => {
              console.log("e", e);
              payload.permissonAuthorised.push({
                timeStartAuthority: this.timeStartAuthority,
                timeEndAuthority: this.timeEndAuthority,
                accountIdAuthorised: this.authority.value,
                accountId: this.userInfo.id,
                idProposalForm: e.id
              });
            });
            console.log("payload", payload);
            let dataIns = await this.permissionAuthorised(payload);
            await this.loadData();
          }
        });
    },
    async loadData() {
      this.listAuthority = [];
      let GET_DEPARTMENTSBYID = await this.GET_DEPARTMENTSBYID(
        this.userInfo.departmentId
      );
      let dataAccount2 = await this.getAccountByID(
        GET_DEPARTMENTSBYID.accountId1
      );
      let dataAccount3 = await this.getAccountByID(
        GET_DEPARTMENTSBYID.accountId2
      );
      console.log("dataAccount2", dataAccount2);
      console.log("dataAccount3", dataAccount3);
      this.listAuthority.push(
        {
          label:
            dataAccount2 == undefined ? " " : dataAccount2.LAST_NAME,
          value: dataAccount2 == undefined ? " " : dataAccount2.ID
        },
        {
          label:
            dataAccount3 == undefined ? " " : dataAccount3.LAST_NAME,
          value: dataAccount3 == undefined ? " " : dataAccount3.ID
        }
      );

      console.log("listAuthority", this.listAuthority);
      console.log("requests", this.request);
      this.getAllRequests(this.userInfo.id);
      this.selectedRowKeys = [];
      this.dataOrder = await this.getAllOrders(this.userInfo.id);
      const { data } = await axios.get(
        "/api/v2/accountForm?accountId=" + this.userInfo.id
      );
      this.dSBieuMauSuDung = data.data;
      console.log("this.dSBieuMauSuDung");
      console.log(this.dSBieuMauSuDung);
      console.log("orderdsdsd", this.orders);
      this.PermissionAuthorised = await this.getPermissionAuthorised(
        this.userInfo.id
      );
      console.log(
        "getPermissionAuthorised",
        this.PermissionAuthorised.data.data
      );
    }
  },
  watch: {
    async result(oldValue, newValue) {
      console.log("newValue", newValue);
    }
  },
  data() {
    return {
      selected: "",
      ticked: [],
      expanded: [],
      customize: [
        {
          label: "Danh sách đề xuất",
          header: "root",
          children: []
        }
      ],
      listParentNS: [], // phòng Nhân sự
      listParentVT: [], // phòng Vật tư
      formDataEdit: {
        name: null,
        id: null,
        accountIdAuthorised: null,
        timeStartAuthority: null,
        timeEndAuthority: null
      },
      dataAccount: null,
      dialogHistory: false,
      PermissionAuthorised: null,
      menuSelectedRowKeys: [],
      menuExpandedRowKeys: [],
      listReq: [],
      dialogEdit: false,
      listRe1q: [],
      result: true,
      dataListAuthority: [],
      nameDepartmentName: null,
      timeVTAccept: null,
      authority: {
        label: null,
        value: null
      }, // người được ủy quyền
      listAuthority: [], // Danh sách người được ủy quyền
      reqAuthority: [],
      statusAuthority: false,
      timeEndAuthority: null,
      timeStartAuthority: null,
      val: null,
      showAddTask: false,
      order: {},
      title: "",
      proposalForms: [],
      ordersData: null,
      dataOrder: null,
      expandedRowKeys: [],
      selectedRowKeys: [],
      dSBieuMauSuDung: null,
      dataListOrder: null,
      dataListOrderOnRq: null,
      isEditSource: false,
      listParentOutGate:[],//parent Ra cổng
      listParentBuyItem:[],//parent mua hàng
    };
  },
  computed: {
    ...mapGetters("requests", ["requestsTodo", "request"]),
    ...mapGetters("base", ["userInfo"]),
    bieuMaus() {
      if (this.dSBieuMauSuDung)
        return this.dSBieuMauSuDung.map(bieuMau =>
          bieuMau.parentId ? bieuMau : { ...bieuMau, parentId: 0 }
        );
      return [];
    }
  },

  components: {
    "approvals-todo": require("components/eofs/Approvals/ApprovalsTodo.vue")
      .default,
    "no-approvals": require("components/eofs/Approvals/NoApprovals.vue").default
    // DxColumn,
    // DxTreeList,
    // DxSelection,
    // DxSorting
  },
  mounted() {
    this.$root.$on("showAddOrder", () => {
      this.showAddTask = true;
    });
    this.proposalForms = this.dSBieuMauSuDung;
  },
  async created() {
    await this.loadData();
    await this.dSBieuMauSuDung.forEach(e => {
      //list phòng nhân sự
      if (e.parentId == 18) {
        this.listParentNS.push({
          label: e.name,
          header: "generic",
          slug: e.slug,
          children:[],
          id: e.id
          // body: "story",
          // story: "Lorem ipsum dolor sit amet."
        });
      }
      if (e.parentId == 1024) {
        this.listParentVT.push({
          label: e.name,
          header: "generic",
          slug: e.slug,
          children:[],
          id: e.id
          // body: "story",
          // story: "Lorem ipsum dolor sit amet."
        });
      }
      if (e.parentId == 15) {
        this.listParentOutGate.push({
          label: e.name,
          header: "generic",
          icon: 'photo',
          slug: e.slug,
          children:[],
          id: e.id
          // body: "story",
          // story: "Lorem ipsum dolor sit amet."
        });
      }
      if (e.parentId == 1028) {
        this.listParentBuyItem.push({
          label: e.name,
          header: "generic",
          icon: 'photo',
          slug: e.slug,
          children:[],
          id: e.id
        });
      }
    });
    console.log("listParentNS", this.listParentNS);
    await this.dSBieuMauSuDung.forEach(async e => {
      //phòng nhân sự
      if (e.parentId == null && e.id == 18) {
        await this.customize[0].children.push({
          label: e.name,
          header: "generic",
          icon: "book",
          children: this.listParentNS
        });
      }
      //phòng vật tư
      if (e.parentId == null && e.id == 1024) {
        await this.customize[0].children.push({
          label: e.name,
          header: "generic",
          icon: "book",
          children: this.listParentVT
        });
      }
    });
    console.log("this.customize", this.customize);
    this.customize[0].children[0].children.forEach(e=>{
      if(e.id == 15){
        this.listParentOutGate.forEach(element =>{
          e.children.push({
              ...element
          })
        })
        console.log('e',e)
      }
      
    })
    this.customize[0].children[1].children.forEach(e=>{
      if(e.id == 1028){
        this.listParentBuyItem.forEach(element =>{
          e.children.push({
              ...element
          })
        })
        console.log('e',e)
      }
      
    })
    console.log('this.customize',this.customize[0].children[0].children)
  }
};
</script>

