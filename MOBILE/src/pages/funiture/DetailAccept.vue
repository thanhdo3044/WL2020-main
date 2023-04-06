<template>
  <q-page class="q-pa-md">
    <div class="row justify-end print-hide">
      <div class="col-3">
        <q-btn  @click="showPrint" round color="primary" icon="print" />
      </div>
    </div>
    <div class="row justify-center" style="text-align: center;">
      <div class="col-3">
        <img src="/statics/logo.png" style="width:30vw;max-width:150px;" />
      </div>
      <div
        class="col-8 justify-center"
        style="margin-top: 25px;margin-left: 21px;font-size:12px"
      >
        <p>CÔNG TY CỔ PHẦN WOODSLAND</p>
        <p
          style="margin-top: -13px !important;"
        >Block 49K - Quang Minh Industrial Zone - Me Linh - Ha Noi - Viet Nam</p>
        <!-- <p style="margin-top: -13px !important;">Tel: +84435840122 Fax: +84431834944</p> -->
      </div>
    </div>
    <q-separator></q-separator>
    <div class="row justify-center q-mt-md">
      <div
        class="col-12 prodTextTitle"
        style=" text-align:center;font-size: 17px !important;"
      >BIÊN BẢN NGHIỆM THU LẮP ĐẶT</div>
    </div>
    <div class="row justify-center prodTextNormal">
      <div class="col-2"></div>
      <div class="col-4">Công trình :</div>
      <div class="col-6">........{{this.$store.state.funiture.acceptSelected.projectId}}</div>
      <div class="col-2"></div>
      <div class="col-4">Hạng mục :</div>
      <div class="col-6">........{{this.$store.state.funiture.acceptSelected.categories}}</div>
      <div class="col-2"></div>
      <div class="col-4">Địa điểm :</div>
      <div class="col-6">........{{this.$store.state.funiture.acceptSelected.address}}</div>
      <div class="col-2"></div>
      <div class="col-4">Chủ đầu tư :</div>
      <div class="col-6">........{{this.$store.state.funiture.acceptSelected.customer.name}}</div>
    </div>
    <div class="row prodTextNormal">
      <div class="col-10">1. Đối tượng nghiệm thu</div>
      <div class="col-2">
        <q-icon class="print-hide" @click="showDialog=true" name="add_circle" style="color:green;font-size: 22px;" />
      </div>
    </div>
    <q-separator></q-separator>
    <div class="row lt-md">
      <div class="col-12">
        <table  v-if="numOf.length>0" style="width:98%; font-family:'Time New Roman'">
          <tr>
            <th style="width:10px">STT</th>
            <th>Sản phẩm</th>
            <th>Kích thước</th>
            <th>SL</th>
            <th>Ghi chú</th>
          </tr>
          <tr v-for="(item,index) in numOf" :key="item.id">
            <td style="text-align:center">{{index+1}}</td>
            <td >{{item.name}}</td>
            <td style="text-align:center">{{item.height || '?' +' '+item.width || '?'+' '+ item.length || '?'+' '}}</td>
            <td style="text-align:center">{{item.quantity}}</td>
            <td>{{item.note}}</td>
          </tr>
          <tr>
            <td style="text-align:center" colspan="3">Tổng cộng :</td>
            <td style="text-align:center" colspan="2">{{totalQty}}</td>
          </tr>
        </table>
        <table v-else style="width:98%;font-family:'Time New Roman'">
          <tr>
            <th style="width:10px">STT</th>
            <th>Sản phẩm</th>
            <th>Kích thước</th>
            <th>SL</th>
          </tr>
          <tr>
            <td style="text-align:center" colspan="5">Không có dữ liệu !</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="row gt-sm">
      <div class="col-12">
        <table v-if="numOf.length>0" style="width:98%;font-family:'Time New Roman'">
          <tr>
            <th style="width:10px">STT</th>
            <th>Sản phẩm</th>
            <th>Kích thước</th>
            <th>SL</th>
            <th>Ngày ghi nhận</th>
            <th>Ghi chú</th>
          </tr>
          <tr v-for="(item,index) in numOf" :key="item.id">
            <td style="text-align:center">{{index+1}}</td>
            <td>{{item.name}}</td>
            <td>{{item.height || '?' +' '+item.width || '?'+' '+ item.length || '?'+' '}}</td>
            <td>{{item.quantity}}</td>
            <td>???</td>
            <td>{{item.note}}</td>
          </tr>
          <tr>
            <td style="text-align:center" colspan="5">Tổng cộng :</td>
            <td>{{totalQty}}</td>
          </tr>
        </table>
        <table v-else style="width:100%">
          <tr>
            <th style="width:10px">STT</th>
            <th>Sản phẩm</th>
            <th>Kích thước</th>
            <th>SL</th>
            <th>Ngày ghi nhận</th>
            <th>Ghi chú</th>
          </tr>
          <tr>
            <td style="text-align:center" colspan="6">Không có dữ liệu !</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="row q-mt-sm" style="font-family:'Time New Roman'">
      <div class="col-12">
        <strong>2. Thành phần tham gia nghiệm thu</strong>
        <strong>a. Đại diện chủ đầu tư</strong>
        <p>- Ông/bà : ...................................................</p>
        <p>- Ông/bà : ...................................................</p>
        <strong>b. Tư vấn giám sát</strong>
        <p>- Ông/bà : ...................................................</p>
        <p>- Ông/bà : ...................................................</p>
        <strong>c. Nhà thầu thi công</strong>
        <p>- Ông/bà : ...................................................</p>
        <p>- Ông/bà : ...................................................</p>
      </div>
    </div>
    <div class="row q-mt-sm" style="font-family:'Time New Roman'">
      <div class="col-12">
        <strong>3. Thời gian nghiệm thu</strong>
      </div>
    </div>
    <div class="row q-mt-sm" style="font-family:'Time New Roman'">
      <div class="col-2 gt-md">
        
      </div>
      <div class="col-12 col-md-8">
        <p>Bắt đầu :.....giờ......ngày......tháng.......năm</p>
        <p>Kết thúc :......giờ......ngày......tháng.......năm</p>
      </div>
    </div>
    <div class="row q-mt-sm" style="font-family:'Time New Roman'">
      <div class="col-12">
        <strong>4. Đánh giá công việc lắp đặt</strong>
        <p>a. Tài liệu làm căn cứ nghiệm thu</p>
        <p>- Căn cứ theo hợp đồng .................................................</p>
        <p>- Hồ sơ thiết kế bản vẽ thi công được chủ đầu tư phê duyệt và những thay đổi thiết kế đã được chấp thuận</p>
        <p>- Căn cứ vào nghị đinh số 46.2015/NĐ-CP của chính phủ về quản lý chất lượng công trình xây dựng</p>
        <p>- Tiêu chuẩn, quy phạm xây dựng được áp dụng :</p>
        <p style="color:blue">  TCVN 4055: 2012 Tổ chức thi công </p>
        <p style="color:blue">  TCVN 5038: 1991 Quy phạm kỹ thuật an toàn trong xây dựng </p>
        <p style="color:blue">  TCVN 5637: 1991 Quản lý chất lượng xây lắp công trình xây dựng. Thi công và nghiệm thu </p>
        <p style="color:blue">Các tiêu chuẩn khác.</p>
        <p>- Các văn bản khác có liên quan đến đối tượng nghiệm thu</p>
        <strong>
          b. Chất lượng công việc đã hoàn thành : 
        </strong>
        <p>..................................................................................................................................</p>
        <strong>
          c. Ý kiến của đơn vị giao thầu : 
        </strong>
        <p>..................................................................................................................................</p>
        <p>..................................................................................................................................</p>
        <strong>
          d. Các ý kiến khác : 
        </strong>
        <p>..................................................................................................................................</p>
        <p>..................................................................................................................................</p>
        <strong>5. Kết luận :</strong>
        <p style="font-style:italic">.............Đồng ý nghiệm thu...........................................................................</p>
        <p>..................................................................................................................................</p>
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="col-4 prodTextTitle">
        CHỦ ĐẦU TƯ
      </div>
      <div class="col-4 prodTextTitle">
        TƯ VẤN GIÁM SÁT
      </div>
      <div class="col-4 prodTextTitle">
        NHÀ THẦU THI CÔNG
      </div>
    </div>
    <div class="row">
      <div style="min-height:200px"></div>
    </div>
    <q-dialog persistent v-model="showDialog">
      <q-card>
        <q-card-section>
          <div
            style="    font-size: 18px;
    font-family: 'Time';
    font-weight: 700;"
          >Ghi nhận nghiệm thu lắp đặt</div>
        </q-card-section>

        <q-card-section>
          <div class="row">
            <div class="col-12">
              <q-select
                input-debounce="0"
                style="font-family:'Time New Roman';font-size:16px"
                v-model="item"
                behavior="dialog"
                :options="items"
                label="Chọn sản phẩm :"
              />
            </div>
          </div>
          <br />
          <div class="row">
            <div class="col-12">
              <q-select outlined v-model="type" :options="types" label="Loại" />
            </div>
          </div>
          <br />
          <div class="row">
            <div class="col-12">
              <q-input outlined type="number" v-model.number="qty" label="Số lượng lắp đặt" />
            </div>
          </div>
          <br />
          <div class="row">
            <div class="col-12">
              <q-input outlined v-model="note" label="Ghi chú" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" v-close-popup />
          <q-btn @click="submit" flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      numOf: [],
      showDialog: false,
      items: [],
      item: null,
      qty: "",
      acceptId: 0,
      note: "",
      types: [{ label: "Đạt", value: 1 }, { label: "Hỏng", value: 0 }],
      type: { label: "Đạt", value: 1 },
      totalQty: 0
    };
  },
  watch: {
    numOf(val) {
      let total = 0;
      val.forEach(el => {
        total += parseFloat(el.quantity);
      });
      this.totalQty = total;
      console.log(total);
    }
  },
  created() {
    this.acceptId = this.$route.params.id;
    Promise.all([this.initData(this.acceptId), this.loadProducts()]).then(
      res => {
        console.log("load done");
      }
    );
  },
  methods: {
    showPrint(){
      window.print()
    },
    async submit() {
      if (this.item && parseFloat(this.qty) > 0) {
        const payload = {
          acceptId: this.$route.params.id,
          productId: this.item.value,
          quantity: this.qty,
          note: this.note,
          type: this.type.value
        };
        console.log(payload);
        let result = await this.$store.dispatch(
          "funiture/ACTION_ADD_DATA_TO_ACCEPT",
          payload
        );
        if (result.meta.success === true) {
          this.$q.notify({
            message: "Ghi nhận thành công !",
            color: "green"
          });
          this.initData(this.acceptId);
        } else {
          this.$q.notify({
            message: "Thiếu thông tin !",
            color: "red"
          });
        }
      } else {
        this.$q.notify({
          message: "Thiếu thông tin !",
          color: "red"
        });
      }
    },
    async initData(acceptId) {
      let data = await this.$store.dispatch(
        "funiture/ACTION_LOAD_DETAIL_ACCEPT",
        acceptId
      );
      if (data.meta.success === true) {
        this.numOf = data.data;
      } else {
        this.$q.notify({
          message: data.meta.messages.message,
          color: "red"
        });
      }
    },

    async loadProducts() {
      const projectId = this.$store.state.funiture.acceptSelected.projectId;
      let dataItems = await this.$store.dispatch(
        "funiture/ACTION_LOAD_ITEM_FROM_PROJECT",
        projectId
      );
      dataItems.data.forEach(element => {
        let size =
          (element.height || "0") +
          "*" +
          (element.width || "0") +
          "*" +
          (element.length || "0");
        const it = {
          label: element.name + " >>> " + size,
          value: element.itemId,
          size: size
        };
        this.items.push(it);
      });
    }
  }
};
</script>

<style scope>
table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid black;
}
@media print {
  .print-hide, aside {
    display:none !important;
  }
  .layout-page-container {
    padding: 0px !important;
  }
}
</style>