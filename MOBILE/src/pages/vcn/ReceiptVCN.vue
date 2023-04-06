<template>
  <q-page class="q-pa-sm bg-blue-grey-7">
    <div class="row">
      <app-bar class="text-white">Danh sách các phôi chờ nhận</app-bar>
      <div class="col-12">
        <q-select
        dark
        label-color="amber"
          @input="changeDepartment"
          v-model="department"
          :options="departments"
          label="Chọn công đoạn"
        />
      </div>
      <div class="col-12">
        <q-input
        dark
        label-color="amber"
          class="q-mb-sm"
          outlined
          v-model="searchQuery"
          label="Tìm kiếm"
          dense
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <q-list class="col-12" separator>
        <q-item
          class="q-mt-sm bg-cyan-1 shadow-8 text-black"
          v-for="(item, index) in listRough"
          :key="index"
        >
          <q-item-section>
            <q-item-label>
              <div>
                Tên : <b>{{ item.NAME }}</b>
              </div>
              <div>
                Công đoạn giao : <b>{{ item.SOURCE_ID_NAME }}</b>
              </div>
              <div>
                Quy cách :
                <b>{{ item.LENGTH + "x" + item.WIDTH + "x" + item.HEIGHT }}</b>
              </div>
              <div>
                Số lượng : <b>{{ item.QUANTITY }}</b>
              </div>
              <div>
                <q-badge color="green-4"
                  >Người tạo : {{ item.LAST_NAME }}
                </q-badge>
              </div>
              <div style="color: purple; font-weight: bold">
                Ngày tạo : <b>{{ item.ngay }}</b>
              </div>
              <div style="color: purple; font-weight: bold">
                Thời gian tạo:
                <b
                  >{{ item.giogiao }}:{{ item.phutgiao }}:{{ item.giaygiao }}</b
                >
              </div>
            </q-item-label>
            <q-item-label>
              <q-btn
                v-show="nhanve[index]"
                @click="confirm(item)"
                class="bg-positive"
                no-caps
                label="Xác nhận"
              />
            </q-item-label>
            <q-item-label>
              <hr width="60%" align="center" />
              <div>
                <q-radio
                  @input="nhanvesl(index)"
                  v-model="selectionTT[index]"
                  val="Số lượng chưa chuẩn"
                  label="Số lượng chưa chuẩn"
                  color="red"
                  style="color: orange; font-weight: bold; font-size: 14px"
                />
              </div>
              <div>
                <q-radio
                  @input="nhanvesl(index)"
                  v-model="selectionTT[index]"
                  val="Chất lượng không đạt"
                  label="Chất lượng không đạt"
                  color="red"
                  style="color: orange; font-weight: bold; font-size: 14px"
                />
              </div>
              <div>
                <q-radio
                  @input="nhanvesl(index)"
                  v-model="selectionTT[index]"
                  val="Lý do khác"
                  label="Lý do khác"
                  color="red"
                  style="color: orange; font-weight: bold; font-size: 14px"
                />
              </div>
              <div class="row">
                <div class="col-6" align="center">
                  <q-btn
                    v-show="!nhanve[index]"
                    @click="capnhat(item, index)"
                    class="bg-orange text-white"
                    no-caps
                  >
                    Cập nhật <br />
                    trạng thái
                  </q-btn>
                </div>
                <div class="col-6" align="right">
                  <q-btn
                    style="font-size: 21px"
                    v-show="!nhanve[index]"
                    @click="huy(index)"
                    class="bg-positive text-white"
                    no-caps
                  >
                    Hủy
                  </q-btn>
                </div>
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-dialog
      v-model="activePackage"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Thông báo</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Bạn đã chắc chắn muốn xác nhận !
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Xác nhận" @click="activeSuccess" v-close-popup />
          <q-btn flat label="Thoát" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AppBar from "../../components/AppBar";
import { showNotifySuccess, showNotifyError } from "../../utils/utils";
export default {
  data() {
    return {
      department: null,
      departments: [],
      searchQuery: null,
      nhanve: [],
      selectionTT: [],
      listRough: [],
      dataPackage: null,
      activePackage: false,
    };
  },
  components: {
    "app-bar": AppBar,
  },
  created() {
    this.departments = this.myDepartments.filter(
      (d) => 102451,
      102498,
      102531,
      102744,
      102745
    );
    this.departments.map((element) => {
      element.label = element.name;
      element.value = element.id;
    });
    console.log("this.departments", this.departments);
  },
  computed: {
    ...mapGetters("base", ["myDepartments", "userInfo"]),
  },
  methods: {
    ...mapActions("vcn", [
      "getActivePackage_temp_update_VCN",
      "listPackageRough_temp_status_vcn",
      "listPackageRough_temp_vcn",
      "listPackageRough_temp_del_vcn",
      "addPackageVCN",
    ]),
    changeDepartment() {
      this.loadListPackage();
    },
    async loadListPackage() {
      let i = 0;
      let payload = {
        factoryId: this.department.factoryId,
        DESTINATION_ID: this.department.id,
      };
      this.listRough = await this.listPackageRough_temp_vcn(payload);
      if (this.listRough.length > 0) {
        this.showListPackageRough = true;
        for (i = 0; i < this.listRough.length; i++) this.nhanve[i] = true;
        this.selectionTT[i] = null;
      } else {
        this.showListPackageRough = false;
        this.showDialogRough = false;
      }
    },
    async nhanvesl(i) {
      console.log("sl:", i);
      this.nhanve[i] = false;
    },
    async capnhat(data, i) {
      console.log("data", data);
      let payload1 = {
        id: data.ID,
        verifyBy: this.userInfo.id,
        status: this.selectionTT[i],
      };
      let data2 = await this.getActivePackage_temp_update_VCN(payload1);
      this.selectionTT[i] = null;
      // this.nhanve[i] = true
      await this.loadListPackage();
    },
    async huy(k) {
      //  console.log('sl:',this.nhanve[i])
      this.selectionTT[k] = null;
      //  this.nhanve[k] = true
      await this.loadListPackage();
    },
    async confirm(data) {
      console.log(data);

      this.dataPackage = data;
      this.activePackage = true;
    },
    async activeSuccess() {
      this.showDialogRough = false;
      console.log("dataPackage", this.dataPackage);
      const payload = {
        sourceId: this.dataPackage.SOURCE_ID,
        destinationId: this.dataPackage.DESTINATION_ID,
        itemId: this.dataPackage.ITEM_ID,
        quantity: this.dataPackage.QUANTITY,
        heSo: this.dataPackage.HE_SO,
        typeId: 100026, //100026,//100004
        ID: this.dataPackage.ID,
        po: this.dataPackage.PO,
      };
      console.log("payload : ", payload);
      const data = await this.addPackageVCN(payload);

      if (data.meta.success) {
        showNotifySuccess();
        this.loadListPackage();
      }

      await this.loadListPackage();
      this.dataPackage = null;
      if (this.listRough.length > 0) {
        this.showDialogRough = true;
      }
    },
  },
};
</script>

<style>
</style>