<template>
  <q-page class="bg-blue-grey-7">
    <div class="row">
      <div class="col-12">
        <q-btn
      v-show="showListPackage"
      align="around"
      @click="showDialogErr"
      class="btn-fixed-width q-mb-sm text-white"
      style="background-color:#f6b024"
      label="Thông báo: Có phôi chờ xử lý"
    />
      </div>
      <div class="col-12">
        <q-btn
      v-show="showListPackageRough"
      align="around"
      @click="onShowDialogRough"
      class="btn-fixed-width q-mb-sm bg-red text-white"
      label="Thông báo: Có phôi chờ nhận"
    />
      </div>
    </div>


  <div class="row">
    <div class="col-1">
      <q-icon color="white" name="keyboard_arrow_left" size="36px" @click="goBack"></q-icon>
    </div>
    <div class="col-10">
      <q-input dark outlined v-model="searchQuery1" dense>
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    </div>
  </div>


    <q-dialog v-model="dialogErr">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            Danh sách lỗi công đoạn chờ nhận <br />
            {{ congdoan.name }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list separator>
            <q-item
              class="q-mt-sm bg-cyan-1 shadow-8 text-black"
              v-for="(item, index) in listPackage"
              :key="index"
            >
              <q-item-section>
                <div>
                  Chi tiết/cụm : <b>{{ item.Chi_tiet_cum }}</b>
                </div>
                 <div>
                  Quy cách : <b>{{ item.HEIGHT }} x {{ item.WIDTH }} x {{ item.LENGTH }}   </b>
                </div>
                <div>
                  Số lượng : <b>{{ item.So_luong }}</b>
                </div>
                <div>
                  Loại lỗi : <b>{{ item.Loai_loi }}</b>
                </div>
                <div>
                  Biện pháp xử lý : <b>{{ item.BP_xu_ly }}</b>
                </div>
                <div>
                  Người tạo : <b>{{ item.Nguoi_tao }}</b>
                </div>
                <div>
                  Ngày tạo : <b>{{ moment(item.Ngay_tao).format("l") }}</b>
                </div>
                <br />

            <div class="row">

                <div class="col-9">
                 <q-btn
                    @click="confirmloi(item)"
                    class="bg-positive text-white"

                  > Xác nhận
                 </q-btn>
                </div>
                <div class="col-3" >
                    <q-btn
                    @click="huyloixn(item)"
                    class="bg-red text-white"
                  > Từ chối
                    </q-btn>

                </div>
            </div>
              </q-item-section>

            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDialogRough">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            Danh sách phôi chờ nhận <br />
            {{ congdoan.name }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list separator>
            <q-item
              class="q-mt-sm bg-cyan-1 shadow-8 text-black"
              v-for="(item, index) in listRough"
              :key="index"
            >
              <q-item-section>
                 <div>
                  Mã TP : <b>{{ item.MATP }}</b>
                </div>
                <div>
                  Tên : <b>{{ item.NAME }}</b>
                </div>
                <div>
                  Công đoạn giao : <b>{{ item.SOURCE_ID_NAME }}</b>
                </div>
                <div>
                  Quy cách :
                  <b>{{
                    item.LENGTH + "x" + item.WIDTH + "x" + item.HEIGHT
                  }}</b>
                </div>
                <div>
                  Số lượng : <b>{{ item.QUANTITY }}</b>
                </div>

                <div  v-for="item1 in item.pallet"
                 v-bind:key="item1.ID">
                 <div v-if="congdoan.id == 100071">
                 Xếp Pallet: <b> {{item1.tenpallet}} </b>
                </div>
                <div v-if="congdoan.id == 100071">
                  SL Pallet: <b> {{item1.QUANTITY}} </b>
                </div>
                </div>
                <div>
                  <q-badge color="green-4"
                    >Người tạo : {{ item.LAST_NAME }}
                  </q-badge>
                </div>
                <div style="color: purple; font-weight: bold">
                  Ngày tạo : <b>{{ item.ngay }}</b>
                </div>
                <div style="color: purple; font-weight: bold">
                  Thời gian tạo:
                  <b
                    >{{ item.giogiao }}:{{ item.phutgiao }}:{{
                      item.giaygiao
                    }}</b
                  >
                </div>

                <div>
                  <q-btn
                    v-show="nhanve[index]"
                    @click="confirm(item)"
                    class="bg-positive text-white"
                    no-caps
                    label="Xác nhận"
                  />
                  <hr width="60%" align="center" />
                </div>

                <q-item-label caption>
                  <div>
                    <q-radio
                      @input="nhanvesl(index)"
                      v-model="selectionTT[index]"
                      val="Số lượng chưa chuẩn"
                      label="Số lượng chưa chuẩn"
                      color="red"
                      style="color: orange; font-weight: bold; font-size: 14px"
                    />
                  </div>
                  <div>
                    <q-radio
                      @input="nhanvesl(index)"
                      v-model="selectionTT[index]"
                      val="Chất lượng không đạt"
                      label="Chất lượng không đạt"
                      color="red"
                      style="color: orange; font-weight: bold; font-size: 14px"
                    />
                  </div>
                  <div>
                    <q-radio
                      @input="nhanvesl(index)"
                      v-model="selectionTT[index]"
                      val="Lý do khác"
                      label="Lý do khác"
                      color="red"
                      style="color: orange; font-weight: bold; font-size: 14px"
                    />
                  </div>
                  <div class="row">
                    <div class="col-6" align="center">
                      <q-btn
                        v-show="!nhanve[index]"
                        @click="capnhat(item, index)"
                        class="bg-orange text-white"
                        no-caps
                      >
                        Cập nhật <br />
                        trạng thái
                      </q-btn>
                    </div>
                    <div class="col-6" align="right">
                      <q-btn
                        style="font-size: 21px"
                        v-show="!nhanve[index]"
                        @click="huy(index)"
                        class="bg-positive text-white"
                        no-caps
                      >
                        Hủy
                      </q-btn>
                    </div>
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="activePackage"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card  style="width: 300px">
      <q-card-actions align="left" class="text-white" style="width:40%">
        </q-card-actions>

        <q-card-section
          class="q-pt-none"
          style="font-size: 16px;"
        >
          Bạn đã chắc chắn nhận số lượng: <b   style="font-size: 20px; font-weight: bold"> {{ slnew }} </b>
        </q-card-section>

        <q-card-actions align="right" >
          <q-btn class="bg-positive text-white" label="Xác nhận" @click="activeSuccess" v-close-popup />
          <q-btn class="bg-orange text-white" label="Thoát" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="loi" transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px">

          <q-card-section align="right" class="text-positive">
          <q-btn flat label="Xác nhận"/>
        </q-card-section>

        <q-card-section
          class="q-pt-none"
          style="font-size: 20px; font-weight: bold"
        >
          Bạn đã chắc chắn nhận số lượng: <q-badge style="font-size:17px"><b> {{ slnew }} </b></q-badge>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-positive">
          <q-btn
            label="Xác nhận"
            @click="activeSuccessloi"
            color="positive"
            v-close-popup
          />
          <q-btn label="Thoát" color="orange" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
        <q-dialog v-model="huyloi1" transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px">

          <q-card-section align="right" class="text-positive">

        </q-card-section>

        <q-card-section
          class="q-pt-none"
          style="font-size: 20px; font-weight: bold"
        >
          Bạn đã chắc chắn hủy
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-positive">
          <q-btn
            label="Xác nhận"
            @click="activeSuccesshuyloi"
            color="positive"
            v-close-popup
          />
          <q-btn label="Thoát" color="orange" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- <no-tasks v-if="!pos(null).length"></no-tasks> -->
    <div class="row">
      <div class="col-12" align="center">
      <span style="color:#f6b024">
        [{{ congdoan.code }}]
      </span>
      <span class="text-bold" style="color:#f6b024">{{ congdoan.name }}</span>

      <q-menu touch-position>
        <q-list  style="min-width: 120px;">
          <q-item

            clickable
            v-close-popup
            v-for="item in departments"
            :key="item.id"
          >
            <q-item-section @click="chonCongdoan(item)">
              <span class="text-primary">[{{item.code}}]</span> <span class="text-bold">{{ item.name }}</span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
    </div>
    <q-list separator bordered>
      <div v-for="(task1, key) in dataReceiptFilter" :key="key" :style="colors[key]">
  <q-badge outline style="border: 1px solid #f6b024;background-color:#21BA45;font-weight:bold">
              {{ task1.sp }}
            </q-badge>
            <div v-for="(task, index1) in task1.root" :key="index1" class="col-12" >
        <q-item
        @click="showConfirmDialog(task.number, task.conThucHien, task.root)"
        clickable
        v-ripple
      >
        <q-item-section>
          <q-item-label class="text-subtitle2 text-white" style="font-size:12px">
            {{ task.itemName }} ({{ task.itemHeight }}*{{ task.itemWidth }}*{{
              task.itemLength
            }}
            )
          </q-item-label>
          <q-item-label caption lines="2">

          </q-item-label>
          <div>
      <div v-for="(lsx, index) in task.number" :key="index" class="col-12">
        <div class="row">
          <div v-if="index == 0" class="col-4 header" ><span style="color:#f6b024;">LSX </span></div>
          <div v-if="index == 0" class="col-2 header" ><span style="color:#f6b024;">SL</span></div>
          <div v-if="index == 0" class="col-2 header" ><span style="color:#f6b024;">Đã làm</span></div>
             <div v-if="index == 0" class="col-2 header" ><span style="color:#f6b024;">Lỗi</span></div>
          <div v-if="index == 0" class="col-2 header"><span style="color:#f6b024;">Còn TH</span></div>
             <div v-if="index == 0" class="col-4 header bg-blue-grey-8"  style="border: 1px solid #f6b024;"><span style="background-color:#21BA45;color:white">Tổng SL</span></div>
             <div v-if="index == 0" class="col-2 header bg-blue-grey-8"  style="border: 1px solid #f6b024;"><span style="background-color:#21BA45;color:white"></span></div>
                <div v-if="index == 0" class="col-2 header bg-blue-grey-8"  style="border: 1px solid #f6b024;"><span style="background-color:#21BA45;color:white"></span></div>
                  <div v-if="index == 0" class="col-2 header bg-blue-grey-8"  style="border: 1px solid #f6b024;"><span style="background-color:#21BA45;color:white"></span></div>
           <div v-if="index == 0" class="col-2 header bg-blue-grey-8" style="border: 1px solid #f6b024;"><span style="background-color:#21BA45;color:white">{{task.conThucHien}}</span></div>
          <div class="col-4 columnTable text-white bg-blue-grey-8" style="border: 1px solid #f6b024;">
            {{ lsx.number }}
          </div>
          <div class="col-2 columnTable text-white bg-blue-grey-8" style="border: 1px solid #f6b024;">
            {{ lsx.keHoach }}
          </div>
          <div class="col-2 columnTable text-white bg-blue-grey-8" style="border: 1px solid #f6b024;">
            {{ lsx.totalQuantity }}
          </div>
           <div class="col-2 columnTable text-white bg-blue-grey-8" style="border: 1px solid #f6b024;">
            {{ lsx.loiCongDon }}
          </div>
          <div class="col-2 columnTable text-white bg-blue-grey-8" style="border: 1px solid #f6b024;">{{ lsx.conThucHien }}</div>

        </div>
      </div>

          </div>

          <!-- <q-item-label>
            <q-badge :color="'positive'">
              {{ task.number[0].number }}
            </q-badge>
          </q-item-label> -->
        </q-item-section>
        <!-- <q-item-section side top>

          <q-badge style="background-color:#f6b024;" :label="task.conThucHien" />
        </q-item-section> -->
      </q-item>
      <hr style="width:90%">
      </div>
       </div>
    </q-list>



    <q-dialog v-model="card" :maximized="false">
      <q-card v-if="po" class="my-card">
        <q-card-section>
          <q-btn
          dense
           style="background-color:#f6b024;height:20px; font-size:10px"
            icon="keyboard_arrow_left"
            label="Trở lại"
            v-close-popup
          />
          <q-input
            v-model="po.itemName"
            :readonly="true"
            type="text"
            label="Sản phẩm/Chi tiết"
          />
          <div class="row">
            <div class="col-4" align="center">
              <q-input
                v-model="po.itemHeight"
                :readonly="true"
                type="text"
                label="Dầy"
              />
            </div>
            <div class="col-4" align="center">
              <q-input
                v-model="po.itemWidth"
                :readonly="true"
                type="text"
                label="Rộng"
              />
            </div>
            <div class="col-4" align="center">
              <q-input
                v-model="po.itemLenght"
                :readonly="true"
                type="text"
                label="Dài"
              />
            </div>
          </div>
          <q-list>
            <div
              header
              style="padding-top: 10px; font-size: 12px; font-weight: bold"
              class="text-blue"
            >
              Số lượng phôi đã nhận và phôi tồn tại tổ:
            </div>
            <div
              class="bg-green-2"
              v-for="phoi in po.nguyenLieu"
              :key="phoi.ITEM_ID"
            >
              <q-separator />
              <q-item style="padding-left: 0px">
                <q-item-section>
                  <q-item-label caption lines="3" class="text-blue"
                    >{{ phoi.NAME }} {{ phoi.HEIGHT }} * {{ phoi.WIDTH }} *
                    {{ phoi.LENGTH }}: <q-badge :label="phoi.ton"
                  /></q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <q-separator />
            <div style="padding-left: 0px; padding-top: 0px">
              <hr />
              <q-item-section class="text-positive">
                <q-item-label
                  dense
                  caption
                  lines="2"
                  class="text-positive"
                  style="font-size: 12px; font-weight: bold"
                >
                  Số lượng tối đa có thể xuất:
                  <q-badge class="bg-positive" :label="maxCoTheGhiNhan"
                /></q-item-label>
              </q-item-section>
            </div>
          </q-list>
          <hr />
          <div>
            <div style="padding-left: 0px; padding-top: 0px">
              <q-item-section  style="padding-top: 0px">
                <q-item-label
                  caption
                  lines="2"
                  class="text-amber"
                  style="font-size: 12px; padding-top: 0px; font-weight: bold"
                >
                  Số lượng còn phải sản xuất:
                  <q-badge class="bg-amber" :label="ghinhan"
                /></q-item-label>
              </q-item-section>
            </div>
            <hr />
          </div>

          <q-input
            v-model.number="confirmQty"
            filled
            stack-label
            class="bg-blue-grey-11"
            label-color="primary"
            type="number"
            style="font-style: oblique"
            label="Nhập số lượng ghi nhận"
          />

  <div v-show="donggoi" class="row" style="padding-top:10px">
 <div class="col-8">
        <q-select
         outlined
          stack-label
          label-color="orange"
          style="font-size: 14px"
          v-model="pallet2"
          :options="pallets2"
          label="Chọn Pallet"
        />
 </div>
  <div class="col-4">
        <q-input
        outlined
            stack-label
          v-model.number="quantityPallet"
          label-color="orange"
          type="number"
          style="font-size: 14px"
          label="SL pallet"
        />
  </div>
 <q-btn

      align="around"
      @click="thempallet"
      style="font-size: 10px"
      class="width = 60 q-mb-sm bg-orange text-white"
      label="Chọn thêm PALLET"
    />
    <div
      v-if="pallet1.length > 0"
      class="row"
      style="border: 1px solid black; padding: 5px"
    >
      <div v-for="(cat, index) in pallet1" :key="index" class="col-12">
        <div class="row">
          <div v-if="index == 0" class="col-6 header">Loại Pallet</div>
          <div v-if="index == 0" class="col-4 header">Số lượng</div>
          <div v-if="index == 0" class="col-2 header">Xóa</div>
          <div class="col-6 columnTable">
            {{ cat.pallet }}
          </div>
          <div class="col-4 columnTable">{{ cat.soluong }}</div>
          <div class="col-2 columnTable">
            <q-btn @click="deletepallet(cat)" color="red" label="X" />
          </div>
        </div>
      </div>
    </div>
  </div>
   <div class="col-3" style="margin-left:-10px">
    <q-checkbox
              v-show="donggoi || donggoi1"
              @input="chuyenkho()"
              v-model="selectionBTP"
               color="orange"
              style="color:#21BA45;font-weight:bold;font-size:11px"
              label="Xuất CONT"
            /> <i  v-show="donggoi || donggoi1" style="color:#21BA45;font-size:11px">(Trường hợp xuất CONT trực tiếp từ ĐG)</i>
  </div>

          <hr v-if="lengthR > 0" />
          <div v-if="listRoughR">
            <q-item
            dense
            style="
              padding-left: 0px;
              border: 1px solid grey;
              margin-bottom: 2px;
            "
            v-for="(item, index) in listRoughR.filter(l => l.TYPE_ID == 100026)"
            :key="index"
          >
            <q-item-section v-if="item.VERIFY_BY" style="">
              <q-item-label
                caption
                lines="2"
                class="text-red"
                style="font-size: 14px; font-weight: bold"
              >
                Phôi trả lại:
                <q-badge class="bg-red" :label="item.QUANTITY" />
              </q-item-label>
              <q-item-label
                caption
                lines="2"
                class="text-orange"
                style="font-size: 14px; font-weight: bold"
              >
                Lý do: <br />
                <q-badge class="bg-red" :label="item.status"
              /></q-item-label>
            </q-item-section>
            <q-item-section v-else-if="item.QC_VERIFY_BY == null && item.STEP_QC">
              <q-item-label
                caption
                lines="2"
                class="text-light-green"
                style="font-size: 12px; font-weight: bold"
              >
                Số lượng đã giao chờ QC xác nhận:
                <q-badge class="bg-light-green" :label="item.QUANTITY"
              /></q-item-label>
              <q-item-label
                caption
                lines="2"
                class="text-purple"
                style="font-size: 12px; font-weight: bold"
              >
                Thời gian giao:{{ item.ngay }} {{ item.gio }}:{{ item.phut }}:{{
                  item.giay
                }}
              </q-item-label>
            </q-item-section>
               <q-item-section v-else>
              <q-item-label
                caption
                lines="2"
                class="text-orange"
                style="font-size: 12px; font-weight: bold"
              >
                Số lượng đã giao chờ SX xác nhận:
                <q-badge class="bg-orange" :label="item.QUANTITY"
              /></q-item-label>
              <q-item-label
                caption
                lines="2"
                class="text-purple"
                style="font-size: 12px; font-weight: bold"
              >
                Thời gian giao:{{ item.ngay }} {{ item.gio }}:{{ item.phut }}:{{
                  item.giay
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label caption>
                <q-btn
                  style="font-size: 10px"
                  dense
                  color="red"
                  label="Xóa"
                  @click="onshowshowConfirmDel(item.ID)"
              /></q-item-label>
            </q-item-section>
          </q-item>
          </div>
          <div v-if="listRoughR">
            <q-item
            dense
            style="
              padding-left: 0px;
              border: 1px solid grey;
              margin-bottom: 2px;
            "
            v-for="(item, index) in listRoughR.filter(l => l.TYPE_ID == 100004)"
            :key="index"
          >
            <q-item-section v-if="item.VERIFY_BY" style="">
              <q-item-label
                caption
                lines="2"
                class="text-red"
                style="font-size: 14px; font-weight: bold"
              >
                Phôi trả lại:
                <q-badge class="bg-red" :label="item.QUANTITY" />
              </q-item-label>
              <q-item-label
                caption
                lines="2"
                class="text-orange"
                style="font-size: 14px; font-weight: bold"
              >
                Lý do: <br />
                <q-badge class="bg-red" :label="item.status"
              /></q-item-label>
            </q-item-section>
            <q-item-section v-else>
              <q-item-label
                caption
                lines="2"
                class="text-red"
                style="font-size: 12px; font-weight: bold"
              >
                Số lượng ghi nhận lỗi chờ xác nhận:
                <q-badge class="bg-red" :label="item.QUANTITY"
              /></q-item-label>
              <q-item-label
                caption
                lines="2"
                class="text-purple"
                style="font-size: 12px; font-weight: bold"
              >
                Thời gian giao:{{ item.ngay }} {{ item.gio }}:{{ item.phut }}:{{
                  item.giay
                }}
              </q-item-label>
            </q-item-section>

            <q-item-section side center>
              <q-item-label caption>
                <q-btn
                  style="font-size: 10px"
                  dense
                  color="red"
                  label="Xóa"
                  @click="onshowshowConfirmDel(item.ID)"
              /></q-item-label>
            </q-item-section>
          </q-item>
          </div>

        <hr>
        <div v-show="luaphoi">
        <q-select
         filled
          stack-label
          use-input
          input-debounce="0"
          @filter="searchItem2"
          label-color="orange"
          style="font-style: oblique; font-size: 14px"
          v-model="item2"
          :options="items2"
          label="Chọn qui cách thô từ phiếu chỉ định"
        />
    <hr>

        <q-input
        filled
            stack-label
          v-model.number="quantity2"
          label-color="orange"
          type="number"
          style="font-style: oblique; font-size: 14px"
          label="Số lượng"
        />
     <q-btn

      align="around"
      @click="them"
      style="font-size: 10px"
      class="width = 60 q-mb-sm bg-orange text-white"
      label="Chọn thêm QC thô"
    />
    <div
      v-if="qccatve.length > 0"
      class="row"
      style="border: 1px solid black; padding: 5px"
    >
      <div v-for="(cat, index) in qccatve" :key="index" class="col-12">
        <div class="row">
          <div v-if="index == 0" class="col-6 header">Quy cách sau lựa</div>
          <div v-if="index == 0" class="col-4 header">Số lượng</div>
          <div v-if="index == 0" class="col-2 header">Xóa</div>
          <div class="col-6 columnTable">
            {{ cat.height }}x{{ cat.width }}x{{ cat.length }}
          </div>
          <div class="col-4 columnTable">{{ cat.soluong }}</div>
          <div class="col-2 columnTable">
            <q-btn @click="deleteQCSauLua(cat)" color="red" label="X" />
          </div>
        </div>
      </div>
    </div>
          <hr />
        </diV>
          <div style="padding-top: 0px">
            <q-item-section class="text-red" style="padding-top: 0px">
              <q-item-label
                caption
                lines="2"
                class="text-red"
                style="font-size: 12px; padding-top: 0px; font-weight: bold"
              >
                Lỗi báo từ công đoạn trước:
                <q-badge class="bg-red" :label="po.loiCongDon"
              /></q-item-label>
            </q-item-section>
            <hr />
          </div>

          <q-input
            v-model.number="defectQty"
            :readonly="false"
            filled
            stack-label
            type="number"
            style="padding-top: 0px; font-style: oblique"
            label-color="red"
            label="Khai báo số lượng lỗi:"
          />
          <div
            class="q-gutter-sm"
            v-if="defectQty && po.nguyenLieu.length >= 1"
          >
            <q-radio
            v-if="this.congdoan.id == 100280"
              v-model="selection"
              :val="po.itemId"
              :label="po.itemName"
              color="positive"
            />

            <q-radio
              v-for="phoi in po.nguyenLieu"
              :key="phoi.ITEM_ID"
              v-model="selection"
              :val="phoi.ITEM_ID"
              :label="phoi.NAME +' '+phoi.HEIGHT +'x'+phoi.WIDTH+'x'+phoi.LENGTH"
              color="positive"
            />
          </div>
          <hr />
          <q-select
            filled
            v-model="factory"
            :options="options"
            label-color="red"
            stack-label
            label="Lỗi phôi nhận về từ NM khác"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click.stop="factory = ''"
                class="cursor-pointer"
              />
            </template>
          </q-select>
            <hr />
          <q-item-label
            caption
            lines="4"
            class="bg-blue-grey-11 text-primary"
            style="font-size: 11px; padding-top: 0px; font-weight: bold"
          >
            Công đoạn SX tiếp theo:
            <div v-if="dai > 1">
              <q-radio
                v-for="phoi in po.nextstepId"
                :key="phoi.STEP_ID"
                v-model="selectionstepId"
                :val="phoi.STEP_ID"
                :label="phoi.NAME"
                color="orange"
              >
              </q-radio>
            </div>
            <div v-else>
              <q-badge class="bg-primary text-white" :label="nhan" />
            </div>
          </q-item-label>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            color="positive"
            label="Ghi nhận"
            @click="dongbosp"
          />
          <q-btn style="background-color:#f6b024" label="Đóng" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
   <q-dialog
      v-model="secondDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 600px">
        <q-card-section
          class="q-pt-none"
          style="padding-top: 10px; font-size: 18px"
        >
          <p v-if="confirmQty">
            Ghi nhận sản lượng:
            <q-badge color="positive" style="font-size: 16px">{{
              confirmQty
            }}</q-badge>
          </p>
          <p v-if="description">
            Dấu tuần: <q-badge color="positive">{{ description }}</q-badge>
          </p>
          <span v-if="defectQty" style="color: red">Lỗi : {{ defectQty }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="OK" @click="add" color="positive" v-close-popup />
          <q-btn color="orange" label="hủy" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="dialogdongbo"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 600px">
        <q-card-section v-if="po.dongbo && lengthdongbo>0" style="color: blue">
          <div v-if="po.dongbo.length > 1"  style="font-size:14px">
             <p class="text-orange">Yêu cầu giao nhận phôi được giới hạn đồng bộ chênh lệch không quá 50% tương ứng với số lượng của LSX</p>
                   <hr width ="50%">
          <p class="text-primary">  Số lượng đã giao (đã quy đồng bộ)   <span class="text-positive">  {{this.po.itemName}}:<b class="text-primary"> {{ dongbo }} </b></span> </p>
          </div>
          <hr width ="50%">
        </q-card-section>

        <q-card-section v-if="po.dongbo &&lengthdongbo>0" style="padding-top: 0px">
          <div v-if="po.dongbo.length > 1" style="font-size:14px;color: red">
            Bạn đang giao phôi không đồng bộ. Yêu cầu giao các chi tiết sau để đồng bộ sản phẩm:
          </div>
          <div v-for="ctdongbo in po.dongbo.filter(e => e.QUANTITY <dongbo)" :key="ctdongbo.itemId" style="border:1px solid black; margin-top:3px">
            <div >
              <b class="text-positive" style="font-size:12px">{{ ctdongbo.NAME }}</b>
            </div>
            <div style="font-size:12px">
              <b class="text-primary">Đã giao: {{ ctdongbo.QUANTITY }} <p class="text-orange"> Số lượng cần giao đồng bộ: {{dongbo - ctdongbo.QUANTITY}} </p></b>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Đồng ý"  color="primary" v-close-popup />

        </q-card-actions>
      </q-card>
    </q-dialog>
    <DialogSuccess
      :closeDialog2="closeDialog2"
      :palletCode="packageString"
      :show="showSuccess"
      :closeDialog="closeSuccessDialog"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { showNotifySuccess, showNotifyError } from "../../utils/utils";
import DialogSuccess from "../../components/prod/DiaLogCreatePalletSuccess";
import { fasCheck } from "@quasar/extras/fontawesome-v5";
export default {
  data() {
    return {
      selection: null,
      selectionstepId: null,
      selectionBTP: false,
      selectionTT: [],
      nhan: null,
      dai: 0,
      quantityPallet:null,
      dialogdongbo:false,
      slnew: 0,
       colors:[

      'border: 3px solid yellow',
      'border: 3px solid #00aefd',
      'border: 3px solid yellow',
      'border: 3px solid #00aefd',
      'border: 3px solid yellow',
      'border: 3px solid #00aefd',
      'border: 3px solid yellow',
      'border: 3px solid #00aefd',
      'border: 3px solid yellow',
      'border: 3px solid #00aefd',
      'border: 3px solid yellow',
      'border: 3px solid #00aefd',
      'border: 3px solid yellow',
      'border: 3px solid #00aefd',
       ],

      nhanve: [],
      pallet1:[],
      quantity2: null,
      luaphoi:false,
      donggoi:false,
      donggoi1:false,
      items2: [],
      pallets2:[],
      qccatve:[],
      item2: null,
      pallet2:null,
      dongbtp: true,
      source_Id: null,
      maxCoTheGhiNhan: 0,
      tongton: 0,
      secondDialog: false,
      congdoan: null,
      showListPackage: false,
      description: "",
      searchQuery: "",
      searchQuery1:"",
       searchQuery2:"",
      ghinhan: 0,
      giaonhan: true,
      tongphoi: [],
      tongphoi1: 0,
      arr: "",
      card: false,
      task: null,
      standard: 0,
      showSuccess: false,
      packageId: "",
      confirmQty: "",
      confirmData: "", // số lượng cần sản xuất
      target: "",
      defectQty: "",
      receiptQty: "",
      historys: [],
      lenhsanxuat: "",
      chonhanxacnhan: 0,
      hesodm: "",
      maxQtyConfirm: 0,
      packageString: "",
      listRough: null,
      listRoughR: null,
      listRoughold: null,
      showListPackageRough: false,
      showDialogRough: false,
      iconfasCheckCircle: fasCheck,
      totalDeliver: 0,
      factory: null,
      fa:100000,
      nguonPhoi: null,
      options: [
        // {
        //   label: "Nhà máy CBG Quang Minh",
        //   id: 102427,
        //   code: "QM",
        // },
        {
          label: "Nhà máy CBG Yên Sơn 1",
          id: 102340,
          code: "YS1",
        },
        {
          label: "Nhà máy CBG Thái Bình",
          id: 102366,
          code: "TB",
        },
      ],
  huyloi1:false,
      po: {
        code: "POac705671-03af-46bd-9a1c-4ff54b527987",
        daNhanTon: null,
        stepId: "100277",
        number: "1111",
        week: 45,
        year: 2020,
        market: null,
        ngayDongGoi: "2020-11-02T00:00:00.000Z",
        factoryId: 100000,
        keHoach: 1,

        xacnhanqc: null,
        loiCongDon: 0,
        xuatTon: 0,
        nhanpallet:[],
        sanpham:[],
        sanpham1:[],
        sanpham2:[],
        tongghinhan: 0,
        stepName: "6.HTD - X3",
        stepNextId: 100282,
        stepNextName: "8.Đóng gói - X3",
        nextcongdoan: null,
        sproot:[],
        order: 5,
        fa: 100000,
        itemId: 118579,
        itemCode: "ID-0045",
        itemName: "SKOGSTA chopping board 35x20 acacia",
        itemLenght: 350,
        itemWidth: 200,
        itemHeight: 25,
        UNIT_ID: 100000,
        target: 1,
        lengthdongbo:0,
        POtemp: null,
        ton: 0,
        quantity: null,
        error: null,
        status: "Đang sản xuất",
      },
      hesodm: [],
      dialogErr: false,
      listPackage: null,
      lengthR: 0,
      activePackage: false,
      loi: false,
      dataPackage: null,
      dataPackageloi: null,
      dataPackagehuyloi: null,
      departments: [],
    };
  },
  created() {
    this.departments = this.myDepartments;
    this.departments.map((el) => {
      el.label = `[${el.code}] - ${el.name}`
    })

    if (this.departments.length) {
      this.congdoan =
        this.departments.find((d) => d.id == this.$route.query.stepId) ||
        this.departments[0];
      this.load(this.congdoan.id);
      this.loadListPackage();
     // this.loadItem();
      //this.loadsanpham(this.congdoan.id);
      if (this.congdoan.id == 100264 || this.congdoan.id == 100274 || this.congdoan.id == 102354
      || this.congdoan.id == 102353 || this.congdoan.id == 102355 || this.congdoan.id == 102789|| this.congdoan.id == 102347
      || this.congdoan.id == 102809 || this.congdoan.id == 102380)
         this.luaphoi = true
         else this.luaphoi = false
     if (this.congdoan.id == 100282 || this.congdoan.id == 100273 || this.congdoan.id == 100270)
         this.donggoi = false
         else this.donggoi = false
    }
    if (this.$route.query.code)
      this.showConfirmDialog(this.$route.query.code, 0, 0);
  },
  methods: {
    ...mapActions("production", [
      "getAllsanpham",
       "getAllsanphamlp",
       "getAllsanphamnhan",
      "getAllKeHoachSanXuatConLais",
      "getAllKeHoachSanXuatConLaislp",
      "getPoByCode",
      "xacnhanqc1",
      "addPackage",
      "getDinhMucs",
      "getTyLeTHs",
      "getlenhsx",
      "getListPackage",
      "getActivePackage",
      "getActivePackagehuyloi",
      "getActivePackage_create_by",
      "listPackageRough_temp_del",
      "listPackageRough_temp_status",
      "listPackageRough_temp",
      "listPackageRough_temp_pallet",
      "getActivePackage_temp_update",
      "getActivePackage_temp",
      "update_Package_dauvao",
      "update_pallet_nhapkho",
    ]),
    goBack() {
      this.$router.go(-1);
    },
    async showConfirmDialog1() {
      if (this.po.itemId && this.po.stepId && this.nguonPhoi) {
        const payload = {
          departmentId: this.po.stepId,
          itemId: this.po.itemId,
          nguonPhoi: this.nguonPhoi ? this.nguonPhoi.value : null,
          luaPhoi: null,
        };
        const data = await this.$store.dispatch(
          "production/KL_TON_DAU_KY",
          payload
        );
        if (data.data.length > 0) {
          if (data.data[0].tonkho >= 0) this.tongton = data.data[0].tonkho;
        } else {
          this.$q.dialog({
            title: "Lỗi",
            message: "không có khối lượng tồn kho!",
          });
        }
      }
    },
     async them() {

      if (this.quantity2 && this.item2) {

          this.qccatve.push({
            quycach: this.item2.value,
            soluong: this.quantity2,
            height: this.item2.height,
            width: this.item2.width,
            length: this.item2.length,
            volumn: this.item2.volumn,
          });
          this.item2 = null;
          this.quantity2 = null;

      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Vui lòng nhập số lượng QC đầu vào!",
        });
      }
    },
      async thempallet() {

      if (this.quantityPallet && this.pallet2) {

          this.pallet1.push({
            pallet_id: this.pallet2.value,
            soluong: this.quantityPallet,
           pallet:this.pallet2.label,
          });

          this.quantityPallet = null;

      } else {
        this.$q.dialog({
          title: "Lỗi",
          message: "Vui lòng nhập số lượng pallet!",
        });
      }
    },
     deleteQCSauLua(row) {
      this.qccatve = this.qccatve.filter((q) => q.quycach != row.quycach);
    },
     deletepallet(row) {
      this.pallet1 = this.pallet1.filter((q) => q.pallet != row.pallet);
    },
    async loadpallet(maket) {
      this.pallets2 = [];
    const datapalet = await this.$store.dispatch(
        "production/PALLET_FULL_TOP",
        {
          maket:maket,
        }
      );
      datapalet.forEach((e) => {
        this.pallets2.push({
          label:e.NAME,
          value:e.ID,
        })
      })
      this.pallet2 = this.pallets2[0]


    },
     async loadItem(number) {
      const data2 = await this.$store.dispatch(
        "production/ITEMS_CAP_GO",
        {
          factoryId: 100000,
          number:number,
        }
      );

      data2.forEach((d) => {
        const itemNameConvert = `[${d.code}] ${d.name} (${d.height}*${d.width}*${d.length})`;
        this.items2.push({
          label: itemNameConvert,
          value: d.id,
          unit: d.unit,
          height: d.height,
          width: d.width,
          length: d.length,
          volumn: d.volumn,
        });
      });
      this.itemDupplicate2 = this.items2;
    },
      searchItem2(val, update) {
      if (val === "") {
        update(() => {
          this.items2 = this.itemDupplicate2;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.items2 = this.itemDupplicate2.filter((v) => {
          const quicach = v.label.toString().toLowerCase();
          if (quicach.indexOf(needle) > -1) {
            return v;
          }
        });
      });
    },
    async loadListPackage() {
      let i = 0;
      this.listRough = [];
      let factoryId1 = 100000;
     if( this.congdoan.factoryId == 102427) factoryId1 = 102427
      if( this.congdoan.factoryId == 102340) factoryId1 = 100004
       if( this.congdoan.factoryId == 102366) factoryId1 = 100005
      let payload = {
        factoryId:this.congdoan.id == 100081?this.userInfo.factoryId:factoryId1,
        DESTINATION_ID: this.congdoan.id,
      };
      this.listPackage = await this.getListPackage(payload);
      this.listRough1 = await this.listPackageRough_temp(payload);
           if (this.congdoan.id == 100071) {
      this.nhanpallet = await this.listPackageRough_temp_pallet(payload);
            this.listRough1.forEach((d) =>{
              this.lua = [];
              this.lua = this.nhanpallet.filter((el) => el.PACKAGE_TEMP_ID == d.ID);
              this.listRough.push({
                 ID:d.ID,ITEM_FROM_ID:d.ITEM_FROM_ID,
               CREATE_BY: d.CREATE_BY,
               CREATE_DATE:d.CREATE_DATE,
               HEIGHT:d.HEIGHT,LENGTH:d.LENGTH,WIDTH:d.WIDTH,
               ITEM_ID:d.ITEM_ID,
               LAST_NAME:d.LAST_NAME,NAME:d.NAME,
               MATP:d.MATP,PO:d.PO,TYPE_ID:d.TYPE_ID,
               QUANTITY:d.QUANTITY,SOURCE_ID_NAME:d.SOURCE_ID_NAME,
               SOURCE_ID:d.SOURCE_ID,DESTINATION_ID:d.DESTINATION_ID,
               giaygiao:d.giaygiao,giogiao:d.giogiao,phutgiao:d.phutgiao,
               ngay:d.ngay,root:d.root,
               pallet:this.lua,
              })
            })
           }
           else
            this.listRough = this.listRough1


      if (this.listPackage.length > 0) this.showListPackage = true;
      else this.showListPackage = false;

      if (this.listRough.length > 0) {
        this.showListPackageRough = true;
        for (i = 0; i < this.listRough.length; i++) this.nhanve[i] = true;
        this.selectionTT[i] = null;
      } else {
        this.showListPackageRough = false;
        this.showDialogRough = false;
      }
    },
    async onshowshowConfirmDel(ID) {
      let payload = {
        id: ID,
      };
      let data = await this.listPackageRough_temp_del(payload);

      showNotifySuccess();
      if (this.POtemp) {
        let payload = {
          po: this.POtemp,
          SOURCE_ID: this.congdoan.id,
        };
       this.listRoughR = await this.listPackageRough_temp_status(payload);
      }
    },
    async huy(k) {
      //  console.log('sl:',this.nhanve[i])
      this.selectionTT[k] = null;
      //  this.nhanve[k] = true
      await this.loadListPackage();
    },
    async chuyenkho() {
      if (this.selectionBTP) {
        if (this.congdoan.factoryId == 100000) this.nhan = "Xuất CONT - TH";
        if (this.congdoan.factoryId == 102340) this.nhan = "Xuất CONT - YS1B";
        if (this.congdoan.factoryId == 102366) this.nhan = "Xuất CONT - TB";
      } else this.nhan = this.po.nextstepId[0].NAME;
    },
    async confirm(data) {
      console.log(data);

      this.dataPackage = data;
      this.slnew = this.dataPackage.QUANTITY;
      this.activePackage = true;
    },
    async confirmloi(data) {
      this.dataPackageloi = data;
      this.slnew = this.dataPackageloi.So_luong;
      this.loi = true;
    },
    async huyloixn(data) {
      this.dataPackagehuyloi = data;

      this.huyloi1 = true;
    },
    async nhanvesl(i) {
      console.log("sl:", i);
      this.nhanve[i] = false;
    },
    async capnhat(data, i) {
      let payload1 = {
        id: data.ID,
        verifyBy: this.userInfo.id,
        status: this.selectionTT[i],
      };
      let data2 = await this.getActivePackage_temp_update(payload1);
      this.selectionTT[i] = null;
      // this.nhanve[i] = true
      await this.loadListPackage();
    },
    async activeSuccess() {
      this.showDialogRough = false;
if (this.congdoan.id == 100081 || this.congdoan.id == 100265 || this.congdoan.id == 100278
|| this.congdoan.id == 102355 || this.congdoan.id == 102353|| this.congdoan.id == 102380) {
  if(this.dataPackage.STEP_QC == 100081)
  {    const payload_QC1 = {
        ID: this.dataPackage.ID,
       verifyBy: this.userInfo.id,
  };
   const data_qc1 = await this.xacnhanqc1(payload_QC1);
  } else {
        const payload = {
        sourceId: this.dataPackage.SOURCE_ID,
        destinationId: this.dataPackage.DESTINATION_ID,
        itemFromId: this.dataPackage.ITEM_FROM_ID,
        itemId: this.dataPackage.ITEM_ID,
        quantity: this.dataPackage.QUANTITY,
        tonconlai: 0,
        ACCOUNT_ID:this.dataPackage.CREATE_BY,
        typeId: this.dataPackage.TYPE_ID, //100026,//100004
        description: "",
        ID: this.dataPackage.ID,
        po: this.dataPackage.PO,
        pallet_full_top_ID:this.dataPackage.pallet_full_top_ID,
        SL_PALLET:this.dataPackage.SL_PALLET,
        verifyBy: this.userInfo.id,
        CREATE_DATE: this.dataPackage.CREATE_DATE,
      };
      const data = await this.addPackage(payload);
  }
} else {
       this.sanpham_nhan = await this.getAllsanphamnhan({ stepId: this.dataPackage.SOURCE_ID,itemId:this.dataPackage.ITEM_ID,
       root:this.dataPackage.root });
        this.conlai = this.dataPackage.QUANTITY
         for (let i = 0; i < this.sanpham_nhan.length; i++) {
           this.po_nhan = this.sanpham_nhan[i].code
           if (this.conlai >0) {
             if (this.conlai > this.sanpham_nhan[i].conThucHien){
                   const payload = {
        sourceId: this.dataPackage.SOURCE_ID,
        destinationId: this.dataPackage.DESTINATION_ID,
        itemFromId: this.dataPackage.ITEM_FROM_ID,
        itemId: this.dataPackage.ITEM_ID,
        quantity: this.sanpham_nhan[i].conThucHien,
        tonconlai: 0,
        ACCOUNT_ID:this.dataPackage.CREATE_BY,
        typeId: this.dataPackage.TYPE_ID, //100026,//100004
        description: "",
        ID: this.dataPackage.ID,
        po: this.po_nhan,
        pallet_full_top_ID:this.dataPackage.pallet_full_top_ID,
        SL_PALLET:this.dataPackage.SL_PALLET,
        verifyBy: this.userInfo.id,
        CREATE_DATE: this.dataPackage.CREATE_DATE,
      };
      const data = await this.addPackage(payload);
      this.conlai = this.conlai - this.sanpham_nhan[i].conThucHien
             } else {
                 const payload = {
        sourceId: this.dataPackage.SOURCE_ID,
        destinationId: this.dataPackage.DESTINATION_ID,
        itemFromId: this.dataPackage.ITEM_FROM_ID,
        itemId: this.dataPackage.ITEM_ID,
        quantity:  this.conlai,
        tonconlai: 0,
        ACCOUNT_ID:this.dataPackage.CREATE_BY,
        typeId: this.dataPackage.TYPE_ID, //100026,//100004
        description: "",
        ID: this.dataPackage.ID,
        po: this.po_nhan,
        pallet_full_top_ID:this.dataPackage.pallet_full_top_ID,
        SL_PALLET:this.dataPackage.SL_PALLET,
        verifyBy: this.userInfo.id,
        CREATE_DATE: this.dataPackage.CREATE_DATE,
      };
      const data = await this.addPackage(payload);
        this.conlai = this.conlai - this.sanpham_nhan[i].conThucHien
          if (data.meta.success) {
        let payload1 = {
          id: this.dataPackage.ID,
          verifyBy: this.userInfo.id,
        };
        let data2 = await this.getActivePackage_temp(payload1);
      if (this.dataPackage.SOURCE_ID == 100264 || this.dataPackage.SOURCE_ID == 100274 || this.dataPackage.SOURCE_ID == 102354
      || this.dataPackage.SOURCE_ID == 102353 || this.dataPackage.SOURCE_ID == 102355 || this.dataPackage.SOURCE_ID == 102789|| this.dataPackage.SOURCE_ID == 102347
      || this.dataPackage.SOURCE_ID == 102380 || this.dataPackage.SOURCE_ID == 102809) {
      let payload2 = {
          PACKAGE_TEMP_ID: this.dataPackage.ID,
           id: data.data[0].id,
        };
        let data3 = await this.update_Package_dauvao(payload2);
      }

          if ((this.dataPackage.SOURCE_ID == 100282 || this.dataPackage.SOURCE_ID == 100273 || this.dataPackage.SOURCE_ID == 100270) && this.dataPackage.ITEM_ID !=119953
         && this.dataPackage.ITEM_ID !=119955 && this.dataPackage.ITEM_ID !=122632 && this.dataPackage.ITEM_ID !=122645 ) {
      let payload2 = {
          PACKAGE_TEMP_ID: this.dataPackage.ID,
           id: data.data[0].id,
        };
        let data3 = await this.update_pallet_nhapkho(payload2);
      }

      }
             }
           }
         }
}
      // const payload = {
      //   sourceId: this.dataPackage.SOURCE_ID,
      //   destinationId: this.dataPackage.DESTINATION_ID,
      //   itemFromId: this.dataPackage.ITEM_FROM_ID,
      //   itemId: this.dataPackage.ITEM_ID,
      //   quantity: this.dataPackage.QUANTITY,
      //   tonconlai: 0,
      //   ACCOUNT_ID:this.dataPackage.CREATE_BY,
      //   typeId: this.dataPackage.TYPE_ID, //100026,//100004
      //   description: "",
      //   ID: this.dataPackage.ID,
      //   po: this.dataPackage.PO,
      //   pallet_full_top_ID:this.dataPackage.pallet_full_top_ID,
      //   SL_PALLET:this.dataPackage.SL_PALLET,
      //   verifyBy: this.userInfo.id,
      //   CREATE_DATE: this.dataPackage.CREATE_DATE,
      // };
      // const data = await this.addPackage(payload);

      // if (data.meta.success) {
      //   let payload1 = {
      //     id: this.dataPackage.ID,
      //     verifyBy: this.userInfo.id,
      //   };
      //   let data2 = await this.getActivePackage_temp(payload1);
      // if (this.dataPackage.SOURCE_ID == 100264 || this.dataPackage.SOURCE_ID == 100274 || this.dataPackage.SOURCE_ID == 102354
      // || this.dataPackage.SOURCE_ID == 102353 || this.dataPackage.SOURCE_ID == 102355 || this.dataPackage.SOURCE_ID == 102789|| this.dataPackage.SOURCE_ID == 102347
      // || this.dataPackage.SOURCE_ID == 102380 || this.dataPackage.SOURCE_ID == 102809) {
      // let payload2 = {
      //     PACKAGE_TEMP_ID: this.dataPackage.ID,
      //      id: data.data[0].id,
      //   };
      //   let data3 = await this.update_Package_dauvao(payload2);
      // }

      //     if ((this.dataPackage.SOURCE_ID == 100282 || this.dataPackage.SOURCE_ID == 100273 || this.dataPackage.SOURCE_ID == 100270) && this.dataPackage.ITEM_ID !=119953
      //    && this.dataPackage.ITEM_ID !=119955 && this.dataPackage.ITEM_ID !=122632 && this.dataPackage.ITEM_ID !=122645 ) {
      // let payload2 = {
      //     PACKAGE_TEMP_ID: this.dataPackage.ID,
      //      id: data.data[0].id,
      //   };
      //   let data3 = await this.update_pallet_nhapkho(payload2);
      // }

      // }

      await this.loadListPackage();
      this.dataPackage = null;
      if (this.listRough.length > 0) {
        this.showDialogRough = true;
      }
    },
    async activeSuccessloi() {
      let payload = {
        id: this.dataPackageloi.ID,
        verifyBy: this.userInfo.id,
      };
      let data = await this.getActivePackage(payload);

      await this.loadListPackage();
    },
     async activeSuccesshuyloi() {
      let payload = {
        id: this.dataPackagehuyloi.ID,
        verifyBy: this.userInfo.id,
      };
      let data = await this.getActivePackagehuyloi(payload);

      await this.loadListPackage();
    },
    async showDialogErr() {
      console.log("listPackage");
      await this.loadListPackage();
      if (this.listPackage.length > 0) this.dialogErr = true;

      console.log("data", this.listPackage);
    },
    async onShowDialogRough() {
      // await this.loadListPackage();
      // if(this.listPackage.length > 0 )
      this.showDialogRough = true;

      //console.log("data", this.listPackage);
    },
    async closeDialog2() {
      this.showSuccess = false;
      this.card = false;
      this.defectQty = "";
      this.confirmQty = "";
      this.description = "";
    },
    closeSuccessDialog() {
      this.showSuccess = false;
      this.confirmQty = "";
      setTimeout(() => {
        this.$router.push("/tracking-lot-no?code=" + this.packageId);
      }, 1000);
    },
    async chonCongdoan(item) {
      this.congdoan = item;

      this.selectionBTP = false;
      this.searchQuery = "";
      this.item2 = null;
      this.qccatve = [];
      this.pallet1 = [];
      if (this.congdoan.id == 100264 || this.congdoan.id == 100274 || this.congdoan.id == 102354
      || this.congdoan.id == 102353 || this.congdoan.id == 102355 || this.congdoan.id == 102789|| this.congdoan.id == 102347
      || this.congdoan.id == 102809 || this.congdoan.id == 102380)
    {
         this.luaphoi = true
    }  else this.luaphoi = false
    if (this.congdoan.id == 102851) this.donggoi1 = true 
    else this.donggoi1 = false 
    
     if ((this.congdoan.id == 100282 || this.congdoan.id == 100273 || this.congdoan.id == 100270))
         this.donggoi = false
         else this.donggoi = false
      this.load(item.id);
      this.loadListPackage();
      // this.loadsanpham(item.id);

      this.$router.replace({
        path: this.$route.fullPath,
        query: {
          stepId: item.id,
        },
      });
    },
    async load(stepId) {
      this.searchQuery = [];
           this.searchQuery2 = [];
       this.sproot = [];
       this.sanpham = [];
        this.sanpham2 = [];
      //  await this.getDinhMucs({ stepId: stepId });
      // await this.getTyLeTHs({ stepId: stepId });
         if (this.congdoan.id == 100264 || this.congdoan.id == 100274
      || this.congdoan.id == 102855 || this.congdoan.id == 102370 || this.congdoan.id == 102789|| this.congdoan.id == 102347
      || this.congdoan.id == 102809)
      {
     this.sanpham = await this.getAllKeHoachSanXuatConLaislp({ stepId: stepId });
     this.sanpham2 = await this.getAllsanphamlp({ stepId: stepId });
      } else {
      this.sanpham = await this.getAllKeHoachSanXuatConLais({ stepId: stepId });
     this.sanpham2 = await this.getAllsanpham({ stepId: stepId });
      }
      // this.sanpham.forEach((d) =>{
      //       this.sproot.push(d.root);
      // });
           this.sanpham.forEach((d) =>{
            this.sproot.push(d.root);
              this.sanpham1 = this.sanpham2.filter((el) => el.itemId == d.itemId && el.root == d.root);
              if (this.sanpham1.length>0)
              this.searchQuery.push({
                 itemCode:d.itemCode,itemName:d.itemName,
                 itemHeight:d.itemHeight,itemLength:d.itemLength,
                 itemWidth:d.itemWidth,itemId:d.itemId,conThucHien:d.conThucHien,
                 root:d.root,
               number:this.sanpham1,
              })
            })

            this.sproot = this.sproot.filter((v, i, a) => a.indexOf(v) === i);
             this.sproot.forEach((d) =>{
              this.sproot1 = this.searchQuery.filter((el) =>  el.root == d);
    this.searchQuery2.push({
                 root:this.sproot1,
                 sp:d
              })
             })
             console.log('sp:',this.searchQuery2)
    },

    // async loadsanpham(stepId) {
    //   this.historys = await this.getAllsanpham({ stepId: stepId });
    // },
    // async loadlenhsx(stepId, itemId) {
    //   this.lenhsanxuat = await this.getlenhsx({
    //     stepId: stepId,
    //     itemId: itemId
    //   });
    // },
    async unique(arr) {
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    async showConfirmDialog(lsx, ghinhanth, root) {
      this.maxCoTheGhiNhan = 0;
      this.tongghinhan = 0;
      this.qccatve = [];
      this.pallet1 = [];
      this.item2 = null;
      this.quantity2 = null;
      this.POtemp = lsx[0].code;
      this.rootlsx = root;
      let payload = {
        po: lsx[0].code,
        SOURCE_ID: this.congdoan.id,
      };
      this.listRoughR = await this.listPackageRough_temp_status(payload);
      this.lengthR = this.listRoughR.length;
      if (
        this.congdoan.id == 100282 ||
        this.congdoan.id == 100273 ||
        this.congdoan.id == 100270 ||
        this.congdoan.id == 102363
      )
        this.giaonhan = true;
      else this.giaonhan = false;
      this.selectionBTP = false;
      if (this.congdoan.factoryId == 102340) this.dongbtp = false;
      else this.dongbtp = true;
      this.$q.loading.show({
        message:
          'Hệ thống đang kiểm tra phôi có thể xuất.<br/><span class="text-primary">Xin vui lòng chờ...</span>',
      });
      // this.lenhsanxuat = await this.getlenhsx({
      //   stepId: this.congdoan.id,
      //   itemId: code,
      //   root:root,
      // });

      this.tongton = 0;
      this.lengthdongbo = 0;
      let code1 = lsx[0].code;
      this.po = await this.getPoByCode({ code1 });
       const payload_QC = {
            itemId: this.po.itemId,
            stepId:this.congdoan.id,
      }
       const data_qc = await this.$store.dispatch(
        "production/GET_XAC_NHAN_QC",
        payload_QC
      );
   if (data_qc.data.length>0)
      this.xacnhanqc = data_qc.data[0].xacnhanqc;
      else this.xacnhanqc  = false


      this.dai = this.po.nextstepId.length;

      this.nhan = this.po.nextstepId[0].NAME;

      this.$router.replace({
        path: this.$route.fullPath,
        query: {
          stepId: this.congdoan.id,
        },
      });
      this.ghinhan = ghinhanth;
      if (this.congdoan.factoryId == 100000) this.fa = 100000;
      if (this.congdoan.factoryId == 102427) this.fa = 102427;
      if (this.congdoan.factoryId == 102340) this.fa = 100004;
      if (this.congdoan.factoryId == 102366) this.fa = 100005;
      if (this.po.dongbo) {
        this.po.dongbo.forEach((e) => {
          if (this.po.itemId == e.itemId) this.dongbo = e.QUANTITY;
        });
      }
           if (this.po.dongbo) {
        this.po.dongbo.forEach((e) => {
          if (this.dongbo > e.QUANTITY)
          this.lengthdongbo = 1
        });
      }

      if (this.po.nguyenLieu.length > 0) {
        this.hesodm = await this.getDinhMucs({
          stepId: this.po.nguyenLieu[0].ID,
          item: this.po.itemId,
          factoryId: this.fa,
        });

        if (this.hesodm.length > 0) {
          this.maxCoTheGhiNhan =
            this.po.nguyenLieu[0].ton / this.hesodm[0].heSo;
          if (this.hesodm[0].heSo != 1)
            this.maxCoTheGhiNhan = parseInt(this.maxCoTheGhiNhan);

          for (let k = 0; k < this.po.nguyenLieu.length; k++) {
            this.hesodm = await this.getDinhMucs({
              stepId: this.po.nguyenLieu[k].ITEM_ID,
              item: this.po.itemId,
              factoryId: this.fa,
            });
            if (this.hesodm.length > 0) {
              if (this.po.nguyenLieu[k].NEXT_ITEM_ID) {
                this.tongghinhan += parseInt(
                  this.po.nguyenLieu[k].ton / this.hesodm[0].heSo
                );
              }
              if (
                this.maxCoTheGhiNhan >
                this.po.nguyenLieu[k].ton / this.hesodm[0].heSo
              ) {
                this.maxCoTheGhiNhan =
                  this.po.nguyenLieu[k].ton / this.hesodm[0].heSo;
                if (this.hesodm[0].heSo != 1)
                  this.maxCoTheGhiNhan = parseInt(this.maxCoTheGhiNhan);
              }
            }
          }
        } else {
          this.maxCoTheGhiNhan = this.po.nguyenLieu[0].ton;

          for (let k = 0; k < this.po.nguyenLieu.length; k++) {
            if (this.maxCoTheGhiNhan > this.po.nguyenLieu[k].ton) {
              this.maxCoTheGhiNhan = this.po.nguyenLieu[k].ton;
            }
          }
        }
        if (this.tongghinhan > 0) this.maxCoTheGhiNhan = this.tongghinhan;
        this.card = true;

        this.$q.loading.hide();

        this.selection = this.po.itemId;
        this.source_Id = this.po.stepId;
        if (this.congdoan.id == 100264 || this.congdoan.id == 100274 || this.congdoan.id == 102354
      || this.congdoan.id == 102353 || this.congdoan.id == 102355 || this.congdoan.id == 102789|| this.congdoan.id == 102347
      || this.congdoan.id == 102809 || this.congdoan.id == 102380)
        this.loadItem(this.po.number)
         if ((this.congdoan.id == 100282 || this.congdoan.id == 100273 || this.congdoan.id == 100270) && this.po.itemId !=119953
         && this.po.itemId !=119955 && this.po.itemId !=122632 && this.po.itemId !=122645  )
       { this.loadpallet(this.po.market)
         this.donggoi = true
       } else this.donggoi = false
        if (this.congdoan.id == 102851) this.donggoi1 = true 
    else this.donggoi1 = false 
      } else {
        this.card = true;

        this.$q.loading.hide();
        this.selection = this.po.itemId;
        this.source_Id = this.po.stepId;
        if (this.congdoan.id == 100264 || this.congdoan.id == 100274 || this.congdoan.id == 102354
      || this.congdoan.id == 102353 || this.congdoan.id == 102355 || this.congdoan.id == 102789|| this.congdoan.id == 102347
      || this.congdoan.id == 102809 || this.congdoan.id == 102380)
        this.loadItem(this.po.number)
           if ((this.congdoan.id == 100282 || this.congdoan.id == 100273 || this.congdoan.id == 100270) && this.po.itemId !=119953
         && this.po.itemId !=119955 && this.po.itemId !=122632 && this.po.itemId !=122645  )
       { this.loadpallet(this.po.market)
         this.donggoi = true
       } else this.donggoi = false
        if (this.congdoan.id == 102851) this.donggoi1 = true 
    else this.donggoi1 = false 
      }

    },
    async updateITEMPACKAGE(PACKAGE_ID, xuatton) {
      const payload = {
        PACKAGE_ID,
        itemId: this.po.itemId,

        quantity: xuatton,
      };
      const data = await this.$store.dispatch(
        "production/INSERT_ITEM_IN_PACKAGE",
        payload
      );

    },
 async  dongbosp(){

      //   if (this.lengthdongbo>0 && this.defectQty == ""){
      // if (this.po.keHoach - this.po.conThucHien + this.confirmQty > 0.5*this.po.keHoach) {
      //       this.dialogdongbo = true
      //     }
      //     else this.secondDialog = true
      //  } else
        this.secondDialog = true
    },
    async add() {

      if (this.confirmQty > 0 || this.defectQty > 0) {
        if (this.nguonPhoi) {
          if (parseFloat(this.confirmQty) > 0) {
            this.xuaton = this.confirmQty;
          }
          if (this.confirmQty > this.tongton) {
            this.$q.dialog({
              title: "Lỗi",
              message: "Nhập quá khối lượng tồn kho!",
            });
          } else {
            if (this.confirmQty > this.ghinhan) {
              this.$q.dialog({
                title: "Lỗi",
                message: "Nhập quá kế hoạch!",
              });
            } else {
              // for (let i = 0; i < this.lenhsanxuat.length; i++) {
              // let code1 = this.lenhsanxuat[i].code;
              // this.po1 = await this.getPoByCode({ code1 });

              // console.log("con thực hiện:", this.po1.conThucHien);
              if (this.xuaton > 0 && this.po.conThucHien > 0) {
                if (this.xuaton <= this.po.conThucHien) {
                  const payload = {
                    departmentId: this.po.stepId,
                    stepNextId: this.po.stepNextId,
                    itemId: this.po.itemId,
                    TYPE_ID: 100026,
                    createBy: this.userInfo.id,
                    factoryId: 100000,
                    quantity: this.xuaton,
                    PO: this.po.code,
                  };
                  const data2 = await this.$store.dispatch(
                    "production/INSERT_PACKAGE",
                    payload
                  );

                  if (data2.meta.success) {
                    this.packageId = data2.data[0].ID;
                    this.packageString = data2.data[0].ID.toString();
                    console.log("ID:", data2.data[0].ID);
                    this.updateITEMPACKAGE(data2.data[0].ID, this.xuaton);
                  }
                  showNotifySuccess();

                  this.xuaton = 0;
                } else {
                  const payload = {
                    departmentId: this.po.stepId,
                    stepNextId: this.po.stepNextId,
                    itemId: this.po.itemId,
                    TYPE_ID: 100026,
                    createBy: this.userInfo.id,
                    factoryId: 100000,
                    quantity: this.po.conThucHien,
                    PO: this.po.code,
                  };
                  const data2 = await this.$store.dispatch(
                    "production/INSERT_PACKAGE",
                    payload
                  );

                  if (data2.meta.success) {
                    console.log("ID:", data2.data[0].ID);
                    this.packageId = data2.data[0].ID;
                    this.packageString = data2.data[0].ID.toString();
                    this.updateITEMPACKAGE(
                      data2.data[0].ID,
                      this.po.conThucHien
                    );
                  }
                  showNotifySuccess();

                  this.xuaton = this.xuaton - this.po.conThucHien;
                }
              }
              // }
              const payload = {
                departmentId: this.po.stepId,
                itemId: this.po.itemId,
                quantity: -this.confirmQty,
                marketCode: null,
                nguonPhoi: this.nguonPhoi ? this.nguonPhoi.value : null,
              };
              const data = await this.$store.dispatch(
                "production/NHAP_TON_DAU_KY",
                payload
              );

              this.showSuccess = true;
              this.nguonPhoi = "";
              await this.load(this.congdoan.id);
            }
          }
        } else {
          const dQty = this.defectQty || 0;
          const cQty = this.confirmQty || 0;
// bỏ check tồn
if (this.congdoan.id != 100264 && this.congdoan.id != 100274 && this.congdoan.id != 102809 && this.congdoan.id != 102855
      && this.congdoan.id != 102789 && this.congdoan.id != 102347  && this.congdoan.id != 102353
       && this.congdoan.id != 102459 && this.congdoan.id != 102634 && this.congdoan.id != 102355
      && this.congdoan.id != 102370 && this.congdoan.id != 102374 && this.congdoan.id != 102804
     && this.congdoan.id != 102380 && this.congdoan.id != 102849 && this.congdoan.id != 102354
     && this.congdoan.id != 100265 && this.congdoan.id != 102814 && this.congdoan.id != 100278
     && this.congdoan.id != 102632 && this.po.itemId != 125566 && this.po.itemId != 125580 )

           {  if (cQty > this.maxCoTheGhiNhan - this.po.chonhan) {
            return this.$q.dialog({
              title: "Lỗi",
              html: true,
              message: "<span style ='color:red'>Giao vượt số lượng tồn tại tổ! <br> Yêu cầu nhận phôi trước khi xuất </span>",
            });
          }
          if (dQty > this.maxCoTheGhiNhan - this.po.chonhan) {
            return this.$q.dialog({
              title: "Lỗi",
              html: true,
              message: "<span style ='color:red'>Báo lỗi vượt số lượng tồn tại tổ! <br> Yêu cầu nhận phôi trước khi báo lỗi </span>",
            });
          }
           }
          if (this.ghinhan < dQty + cQty + this.po.chonhan)  {
            return this.$q.dialog({
              title: "Lỗi",
              message: "Giao vượt quá lệnh sản xuất!",
            });
          }
          if (parseFloat(dQty) > 0) {
            this.source_Id = this.po.stepId;

            if (this.factory) {
              this.source_Id = this.factory.id;
            }
            await this.createPackage_temp(100004, dQty);
            await this.load(this.congdoan.id);
          }
          if (parseFloat(cQty) > 0) {
            this.nextcongdoan = this.po.stepNextId;
            if (this.congdoan.factoryId == 100000) this.fa = 100000;
            if (this.congdoan.factoryId == 102427) this.fa = 102427;
            if (this.congdoan.factoryId == 102366) this.fa = 100005;
            if (this.congdoan.factoryId == 102340) this.fa = 100004;

            if (this.selectionBTP) {
              if (this.congdoan.factoryId == 100000) this.nextcongdoan = 100072;
              if (this.congdoan.factoryId == 102340) this.nextcongdoan = 102454;
              if (this.congdoan.factoryId == 102366) this.nextcongdoan = 102777;
            } else {
              if (this.po.nextstepId.length > 1)
                this.nextcongdoan = this.selectionstepId;
              else this.nextcongdoan = this.po.nextstepId[0].STEP_ID;
            }
            this.selection = this.po.itemId;
            this.source_Id = this.po.stepId;
            // console.log("độ dài:", this.lenhsanxuat);
            let conlai = cQty;

            //  for (let i = 0; i < this.lenhsanxuat.length; i++) {
            // let code1 = this.lenhsanxuat[i].code;
            //this.po = this.lenhsanxuat[i]
            //   this.po = await this.getPoByCode({ code1 });
            //  if (conlai > 0 && this.lenhsanxuat[i].conThucHien > 0) {
            // let code1 = this.lenhsanxuat[i].code;
            // this.po = await this.getPoByCode({ code1 });
            await this.createPackage_temp(100026, conlai);
            //  conlai = conlai - this.lenhsanxuat[i].conThucHien;
            // }
            //  }
          }

          console.log("Loa data", this.congdoan.id);
          await this.load(this.congdoan.id);
        }
      } else
        this.$q.dialog({
          html: true,
          message: `<span class="text-orange">Bạn chưa nhập số lượng lỗi hoặc số lượng ghi nhận!</span>`,
        });
    },
    async createPackage_temp(typeId, quantity) {
      console.log(this.nextcongdoan);
      let stepId = this.nextcongdoan;
      if (typeId === 100004) {
        const currentStep = this.$store.getters["base/mySources"].find((s) => {
          return s.id === parseInt(this.po.stepId);
        });

        if (currentStep) {
          stepId = currentStep.error;
        }
         stepId = 100081
      }
      if (
        typeId === 100004
      ) {
       const payload = {
          departmentId: this.source_Id,
          ITEM_FROM_ID:this.po.stepId,
          stepNextId: stepId,
          createBy: this.userInfo.id,
          itemId: this.selection,
          quantity: quantity,
          factoryId: this.fa,
          TYPE_ID: typeId, //100026,//100004
            pallet_full_top_id:this.pallet2?this.pallet2.value:null,
          SL_PALLET:this.quantityPallet,
          PO: this.po.code,
          root:this.rootlsx,

        };
        const data = await this.$store.dispatch(
          "production/INSERT_PACKAGE_TEMP",
          payload
        );
        console.log('du lieu:',data.meta.success)
        if (data.meta.success) {
          this.packageString = data.data[0].ID.toString();
          this.packageId = data.data[0].ID;
        //  this.maxQtyConfirm = this.maxQtyConfirm - parseFloat(quantity);
          if (typeId === 100004) {
            this.showSuccess = true;
            this.factory = null;
          }
          if (typeId === 100026) {
            this.showSuccess = true;
            this.selectionBTP = false;
          }
          showNotifySuccess();
        } else {
          showNotifyError();
        }
      }
      if (
        typeId === 100026
      ) {
       if ((this.congdoan.id == 100282 || this.congdoan.id == 100273 || this.congdoan.id == 100270) && this.po.itemId !=119953
         && this.po.itemId !=119955 && this.po.itemId !=122632 && this.po.itemId !=122645 && this.pallet1.length==0)
         {
             return this.$q.dialog({
              title: "Lỗi",
              message: "Bạn chưa nhập số lượng pallet!",
            });
         }
        const payload = {
          departmentId: this.source_Id,
          stepNextId: stepId,
           ITEM_FROM_ID:this.po.stepId,
          createBy: this.userInfo.id,
          itemId: this.selection,
          quantity: quantity,
          factoryId: this.fa,
          TYPE_ID: typeId, //100026,//100004
          pallet_full_top_id:this.pallet2?this.pallet2.value:null,
          SL_PALLET:this.quantityPallet,
          PO: this.po.code,
          root:this.rootlsx,
          xacnhanqc:this.xacnhanqc,
        };
        const data = await this.$store.dispatch(
          "production/INSERT_PACKAGE_TEMP",
          payload
        );
        // const data = await this.addPackage(payload);
        if (data.meta.success) {
          this.packageString = data.data[0].ID.toString();
          this.packageId = data.data[0].ID;
          this.quantityPallet = null;
           if (this.qccatve.length > 0) {
            const payload = {
              PACKAGE_TEMP_ID: this.packageId,
              dulieu: this.qccatve,
            };
            const data2 = await this.$store.dispatch(
              "production/INSERT_QC_DAU_VAO",
              payload
            );
          }
               if (this.pallet1.length > 0) {
            const payload = {
              PACKAGE_TEMP_ID: this.packageId,
              dulieu: this.pallet1,
            };
            const data2 = await this.$store.dispatch(
              "production/INSERT_PALLET_NHAP_KHO",
              payload
            );
          }
          if (typeId === 100026) {
            this.showSuccess = true;
            this.selectionBTP = false;
          }
          showNotifySuccess();
        } else {
          showNotifyError();
        }
      }
    },
  },
  components: {
    DialogSuccess,
    "no-tasks": require("components/Tasks/NoTasks.vue").default,
    // "old-tasks": require("components/Tasks/OldTasks.vue").default
  },
  computed: {
    ...mapGetters("base", ["myDepartments", "userInfo"]),
    ...mapGetters("production", [
      "pos",
      "isDongBoPhoi",
      "tyLeThucHienByItemId",
    ]),
         dataReceiptFilter() {
      if (this.searchQuery1) {
        this.tk = this.searchQuery.filter(d => {



          const matchString = d.itemName + " " +  d.itemHeight + "*" + d.itemWidth + "*" + d.itemLength


          return matchString
            .toLowerCase()
            .includes(this.searchQuery1.toLowerCase());

          });
          this.searchQuery3 = [];
         this.sproot.forEach((d) =>{
              this.sproot1 = this.tk.filter((el) =>  el.root == d);
           if(this.sproot1.length>0)
    this.searchQuery3.push({
                 root:this.sproot1,
                 sp:d
              })
             })

          return this.searchQuery3
      }
      return this.searchQuery2;
    },


    getMaxCapPhoi() {
      return 100;
    },
    isValidate() {
      if (
        this.confirmQty &&
        (!this.po.stepName.toLowerCase().includes("đóng gói") ||
          this.description)
      )
        return false;
      if (
        this.defectQty &&
        (!this.po.stepName.toLowerCase().includes("đóng gói") ||
          this.description)
      )
        return false;
      return true;
    },
  },
  watch: {
    defectQty(newValue) {
      if (
        this.po.UNIT_ID !== 100005 &&
        newValue &&
        !Number.isInteger(newValue)
      ) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Bạn cần nhập số nguyên!",
        });
      }
    },
    confirmQty(newValue) {
      if (
        this.po.UNIT_ID !== 100005 &&
        newValue &&
        !Number.isInteger(newValue)
      ) {
        this.$q.dialog({
          title: "Lỗi",
          message: "Bạn cần nhập số nguyên!",
        });
      }
    },
  },
};
</script>
