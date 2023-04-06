<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                      Nhập kho
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced  />
          <q-card-section>
            <div class="widget-container">
                <SelectBoxHinhThuc :defaultValue="ht" :dataSource="hinhthucnhap" :title="'Hình thức nhập'" :onChange="eventChonHinhThuc" />
                <SelectBoxQuiCach :dataSource="quicachs" :title="'Chọn qui cách :'"
                :displayColumn="'code'" :searchColumn="'code'"  :onChange="eventChonQuiCach" />

                <div class="dx-field">
                    <div class="dx-field-label">Số bó</div>
                    <div class="dx-field-value">
                    <DxNumberBox
                        :value="sobo"
                        @value-changed="changeSoBo"
                    />
                    </div>
                </div>
                <div class="dx-field">
                    <div class="dx-field-label">Số thanh/bó</div>
                    <div class="dx-field-value">
                    <DxNumberBox
                        :value="sothanhbo"
                        @value-changed="changeSoThanhBo"
                    />
                    </div>
                </div>
                <div class="dx-field">
                    <div class="dx-field-label">Để lại</div>
                    <div class="dx-field-value">
                    <DxCheckBox :value="delai" @value-changed="eventChangeDelai"/>
                    </div>
                </div>
                <div class="dx-field">
                    <div class="dx-field-label">Ghi chú</div>
                    <div class="dx-field-value">
                    <DxTextBox
                        :value="note"
                        @value-changed="changeNote"
                    />
                    </div>
                </div>
            </div>
          </q-card-section>
          <q-card-actions  align="right">
              <q-btn outline color="primary" @click="showConfirm = true"  icon="save_alt" label="Lưu lại" />
          </q-card-actions>
      </q-card>
      <q-dialog v-model="showConfirm" persistent>
          <q-card style="min-width:400px">
              <q-card-section class="row items-center">
                 <div class="row top-title"
                 > Bạn đã chắc chắn ?</div>
              </q-card-section>
              <q-card-section>
                  <p>Qui cách : {{this.quicachName}}</p>
                  <p>Số bó: {{this.sobo}}</p>
                  <p>Số thanh / bó: {{this.sothanhbo}}</p>
                  <p>Ghi chú : {{this.note}}</p>
              </q-card-section>
              <q-card-actions align="right">
                  <q-btn flat label="Hủy" color="primary" v-close-popup />
                  <q-btn flat label="Đồng Ý" @click="save" color="primary" v-close-popup />
              </q-card-actions>
          </q-card>
      </q-dialog>
  </q-page>
</template>

<script>
import { DxNumberBox ,DxCheckBox,DxTextBox} from 'devextreme-vue';
import SelectBoxQuiCach from '../commons/SelectBox'
import SelectBoxHinhThuc from '../commons/SelectBox'
import { showNotifySuccess, showNotifyError } from '../../ultils'
export default {
    components:{
        SelectBoxQuiCach,
        DxNumberBox,
        SelectBoxHinhThuc,
        DxCheckBox,
        DxTextBox
    },
    data(){
        return {
            quicachs:[],
            sobo:0,
            sothanhbo:0,
            ht:'0',
            hinhthucnhap:[
                {
                    id:'0',name:'Bình thường'
                },
                {id:'H',name: 'Nhập Hạ Cấp'},
                {id:'C',name:'Nhập Loại C'},
                {id:'L',name:'Nhập hàng loại'}
            ],
            delai:false,
            note:'',
            quicach:0,
            showConfirm:false,
            quicachName:''
        }
    },
    created(){
        this.loadQuiCach()
    },
    methods:{
        async save(){
            if (this.quicach>0&&this.sobo>0&&this.sothanhbo>0) {
                const payload = {
                    sophieuId:this.$route.params.guid,
                    quicachId: this.quicach,
                    sobo:this.sobo,
                    sothanhbo: this.sothanhbo,
                    note: this.note,
                    delai: this.delai ? 'Y' : 'N',
                    notehc:this.ht
                }
                const data = await this.$store.dispatch('nlg/NHAP_KHO',payload)
                if (data.data[0].RESULT) {
                    showNotifySuccess()
                    this.$router.go(-1)
                } else {
                    showNotifyError(data.data[0].MESSAGE)
                }
            }else{
                showNotifyError('Vui lòng nhập đầy đủ thông tin !')
            }
            
        },
        async loadQuiCach(){
            const data = await this.$store.dispatch('nlg/GET_QUI_CACH')
            this.quicachs = data.data
        },
        async eventChonQuiCach(e){
           this.quicach =e.value
           this.quicachName = this.quicachs.find(q=>{return q.id===e.value}).code
        },
        changeSoBo(e){
            this.sobo=e.value
        },
        changeSoThanhBo(e){
            this.sothanhbo = e.value
        },
        eventChonHinhThuc(e){
            this.ht=e.value
        },
        eventChangeDelai(e){
            this.delai = e.value
        },
        changeNote(e){
            this.note = e.note
        }
    }
}
</script>

<style>

</style>