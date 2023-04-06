<template>
  <q-card-section>
    <div class="q-gutter-sm text-primary text-h8">
        Loại mẫu xin nghỉ :
        </br> 
    </div>
    <div class="q-gutter-sm q-mt-sm" >
      <div v-if="order.OrderMeta[0].selection == null">
        <q-radio  dense v-model="order.OrderMeta[0].selection" val="Nghỉ phép" label="Nghỉ phép" color="teal"/>
        <q-radio  dense v-model="order.OrderMeta[0].selection" val="Nghỉ ốm" label="Nghỉ ốm" color="red"/>
        <q-radio  dense v-model="order.OrderMeta[0].selection" val="Nghỉ việc riêng có hưởng lương" label="Nghỉ việc riêng có hưởng lương" color="blue" />
        <q-radio  dense v-model="order.OrderMeta[0].selection" val="Xin nghỉ việc(kết thúc hợp đồng lao động)" label="Xin nghỉ việc(kết thúc hợp đồng lao động)" color="yellow"/>
        <q-radio  dense v-model="order.OrderMeta[0].selection" val="Xin nghỉ không lương" label="Xin nghỉ không lương" color="black"/>
        <q-radio  dense v-model="order.OrderMeta[0].selection" val="Xin nghỉ Thai sản" label="Xin nghỉ Thai sản" color="pink"/>
        </div>
        <div v-else>
          <span v-if="order.OrderMeta[0].selection == 'Nghỉ phép'">
              <q-radio  dense v-model="order.OrderMeta[0].selection" val="Nghỉ phép"  color="red"/>
          </span>
          <span v-else-if="order.OrderMeta[0].selection == 'Nghỉ ốm'">
              <q-radio  dense v-model="order.OrderMeta[0].selection" val="Nghỉ ốm"  color="red"/>
          </span>
          <span v-else-if="order.OrderMeta[0].selection == 'Nghỉ việc riêng có hưởng lương'">
              <q-radio  dense v-model="order.OrderMeta[0].selection" val="Nghỉ việc riêng có hưởng lương"  color="red"/>
          </span>
          <span v-else-if="order.OrderMeta[0].selection == 'Xin nghỉ việc(kết thúc hợp đồng lao động)'">
              <q-radio  dense v-model="order.OrderMeta[0].selection" val="Xin nghỉ việc(kết thúc hợp đồng lao động)"  color="red"/>
          </span>
          <span v-else-if="order.OrderMeta[0].selection == 'Xin nghỉ không lương'">
              <q-radio  dense v-model="order.OrderMeta[0].selection" val="Xin nghỉ không lương"  color="red"/>
          </span>
          <span v-else-if="order.OrderMeta[0].selection == 'Xin nghỉ Thai sản'">
              <q-radio  dense v-model="order.OrderMeta[0].selection" val="Xin nghỉ Thai sản"  color="red"/>
          </span>
          <span class="q-ml-sm" style="font-size:20px">{{order.OrderMeta[0].selection}}</span>
        </div>
    </div>
    <div v-if="order.OrderMeta[0].selection == 'Xin nghỉ việc(kết thúc hợp đồng lao động)'">
        <div v-if="order.status == 'Không được duyệt'">
        <div class="row">
            <q-input
            class="q-mt-sm q-mr-sm col"
            outlined
            v-model="order.OrderMeta[0].fullName"
            label="Tên tôi là : "
            :readonly="disable"
            />
            <q-input
            class="q-mt-sm col"
            outlined
            v-model="order.OrderMeta[0].maNV"
            label="Mã nhân viên : "
            :readonly="disable"
            />
          </div>
          <div class="row">
            <q-input
            class="q-mt-sm q-mr-sm col"
            outlined
            v-model="order.OrderMeta[0].position"
            label="Chức vụ : "
            :readonly="disable"
            />
            <q-input
              class="q-mt-sm col"
              outlined
              v-model="order.OrderMeta[0].department"
              label="Phòng ban/bộ phận : "
              :readonly="disable"/>
          </div>
        <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">Từ ngày : </div>
                <div class="">
                       <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
            </div>
      </div>
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do : "
        :readonly="!disable"
        />
         <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta"  color="primary" text-color="white" label="Sửa" />
        </div>
        <div v-else>
        <div class="row">
            <q-input
            class="q-mt-sm q-mr-sm col"
            outlined
            v-model="order.OrderMeta[0].fullName"
            label="Tên tôi là : "
            :readonly="disable"
            />
            <q-input
            class="q-mt-sm col"
            outlined
            v-model="order.OrderMeta[0].maNV"
            label="Mã nhân viên : "
            :readonly="disable"
            />
          </div>
          <div class="row">
            <q-input
            class="q-mt-sm q-mr-sm col"
            outlined
            v-model="order.OrderMeta[0].position"
            label="Chức vụ : "
            :readonly="disable"
            />
            <q-input
              class="q-mt-sm col"
              outlined
              v-model="order.OrderMeta[0].department"
              label="Phòng ban/bộ phận : "
              :readonly="disable"/>
          </div>
        <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">Từ ngày : </div>
                <div class="">
                       <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
            </div>
      </div>
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do : "
        :readonly="disable"
        />
        </div>
        
    </div>
    <div v-if="order.OrderMeta[0].selection == 'Nghỉ phép' || order.OrderMeta[0].selection == 'Nghỉ ốm' || order.OrderMeta[0].selection == 'Nghỉ việc riêng có hưởng lương' &&   order.OrderMeta[0].selection != null">
        <div v-if="order.status == 'Không được duyệt'">
          <div class="flex">
          <q-input
          style="width:33.33% !important"
          class="q-mt-sm q-pr-sm"
          outlined
          v-model="order.OrderMeta[0].fullName"
          label="Tên tôi là : "
          :readonly="!disable"
        />
        <q-input
         style="width:33.33% !important"
        class="q-mt-sm q-pr-sm" 
        outlined
        v-model="order.OrderMeta[0].position"
        label="Chức vụ : "
        :readonly="!disable"
        />
        <q-input
         style="width:33.33% !important"
          class="q-mt-sm "
          outlined
          v-model="order.OrderMeta[0].department"
          label="Phòng ban/bộ phận : "
          :readonly="!disable"/>
        </div>
        <div class="row q-mt-sm" >
        <div class="col">
          <div class="">Thời gian từ :</div>
          <div class="">
                       <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
      </div>
        <div class="col q-pl-sm">
        <div class="text-h8">Thời gian đến :</div>
        <div class="">
                    <q-input class="q-mb-sm" filled v-model="order.OrderMeta[0].dateEnd">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateEnd" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                  </div>
      </div>

        </div>
        
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do : "
        :readonly="!disable"
        />
        <!-- <div class="flex">
        <q-select
        filled
        class="q-mt-sm q-pr-sm"
        v-model="metaValue.accountName"
        @input="changed"
        use-input
        :readonly="!disable"
        input-debounce="0"
        label="Người làm thay"
        :options="options"
        @filter="filterFn"
        style="width: 33.33% !important"
        behavior="dialog"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>    
        <q-input
        style="width: 33.33% !important"
        class="q-mt-sm q-pr-sm"
        outlined
        v-model="order.OrderMeta[0].position2"
        label="Chức vụ (người làm thay) : "
        :readonly="!disable"
        />
        <q-input
        style="width: 33.33% !important"
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].department2"
        label="Bộ phận (người làm thay): "
        :readonly="!disable"
        />
        </div> -->
         <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta"  color="primary" text-color="white" label="Sửa" />

        </div>
        <div v-else>
          <div class="flex">
          <q-input
          style="width:33.33% !important"
          class="q-mt-sm q-pr-sm"
          outlined
          v-model="order.OrderMeta[0].fullName"
          label="Tên tôi là : "
          :readonly="disable"
        />
        <q-input
         style="width:33.33% !important"
        class="q-mt-sm q-pr-sm" 
        outlined
        v-model="order.OrderMeta[0].position"
        label="Chức vụ : "
        :readonly="disable"
        />
        <q-input
         style="width:33.33% !important"
          class="q-mt-sm "
          outlined
          v-model="order.OrderMeta[0].department"
          label="Phòng ban/bộ phận : "
          :readonly="disable"/>
        </div>
        <div class="row q-mt-sm" >
        <div class="col">
          <div class="text-h8">Thời gian từ :</div>
          <div class="">
                       <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
      </div>
        <div class="col q-pl-sm">
        <div class="text-h8">Thời gian đến :</div>
        <div class="">
                    <q-input class="q-mb-sm" filled v-model="order.OrderMeta[0].dateEnd">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateEnd" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                  </div>
      </div>

        </div>
        
        <q-input
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].description"
        label="Lý do : "
        :readonly="disable"
        />
        <!-- <div class="flex">
          <q-select
        filled
        class="q-mt-sm q-pr-sm"
        v-model="metaValue.accountName"
        @input="changed"
        use-input
        :readonly="disable"
        input-debounce="0"
        label="Người làm thay"
        :options="options"
        @filter="filterFn"
        style="width: 33.33% !important"
        behavior="dialog"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>    
        <q-input
        style="width: 33.33% !important"
        class="q-mt-sm q-pr-sm"
        outlined
        v-model="order.OrderMeta[0].position2"
        label="Chức vụ (người làm thay) : "
        :readonly="disable"
        />
        <q-input
        style="width: 33.33% !important"
        class="q-mt-sm"
        outlined
        v-model="order.OrderMeta[0].department2"
        label="Bộ phận (người làm thay): "
        :readonly="disable"
        />
        </div> -->
        </div>
        
        
        
    </div>
    <div v-if="order.OrderMeta[0].selection == 'Xin nghỉ Thai sản' && order.OrderMeta[0].selection != null">
        <div v-if="order.status == 'Không được duyệt'">
        <div class="row">
            <q-input
            class="q-mt-sm q-mr-sm col"
            outlined
            v-model="order.OrderMeta[0].fullName"
            label="Tên tôi là : "
            :readonly="disable"
            />
            <q-input
            class="q-mt-sm col"
            outlined
            v-model="order.OrderMeta[0].maNV"
            label="Mã nhân viên : "
            :readonly="disable"
            />
          </div>
          <div class="row">
            <q-input
            class="q-mt-sm q-mr-sm col"
            outlined
            v-model="order.OrderMeta[0].position"
            label="Chức vụ : "
            :readonly="disable"
            />
            <q-input
              class="q-mt-sm col"
              outlined
              v-model="order.OrderMeta[0].department"
              label="Phòng ban/bộ phận : "
              :readonly="disable"/>
          </div>
    <div
      class="q-mt-sm"
      outlined
    > Hôm nay, tôi viết đơn này xin trình bầy một việc như sau: 
    </div>
    <q-input
      class="q-mt-sm"
      outlined
      v-model="metaValue.thoiGianMangThai"
      label="Hiện tôi đang mang thai ở tháng thứ :"
      :readonly="!disable"
    />
    <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">Vậy tôi viết đơn này kính đề nghị Ban Lãnh đạo Công ty cho phép tôi được nghỉ sinh kể từ ngày  :</div>
                <div class="">
                       <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
            </div>
      </div>
     <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta"  color="primary" text-color="white" label="Sửa" />
    
        </div>
        <div v-else>
        <div class="row">
            <q-input
            class="q-mt-sm q-mr-sm col"
            outlined
            v-model="order.OrderMeta[0].fullName"
            label="Tên tôi là : "
            :readonly="disable"
            />
            <q-input
            class="q-mt-sm col"
            outlined
            v-model="order.OrderMeta[0].maNV"
            label="Mã nhân viên : "
            :readonly="disable"
            />
          </div>
          <div class="row">
            <q-input
            class="q-mt-sm q-mr-sm col"
            outlined
            v-model="order.OrderMeta[0].position"
            label="Chức vụ : "
            :readonly="disable"
            />
            <q-input
              class="q-mt-sm col"
              outlined
              v-model="order.OrderMeta[0].department"
              label="Phòng ban/bộ phận : "
              :readonly="disable"/>
          </div>
    <q-input
      class="q-mt-sm"
      outlined
      v-model="metaValue.thoiGianMangThai"
      label="Hiện tôi đang mang thai ở tháng thứ :"
      :readonly="disable"
    />
    <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">Vậy tôi viết đơn này kính đề nghị Ban Lãnh đạo Công ty cho phép tôi được nghỉ sinh kể từ ngày  :</div>
                <div class="">
                       <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
            </div>
      </div>
        </div>
        
    </div>
    <div v-if="order.OrderMeta[0].selection == 'Xin nghỉ không lương' && order.OrderMeta[0].selection != null">
        <div v-if="order.status =='Không được duyệt'">
        <div class="row">
            <q-input
            class="q-mt-sm q-mr-sm col"
            outlined
            v-model="order.OrderMeta[0].fullName"
            label="Tên tôi là : "
            :readonly="disable"
            />
            <q-input
            class="q-mt-sm col"
            outlined
            v-model="order.OrderMeta[0].maNV"
            label="Mã nhân viên : "
            :readonly="disable"
            />
          </div>
          <div class="row">
            <q-input
            class="q-mt-sm q-mr-sm col"
            outlined
            v-model="order.OrderMeta[0].position"
            label="Chức vụ : "
            :readonly="disable"
            />
            <q-input
              class="q-mt-sm col"
              outlined
              v-model="order.OrderMeta[0].department"
              label="Phòng ban/bộ phận : "
              :readonly="disable"/>
          </div>
          <div class="row q-mt-sm" >
            <div class="col">
                <div class="text-h8">Hôm nay, tôi viết đơn này xin nghỉ không lương từ ngày :</div>
                <div class="">
                       <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
            </div>
            <div class="col q-pl-sm">
              <div class="text-h8">Thời gian đến :</div>
              <div class="">
                    <q-input class="q-mb-sm" filled v-model="order.OrderMeta[0].dateEnd">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateEnd" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                  </div>
            </div>
          </div>
    
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].description"
      label="Lý do : "
      :readonly="!disable"
    />
     <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta"  color="primary" text-color="white" label="Sửa" />

        </div>
        <div v-else>
          <div class="row">
            <q-input
            class="q-mt-sm q-mr-sm col"
            outlined
            v-model="order.OrderMeta[0].fullName"
            label="Tên tôi là : "
            :readonly="disable"
            />
            <q-input
            class="q-mt-sm col"
            outlined
            v-model="order.OrderMeta[0].maNV"
            label="Mã nhân viên : "
            :readonly="disable"
            />
          </div>
          <div class="row">
            <q-input
            class="q-mt-sm q-mr-sm col"
            outlined
            v-model="order.OrderMeta[0].position"
            label="Chức vụ : "
            :readonly="disable"
            />
            <q-input
              class="q-mt-sm col"
              outlined
              v-model="order.OrderMeta[0].department"
              label="Phòng ban/bộ phận : "
              :readonly="disable"/>
          </div>
            <div class="col">
                <div class="text-h8">Hôm nay, tôi viết đơn này xin nghỉ không lương từ ngày :</div>
                <div class="">
                       <q-input :readonly="disable" class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
            </div>
            <div class="col">
              <div class="text-h8">Thời gian đến :</div>
              <div class="">
                    <q-input class="q-mb-sm" filled v-model="order.OrderMeta[0].dateEnd">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time :readonly="disable" v-model="order.OrderMeta[0].dateEnd" mask="DD-MM-YYYY HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                  </div>
            </div>
    <q-input
      class="q-mt-sm"
      outlined
      v-model="order.OrderMeta[0].description"
      label="Lý do : "
      :readonly="disable"
    />
        </div>
       
    </div>
  </q-card-section>
</template>

<script>
import { mapGetters ,mapActions} from "vuex";
import DxButton from 'devextreme-vue/button';
import DxDateBox from 'devextreme-vue/date-box';
import { DxDataGrid, DxColumn, DxEditing, DxPaging, DxLookup } from 'devextreme-vue/data-grid';
export default {
    components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxButton,
    DxDateBox,
    DxLookup
  },
  props: ["metaValue", "disable","order"],
  data(){
      return{
        myDepartment:null,
        stepDepartment:null,
        departments: [],
            events:[],
            options:null,
            nameDepartmentName:null,
            account:[],
            active:false
      }
  },
  async created(){
  
    let data = await this.GET_DEPARTMENTSALL();
    console.log('dataa',data)
    let account2 = await this.GET_ACCOUNTS();
    console.log('account2',account2)
    await account2.data.forEach(element => {
      this.account.push({
        value: element.id,
        label: element.lastName,
        position: element.position,
        departmentId : element.departmentId
      });
    });
         console.log('account',this.account)
    // this.loadDepartment()
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(this.userInfo.department);
    await data.forEach(element => {
      this.departments.push({
        value: element.ID,
        label: element.NAME
      });
    });
    console.log('options',this.departments)
    
  },
  methods:{
   async changed(){
     
         console.log('changed')
      console.log('this.order.OrderMeta[0].position2 ',this.order.OrderMeta[0].position2 )
      console.log('this.metaValue.account2.id',this.metaValue.accountName)
        this.order.OrderMeta[0].position2 = this.metaValue.accountName.position
        let department222 = await this.GET_DEPARTMENTSBYID(this.metaValue.accountName.departmentId);
        console.log('department2',department222)
        this.order.OrderMeta[0].department2 = department222.NAME
        },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.account
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = this.account.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
        ...mapActions("base",["GET_DEPARTMENTSBYID","GET_DEPARTMENTSALL","GET_ACCOUNTS"]),
        ...mapActions("orders", ["getOneOrder", "getAllRequests"]),
    ...mapActions("orderMetas", ["getOneOrderMeta", "addorderMeta","deleteOrderMeta","updateOrderMeta"]),

    chonCongDoan(){
     console.log('myDepartment',this.myDepartment.value)
    },
    
    
  },
  computed: {
    
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["myFactoryInfor","userInfo","dsCongDoans"])
  },
  
};
</script>
