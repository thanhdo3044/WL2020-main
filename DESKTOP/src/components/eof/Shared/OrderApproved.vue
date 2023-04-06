<template>
  <div>
    <q-card class="my-card" v-if="!requests.length">
      <q-card-actions class="q-mt-lg">
        <q-btn @click="promptToApproved" color="teal" dense>
          <q-icon left size="3em" name="send" />
          <div>Gửi phê duyệt
          </div>
        </q-btn>
      </q-card-actions>
    </q-card>
    <div v-else class="q-pa-md print">
      <q-markup-table separator="none" flat bordered>
        <thead>
          <tr>
            <th class="text-center">Người đề xuất</th>
            <th
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Người làm thay'"
            >
              {{ request.position }}
            </th>
            <th
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Người nhận bàn giao'"
            >
              {{ request.position }}
            </th>
            <th
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng bộ phận'"
            >
              {{ request.position }}
            </th>
            <th
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng phòng bộ phận chuyển đến'"
            >
              {{ request.position }}
            </th>
            <th
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng phòng hành chính'"
            >
              {{ request.position }}
            </th>
            <th
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng phòng nhân sự'"
            >
              {{ request.position }}
            </th>
            <th
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'GĐSX'"
            >
              {{ request.position }}
            </th>
            <th
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Ban TGĐ'"
            >
              {{ request.position }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center"
            style="padding-left:100px">
              <img width="300" height="115" v-bind:src="'/statics/' + order.accountId +'.png'"/>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              
              v-if="request.position == 'Người làm thay'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
              <div v-else style="padding-left:100px">
                <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              
              v-if="request.position == 'Người nhận bàn giao'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
              <div v-else style="padding-left:100px">
                <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              
              v-if="request.position == 'Trưởng bộ phận'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
              <div v-else style="padding-left:100px">
                <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>

            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng phòng bộ phận chuyển đến'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
              <div v-else style="padding-left:100px">
                <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              
              v-if="request.position == 'Trưởng phòng hành chính'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
              <div v-else style="padding-left:100px">
                <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              
              v-if="request.position == 'Trưởng phòng nhân sự'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
              <div v-else style="padding-left:100px">
                <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              
              v-if="request.position == 'GĐSX'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
              <div v-else style="padding-left:100px">
                <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              
              v-if="request.position == 'Ban TGĐ'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
              <div v-else style="padding-left:100px">
                <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>
          </tr>
          <tr>
            <td class="text-center q-ma-lg">{{ accountName.LAST_NAME }}
                                        </br><b>SĐT : </b>{{userInfo.PHONE}}</td>

            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Người làm thay'"
            >
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div v-else-if="request.status == 'Không'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else-if="request.status == 'Quá hạn'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else>
                {{ getAccountById(request.accountId).lastName }}
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Người nhận bàn giao'"
            >
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div v-else-if="request.status == 'Không'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else-if="request.status == 'Quá hạn'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else>
                {{ getAccountById(request.accountId).lastName }}
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng bộ phận'"
            >
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div v-else-if="request.status == 'Không'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else-if="request.status == 'Quá hạn'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else>
                {{ getAccountById(request.accountId).lastName }}
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng phòng bộ phận chuyển đến'"
            >
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div v-else-if="request.status == 'Không'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else-if="request.status == 'Quá hạn'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else>
                {{ getAccountById(request.accountId).lastName }}
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng phòng hành chính'"
            >
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div v-else-if="request.status == 'Không'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else-if="request.status == 'Quá hạn'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else>
                {{ getAccountById(request.accountId).lastName }}
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng phòng nhân sự'"
            >
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div v-else-if="request.status == 'Không'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else-if="request.status == 'Quá hạn'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else>
                {{ getAccountById(request.accountId).lastName }}
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'GĐSX'"
            >
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div v-else-if="request.status == 'Không'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else-if="request.status == 'Quá hạn'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else>
                {{ getAccountById(request.accountId).lastName }}
              </div>
            </td>
            <td
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Ban TGĐ'"
            >
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div v-else-if="request.status == 'Không'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else-if="request.status == 'Quá hạn'">
                {{ getAccountById(request.accountId).lastName }}
              </div>
              <div v-else>
                {{ getAccountById(request.accountId).lastName }}
              </div>
            </td>
            
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { uid } from "quasar";
import axios from 'axios';
import {derNMTH} from "../../../ultils/derNMTH";
export default {
  props: ["order","metaValue","model"],
  data() {
    return {
      data:{
        image:'~assets/Vũ Hải Bằng.png'
      },
      requests: [],
      lastName:[],
      result:null,
      step: 0,
      accountName: null,
      stepDepartment1:null
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo", "myFactoryInfor", "dSNhanVien"]),
    ...mapGetters("ordersm", ["getAccountById","accounts"]),
  },
  async created(){
    console.log('model',this.model);
    console.log('this.order.Department.id',this.order)
    console.log('this.order.Department.id',this.metaValue)
    this.accountName = await this.getAccountByID(this.order.accountId)
    // let data2 = await this.GET_DEPARTMENTSALL();
    //       console.log('data2',data2) 
    // let data3 =  data2.find(e =>  e.NAME == 'Phòng Nhân Sự'
    // )
    // console.log('data3',data3)
  },
   methods: {
     ...mapActions("base",["GET_DEPARTMENTSBYID","GET_DEPARTMENTSALL","getAccountByID"]),
    ...mapActions("orders", ["sendToApproved"]),
    //  async loadLastName(id){
    //     let result;
    //     await axios.get('http://localhost:1010/api/v1/account?accountId=' + id )
    //         .then(res => this.lastName = res.data.data)
    //         console.log(this.lastName)
    // },
    async taoDSKy() {
      console.log('this.order',this.order)
      console.log('this.order',this.metaValue)
      console.log('model',this.model);
      // console.log('this.order.Department.id',this.metaValue.selection)
      //Nếu trình ký thì tạo danh sách trình ký
      if (!this.requests.length) {
        
        let departmentId = await this.GET_DEPARTMENTSBYID(this.order.departmentId)
        let newRequests = [];
        let newRequest = {
          id: uid(),
          parentId: null,
          accountId: departmentId.accountId,
          fromAccountId: this.order.accountId,
          orderId: this.order.id,
          departmentId: this.order.departmentId,
          factoryId: this.order.factoryId,
          title: [
            this.order.title,
            this.order.number + "/2020/TH"
          ].join(" "),
          status: "Chưa ký",
          name: "test",
          position: "Trưởng bộ phận",
          showMessages: true,
          isDisable: false,
          completed: false,
          slug:this.order.slug,
          star: 4,
          show:false,
          step:null
        };
        await newRequests.push(newRequest);

        //phân quyền trưởng bộ phận chuyển đến  -- created by HTHIEU(27/11/2020)
        if(newRequest.slug != 'bien-ban-ban-giao' 
          && newRequest.slug != 'xac-nhan-cong'
          && newRequest.slug != 'sua-chua'){
          if(!this.metaValue.stepDepartment){
            this.stepDepartment1 = "";
          }else{
              this.stepDepartment1 = this.metaValue.stepDepartment.value
          }
        }
        if(this.stepDepartment1 != null && newRequest.slug == 'chuyen-nhan-vien' 
        &&  this.metaValue.selection == 'Điều chuyển cá nhân'){
          let data = await this.GET_DEPARTMENTSBYID(this.metaValue.stepDepartment.value)
          console.log('data',data);
          newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountId: data.accountId,
              star: 5,
              show:false,
              step:null,
              position: "Trưởng phòng bộ phận chuyển đến"
            };
            await newRequests.push(newRequest);
        }
        // end...............

        //Phân quyền người nhận bàn giao : created by : HTHIEU 27/11/2020
            if(newRequest.slug == 'bien-ban-ban-giao' ){
              newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountId: this.metaValue.accountName.value,
              star: 1,
              show:false,
              step:null,
              position: "Người nhận bàn giao"
            };
            await newRequests.push(newRequest);
            }

        //end......................
        
        //Phân quyền người làm thay :  created by : HTHIEU(27/11/2020)
        if( 
           this.metaValue.selection == 'Nghỉ việc riêng có hưởng lương'
           || this.metaValue.selection == 'Nghỉ phép'
           || this.metaValue.selection == 'Nghỉ ốm'
           ){
          // let data = await this.GET_DEPARTMENTSBYID(this.metaValue.stepDepartment.value)
          // console.log('data',data);
          let accountId;
          console.log('this.metaValue.accountName.value',this.metaValue.accountName)
          if(!this.metaValue.accountName){
             accountId = '';
          }else{
            accountId =this.metaValue.accountName.value
          }
          newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              star:1,
              show:false,
              step:null,
              accountId: accountId,
              position: "Người làm thay"
            };
            await newRequests.push(newRequest);
        }
        //end...............
  


        //phần quyền trưởng phòng nhân sự - created by : HTHIEU(27/11/2020)
         if(newRequest.slug == 'chuyen-nhan-vien'
         || newRequest.slug == 'di-cong-tac'
            || newRequest.slug == 'de-nghi-luong' 
            || newRequest.slug == 'xin-ra-cong' 
         || (newRequest.slug == 'xin-nghi-viec' 
            && this.metaValue.selection != 'Xin nghỉ không lương' )   
            || newRequest.slug == 'xac-nhan-cong' 
        
         ){
          let departmentAll = await this.GET_DEPARTMENTSALL();
          console.log('data2',departmentAll) 
          let departmentNS =  departmentAll.find(e =>  e.NAME == 'Phòng nhân sự'
          )
          console.log('data3',departmentNS)
          newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              star:6,
              show:false,
              step:null,
              accountId: departmentNS.accountId,
              position: "Trưởng phòng nhân sự"
            };
            await newRequests.push(newRequest);
        }
        
              
        //phân quyền trưởng phòng hành chính - created by : HTHIEU(27/11/2020)
          if(newRequest.slug == 'van-phong-pham'
          ||newRequest.slug == 'cap-bao-ho-lao-dong'){
             let departmentAll = await this.GET_DEPARTMENTSALL();
              console.log('data2',departmentAll) 
              let departmentHC =  departmentAll.find(e =>  e.NAME == 'Phòng Hành Chính'
              )
              console.log('data3',departmentHC)
             newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              star:5,
              show:false,
              step:null,
              accountId: departmentHC.accountId,
              position: "Trưởng phòng hành chính"
            };
            await newRequests.push(newRequest);
          }
        //end..............................

        console.log('this.order.Department.id',this.order.departmentId)
        // phân quyền ban TGĐ - created by : HTHIEU(27/11/2020)
        if(   
              //Nhà máy thuận hưng 
               this.order.departmentId == derNMTH.Xưởng1
            || this.order.departmentId == derNMTH.Xưởng2
            || this.order.departmentId == derNMTH.Xưởng3
            || this.order.departmentId == derNMTH.XưởngSLP
            || this.order.departmentId == derNMTH.Khophôi
            || this.order.departmentId == derNMTH.Khothànhphẩm
            || this.order.departmentId == derNMTH.Container
            || this.order.departmentId == derNMTH.TổLựaphôi //phong it
            || this.order.departmentId == derNMTH.TổSấyphôi //phong it


            || this.order.departmentId == derNMTH.QC
            || this.order.departmentId == derNMTH.LựaphôiX1
            || this.order.departmentId == derNMTH.VGTIndoorX1
            || this.order.departmentId == derNMTH.Tinhchế1X1
            || this.order.departmentId == derNMTH.Tinhchế2X1
            || this.order.departmentId == derNMTH.HTM1X1
            || this.order.departmentId == derNMTH.Sơn1X2
            || this.order.departmentId == derNMTH.Đónggói1X2
            || this.order.departmentId == derNMTH.HTM2X1
            || this.order.departmentId == derNMTH.Sơn2X2
            || this.order.departmentId == derNMTH.Đónggói2X2
            || this.order.departmentId == derNMTH.LựaphôiX3
            || this.order.departmentId == derNMTH.HTMX3
            || this.order.departmentId == derNMTH.SơchếX3
            || this.order.departmentId == derNMTH.HTDX3
            || this.order.departmentId == derNMTH.VGTIndoorX3
            || this.order.departmentId == derNMTH.SơnX3
            || this.order.departmentId == derNMTH.Tinhchế1X3
            || this.order.departmentId == derNMTH.Tinhchế2X3
            || this.order.departmentId == derNMTH.ĐónggóiX3
            || this.order.departmentId == derNMTH.VáSửahàngTinhchế1X3
            || this.order.departmentId == derNMTH.VGTNộiđịaX1
            || this.order.departmentId == derNMTH.VGTNộiđịaX3
            || this.order.departmentId == derNMTH.Xếpsấy
            || this.order.departmentId == derNMTH.Sấy
            || this.order.departmentId == derNMTH.Cắt
            || this.order.departmentId == derNMTH.GhépngangVGTX3

            //end nhà máy thuận hưng

            || this.order.departmentId == 102304 //phòng kế hoạch
            || this.order.departmentId == 102291 //phòng IT

            
        ){
            if(
            newRequest.slug == 'dang-ky-xe'
            || newRequest.slug == 'di-cong-tac'
            || newRequest.slug == 'de-nghi-luong' 
            || newRequest.slug == 'tuyen-nhan-vien'
            || newRequest.slug == 'chuyen-nhan-vien'
            || (newRequest.slug == 'mua-hang' 
              && this.metaValue.selection == 'Đề xuất mua hàng')
            || (newRequest.slug == 'vat-tu' 
              && this.metaValue.selection == 'Đề xuất cấp vật tư')
            || this.metaValue.selection == 'Xin nghỉ việc(kết thúc hợp đồng lao động)'
            || this.metaValue.selection == 'Xin nghỉ không lương'
            || this.metaValue.selection == 'cap-bao-ho-lao-dong'
            && newRequest.slug != 'xac-nhan-cong'
            && newRequest.slug != 'xin-ra-cong'
            || newRequest.slug == 'sua-chua'
          ){
          console.log('GĐ Bằng')
              newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              star:7,
              show:false,
              step:null,
              accountId: 101653,
              position: "Ban TGĐ"
            };
            await newRequests.push(newRequest);
          }
        
        }

        // Trần thị Thu Hàn ban TGĐ -- created by : HTHIEU(27/11/2020)
       if(
          this.order.departmentId == 102314 // dự án nội địa DA -NM Nam Hồng

          
          ){
            if(
            newRequest.slug == 'dang-ky-xe' 
            || newRequest.slug == 'di-cong-tac'
            // || newRequest.slug == 'de-nghi-luong' 
            || newRequest.slug == 'tuyen-nhan-vien'
            || newRequest.slug == 'chuyen-nhan-vien'
            || (newRequest.slug == 'mua-hang' 
              && this.metaValue.selection == 'Đề xuất mua hàng')
            || (newRequest.slug == 'vat-tu' 
              && this.metaValue.selection == 'Đề xuất cấp vật tư')
            || this.metaValue.selection == 'Xin nghỉ việc(kết thúc hợp đồng lao động)'
            || this.metaValue.selection == 'Xin nghỉ không lương'
            || this.metaValue.selection == 'cap-bao-ho-lao-dong'
          ){
          console.log('ban TGĐ')
              newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              star:7,
              show:false,
              step:null,
              accountId: 101678,
              position: "Ban TGĐ"
            };
            await newRequests.push(newRequest);
          }
        //   if(
        //   newRequest.slug == 'chuyen-nhan-vien'
        // ){
        //  console.log('')
        //     newRequest = await {
        //     ...newRequest,
        //     parentId: newRequest.id,
        //     id: uid(),
        //     accountId: 101653,
        //     position: "CBQL"
        //   };
        //   await newRequests.push(newRequest);
        // }
        }
        
        //Chữ ký Ban lãnh đạo
        
        // hàm sắp tăng dần theo phân cấp -- created by : HTHIEU(27/11/2020)
        newRequests.sort(this.compareValues('star','asc'))
        let a = null;
        
        //hàm xử lý hiển thị cho người cấp thấp nhất 
        for(let i = 0 ; i <  newRequests.length ; i++){
          console.log(newRequests)
          if( i == 0){
            newRequests[i].show = true;
            newRequests[i].step = i;
          }else newRequests[i].step = i;
        }
        console.log('newRequests',newRequests);
        this.requests = newRequests;
      }
    },
    // hàm sắp xếp động -- created by : HTHIEU(27/11/2020) 
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
    promptToApproved() {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn muốn gửi phê duyệt?",
          ok: {
            push: true
          },
          cancel: {
            color: "green"
          },
          persistent: true
        })
        .onOk(async () => {
          await this.taoDSKy();
          this.sendToApproved(this.requests);
        });
    },
    async loadDSKy() {
      let requests = await [...this.order.Requests];
      this.requests = requests;
    }
  },
  mounted() {
    this.loadDSKy();
  }
};
</script>
