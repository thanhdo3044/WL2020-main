<template>
<q-card-section>
    <div class="q-gutter-sm text-primary text-h8">
        Chọn loại mẫu xin nghỉ :
        </br>
    </div>
    <div class="q-gutter-sm q-mt-sm">
        <div v-if="order.OrderMeta[0].selection == null">
            <q-radio dense v-model="metaValue.selection" val="Nghỉ phép" label="Nghỉ phép" color="teal" />
            <q-radio dense v-model="metaValue.selection" val="Nghỉ ốm" label="Nghỉ ốm" color="red" />
            <q-radio dense v-model="metaValue.selection" val="Nghỉ việc riêng có hưởng lương" label="Nghỉ việc riêng có hưởng lương" color="blue" />
            <!-- <q-radio dense v-model="metaValue.selection" val="Xin nghỉ việc(kết thúc hợp đồng lao động)" label="Xin nghỉ việc(kết thúc hợp đồng lao động)" color="yellow" /> -->
            <q-radio dense v-model="metaValue.selection" val="Xin nghỉ không lương" label="Xin nghỉ không lương" color="black" />
            <q-radio dense v-model="metaValue.selection" val="Xin nghỉ Thai sản" label="Xin nghỉ Thai sản" color="pink" />
        </div>
        <div v-else>
            <span v-if="order.OrderMeta[0].selection == 'Nghỉ phép'">
                <q-radio dense v-model="metaValue.selection" val="Nghỉ phép" color="red" />
            </span>
            <span v-else-if="order.OrderMeta[0].selection == 'Nghỉ ốm'">
                <q-radio dense v-model="metaValue.selection" val="Nghỉ ốm" color="red" />
            </span>
            <span v-else-if="order.OrderMeta[0].selection == 'Nghỉ việc riêng có hưởng lương'">
                <q-radio dense v-model="metaValue.selection" val="Nghỉ việc riêng có hưởng lương" color="red" />
            </span>
            <span v-else-if="order.OrderMeta[0].selection == 'Xin nghỉ việc(kết thúc hợp đồng lao động)'">
                <q-radio dense v-model="metaValue.selection" val="Xin nghỉ việc(kết thúc hợp đồng lao động)" color="red" />
            </span>
            <span v-else-if="order.OrderMeta[0].selection == 'Xin nghỉ không lương'">
                <q-radio dense v-model="metaValue.selection" val="Xin nghỉ không lương" color="red" />
            </span>
            <span v-else-if="order.OrderMeta[0].selection == 'Xin nghỉ Thai sản'">
                <q-radio dense v-model="metaValue.selection" val="Xin nghỉ Thai sản" color="red" />
            </span>
            <span class="q-ml-sm" style="font-size:20px">{{metaValue.selection}}</span>
        </div>
    </div>
    <div v-if="metaValue.selection == 'Xin nghỉ việc(kết thúc hợp đồng lao động)'">
        <div v-if="order.status == 'Không được duyệt'">
            <div class="row">
                <q-input class="q-mt-sm q-mr-sm col" outlined v-model="userInfo.lastName" label="Tên tôi là : " readonly  />
                <q-input class="q-mt-sm col" outlined v-model="userInfo.account" label="Mã nhân viên : " readonly  />
            </div>
            <div class="row">
                <q-input class="q-mt-sm q-mr-sm col" outlined v-model="userInfo.position" label="Chức vụ : " readonly  />
                <q-input class="q-mt-sm col" outlined v-model="nameDepartmentName.NAME" label="Phòng ban/bộ phận : " readonly  />
            </div>
            <div class="row q-mt-sm">
                <div class="col">
                    <div class="text-h8">Từ ngày : </div>
                    <div class="">
                        <q-input :readonly="disable" fill-mask mask="##-##-####"
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021)'
              " class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                        <q-date :options="optionsFn" :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                            <!-- <template v-slot:append>
                                <q-icon name="access_time" class="cursor-pointer">
                                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                                        <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                        </q-time>
                                    </q-popup-proxy>
                                </q-icon>
                            </template> -->
                        </q-input>
                    </div>
                </div>
            </div>
            <q-input class="q-mt-sm" outlined v-model="order.OrderMeta[0].description" label="Lý do : " :readonly="!disable" />
            <q-select
          class="q-mt-sm"
          filled
          use-input
          input-debounce="0"
          v-model="user"
          :options="users"
          @input="selectUser"
          label="Chọn người ủy quyền"
          @filter="filterUser"
        />
        <div class="q-mt-sm">
        <q-chip
          removable
          v-for="(value, index) in listUserSelected"
          :key="index"
          @remove="removeUser(value)"
          color="orange-11"
          text-color="black"
        >
          {{ value.name }}
        </q-chip>
      </div>
            <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />
        </div>
        <div v-else>
            <div class="row">
                <q-input class="q-mt-sm q-mr-sm col" outlined v-model="userInfo.lastName" label="Tên tôi là : " readonly  />
                <q-input class="q-mt-sm col" outlined v-model="userInfo.account" label="Mã nhân viên : " readonly  />
            </div>
            <div class="row">
                <q-input class="q-mt-sm q-mr-sm col" outlined v-model="userInfo.position" label="Chức vụ : " readonly  />
                <q-input class="q-mt-sm col" outlined v-model="nameDepartmentName.NAME" label="Phòng ban/bộ phận : " readonly  />
            </div>
            <div class="row q-mt-sm">
                <div class="col">
                    <div class="text-h8">Từ ngày : </div>
                    <div class="">
                        <q-input :readonly="disable" fill-mask mask="##-##-####"
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021)'
              " class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                        <q-date :options="optionsFn" :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                            <!-- <template v-slot:append>
                                <q-icon name="access_time" class="cursor-pointer">
                                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                                        <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                        </q-time>
                                    </q-popup-proxy>
                                </q-icon>
                            </template> -->
                        </q-input>
                    </div>
                </div>
            </div>
            <q-input class="q-mt-sm" outlined v-model="order.OrderMeta[0].description" label="Lý do : " :readonly="disable" />
            <q-select
          class="q-mt-sm"
          filled
          use-input
          input-debounce="0"
          v-model="user"
          :options="users"
          @input="selectUser"
          label="Chọn người ủy quyền"
          @filter="filterUser"
        />
        <div class="q-mt-sm">
        <q-chip
          removable
          v-for="(value, index) in listUserSelected"
          :key="index"
          @remove="removeUser(value)"
          color="orange-11"
          text-color="black"
        >
          {{ value.name }}
        </q-chip>
      </div>
        </div>

    </div>
    <div v-if="metaValue.selection == 'Nghỉ phép' || metaValue.selection == 'Nghỉ ốm' || metaValue.selection == 'Nghỉ việc riêng có hưởng lương' &&   metaValue.selection != null">
        <div v-if="order.status == 'Không được duyệt'">
            <div class="flex">
                <q-input style="width:33.33% !important" class="q-mt-sm q-pr-sm" outlined v-model="userInfo.lastName" label="Tên tôi là : " readonly  />
                <q-input style="width:33.33% !important" class="q-mt-sm q-pr-sm" outlined v-model="userInfo.position" label="Chức vụ : " readonly  />
                <q-input style="width:33.33% !important" class="q-mt-sm " outlined v-model="nameDepartmentName.NAME" label="Phòng ban/bộ phận : " readonly  />
            </div>
            <div class="row q-mt-sm">
                <div class="col-12 col-sm-6">
                    <div class="">Thời gian từ :</div>
                    <div class="">
                        <q-input :readonly="disable" fill-mask mask="##-##-#### ##:##" :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 07:30)'
              " class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                        <q-date :options="optionsFn" :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
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
                <div class="col-12 col-sm-6 q-pl-sm">
                    <div class="text-h8">Thời gian đến :</div>
                    <div class="">
                        <q-input class="q-mb-sm" fill-mask filled mask="##-##-#### ##:##" :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 16:30)'
              " v-model="order.OrderMeta[0].dateEnd">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                        <q-date :options="optionsFn" :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
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
                <q-input class="q-mt-sm" outlined v-model="order.OrderMeta[0].description" label="Lý do : " :readonly="!disable" />
                <q-select
          class="q-mt-sm"
          filled
          use-input
          input-debounce="0"
          v-model="user"
          :options="users"
          @input="selectUser"
          label="Chọn người ủy quyền"
          @filter="filterUser"
        />
        <div class="q-mt-sm">
        <q-chip
          removable
          v-for="(value, index) in listUserSelected"
          :key="index"
          @remove="removeUser(value)"
          color="orange-11"
          text-color="black"
        >
          {{ value.name }}
        </q-chip>
      </div>
            <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />

        </div>
        <div v-else>
            <div class="flex">
                <q-input style="width:33.33% !important" class="q-mt-sm q-pr-sm" outlined v-model="userInfo.lastName" label="Tên tôi là : " readonly  />
                <q-input style="width:33.33% !important" class="q-mt-sm q-pr-sm" outlined v-model="userInfo.position" label="Chức vụ : " readonly  />
                <q-input style="width:33.33% !important" class="q-mt-sm " outlined v-model="nameDepartmentName.NAME" label="Phòng ban/bộ phận : " readonly  />
            </div>
            <div class="row q-mt-sm">
                
                <div class="col-12 col-sm-6">
                    <div class="text-h8">Thời gian từ :</div>
                    <div class="">
                        <q-input :readonly="disable" fill-mask mask="##-##-#### ##:##"
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 07:30)'
              " class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                        <q-date :options="optionsFn" :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
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
                <div class="col-12 col-sm-6 q-pl-sm">
                    <div class="text-h8">Thời gian đến :</div>
                    <div class="">
                        <q-input class="q-mb-sm" fill-mask="" mask="##-##-#### ##:##"
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 16:30)'
              " filled v-model="order.OrderMeta[0].dateEnd">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                        <q-date :options="optionsFn"  :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
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
            
                        <q-radio class="q-mt-sm" v-model="shape" @input="checked" val="caNhan" label="Lý do cá nhân"  v-if="!disable"/>                         
                        <q-radio class="q-mt-sm q-ml-xl" v-model="shape" @input="checked" val="khac" label="Lý do khác" v-if="!disable"/>

                <q-input class="q-mt-sm" outlined v-model="order.OrderMeta[0].description" label="Lý do : " :readonly="disable" />
                <q-select
          class="q-mt-sm"
          filled
          use-input
          input-debounce="0"
          v-model="user"
          :options="users"
          @input="selectUser"
          label="Chọn người ủy quyền"
          @filter="filterUser"
        />
        <div class="q-mt-sm">
        <q-chip
          removable
          v-for="(value, index) in listUserSelected"
          :key="index"
          @remove="removeUser(value)"
          color="orange-11"
          text-color="black"
        >
          {{ value.name }}
        </q-chip>
      </div>
                    </div>
    </div>
    <div v-if="metaValue.selection == 'Xin nghỉ Thai sản' && metaValue.selection != null">
        <div v-if="order.status == 'Không được duyệt'">
            <div class="row">
                <q-input class="q-mt-sm q-mr-sm col" outlined v-model="userInfo.lastName" label="Tên tôi là : " readonly  />
                <q-input class="q-mt-sm col" outlined v-model="userInfo.account" label="Mã nhân viên : " readonly  />
            </div>
            <div class="row">
                <q-input class="q-mt-sm q-mr-sm col" outlined v-model="userInfo.position" label="Chức vụ : " readonly  />
                <q-input class="q-mt-sm col" outlined v-model="nameDepartmentName.NAME" label="Phòng ban/bộ phận : " readonly  />
            </div>
            <div class="q-mt-sm" outlined> Hôm nay, tôi viết đơn này xin trình bầy một việc như sau:
            </div>
            <q-input class="q-mt-sm" outlined v-model="metaValue.thoiGianMangThai" label="Hiện tôi đang mang thai ở tháng thứ :" :readonly="!disable" />
            <div class="row q-mt-sm">
                <div class="col">
                    <div class="text-h8">Vậy tôi viết đơn này kính đề nghị Ban Lãnh đạo Công ty cho phép tôi được nghỉ sinh kể từ ngày :</div>
                    <div class="">
                        <q-input :readonly="disable" class="q-mb-sm" fill-mask mask="##-##-####"
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021)'
              " filled v-model="order.OrderMeta[0].dateStart">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                        <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                            <!-- <template v-slot:append>
                                <q-icon name="access_time" class="cursor-pointer">
                                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                                        <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                        </q-time>
                                    </q-popup-proxy>
                                </q-icon>
                            </template> -->
                        </q-input>
                    </div>
                </div>
            </div>
            <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />
        </div>
        <div v-else>
            <div class="row">
                <q-input class="q-mt-sm q-mr-sm col" outlined v-model="userInfo.lastName" label="Tên tôi là : " readonly  />
                <q-input class="q-mt-sm col" outlined v-model="userInfo.account" label="Mã nhân viên : " readonly  />
            </div>
            <div class="row">
                <q-input class="q-mt-sm q-mr-sm col" outlined v-model="userInfo.position" label="Chức vụ : " readonly  />
                <q-input class="q-mt-sm col" outlined v-model="nameDepartmentName.NAME" label="Phòng ban/bộ phận : " readonly  />
            </div>
            <q-input class="q-mt-sm" outlined v-model="metaValue.thoiGianMangThai" label="Hiện tôi đang mang thai ở tháng thứ :" :readonly="disable" />
            <div class="row q-mt-sm">
                <div class="col">
                    <div class="text-h8">Vậy tôi viết đơn này kính đề nghị Ban Lãnh đạo Công ty cho phép tôi được nghỉ sinh kể từ ngày :</div>
                    <div class="">
                        <q-input :readonly="disable" class="q-mb-sm" fill-mask mask="##-##-####"
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021)'
              " filled v-model="order.OrderMeta[0].dateStart">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                        <q-date :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                            <!-- <template v-slot:append>
                                <q-icon name="access_time" class="cursor-pointer">
                                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                                        <q-time :readonly="disable" v-model="order.OrderMeta[0].dateStart" mask="DD-MM-YYYY HH:mm" format24h>
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                            </div>
                                        </q-time>
                                    </q-popup-proxy>
                                </q-icon>
                            </template> -->
                        </q-input>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="metaValue.selection == 'Xin nghỉ không lương' && metaValue.selection != null">
        <div v-if="order.status =='Không được duyệt'">
            <div class="row">
                <q-input class="q-mt-sm q-mr-sm col" outlined v-model="userInfo.lastName" label="Tên tôi là : " readonly  />
                <q-input class="q-mt-sm col" outlined v-model="userInfo.account" label="Mã nhân viên : " readonly  />
            </div>
            <div class="row">
                <q-input class="q-mt-sm q-mr-sm col" outlined v-model="userInfo.position" label="Chức vụ : " readonly  />
                <q-input class="q-mt-sm col" outlined v-model="nameDepartmentName.NAME" label="Phòng ban/bộ phận : " readonly  />
            </div>
            <div class="row q-mt-sm">
                <div class="col">
                    <div class="text-h8">Hôm nay, tôi viết đơn này xin nghỉ không lương từ ngày :</div>
                    <div class="">
                        <q-input :readonly="disable"  fill-mask mask="##-##-#### ##:##"
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 07:30)'
              " class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                        <q-date :options="optionsFn" :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
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
                        <q-input class="q-mb-sm" fill-mask mask="##-##-#### ##:##"
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 16:30)'
              " filled v-model="order.OrderMeta[0].dateEnd">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                        <q-date :options="optionsFn" :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
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
            <q-input class="q-mt-sm" outlined v-model="order.OrderMeta[0].description" label="Lý do : " :readonly="!disable" />
            <q-select
          class="q-mt-sm"
          filled
          use-input
          input-debounce="0"
          v-model="user"
          :options="users"
          @input="selectUser"
          label="Chọn người ủy quyền"
          @filter="filterUser"
        />
        <div class="q-mt-sm">
        <q-chip
          removable
          v-for="(value, index) in listUserSelected"
          :key="index"
          @remove="removeUser(value)"
         color="orange-11"
          text-color="black"
        >
          {{ value.name }}
        </q-chip>
      </div>
            <q-btn class="q-mt-sm" v-on:click="updatedOrderMeta" color="primary" text-color="white" label="Sửa" />
        </div>
        <div v-else>
            <div class="row">
                <q-input class="q-mt-sm q-mr-sm col" outlined v-model="userInfo.lastName" label="Tên tôi là : " readonly  />
                <q-input class="q-mt-sm col" outlined v-model="userInfo.account" label="Mã nhân viên : " readonly  />
            </div>
            <div class="row">
                <q-input class="q-mt-sm q-mr-sm col" outlined v-model="userInfo.position" label="Chức vụ : " readonly  />
                <q-input class="q-mt-sm col" outlined v-model="nameDepartmentName.NAME" label="Phòng ban/bộ phận : " readonly  />
            </div>
            <div class="col">
                <div class="text-h8">Hôm nay, tôi viết đơn này xin nghỉ không lương từ ngày :</div>
                <div class="">
                    <q-input :readonly="disable" fill-mask mask="##-##-#### ##:##"
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 07:30)'
              " class="q-mb-sm" filled v-model="order.OrderMeta[0].dateStart">
                        <template v-slot:prepend>
                            <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                    <q-date :options="optionsFn" :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateStart">
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
                    <q-input class="q-mb-sm " fill-mask mask="##-##-#### ##:##"
              :hint="
                'Kiểu ngày giờ: ngày-tháng-năm giờ:phút (12-01-2021 16:30)'
              " filled v-model="order.OrderMeta[0].dateEnd">
                        <template v-slot:prepend>
                            <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                    <q-date :options="optionsFn" :readonly="disable" mask="DD-MM-YYYY HH:mm" v-model="order.OrderMeta[0].dateEnd">
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
                                    <q-radio class="q-mt-sm" v-model="shape" @input="checked" val="caNhan" label="Lý do cá nhân"  v-if="!disable"/>                         
                        <q-radio class="q-mt-sm q-ml-xl" v-model="shape" @input="checked" val="khac" label="Lý do khác"  v-if="!disable"/>
            <q-input class="q-mt-sm" outlined v-model="order.OrderMeta[0].description" label="Lý do : " :readonly="disable" />
            <q-select
          class="q-mt-sm"
          filled
          use-input
          input-debounce="0"
          v-model="user"
          :options="users"
          @input="selectUser"
          label="Chọn người ủy quyền"
          @filter="filterUser"
        />
        <div class="q-mt-sm">
        <q-chip
          removable
          v-for="(value, index) in listUserSelected"
          :key="index"
          @remove="removeUser(value)"
          color="orange-11"
          text-color="black"
        >
          {{ value.name }}
        </q-chip>
      </div>
        </div>
    </div>
</q-card-section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import moment from "moment";
export default {
  props: ["metaValue", "disable", "order"],
  data() {
    return {
      myDepartment: null,
      stepDepartment: null,
      departments: [],
      events: [],
      options: null,
      shape: "caNhan",
      nameDepartmentName: null,
      account: [],
      active: false,
      days: {
        from: "",
        to: "",
      },
      user: null,
      users: [],
      arrUsers: [],
      listUserSelected: [],
    };
  },
  async created() {
    this.loadUser();
    let data = await this.GET_DEPARTMENTSALL();
    console.log("dataa", data);
    let account2 = await this.GET_ACCOUNTS();
    console.log("account2", account2);
    await account2.data.forEach((element) => {
      this.account.push({
        value: element.id,
        label: "Mã NV: " + element.account + " - " + element.lastName,
        position: element.position,
        departmentId: element.departmentId,
      });
    });
    console.log("account", this.account);
    // this.loadDepartment()
    this.nameDepartmentName = await this.GET_DEPARTMENTSBYID(
      this.userInfo.department
    );
    await data.forEach((element) => {
      this.departments.push({
        value: element.ID,
        label: element.NAME,
      });
    });
    console.log("options", this.departments);
    this.listUserSelected = JSON.parse(this.metaValue.uyQuyen);
  },
  methods: {
    optionsFn(date){
      console.log("moment().forma", moment().format("YYYY/MM/DD"));
      return date >= moment().format("YYYY/MM/DD");
    },
    async loadUser() {
      let accountALL = await this.getAllAccounts();
      accountALL.forEach((el) => {
        let customName = `${el.account} | ${el.lastName}`;
        this.users.push({
          label: customName,
          value: el.id,
          name: customName,
        });
      });
      console.log("user list ", this.users);
      this.arrUsers = this.users;
    },
    filterUser(val, update) {
      if (val === "") {
        update(() => {
          this.users = this.arrUsers;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.users = this.arrUsers.filter(function (str) {
          return str.name.toLowerCase().includes(needle);
        });
      });
    },
    async removeUser(value) {
      const index = this.listUserSelected.indexOf(value);
      if (index > -1) {
        this.listUserSelected.splice(index, 1);
      }
    },
    selectUser() {
      this.listUserSelected.push(this.user);
      this.metaValue.uyQuyen = JSON.stringify(this.listUserSelected);
      this.user = null;
    },
    async loadData(id) {
      let data = null;
      try {
        data = await this.getOneOrder(id);
      } catch (error) {
        console.log(error);
      }

      if (!data)
        this.$router.push({
          path: "/tao-de-xuat",
        });
      this.order = data.data.data;
      console.log(data);
    },
    async changed() {
      console.log("changed");
      console.log(
        "this.order.OrderMeta[0].position2 ",
        this.order.OrderMeta[0].position2
      );
      console.log("this.metaValue.account2.id", this.metaValue.accountName);
      this.order.OrderMeta[0].position2 = this.metaValue.accountName.position;
      let department222 = await this.GET_DEPARTMENTSBYID(
        this.metaValue.accountName.departmentId
      );
      console.log("department2", department222);
      this.order.OrderMeta[0].department2 = department222.NAME;
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.options = this.account;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = this.account.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    ...mapActions("base", [
      "GET_DEPARTMENTSBYID",
      "GET_DEPARTMENTSALL",
      "GET_ACCOUNTS",
    ]),
    ...mapActions("orders", [
      "getOneOrder",
      "getAllRequests",
      "getAllAccounts",
    ]),
    ...mapActions("orderMetas", [
      "getOneOrderMeta",
      "addorderMeta",
      "deleteOrderMeta",
      "updateOrderMeta",
    ]),
    ...mapActions("requests", ["deleteRequest", "resetOrder"]),
    chonCongDoan() {
      console.log("myDepartment", this.myDepartment.value);
    },
    async loadDepartment() {
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS", {
        factoryId: this.myFactoryInfor.id,
      });
      console.log("data", data.data);
      await data.data.forEach((e) => {
        this.departments.push({
          id: e.id,
          value: e.name,
        });
      });
      console.log("this.departments", this.departments);
    },
    async changeDate() {
      console.log("changeDate", this.days);
    },
    async checked(value, evt) {
      console.log("val", value);
      if (value === "caNhan")
        this.order.OrderMeta[0].description = "Lý do cá nhân";
      else {
        this.order.OrderMeta[0].description = "";
      }
    },
    async updatedOrderMeta() {
      // this.active = false;
      //  this.disable = !this.disable;
      if (
        this.metaValue.selection == "Xin nghỉ việc(kết thúc hợp đồng lao động)"
      ) {
        console.log("this.metaValue.account2.id", this.metaValue.accountName);
        let fullName = this.userInfo.lastName;
        let selection = this.metaValue.selection;
        let position = this.userInfo.position;
        let maNV = this.userInfo.account;
        let dateStart =
          this.order.OrderMeta[0].dateStart == null
            ? " "
            : this.order.OrderMeta[0].dateStart;
        let lyDo = this.order.OrderMeta[0].description;
        let department =
          this.nameDepartmentName.NAME == null
            ? " "
            : this.nameDepartmentName.NAME;

        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,
          selection,
          position,
          maNV,
          dateStart,
          lyDo,
          department,
        });
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
        await this.deleteRequest(this.order.id);
        location.reload();
      } else if (this.metaValue.selection == "Xin nghỉ không lương") {
        console.log("this.metaValue.account2.id", this.metaValue.accountName);
        let fullName = this.userInfo.lastName;
        let selection = this.metaValue.selection;
        let position = this.userInfo.position;
        let maNV = this.userInfo.account;
        let dateStart =
          this.order.OrderMeta[0].dateStart == null
            ? " "
            : this.order.OrderMeta[0].dateStart;
        let dateEnd =
          this.order.OrderMeta[0].dateEnd == null
            ? " "
            : this.order.OrderMeta[0].dateEnd;
        let lyDo = this.order.OrderMeta[0].description;
        let department =
          this.nameDepartmentName.NAME == null
            ? " "
            : this.nameDepartmentName.NAME;

        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,
          selection,
          position,
          maNV,
          dateEnd,
          dateStart,
          lyDo,
          department,
        });
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
        await this.deleteRequest(this.order.id);
        location.reload();
      } else if (this.metaValue.selection == "Xin nghỉ Thai sản") {
        console.log("this.metaValue.account2.id", this.metaValue.accountName);
        let fullName = this.userInfo.lastName;
        let selection = this.metaValue.selection;
        let position = this.userInfo.position;
        let maNV = this.userInfo.account;
        let dateStart =
          this.order.OrderMeta[0].dateStart == null
            ? " "
            : this.order.OrderMeta[0].dateStart;
        let thoiGianMangThai = this.metaValue.thoiGianMangThai;
        let department =
          this.nameDepartmentName.NAME == null
            ? " "
            : this.nameDepartmentName.NAME;

        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,
          selection,
          position,
          maNV,
          thoiGianMangThai,
          dateStart,
          department,
        });
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
        await this.deleteRequest(this.order.id);
        location.reload();
      } else {
        console.log("this.metaValue.account2.id", this.metaValue.accountName);
        let fullName = this.userInfo.lastName;
        let fullName2 =
          this.metaValue.accountName.label == undefined
            ? " "
            : this.metaValue.accountName.label;
        let selection = this.metaValue.selection;
        let position = this.userInfo.position;
        let maNV = this.userInfo.account;
        let dateStart =
          this.order.OrderMeta[0].dateStart == null
            ? " "
            : this.order.OrderMeta[0].dateStart;
        let dateEnd =
          this.order.OrderMeta[0].dateEnd == null
            ? " "
            : this.order.OrderMeta[0].dateEnd;
        let lyDo =
          this.order.OrderMeta[0].description == null
            ? " "
            : this.order.OrderMeta[0].description;
        let department =
          this.nameDepartmentName.NAME == null
            ? " "
            : this.nameDepartmentName.NAME;

        let department2 =
          this.order.OrderMeta[0].department2 != null
            ? this.order.OrderMeta[0].department2
            : " ";
        let position2 =
          this.order.OrderMeta[0].position2 != null
            ? this.order.OrderMeta[0].position2
            : " ";
        await this.updateOrderMeta({
          ...this.order.OrderMeta[0],
          metaValue: JSON.stringify([this.metaValue]),
          fullName,
          fullName2,
          selection,
          position,
          maNV,
          dateEnd,
          dateStart,
          lyDo,
          department2,
          position2,
          department,
        });
        await axios.put(`/api/v2/orders?orderId=${this.order.id}`);
        await this.deleteRequest(this.order.id);
        location.reload();
      }
    },
  },
  computed: {
    ...mapGetters("orders", ["order"]),
    ...mapGetters("base", ["myFactoryInfor", "userInfo", "dsCongDoans"]),
  },
  watch: {
    disable(newValue) {
      if (newValue) {
        if (
          this.metaValue.selection ==
          "Xin nghỉ việc(kết thúc hợp đồng lao động)"
        ) {
          console.log("this.metaValue.account2.id", this.metaValue.accountName);
          let fullName = this.userInfo.lastName;
          let selection = this.metaValue.selection;
          let position = this.userInfo.position;
          let maNV = this.userInfo.account;
          let dateStart =
            this.order.OrderMeta[0].dateStart == null
              ? " "
              : this.order.OrderMeta[0].dateStart;
          let lyDo = this.order.OrderMeta[0].description;
          let department =
            this.nameDepartmentName.NAME == null
              ? " "
              : this.nameDepartmentName.NAME;

          this.updateOrderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,
            selection,
            position,
            maNV,
            dateStart,
            lyDo,
            department,
          });
        } else if (this.metaValue.selection == "Xin nghỉ không lương") {
          console.log("this.metaValue.account2.id", this.metaValue.accountName);
          let fullName = this.userInfo.lastName;
          let selection = this.metaValue.selection;
          let position = this.userInfo.position;
          let maNV = this.userInfo.account;
          let dateStart =
            this.order.OrderMeta[0].dateStart == null
              ? " "
              : this.order.OrderMeta[0].dateStart;
          let dateEnd =
            this.order.OrderMeta[0].dateEnd == null
              ? " "
              : this.order.OrderMeta[0].dateEnd;
          let lyDo = this.order.OrderMeta[0].description;
          let department =
            this.nameDepartmentName.NAME == null
              ? " "
              : this.nameDepartmentName.NAME;

          this.updateOrderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,
            selection,
            position,
            maNV,
            dateEnd,
            dateStart,
            lyDo,
            department,
          });
        } else if (this.metaValue.selection == "Xin nghỉ Thai sản") {
          console.log("this.metaValue.account2.id", this.metaValue.accountName);
          let fullName = this.userInfo.lastName;
          let selection = this.metaValue.selection;
          let position = this.userInfo.position;
          let maNV = this.userInfo.account;
          let dateStart =
            this.order.OrderMeta[0].dateStart == null
              ? " "
              : this.order.OrderMeta[0].dateStart;
          let thoiGianMangThai = this.metaValue.thoiGianMangThai;
          let department =
            this.nameDepartmentName.NAME == null
              ? " "
              : this.nameDepartmentName.NAME;

          this.updateOrderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,
            selection,
            position,
            maNV,
            thoiGianMangThai,
            dateStart,
            department,
          });
        } else {
          console.log("this.metaValue.account2.id", this.metaValue.accountName);
          let fullName = this.userInfo.lastName;
          let fullName2 =
            this.metaValue.accountName.label == undefined
              ? " "
              : this.metaValue.accountName.label;
          let selection = this.metaValue.selection;
          let position = this.userInfo.position;
          let maNV = this.userInfo.account;
          let dateStart =
            this.order.OrderMeta[0].dateStart == null
              ? " "
              : this.order.OrderMeta[0].dateStart;
          let dateEnd =
            this.order.OrderMeta[0].dateEnd == null
              ? " "
              : this.order.OrderMeta[0].dateEnd;
          let lyDo =
            this.order.OrderMeta[0].description == null
              ? " "
              : this.order.OrderMeta[0].description;
          let department =
            this.nameDepartmentName.NAME == null
              ? " "
              : this.nameDepartmentName.NAME;

          let department2 =
            this.order.OrderMeta[0].department2 != null
              ? this.order.OrderMeta[0].department2
              : " ";
          let position2 =
            this.order.OrderMeta[0].position2 != null
              ? this.order.OrderMeta[0].position2
              : " ";
          this.updateOrderMeta({
            ...this.order.OrderMeta[0],
            metaValue: JSON.stringify([this.metaValue]),
            fullName,
            fullName2,
            selection,
            position,
            maNV,
            dateEnd,
            dateStart,
            lyDo,
            department2,
            position2,
            department,
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.dx-texteditor.dx-editor-outlined.dx-state-disabled .dx-texteditor-input {
  color: rgba(0, 0, 0, 1) !important;
}
</style>
