<template>
  <div>
    <q-markup-table separator="none" flat bordered>
      <tbody style="margin-top:-50px">
        <tr with="100px">
          <td >
            <img
              src="https://bizweb.dktcdn.net/100/194/501/themes/530748/assets/logo.png?1593130296806"
              alt
            /><span class="q-ml-sm">CÔNG TY CỔ PHẦN WOODSLAND</span>
          </td>
          <td >
            
            <!-- <p>
              Lô số 49K, KCN Quang Minh, TT Chi Đông, H Mê Linh, Tp Hà Nội. Việt
              Nam
            </p>
            <p>TEL: 04.35840122 * FAX: 04.38134944</p> -->
          </td>
          <!-- <td class="text-right">
            <p>BM_KD 05</p>
            <p>Ngày BH: 15.2004</p>
            <p>Lần BH: 01</p>
          </td> -->
        </tr>
      </tbody>
    </q-markup-table>
    <p class="text-right q-mt-sm">
      Ngày {{ order.createdAt.slice(8,10) }} tháng
      {{ order.createdAt.slice(5,7) }} năm
      {{ order.createdAt.slice(0,4) }}
    </p>
    <h6 style="margin-top:-20px;margin-bottom:0px" class="text-center">{{ order.ProposalForm.name.toUpperCase() }}</h6>
  </div>
</template>
<script>
export default {
  props: ["order"]
};
</script>
