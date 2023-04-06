<template>
    <q-page class="q-pa-sm">
        <q-card>
            <q-card-section>
                <div class="row">
                    <h5 class="col-9">Thông tin chi tết ticket</h5>
                    <q-btn class="col-3" style="width: 150px; height: 40px; margin-top: 25px;" flat label="Quay trở lại"
                        @click="$router.push({ path: `/edit-request` })" color="primary" />
                </div>
                <div>
                    <form>
                    <div class="row layout-botton-all">
                        <div class="col-201 lable-table">
                            <label class="text-bold " for="fname">ID</label>
                        </div>
                        <div class="col-601">
                            <q-input v-model="ID" readonly  />
                        </div>
                    </div>

                    <div class="row layout-botton-all">
                        <div class="col-201 lable-table">
                            <label class="text-bold " for="fname">Công việc</label>
                        </div>
                        <div class="col-601">
                            <q-input v-model="veViec" readonly  />
                        </div>
                    </div>

                    <div class="row layout-botton-all">
                        <div class="col-201 lable-table">
                            <label class="text-bold " for="fname">Nhà máy nhận công việc</label>
                        </div>
                        <div class="col-601">
                            <q-input v-model="nhaMay" readonly  />
                        </div>
                    </div>

                    <div class="row layout-botton-all">
                        <div class="col-201 lable-table">
                            <label class="text-bold " for="fname">Phòng ban nhận công việc</label>
                        </div>
                        <div class="col-601">
                            <q-input v-model="phongban" readonly  />
                        </div>
                    </div>

                    <div class="row layout-botton-all">
                        <div class="col-201 lable-table">
                            <label class="text-bold " for="fname">Loại công việc</label>
                        </div>
                        <div class="col-601">
                            <q-input v-model="loaiTicket" readonly  />
                        </div>
                    </div>

                    <div class="row layout-botton-all">
                        <div class="col-201 lable-table">
                            <label class="text-bold " for="fname">Độ quan trọng</label>
                        </div>
                        <div class="col-601">
                            <q-input v-model="doQuanTrong" readonly  />
                        </div>
                    </div>

                    <div class="row layout-botton-all">
                        <div class="col-201 lable-table">
                            <label class="text-bold " for="fname">Phê duyệt</label>
                        </div>
                        <div class="col-601">
                            <div style="margin-left: -15px;" >
                                <q-btn flat label="Không đồng ý" v-on:click="KhongDongY()" color="deep-orange"
                                    v-if="this.pheDuyet === true" />
                                <q-btn flat label="Đồng ý" v-on:click="DongY()" color="primary"
                                    v-if="this.pheDuyet === false" />
                                <div v-if="this.pheDuyet === null">
                                    <q-btn flat label="Không đồng ý" v-on:click="KhongDongY()" color="deep-orange" />
                                    <q-btn flat label="Đồng ý" v-on:click="DongY()" color="primary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row layout-botton-all">
                        <div class="col-201 lable-table">
                            <label class="text-bold " for="fname">Người dùng</label>
                        </div>
                        <div class="col-601">
                            <q-btn v-if="this.nguoiDung != null" color="primary" style="width: 220px;" @click="DoiNguoiLamViec()" flat
                                label="không phải của tôi"></q-btn>
                        </div>
                    </div>

                    <div class="row layout-botton-all">
                        <div class="col-201 lable-table">
                            <label class="text-bold " for="fname">Ghi chú công việc</label>
                        </div>
                        <div class="col-601">
                            <q-input v-model="description" readonly  />
                        </div>
                    </div>

                    <div class="row layout-botton-all">
                        <div class="col-201 lable-table">
                            <label class="text-bold " for="fname">Hình ảnh</label>
                        </div>
                        <div class="col-601">
                            <td v-if="this.imageUrl">
                            <a :href="'http://localhost:3004/Attached/' + this.imageUrl" target="_blank">
                                <iframe v-bind:src="'http://localhost:3004/Attached/' + this.imageUrl" width="600"
                                    height="500"></iframe>
                            </a>
                        </td>
                        <td v-else>Không có hình ảnh đi theo !</td>
                        </div>
                    </div>

                    <div class="row layout-botton-all">
                        <div class="col-201 lable-table">
                            <label class="text-bold " for="fname">Hoàn thành công việc</label>
                        </div>
                        <div class="col-601" >
                            <q-btn color="primary" style="width: 220px;" v-on:click="HoanThanh()" flat
                                label="Hoàn thành công việc"></q-btn>
                        </div>
                    </div>
                </form>
                </div>
                
            </q-card-section>
        </q-card>

        <!-- them model -->
        <q-dialog v-model="SuaNguoiDung" persistent transition-show="scale" transition-hide="scale">
            <q-card class="bg-white text-primary" style="width: 300px">
                <q-card-section>
                    <div class="text-h6">Đổi người làm việc</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-select dense v-model="chonNguoiNhan" :options="optionNguoiNhan" class="text-primary" />
                </q-card-section>

                <q-card-actions class="bg-primary text-white">
                    <q-btn flat label="Hủy" v-close-popup />
                    <q-btn flat label="Xác nhận" v-close-popup @click="ChuyenNguoiNhanViec()" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../ultils";
import moment from "moment";

export default {
    components: {},
    data() {
        return {
            ID:"312",
            veViec: "",
            nhaMay: "",
            phongban: "",
            loaiTicket: "",
            doQuanTrong: "",
            nguoiDung: "",
            description: "",
            imageUrl: "",
            optionNguoiNhan: [],
            chonNguoiNhan: "",
            pheDuyet: "",
            nguoiDung: "",
            idPhongBan:"",
            idNguoiDung:"",
            xemtiep: false,
            dataTable: "",
            SuaNguoiDung: false,
        }
    },
    async created() {
        await this.load();
    },
    computed: {
        ...mapGetters("base", ["userInfo"]),
    },
    methods: {
        async load() {
            let payload = {
                id: this.$route.params.id,

            };
            const data = await this.$store.dispatch("NOTIFY/GET_TICKET_ID", payload);
            // console.log("Hien thi cong viec",data.data);
            // this.dataTable = data.data;
            data.data.forEach(x =>{
                this.ID = x.ID
                this.description = x.description
                this.doQuanTrong = x.doQuanTrong
                this.imageUrl = x.imageUrl
                this.loaiTicket = x.loaiTicket
                this.nguoiDung = x.nguoiDung
                this.nhaMay = x.nhaMay
                this.phongban = x.phongBan
                this.subDescription= x.subDescription
                this.veViec =x.veViec
                this.idNguoiDung =x.idNguoiDung
                this.idPhongBan = x.idPhongBan
                this.pheDuyet= x.pheDuyet
            })
            // console.log("hien thi cong viec",this.ID);
        },
        xemtiept() {
            this.xemtiep = false;
        },
        async KhongDongY() {
            var today = new Date();
            var time = moment(today).format("YYYY-MM-DD HH:mm:ss");
            let payload = {
                ID: this.ID,
                pheDuyet: 0,
                thoiGianHoanThanh: time,
            }
            const data = await this.$store.dispatch("NOTIFY/UPDATE_TICKET", payload);
            showNotifySuccess();
            await this.load();
        },
        async DongY() {
            var today = new Date();
            var time = moment(today).format("YYYY-MM-DD HH:mm:ss");
            let payload = {
                ID: this.ID,
                pheDuyet: 1,
                thoiGianHoanThanh: time,
            }
            const data = await this.$store.dispatch("NOTIFY/UPDATE_TICKET", payload);
            showNotifySuccess();
            await this.load();
        },
        async HoanThanh() {
            var today = new Date();
            var time = moment(today).format("YYYY-MM-DD HH:mm:ss");
            let payload = {
                ID: this.ID,
                hoanThanh: 1,
                thoiGianHoanThanh: time,
            }
            // console.log('Hien thij hoan thanh ', payload);
            const data = await this.$store.dispatch("NOTIFY/SUCCESS_TICKET", payload);
            this.$router.push({ path: `/edit-request` });
            showNotifySuccess();
            await this.load();
        },
        async DoiNguoiLamViec() {

            let payload = {
                idNguoiDung: this.idNguoiDung,
                idPhongBan: this.idPhongBan,
            };
            const data = await this.$store.dispatch("base/GET_ACCOUNT_TICKET", payload);
            this.SuaNguoiDung = true;
            this.chonNguoiNhan = "";
            this.optionNguoiNhan = [];
            data.data.forEach(item => {
                this.optionNguoiNhan.push({
                    label: item.LAST_NAME,
                    value: item.LAST_NAME,
                    key: item.ID,
                })
            });

        },
        async ChuyenNguoiNhanViec() {
            var today = new Date();
            var time = moment(today).format("YYYY-MM-DD HH:mm:ss");
            let payload = {
                ID: this.ID,
                nguoiDung: this.chonNguoiNhan.value,
                idNguoiDung: this.chonNguoiNhan.key,
                thoiGianHoanThanh: time,
            };
            const data = await this.$store.dispatch("NOTIFY/EDIT_USER_TICKET", payload);
            let baseUrl = null;
            if (process.env.PROD) {
                baseUrl = `https://app.woodsland.com.vn:2002/#/edit-request`;
            } else {
                baseUrl = `http://localhost:5000/#/edit-request`;
            }
            let payloadMail;
            if (e.loaiTicket === "Báo lỗi") {
                payloadMail = {
                    baseUrl: baseUrl,
                    email: this.chonNguoiNhan.email,
                    accountId: this.userInfo.id,
                    toAccountId: this.chonNguoiNhan.key,
                    subject: `Công việc của bạn :${e.veViec}`,
                    title: `Nhấn vào để xem công việc kỹ hơn về công việc của bạn !`,
                    dataBody: `Mức độ quan trọng : ${e.doQuanTrong}. Nhà máy làm việc: ${e.nhaMay}.`,
                }
            } else {
                payloadMail = {
                    baseUrl: baseUrl,
                    email: this.chonNguoiNhan.email,
                    accountId: this.userInfo.id,
                    toAccountId: this.chonNguoiNhan.key,
                    subject: `Yêu cầu phê duyệt :${e.veViec}`,
                    title: `Nhấn vào để xem kỹ hơn thông tin cần phê duyệt của bạn !`,
                    dataBody: `Mức độ quan trọng : ${e.doQuanTrong}. Nhà máy làm việc: ${e.nhaMay}.`,
                }
                // console.log("hien thi thu gui di", payloadMail);
                const sendTicket = await this.sendNotificationMail(payloadMail);
            }
            showNotifySuccess();
            await this.load();
        },
    },
}


</script>

<style>
table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    text-align: left;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}
* {
  box-sizing: border-box;
}

.row::after {
  content: "";
  clear: both;
  display: block;
}

[class*="col-"] {
  float: left;
  /* padding: 15px; */
}



.container {
  border-radius: 5px;
  /* background-color: #f2f2f2; */
  padding: 20px;
}

.tilte {
  font-weight: 700;
  font-size: 40px;
}


.layout-botton-all {
  margin-bottom: 15px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

.lable-table {
  text-align: right;
  padding-right: 2%
}

.butont-click {
  min-width: 120px;
  margin-left: 15px;
}

.col-101 {
  width: 8.33%;
}

.col-201 {
  width: 16.66%;
}

.col-301 {
  width: 25%;
}

.col-401 {
  width: 33.33%;
}

.col-501 {
  width: 41.66%;
}

.col-601 {
  width: 50%;
}

.col-701 {
  width: 58.33%;
}

.col-801 {
  width: 66.66%;
}

.col-901 {
  width: 75%;
}

.col-1001 {
  width: 83.33%;
}

.col-1101 {
  width: 91.66%;
}

.col-1201 {
  width: 100%;
}



/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (max-width: 768px) {
  [class*="col-"] {
    width: 100%;
  }

  .lable-table {
    text-align: left;
  }

  .butont-click {
    min-width: 120px;
    margin-left: 0;
  }
}
</style>