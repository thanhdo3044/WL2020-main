<template>
  <q-card class="q-mb-sm">
    <q-card-section v-if="order.ProposalForm.slug == 'mua-hang'">
      <BuyItem :order="order" :disable="disable" :metaValue="metaValue"></BuyItem>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'thanh-toan'">
      <Payment :order="order" :metaValue="metaValue"></Payment>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'de-nghi-tam-ung'">
      <RequestAdvance :order="order" :metaValue="metaValue"></RequestAdvance>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'vat-tu'">
      <VatTu :order="order" :disable="disable" :metaValue="metaValue"></VatTu>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'tuyen-nhan-vien'">
      <TuyenNhanVien :order="order" :disable="disable" :metaValue="metaValue"></TuyenNhanVien>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'de-nghi-luong'">
      <DeNghiLuong :order="order" :disable="disable" :metaValue="metaValue"></DeNghiLuong>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'chuyen-nhan-vien'">
      <ChuyenNhanVien :order="order" :disable="disable" :metaValue="metaValue"></ChuyenNhanVien>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'xin-nghi-viec'">
      <XinNghiViec :order="order" :disable="disable" :metaValue="metaValue"></XinNghiViec>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'xin-ra-cong'">
      <XinRaCong :order="order" :disable="disable" :metaValue="metaValue"></XinRaCong>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'di-cong-tac'">
      <DiCongTac :order="order" :disable="disable" :metaValue="metaValue"></DiCongTac>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'cap-bao-ho-lao-dong'">
      <CapBaoHoLaoDong :order="order" :disable="disable" :metaValue="metaValue"></CapBaoHoLaoDong>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'bien-ban-ban-giao'">
      <BienBanBanGiao :order="order" :disable="disable" :metaValue="metaValue"></BienBanBanGiao>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'sua-chua'">
      <SuaChua :order="order" :disable="disable" :metaValue="metaValue"></SuaChua>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'van-phong-pham'">
      <VanPhongPham :order="order" :disable="disable" :metaValue="metaValue"></VanPhongPham>
    </q-card-section>
    <q-card-section v-else-if="order.ProposalForm.slug == 'xac-nhan-cong'">
      <XacNhanCong :order="order" :disable="disable" :metaValue="metaValue"></XacNhanCong>
    </q-card-section>
  </q-card>
</template>

<script>
import RequestAdvance from "components/E-Offices/PrintOrder/Shared/RequestAdvance.vue";
import Payment from "components/E-Offices/PrintOrder/Shared/Payment.vue";
import BuyItem from "components/E-Offices/PrintOrder/Shared/BuyItem.vue";
import VatTu from "components/E-Offices/PrintOrder/Shared/VatTu.vue";
import XinNghiViec from "components/E-Offices/PrintOrder/Shared/XinNghiViec.vue";
import XinRaCong from "components/E-Offices/PrintOrder/Shared/XinRaCong.vue";
import TuyenNhanVien from "components/E-Offices/PrintOrder/Shared/TuyenNhanVien.vue";
import DeNghiLuong from "components/E-Offices/PrintOrder/Shared/DeNghiLuong.vue";
import DiCongTac from "components/E-Offices/PrintOrder/Shared/DiCongTac.vue";
import ChuyenNhanVien from "components/E-Offices/PrintOrder/Shared/ChuyenNhanVien.vue";
import CapBaoHoLaoDong from "components/E-Offices/PrintOrder/Shared/CapBaoHoLaoDong.vue";
import BienBanBanGiao from "components/E-Offices/PrintOrder/Shared/BienBanBanGiao.vue";
import SuaChua from "components/E-Offices/PrintOrder/Shared/SuaChua.vue";
import VanPhongPham from "components/E-Offices/PrintOrder/Shared/VanPhongPham.vue";
import XacNhanCong from "components/E-Offices/PrintOrder/Shared/XacNhanCong.vue";
export default {
  props: ["order", "metaValue"],
  data(){
    return{
      disable:true
    }
  },
  components: {
    RequestAdvance,
    Payment,
    BuyItem,
    VatTu,
    TuyenNhanVien,
    DeNghiLuong,
    ChuyenNhanVien,
    XinNghiViec,
    XinRaCong,
    DiCongTac,
    BienBanBanGiao,
    CapBaoHoLaoDong,
    SuaChua,
    VanPhongPham,
    XacNhanCong
  }
};
</script>
