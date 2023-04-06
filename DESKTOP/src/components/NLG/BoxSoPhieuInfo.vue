<template>
  <table
    class="tableprint"
    cellspacing="0"
    style="border-collapse:collapse; width:100%"
  >
    <tbody>
      <tr>
        <td
          style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; height:21px; vertical-align:bottom; white-space:nowrap"
        >
          <b>Đơn vị giao hàng :</b>&nbsp; {{ phieunhapkho.name }}
        </td>
        <td
          style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:1px solid black; height:21px; vertical-align:bottom; white-space:nowrap"
        >
          Số phiếu : {{ phieunhapkho.sophieu }}
        </td>
      </tr>
      <tr>
        <td
          style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
        >
          <b>Địa chỉ : </b>{{ phieunhapkho.NCC_ADDRESS }}
        </td>
        <td
          style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
        >
          Biển số xe: {{ phieunhapkho.BIENSOXE }}
        </td>
      </tr>
      <tr>
        <td
          style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
        >
          <b>Kho nhập : </b>{{ phieunhapkho.tenkho }}
        </td>
        <td
          style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
        >
          Ngày Nhập : {{ phieunhapkho.ngaynhapht.slice(0, 10) }}
        </td>
      </tr>
      <tr>
        <td
          style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
        >
          <b>Trạng thái MT</b>: FSC100%&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Nhóm
          SP: W5
        </td>
        <td
          style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
        >
          Mã lô gỗ nhập :&nbsp;
        </td>
      </tr>
      <tr>
        <td
          style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
        >
          <b>Loại gỗ: Acacia Mangium</b>
        
        </td>
        <td
          style="border-bottom:1px solid black; border-left:1px solid black; border-right:1px solid black; border-top:none; height:21px; vertical-align:bottom; white-space:nowrap"
        >
          
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    phieunhapkho: {
      type: Object
    }
  }
};
</script>

<style></style>
