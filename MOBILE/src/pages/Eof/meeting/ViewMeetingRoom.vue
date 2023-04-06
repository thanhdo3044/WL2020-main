<template>
  <div>
    <div class="row justify-center">
      <div class="page-title">
        <div class="col-auto text-primary">Chọn hình thức họp</div>
      </div>
    </div>
    <div class="row q-pa-sm">
      <q-btn
        class="activeRoom glossy col-4"
        @click="clickOnline"
        rounded
        color="positive"
        label="online"
      />
      <div class="col-4"></div>
      <q-btn
        class="activeRoom glossy col-4"
        @click="clickOffline"
        rounded
        color="positive"
        label="offline"
      />
    </div>
    <div v-if="online">
      <div class="row">
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
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="row">
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
                    <q-btn v-close-popup label="Close" color="primary" flat />
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
                    <q-btn v-close-popup label="Close" color="primary" flat />
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
          @click="addBookMeeting"
          label="Tạo lịch họp"
        />
      </div>
    </div>
    <div v-if="!online">
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
      </div>
      <q-list bordered separator>
        <q-item
          v-for="(value, index) in meetingRooms"
          :key="index"
          clickable
          v-ripple
          :active="active"
        >
          <q-item-section>
            <q-item-label>{{ value.NAME }}</q-item-label>
            <q-item-label caption>
              <span class="material-icons"> person </span>
              {{ value.MAX_PERSON }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <button
              type="button"
              v-on:click="onBooking(value.ID, value.NAME)"
              class="btn-meeting"
            >
              <span class="material-icons"> event_available </span>
            </button>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import moment from "moment";
import { showNotifyError, showNotifySuccess } from "../../../ultils";
export default {
  data() {
    return {
      active: true,
      online: true,
      nguoiChuTri: null,
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
      dateSelect: null,
      startTime: null,
      endTime: null,
      title: null,
      content: null,
      urlFile: null,
      urlLink: null,
      user: null,
      users: [],
      arrUsers: [],
      listUserSelected: [],
      selectedFile: "",
      uploadfile: false,
    };
  },
  created() {
    this.loadUser();
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("meeting", [
      "getMeetingRoomByLocation",
      "createBookMeeting",
      "createBookMeetingApproved",
    ]),
    ...mapActions("orders", ["getAllAccounts"]),
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
            .post(`http://localhost:3003/uploadfile`, formData)
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
    async loadMeetingRoom() {
      const payload = {
        location: this.location.value,
      };
      const data = await this.getMeetingRoomByLocation(payload);
      this.meetingRooms = data;
      console.log("data", data);
    },
    selectLocation() {
      this.loadMeetingRoom();
    },
    clickOnline() {
      this.online = true;
    },
    clickOffline() {
      this.online = false;
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
    async addBookMeeting() {
      console.log("ngoi chu tri", this.nguoiChuTri);
      console.log("list user select", this.listUserSelected);
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
          title: this.title,
          content: this.content,
          dateSelect: moment(this.dateSelect).format("YYYY-MM-DD"),
          startTime: this.startTime,
          endTime: this.endTime,
          urlFile: this.urlFile,
          urlLink: this.urlLink,
          roomId: null,
          nguoiChuTri: this.nguoiChuTri.value,
          accountId: this.userInfo.id,
        };
        const data = await this.createBookMeeting(payload);
        if (data.length > 0) {
          this.dateSelect = null;
          this.startTime = null;
          this.endTime = null;
          this.title = null;
          this.content = null;
          this.urlFile = null;
          this.urlLink = null;
          this.nguoiChuTri = null;
          console.log("data", data);
          this.addUserMeeting(data[0].ID);
          showNotifySuccess();
        } else {
          showNotifyError();
        }
      }else{
        this.$q.notify({
          message: 'Nhập đầy đủ thông tin các trường đánh dấu (*) để tạo lịch họp',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    addUserMeeting(bookingId) {
      this.listUserSelected.forEach((el) => {
        let payload = {
          bookingId: bookingId,
          accountId: el.value,
        };
        this.createBookMeetingApproved(payload);
      });
      this.listUserSelected = [];
    },
    onBooking(id, name) {
      this.$router.push({ path: "/create-book-meeting", query: { id: id } });
    },
  },
};
</script>

<style>
.btn-meeting {
  background-color: white;
  border: none;
  font-size: 22px;
  color: orange;
}
.activeRoom:active {
  background-color: red;
}
</style>