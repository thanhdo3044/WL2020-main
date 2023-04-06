<template>
  <q-card-section>
     <div class="q-gutter-sm text-primary text-h6">
        Chọn loại mẫu điều chuyển nhân viên :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
        <div v-if="order.OrderMeta[0].selection == null">
          <q-radio  dense v-model="metaValue.selection" val="Điều chuyển cá nhân" label="Điều chuyển cá nhân" color="teal"/>
          <q-radio  dense v-model="metaValue.selection" val="Điều chuyển tập thể" label="Điều chuyển tập thể" color="red"/>
        </div>
        <div v-else>
          <span v-if="order.OrderMeta[0].selection == 'Điều chuyển tập thể'">
              <q-radio  dense v-model="metaValue.selection" val="Điều chuyển tập thể"  color="red"/>
          </span>
          <span v-else>
              <q-radio  dense v-model="metaValue.selection" val="Điều chuyển cá nhân"  color="red"/>
          </span>
          <span class="q-ml-sm" style="font-size:20px">{{metaValue.selection}}</span>
        </div>
    </div>
    <div v-if="metaValue.selection == 'Điều chuyển tập thể' && metaValue.selection != null">
      <div v-if="order.status =='Không được duyệt'">
        <q-input
      class="q-mt-sm"
      outlined
      v-model="metaValue.kinhGui"
      label="Kính gửi : "
      :readonly="!disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="userInfo.lastName"
      label="Tên tôi là : "
      :readonly="!disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="userInfo.position"
      label="Chức danh : "
      :readonly="!disable"
    />
        <q-input
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="!disable"/>

     
    <div
      class="q-mt-sm"
      outlined
    >Căn cứ vào tình hình thực tế công việc và nguyện vọng của người lao động,
    </br>Nay tôi làm đơn này, kính xin Ban Tổng giám đốc cho tôi được điều chuyển các cá nhân có tên sau sang vị trí công tác mới, gồm: 
    </div>
    <DxDataGrid
      id="gridContainer"
      :data-source="order.OrderMeta"
      :allow-column-reordering="true"
      :show-borders="true"
      :show-row-lines="true"
      :word-wrap-enabled="true"
      @init-new-row="initNewRow"
      @row-inserted="RowInserted"
      @row-updated="RowUpdated"
      @row-removed="RowDelted"
    >
    <DxPaging :enabled="true"/>
      <DxEditing
          :allow-updating="
              !order.Requests.length || order.status == 'Không được duyệt'
            "
            :allow-deleting="
              !order.Requests.length || order.status == 'Không được duyệt'
            "
            :allow-adding="
              !order.Requests.length || order.status == 'Không được duyệt'
            "
            mode="row"
        />
        
      <DxColumn
        data-field="STT"
        caption="STT"
        data-type="number"
      />
      <DxColumn caption="Mã NV" data-field="maNV"/>
      <DxColumn caption="Họ và tên" data-field="fullName2"/>
      <DxColumn
        caption="Vị trí hiện tại"
        data-field="department2"
      />
      <DxColumn
        data-field="stepDepartment"
        caption="Vị trí đề xuất điều chuyển sang"
      >
      </DxColumn>
    </DxDataGrid>
    
   <div
      class="q-mt-sm"
      outlined
    >
        Vậy, kính mong Ban Tổng Giám đốc xem xét, điều chuyển các nhân sự trên./.
        </br>Trân trọng cảm ơn !    
    </div>
        <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />
      </div>
      <div v-else>
        <q-input
      class="q-mt-sm"
      outlined
      v-model="metaValue.kinhGui"
      label="Kính gửi : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="userInfo.lastName"
      label="Tên tôi là : "
      :readonly="disable"
    />
    <q-input
      class="q-mt-sm"
      outlined
      v-model="userInfo.position"
      label="Chức danh : "
      :readonly="disable"
    />
        <q-input
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>

     
    <div
      class="q-mt-sm"
      outlined
    >Căn cứ vào tình hình thực tế công việc và nguyện vọng của người lao động,
    </br>Nay tôi làm đơn này, kính xin Ban Tổng giám đốc cho tôi được điều chuyển các cá nhân có tên sau sang vị trí công tác mới, gồm: 
    </div>
    <DxDataGrid
      id="gridContainer"
      :data-source="order.OrderMeta"
      :allow-column-reordering="true"
      :show-borders="true"
      :show-row-lines="true"
      :word-wrap-enabled="true"
      @init-new-row="initNewRow"
      @row-inserted="RowInserted"
      @row-updated="RowUpdated"
      @row-removed="RowDelted"
    >
    <DxPaging :enabled="true"/>
      <DxEditing
          :allow-updating="
              !order.Requests.length || order.status == 'Không được duyệt'
            "
            :allow-deleting="
              !order.Requests.length || order.status == 'Không được duyệt'
            "
            :allow-adding="
              !order.Requests.length || order.status == 'Không được duyệt'
            "
            mode="row"
        />
        
      <DxColumn
        data-field="STT"
        caption="STT"
        data-type="number"
      />
      <DxColumn caption="Mã NV" data-field="maNV"/>
      <DxColumn caption="Họ và tên" data-field="fullName2"/>
      <DxColumn
        caption="Vị trí hiện tại"
        data-field="department2"
      />
      <DxColumn
        data-field="stepDepartment"
        caption="Vị trí đề xuất điều chuyển sang"
      >
      </DxColumn>
    </DxDataGrid>
    
   <div
      class="q-mt-sm"
      outlined
    >
        Vậy, kính mong Ban Tổng Giám đốc xem xét, điều chuyển các nhân sự trên./.
        </br>Trân trọng cảm ơn !    
    </div>
      </div>
      
    </div>
    <div v-if="metaValue.selection == 'Điều chuyển cá nhân' && metaValue.selection != null">
        <div v-if="order.status =='Không được duyệt'">
          <q-input
            class="q-mt-sm"
            outlined
            v-model="metaValue.kinhGui"
            label="Kính gửi : "
            :readonly="!disable"
          />
          <q-input
            class="q-mt-sm"
            outlined
            v-model="userInfo.lastName"
            label="Tên tôi là : "
            :readonly="!disable"
          />
          <q-input
            class="q-mt-sm"
            outlined
            v-model="userInfo.position"
            label="Chức danh : "
            :readonly="!disable"
          />
          <q-input
          class="q-mt-sm"
          outlined
          v-model="nameDepartmentName.NAME"
          label="Phòng ban/bộ phận : "
          :readonly="!disable"/>
          <div class="q-mt-sm">Phòng ban/bộ phận cần chuyển đến :</div>
            <q-select
              filled
              v-model="metaValue.stepDepartment"
              use-input
              input-debounce="0"
              label="Phòng ban/bộ phận chuyển đến"
              :options="options"
              @filter="filterFn"
              style="width: 250px"
              behavior="dialog"
              :readonly="!disable"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>     
          
          <q-input
            class="q-mt-sm"
            outlined
            v-model="metaValue.lyDo"
            label="Lí do : "
            :readonly="!disable"
          />
          <div
            class="q-mt-sm"
            outlined
          >
              Vậy, kính mong Tổng Giám đốc, Cán bộ quản lý trực tiếp và Trưởng phòng Nhân sự xem xét cho tôi được điều chuyển sang vị trí công tác mới.
              </br>Trân trọng cảm ơn !    
          </div>
        <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />
        </div>
        <div v-else>
            <q-input
            class="q-mt-sm"
            outlined
            v-model="metaValue.kinhGui"
            label="Kính gửi : "
            :readonly="disable"
          />
          <q-input
            class="q-mt-sm"
            outlined
            v-model="userInfo.lastName"
            label="Tên tôi là : "
            :readonly="disable"
          />
          <q-input
            class="q-mt-sm"
            outlined
            v-model="userInfo.position"
            label="Chức danh : "
            :readonly="disable"
          />
          <q-input
                class="q-mt-sm"
                outlined
                v-model="nameDepartmentName.NAME"
                label="Phòng ban/bộ phận : "
                :readonly="disable"/>
          <div class="q-mt-sm">Phòng ban/bộ phận cần chuyển đến :</div>
            <q-select
              filled
              v-model="metaValue.stepDepartment"
              use-input
              input-debounce="0"
              label="Phòng ban/bộ phận chuyển đến"
              :options="options"
              @filter="filterFn"
              style="width: 250px"
              behavior="dialog"
              :readonly="disable"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>     
          
          <q-input
            class="q-mt-sm"
            outlined
            v-model="metaValue.lyDo"
            label="Lí do : "
            :readonly="disable"
          />
          <div
            class="q-mt-sm"
            outlined
          >
              Vậy, kính mong Tổng Giám đốc, Cán bộ quản lý trực tiếp và Trưởng phòng Nhân sự xem xét cho tôi được điều chuyển sang vị trí công tác mới.
              </br>Trân trọng cảm ơn !    
          </div>

        </div>
    </div>
  </q-card-section>
</template>

<script>
import { mapGetters ,mapActions} from "vuex";
import DxButton from 'devextreme-vue/button';
import axios from 'axios';
import { DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup } from 'devextreme-vue/data-grid';
export default {
    components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxLookup
  },
  props: ["metaValue","status","disable"],
  data(){
      return{
        myDepartment:null,
        stepDepartment:null,
        departments: [],
            events:[],
            options:null,
            nameDepartmentName:null,
            active:false,
            status:""
      }
  },
  async created(){
    let data = await this.GET_DEPARTMENTSALL();
    console.log('dataa',data)
    // this.loadDepartment()
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.userInfo.department);
    await data.forEach(element => {
      this.departments.push({
        value: element.ID,
        label: element.NAME
      });
    });
    console.log('options',this.departments)
    
  },
  methods:{
    async loadData(id) {
      let data = null;
      try {
        data = await this.getOneOrder(id);
      } catch (error) {
        console.log(error);
      }

      if (!data)
        this.$router.push({
          path: "/tao-de-xuat"
        });
      this.order = data.data.data;
      console.log(data);
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.departments
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.departments.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    ...mapActions("base",["GET_DEPARTMENTSBYID","GET_DEPARTMENTSALL"]),
    ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta","deleteOrderMeta","updateOrderMeta"]),
    ...mapActions("requests", ["deleteRequest","resetOrder"]),
    chonCongDoan(){
     console.log('myDepartment',this.myDepartment.value)
    },
    async loadDepartment() {
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS", {
        factoryId: this.myFactoryInfor.id
      });
      console.log('data',data.data)
      await data.data.forEach(e =>{
         this.departments.push({
           id: e.id,
           value: e.name
         })
      });
      console.log('this.departments',this.departments)
    },
    async  RowInserted(e){
        // console.log('myDepartment',this.myDepartment.value)
        console.log('STT',e.data.STT)
        console.log('STT',e.data.id)
        // let phongBan= this.myDepartment.label.toString() + " " + this.myDepartment.label.toString()
        let STT = e.data.STT.toString()
        let kinhGui = this.metaValue.kinhGui
        let maNV = e.data.maNV
        let fullName = this.userInfo.lastName
        let fullName2 = e.data.fullName2
        let department2 = e.data.department2 != null ? e.data.department2 : '';
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let department = this.nameDepartmentName.NAME != null ? this.nameDepartmentName.NAME : '';
        let stepDepartment = e.data.stepDepartment != null ? e.data.stepDepartment  : '';
        await this.addorderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          STT,maNV,fullName,fullName2,kinhGui,
          department2,selection,department,stepDepartment,position
        });
        await this.loadData(this.$route.query.id);
    },
    async RowDelted(e){
      console.log('STT',e.data.STT)
      console.log('STT',e.data.id)
      await this.deleteOrderMeta(e.data.id);
    },
    async RowUpdated(e){
      // console.log('myDepartment',this.myDepartment.value)
      //   console.log('STT',e.data.STT)
      //   console.log('STT',e.data.id)
        let STT = e.data.STT.toString()
        let kinhGui = this.metaValue.kinhGui
        let maNV = e.data.maNV
        let fullName = this.userInfo.lastName
        let fullName2 = e.data.fullName2
        let department2 = e.data.department2 != null ? e.data.department2 : '';
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let department = this.nameDepartmentName.NAME != null ? this.nameDepartmentName.NAME : '';
        let stepDepartment = e.data.stepDepartment != null ? e.data.stepDepartment  : '';
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          STT,maNV,fullName,fullName2,kinhGui,
          department2,selection,department,stepDepartment,position
        });
        await this.loadData(this.$route.query.id);
    },
    // updatedOrderMeta() {
    //     this.active = false;
    //     this.disable = true;
    //     let fullName = this.userInfo.lastName
    //     let kinhGui = this.metaValue.kinhGui
    //     let lyDo = this.metaValue.lyDo
    //     let selection = this.metaValue.selection
    //     let position = this.userInfo.position
    //     let description = this.metaValue.lyDo == null ? " " :this.metaValue.lyDo
    //     let department = this.nameDepartmentName.NAME != null ? this.nameDepartmentName.NAME : '';
    //     let stepDepartment = this.metaValue.stepDepartment.label != null ? this.metaValue.stepDepartment.label : '';
    //     this.updateOrderMeta({
    //       ...this.order.OrderMeta[0],
    //       metaValue: JSON.stringify([this.metaValue]),
    //       fullName,position,description,
    //       selection,department,stepDepartment,position,kinhGui,lyDo
    //     })

    // },
    initNewRow({ data }) {
      console.log('vao initNewRow')
      Object.assign(data, {
        STT: this.order.OrderMeta.length + 1,
      });
    },
    async updatedOrderMeta() {
       
        this.active = false;
        this.disable = true;
        let fullName = this.userInfo.lastName
        let kinhGui = this.metaValue.kinhGui
        let lyDo = this.metaValue.lyDo
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let description = this.metaValue.lyDo == null ? " " :this.metaValue.lyDo
        let department = this.nameDepartmentName.NAME != null ? this.nameDepartmentName.NAME : '';
        let stepDepartment = this.metaValue.stepDepartment.label != null ? this.metaValue.stepDepartment.label : '';
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,position,description,
          selection,department,stepDepartment,position,kinhGui,lyDo
        })
          await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
          await this.deleteRequest(this.order.id);
          location.reload();  
    }
  },
  watch: {
    disable(newValue) {
      this.active = false;
        this.disable = true;
        let fullName = this.userInfo.lastName
        let kinhGui = this.metaValue.kinhGui
        let lyDo = this.metaValue.lyDo
        let selection = this.metaValue.selection
        let position = this.userInfo.position
        let description = this.metaValue.lyDo == null ? " " :this.metaValue.lyDo
        let department = this.nameDepartmentName.NAME != null ? this.nameDepartmentName.NAME : '';
        let stepDepartment = this.metaValue.stepDepartment.label != null ? this.metaValue.stepDepartment.label : '';
        this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,position,description,
          selection,department,stepDepartment,position,kinhGui,lyDo
        })
    }
  },
  computed: {
    
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["myFactoryInfor","userInfo","dsCongDoans"])
  },
   
};
</script>
