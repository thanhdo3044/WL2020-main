<template>
  <div class="row">
       <div class="col-12">
           <q-expansion-item
        expand-separator
        icon="local_bar"
        label="Thông tin Vật tư"
        caption="Nhấn để mở"
        style="font-family: 'Time';"
      >
        <q-card>
            <div class="row">
                <div class="col-8"></div>
                <div class="col-auto">
                    <q-btn outline rounded color="primary" label="Thêm" />
                </div>
            </div>
          <q-card-section>
            <q-markup-table separator="cell" flat bordered>
                <thead>
                    <tr>
                        <th class="text-right">Loại Vật tư</th>
                        <th class="text-right">Số lô</th>
                        <th class="text-right">Thêm bởi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-right">Keo 502</td>
                        <td class="text-right">2019213223132</td>
                        <td class="text-right">Nguyen Van A</td>
                    </tr>
                    <tr>
                        <td class="text-right">Dau 1992</td>
                        <td class="text-right">20192132231321</td>
                        <td class="text-right">Nguyen Van B</td>
                    </tr>
                </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </q-expansion-item>
       </div>
      
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>