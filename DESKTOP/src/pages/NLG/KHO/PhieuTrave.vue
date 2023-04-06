<template>
  <q-page class="q-pa-md">
      <q-card class="my-card">
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                     Sửa dữ liệu nhập kho
                  </div>
                  <div class="col-2" align="right">
                      <q-btn color="red" icon="close" label="Xóa" @click="confirmDel = true" />
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced  />
          <q-card-section>
            <div class="widget-container">
                <SelectBoxQuiCach :dsKho="dskhos" :onChange="eventChonKho"/>
               <SelectBoxNCC :id="name" :dataSource="dsNCC" :title="'Chọn nha NCC:'" :onChange="eventChonNcc" />
                

                <div class="dx-field">
                    <div class="dx-field-label">Số phiếu trả về</div>
                    <div class="dx-field-value">
                    <DxNumberBox
                        :value="phieutrave"
                        @value-changed="changephieutrave"
                    />
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
import SelectBoxQuiCach from '../../../components/NLG/SelectBoxKho'
import SelectBoxKho from '../../../components/NLG/SelectBoxKho'
import SelectBoxNCC from '../../../components/NLG/SelectBoxNcc'
import SelectBoxHinhThuc from '../../../components/commons/SelectBox'
import { showNotifySuccess, showNotifyError } from '../../../ultils';
export default {
    components:{
        SelectBoxQuiCach,
        DxNumberBox,
        SelectBoxHinhThuc,
        SelectBoxNCC,
        DxCheckBox,
        DxTextBox
    },
    data(){
        return {
            quicachs:[],
            dupplicateNcc:[],
            dskhos:[],
            dsNCC:[],
            sophieutrave:'',
            makho:'',
            mancc:'',
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
            quicachName:'',
            detail:null,
            delFlag:false,
            confirmDel:false
        }
    },
    created(){
       this.loadkho()
       this.loadNhaCungCap()
    },
    methods:{
        remove(){
            const payload = {
                id:this.$route.params.id,
                
                delai: 'T'
                
            }
            this.sendRequest(payload)
        },
        async sendRequest(payload){
            const data = await this.$store.dispatch('nlg/EDIT_NHAP_KHO',payload)
            if (data.data[0].RESULT) {
                showNotifySuccess()
                this.$router.go(-1)
            } else {
                showNotifyError(data.data[0].MESSAGE)
            }
        },
        // async load(){
        //     const payload = {
        //         id:this.$route.params.id
        //     }
        //     const data = await this.$store.dispatch('nlg/GET_PHIEU_NHAP_KHO_DT',payload)
            
        //     if (data.data.length>0) {
        //         this.detail = data.data[0]
        //         this.ht = this.detail.NOTE_HC[0]
        //         this.quicach =this.detail.ID_QUICACH
        //         this.sobo = this.detail.SOBO
        //         this.sothanhbo = this.detail.SOTHANHBO
        //         this.note = this.detail.NOTE
        //         this.delai = this.detail.DELAI.trim() ==='N' ? false :true
        //     } else {
        //         showNotifyError('(@&#(&!&#')
        //     }
        // },
       async  save(){
         if (this.makho&&this.mancc) {
            const payload1  = {
        sophieutrave:this.sophieutrave,
        makho:this.makho,
        mancc:this.mancc
       // note:this.note
      }
      const data = await this.$store.dispatch('nlg/TRA_VE',payload1)
                const payload = {
                   id:this.$route.params.ID,
                     delai:'T',
                     SOPHIEUTRAVE:this.sophieutrave
                }
               const data1 = await this.$store.dispatch('nlg/EDIT_NHAP_KHO',payload)
              this.$router.push('/nlg-ds-de-lai')   
         }
           // const data = await this.$store.dispatch('nlg/NHAP_KHO',payload)
              else  showNotifyError('Vui lòng nhập đầy đủ thông tin !')
            
            
        },
        async loadkho(){
           const duppp = []
           const data = await this.$store.dispatch('nlg/GET_DS_KHO')
            data.data.forEach(e=>{
                duppp.push({
                    text: e.name = e.tenkho,
                   value: e.makho
                })
            })
           this.dupplicateNcc = duppp
          
              this.dskhos= data.data
           
        },
         async loadNhaCungCap(){
           const data = await this.$store.dispatch('nlg/GET_DS_NHA_CUNG_CAP')
                
                this.dsNCC = data.data
            
        },
        // async loadQuiCach(){
        //     const data = await this.$store.dispatch('nlg/GET_QUI_CACH')
        //     this.quicachs = data.data
        // },
        async eventChonNcc(e){
           this.mancc =e.value
           //this.Namencc = this.dsNCC.find(q=>{return q.id===e.value}).code
        },
        changephieutrave(e){
            this.sophieutrave=e.value
        },
        eventChonKho(e){
            this.makho = e.value
        },
        // eventChonHinhThuc(e){
        //     this.ht=e.value
        // },
        // eventChangeDelai(e){
        //     this.delai = e.value
        // },
        changeNote(e){
            this.note = e.note
        }
    }
}
</script>

<style>

</style>