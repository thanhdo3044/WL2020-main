<template>
<q-card-section>
    <div class="q-gutter-sm text-primary text-h6">
        Tuyển nhân viên :
        </br>
    </div>
    <div class="q-gutter-sm q-mt-sm">
    </div>
    <div v-if="order.status == 'Không được duyệt'">
        <div v-for="(task,key) in order.OrderMeta.filter(e => e.maNV)" :key="key">
            <q-card class="q-mb-sm q-mt-sm">
                <q-card-section>
                    <div class="row">
                        <q-input class="q-mt-sm col q-pr-sm" outlined v-model="task.STT" label="STT :" :readonly="!disable">
                        </q-input>
                        <q-input class="q-mt-sm col q-pr-sm" outlined v-model="task.department2" label="Phòng ban cần tuyển dụng :" :readonly="!disable">
                        </q-input>
                        <q-input class="q-mt-sm col " outlined v-model="task.position" label="Vị trí : " :readonly="!disable">
                        </q-input>
                    </div>
                    <div class="row">
                        <q-input class="q-mt-sm col q-mr-sm" outlined v-model="task.number" label="Số lượng : " :readonly="!disable" />
                        <q-input class="q-mt-sm col " outlined v-model="task.locationWork" label="Địa điểm làm việc :" :readonly="!disable">
                        </q-input>

                    </div>
                    <q-input class="q-mt-sm row" outlined v-model="task.timeRecruit" label="Thời gian cần tuyển dụng : " :readonly="!disable">
                    </q-input>
                    <div class="row">
                        <div class="col">
                            <q-input v-model="task.statusRequests " class="q-mt-sm col" outlined label="Trạng thái phê duyệt : " :readonly="true" />

                        </div>
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
        <div v-for="(task,key) in order.OrderMeta.filter(e => e.maNV)" :key="key">
            <q-card class="q-mb-sm q-mt-sm">
                <q-card-section>
                    <div class="row">
                        <q-input class="q-mt-sm col q-pr-sm" outlined v-model="task.STT" label="STT :" :readonly="disable">
                        </q-input>
                        <q-input class="q-mt-sm col " outlined v-model="task.department2" label="Phòng ban cần tuyển dụng :" :readonly="disable">
                        </q-input>

                    </div>
                    <div class="row">
                        <q-input class="q-mt-sm col q-mr-sm" outlined v-model="task.position" label="Vị trí : " :readonly="disable">
                        </q-input>
                        <q-input class="q-mt-sm col " outlined v-model="task.number" label="Số lượng : " :readonly="disable" />

                    </div>
                    <q-input class="q-mt-sm col " outlined v-model="task.locationWork" label="Địa điểm làm việc :" :readonly="disable">
                    </q-input>
                    <q-input class="q-mt-sm row" outlined v-model="task.timeRecruit" label="Thời gian cần tuyển dụng : " :readonly="disable">
                    </q-input>
                    <div class="row">
                        <div class="col">
                            <q-input v-model="task.statusRequests " class="q-mt-sm col" outlined label="Trạng thái phê duyệt : " :readonly="true" />
                        </div>
                    </div>
                    <q-btn push   class="q-mt-sm shadow-7" v-if="(order.Requests.length == 0 && task.statusRequests == 'Xem xét')  || task.statusRequests == 'Hủy'" v-on:click="actEdit(task)" color="primary" text-color="white" label="Sửa" />
                    <q-btn push   class="q-mt-sm q-ml-sm shadow-7" v-if="(order.Requests.length == 0 && task.statusRequests == 'Xem xét')  || task.statusRequests == 'Hủy'" v-on:click="RowDelted(task)" color="orange" text-color="white" label="Xóa" />
                </q-card-section>
            </q-card>
        </div>
    </div>
    <q-dialog v-model="active" full-width persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-white text-black" style="width: auto">
            <q-card-section>
                <div class="text-h6 bg-primary q-pa-sm text-white text-center shadow-5" style="border-radius:5px">Thêm dữ liệu</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
                <q-input class="q-mt-sm q-pl-sm" outlined v-model="order.OrderMeta[0].STT" label="STT: " :readonly="false" />
                <q-input class="q-mt-sm q-pl-sm col" outlined v-model="order.OrderMeta[0].department2" label="Phòng ban cần tuyển dụng :" :readonly="false">
                </q-input>
                <q-input class="q-mt-sm q-pl-sm" outlined v-model="order.OrderMeta[0].position" label="Vị trí: " :readonly="false" />
                <q-input class="q-mt-sm q-pl-sm" outlined v-model="order.OrderMeta[0].number" label="Số lượng: " type="number" :readonly="false" />
                <q-input class="q-mt-sm q-pl-sm" outlined v-model="order.OrderMeta[0].locationWork" label="Địa điểm làm việc: " :readonly="false" />
                <div class="col q-pl-sm q-mt-sm">
                    <q-input filled v-model="order.OrderMeta[0].timeRecruit" label="Thời gian cần tuyển dụng">
                        <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy transition-show="scale" transition-hide="scale">
                                    <q-date v-model="order.OrderMeta[0].timeRecruit" mask="DD-MM-YYYY">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>
            </q-card-section>
            <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat label="OK" v-close-popup @click="RowInserted" />
                <q-btn flat label="Back" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <q-dialog v-model="activeEdit" full-width persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-white text-black" style="width: auto">
            <q-card-section>
                <div class="text-h6 bg-primary q-pa-sm text-white text-center shadow-5" style="border-radius:5px">Sửa dữ liệu</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
                <q-input class="q-mt-sm q-pl-sm" outlined v-model="modelEdit.STT" label="STT: " :readonly="false" />
                <q-input class="q-mt-sm col q-pl-sm" outlined v-model="modelEdit.department2" label="Phòng ban cần tuyển dụng :" :readonly="false">
                </q-input>
                <q-input class="q-mt-sm q-pl-sm" outlined v-model="modelEdit.position" label="Vị trí: " :readonly="false" />
                <q-input class="q-mt-sm q-pl-sm" outlined v-model="modelEdit.number" label="Số lượng: " type="number" :readonly="false" />
                <q-input class="q-mt-sm q-pl-sm" outlined v-model="modelEdit.locationWork" label="Địa điểm làm việc: " :readonly="false" />
                <div class="col q-pl-sm q-mt-sm">
                    <q-input filled v-model="modelEdit.timeRecruit" label="Thời gian cần tuyển dụng">
                        <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy transition-show="scale" transition-hide="scale">
                                    <q-date v-model="modelEdit.timeRecruit" mask="DD-MM-YYYY">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>
            </q-card-section>
            <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat label="OK" v-close-popup @click="RowUpdated" />
                <q-btn flat label="Back" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</q-card-section>
</template>

<script>
import {
    mapGetters,
    mapActions
} from "vuex";
import axios from 'axios';
import moment from 'moment'
export default {

    props: ["metaValue", "disable", "order"],
    async created() {
        this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.userInfo.department);
        console.log('this.nameDepartmentName', this.nameDepartmentName.NAME)
        this.status = this.$route.query.status;
        console.log('status', this.status)
        console.log('dsCongDoans', this.dsCongDoans)
        console.log('userInfo', this.userInfo)
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
            modelEdit: {
                STT: null,
                department2: null,
                position: null,
                number: null,
                locationWork: null,
                timeRecruit: null,
                id: null,
            }
        }
    },
    computed: {
        ...mapGetters("orders", ["order"]),
        // ...mapActions("base",["GET_DEPARTMENTSBYID"]),
        ...mapGetters("base", ["userInfo"]),
    },
    methods: {
        ...mapActions("base", ["GET_DEPARTMENTSBYID", "GET_DEPARTMENTSALL", "GET_ACCOUNTS"]),
        ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
        ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta", "deleteOrderMeta", "updateOrderMeta"]),
        ...mapActions("requests", ["deleteRequest", "resetOrder"]),

        async changed() {

            console.log('changed')
            this.order.OrderMeta[0].fullName = this.accountName.name
            this.order.OrderMeta[0].position2 = this.accountName.position
            let department222 = await this.GET_DEPARTMENTSBYID(this.accountName.departmentId);
            console.log('department2', department222)
            this.order.OrderMeta[0].department2 = department222.NAME
        },
        filterFn(val, update) {
            if (val === '') {
                update(() => {
                    this.options = this.account
                })
                return
            }

            update(() => {
                const needle = val.toLowerCase()
                this.options = this.account.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
            })
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
                    path: "/tao-de-xuat"
                });
            this.order.OrderMeta = data.data.data.OrderMeta;
            console.log(data);
        },
        initNewRow() {
            console.log('init')
            this.active = true;
        },
        async actEdit(task) {
            console.log('task', task)
            this.modelEdit.number = task.number;
            this.modelEdit.STT = task.STT;
            this.modelEdit.locationWork = task.locationWork;
            this.modelEdit.timeRecruit = task.timeRecruit;
            this.modelEdit.position = task.position;
            this.modelEdit.department2 = task.department2;
            this.modelEdit.id = task.id;
            this.activeEdit = true;
        },
        async RowInserted() {
            this.active = false;

            let fullName = this.userInfo.lastName
            let department = this.nameDepartmentName.NAME
            let department2 = this.order.OrderMeta[0].department2
            let phoneNumber = this.userInfo.PHONE
            let selection = 'Tuyển nhân viên'
            let STT = this.order.OrderMeta[0].STT
            let maNV = this.userInfo.account
            let locationWork = this.order.OrderMeta[0].locationWork
            let timeRecruit = this.order.OrderMeta[0].timeRecruit
            let position = this.order.OrderMeta[0].position
            let number = this.order.OrderMeta[0].number
            let statusRequests = 'Xem xét'
            await this.addorderMeta({
                ...this.order.OrderMeta[0],
                metaValue: JSON.stringify([this.metaValue]),
                fullName,
                phoneNumber,
                selection,
                STT,
                locationWork,
                timeRecruit,
                maNV,
                department,
                position,
                statusRequests,
                number,
                department2
            });
            await this.loadData(this.$route.query.id);

        },
        async RowDelted(e) {
            console.log('STT', e.id)
            await this.deleteOrderMeta(e.id);
            await this.loadData(this.$route.query.id);
        },
        async RowUpdated(e) {
            let fullName = this.userInfo.lastName
            let department = this.nameDepartmentName.NAME
            let department2 = this.modelEdit.department2
            let phoneNumber = this.userInfo.PHONE
            let selection = 'Tuyển nhân viên'
            let STT = this.modelEdit.STT
            let maNV = this.userInfo.account
            let locationWork = this.modelEdit.locationWork
            let timeRecruit = this.modelEdit.timeRecruit
            let position = this.modelEdit.position
            let number = this.modelEdit.number
            let statusRequests = 'Xem xét'
            let id = this.modelEdit.id
            await this.updateOrderMeta({
                ...this.order.OrderMeta[0],
                metaValue: JSON.stringify([this.metaValue]),
                fullName,
                phoneNumber,
                selection,
                STT,
                locationWork,
                timeRecruit,
                maNV,
                department,
                position,
                statusRequests,
                id,
                number,
                department2
            });
            await this.loadData(this.$route.query.id);

        },
        async updatedOrderMeta() {

            let fullName = this.userInfo.lastName
            let phoneNumber = this.userInfo.PHONE
            let position = this.userInfo.position
            let department = this.nameDepartmentName.NAME
            let selection = 'Tuyển nhân viên'
            this.updateOrderMeta({
                ...this.order.OrderMeta[0],
                metaValue: JSON.stringify([this.metaValue]),
                fullName,
                phoneNumber,
                position,
                department,
                selection
            });
            await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
            await this.deleteRequest(this.order.id);
            location.reload();

        },
    }
};
</script>

<style scoped>
.dx-overlay-wrapper.dx-dropdowneditor-overlay.dx-popup-wrapper.dx-datebox-wrapper.dx-datebox-wrapper-time.dx-datebox-wrapper-list {
    z-index: 99999 !important;
}
</style>
