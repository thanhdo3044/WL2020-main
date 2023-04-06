<template>
   <q-markup-table flat bordered>
    <thead class="bg-grey">
        <tr>
        <th colspan="5">
            <div class="row no-wrap items-center">
            <div class="text-h4 q-ml-md text-white">{{oscp.tenMay || ''}}</div>
            <q-space />
            <q-btn flat v-show="showAction" color="secondary" icon="edit" label="Sửa" @click="edit(oscp)" />
            <q-btn flat v-show="showAction" class="q-ml-sm" color="red" icon="close" label="Xóa" @click="del(oscp)" />
            </div>
        </th>
        </tr>
        <tr>
        <th class="text-left">Thông số </th>
        <th class="text-center">Giá trị</th>
        </tr>
    </thead>
    <tbody class="bg-grey-3">
        <tr>
            <td class="text-center">Số công nhân</td>
            <td class="text-center">{{oscp.soCongNhan}} (người)</td>
        </tr>
        <tr>
            <td class="text-center">Thời gian hoàn thành chi tiết (CĐ)</td>
            <td class="text-center">{{oscp.thoiGianHoanThanhChiTiet}} (s)</td>
        </tr>
        <tr>
            <td class="text-center">Số công lao động/chu kỳ</td>
            <td class="text-center">{{oscp.soCongLaoDongTrenChuKy}} (công)</td>
        </tr>
        <tr>
            <td class="text-center">Tổng thời gian chu kỳ</td>
            <td class="text-center">{{oscp.tongThoiGianChuKy}} (s)</td>
        </tr>
        <tr>
            <td class="text-center">Công xuất máy</td>
            <td class="text-center">{{oscp.congSuatMay}} (kW)</td>
        </tr>
        <tr>
            <td class="text-center">Điện năng/chu kỳ</td>
            <td class="text-center">{{oscp.dienNangTrenChuKy}} (kWh)</td>
        </tr>
        <tr>
            <td class="text-center">Tồn kho công đoạn</td>
            <td class="text-center">{{oscp.tonKhoCongDoan}} (pcs)</td>
        </tr>
        <tr>
            <td class="text-center">Thời gian vận chuyển & lưu công đoạn</td>
            <td class="text-center">{{oscp.thoiGianVanChuyen}} (s)</td>
        </tr>
    </tbody>
    </q-markup-table>
</template>

<script>
export default {
    props:{
        oscp:{
            type:Object
        },
        edit:{
            type:Function,
            default:()=>{}
        },
        del:{
            type:Function,
            default:()=>{}
        },
        showAction:{
            type:Boolean,
            default:true
        }
    }
}
</script>

<style>

</style>