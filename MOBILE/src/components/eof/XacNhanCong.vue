<template>
  <q-card-section>
    <div class="q-gutter-sm text-primary text-h6">
        {{order.proposalFormId == 1042 ? 'Xác nhận công : ' : 'Làm thêm giờ : '}}
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
    </div>
        <div v-if="order.status == 'Không được duyệt'">
          <div  v-for="(task,key) in order.OrderMeta.filter(e => e.maNV)"
            :key="key"
            >
            <q-card class="q-mb-sm q-mt-sm">
            <q-card-section>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.maNV"
                  label="Mã nhân viên :"
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col "
                  outlined
                  v-model="task.fullName"
                  label="Họ và tên : "
                  :readonly="!disable" >
                </q-input>
              </div>
               <div class="row">
                <q-input
                class="q-mt-sm col q-mr-sm"
                outlined
                v-model="userInfo.position"
                label="Chức danh : "
                :readonly="disable"
              />
                  <q-input
                    class="q-mt-sm col"
                    outlined
                    v-model="nameDepartmentName.NAME"
                    label="Phòng ban/bộ phận : "
                    :readonly="disable"/>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.date"
                  label="Ngày xác nhận :"
                  fill-mask 
                  mask="##-##-####"
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col"
                  outlined
                  v-if="order.proposalFormId != 1042"
                  v-model="task.work"
                  label="Công việc : "
                  :readonly="!disable" >
                </q-input>
                <q-select class="q-mt-sm col"
                  outlined
                  v-if="order.proposalFormId == 1042"
                  :options="optionError"
                  v-model="task.work"
                  label="Công việc : "
                  :readonly="!disable" >
                </q-select>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursIn"
                  label="Thời gian từ :"
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursOut"
                  label="Thời gian đến : "
                  :readonly="!disable" >
                </q-input>
                <!-- <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.total"
                  v-if="order.proposalFormId == 1042"
                  label="Biển số xe : "
                  :readonly="!disable" >
                </q-input> -->
                <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.total"
                  v-if="order.proposalFormId != 1042"
                  label="Tổng số giờ : "
                  :readonly="!disable" >
                </q-input>
              </div>
              <div class="row">
                <div class="col">
                  <q-input
                  v-model="task.statusRequests "
                  class="q-mt-sm col"
                  outlined
                  label="Trạng thái phê duyệt : "
                  :readonly="true"
                  />
                  
                </div>
              </div>
              <q-btn class="q-mt-sm"  v-on:click="actEdit(task)" color="primary" text-color="white" label="Sửa" />
              <q-btn class="q-mt-sm q-ml-sm" v-on:click="RowDelted(task)" color="orange" text-color="white" label="Xóa" />

            </q-card-section>
            </q-card>
          </div>
        <q-btn class="q-mt-sm q-mr-sm" v-show="disable" v-on:click="initNewRow(task)" color="primary" text-color="white" label="Thêm" />
        <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Hoàn thành" />

        </div>
        <div v-else>
          <q-btn class="q-mt-sm" v-show="!disable" v-on:click="initNewRow(task)" color="primary" text-color="white" label="Thêm" />
          <div  v-for="(task,key) in order.OrderMeta.filter(e => e.maNV)"
            :key="key"
            >
            <q-card class="q-mb-sm q-mt-sm">
            <q-card-section>
              
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.maNV"
                  label="Mã nhân viên :"
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col "
                  outlined
                  v-model="task.fullName"
                  label="Họ và tên : "
                  :readonly="disable" >
                </q-input>
              </div>
               <div class="row">
                <q-input
                class="q-mt-sm col q-mr-sm"
                outlined
                v-model="userInfo.position"
                label="Chức danh : "
                :readonly="disable"
              />
                  <q-input
                    class="q-mt-sm col"
                    outlined
                    v-model="nameDepartmentName.NAME"
                    label="Phòng ban/bộ phận : "
                    :readonly="disable"/>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.date"
                  label="Ngày xác nhận :"
                  fill-mask 
                  mask="##-##-####"
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col"
                  outlined
                  v-if="order.proposalFormId != 1042"
                  v-model="task.work"
                  label="Công việc : "
                  :readonly="disable" >
                </q-input>
                <q-select class="q-mt-sm col"
                  outlined
                  v-if="order.proposalFormId == 1042"
                  :options="optionError"
                  v-model="task.work"
                  label="Công việc : "
                  :readonly="!disable" >
                </q-select>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursIn"
                  label="Thời gian từ :"
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursOut"
                   v-if="order.proposalFormId != 1042"
                  label="Thời gian đến : "
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col "
                  outlined
                  v-model="task.hoursOut"
                  v-if="order.proposalFormId == 1042"
                  label="Thời gian đến : "
                  :readonly="disable" >
                </q-input>
                <!-- <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.total"
                  v-if="order.proposalFormId == 1042"
                  label="Biển số xe : "
                  :readonly="!disable" >
                </q-input> -->
                <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.total"
                  v-if="order.proposalFormId != 1042"
                  label="Tổng số giờ : "
                  :readonly="disable" >
                </q-input>
              </div>
              <div class="row">
                  <q-input
                  v-model="task.statusRequests"
                  class="q-mt-sm col"
                  outlined
                  label="Trạng thái phê duyệt : "
                  :readonly="true"
                  />
              </div>
              <q-btn class="q-mt-sm" v-if="(order.Requests.length == 0 && task.statusRequests == 'Xem xét')  || task.statusRequests == 'Hủy'" v-on:click="actEdit(task)" color="primary" text-color="white" label="Sửa" />
              <q-btn class="q-mt-sm q-ml-sm" v-if="(order.Requests.length == 0 && task.statusRequests == 'Xem xét')  || task.statusRequests == 'Hủy'" v-on:click="RowDelted(task)" color="orange" text-color="white" label="Xóa" />
            </q-card-section>
            </q-card>
          </div>
        </div>
      
      <!-- </div> -->
    <div v-if="metaValue.selection == 'Lỗi chấm công'">
     <div v-if="order.status =='Không được duyệt'">
    
     <q-btn class="q-mt-sm" v-show="!disable" v-on:click="initNewRow(task)" color="primary" text-color="white" label="Thêm" />
          <div  v-for="(task,key) in order.OrderMeta.filter(e => e.maNV)"
            :key="key"
            >
            <q-card class="q-mb-sm q-mt-sm">
            <q-card-section>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.maNV"
                  label="Mã nhân viên :"
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col "
                  outlined
                  v-model="task.fullName"
                  label="Họ và tên : "
                  :readonly="!disable" >
                </q-input>
              </div>
               <div class="row">
                <q-input
                class="q-mt-sm col q-mr-sm"
                outlined
                v-model="userInfo.position"
                label="Chức danh : "
                :readonly="disable"
              />
                  <q-input
                    class="q-mt-sm col"
                    outlined
                    v-model="nameDepartmentName.NAME"
                    label="Phòng ban/bộ phận : "
                    :readonly="disable"/>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.date"
                  label="Ngày xác nhận :"
                  fill-mask 
                  mask="##-##-####"
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col"
                  outlined
                  v-if="order.proposalFormId != 1042"
                  v-model="task.work"
                  label="Công việc : "
                  :readonly="!disable" >
                </q-input>
                <q-select class="q-mt-sm col"
                  outlined
                  v-if="order.proposalFormId == 1042"
                  :options="optionError"
                  v-model="task.work"
                  label="Công việc : "
                  :readonly="!disable" >
                </q-select>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursIn"
                  label="Thời gian từ :"
                  :readonly="!disable" >
                </q-input>
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursOut"
                  label="Thời gian đến : "
                  :readonly="!disable" >
                </q-input>
                <!-- <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.total"
                  v-if="order.proposalFormId == 1042"
                  label="Biển số xe : "
                  :readonly="!disable" >
                </q-input> -->
                <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.total"
                  v-if="order.proposalFormId != 1042"
                  label="Tổng số giờ : "
                  :readonly="!disable" >
                </q-input>
              </div>
              <q-btn class="q-mt-sm" v-on:click="actEdit(task)" color="primary" text-color="white" label="Sửa" />
              <q-btn class="q-mt-sm q-ml-sm" v-on:click="RowDelted(task)" color="orange" text-color="white" label="Xóa" />

            </q-card-section>
            </q-card>
          </div>
        <q-btn class="q-mt-sm q-mr-sm" v-show="disable" v-on:click="initNewRow(task)" color="primary" text-color="white" label="Thêm" />
        <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Hoàn thành" />

     </div>
     <div v-else>
      <q-btn class="q-mt-sm" v-show="!disable" v-on:click="initNewRow(task)" color="primary" text-color="white" label="Thêm" />
          <div  v-for="(task,key) in order.OrderMeta.filter(e => e.maNV).sort(a => a.createdAt)"
            :key="key"
            >
            <q-card class="q-mb-sm q-mt-sm">
            <q-card-section>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm col"
                  outlined
                  v-model="task.maNV"
                  label="Mã nhân viên :"
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col "
                  outlined
                  v-model="task.fullName"
                  label="Họ và tên : "
                  :readonly="disable" >
                </q-input>
              </div>
              <div class="row">
                <q-input
                class="q-mt-sm col q-mr-sm"
                outlined
                v-model="userInfo.position"
                label="Chức danh : "
                :readonly="disable"
              />
                  <q-input
                    class="q-mt-sm col"
                    outlined
                    v-model="nameDepartmentName.NAME"
                    label="Phòng ban/bộ phận : "
                    :readonly="disable"/>
              </div>

              
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.date"
                  label="Ngày xác nhận :"
                  fill-mask 
                  mask="##-##-####"
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col"
                  outlined
                  v-if="order.proposalFormId != 1042"
                  v-model="task.work"
                  label="Công việc : "
                  :readonly="disable" >
                </q-input>
                <q-select class="q-mt-sm q-pb-sm"
                  outlined
                  v-if="order.proposalFormId == 1042"
                  :options="optionError"
                  v-model="task.work"
                  label="Nội dung xác nhận : "
                  :readonly="!disable" >
                </q-select>
              </div>
              <div class="row">
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursIn"
                  label="Thời gian từ :"
                  :readonly="disable" >
                </q-input>
                <q-input class="q-mt-sm col q-pr-sm"
                  outlined
                  v-model="task.hoursOut"
                  label="Thời gian đến : "
                  :readonly="disable" >
                </q-input>
                <!-- <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.total"
                  v-if="order.proposalFormId == 1042"
                  label="Biển số xe : "
                  :readonly="!disable" >
                </q-input> -->
                <q-input class="q-mt-sm col"
                  outlined
                  v-model="task.total"
                  v-if="order.proposalFormId != 1042"
                  label="Tổng số giờ : "
                  :readonly="disable" >
                </q-input>
              </div>

            </q-card-section>
            </q-card>
          </div>
     </div>
      
    </div>
    <q-dialog v-model="active" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-black" style="width: auto">
        <q-card-section>
          <div class="text-h6 bg-primary text-center q-pa-sm text-white shadow-5" style="border-radius:5px">Thêm dữ liệu</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
        <q-input
             
              class="q-mt-sm q-pb-sm"
              outlined
              v-if="order.proposalFormId != 1042"
              v-model="order.OrderMeta[0].work"
              label="Công việc: "
              :readonly="false"
        />
        <q-select class="q-mt-sm q-pb-sm"
                  outlined
                  v-if="order.proposalFormId == 1042"
                  :options="optionError"
                  v-model="order.OrderMeta[0].work"
                  label="Nội dung xác nhận : "
                  :readonly="disable" >
                </q-select>
        <div class="col ">
          <div class="text-h8"></div>
        <q-input label="Ngày xác nhận :" filled v-model="order.OrderMeta[0].date" fill-mask 
                  mask="##-##-####">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date  mask="DD-MM-YYYY" v-model="order.OrderMeta[0].date" @input="onChange">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col ">
          <q-input label="Giờ vào :" class="q-mt-sm" filled v-model="order.OrderMeta[0].hoursIn" mask="time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="order.OrderMeta[0].hoursIn"  format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col ">
          <q-input label="Giờ ra :" filled v-model="order.OrderMeta[0].hoursOut" mask="time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="order.OrderMeta[0].hoursOut"  
                   
                    format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <!-- <q-input
              style=""
              class=""
              outlined
              v-if="order.proposalFormId == 1042"
              v-model="licensePlates"
              label="Biển số xe : "
              :readonly="false"
            /> -->
        <q-input
              style=""
              class=""
              outlined
              v-if="order.proposalFormId != 1042"
              v-model="totaHours"
              label="Tổng số giờ : "
              :readonly="true"
            />
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn  color="primary" push class="bg-primary text-white" text="white" label="Lưu" no-caps  v-close-popup @click="RowInserted"/>
           <q-btn push color="red" class="bg-red text-white" label="Quay lại"  no-caps v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="activeEdit" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-black" style="width: auto">
        <q-card-section>
          <div class="text-h6 bg-primary text-center text-white q-pa-sm  shadow-5" style="border-radius:5px">Sửa dữ liệu</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
        <q-input
             
              class="q-mt-sm "
              outlined
              v-if="order.proposalFormId != 1042"
              v-model="modelEdit.work"
              label="Công việc: "
              :readonly="false"
        />
        <q-select class="q-mt-sm q-pb-sm"
                  outlined
                  v-if="order.proposalFormId == 1042"
                  :options="optionError"
                  v-model="modelEdit.work"
                  label="Nội dung xác nhận : "
                  :readonly="disable" >
                </q-select>
        <div class="col q-mt-sm">
          <div class="text-h8"></div>
          <q-input label="Ngày xác nhận :" filled v-model="modelEdit.date" fill-mask 
                  mask="##-##-####">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date mask="DD-MM-YYYY" v-model="modelEdit.date" @input="onChange">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col q-mt-sm">
          <div class="text-h8"></div>
          <q-input label="Giờ vào :" filled v-model="modelEdit.timeIn" mask="time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="modelEdit.timeIn" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col ">
          <div class="text-h8"></div>
          <q-input label="Giờ ra :" filled v-model="modelEdit.timeOut"  mask="time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="modelEdit.timeOut"  format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <!-- <q-input
              style=""
              class=""
              outlined
              v-if="order.proposalFormId == 1042"
              v-model="modelEdit.licensePlates"
              label="Biển số xe : "
              :readonly="false"
            /> -->
        <q-input
              class=""
              outlined
              v-if="order.proposalFormId != 1042"
              v-model="totaHoursUpd"
              label="Tổng số giờ : "
              :readonly="true"
            />
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn  color="primary" push class="bg-primary text-white" text="white" label="Lưu" no-caps  v-close-popup @click="RowUpdated"/>
           <q-btn push color="red" class="bg-red text-white" label="Quay lại"  no-caps v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import { Notify, Loading, QSpinnerIos } from "quasar";
import moment from "moment";
export default {
  props: ["metaValue", "disable", "order"],
  async created() {
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(
      this.userInfo.department
    );
    console.log("this.nameDepartmentName", this.nameDepartmentName.NAME);
    this.status = this.$route.query.status;
    console.log("status", this.status);
    console.log("dsCongDoans", this.dsCongDoans);
    console.log("userInfo", this.userInfo);

    if (this.$route.query.id) {
      this.getOneOrder(this.$route.query.id).then((res) => {
        if (res.data.data.Requests.length) this.disable = true;
        this.metaValue = Object.assign(
          this.metaValue,
          JSON.parse(res.data.data.OrderMeta[0].metaValue)[0]
        );
      });
    } else {
      this.$router.push({
        path: "/tao-de-xuat",
      });
    }
    let account2 = await this.GET_ACCOUNTS();
    console.log("account2", account2);
    await account2.data.forEach((element) => {
      this.account.push({
        value: element.id,
        accountCode: element.account,
        label: element.account,
        name: element.lastName,
        position: element.position,
        departmentId: element.departmentId,
      });
    });
    console.log("account", this.account);
    await this.loadData(this.$route.query.id);
  },
  data() {
    return {
      events: [],
      nameDepartment: {},
      status: "",
      phoneNumber: "",
      nameDepartmentName: null,
      active: false,
      options: null,
      account: [],
      accountName: "",
      totalHours: 0,
      totalHoursUpd: 0,
      activeEdit: false,
      licensePlates: "",
      modelEdit: {
        date: null,
        work: null,
        timeIn: null,
        timeOut: null,
        totalHours: null,
        licensePlates: "",
        id: null,
        maNV: null,
      },
      optionError: [
        {
          label: "Thiếu giờ vào/ra",
          id: 1,
        },
        {
          label: "Không có giờ vào/ra",
          id: 2,
        },
      ],
    };
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    // ...mapActions("base",["GET_DEPARTMENTSBYID"]),
    ...mapGetters("base", ["userInfo"]),
    totaHours() {
      this.totalHours = moment
        .utc(
          moment(this.order.OrderMeta[0].hoursOut, " HH:mm").diff(
            moment(this.order.OrderMeta[0].hoursIn, "HH:mm")
          )
        )
        .format("HH:mm");
      console.log(this.order.OrderMeta[0].hoursIn);
      console.log(this.order.OrderMeta[0].hoursOut);
      console.log("totalHours", this.totalHours);
      return this.totalHours;
    },
    totaHoursUpd() {
      this.totalHoursUpd = moment
        .utc(
          moment(this.modelEdit.timeOut, " HH:mm").diff(
            moment(this.modelEdit.timeIn, "HH:mm")
          )
        )
        .format("HH:mm");
      console.log("totalHours", this.totalHoursUpd);
      return this.totalHoursUpd;
    },
  },
  methods: {
    ...mapActions("base", [
      "GET_DEPARTMENTSBYID",
      "GET_DEPARTMENTSALL",
      "GET_ACCOUNTS",
    ]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMeta",
    ]),
    ...mapActions("requests", ["deleteRequest", "resetOrder"]),

    async changed() {
      console.log("changed");
      this.order.OrderMeta[0].fullName = this.accountName.name;
      this.order.OrderMeta[0].position2 = this.accountName.position;
      let department222 = await this.GET_DEPARTMENTSBYID(
        this.accountName.departmentId
      );
      console.log("department2", department222);
      this.order.OrderMeta[0].department2 = department222.NAME;
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.options = this.account;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = this.account.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    async loadData(id) {
      let data = null;
      try {
        data = await this.getOneOrder(id);
      } catch (error) {
        console.log(error);
      }

      if (!data)
        this.$router.push({
          path: "/tao-de-xuat",
        });
      this.order.OrderMeta = data.data.data.OrderMeta;
      console.log(data);
    },
    initNewRow() {
      console.log("init");
      this.active = true;
    },
    async actEdit(task) {
      console.log("task", task);
      this.modelEdit.date = task.date;
      this.modelEdit.timeIn = task.hoursIn;
      this.modelEdit.timeOut = task.hoursOut;
      this.modelEdit.totalHoursUpd = task.total;
      this.modelEdit.work = task.work;
      this.modelEdit.id = task.id;
      this.modelEdit.maNV = task.maNV;
      this.modelEdit.licensePlates = task.total;
      this.activeEdit = true;
    },
    async onChange(value) {
      if (value < moment().format("DD-MM-YYYY")) {
        this.$q.notify({
          message: "Ngày không hợp lệ",
          color: "red",
        });
      }
    },
    async RowInserted() {
      if (this.order.OrderMeta[0].date < moment().format("DD-MM-YYYY")) {
        this.$q.notify({
          message: "Lỗi ngày đăng ký",
          caption: "Ngày đăng ký không được nhỏ hơn ngày hiện tại",
          position: "center",
          color: "red",
        });
        return;
      }
      this.active = false;
      if (this.metaValue.selection == "Làm thêm giờ") {
    
        let fullName = this.userInfo.lastName;
        let position = this.userInfo.position;
        let department = this.nameDepartmentName.NAME;
        let phoneNumber = this.userInfo.PHONE;
        let selection = "Làm thêm giờ";
        let work = this.order.OrderMeta[0].work;
        let maNV = this.userInfo.account;
        let hoursIn = this.order.OrderMeta[0].hoursIn;
        let hoursOut = this.order.OrderMeta[0].hoursOut;
        let total = this.totalHours;
        let date = this.order.OrderMeta[0].date;
        let statusRequests = "Xem xét";
        if (date == null || hoursIn ==null || hoursOut == null ) {
          Notify.create({
            message: "Vui lòng nhập ngày đăng kí hoặc giờ vào giờ ra!",
            color: "red",
          });
              
        } else {
          await this.addorderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,
            phoneNumber,
            selection,
            work,
            hoursIn,
            hoursOut,
            date,
            maNV,
            total,
            department,
            position,
            statusRequests,
          });
          await this.loadData(this.$route.query.id);
        }
      } else {
        let fullName = this.userInfo.lastName;
        let position = this.userInfo.position;
        let phoneNumber = this.userInfo.PHONE;
        let department = this.nameDepartmentName.NAME;
        let selection =
          this.order.proposalFormId == 1042 ? "Xác nhận công" : "Làm thêm giờ";
        let work =
          this.order.proposalFormId == 1042
            ? this.order.OrderMeta[0].work.label
            : this.order.OrderMeta[0].work;
        let maNV = this.userInfo.account;
        let hoursIn = this.order.OrderMeta[0].hoursIn;
        let hoursOut = this.order.OrderMeta[0].hoursOut;
        let total = this.totalHours;
        let date = this.order.OrderMeta[0].date;
        let statusRequests = "Xem xét";
        if (date == null || hoursIn == null || hoursOut == null) {
          Notify.create({
            message: "Vui lòng nhập ngày đăng kí hoặc ngày giờ vào ra !",
            color: "red",
          });
        } else {
          await this.addorderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,
            phoneNumber,
            selection,
            work,
            hoursIn,
            hoursOut,
            date,
            maNV,
            total,
            department,
            position,
            statusRequests,
          });
          await this.loadData(this.$route.query.id);
        }
      }
    },
    async RowDelted(e) {
      console.log("STT", e.id);
      await this.deleteOrderMeta(e.id);
      await this.loadData(this.$route.query.id);
    },
    async RowUpdated() {
      if (this.modelEdit.date < moment().format("DD-MM-YYYY")) {
        this.$q.notify({
          message: "Lỗi ngày đăng ký",
          caption: "Ngày đăng ký không được nhỏ hơn ngày hiện tại",
          position: "center",
          color: "red",
        });
        return;
      }
      if (this.metaValue.selection == "Làm thêm giờ") {
        let fullName = this.userInfo.lastName;
        let position = this.userInfo.position;
        let department = this.nameDepartmentName.NAME;
        let phoneNumber = this.userInfo.PHONE;
        let selection = "Làm thêm giờ";
        let work = this.modelEdit.work;
        let hoursIn = this.modelEdit.timeIn;
        let hoursOut = this.modelEdit.timeOut;
        let total = this.totalHoursUpd;
        let maNV = this.modelEdit.maNV;
        let date = this.modelEdit.date;
        let id = this.modelEdit.id;
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,
          phoneNumber,
          selection,
          work,
          hoursIn,
          hoursOut,
          date,
          maNV,
          id,
          position,
          department,
          total,
        });
        await this.loadData(this.$route.query.id);
      } else {
        let fullName = this.userInfo.lastName;
        let position = this.userInfo.position;
        let department = this.nameDepartmentName.NAME;
        let phoneNumber = this.userInfo.PHONE;
        let selection =
          this.order.proposalFormId == 1042 ? "Xác nhận công" : "Làm thêm giờ";
        let work =
          this.order.proposalFormId == 1042
            ? this.modelEdit.work.label
            : this.modelEdit.work;
        let hoursIn = this.modelEdit.timeIn;
        let hoursOut = this.modelEdit.timeOut;
        let total = this.modelEdit.licensePlates;
        let maNV = this.modelEdit.maNV;
        let date = this.modelEdit.date;
        let id = this.modelEdit.id;
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,
          phoneNumber,
          selection,
          work,
          hoursIn,
          hoursOut,
          date,
          maNV,
          id,
          position,
          department,
          total,
        });
        await this.loadData(this.$route.query.id);
      }
    },
    async updatedOrderMeta() {
      if (this.metaValue.selection == "Làm thêm giờ") {
        let fullName = this.userInfo.lastName;
        let position = this.userInfo.position;
        let phoneNumber = this.userInfo.PHONE;
        let department = this.nameDepartmentName.NAME;
        let selection = "Làm thêm giờ";
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,
          phoneNumber,
          selection,
          position,
          department,
        });
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
        await this.deleteRequest(this.order.id);
        location.reload();
      } else {
        let fullName = this.userInfo.lastName;
        let phoneNumber = this.userInfo.PHONE;
        let position = this.userInfo.position;
        let department = this.nameDepartmentName.NAME;
        let selection = "Làm thêm giờ";
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,
          phoneNumber,
          position,
          department,
          selection,
        });
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
        await this.deleteRequest(this.order.id);
        location.reload();
      }
    },
    //  initNewRow({ data }) {
    //   console.log('vao initNewRow')
    //   Object.assign(data, {
    //     STT: this.order.OrderMeta.length + 1,

    //   });
    // },
  },
};
</script>
<style scoped>
.dx-overlay-wrapper.dx-dropdowneditor-overlay.dx-popup-wrapper.dx-datebox-wrapper.dx-datebox-wrapper-time.dx-datebox-wrapper-list {
  z-index: 99999 !important;
}
</style>
