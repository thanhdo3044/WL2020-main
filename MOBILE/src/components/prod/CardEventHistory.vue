<template>
  <div class="row justify-center q-ma-sm " >
      <div class="col-12 col-sm-6">
          <q-card class="bg-blue-grey-7" style="border:2px solid white">
            <q-card-section>
                <div class="row">
                    <div class="col-8">
                        <div class="prodTextTitle text-white">
                            Lịch sử
                        </div>
                    </div>
                    <div v-if="events.length>0"  class="col-4" align="right">
                         <q-btn @click="clearLog" flat style="color: #FF0080" label="Xóa lịch sử" />
                    </div>
                </div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section>
                <q-markup-table dark class="bg-blue-grey-7" separator="cell">
                    <thead>
                        <tr>
                            <th class="text-left">Thời gian</th>
                            <th class="text-left">Sự kiện</th>
                            <th class="text-right">Số pallet</th>
                            <th class="text-center">Loại pallet</th>
                            <th class="text-right">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in events" v-bind:key="index" v-bind:class="item.eventName==='Nhận Pallet' ? 'bg-indigo-8' : 'bg-teal'">
                            <td class="text-left">{{item.timeStamp}}</td>
                            <td class="text-right">{{item.eventName}}</td>
                            <td class="text-right">
                                <q-badge @click="goDetail(item.palletCode)" color="blue">
                                    {{item.palletCode}} 
                                </q-badge>
                            </td>
                            <td class="text-center">{{item.palletType}}</td>
                            <td class="text-right">{{item.status===1 ? 'Thành công ' : 'Thất bại'}}</td>
                        </tr>
                        
                    </tbody>
                    </q-markup-table>
            </q-card-section>
        </q-card>
      </div>
  </div>
</template>

<script>
export default {
    props: {
        events:{
            type: Array
        },
        goDetail:{
            type:Function
        }
    },
    methods:{
        clearLog(){
            console.log('aa')
            localStorage.removeItem('eventlog')
            this.$root.$emit('reload-event-log',true)
        }
    }
}
</script>

<style>

</style>