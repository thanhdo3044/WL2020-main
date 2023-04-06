<template>
  <q-markup-table 
  class="q-pt-md col-12" 
  separator="none" 
  flat 
  bordered>
    <thead>
      <tr>
        <th class="text-center">Người đề xuất</th>
        <th
              v-for="request in order.Requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Người làm thay'"
            >
              {{ request.position }}
            </th>
        <th
              v-for="request in order.Requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng bộ phận'"
            >
              {{ request.position }}
            </th>
            <th
              v-for="request in order.Requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng phòng bộ phận chuyển đến'"
            >
              {{ request.position }}
            </th>
             <th
              v-for="request in order.Requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng phòng nhân sự'"
            >
              {{ request.position }}
            </th>
            <th
              v-for="request in order.Requests"
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
            style="padding-left:30px">
              <img width="100" height="auto" v-bind:src="'/statics/' + order.accountId +'.png'"/>
            </td>
            <td
              v-for="request in order.Requests"
              class="text-center"
              :key="request.id"
              
              v-if="request.position == 'Người làm thay'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px" v-else-if="request.status == 'Quá hạn'"><b>Quá hạn ký</b></div>
              <div v-else style="padding-left:30px">
                <img width="100" height="auto" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>       
            <td
              v-for="request in order.Requests"
              class="text-center"
              :key="request.id"
              
              v-if="request.position == 'Trưởng bộ phận'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px" v-else-if="request.status == 'Quá hạn'"><b>Quá hạn ký</b></div>
              <div v-else style="padding-left:30px">
                <img width="100" height="auto" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>
            <td
              v-for="request in order.Requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Trưởng phòng bộ phận chuyển đến'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px" v-else-if="request.status == 'Quá hạn'"><b>Quá hạn ký</b></div>
              <div v-else style="padding-left:30px">
                <img width="100" height="auto" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>
            <td
              v-for="request in order.Requests"
              class="text-center"
              :key="request.id"
              
              v-if="request.position == 'Trưởng phòng nhân sự'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px" v-else-if="request.status == 'Quá hạn'"><b>Quá hạn ký</b></div>
              <div v-else style="padding-left:30px">
                <img width="100" height="auto" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>
            <td
              v-for="request in order.Requests"
              class="text-center"
              :key="request.id"
              
              v-if="request.position == 'Ban TGĐ'"
            > 
              <div v-if="request.status == 'Chưa ký'">
              </div>
              <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
              <div style="padding-left:0px" v-else-if="request.status == 'Quá hạn'"><b>Quá hạn ký</b></div>
              <div v-else style="padding-left:30px">
                <img width="100" height="auto" v-bind:src="'/statics/' + request.accountId +'.png'"/>
              </div>
            </td>
      </tr>
      <tr>
        <td class="text-center q-ma-lg">{{ order.Account.lastName }}
                                         <!-- </br><b>SĐT : </b>{{phoneNumber}} -->
        </td>
        <td
              v-for="request in  order.Requests"
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
              v-for="request in order.Requests"
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
              v-for="request in order.Requests"
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
              v-for="request in order.Requests"
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
              v-for="request in order.Requests"
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
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["order", "metaValue"],
  computed: {
    ...mapGetters("base", ["userInfo", "myFactoryInfor", "dSNhanVien"]),
    ...mapGetters("ordersm", ["getAccountById","accounts"]),
  },
  data(){
    return{
      phoneNumber:""
    }
  },
  created(){
    this.phoneNumber = JSON.parse([this.order.OrderMeta[0].metaValue])
  }
};
</script>
