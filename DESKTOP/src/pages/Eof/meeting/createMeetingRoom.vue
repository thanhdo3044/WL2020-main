<template>
  <q-page class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="top-title col-8">Danh mục phòng họp</div>
          <div v-if="ad" class="col-4" align="right">
            <!-- <q-btn
              flat
              color="primary"
              icon="add_circle_outline"
              label="Thêm sản phẩm"
              @click="addItem"
            /> -->
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12">
            <DxDataGrid
              id="gridContainer"
              :data-source="dataSource"
              :allow-column-reordering="true"
              :columns-auto-width="true"
              :show-borders="true"
              :show-column-lines="true"
              :allow-column-resizing="true"
              :word-wrap-enabled="true"
              key-expr="ID"
              @row-inserted="insert"
              @row-updated="updated"
              @row-removed="removed"
            >
              <DxPaging :enabled="true" />
              <DxEditing
                :allow-updating="true"
                :allow-adding="true"
                :allow-deleting="true"
                mode="popup"
              />
              <DxFilterRow :visible="true" />
              <DxHeaderFilter :visible="true" />
              <DxSearchPanel
                :visible="true"
                :width="440"
                placeholder="Tìm phòng họp"
              />

              <DxColumn data-field="ID" caption="Mã" :width="100" :visible="false" :allowEditing="false">
              </DxColumn>
              <DxColumn data-field="NAME" caption="Tên phòng" :width="200">
                <DxRequiredRule />
              </DxColumn>
              <DxColumn :width="120" data-field="TYPE" caption="Loại phòng" >
                <DxLookup
                  :data-source="types"
                  display-expr="label"
                  value-expr="value"
                />
                <DxRequiredRule />
              </DxColumn>
              <DxColumn data-field="DESCRIPTION" :width="300" caption="Mô tả">
                <DxRequiredRule />
              </DxColumn>
              <DxColumn
                data-field="MAX_PERSON"
                :width="150"
                caption="Số người tối đa"
                alignment="center"
              >
                <DxRequiredRule />
              </DxColumn>
              <!-- <DxColumn data-field="STATUS" :width="120" caption="Trạng thái">
                <DxRequiredRule />
              </DxColumn> -->
              <DxColumn data-field="LOCATION" :width="300" caption="Địa điểm">
                <DxLookup
                  :data-source="locations"
                  display-expr="label"
                  value-expr="value"
                />
                <DxRequiredRule />           
              </DxColumn>
            </DxDataGrid>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxLookup,
  DxSearchPanel,
  DxHeaderFilter,
  DxFilterRow,
  DxRequiredRule,
} from "devextreme-vue/data-grid";
import { showNotifySuccess, showNotifyError } from "../../../ultils";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxLookup,
    DxSearchPanel,
    DxHeaderFilter,
    DxFilterRow,
    DxRequiredRule,
  },
  data() {
    return {
      dataSource: [],
      types: [
        {
          label: "Lớn",
          value: "big",
        },
        {
          label: "Nhỏ",
          value: "small",
        },
      ],
      locations: [
        {
          label: "Hà nội",
          value: "ha-noi"
        },
        {
          label: "Nhà máy Thuận Hưng",
          value : 'nm-thuan-hung'
        },
        {
          label: "Nhà máy Quang Minh",
          value: "nm-quang-minh"
        },
        {
          label: "Nhà máy Tuyên Quang",
          value: "nm-tuyen-quang"
        }
      ]
    };
  },
  created() {
    this.load();
  },
  computed:{
    ...mapGetters("base", ["userInfo"]),
  },
  methods: {
    ...mapActions("meeting", ["getMeetingRooms", "createMeetingRoom", "updateMeetingRoom", "deleteMeetingRoom"]),
    async load() {
      const data = await this.getMeetingRooms();
      this.dataSource = data;
    },
    async insert(e) {
       let payload = {
        name: e.data.NAME,
        type: e.data.TYPE,
        description: e.data.DESCRIPTION,
        maxPerson: e.data.MAX_PERSON,
        status: "available",
        location: e.data.LOCATION,
        accountId: this.userInfo.id
      };
      const data = await this.createMeetingRoom(payload);
      console.log('data',data)
      if (data.length != 0) {
        await  this.load();
        showNotifySuccess("Tạo thành công !");
      } else {
        showNotifyError();
      }   
    },
    async updated(e){
      let payload = {
        id: e.data.ID,
        name: e.data.NAME,
        type: e.data.TYPE,
        description: e.data.DESCRIPTION,
        maxPerson: e.data.MAX_PERSON,
        status: "available",
        location: e.data.LOCATION,
        accountId: this.userInfo.id
      };
      const data = await this.updateMeetingRoom(payload);
      console.log('data',data)
      if (data.length != 0) {
        await  this.load();
        showNotifySuccess("Sửa thành công !");
      } else {
        showNotifyError();
      }   
    },
    async removed(e){
      const data = await this.deleteMeetingRoom({id: e.data.ID});
      if (data.length != 0) {
        await  this.load();
        showNotifySuccess("Xóa thành công !");
      } else {
        showNotifyError();
      }
    }
  },
};
</script>

<style>
</style>