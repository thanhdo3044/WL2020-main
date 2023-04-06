<template>
<q-card-section>
    <q-input class="q-mt-sm" outlined v-model="order.OrderMeta[0].kinhGui" label="Phòng Ban/Đơn vị Có nhu cầu:" :readonly="disable" />
    <div class="q-mt-sm" outlined>Nội dung : </div>
    <div v-for="(task,key) in order.OrderMeta.filter(e => e.STT).sort((a,b)=> a.STT -b.STT)" :key="key">
        <q-card class="q-mb-sm q-mt-sm">
            <q-card-section>
                <div>STT : <b>{{task.STT}}</b></div>
                <div>Vị trí : <b>{{task.position}}</b></div>
                <div class="text-subtitle1">Số lượng : <b>{{task.number}}</b></div>
                <div>Địa điểm làm việc : {{task.locationWork}}</div>
                <div>Thời gian cần tuyển dụng : {{task.timeRecruit}}</div>
                <div>Tình trạng phê duyệt : <b>{{task.statusRequests}}</b></div>
                <q-radio class="q-mr-sm" dense @input="activeReq(task)" v-model="task.statusRequests" val="Xem xét" label="Xem xét" />
                <q-radio class="q-mr-sm" dense @input="activeReq(task)" v-model="task.statusRequests" val="Đồng ý" label="Đồng ý" />
                <q-radio class="q-mr-sm" dense @input="activeReq(task)" v-model="task.statusRequests" val="Giải trình bổ sung" label="Giải trình bổ sung" />
                <q-radio class="q-mr-sm" dense @input="activeReq(task)" v-model="task.statusRequests" val="Hủy" label="Hủy" />
            </q-card-section>
        </q-card>
    </div>
    <q-input class="q-mt-sm" v-model="order.OrderMeta[0].description" label="Các yêu cầu đối với từng vị trí(Gửi kèm mô tả công việc - nếu có):" outlined :readonly="disable" />
    <footerCard :nextId3="nextId3" :nextId2="nextId2" :order="order" :nextId="nextId"></footerCard>

</q-card-section>
</template>

<script>
import footerCard from 'components/eofs/Shared/footerCard'
import {
    mapGetters,
    mapActions
} from "vuex";
import DxButton from 'devextreme-vue/button';
import {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxLookup
} from 'devextreme-vue/data-grid';
export default {
    components: {
        DxDataGrid,
        DxColumn,
        DxEditing,
        DxPaging,
        DxButton,
        DxLookup,
        footerCard
    },
    props: ["metaValue", "disable", "order"],
    created() {
        console.log('options', this.departments)
        this.order.Requests.sort(this.compareValues('star', 'asc'))
        let idDis = null;
        for (let i = 0; i < this.order.Requests.length; i++) {
            if (this.order.Requests[i].id == this.$route.query.id) {
                console.log(this.order.Requests[i])
                idDis = this.order.Requests[i].star
                console.log('idDis', idDis)
            }
        }
        this.nextId = this.order.Requests.find(
            e => e.star > idDis
        )
        this.nextId2 =  this.order.Requests.filter(e => e.star > this.request.star && e.position !='Phòng vật tư');
        this.nextId3 =  this.order.Requests.filter(e => e.star > this.request.star && (e.position =='Phòng vật tư' ||e.position =='Phòng bảo vệ'));
        console.log("this.nextId", this.nextId);
        console.log("this.nextId2", this.nextId2);
        console.log("this.nextId3", this.nextId3);
        console.log('data', this.nextId)
        this.status = this.$route.query.status;
        console.log('status', this.status)
        console.log('dsCongDoans', this.dsCongDoans)
        console.log('userInfo', this.userInfo)
        this.nameDepartment = this.dsCongDoans.find(e => e.id == this.userInfo.departmentId)
        console.log('a', this.nameDepartment)
        if (this.$route.query.id) {
            this.getOneOrder(this.$route.query.id).then(res => {
                if (res.data.data.Requests.length) this.disable = true;
                this.metaValue = Object.assign(
                    this.metaValue,
                    JSON.parse(res.data.data.OrderMeta[0].metaValue)[0]
                );
            });
        } else {
            this.$router.push({
                path: "/tao-de-xuat"
            });
        }
    },
    data() {
        return {
            events: [],
            nameDepartment: {},
            status: "",
            phoneNumber: "",
            nextId: null,
            statusRequests:null,
            nextId2:null,
            nextId3:null
        }
    },
    computed: {
        ...mapGetters("orders", ["order"]),
        ...mapGetters("base", ["userInfo", "dsCongDoans"]),
    },
    methods: {
          ...mapActions("requests",["activeRequestsMeta"]),

      async activeReq(task){
        console.log('task Ac',typeof task.statusRequests)
        
          let payload ={
            id: task.id,
            statusRequests: task.statusRequests
          }
          let data = await this.activeRequestsMeta(payload);
          console.log(data);
      },
        compareValues(key, order = 'asc') {
            return function (a, b) {
                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
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
        ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
        ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta", "deleteOrderMeta", "updateOrderMeta"]),
        RowInserted(e) {
            console.log('STT', e.data.STT)
            console.log('STT', e.data.id)
            let STT = e.data.STT
            let position = e.data.position
            let fullName = this.userInfo.lastName
            let number = e.data.number
            let phoneNumber = this.userInfo.PHONE
            let selection = this.metaValue.selection
            let locationWork = e.data.locationWork
            let timeRecruit = e.data.timeRecruit
            let description = this.order.OrderMeta[0].description
            this.addorderMeta({
                ...this.order.OrderMeta[0],
                metaValue: JSON.stringify([this.metaValue]),
                STT,
                position,
                fullName,
                number,
                phoneNumber,
                selection,
                locationWork,
                timeRecruit,
                description
            });
        },
        RowDelted(e) {
            console.log('STT', e.data.STT)
            console.log('STT', e.data.id)
            this.deleteOrderMeta(e.data.id);
        },
        RowUpdated(e) {
            console.log('STT', e.data.STT)
            console.log('STT', e.data.id)
            let STT = e.data.STT
            let position = e.data.position
            let fullName = this.userInfo.lastName
            let number = e.data.number
            let phoneNumber = this.userInfo.PHONE
            let selection = this.metaValue.selection
            let locationWork = e.data.locationWork
            let timeRecruit = e.data.timeRecruit
            let description = this.order.OrderMeta[0].description
            this.updateOrderMeta({
                ...this.order.OrderMeta[0],
                metaValue: JSON.stringify([this.metaValue]),
                STT,
                position,
                fullName,
                number,
                phoneNumber,
                selection,
                locationWork,
                timeRecruit,
                description
            });
        }
    }
};
</script>
