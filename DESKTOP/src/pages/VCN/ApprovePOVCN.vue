<template>
  <q-page>
    <q-banner class="text-primary print-hide">
      <template v-slot:avatar>
        <img src="~assets/logo.png" style="width: auto; height: 70px" />
      </template>
      <div style="margin-top: 34px" class="text-h6">
        Phê duyệt lệnh sản xuất VCN
      </div>
    </q-banner>
    <div class="text-orange row widget-container print-hide">
      <div class="col-12 col-md-2 q-pa-sm">
        <q-select color="grey-3" label-color="orange" filled @input="chonNhaMay" v-model="factory" :options="factories1"
          label="Chọn nhà máy" dense />
      </div>
      <div class="col-12 col-md-2 q-pa-sm">
        <q-select color="grey-3" label-color="orange" filled v-model="xuong" :options="xuongs" label="Chọn Xưởng"
          @input="chonXuong" dense />
      </div>
      <div class="col-12 col-md-2 q-pa-sm">
        <q-select color="grey-3" label-color="orange" filled @input="searchPO" v-model="goodsType"
          :options="goodsTypess" label="Chọn dòng sản phẩm" dense />
      </div>
      <div class="col-12 col-md-2 q-pa-sm q-gutter-sm" align="right">
        <q-btn :disable="!selection.length > 0" color="green-7" label="Phê duyệt" @click="confirmPheDuyet" />
      </div>
      <div class="col-12 col-md-1 q-pa-sm q-gutter-sm" align="right">
        <q-btn v-if="reject && !isReject" style="width: 105px" color="orange" :disable="!selection.length > 0"
          label="Từ chối" @click="rejectPO" />
      </div>
      <div class="col-12 col-md-2 q-pa-sm" align="left">
        <q-btn v-if="edit" style="width: 105px" color="red" :disable="!selection.length > 0" label="Sửa"
          @click="suaLenhSanXuat" />
      </div>
      <div class="col-12 col-md-1 q-pa-sm" align="left">
        <q-btn v-if="userInfo.id == 102089 || userInfo.id == 100400" color="red" label="Xóa LSX" @click="deletePO" />
      </div>
    </div>
    <q-card>
      <div v-if="soLenhsPKD.length > 0 && (userInfo.id == 101678 )" class="print-hide">
        <q-card-section>
          <div><b class="text-red">Danh sách LSX chờ trưởng phòng Kinh doanh duyệt :</b></div>
          <div class="row">
            <div class="col-3" v-for="(lsx, index) in soLenhsPKD" :key="index">
              <q-radio v-model="selection" @input="selectedPo" :val="lsx" :label="lsx" color="teal"
                class="text-weight-bold" />
            </div>
          </div>
        </q-card-section>
        <q-separator />
      </div>
      <div v-else-if="soLenhsGDSX.length > 0 && userInfo.id != 101678 " class="print-hide">
        <q-card-section>
          <div><b class="text-red">Danh sách LSX chờ GĐSX duyệt :</b></div>
          <div class="row">
            <div class="col-3" v-for="(lsx, index) in soLenhsGDSX" :key="index">
              <q-radio v-model="selection" @input="selectedPo" :val="lsx" :label="lsx" color="teal"
                class="text-weight-bold" />
            </div>
          </div>
        </q-card-section>
        <q-separator />
      </div>
      <q-card-section v-else class="print-hide">
        <q-banner class="bg-grey-3">
          <template v-slot:avatar>
            <q-icon name="search_off" color="primary" />
          </template>
          Không có lệnh sản xuất cần phê duyệt.
          <template v-slot:action>
            <q-btn flat :to="{ name: 'taoKeHoach' }" color="primary" label="Tạo lệnh sản xuất" />
          </template>
        </q-banner>
      </q-card-section>
      <q-card-section v-if="(userInfo.id != 101678) && solenhSXGDSXDaDuyet.length" class="print-hide">
        <div>
          <b class="text-red">Danh sách LSX chờ Trưởng phòng Kinh doanh duyệt :</b>
        </div>
        <div class="row">
          <div class="col-3" v-for="(lsx, index) in solenhSXGDSXDaDuyet" :key="index">
            <q-checkbox @input="selectedPo(lsx)" :val="lsx" :label="lsx" color="teal" class="text-weight-bold" />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="print-hide">
        <div>
          <b class="text-blue">Danh sách các LSX đang chạy trên chuyền :</b>
        </div>
        <div class="row">
          <div class="col-3" v-for="(lsx, index) in chuaHoanThanhs" :key="index">
            <q-checkbox v-if="new Date(moment(lsx.ngayDongGoi).format('YYYY-MM-DD')).getTime() > new Date().getTime()"
              :val="lsx.number" @input="selectedPo(lsx.number)" :label="lsx.number" color="teal"
              class="text-weight-bold" />
            <q-checkbox v-else :val="lsx.number" @input="selectedPo(lsx.number)" :label="lsx.number" color="teal"
              class="text-weight-bold text-red" />
          </div>
        </div>
      </q-card-section>
        <q-card-section class="print-hide">
             <div v-if="PO &&  PO[0].loaisp.trim() == 'BTP'">
               <table class="table-custom" border="1" width="100%">
            <thead class="w-100">
              <tr>
               
                <td colspan="3" class="text-center">SẢN XUẤT TỒN KHO VÁN CỐT</td>
              
              </tr>
              <tr>
                <th>
               HẠN MỨC <br>
                  (ĐVT)
                </th>
                <th class="text-center">
                  SỐ LƯỢNG DỞ DANG + TÒN KHO <br>
                  (ĐVT)
                   </th>
                    <th>
                 HẠN MỨC CÒN LẠI
               
                   </th>
               
              </tr>
             <tr>
               <td class="text-center">
           {{PO[0].dinhmuc>0?PO[0].dinhmuc:0}}
                </td>
                <td class="text-center">
           {{ tonkhovan}}
                   </td>
                    <td class="text-center">
                 {{  tonkhovan - PO[0].dinhmuc}}
               
                   </td>
             
             </tr>
            </thead>
          </table>
             </div>
              <div v-if="PO  && PO[0].loaisp.trim() == 'TP'">
               <table class="table-custom" border="1" width="100%">
            <thead class="w-100">
              <tr>
               
                <td colspan="3" class="text-center">SẢN XUẤT THEO ĐẶT HÀNG - THÀNH PHẨM</td>
              
              </tr>
              <tr>
                <th>
                  SỐ PO/SPI/ORDER IKEA
                </th>
                <!-- <th class="text-center">
                  SỐ LƯỢNG <br>
                  (ĐVT)
                   </th> -->
                    <th>
                   SỐ LƯỢNG CHƯA VIẾT LỆNH
               
                   </th>
                <th>
                  TÌNH HÌNH TẠM ỨNG/TT
                  
                </th>
              </tr>
             <tr>
               <td class="text-center">
           {{PO[0].po}}
           </td>
                <!-- </td>
                <td class="text-center">
            
                     <div v-for="(item, index) in itemSauRong" :key="index">
                 
                    {{ item.ItemVCN.name }} :  
                    {{ item.quantity }} 
                    <br />
                  </div>
                  
                   </td> -->
                    <td class="text-center">
                {{PO[0].dinhmuc}}
               
                   </td>
                <td class="text-center">
             có
                  
                </td>
             </tr>
            </thead>
          </table>
             </div>
            </q-card-section>
      <q-card-section>
        <div v-if="PO && PO[0].type == 'LVL'">
          <div v-if="userInfo.id == PO[0].createdBy && isReject" class="text-white bg-blue">
            lý do: {{ PO[0].description }}
          </div>
          <table class="table-custom" border="1" width="100%">
            <thead class="w-100">
              <tr>
                <td  class="text-center" width="120" rowspan="2">
                  <img width="120" height="120" v-bind:src="'https://app.woodsland.com.vn:2002/img/logo.06aa324e.png'" />
                </td>
                <!-- <td v-else class="text-center" width="120" rowspan="2">
                  WOODSLAND TUYÊN QUANG - NM YÊN SƠN 3
                </td> -->
                <td class="text-center">QUY TRÌNH KHỞI ĐỘNG SẢN PHẨM</td>
                <td width="240px" style="word-break: break-word" rowspan="2" >
                 <i>  Số LSX: <br> {{ PO[0].number}}</i> <br>
            
                </td>
              </tr>
              <tr>
                <th>
               
                 LỆNH SẢN XUẤT <br>
                   KIÊM PHIẾU XUẤT KHO NGUYÊN LIỆU - VẬT TƯ 
                  
                </th>
              </tr>
               <tr>
        <th colspan="2" style="text-align:left;" ></th>
                <td colspan="1" style="text-align:left;" >
               
                  <!-- Số LSX: {{ PO[0].number}} <br> -->
                  Ngày viết: {{ moment(PO[0].createdAt, "YYYY-MM-DD").format("L") }} 
                  <!-- Ngày hoàn thành: {{moment(PO[0].ngayDongGoi, "YYYY-MM-DD").format("L")}} -->
                 
                </td>
              </tr>
            </thead>
          </table>
          <b>I - Thông tin chung</b>
            <table class="table-custom" border="1" width="100%">
            <thead class="w-100">
              <!-- <tr>
              
                <td class="text-center" width="120" rowspan="1">
                  <strong>
                  Tên Khách hàng
                   </strong>
                </td>
                <td class="text-center"></td>
                <td width="150px" style="word-break: break-word" rowspan="1" class="text-center text-weight-bolder">
                  Trạng thái MT
                </td>
                 <td width="150px" style="word-break: break-word" rowspan="1" class="text-center text-weight-bolder">
                  FSC
                </td>
                 <td width="150px" style="word-break: break-word" rowspan="1" class="text-center text-weight-bolder">
                  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
                </td>
                 <td width="150px" style="word-break: break-word" rowspan="1" class="text-center text-weight-bolder">
                Non FSC
                </td>
                  <td width="150px" style="word-break: break-word" rowspan="1" class="text-center text-weight-bolder">
                  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
                </td>
              </tr> -->
              <!-- <tr>
                <th>
                  <strong>
                    Mã khách hàng
                  </strong>
                </th>
                <th>
                
                </th>
                 <th rowspan="2" colspan="5">
                 
                </th>
              </tr> -->
              <tr>
                 <th>
                  <strong>
                    Sản phẩm
                  </strong>
                </th>
                <th>
                  <div>
                   KT trước rong: {{ PO[0].ItemVCN.name}} : {{PO[0].quantity}}
                  </div>
                    <div v-if="itemSauRong.length>0">
                     
                     <div v-for="(item, index) in itemSauRong" :key="index">
                 
                    KT sau rong: {{ item.ItemVCN.name }} :{{ item.quantity }} 
                    <br />
                  </div>
                  </div>
                </th>
                <th width="39%"></th>
              </tr>
            </thead>
          </table>
          <br>
          <table class="table-custom text-center" border="1" width="100%">
            <thead>
              <!-- <tr> -->
                <!-- <td colspan="2" rowspan="2">Sản phẩm</td> -->
                <!-- <th colspan="6" rowspan="2">
                  <span>KT trước rong:</span>
                  {{ PO[0].ItemVCN.name }} : {{ PO[0].ItemVCN.length }} x
                  {{ PO[0].ItemVCN.width }} x {{ PO[0].ItemVCN.height }} (
                  {{ PO[0].quantity }} Tấm )
                  <div v-for="(item, index) in itemSauRong" :key="index">
                    <span>KT sau rong:</span>
                    {{ item.ItemVCN.name }} : {{ item.ItemVCN.length }} x
                    {{ item.ItemVCN.width }} x {{ item.ItemVCN.height }} (
                    {{ item.quantity }} Thanh )
                    <br />
                  </div>
                </th> -->

                <!-- <th colspan="2">Khách hàng</th>
                <th colspan="5">{{ PO[0].Customer.NAME }}</th> -->
              <!-- </tr> -->
              <!-- <tr> -->
                <!-- <th colspan="2">Ngày viết LSX:</th> -->
                <!-- <th colspan="5">
                  {{ moment(PO[0].createdAt, "YYYY-MM-DD").format("L") }}
                </th> -->
              <!-- </tr> -->
              <tr>
                <th rowspan="2">Ván thành phẩm</th>
                <th rowspan="2">Dung sai</th>
                <th colspan="5">Kết cấu ván lõi</th>
                <th rowspan="2">Tổng độ dày (mm)</th>
                <!-- <th colspan="2">Quy trình SX</th> -->
                <th colspan="4">SL SX</th>
              <th rowspan="2">Ngày hoàn thành</th>
              </tr>
              <tr>
                <td>Số lớp</td>
                <td>Cách xếp</td>
                <td>Độ dày (mm)</td>
                <td colspan="2">Loại gỗ</td>
                <!-- <td colspan="2">Công đoạn</td> -->
                <td>Tấm</td>
                <td>m3</td>
                <td>Thanh</td>
                <td>m3</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td :rowspan="strucres.length + 1">{{ PO[0].size }} mm</td>
                <th :rowspan="strucres.length + 1">
                  +{{ PO[0].plus }}mm/ -{{ PO[0].sub }}mm
                </th>
                <td colspan="2"></td>
                <td></td>
                <td></td>
                <td></td>
                <th></th>
                <!-- <td :rowspan="strucres.length + 1" colspan="2" class="text-left" style="padding-left: 5px">
                  <span class="text-orange" style="padding: 5px 0; font-weight: bold; font-size: 16px">Sản phẩm trước
                    rong</span>
                  <div style="padding-bottom: 50px">
                    <div v-for="(step, index) in PO" v-bind:key="index">
                      <div v-if="step.ItemVCN.id == PO[0].ItemVCN.id">
                        <b>{{ step.order }}</b>.
                        <span class="text-bold">{{
                            step.Department.name
                        }}</span>
                        <br />
                        {{ step.ItemVCN.name }} {{ step.ItemVCN.length }} x
                        {{ step.ItemVCN.width }} x {{ step.ItemVCN.height }}
                      </div>
                    </div>
                  </div>
                  <span class="text-orange" style="padding: 5px 0; font-weight: bold; font-size: 16px">Sản phẩm sau
                    rong</span>
                  <div v-for="(step, index) in stepSauRong" :key="index">
                    <b>{{ step.order }} {{ step.Department.name }}</b>
                    <div v-for="(item, index) in PO" v-bind:key="index">
                      <div v-if="
                        item.ItemVCN.id != PO[0].ItemVCN.id &&
                        step.Department.id == item.Department.id
                      ">
                        -
                        {{ item.ItemVCN.name }} {{ item.ItemVCN.length }} x
                        {{ item.ItemVCN.width }} x {{ item.ItemVCN.height }}
                      </div>
                    </div>
                  </div> -->
                  <!-- <div v-for="(step, index) in PO" v-bind:key="index">

                    <div v-if="step.ItemVCN.id != PO[0].ItemVCN.id">
                      <b>{{ step.order }}</b
                    >. <span class="text-bold">{{ step.Department.name }}</span> <br> {{ step.ItemVCN.name }} {{ step.ItemVCN.length }} x
                    {{ step.ItemVCN.width }} x {{ step.ItemVCN.height }}
                    </div>
                  </div> -->
                <!-- </td> -->
                <th :rowspan="strucres.length + 1">
                  {{ PO[0].quantity.toLocaleString("en-US") }}
                </th>
                <td :rowspan="strucres.length + 1">
                  {{
                      (PO[0].quantity * PO[0].ItemVCN.volumn).toLocaleString(
                        "en-US"
                      )
                  }}
                </td>
                <th :rowspan="strucres.length + 1">
                  {{ sumQuantitySauRong }}
                </th>
                <td :rowspan="strucres.length + 1">
                  {{ sumVolumnSauDong.toLocaleString() }}
                </td>
                 <td :rowspan="strucres.length + 1">
                  {{ moment(PO[0].ngayDongGoi, "YYYY-MM-DD").format("L") }}
                </td>
              </tr>
              <tr v-for="struc in strucres" v-bind:key="struc.__KEY__">
                <td>{{ struc.num }}</td>
                <td>{{ struc.style }}</td>
                <td>{{ struc.height }}</td>
                <td colspan="2">{{ struc.woodType }}</td>
                <th>{{ struc.height }}</th>
              </tr>
              <tr>
                <th colspan="7">Tổng cộng</th>
                <th>{{ sumHeight?sumHeight.toFixed(2):'' }}</th>
                <!-- <th colspan="2"></th> -->
                <th>{{ PO[0].quantity.toLocaleString("en-US") }}</th>
                <th>
                  {{
                      (PO[0].quantity * PO[0].ItemVCN.volumn).toLocaleString(
                        "en-US"
                      )
                  }}
                </th>
                <th>
                  {{ sumQuantitySauRong }}
                </th>
                <th>
                  {{ sumVolumnSauDong.toLocaleString("en-US") }}
                </th>
             <th></th>
              </tr>
            </tbody>
          </table>
          <b>II - Yêu cầu kỹ thuật:</b>
          <!-- <div class="row">
            <div class="col-2">1. Kết cấu ván</div>
            <div class="col-4">
              {{ yeuCauKyThuat.ketCau }}
            </div>
          </div> -->
          <!-- <div class="row">
            <div class="col-2">2. Độ ẩm ván/keo dán</div>
            <div class="col-4">Độ ẩm &lt; {{ yeuCauKyThuat.doAm }}</div>
          </div> -->
          <!-- <div class="row">
            <div class="col-2">3. Bề mặt ván</div>
            <div class="col-4">
              {{ yeuCauKyThuat.beMat }}
            </div>
          </div> -->
          <div class="row">
            <div class="col-2">1. Theo hồ sơ sản phẩm:</div>
            <div class="col-4">
              {{ yeuCauKyThuat.baCanh }}
            </div>
          </div>
            <div class="row">
            <div class="col-2">2. Chú ý:</div>
            <div class="col-4">
               {{ yeuCauKyThuat.chuy }} 
            </div>
          </div>
          <b>III - Nguyên liệu - vật tư:</b>
          <!-- <table class="table-custom text-center" border="1" width="100%">
            <thead>
              <tr>
                <th>Nhóm</th>
                <th>Tên NL, VT</th>
                <th>Quy cách (mm)</th>
                <th>ĐVT</th>
                <th>SL</th>
                <th>M3 phôi</th>
                <th>Tổng</th>
                <th>Hao hụt</th>
              </tr>
            </thead>
            <tr v-for="(e, index) in resources" v-bind:key="index">
              <td>{{ e.nhom }}</td>
              <td>{{ e.ten }}</td>
              <td>{{ e.qc }}</td>
              <td>{{ e.dvt }}</td>
              <td>
                {{
                    e.sl.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                }}
              </td>
              <td :style="
                e.m3
                  ? toString(e.m3).indexOf('CHÚ') > -1
                    ? 'background-color:yellow; font-weight:bold'
                    : ''
                  : ''
              ">
                {{ e.m3 }}
              </td>
              <td>{{ e.tong }}</td>
              <td>{{ e.haoHut }}</td>
            </tr>
          </table> -->
<!-- sau bang nguyen lieu vat tu bang Quasar  -->
<table style="height: 500px; width: 100%;" >
<div class="q-pa-md">
<q-table 
flat 
bordered 
class="text-center" 
:data="dataTable" 
:columns="columns" 
row-key="name" 
 
binary-state-sort>
  <template v-slot:body="props">
        <q-tr :props="props" @request="EditTable(props)">
          
          <q-td key='nhom' :props="props" >
            {{ props.row.nhom }}
            <q-popup-edit
              v-model="props.row.nhom"
              buttons
              label-set="Đổi"
              label-cancel="Đóng"
              v-slot="scope"
            >
              <q-input
                type="text"
                @change="EditTable(props)"
                v-model="props.row.nhom"
                dense
                autofocus
              ></q-input>
            </q-popup-edit>
          </q-td>

          <q-td key='ten' :props="props" >
            {{ props.row.ten }}
            <q-popup-edit
              v-model="props.row.ten"
              buttons
              label-set="Đổi"
              label-cancel="Đóng"
              v-slot="scope"
            >
              <q-input
                type="text"
                @change="EditTable(props)"
                v-model="scope.value"
                dense
                autofocus
              ></q-input>
            </q-popup-edit>
          </q-td>

          <q-td key='qc' :props="props" >
            {{ props.row.qc }}
            <q-popup-edit
              v-model="props.row.qc"
              buttons
              label-set="Đổi"
              label-cancel="Đóng"
              v-slot="scope"
            >
              <q-input
                type="text"
                @change="EditTable(props)"
                v-model="scope.value"
                dense
                autofocus
              ></q-input>
            </q-popup-edit>
          </q-td>

          <q-td key='dvt' :props="props" >
            {{ props.row.dvt }}
            <q-popup-edit
              v-model="props.row.dvt"
              buttons
              label-set="Đổi"
              label-cancel="Đóng"
              v-slot="scope"
            >
              <q-input
                type="text"
                @change="EditTable(props)"
                v-model="scope.value"
                dense
                autofocus
              ></q-input>
            </q-popup-edit>
          </q-td>

          <q-td key='sl' :props="props" >
            {{ props.row.sl }}
            <q-popup-edit
              v-model="props.row.sl"
              buttons
              label-set="Đổi"
              label-cancel="Đóng"
              v-slot="scope"
            >
              <q-input
                type="text"
                @change="EditTable(props)"
                v-model="scope.value"
                dense
                autofocus
              ></q-input>
            </q-popup-edit>
          </q-td>

          <q-td key='m3' :props="props" >
            {{ props.row.m3 }}
            <q-popup-edit
              v-model="props.row.m3"
              buttons
              label-set="Đổi"
              label-cancel="Đóng"
              v-slot="scope"
            >
              <q-input
                type="text"
                @change="EditTable(props)"
                v-model="scope.value"
                dense
                autofocus
              ></q-input>
            </q-popup-edit>
          </q-td>

          <q-td key='tong' :props="props" >
            {{ props.row.tong }}
            <q-popup-edit
              v-model="props.row.tong"
              buttons
              label-set="Đổi"
              label-cancel="Đóng"
              v-slot="scope"
            >
              <q-input
                type="text"
                @change="EditTable(props)"
                v-model="scope.value"
                dense
                autofocus
              ></q-input>
            </q-popup-edit>
          </q-td>

          <q-td key='haoHut' :props="props" >
            {{ props.row.haoHut }}
            <q-popup-edit
              v-model="props.row.haoHut"
              buttons
              label-set="Đổi"
              label-cancel="Đóng"
              v-slot="scope"
            >
              <q-input
                type="text"
                @change="EditTable(props)"
                v-model="scope.value"
                dense
                autofocus
              ></q-input>
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
</q-table>
</div>
</table>





          <table class="text-center" width="100%">
            <tr>
              <td style="padding-top: 20px" class="text-weight-bold">
                Người viết lệnh
              </td>
              <td style="padding-top: 20px" class="text-weight-bold">GĐSX</td>
              <td style="padding-top: 20px" class="text-weight-bold">
                Phòng kinh doanh
              </td>
            </tr>
            <tr>
              <td class="text-center">
                <span style="display: inline-block; width: 300px; height: 120px">
                  <img alt="Không có chữ kí số" width="300" height="115"
                    :src="`/statics/${PO[0].createdBy}.png`" /></span><br />
                {{ PO[0].acc1.lastName }}
              </td>
              <td class="text-center" v-if="PO[0].approvedByAccount">
                <span style="display: inline-block; width: 300px; height: 120px">
                  <img alt="Không có chữ kí số" width="200" height="115"
                    :src="`/statics/${PO[0].approvedByAccount}.png`" /></span><br />
                {{ PO[0].acc3.lastName }}
              </td>
              <td class="text-center" v-if="PO[0].approvedPKDBy">
                <span style="display: inline-block; width: 300px; height: 120px">
                  <img alt="Không có chữ kí số" width="200" height="115" :src="`/statics/${PO[0].approvedPKDBy}.png`" />
                </span><br />

                {{ PO[0].acc2.lastName }}
              </td>
              <!-- <td style="padding-top: 100px">Nguyễn Hữu Thuấn</td>
              <td style="padding-top: 100px">Vi Tiến Hưng</td> -->
            </tr>
          </table>
        </div>
        <div v-if="PO && PO[0].type != 'LVL'">
          <div v-if="userInfo.id == PO[0].createdBy && isReject" class="text-white bg-blue">
            lý do: {{ PO[0].description }}
          </div>
         <table class="table-custom" border="1" width="100%">
            <thead class="w-100">
              <tr>
                <td  class="text-center" width="120" rowspan="2">
                  <img width="120" height="120" v-bind:src="'https://app.woodsland.com.vn:2002/img/logo.06aa324e.png'" />
                </td>
                <!-- <td v-else class="text-center" width="120" rowspan="2">
                  WOODSLAND TUYÊN QUANG - NM YÊN SƠN 3
                </td> -->
                <td class="text-center">QUY TRÌNH KHỞI ĐỘNG SẢN PHẨM</td>
                <td width="240px" style="word-break: break-word" rowspan="2" >
                 <i>  Số LSX: {{ PO[0].number}}</i> 
            
               
                </td>
              </tr>
              <tr>
                <th>
               
                    LỆNH SẢN XUẤT <br>
                   KIÊM PHIẾU XUẤT KHO NGUYÊN LIỆU - VẬT TƯ 
                  
                </th>
              </tr>
               <tr>
         <td colspan="2" style="border:0px" ></td>
                <td colspan="1" style="text-left:right;">
               
                  <!-- Số LSX: {{ PO[0].number}} <br> -->
                  Ngày viết: {{ moment(PO[0].createdAt, "YYYY-MM-DD").format("L") }} 
                  <!-- Ngày hoàn thành: {{moment(PO[0].ngayDongGoi, "YYYY-MM-DD").format("L")}} -->
                 
                </td>
              </tr>
            </thead>
          </table>
          <b>I - Thông tin chung</b>
            <table class="table-custom" border="1" width="100%">
            <thead class="w-100">
              <!-- <tr>
              
                <td class="text-center" width="120" rowspan="1">
                  <strong>
                  Tên Khách hàng
                   </strong>
                </td>
                <td class="text-center"></td>
                <td width="150px" style="word-break: break-word" rowspan="1" class="text-center text-weight-bolder">
                  Trạng thái MT
                </td>
                 <td width="150px" style="word-break: break-word" rowspan="1" class="text-center text-weight-bolder">
                  FSC
                </td>
                 <td width="150px" style="word-break: break-word" rowspan="1" class="text-center text-weight-bolder">
                  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
                </td>
                 <td width="150px" style="word-break: break-word" rowspan="1" class="text-center text-weight-bolder">
                Non FSC
                </td>
                  <td width="150px" style="word-break: break-word" rowspan="1" class="text-center text-weight-bolder">
                  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
                </td>
              </tr> -->
              <!-- <tr> 
                <th>
                  <strong>
                    Mã khách hàng
                  </strong>
                </th>
                <th>
                
                </th>
                 <th rowspan="2" colspan="5">
                 
                </th>
              </tr> -->
              <tr>
                 <th>
                  <strong>
                    Sản phẩm
                  </strong>
                </th>
                <th>
                     {{ PO[0].ItemVCN.name }} :{{ PO[0].quantity}} 
                </th>
                <th width="50%"></th>
                
              </tr>
            </thead>
          </table>
          <br>
          <table class="table-custom text-center" border="1" width="100%">
            <thead>
              <!-- <tr>
                <td colspan="2" rowspan="2">Sản phẩm</td>
                <th colspan="6" rowspan="2">
                  {{ PO[0].ItemVCN.name }}
                </th> -->
                <!-- <th colspan="2">Khách hàng</th>
                <th colspan="3">{{ PO[0].Customer.NAME }}</th> -->
              <!-- </tr>
              <tr>
                <th colspan="2">Ngày viết LSX:</th>
                <th colspan="3">
                  {{ moment(PO[0].createdAt, "YYYY-MM-DD").format("L") }}
                </th>
              </tr> -->
              <tr>
                <th rowspan="2">Ván thành phẩm</th>
                <th rowspan="2">Dung sai</th>
                <th colspan="5">Kết cấu ván lõi</th>
                <th rowspan="2">Tổng độ dày (mm)</th>
                <!-- <th colspan="2">Quy trình SX</th> -->
                <th colspan="2">SL SX</th>
                <th rowspan="2">Ngày hoàn thành</th>
              </tr>
              <tr>
                <td>Số lớp</td>
                <td>Cách xếp</td>
                <td>Độ dày (mm)</td>
                <td colspan="2">Loại gỗ</td>
                <!-- <td colspan="2">Công đoạn</td> -->
                <td>Tấm</td>
                <td>m3</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td :rowspan="strucres.length + 1">{{ PO[0].size }} mm</td>
                <th :rowspan="strucres.length + 1">
                  +{{ PO[0].plus }}mm/ -{{ PO[0].sub }}mm
                </th>
                <td colspan="2"></td>
                <td></td>
                <td></td>
                <td></td>
                <th></th>
                <!-- <td :rowspan="strucres.length + 1" colspan="2" class="text-left q-pl-xl">
                  <p v-for="(step, index) in PO" v-bind:key="index">
                    <b>{{ step.order }}</b>. {{ step.Department.name }}
                  </p>
                </td> -->
                <th :rowspan="strucres.length + 1">
                  {{ PO[0].quantity.toLocaleString("en-US") }}
                </th>
                <td :rowspan="strucres.length + 1">
                  {{
                      (PO[0].quantity * PO[0].ItemVCN.volumn).toLocaleString(
                        "en-US"
                      )
                  }}
                </td>
                <td :rowspan="strucres.length + 1">
                  {{ moment(PO[0].ngayDongGoi, "YYYY-MM-DD").format("L") }}
                </td>
              </tr>
              <tr v-for="struc in strucres" v-bind:key="struc.__KEY__">
                <td>{{ struc.num }}</td>
                <td>{{ struc.style }}</td>
                <td>{{ struc.height }}</td>
                <td colspan="2">{{ struc.woodType }}</td>
                <th>{{ struc.height }}</th>
              </tr>
              <tr>
                <th colspan="7">Tổng cộng</th>
                <th>{{ sumHeight.toFixed(2) }}</th>
                <!-- <th colspan="2"></th> -->
                <th>
                  {{
                      PO[0].quantity.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                  }}
                </th>
                <th>
                  {{
                      (PO[0].quantity * PO[0].ItemVCN.volumn).toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )
                  }}
                </th>
                <!-- <th></th> -->
              </tr>
            </tbody>
          </table>
          <b>II - Yêu cầu kỹ thuật:</b>
          <!-- <div class="row">
            <div class="col-2">1. Kết cấu ván</div>
            <div class="col-4">
              {{ yeuCauKyThuat.ketCau }}
            </div>
          </div> -->
          <!-- <div class="row">
            <div class="col-2">2. Độ ẩm ván/keo dán</div>
            <div class="col-4">Độ ẩm &lt; {{ yeuCauKyThuat.doAm }}</div>
          </div> -->
          <!-- <div class="row">
            <div class="col-2">3. Bề mặt ván</div>
            <div class="col-4">
              {{ yeuCauKyThuat.beMat }}
            </div>
          </div> -->
          <div class="row">
            <div class="col-2">1. Theo hồ sơ sản phẩm:</div>
            <div class="col-4">
              {{ yeuCauKyThuat.baCanh }}
            </div>
          </div>
            <div class="row">
            <div class="col-2">2. Chú ý:</div>
            <div class="col-4">
           {{ yeuCauKyThuat.chuy }} 
            </div>
          </div>
          <b>III - Nguyên liệu - vật tư:</b>
          <table class="table-custom text-center" border="1" width="100%">
            <thead>
              <tr>
                <th>Nhóm</th>
                <th>Tên NL, VT</th>
                <th>Quy cách (mm)</th>
                <th>ĐVT</th>
                <th>SL</th>
                <th>M3 phôi</th>
                <th>Tổng</th>
                <th>Hao hụt</th>
              </tr>
            </thead>
            <tr v-for="(e, index) in resources" v-bind:key="index">
              <td>{{ e.nhom }}</td>
              <td>{{ e.ten }}</td>
              <td>{{ e.qc }}</td>
              <td>{{ e.dvt }}</td>
              <td>
                {{
                    e.sl
                }}
              </td>
              <td :style="
                e.m3
                  ? toString(e.m3).indexOf('CHÚ') > -1
                    ? 'background-color:yellow; font-weight:bold'
                    : ''
                  : ''
              ">
                {{ e.m3 }}
              </td>
              <td>{{ e.tong }}</td>
              <td>{{ e.haoHut }}</td>
            </tr>
          </table>

          


          <table class="text-center" width="100%">
            <tr>
              <td style="padding-top: 20px" class="text-weight-bold">
                Người viết lệnh
              </td>
              <td style="padding-top: 20px" class="text-weight-bold">GĐSX</td>
              <td style="padding-top: 20px" class="text-weight-bold">
                Phòng kinh doanh
              </td>
            </tr>
            <tr>
              <td class="text-center">
                <span style="display: inline-block; width: 300px; height: 120px">
                  <img alt="Không có chữ kí số" width="300" height="115"
                    :src="`/statics/${PO[0].createdBy}.png`" /></span><br />
                {{ PO[0].acc1.lastName }}
              </td>
              <td class="text-center" v-if="PO[0].approvedByAccount">
                <span style="display: inline-block; width: 300px; height: 120px">
                  <img alt="Không có chữ kí số" width="200" height="115"
                    :src="`/statics/${PO[0].approvedByAccount}.png`" /></span><br />
                {{ PO[0].acc3.lastName }}
              </td>
              <td class="text-center" v-if="PO[0].approvedPKDBy">
                <span style="display: inline-block; width: 300px; height: 120px">
                  <img alt="Không có chữ kí số" width="200" height="115" :src="`/statics/${PO[0].approvedPKDBy}.png`" />
                </span><br />

                {{ PO[0].acc2.lastName }}
              </td>
              <!-- <td style="padding-top: 100px">Nguyễn Hữu Thuấn</td>
              <td style="padding-top: 100px">Vi Tiến Hưng</td> -->
            </tr>
          </table>
          
        </div>
      </q-card-section>
      <q-dialog v-model="descriptionDialog" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Vui lòng nhập lý do từ chối:</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="description" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Đóng" v-close-popup />
            <q-btn flat label="Từ chối" class="text-weight-bolder" color="orange" @click="onReject" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Phê duyệt lệnh sản xuất</div>
          <span class="q-ml-sm">Bạn có muốn phê duyệt lệnh sản xuất: {{ selection }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Phê duyệt" @click="guiPheDuyet" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxExport,
  DxEditing,
  DxColumnChooser,
  DxHeaderFilter,
  DxGroupPanel,
  DxScrolling,
  DxGrouping,
} from "devextreme-vue/data-grid";
import { showNotifySuccess, showNotifyError } from "../../ultils";
import EditPoVue from "./EditPo.vue";
export default {
  // name: 'PageName',
  components: {
    DxDataGrid,
    DxColumn,
    DxSearchPanel,
    DxExport,
    DxEditing,
    DxColumnChooser,
    DxHeaderFilter,
    DxGroupPanel,
    DxScrolling,
    DxGrouping,
  },
  data() {
    
    return {
      goodsTypess: [
        {
          label: "LVL",
          value: "LVL",
          color: "LVL",
        },
        { label: "Birch", value: "Birch", color: "Birch" },
      ],
      dsLSXs: [],
      soLenhsPKD: [],
      factories1: null,
      xuong: null,
      xuongs: [],
      selection: [],
      chuaHoanThanhs: [],
      selection1: [],
      factory: null,
      goodsType: {
        label: "LVL",
        value: "LVL",
        code: "LVL",
      },
      soLenhsGDSX: [],
      solenhReject: null,
      solenhSXGDSXDaDuyet: [],
      dataFilter: null,
      soLenhSXCon: [],
      soLenhSX: [],
      PO: null,
      khovan:null,
      itemSauRong: [],
      sumQuantitySauRong: 0,
      sumVolumnSauDong: 0,
      stepSauRong: 0,
      tonkhovan:0,
      strucres: null,
      resources: null,
      sumHeight: 0,
      reject: false,
      descriptionDialog: false,
      description: "",
      selectionReject: [],
      isReject: false,
      edit: false,
      confirm: false,
      yeuCauKyThuat: {
        // ketCau:
        //   "Không được hở mạch, không chồng mỳ; keo dán bám dính, không tách lớp",
        // doAm: "14%; Keo E0",
        // baCanh: "Bả mịn bằng bột màu đồng màu với bề mặt ván",
      },
      dataTable:[],
      columns: [
        { name: 'nhom', align: 'left', label: 'Nhóm', field: 'nhom'},
        { name: 'ten', align: 'left', label: 'Tên NL,VT', field: 'ten'},
        { name: 'qc', align: 'center', label: 'Quy cách (m,m)', field: 'qc' },
        { name: 'dvt', align: 'center', label: 'ĐVT', field: 'dvt' },
        { name: 'sl', align: 'center', label: 'SL', field: 'sl'},
        { name: 'm3', align: 'center', label: 'M3 phôi', field: 'm3' },
        { name: 'tong', align: 'center', label: 'Tổng', field: 'tong' },
        { name: 'haoHut', align: 'center', label: 'Hoa hụt', field: 'haoHut' },
      ],
      
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo"]),
    // ...mapGetters("prod", ["factories", "goodsTypes"]),
  },
  methods: {
    ...mapActions("vcn", [
      "getLenhSanXuatCapPhoisVCN",
      "getsoLenhSanXuatCapPhoisVCN",
      "DELETE_PO",
      "getFactory",
      "REJECT_PO",
    ]),
    ...mapActions("vcn", ["GET_PO_BY_NUMBER_VCN", "getXuongByFactoryId","GET_TON_KHO_VCN"]),
    ...mapActions("messages", ["sendNotificationMail"]),
    ...mapActions("vcn", ["sendApprovedPKDVCN", "sendApprovedVCN"]),
    async chonNhaMay() {
      const payload = {
        factoryId: this.factory.id
      }
      const data = await this.getXuongByFactoryId(payload);
      data.map(e => (e.label = e.name));
      this.xuongs = data;

    },
    async EditTable({row}){
      // console.log("Hien thi request lai bang",row);

      
    },
    async chonXuong() {
      // console.log("this.xuong", this.xuong);
      this.loadData(this.xuong.id);

    },
    async rowUpdated() { },
    rejectPO() {
      this.descriptionDialog = true;
    },
    async deletePO() {
      let payload = {
        number: this.PO[0].number,
        endPO: 0
      }
      const data = await this.$store.dispatch("vcn/DELETE_PO", payload);
      if (data.meta.success) {
        showNotifySuccess();
        await this.loadData(this.xuong.id);
        await this.loadsolenh(this.xuong.id);
      } else {
        this.$q.notify({
          message: "Có lỗi xảy ra",
          caption: "",
          color: "red",
        });
      }
    },
    async onReject() {
      let payload = {
        number: this.PO[0].number,
        description: this.description,
      };
      let data = await this.REJECT_PO(payload);
      if (data.meta.success) {
        showNotifySuccess();
        await this.loadData(this.xuong.id);
        await this.loadsolenh(this.xuong.id);
      } else {
        this.$q.notify({
          message: "Có lỗi xảy ra",
          caption: "",
          color: "red",
        });
      }
    },
    async loadData(stepId) {
      console.log("stepId", stepId);
      const payload = {
        factoryId: stepId
      }
      const data = await this.getsoLenhSanXuatCapPhoisVCN(payload);
      const lsx = await this.getLenhSanXuatCapPhoisVCN(payload);
      let soLenhsPKD = lsx;
      let soLenhsGDSX = lsx;
      this.soLenhsPKD = [];
      soLenhsPKD.forEach((e) => {
        if (
          e.approvedByAccount != null &&
          e.approvedPKDBy == null &&
          e.type == this.goodsType.value
        ) {
          this.soLenhsPKD.push(e.number);
        }
      });
      this.soLenhsGDSX = [];
      soLenhsGDSX.forEach((e) => {
        if (
          e.approvedByAccount == null &&
          e.approvedPKDBy == null &&
          e.type == this.goodsType.value
        ) {
          this.soLenhsGDSX.push(e.number);
        }
      });
      this.soLenhsGDSX = [...new Set(this.soLenhsGDSX)];
      this.soLenhsPKD = [...new Set(this.soLenhsPKD)];
      this.solenhSXGDSXDaDuyet = this.soLenhsPKD;
      this.chuaHoanThanhs = data.filter((e) => e.type == this.goodsType.value);
    },
    async loadsolenh(stepId) {
      console.log("loadsolenh", stepId);
      const payload = {
        factoryId: stepId
      }
      this.selection1 = await this.getsoLenhSanXuatCapPhoisVCN(payload);
    },
    async searchPO() {
      await this.loadData(this.xuong.id);
      await this.loadsolenh(this.xuong.id);
    },
    suaLenhSanXuat() {
      this.$router.push(`/edit-po-vcn/${this.PO[0].number}`);
    },
    async selectedPo(value) {
      this.PO = [];
      let number = value;
      const data = await this.GET_PO_BY_NUMBER_VCN({ number });
      // console.log("data bang can hien thi", data.data.resources);
      this.strucres = [];
      this.strucres = JSON.parse(data.data[0].strucre);
      this.resources = [];
      this.resources = JSON.parse(data.data[0].resources);
      this.yeuCauKyThuat = {};
      this.yeuCauKyThuat = JSON.parse(data.data[0].yeuCauKyThuat);
      // console.log("resources", this.resources);
      this.dataTable = [];
      this.resources.forEach(x=>{
        this.dataTable.push({
          nhom:x.nhom,
          ten:x.ten,
          qc:x.qc,
          dvt:x.dvt,
          sl:x.sl,
          m3:x.m3,
          tong:x.tong,
          haoHut:x.haoHut,
          id:x.id,
        })
      })
      this.sumHeight = 0;
      this.strucres.forEach(
        (e) =>
          (this.sumHeight = parseFloat(this.sumHeight) + parseFloat(e.height))
      );
      this.PO = data.data;
      this.sumQuantitySauRong = 0;
      this.sumVolumnSauDong = 0;
      let listDepartment = this.PO.filter(
        (p) => p.ItemVCN.id != this.PO[0].ItemVCN.id
      );
      this.stepSauRong = [];
      listDepartment.forEach((el) => {
        if (
          this.stepSauRong.filter((e) => e.Department.id == el.Department.id).length == 0
        ) {
          this.stepSauRong.push(el);
        }
      });
      console.log("stepSauRong", this.stepSauRong);
      this.itemSauRong = data.data.filter((d) => d.order == 2 && d.ItemVCN.id != data.data[0].ItemVCN.id);
      console.log("itemSauRong", this.itemSauRong);
      this.itemSauRong.forEach((el) => {
        this.sumQuantitySauRong += el.quantity;
        this.sumVolumnSauDong += el.quantity * el.ItemVCN.volumn;
      });
      console.log("this.sumVolumnSauDong", this.sumVolumnSauDong);
      console.log("po", this.PO);
      if (this.PO[0].approvedPKDBy == null) {
        this.reject = true;
      } else {
        this.reject = false;
      }
      if (
        this.PO[0].approvedByAccount == null &&
        this.userInfo.id == this.PO[0].createdBy
      ) {
        this.edit = true;
      } else {
        this.edit = false;
      }
      this.isReject = false;
      if (this.PO[0].loaisp == 'BTP' && this.PO[0].type == 'Birch'){
        if (this.PO[0].factoryId == 102745) this.khovan = 102767
        if (this.PO[0].factoryId == 102531) this.khovan = 102757
        if (this.PO[0].factoryId == 102817) this.khovan = 102825
        let payload = {
        khovan:this.khovan,
        id:this.PO[0].ItemVCN.id
        }
        let data = await this.GET_TON_KHO_VCN(payload);
        this.tonkhovan = data.data[0].tonkho
      }
      if (this.PO[0].approvedPKDBy != null)
     this.selection = []
    },
    confirmPheDuyet() {
      this.confirm = true;
    },
    async sendMailPheDuyet(accountId, mail) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/Approved-Plan-VCN`;
      } else {
        baseUrl = `http://localhost:5000/#/Approved-Plan-VCN`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Có LSX ${this.selection} được duyệt`,
        title: "Nhấp vào đây để đi tới phê duyệt",
        dataBody: `Có LSX ${this.selection} được duyệt. Mời bạn vào xem`,
      };
      console.log("payload mail", payloadMail);
      await this.sendNotificationMail(payloadMail);
    },
    async sendMailPheDuyetView(accountId, mail) {
      let baseUrl = null;
      if (process.env.PROD) {
        baseUrl = `https://app.woodsland.com.vn:2002/#/View-PO-VCN/${this.selection}`;
      } else {
        baseUrl = `http://localhost:5000/#/View-PO-VCN/${this.selection}`;
      }
      let payloadMail = {
        baseUrl: baseUrl,
        email: mail,
        accountId: this.userInfo.id,
        toAccountId: accountId,
        subject: `Có LSX ${this.selection} được duyệt`,
        title: "Nhấp vào đây để đi tới phê duyệt",
        dataBody: `Có LSX ${this.selection} được duyệt. Mời bạn vào xem`,
      };
      console.log("payload mail", payloadMail);
      await this.sendNotificationMail(payloadMail);
    },
    async guiPheDuyet() {
      console.log("this.xuong", this.xuong);
      if (
        (this.userInfo.id === this.xuong.accountId || this.userInfo.id === this.xuong.gdsx) &&
        this.PO[0].approvedByAccount == null
      ) {
        let data = this.sendApprovedVCN({
          accountId: this.userInfo.id,
          poIds: this.selection,
        });
        let baseUrl = null;
        if (process.env.PROD) {
          baseUrl = `https://app.woodsland.com.vn:2002/#/Approved-Plan-VCN`;
        } else {
          baseUrl = `http://localhost:5000/#/Approved-Plan-VCN`;
        }
        let payloadMail = {
          baseUrl: baseUrl,
          email: "Hanttt@woodsland.com.vn",
          accountId: this.userInfo.id,
          toAccountId: 101678,
          subject: `Có lệnh sản xuất  ${this.selection} được tạo`,
          title: "Nhấp vào đây để đi tới phê duyệt",
          dataBody: `Lệnh sản xuất ${this.selection} được tạo. Mời bạn vào phê duyệt`,
        };
        console.log("payload mail", payloadMail);
        await this.sendNotificationMail(payloadMail);
        await this.loadData(this.xuong.id);
        await this.loadsolenh(this.xuong.id);
        await this.selectedPo(this.selection);
        this.$q.notify({
          message: "Phê duyệt lệnh sản xuất thành công !",
          color: "green",
        });
      } else if (
        (this.userInfo.id == 101678 ) &&
        this.PO[0].approvedByAccount != null
      ) {
        this.sendApprovedPKDVCN({
          accountId: this.userInfo.id,
          poIds: this.selection,
        });
     
        console.log("this.factory", this.factory);
        if (
          this.xuong.id == 102498 ||
          this.xuong.id == 102531
        ) {
          this.sendMailPheDuyetView(101720, "toanvv@woodsland.com.vn");
          this.sendMailPheDuyetView(101827, "tamnv@woodsland.vn");
          this.sendMailPheDuyetView(101910, "thuyhtt.wltq@gmail.com");
          this.sendMailPheDuyetView(101912, "nguyenhong.wltq@gmail.com");
          this.sendMailPheDuyetView(101908, "phantuoi.wltq@gmail.com");
          this.sendMailPheDuyetView(101651, "tuantt@woodsland.com.vn");
        }

        if (
          this.xuong.id == 102744 ||
          this.xuong.id == 102745
        ) {
          this.sendMailPheDuyetView(101720, "toanvv@woodsland.com.vn");
          this.sendMailPheDuyetView(101827, "tamnv@woodsland.vn");
          this.sendMailPheDuyetView(106866, "truongtx.viforex@gmail.com");
          this.sendMailPheDuyetView(106864, "Hoanghop.2609@gmail.com");
          this.sendMailPheDuyetView(101651, "tuantt@woodsland.com.vn");
        }
        if (
          this.xuong.id == 102817 ||
          this.xuong.id == 102818
        ) {
          this.sendMailPheDuyetView(106885, "tc0969519488@gmail.com");
          this.sendMailPheDuyetView(101827, "tamnv@woodsland.vn");
          this.sendMailPheDuyetView(101907, "dung.wltq@gmail.com");
        }
        this.sendMailPheDuyetView(101713, "tupa@woodsland.com.vn");
        this.sendMailPheDuyetView(101714, "ducdc@woodsland.vn");
        this.sendMailPheDuyetView(101715, "vunn@woodsland.vn");
        this.sendMailPheDuyetView(101716, "caovanvuwl@gmail.com");
           await this.loadData(this.xuong.id);
        await this.loadsolenh(this.xuong.id);
        await this.selectedPo(this.selection);
        this.$q.notify({
          message: "Phê duyệt lệnh sản xuất thành công !",
          color: "green",
        });
      } else {
        this.$q.notify({
          message: "Bạn không có quyền phê duyệt!",
          color: "orange",
        });
      }
    },
    // }
  },
  async created() {
    let factories1 = await this.getFactory();
    factories1.map((factory) => {
      factory.label = factory.name;
      factory.factoryId = factory.id;
      factory.gdsx = factory.gdsx
    });
    this.factories1 = factories1;
    // new Date(lsx.ngayDongGoi).getTime() >= new Date().getTime()
    let dateNow = new Date().getTime();
    console.log("dateNow", dateNow);
  },
};
</script>
<style scoped>
table {
  border-collapse: collapse;
  table-layout: fixed;
}

thead {
  width: 100%;
}
</style>
