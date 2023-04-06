<template>
  <q-page class="q-pa-sm">
      <div class="row justify-center">
          <div class="col-6 prodTextTitle">
              <q-select  v-model="region" :options="regions" label="Chọn bảng giá" />
          </div>
          <div class="col-6" align="right">
              <q-btn @click="goUpdate" flat style="color: #FF0080" label="Cập nhật bảng giá" />
          </div>
      </div>
      <div class="row justify-center q-ma-sm">
          <div class="col-12">
              <q-card class="q-my-lg q-pa-md">
                  <q-card-section>
                      <DxPivotGrid
                        id="pivotgrid"
                        ref="grid"
                        :data-source="dataSource"
                        
                        :allow-filtering="true"
                        :show-borders="true"
                        :show-column-grand-totals="false"
                        :show-row-grand-totals="false"
                        :show-row-totals="false"
                        :show-column-totals="false"
                        >
                        <!-- <DxFieldChooser
                            :enabled="true"
                            :height="400"
                        /> -->
                        </DxPivotGrid>
                  </q-card-section>
              </q-card>
          </div>
      </div>
      <div class="row justify-start">
          <div class="col-10">
              <h5>Các điều kiện tính toán</h5>
          </div>
          
      </div>
      <div class="row justify-start">
          <div class="col-12">
              <table style="width:96%">
                  <tr>
                      <th>STT</th>
                      <th>Mô tả</th>
                      <th>Hành động</th>
                  </tr>
                  <tr v-for="(item,index) in options" v-bind:key="index">
                      <td>{{index+1}}</td>
                      <td><p>{{item.DESCRIPTION}}</p></td>
                      <td>
                          <q-checkbox @input="checkOption(index,item.CID,item.OID)" v-model="item.USE_FLAG" />
                      </td>
                  </tr>
              </table>
          </div>
      </div>
      <q-dialog v-model="showAddCondition" persistent>
          <q-card>
              <q-card-section class="row items-center">
                  <span class="q-ml-sm">Bạn đã chắc chắn !</span>
              </q-card-section>
              <q-card-section>
                  <div>{{messageDialog}}</div>
              </q-card-section>
              <q-card-actions align="right">
                  <q-btn @click="cancel" flat label="Hủy" color="primary" v-close-popup />
                  <q-btn @click="saveMapOption" flat label="Đồng ý" color="primary" v-close-popup />
              </q-card-actions>
          </q-card>
      </q-dialog>
  </q-page>
</template>

<script>
import {
  DxPivotGrid,
  DxFieldChooser
} from 'devextreme-vue/pivot-grid';
export default {
    components: {
        DxPivotGrid,
        DxFieldChooser
    },
    data () {
        return {
            priceLists : [],
            regions:[],
            region:null,
            showAddCondition:false,
            dataSource: {
                
            },
            options:[],
            changeStatus:false,
            cid:null,
            oid:null,
            currentIndexOption:null,
            messageDialog:'',
            myModuleCode:''
        }
    },
    created () {
        this.myModuleCode = this.$route.query.type
        this.loadRegion()
    },
    mounted () {
        // const pivotGrid = this.$refs.grid.instance;
        // const pivortDataSource = pivotGrid.getDataSource();
        // setTimeout(function() {
        //     pivortDataSource.expandHeaderItem('column',['DTYPE','WOOD_TYPE'])
        //     // dataSource.expandAll('DTYPE');
        //     // dataSource.expandHeaderItem('column', ['DTYPE']);
        // }, 0);
    },
    watch:{
        region(val){
            if (val.value) {
                this.loadPrice(val.value)
            }
        },
    },
    methods: {
        // load(val){
        //     this.loadPrice(val.value)
        // },
        saveOption(){

        },
        cancel(){
            this.options[this.currentIndexOption].USE_FLAG = !this.options[this.currentIndexOption].USE_FLAG
        },
        async saveMapOption(){
            let payload = {
                cid:this.cid,
                oid:this.oid,
                rid:this.region.value
            }
            let data = await this.$store.dispatch('nlvan/CHANGE_MAP_CONDITION',payload)
            if (data.data[0].RESULT) {
                this.$q.notify({
                    message:data.data[0].MESSAGE,
                    color:'green'
                })
            }else {
                 this.$q.notify({
                    message:data.data[0].MESSAGE,
                    color:'red'
                })
            }
        },
        checkOption(index,cid,oid){
            this.currentIndexOption = index
            this.cid = cid
            this.oid = oid || 0
            let messageTitle = this.options[index].USE_FLAG ? 'Thêm điều kiện' : 'Bỏ điều kiện'
            let messageBody = this.options[index].DESCRIPTION
            this.messageDialog = messageTitle + '\n'+ messageBody
            this.showAddCondition =true
        },
        async loadRegion(){
            let data = await this.$store.dispatch('nlvan/GET_REGION',{module:this.myModuleCode})
            data.data.forEach(element => {
                let r ={
                    value: element.ID,
                    label: element.NAME
                }
                this.regions.push(r)
            });
            if (this.regions.length>0) {
                this.region=this.regions[0]
            }
        },
        goUpdate(){
            this.$router.push('/nl-view-price-list-update?type='+this.myModuleCode)
        },
        async loadPrice(regionId) {
            this.changeStatus = false
            let payload = {
                moduleCode:this.myModuleCode,
                regionId:regionId
            }
            let data = await this.$store.dispatch('nlvan/GET_PRICE_RAW_DATA',payload)
            data.data.options.forEach(element => {
                if (element.USE_FLAG===0) {
                    element.USE_FLAG = false
                }else {
                    element.USE_FLAG=true
                }
            })
            this.options = data.data.options
            // this.priceLists = data.data
            let source = {
                fields: [{
                caption: 'ITYPE_NAME',
                width: 120,
                dataField: 'ITYPE_NAME',
                area: 'row',
                expanded: true,
                }, {
                caption: 'HEIGHT',
                area: 'row',
                width: 150,
                expanded: true,
                selector: function(data) {
                    return `${data.HEIGHT}*${data.WIDTH}*${data.LENGTH}`;
                }
                }, {
                dataField: 'WTYPE_NAME',
                area: 'column',
                expanded: true,
                }, {
                dataField: 'DTYPE_NAME',
                area: 'column',
                expanded: true,
                }, {
                caption: 'Price',
                dataField: 'PRICE',
                dataType: 'number',
                summaryType: 'sum',
                area: 'data',
                format:"fixedPoint"
                }],
                store: data.data.data
            }
            this.dataSource = source
        }
    }
}
</script>

<style lang="sass" scoped="">
.box-ribbon-wrapper
  margin: 0 auto
  position: relative
</style>
<style scoped>
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>