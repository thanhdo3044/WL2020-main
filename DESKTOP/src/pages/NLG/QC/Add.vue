<template>
  <q-page class="q-pa-md">
      <q-card class="my-card" v-if="loadDone">
          <q-card-section>
             <div class="row">
                 <div class="col-10 top-title">
                     Nghiệm thu
                 </div>
                 <div class="col-2" align="right">
                     <q-btn color="green" icon="keyboard_arrow_left" label="Trở lại" @click="()=>{this.$router.go(-1)}" />
                 </div>
             </div>
          </q-card-section>
          <q-separator spaced    />
          <q-card-section>
              <div class="row">
                  <div class="col-10 top-title">
                      Thông tin chính phẩm
                  </div>
                  <div class="col-2" align="right">
                      <!-- <q-btn color="primary" icon="save_alt" label="Lưu lại" @click="()=>{}" /> -->
                  </div>
              </div>
              <div class="row">
                  <div class="col-12 col-sm-6">Qui cách :</div>
                  <div class="col-12 col-sm-6"> {{chinhpham.DAY ?chinhpham.DAY :'?'}}x{{chinhpham.RONG}}x{{chinhpham.CAO}}</div>
                  <div class="col-12 col-sm-6">Số bó nhập :</div>
                  <div class="col-12 col-sm-6">{{chinhpham.SOBO}}</div>
                  <div class="col-12 col-sm-6">Số thanh / bó</div>
                  <div class="col-12 col-sm-6">{{chinhpham.SOTHANH_BO}}</div>
                  <div class="col-12 col-sm-6">Số bó mẫu :</div>
                  <div class="col-12 col-sm-6">
                      <span @click="showChangeSample = true" class="fake-link">{{slmau}}</span>
                      <!-- <input type="text" v-model="chinhpham.SLMAU"> -->
                  </div>
                  <div class="col-12 col-sm-6">Tỷ lệ</div>
                  <div class="col-12 col-sm-6">{{((chinhpham.QTY/(chinhpham.SOTHANH_BO*chinhpham.SLMAU)*100))}}%</div>
                  </div>
                
                  <div class="row">
                  <div class="col-10 top-title">
                      Thông tin để lại
                  </div>
                  <div class="col-2" align="right">
                      
                  </div>
              </div>
              <div class="row">
                  <div class="col-12 col-sm-6">Qui cách :</div>
                  <div class="col-12 col-sm-6"> {{chinhpham.DAY ?chinhpham.DAY :'?'}}x{{chinhpham.RONG}}x{{chinhpham.CAO}}</div>
                  
                 
                  <div class="col-12 col-sm-6">Số bó để lại:</div>
                  <div class="col-12 col-sm-6">
                      <span v-if="this.delai1 > 0" @click="showChangeSample1 = true" class="fake-link">{{this.delai1}}</span>
                      
                  </div>
                  </div>
           
              <div class="row q-mt-sm justify-around" >
                  <div class="col-12 col-sm-4">
                    <q-btn  color="secondary" label="Để lại toàn bộ" @click="delaitoanbo" />
                  </div>
                  <div class="col-12 col-sm-4">
                      <q-btn color="red"  label="Để lại 1 phần" @click="delai1phan" />
                  </div>
              </div>
          </q-card-section>
          <q-separator spaced    />
          <q-card-section>
              <DxDataGrid
                :data-source="dataSource"
                :show-borders="true"
                :no-data-text="'Không có dữ liệu !'"
                :show-column-lines="true"
                :columns-auto-width="true"
                :allow-column-resizing="true"
                key-expr="id"
                @row-inserted="add"
                @row-updated="update"
                @row-removed="del"
                @editorPreparing="onEditorPreparing"
                
            >
             <DxEditing
                :allow-updating="true"
                :allow-adding="true"
                :allow-deleting="true"
                mode="popup"
            />
            <DxExport
            :enabled="false"
            :allow-export-selected-data="false"
            :file-name="'Chi tiết phiếu nhập kho'"
            />
            <!-- <DxSearchPanel :visible="true" :placeholder="'Tìm kiếm'" :width="400"/> -->
            <DxColumn
                caption="STT"
                data-field="id"
                format="fixedPoint"
                alignment="center"
                width="50"
                
                cell-template="cellTemplate"
              />
              <DxColumn
                    data-field="TYPE"
                    caption="Loại nghiệm thu"
                >
                <DxRequiredRule/>
                    <DxLookup
                        :data-source="typeHc"
                        display-expr="typeName"
                     value="id"
                        />
                </DxColumn>
              <DxColumn
                    data-field="quicach"
                    caption="Mã Qui Cách(Hàng loại C và hàng loại ko chọn)"
                >
                
                    <DxLookup
                        :data-source="quicac"
                        display-expr="code"
                       value="id"
                        />
                </DxColumn>
            
             <DxColumn
                data-field="sothanh"
                caption="Số Lượng(thanh)"
                alignment="center"
                width="120"
                
            >
              
                       
                       
                </DxColumn>
             <DxColumn
                data-field="tyle"
                caption="tỷ lệ đạt ( không nhập cột này)"
              
                alignment="center"
                width="120"
                format="#0.## %"
            />
            <DxColumn
                data-field="gapDoi"
                caption="Gấp đôi"
                alignment="center"
                width="100"
               
               cell-template="gapDoi-template"
               >
             <DxLookup
                    :data-source="gapDoi"
                    display-expr="name"
                    value-expr="id"
                    />
                    </DxColumn>
            
             
            <DxColumn
                data-field="NOTE"
                caption="Ghi chú"
                
            />
            <!-- <DxSummary>
             <DxTotalItem
                column="ID"
                summary-type="count"
                value-format="fixedpoint"
                display-format="Tổng cộng : "
                show-in-column="SOBO"
              />
              <DxTotalItem
                column="Tổng số thanh"
                summary-type="sum"
                value-format="fixedpoint"
                display-format="{0}"
              />
              <DxTotalItem
                column="KHOILUONG"
                summary-type="sum"
                value-format="###0.####"
                display-format="{0}"
              />
            </DxSummary> -->
            <template #cellTemplate="cell">
              <p>{{cell.data.rowIndex+1}}</p>
            </template>
            <template #gapDoi-template="cell">
               <div v-if="cell.data.value.trim() =='Y'">Gấp đôi</div>
               <div v-else>-</div>
            </template>   
            <template #cellTemplateOverPlan="cell">
              <span style="font-weight:700;color:red" v-if="cell.data.value===1">Ngoài kế hoạch</span>
              <span v-else></span>
            </template>
             <!-- <template #sl_cellTemplate="cell">
             <q-input v-model.number="cell.data.data.sothanh" type="number"/>
            </template> -->
            </DxDataGrid>
          </q-card-section>
      </q-card>
      <!-- <q-card v-else class="my-card">
          <q-card-section>
            <div class="row justify-center">
                <div class="col-4">
                    <q-spinner-ios 
                    color="primary"
                    size="20em"
                />
                <h4>Vui lòng chờ....</h4>
                </div>
            </div>
          </q-card-section>
      </q-card> -->
      <q-dialog v-model="showChangeSample" persistent>
          <q-card>
              <q-card-section class="row items-center">
                 <div class="row top-title">
                     Cập nhật số lượng mẫu
                 </div>
              </q-card-section>
              <q-card-section>
                  <q-input v-model.number="slmau" type="number" label="Số bó mẫu" />
              </q-card-section>
              <q-card-actions align="right">
                  <q-btn flat label="Hủy" color="primary" v-close-popup />
                  <q-btn flat label="Đồng ý" @click="changeSample" color="primary" v-close-popup />
              </q-card-actions>
          </q-card>
      </q-dialog>
       <q-dialog v-model="showChangeSample1" persistent>
          <q-card>
              <q-card-section class="row items-center">
                 <div class="row top-title">
                     sửa số bó để lại
                 </div>
              </q-card-section>
              <q-card-section>
                  <q-input v-model.number="delai1" type="number" label="Số bó để lại" />
              </q-card-section>
              <q-card-actions align="right">
                  <q-btn flat label="Hủy" color="primary" v-close-popup />
                  <q-btn flat label="Đồng ý" @click="changeSample1" color="primary" v-close-popup />
              </q-card-actions>
          </q-card>
      </q-dialog>
      <q-dialog v-model="showFormdelai" persistent>
          <q-card style="min-width:380px">
              <q-card-section class="row items-center">
                  <div class="row">
                      <div class="col-12 top-title">
                          Xác nhận để lại !
                      </div>
                  </div>
              </q-card-section>
              <q-card-section>
                  <div class="row">
                      <div class="col-12">
                          <q-input :disable="typeDelai==='TB'" v-model.number="sobodelai" type="number" label="Số bó để lại :" />
                      </div>
                      <div class="col-12">
                          <q-input v-model="notedelai" type="text" label="Ghi chú" />
                      </div>
                  </div>
              </q-card-section>
              <q-card-actions align="right">
                  <q-btn flat label="Hủy" color="primary" v-close-popup />
                  <q-btn flat label="Đồng ý" @click="delai" color="primary" v-close-popup />
              </q-card-actions>
          </q-card>
      </q-dialog>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem,
  DxLookup,DxRequiredRule,DxEditing
} from 'devextreme-vue/data-grid';
import { mapGetters, mapActions } from "vuex";
import { showNotifyError,showNotifySuccess } from '../../../ultils'
export default {
    components:{
        DxDataGrid,
        DxColumn,
        DxGrouping,
        DxGroupPanel,
        DxPager,
        DxPaging,
        DxSearchPanel,
        DxLookup,
        DxRequiredRule,
        DxEditing,
        DxExport,DxHeaderFilter,DxSummary,DxGroupItem,DxTotalItem
    },
    data(){
        return {
            typeDelai:'TB',//1phan
            chinhpham:[],
            delai1p:null,
            dataSource:[],
            typeHc:[],
            quicachs:[],
            quicac:[],
            sothanhhacap:0,
            qty:0,
            manvl:'',
            gapDoi:[
                {id:'Y',name:'Gấp đôi'},
                {id:'N',name: '-'}
            ],
            loadDone:true,
            showChangeSample:false,
            showChangeSample1:false,
            slmau:0,
            delai1:0,
            dataSourceDupp:[],
            showFormdelai:false,
            sobodelai:0,
            notedelai:''
        }
    },
    computed:{
       
        ...mapGetters("base",["userInfo"])
    },
    created(){
        this.loadHaCaps()
        this.loadTypeHc()
            
      this.loadChinhPham().then(() => {
      this.loaddelai();
       this.loadQuiCach();
    }); 
          console.log('QC:',this.quicac)
             
               
          
     
       
    },
    methods:{
         async changeSample1(){
            
               const payload = {
                        //delai:'Y',
                         id:this.chinhpham.id,
                        sobo:this.chinhpham.SOBO - this.delai1 + this.delai1p.SOBO
                  
                     
                    }
                    
                    const data = await this.$store.dispatch('nlg/EDIT_NHAP_KHO',payload)
              const payload1 = {
                        //delai:'Y',
                         id:this.delai1p.ID,
                        sobo:this.delai1 
                  
                     
                    }
                    
                    const data1 = await this.$store.dispatch('nlg/EDIT_NHAP_KHO_DELAI',payload1)
                    this.loadChinhPham().then(() => {
      this.loaddelai();
    });
                    
         },
        async delai(){
            
            if (this.sobodelai>0) {
                
              if (this.typeDelai==='TB'){
                 const payload = {
                        delai:'Y',
                        note:this.notedelai,
                        id:this.chinhpham.id,
                        
                        sobo:this.chinhpham.SOBO,
                        
                    }
                    const data = await this.$store.dispatch('nlg/EDIT_NHAP_KHO',payload)
                    if (data.meta.success) {
                   showNotifySuccess()
                    this.$router.go(-1)
                    }
              }else{
                    const payload = {
                        //delai:'Y',
                         id:this.chinhpham.id,
                        sobo:this.chinhpham.SOBO - this.sobodelai,
                        note:this.notedelai
                     
                    }
                    
                    const data = await this.$store.dispatch('nlg/EDIT_NHAP_KHO',payload)
                    const payload1 = {
                        delai:'Y',
                        qc_inspector:'N',
                        delFlag:'N',
                        CODENHOM:this.chinhpham.CODENHOM,
                       //  id:this.chinhpham.id,
                        sobo:this.sobodelai,
                        note:this.notedelai,
                        DAY:this.chinhpham.DAY,
                        RONG:this.chinhpham.RONG,
                        CAO:this.chinhpham.CAO,
                        createBy:this.userInfo.account,
                        sothanh_bo:this.chinhpham.SOTHANH_BO,
                        CODE:this.chinhpham.CODE,
                        sophieunhap:this.chinhpham.sophieunhap
                     
                    }
                    
                    const data1 = await this.$store.dispatch('nlg/NHAP_KHO',payload1)
                    if (data.meta.success) {
                        
                        showNotifySuccess()
                        this.loadChinhPham().then(() => {
      this.loaddelai();
    });
                    }else{
                        showNotifyError()
                    }
              }
            }else{
                showNotifyError('Vui lòng nhập số bó để lại !')
            }
        },
        delaitoanbo(){
            this.typeDelai='TB'
            this.sobodelai =this.chinhpham.SOBO
            this.showFormdelai = true
        },
        delai1phan(){
            this.typeDelai ='1P'
            this.showFormdelai = true
        },
        initRow(e){
            e.data.code = this.chinhpham.quicach
        },
        async changeSample(){
            
           this.loadHaCaps()
           console.log(this.sothanhhacap)
             this.qty = parseInt(this.slmau*this.chinhpham.SOTHANH_BO  - this.sothanhhacap)
             console.log(this.qty )
            if (this.slmau>0) {
                const payload = {
                    id:this.chinhpham.id,
                    SAMPLEQTY:this.slmau,
                    QTY:this.qty
                }
                const data = await this.$store.dispatch('nlg/EDIT_NHAP_KHO',payload)
                if  (data.meta.success) {
                    showNotifySuccess()
                    this.loadHaCaps()
                }else {
                    showNotifyError()
                }
            }else {
                showNotifyError('Số bó nhập vào không chính xác')
            }
           // this.loadHaCaps()
        },
        async loadChinhPham(){
            const guid = this.$route.params.id
           
            const data = await this.$store.dispatch('nlg/GET_CHINH_PHAM_EDIT',guid)
            if (data.data.length>0) {
                this.chinhpham = data.data[0]
              this.slmau = this.chinhpham.SLMAU ? this.chinhpham.SLMAU : 0
              
            }else {
                showNotifyError('Không tìm thấy chính phẩm #99999')
            }
        },
        async loaddelai(){
           
                const data = await this.$store.dispatch('nlg/GET_DS_DELAI_1P',{sophieu:this.chinhpham.sophieunhap,code:this.chinhpham.CODE})
                this.delai1p = data.data[0]
                if (data.data.length<0)
                this.delai1 = 0
                else
                this.delai1 =  this.delai1p.SOBO
        },
        async loadHaCaps(){
            // this.loadDone = false
            this.dataSource = []
            const detailId = this.$route.params.id
            this.sothanhhacap = 0
            const data = await this.$store.dispatch('nlg/GET_HA_CAP',detailId)
            this.dataSource = data.data
           if(!data.data.length)
           this.sothanhhacap = 0
           for (let i = 0; i < data.data.length; i++){
                this.sothanhhacap = this.sothanhhacap + parseInt(data.data[i].sothanh)
           }
            // data.data.forEach(element => {
            //     element.gapDoi ==='Y' ? element.gapDoi=true: element.gapDoi=false
               
            //     this.dataSource.push(element)
              
            // });
            this.loadChinhPham()
             this.qty = parseInt(this.slmau*this.chinhpham.SOTHANH_BO  - this.sothanhhacap)
              
             const payload = {
                    id:this.chinhpham.id,
                    //SAMPLEQTY:this.slmau,
                    QTY:this.qty
                }
                const data1 = await this.$store.dispatch('nlg/EDIT_NHAP_KHO',payload)
            //this.loadDone = true
            this.loadChinhPham()
        },
        async loadTypeHc(){
            const data = await this.$store.dispatch('nlg/GET_TYPE_HA_CAP')
            this.typeHc = data.data
        },
        async loadQuiCach(){
              const payload = {
                    day:this.chinhpham.DAY,
                    rong:this.chinhpham.RONG,
                    dai:this.chinhpham.CAO
               
                }
            const data = await this.$store.dispatch('nlg/GET_QUI_CACH',payload)
           this.quicac = data.data
            // data.data.forEach((element) => {
            //    if (element.useFLAG.trim() =='Y'&&parseInt(element.day)<=parseInt(this.chinhpham.DAY)&&parseInt(element.rong)<=parseInt(this.chinhpham.RONG)&&parseInt(element.dai)<=parseInt(this.chinhpham.CAO)) {
            //       this.quicac.push(element);
            //   }  
            
            //  })
            // if (this.quicac.length ==0){
            //     this.quicac = data.data
            // }
            // else {
            //     this.quicachs = data.data
            // }
        },
        async add(e){
            if(e.data.TYPE.typeName.trim()=='Hàng Loại C' || e.data.TYPE.typeName.trim()=='Hàng Loại'){
            console.log( this.chinhpham.CODE)
            this.manvl = this.chinhpham.MANVL
        } else {
              
               
              if (e.data.quicach.dacbiet == 'D'){
             this.manvl = e.data.quicach.code + 'l2';
           } 
            else {
           if (e.data.quicach.dacbiet == 'H' && e.data.TYPE.typeName.trim() == 'Chính Phẩm B'){ 
             
                   this.manvl = e.data.quicach.code + 'l2'
           }
               else{
     
              if (e.data.quicach.dacbiet == 'H'){
           this.manvl = e.data.quicach.code + 'l1';
               }
               else
         {
             
              this.manvl = e.data.quicach.code;
           }
         } } }
        // console.log('this.chinhpham',this.chinhpham)
        // console.log('this.chinhpham',e.data.TYPE)
                 
        const tIndex = this.dataSource.findIndex(d=>{return d.TYPE===e.data.TYPE.typeName})
        console.log('tIndex',tIndex);
            if (tIndex === -1){
              
                console.log('this.manvl',this.manvl)
                let quiCach;
                let DAY;
                let RONG;
                let CAO;
                if(e.data.TYPE.typeName.trim()=='Hàng Loại C'|| e.data.TYPE.typeName.trim()=='Hàng Loại'){
                    quiCach = this.chinhpham.CODE
                    DAY = this.chinhpham.DAY
                    RONG = this.chinhpham.RONG
                    CAO = this.chinhpham.CAO
                  
                }else {
                    quiCach = e.data.quicach.code
                    DAY = e.data.quicach.day
                    RONG = e.data.quicach.rong
                    CAO = e.data.quicach.dai
                  
                }
                const payload = {
                    id_dt:this.chinhpham.id,
                 gapDoi:e.data.gapDoi,
                   sothanh: e.data.sothanh,
                  note:e.data.NOTE ,
                   delFlag:'N',
              type:e.data.TYPE.id,
              manvl:this.manvl,
                  quicach:  quiCach,
                  DAY:DAY,
                  RONG:RONG,
                  CAO:CAO,
                   createBy: this.userInfo.account
                }
                
                const data = await this.$store.dispatch('nlg/ADD_HA_CAP',payload)
               
              
                if (data.meta.success) {
                    showNotifySuccess()
                }else{
                    showNotifyError()
                }}else{
                showNotifyError('Vui lòng chọn loại hạ cấp khác !')
                
            }
            this.loadHaCaps()
           
            
        },
        async update(e){
            const payload = {
                id:e.data.id,
                
                   // id:this.chinhpham.id,
                    gapDoi:e.data.gapDoi,
                    sothanh: e.data.sothanh,
                    note:e.data.NOTE ,
                    delFlag:'N',
                    type:e.data.TYPE.id,
              manvl:e.data.quicach.code,
                  quicach:e.data.quicach.code,
                  DAY:e.data.quicach.day,
                  RONG:e.data.quicach.rong,
                  CAO:e.data.quicach.dai
                   // quiCachId:e.data.quiCachId
                
            }
            const data = await this.$store.dispatch('nlg/UPDATE_HA_CAP',payload)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
            this.loadHaCaps()
        },
         async del(e){
            const payload = {
                id:e.data.id,
               
                   
                    delFlag:'Y'
            
               
            }
            const data = await this.$store.dispatch('nlg/UPDATE_HA_CAP',payload)
            if (data.meta.success) {
                showNotifySuccess()
            }else{
                showNotifyError()
            }
            this.loadHaCaps()
        },
         onEditorPreparing(e) {
            if (e.dataField === 'id') {
                e.editorOptions.disabled = true
            }
        },
    }
}
</script>

<style>

</style>