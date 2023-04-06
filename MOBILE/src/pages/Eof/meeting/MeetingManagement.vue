<template>
  <q-page>
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto text-primary">Quản lý đặt lịch phòng họp</div>
      </div>
    </div>
    <div class="row">
      <q-date
        class="col-12"
        v-model="date"
        :events="events"
        @click="selectDateBooking"
      />
    </div>
    <div class="q-px-lg q-pb-md">
      <q-timeline color="secondary">
        <q-timeline-entry heading> Lịch họp ngày {{ date }} </q-timeline-entry>
        <div v-for="(value, index) in listMeeting" :key="index">
          <q-timeline-entry
            v-if="value.STATUS != 'delete'"
            v-bind:title="value.TITLE"
            v-bind:subtitle="` ${value.START_TIME.substring(
              11,
              16
            )}h - ${value.END_TIME.substring(11, 16)}h`"
          >
            <div>{{ value.CONTENT }}</div>
            <q-btn
              color="orange"
              @click="cancelBookMeeting(value.ID)"
              label="Hủy"
            />
            <q-btn
              color="primary"
              @click="showDialogEditBookMeeting(value)"
              label="Sửa"
            />
          </q-timeline-entry>
          <q-timeline-entry
            v-if="value.STATUS == 'delete'"
            v-bind:title="value.TITLE"
            v-bind:subtitle="` ${value.START_TIME.substring(
              11,
              16
            )}h - ${value.END_TIME.substring(11, 16)}h`"
            icon="delete"
          >
            <div>{{ value.CONTENT }}</div>
          </q-timeline-entry>
        </div>
      </q-timeline>
    </div>
    <q-dialog v-model="isEdit">
      <q-card>
        <div class="row">
          <div class="col-12 q-pa-sm">
            <q-select
              filled
              v-model="location"
              @input="selectLocation"
              label="Chọn địa điểm họp"
              :options="locations"
            />
          </div>
          <div class="col-12 q-pa-sm">
            <q-select
              filled
              v-model="meetingRoom"
              label="Chọn phòng họp"
              :options="meetingRooms"
            />
          </div>
          <q-input
            filled
            class="col-12 q-pa-sm"
            v-model="dateSelect"
            label="Chọn ngày *"
            mask="date"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                  filled
                >
                  <q-date v-model="dateSelect">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Close"
                        @click="selectDate"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div v-if="listBooking.length != 0" class="row">
          <q-list class="col-12 q-pa-sm" bordered separator>
            <q-item-label header>Danh sách cuộc họp trong ngày</q-item-label>
            <q-item
              v-for="(value, index) in listBooking"
              :key="index"
              clickable
              v-ripple
            >
              <q-item-section>
                <q-item-label
                  ><span class="text-red">{{ value.TITLE }}</span>
                </q-item-label>
                <q-item-label caption
                  >Từ {{ value.START_TIME.substring(11, 16) }} h đến
                  {{ value.END_TIME.substring(11, 16) }} h</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="row">
          <q-card> </q-card>
          <q-input
            filled
            class="col-6 q-pa-sm"
            v-model="startTime"
            label="Từ giờ *"
            mask="time"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="startTime" format24h>
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Close"
                        @click="checkStartTime"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            filled
            class="col-6 q-pa-sm"
            v-model="endTime"
            label="Đến giờ *"
            mask="time"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="endTime" format24h>
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Close"
                        @click="checkEndTime"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row">
          <q-input
            filled
            class="col-12 q-pa-sm"
            v-model="title"
            label="Tiêu đề cuộc họp *"
          />
        </div>
        <div class="row">
          <q-input
            class="col-12 q-pa-sm"
            v-model="content"
            label="Nội dung cuộc họp *"
            filled
            type="textarea"
          />
        </div>
        <div class="row">
          <q-uploader
            class="col-12 q-pa-sm"
            label="Tài liệu đính kèm <= 10Mb"
            :factory="uploadFile"
          >
          </q-uploader>
        </div>
        <div class="row">
          <q-input
            filled
            class="col-12 q-pa-sm"
            v-model="urlLink"
            label="Gắn Link cuộc họp"
          />
        </div>
        <div class="row">
        <q-select
          class="col-12 q-pa-sm"
          filled
          use-input
          input-debounce="0"
          v-model="nguoiChuTri"
          :options="users"
          label="Người chủ trì *"
          @filter="filterUser"
        />
      </div>
        <div class="row">
          <q-select
            class="col-12 q-pa-sm"
            filled
            use-input
            input-debounce="0"
            v-model="user"
            :options="users"
            @input="selectUser"
            label="Chọn người tham dự *"
            @filter="filterUser"
          />
        </div>
        <div class="col-12 q-pa-sm">
          <q-chip
            removable
            v-for="(value, index) in listUserSelected"
            :key="index"
            @remove="removeUser(value)"
            color="primary"
            text-color="white"
          >
            {{ value.name }}
          </q-chip>
        </div>
        <div class="row">
          <div class="col-3"></div>
          <q-btn
            rounded
            color="positive"
            class="col-6 q-pa-sm"
            icon-right="send"
            @click="updateBookMeetings"
            label="Sửa lịch họp"
          />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import axios from "axios";
import { showNotifyError, showNotifySuccess } from "../../../ultils";
export default {
  data() {
    return {
      events: [],
      date: null,
      isEdit: false,
      room: null,
      id: null,
      dateSelect: null,
      startTime: null,
      endTime: null,
      title: null,
      content: null,
      urlFile: null,
      urlLink: null,
      nguoiChuTri: null,
      user: null,
      users: [],
      arrUsers: [],
      listUserSelected: [],
      listBooking: [],
      selectedFile: "",
      uploadfile: false,
      listMeeting: [],
      location: null,
      locations: [
        {
          label: "Hà nội",
          value: "ha-noi",
        },
        {
          label: "Nhà máy Thuận Hưng",
          value: "nm-thuan-hung",
        },
        {
          label: "Nhà máy Quang Minh",
          value: "nm-quang-minh",
        },
        {
          label: "Nhà máy Tuyên Quang",
          value: "nm-tuyen-quang",
        },
      ],
      meetingRooms: [],
      meetingRoom: null,
    };
  },
  created() {
    this.loadUser();
    this.loadDateBooking();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("meeting", [
      "getMeetingRoomById",
      "updateBookMeeting",
      "createBookMeetingApproved",
      "getByStartTime",
      "getByEndTime",
      "getByDate",
      "getDateBooking",
      "getBookingInDay",
      "deleteBookMeeting",
      "getMeetingRoomByLocation",
    ]),
    ...mapActions("orders", ["getAllAccounts"]),
    async loadDateBooking() {
      const payload = {
        accountId: this.userInfo.id,
      };
      this.events = [];
      const data = await this.getDateBooking(payload);
      if (data.length > 0) {
        data.forEach((el) => {
          this.events.push(moment(el.DATE_SELECT).format("YYYY/MM/DD"));
        });
      }
      console.log("event", this.events);
    },
    selectLocation() {
      this.loadMeetingRooms();
    },
    async loadMeetingRooms() {
      this.meetingRooms = [];
      let book = await this.getMeetingRoomByLocation({
        location: this.location.value,
      });
      book.forEach((el) => {
        this.meetingRooms.push({
          value: el.ID,
          label: el.NAME,
        });
      });
    },
    async selectDateBooking() {
      this.listMeeting = [];
      const payload = {
        date: moment(this.date).format("YYYY-MM-DD"),
        accountId: this.userInfo.id,
      };
      const data = await this.getBookingInDay(payload);
      if (data.length > 0) {
        this.listMeeting = data;
      }
    },
    async showDialogEditBookMeeting(data) {
      this.id = data.ID;
      this.dateSelect = moment(data.DATE_SELECT).format("YYYY-MM-DD");
      this.startTime = data.START_TIME.substring(11, 16);
      this.endTime = data.END_TIME.substring(11, 16);
      this.title = data.TITLE;
      this.content = data.CONTENT;
      this.urlFile = data.URL_FILE;
      this.urlLink = data.URL_LINK;
      this.nguoiChuTri = this.users.find(u => u.value === data.NGUOI_CHU_TRI);
      let book = await this.getMeetingRoomByLocation({
        location: data.LOCATION,
      });
      book.forEach((el) => {
        this.meetingRooms.push({
          value: el.ID,
          label: el.NAME,
        });
      });
      console.log("meetingRooms", this.meetingRooms);
      this.meetingRoom = this.meetingRooms.find((m) => m.value == data.ROOM_ID);
      this.isEdit = true;
    },
    cancelBookMeeting(id) {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn thực sự muốn Hủy?",
          ok: {
            push: true,
          },
          cancel: {
            color: "negative",
          },
          persistent: true,
        })
        .onOk(() => {
          const payload = {
            id: id,
            accountId: this.userInfo.id,
          };
          this.deleteBookMeeting(payload);
          this.selectDateBooking();
        });
    },
    async loadMeetingRoom() {
      let id = this.$route.query.id;
      let data = await this.getMeetingRoomById({ id: id });
      this.room = data[0];
      console.log("room", this.room);
    },
    uploadFile(files) {
      if (this.title != "") {
        const selectedFile = files[0]; // accessing file
        this.selectedFile = selectedFile;
        this.urlFile = this.selectedFile.name;
        this.uploadfile = true;
        if (this.selectedFile.size > 10485760) {
          this.$q.dialog({
            html: true,
            message: `<span class="text-red">File upload lớn hơn dung lượng cho phép </span>`,
          });
        } else {
          const formData = new FormData();
          formData.append("myFile", this.selectedFile);
          axios
            .post("https://app.woodsland.com.vn:3003/uploadfile", formData)
            .then((res) => {
              showNotifySuccess();
            })
            .catch((err) => {
              showNotifyError();
            });
        }
      } else {
        this.$q.dialog({
          html: true,
          title: "Chú ý!",
          message: `<span class="text-red">Vui lòng nhập tiêu đề thông báo trước khi upload file ! </span>`,
          persistent: true,
        });
      }
    },
    async loadUser() {
      let accountALL = await this.getAllAccounts();
      accountALL.forEach((el) => {
        let customName = `${el.account} | ${el.lastName}`;
        this.users.push({
          label: customName,
          value: el.id,
          name: customName,
        });
      });
      this.arrUsers = this.users;
    },
    filterUser(val, update) {
      if (val === "") {
        update(() => {
          this.users = this.arrUsers;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.users = this.arrUsers.filter(function (str) {
          return str.name.toLowerCase().includes(needle);
        });
      });
    },
    async removeUser(value) {
      const index = this.listUserSelected.indexOf(value);
      if (index > -1) {
        this.listUserSelected.splice(index, 1);
      }
    },
    selectUser() {
      this.listUserSelected.push(this.user);
      this.user = null;
    },
    async updateBookMeetings() {
      if (
        this.dateSelect != null &&
        this.startTime != null &&
        this.endTime != null &&
        this.title != null &&
        this.content != null &&
        this.nguoiChuTri != null &&
        this.listUserSelected.length != 0
      ) {
        const payload = {
          id: this.id,
          title: this.title,
          content: this.content,
          dateSelect: moment(this.dateSelect).format("YYYY-MM-DD"),
          startTime: this.startTime,
          endTime: this.endTime,
          urlFile: this.urlFile,
          urlLink: this.urlLink,
          roomId: this.meetingRoom.value,
          accountId: this.userInfo.id,
        };
        console.log("payload", payload);
        const data = await this.updateBookMeeting(payload);
        if (data.length > 0) {
          // this.addUserMeeting(data[0].ID);
          this.loadDateBooking();
          this.selectDateBooking();
          this.isEdit = false;
          showNotifySuccess();
        } else {
          showNotifyError();
        }
      } else {
        this.$q.notify({
          message: "Nhập đầy đủ thông tin để tạo lịch họp",
          color: "negative",
          icon: "warning",
        });
      }
    },
    // addUserMeeting(bookingId) {
    //   this.listUserSelected.forEach((el) => {
    //     let payload = {
    //       bookingId: bookingId,
    //       accountId: el.value,
    //     };
    //     this.createBookMeetingApproved(payload);
    //   });
    //   this.listUserSelected = [];
    // },
    async checkStartTime() {
      const payload = {
        roomId: this.room.ID,
        startTime: this.startTime,
        date: moment(this.dateSelect).format("YYYY-MM-DD"),
      };
      let data = await this.getByStartTime(payload);
      if (data.length > 0) {
        this.startTime = null;
        this.$q.dialog({
          title: "Lỗi",
          message: "Thời gian này đã có người chọn. Vui lòng chọn lại giờ !",
        });
      }
    },
    async checkEndTime() {
      const payload = {
        roomId: this.room.ID,
        startTime: this.startTime,
        endTime: this.endTime,
        date: moment(this.dateSelect).format("YYYY-MM-DD"),
      };
      let data = await this.getByEndTime(payload);
      if (data.length > 0) {
        this.startTime = null;
        this.endTime = null;
        this.$q.dialog({
          title: "Lỗi",
          message: "Thời gian này đã có người chọn. Vui lòng chọn lại giờ !",
        });
      }
    },
    async selectDate() {
      const payload = {
        roomId: this.room.ID,
        date: moment(this.dateSelect).format("YYYY-MM-DD"),
      };
      let data = await this.getByDate(payload);
      this.listBooking = data;
    },
  },
};
</script>

<style>
</style>