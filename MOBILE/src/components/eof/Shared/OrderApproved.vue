<template>
<div>
    <div class="my-card" v-if="!requests.length">
        <div style="margin-top:-5px" class="q-mt-lg q-mr-lg float-right">
            <q-btn @click="promptToApproved" color="positive" style="font-style: normal;font-weight:bold" dense>
                <q-icon left size="3em" name="send" />
                <div>Gửi phê duyệt
                </div>
            </q-btn>
        </div>
    </div>
    <div v-else class="q-pa-md print">
        <q-markup-table separator="none" flat bordered>
            <thead>
                <tr>
                    <th class="text-center">Người đề xuất</th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Người làm thay' && request.isAuthority == false">
                        {{ request.position }}
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Người làm thay' && request.isAuthority == true">
                        Người làm thay được ủy quyền kí
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Người nhận bàn giao' && request.isAuthority == false">
                        {{ request.position }}
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Người nhận bàn giao' && request.isAuthority == true">
                        Người nhận bàn giao được ủy quyền kí
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng bộ phận' && request.isAuthority == false ">
                        {{ request.position }} <b v-if="request.successOrder == 1">( Đã duyệt toàn bộ )</b>
                        <b v-if="request.accountId2Active != null">( Phó phòng phê duyệt )</b>
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng bộ phận' && request.isAuthority == true">
                        Trưởng bộ phận được ủy quyền kí
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng phòng IT' && request.isAuthority == false">
                        {{ request.position }}
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng phòng IT' && request.isAuthority == true">
                        Trưởng phòng IT được ủy quyền kí
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng phòng bộ phận chuyển đến' && request.isAuthority == false">
                        {{ request.position }}
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position ==  'Trưởng phòng bộ phận chuyển đến' && request.isAuthority == true">
                        Trưởng phòng bộ phận chuyển đến được ủy quyền kí
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng hành chính' && request.isAuthority == false">
                        {{ request.position }}
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng hành chính' && request.isAuthority == true">
                        Phòng hành chính được ủy quyền kí
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng nhân sự' && request.isAuthority == false">
                        {{ request.position }}
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng nhân sự' && request.isAuthority == true">
                        Phòng nhân sự được ủy quyền kí
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'GĐSX' && request.isAuthority == false">
                        {{ request.position }}
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'GĐSX' && request.isAuthority == true">
                        GĐSX được ủy quyền kí
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Ban TGĐ' && request.isAuthority == false">
                        {{ request.position }}
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Ban TGĐ' && request.isAuthority == true">
                        Ban TGĐ được ủy quyền kí
                    </th>
                    <!-- <th
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Phòng vật tư' && request.isAuthority == false"
            >
              {{ request.position }}
            </th>
            <th
              v-for="request in requests"
              class="text-center"
              :key="request.id"
              v-if="request.position == 'Phòng vật tư' && request.isAuthority == true"
            >
              Phòng vật tự được ủy quyền kí
            </th> -->
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng bảo vệ' && request.isAuthority == false">
                        {{ request.position }}
                    </th>
                    <th v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng bảo vệ' && request.isAuthority == true">
                        Phòng bảo vệ được ủy quyền kí
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-center" style="padding-left:100px">
                        <img width="300" height="115" v-bind:src="'/statics/' + order.accountId +'.png'" />
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Người làm thay' && request.isAuthority == false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Người làm thay' && request.isAuthority == true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountIdAuthorised +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Người nhận bàn giao' && request.isAuthority == false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Người nhận bàn giao' && request.isAuthority == true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountIdAuthorised +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng bộ phận' && request.isAuthority == false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Ủy quyền'"><b>Đã ủy quyền</b></div>
                        <div v-else style="padding-left:100px">
                            <div v-if="request.accountId2Active == 1">
                                <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId2 +'.png'" />
                            </div>
                            <div v-else>
                                <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'" />
                            </div>
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng bộ phận' && request.isAuthority == true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Ủy quyền'"><b>Đã ủy quyền</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountIdAuthorised +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng phòng IT' && request.isAuthority== false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng phòng IT' && request.isAuthority== true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountIdAuthorised +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng phòng bộ phận chuyển đến' && request.isAuthority== false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng phòng bộ phận chuyển đến' && request.isAuthority== true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountIdAuthorised +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng hành chính' && request.isAuthority== false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng hành chính' && request.isAuthority== true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountIdAuthorised +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng nhân sự' && request.isAuthority == false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng nhân sự' && request.isAuthority == true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountIdAuthorised +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'GĐSX' && request.isAuthority== false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'GĐSX' && request.isAuthority== true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountIdAuthorised +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Ban TGĐ' && request.isAuthority== false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountId +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Ban TGĐ' && request.isAuthority== true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="padding-left:100px">
                            <img alt="Không có chữ kí số" width="300" height="115" v-bind:src="'/statics/' + request.accountIdAuthorised +'.png'" />
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng bảo vệ'&& request.isAuthority == false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="">
                            <b>Đã xác nhận</b>
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng bảo vệ'&& request.isAuthority == true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div style="padding-left:0px" v-else-if="request.status == 'Không'"><b>Không chấp thuận</b></div>
                        <div style="padding-left:0px;color:red" v-else-if="request.status == 'Quá hạn'"><b>Quá thời hạn phê duyệt</b></div>
                        <div v-else style="">
                            <b>Đã xác nhận</b>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="text-center q-ma-lg">{{ userInfo.lastName }}
                        </br><b>SĐT : </b>{{userInfo.PHONE}}</td>

                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Người làm thay' && request.isAuthority== false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position =='Người làm thay' && request.isAuthority== true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Người nhận bàn giao' && request.isAuthority == false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Người nhận bàn giao' && request.isAuthority == true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng bộ phận' && request.isAuthority == false">
                        <div v-if="request.accountId2Active == 1">
                            <div v-if="request.status == 'Chưa ký'">
                            </div>
                            <div v-else-if="request.status == 'Không'">
                                {{ getAccountById(request.accountId2).lastName }}
                            </div>
                            <div v-else-if="request.status == 'Quá hạn'">
                                {{ getAccountById(request.accountId2).lastName }}
                            </div>
                            <div v-else>
                                {{ getAccountById(request.accountId2).lastName }}
                            </div>
                        </div>
                        <div v-else>
                            <div v-if="request.status == 'Chưa ký'">
                            </div>
                            <div v-else-if="request.status == 'Không'">
                                {{ getAccountById(request.accountId).lastName }}
                            </div>
                            <div v-else-if="request.status == 'Quá hạn'">
                                {{ getAccountById(request.accountId).lastName }}
                            </div>
                            <div v-else>
                                {{ getAccountById(request.accountId).lastName }}
                            </div>
                        </div>
                        
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng bộ phận' && request.isAuthority == true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng phòng IT' && request.isAuthority== false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng phòng IT' && request.isAuthority== true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng phòng bộ phận chuyển đến' && request.isAuthority== false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Trưởng phòng bộ phận chuyển đến' && request.isAuthority== true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng hành chính' && request.isAuthority== false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng hành chính' && request.isAuthority== true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng nhân sự' && request.isAuthority==false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng nhân sự' && request.isAuthority==true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                    </td>
                     <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'GĐSX' && request.isAuthority == false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'GĐSX' && request.isAuthority == true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Ban TGĐ' && request.isAuthority == false">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountId).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Ban TGĐ' && request.isAuthority == true">
                        <div v-if="request.status == 'Chưa ký'">
                        </div>
                        <div v-else-if="request.status == 'Không'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else-if="request.status == 'Quá hạn'">
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                        <div v-else>
                            {{ getAccountById(request.accountIdAuthorised).lastName }}
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng bảo vệ'&& request.isAuthority ==false">
                        <div v-if="request.timeVTAccept == null">
                            Chưa xác nhận thời gian ra
                        </div>
                        <div v-else>
                            Thời gian xác nhận ra : <b>{{request.timeVTAccept}}</b>
                        </div>
                        <div v-if="request.timeVTAcceptEnd == null">
                            Chưa xác nhận thời gian vào
                        </div>
                        <div v-else>
                            Thời gian xác nhận vào : <b>{{request.timeVTAcceptEnd}}</b>
                        </div>
                    </td>
                    <td v-for="request in requests" class="text-center" :key="request.id" v-if="request.position == 'Phòng bảo vệ'&& request.isAuthority ==true">
                        <div v-if="request.timeVTAccept == null">
                            Chưa xác nhận thời gian ra
                        </div>
                        <div v-else>
                            Thời gian xác nhận ra : <b>{{request.timeVTAccept}}</b>
                        </div>
                        <div v-if="request.timeVTAcceptEnd == null">
                            Chưa xác nhận thời gian vào
                        </div>
                        <div v-else>
                            Thời gian xác nhận vào : <b>{{request.timeVTAcceptEnd}}</b>
                        </div>
                    </td>

                </tr>
            </tbody>
        </q-markup-table>
    </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { uid } from "quasar";
import axios from "axios";
import moment from "moment";
import { derNMTH } from "../../../ultils/derNMTH";
export default {
  props: ["order", "metaValue", "optionBV"],
  data() {
    return {
      data: {
        image: "~assets/Vũ Hải Bằng.png",
      },
      requests: [],
      lastName: [],
      result: null,
      step: 0,
      accountName: null,
      stepDepartment1: null,
    };
  },
  computed: {
    ...mapGetters("base", ["userInfo", "myFactoryInfor", "dSNhanVien"]),
    ...mapGetters("orders", ["getAccountById", "accounts"]),
    ...mapGetters("requests", ["request"]),
  },
  async created() {
    console.log("optionBV", this.optionBV);
    console.log("timeRequest", moment().format("l"));
    console.log("this.order", this.order);
    console.log("this.metaValue", this.metaValue);

    // console.log('this.accountName',this.accountName)
    // this.accountName = await this.getAccountByID(this.order.accountId)
    // let data2 = await this.GET_DEPARTMENTSALL();
    //       console.log('data2',data2)
    // let data3 =  data2.find(e =>  e.NAME == 'Phòng Nhân Sự'
    // )
    // console.log('data3',data3)
  },
  methods: {
    ...mapActions("base", [
      "GET_DEPARTMENTSBYID",
      "GET_DEPARTMENTSALL",
      "getAccountByID",
    ]),
    ...mapActions("orders", ["sendToApproved"]),
    ...mapActions("requests", [
      "checkPermissionAuthorised",
      "getTokenFCM",
      "sendNotificationMail",
    ]),
    ...mapActions("requests", ["completedRequest"]),
    async taoDSKy() {
      console.log("this.order", this.order);
      console.log("this.order", this.metaValue);
      console.log("optionBV", this.optionBV);
      //Nếu trình ký thì tạo danh sách trình ký
      if (!this.requests.length) {
        let departmentId = await this.GET_DEPARTMENTSBYID(
          this.order.departmentId
        );
        console.log("công đoạn tạo phiếu", departmentId);
        const year = new Date().getFullYear();
        let newRequests = [];
        let newRequest = {
          id: uid(),
          parentId: null,
          accountId: departmentId.accountId,
          accountId2: null,
          proposalFormId: this.order.proposalFormId,
          fromAccountId: this.order.accountId,
          orderId: this.order.id,
          departmentId: this.order.departmentId,
          factoryId: this.order.factoryId,
          title: [this.order.title, this.order.number + "/"+ year].join(" "),
          status: "Chưa ký",
          name: "test",
          position: "Trưởng bộ phận",
          showMessages: true,
          isDisable: false,
          completed: false,
          slug: this.order.slug,
          star: 4,
          show: false,
          step: null,
          isAuthority: false,
        };

        console.log("trc TBP", newRequest);
        if(newRequest.slug == "xac-nhan-cong" && this.userInfo.id == 101983){
          newRequest = await {
                ...newRequest,
                accountId: 101687, // PTGĐ Đỗ Thị Bạch Tuyết
                position: "Ban TGĐ",
                uyQuyen: this.metaValue.uyQuyen,
              };
        }
        // check ủy quyền Trưởng bộ phận && nếu xin ra cổng thì cho phó phòng xem có thể kí hộ
        if (newRequest.slug == "xin-ra-cong") {
          let payload = {
            slug: this.order.slug,
            accountId: departmentId.accountId,
            timeRequest: moment().format("l"),
          };
          console.log("payload", payload);
          let dataCheckTBP = await this.checkPermissionAuthorised(payload);
          console.log("dataCheckTBP", dataCheckTBP.data.data[0]);
          console.log("userInfo", this.userInfo.id);
          console.log("fromAccountId", newRequest.fromAccountId);
          if (
            dataCheckTBP.data.data.length > 0 &&
            this.userInfo.id != newRequest.accountId
          ) {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              accountId2: departmentId.accountId1,
              id: uid(),
              accountIdAuthorised:
                dataCheckTBP.data.data[0].accountIdAuthorised,
              timeStartAuthorised: dataCheckTBP.data.data[0].timeStartAuthority,
              timeEndAuthorised: dataCheckTBP.data.data[0].timeEndAuthority,
              timeAuthorityActive: null,
              isAuthority: true,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          } else if (
            dataCheckTBP.data.data.length <= 0 &&
            this.userInfo.id != newRequest.accountId
          ) {
            newRequest = await {
              ...newRequest,
              accountId2: departmentId.accountId1,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          }
        } else {
          let payload = {
            slug: this.order.slug,
            accountId: departmentId.accountId,
            timeRequest: moment().format("l"),
          };
          console.log("payload", payload);
          let dataCheckTBP = await this.checkPermissionAuthorised(payload);
          console.log("dataCheckTBP", dataCheckTBP.data.data[0]);
          console.log("userInfo", this.userInfo.id);
          console.log("fromAccountId", newRequest.fromAccountId);
          if (
            dataCheckTBP.data.data.length > 0 &&
            this.userInfo.id != newRequest.accountId
          ) {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountIdAuthorised:
                dataCheckTBP.data.data[0].accountIdAuthorised,
              timeStartAuthorised: dataCheckTBP.data.data[0].timeStartAuthority,
              timeEndAuthorised: dataCheckTBP.data.data[0].timeEndAuthority,
              timeAuthorityActive: null,
              isAuthority: true,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          } else if (
            dataCheckTBP.data.data.length <= 0 &&
            this.userInfo.id != newRequest.accountId
          ) {
            // check nếu là làm thêm giờ bên khối dự án thì chuyển qua cho PGĐ Phượng phê duyệt (createdby : HTHIEU 2021-04-01)
            if (
              newRequest.slug == "xac-nhan-cong" &&
              (this.order.departmentId == 102314 || // dự án nội địa DA -NM Nam Hồng
                this.order.departmentId == 102395 || // Ván công nghiệp (VCN)
                // this.order.departmentId == 102396 || // Phòng Kinh Doanh 1
                this.order.departmentId == 102314 || //NM Nam Hồng
                // this.order.departmentId == 102315 || //Phòng kinh doanh dự án
                // this.order.departmentId == 102316 || //Phòng kế hoạch dự án
                this.order.departmentId == 102422 || //Khối Dự Án và Tủ Bếp
                this.order.departmentId == 102423 || //NM Nam Hồng(DA)
                // this.order.departmentId == 102424 || //Phòng Kinh Doanh(DA)
                // this.order.departmentId == 102425 || //Phòng QC(DA)
                // this.order.departmentId == 102426 || //Phòng Kế Hoạch(DA)
                // this.order.departmentId == 102428 || //Kinh doanh dự án(DA)
                this.order.departmentId == 102429 || //Bộ phận quản lý thầu phụ và vật tư(DA)
                this.order.departmentId == 102430 || //Bộ phận kiểm soát thanh toán(DA)
                this.order.departmentId == 102431 || //Bộ phận thiết kế(DA)
                this.order.departmentId == 102432 || //Bộ phận KHSX(DA)
                this.order.departmentId == 102433 || //Bộ phận thi công(DA)
                this.order.departmentId == 102434 || //Bộ phận hồ sơ(DA)
                // this.order.departmentId == 102435 || //Phòng Cơ Điện(DA)
                this.order.departmentId == 102436)
            ) {
              newRequest = await {
                ...newRequest,
                accountId: 101691, // PTGĐ NGuyễn Thị Phượng
                position: "Ban TGĐ",
                uyQuyen: this.metaValue.uyQuyen,
              };
              await newRequests.push(newRequest);
            } else await newRequests.push(newRequest);
          }
          // await newRequests.push(newRequest);
        }
        if (
          // nếu quản đốc đề xuất sẽ k lên trưởng bộ phận mà lên thẳng GĐSX -- createdBy : HTHIEU(2021-04-07)
          this.order.departmentId == derNMTH.Xưởng1 ||
          this.order.departmentId == derNMTH.Xưởng2 ||
          this.order.departmentId == derNMTH.Xưởng3
        ) {
          newRequests = [];
        }
        console.log("sau TBP", newRequest);
        //phân quyền trưởng bộ phận chuyển đến  -- created by HTHIEU(27/11/2020)
        if (
          newRequest.slug != "bien-ban-ban-giao" &&
          newRequest.slug != "xac-nhan-cong" &&
          newRequest.slug != "sua-chua"
        ) {
          if (!this.metaValue.stepDepartment) {
            this.stepDepartment1 = "";
          } else {
            this.stepDepartment1 = this.metaValue.stepDepartment.value;
          }
        }
        if (
          this.stepDepartment1 != null &&
          newRequest.slug == "chuyen-nhan-vien" &&
          this.metaValue.selection == "Điều chuyển cá nhân"
        ) {
          let data = await this.GET_DEPARTMENTSBYID(
            this.metaValue.stepDepartment.value
          );
          console.log("data", data);

          // check ủy quyền
          let payloadTBPCĐ = {
            slug: this.order.slug,
            accountId: data.accountId,
            timeRequest: moment().format("l"),
          };
          let dataCheckTBPCĐ = await this.checkPermissionAuthorised(
            payloadTBPCĐ
          );
          console.log("dataCheckTBP", dataCheckTBPCĐ.data.data[0]);
          if (dataCheckTBPCĐ.data.data.length > 0) {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountIdAuthorised:
                dataCheckTBPCĐ.data.data[0].accountIdAuthorised,
              timeStartAuthorised:
                dataCheckTBPCĐ.data.data[0].timeStartAuthority,
              timeEndAuthorised: dataCheckTBPCĐ.data.data[0].timeEndAuthority,
              timeAuthorityActive: null,
              position: "Trưởng phòng bộ phận chuyển đến",
              isAuthority: true,
              accountId: data.accountId,
              star: 5,
              show: false,
              step: null,
              uyQuyen: this.metaValue.uyQuyen,
            };
          } else {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountId: data.accountId,
              star: 5,
              accountIdAuthorised: null,
              timeStartAuthorised: null,
              timeEndAuthorised: null,
              show: false,
              step: null,
              position: "Trưởng phòng bộ phận chuyển đến",
              isAuthority: false,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
            // await newRequests.push(newRequest);
          }
        }
        // end...............

        //Phân quyền người nhận bàn giao : created by : HTHIEU 27/11/2020
        if (newRequest.slug == "bien-ban-ban-giao") {
          let payloadNNBG = {
            slug: this.order.slug,
            accountId: this.metaValue.accountName.value,
            timeRequest: moment().format("l"),
          };
          let dataCheckNNBG = await this.checkPermissionAuthorised(payloadNNBG);
          console.log("dataCheckNNBG", dataCheckNNBG.data.data[0]);
          if (dataCheckNNBG.data.data.length > 0) {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountIdAuthorised:
                dataCheckNNBG.data.data[0].accountIdAuthorised,
              timeStartAuthorised:
                dataCheckNNBG.data.data[0].timeStartAuthority,
              timeEndAuthorised: dataCheckNNBG.data.data[0].timeEndAuthority,
              timeAuthorityActive: null,
              isAuthority: true,
              star: 1,
              show: false,
              step: null,
              position: "Người nhận bàn giao",
              accountId: this.metaValue.accountName.value,
              uyQuyen: this.metaValue.uyQuyen,
            };
          } else {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountId: this.metaValue.accountName.value,
              star: 1,
              accountIdAuthorised: null,
              timeStartAuthorised: null,
              timeEndAuthorised: null,
              show: false,
              step: null,
              position: "Người nhận bàn giao",
              isAuthority: false,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
            // await newRequests.push(newRequest);
          }
        }

        //phần quyền Phòng nhân sự - created by : HTHIEU(27/11/2020)
        if (
          newRequest.slug == "chuyen-nhan-vien" ||
          // newRequest.slug == 'di-cong-tac' ||
          (newRequest.slug == "de-nghi-luong" &&
            newRequest.slug != "xin-ra-cong") ||
          (newRequest.slug == "xin-nghi-viec" &&
            this.metaValue.selection != "Xin nghỉ không lương" &&
            this.metaValue.selection != "Nghỉ phép" &&
            this.metaValue.selection != "Nghỉ ốm" &&
            this.metaValue.selection != "Xin nghỉ Thai sản")
          //     ||
          // newRequest.slug == 'xac-nhan-cong'
        ) {
          let departmentAll = await this.GET_DEPARTMENTSALL();
          console.log("data2", departmentAll);
          let departmentNS = departmentAll.find(
            (e) => e.NAME == "Phòng nhân sự"
          );
          console.log("data3", departmentNS);
          let payloadNS = {
            slug: this.order.slug,
            accountId: departmentNS.accountId,
            timeRequest: moment().format("l"),
          };
          let dataCheckTBPNS = await this.checkPermissionAuthorised(payloadNS);
          console.log("ủy quyền TP NS", dataCheckTBPNS.data.data[0]);
          if (dataCheckTBPNS.data.data.length > 0) {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountIdAuthorised:
                dataCheckTBPNS.data.data[0].accountIdAuthorised,
              timeStartAuthorised:
                dataCheckTBPNS.data.data[0].timeStartAuthority,
              timeEndAuthorised: dataCheckTBPNS.data.data[0].timeEndAuthority,
              timeAuthorityActive: null,
              accountId: departmentNS.accountId,
              position: "Phòng nhân sự",
              isAuthority: true,
              show: false,
              step: null,
              star: 6,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          } else {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              star: 6,
              accountIdAuthorised: null,
              timeStartAuthorised: null,
              timeEndAuthorised: null,
              show: false,
              step: null,
              accountId: departmentNS.accountId,
              position: "Phòng nhân sự",
              isAuthority: false,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          }
        }

        //phân quyền trưởng phòng IT - created by : HTHIEU(10/12/2020)
        if (
          newRequest.slug == "mua-hang" &&
          this.order.computerEquipment == true
        ) {
          let departmentAll = await this.GET_DEPARTMENTSALL();
          console.log("data2", departmentAll);
          let departmentIT = departmentAll.find((e) => e.NAME == "Phòng IT");
          console.log("data3", departmentIT);
          let payloadIT = {
            slug: this.order.slug,
            accountId: departmentIT.accountId,
            timeRequest: moment().format("l"),
          };
          let dataCheckTBPIT = await this.checkPermissionAuthorised(payloadIT);
          console.log("ủy quyền TP IT", dataCheckTBPIT.data.data[0]);
          if (dataCheckTBPIT.data.data.length > 0) {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountIdAuthorised:
                dataCheckTBPIT.data.data[0].accountIdAuthorised,
              timeStartAuthorised:
                dataCheckTBPIT.data.data[0].timeStartAuthority,
              timeEndAuthorised: dataCheckTBPIT.data.data[0].timeEndAuthority,
              timeAuthorityActive: null,
              accountId: departmentIT.accountId,
              position: "Trưởng phòng IT",
              isAuthority: true,
              show: false,
              step: null,
              star: 5,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          } else {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              star: 5,
              accountIdAuthorised: null,
              timeStartAuthorised: null,
              timeEndAuthorised: null,
              show: false,
              step: null,
              accountId: departmentIT.accountId,
              position: "Trưởng phòng IT",
              isAuthority: false,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          }
        }

        //phân quyền Phòng hành chính - created by : HTHIEU(27/11/2020)
        if (
          newRequest.slug == "van-phong-pham" ||
          newRequest.slug == "cap-bao-ho-lao-dong"
        ) {
          let departmentAll = await this.GET_DEPARTMENTSALL();
          console.log("data2", departmentAll);
          let departmentHC = departmentAll.find(
            (e) => e.NAME == "Phòng Hành Chính"
          );
          console.log("data3", departmentHC);
          let payload5 = {
            slug: this.order.slug,
            accountId: departmentHC.accountId,
            timeRequest: moment().format("l"),
          };
          let dataCheckTBP5 = await this.checkPermissionAuthorised(payload5);
          console.log("ủy quyền TP HC", dataCheckTBP5.data.data[0]);
          if (dataCheckTBP5.data.data.length > 0) {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountIdAuthorised:
                dataCheckTBP5.data.data[0].accountIdAuthorised,
              timeStartAuthorised:
                dataCheckTBP5.data.data[0].timeStartAuthority,
              timeEndAuthorised: dataCheckTBP5.data.data[0].timeEndAuthority,
              timeAuthorityActive: null,
              position: "Phòng hành chính",
              accountId: departmentHC.accountId,
              isAuthority: true,
              show: false,
              step: null,
              star: 5,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          } else {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              star: 5,
              accountIdAuthorised: null,
              timeStartAuthorised: null,
              timeEndAuthorised: null,
              show: false,
              step: null,
              accountId: departmentHC.accountId,
              position: "Phòng hành chính",
              isAuthority: false,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          }
        }
        //end..............................

        //phân quyền trưởng phòng bảo vệ - created by : HTHIEU(27/11/2020) updatedAt 2021-04-02
        if (newRequest.slug == "xin-ra-cong") {
          let accountIdBV = null;
          if (
            this.order.proposalFormId == 1033 ||
            (this.order.proposalFormId == 1043 && this.optionBV == "4") //Phiếu xin ra cổng NM NH
          ) {
            accountIdBV = 101825; // BVNH
          } else if (
            this.order.proposalFormId == 1034 ||
            (this.order.proposalFormId == 1043 && this.optionBV == "5") //Phiếu xin ra cổng NM QM
          ) {
            accountIdBV = 101818; // BVQM
          } 
          else if (
            this.order.proposalFormId == 1035 ||
            (this.order.proposalFormId == 1043 && this.optionBV == "2") //Phiếu xin ra cổng NM YS1A-1B-2
          ) {
            accountIdBV = 101954; //BVYS
          } 
          else if (
            this.order.proposalFormId == 1045 ||
            (this.order.proposalFormId == 1043 && this.optionBV == "2") //Phiếu xin ra cổng NM YS1A-1B-2
          ) {
            accountIdBV = 108121; //BVCH
          } 
          else if (
            this.order.proposalFormId == 1046 ||
            (this.order.proposalFormId == 1043 && this.optionBV == "2") //Phiếu xin ra cổng NM YS1A-1B-2
          ) {
            accountIdBV = 108122; //BVVF
          } 
          else if (
            this.order.proposalFormId == 1036 ||
            (this.order.proposalFormId == 1043 && this.optionBV == "3") //Phiếu xin ra cổng NM TB
          ) {
            accountIdBV = 101955; //BVYS4
          } else {
            accountIdBV = 101704; //  BVTH
          }
          let departmentAll = await this.GET_DEPARTMENTSALL();
          console.log("data2", departmentAll);
          newRequest = await {
            ...newRequest,
            accountId2: null,
            parentId: newRequest.id,
            id: uid(),
            accountIdAuthorised: null,
            timeStartAuthorised: null,
            timeEndAuthorised: null,
            star: 8,
            show: false,
            step: null,
            accountId: accountIdBV,
            position: "Phòng bảo vệ",
            isAuthority: false,
            uyQuyen: this.metaValue.uyQuyen,
          };
          await newRequests.push(newRequest);
          // }
        }
        //end..............................

        //Nếu là MH-VT YS1A thì thêm GDDSX YS1A
        // if (
        //   //thêm GĐSX YS1a
        //   this.order.proposalFormId == 1037 // mua hàng NM YS1A
        // ) {
        //   console.log("GĐSX NAM YS1A");
        //   let payload7 = {
        //     slug: this.order.slug,
        //     accountId: 101858,
        //     timeRequest: moment().format("l"),
        //   };
        //   let dataCheckTBP7 = await this.checkPermissionAuthorised(payload7);
        //   console.log("ủy quyền TGĐ", dataCheckTBP7.data.data);
        //   if (dataCheckTBP7.data.data.length > 0) {
        //     newRequest = await {
        //       ...newRequest,
        //       parentId: newRequest.id,
        //       id: uid(),
        //       accountIdAuthorised:
        //         dataCheckTBP7.data.data[0].accountIdAuthorised,
        //       timeStartAuthorised:
        //         dataCheckTBP7.data.data[0].timeStartAuthority,
        //       timeEndAuthorised: dataCheckTBP7.data.data[0].timeEndAuthority,
        //       timeAuthorityActive: null,
        //       position: "Phó GĐSX",
        //       accountId: 101858, // Id GDSX NAM YS1A
        //       isAuthority: true,
        //       show: false,
        //       step: null,
        //       star: 6,
        //       uyQuyen: this.metaValue.uyQuyen

        //     };
        //     await newRequests.push(newRequest);
        //   } else {
        //     newRequest = await {
        //       ...newRequest,
        //       accountIdAuthorised: null,
        //       timeStartAuthorised: null,
        //       timeEndAuthorised: null,
        //       parentId: newRequest.id,
        //       id: uid(),
        //       star: 6,
        //       show: false,
        //       step: null,
        //       accountId: 101858, // Id GDDSX NAM YS1A
        //       position: "Phó GĐSX",
        //       isAuthority: false,
        //       uyQuyen: this.metaValue.uyQuyen
        //     };
        //     await newRequests.push(newRequest);
        //   }
        // }

        //Nếu là MH-VT YS1A thì thêm GDDSX YS1B
        if (
          //thêm GĐSX YS1B
          this.order.proposalFormId == 1038 // mua hàng NM YS1B
        ) {
          console.log("GĐSX NAM YS1B");
          let payload7 = {
            slug: this.order.slug,
            accountId: 101863,
            timeRequest: moment().format("l"),
          };
          let dataCheckTBP7 = await this.checkPermissionAuthorised(payload7);
          console.log("ủy quyền TGĐ", dataCheckTBP7.data.data);
          if (dataCheckTBP7.data.data.length > 0) {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountIdAuthorised:
                dataCheckTBP7.data.data[0].accountIdAuthorised,
              timeStartAuthorised:
                dataCheckTBP7.data.data[0].timeStartAuthority,
              timeEndAuthorised: dataCheckTBP7.data.data[0].timeEndAuthority,
              timeAuthorityActive: null,
              position: "GĐSX",
              accountId: 101863, // Id GDSX Khánh YS1B
              isAuthority: true,
              show: false,
              step: null,
              star: 6,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          } else {
            newRequest = await {
              ...newRequest,
              accountIdAuthorised: null,
              timeStartAuthorised: null,
              timeEndAuthorised: null,
              parentId: newRequest.id,
              id: uid(),
              star: 6,
              show: false,
              step: null,
              accountId: 101863, // Id GDDSX Khánh YS1B
              position: "GĐSX",
              isAuthority: false,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          }
        }

        // Tổ nhà máy Thuận Hưng thì chạy qua GĐSX Duy Hùng  - createdby : HTHIEU(2021-04-01)
        if (
          //Nhà máy thuận hưng
          this.order.departmentId == derNMTH.Xưởng1 ||
          this.order.departmentId == derNMTH.Xưởng2 ||
          this.order.departmentId == derNMTH.Xưởng3 ||
          this.order.departmentId == derNMTH.XưởngSLP ||
          this.order.departmentId == derNMTH.Khophôi ||
          this.order.departmentId == derNMTH.Khothànhphẩm ||
          this.order.departmentId == derNMTH.Container ||
          this.order.departmentId == derNMTH.TổLựaphôi ||
          this.order.departmentId == derNMTH.TổSấyphôi ||
          this.order.departmentId == derNMTH.QC ||
          this.order.departmentId == derNMTH.LựaphôiX1 ||
          this.order.departmentId == derNMTH.VGTIndoorX1 ||
          this.order.departmentId == derNMTH.Tinhchế1X1 ||
          this.order.departmentId == derNMTH.Tinhchế2X1 ||
          this.order.departmentId == derNMTH.HTM1X1 ||
          this.order.departmentId == derNMTH.Sơn1X2 ||
          this.order.departmentId == derNMTH.Đónggói1X2 ||
          this.order.departmentId == derNMTH.HTM2X1 ||
          this.order.departmentId == derNMTH.Sơn2X2 ||
          this.order.departmentId == derNMTH.Đónggói2X2 ||
          this.order.departmentId == derNMTH.LựaphôiX3 ||
          this.order.departmentId == derNMTH.HTMX3 ||
          this.order.departmentId == derNMTH.SơchếX3 ||
          this.order.departmentId == derNMTH.HTDX3 ||
          this.order.departmentId == derNMTH.VGTIndoorX3 ||
          this.order.departmentId == derNMTH.SơnX3 ||
          this.order.departmentId == derNMTH.Tinhchế1X3 ||
          this.order.departmentId == derNMTH.Tinhchế2X3 ||
          this.order.departmentId == derNMTH.ĐónggóiX3 ||
          this.order.departmentId == derNMTH.VáSửahàngTinhchế1X3 ||
          this.order.departmentId == derNMTH.VGTNộiđịaX1 ||
          this.order.departmentId == derNMTH.VGTNộiđịaX3 ||
          this.order.departmentId == derNMTH.Xếpsấy ||
          this.order.departmentId == derNMTH.Sấy ||
          this.order.departmentId == derNMTH.Cắt ||
          this.order.departmentId == derNMTH.GhépngangVGTX3
        ) {
          console.log("GĐSX Duy Hùng");
          let payload7 = {
            slug: this.order.slug,
            accountId: 100374,
            timeRequest: moment().format("l"),
          };
          let dataCheckTBP7 = await this.checkPermissionAuthorised(payload7);
          console.log("ủy quyền TGĐ", dataCheckTBP7.data.data);
          if (dataCheckTBP7.data.data.length > 0) {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountIdAuthorised:
                dataCheckTBP7.data.data[0].accountIdAuthorised,
              timeStartAuthorised:
                dataCheckTBP7.data.data[0].timeStartAuthority,
              timeEndAuthorised: dataCheckTBP7.data.data[0].timeEndAuthority,
              timeAuthorityActive: null,
              position: "GĐSX",
              accountId: 100374,
              isAuthority: true,
              show: false,
              step: null,
              star: 5,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          } else {
            newRequest = await {
              ...newRequest,
              accountIdAuthorised: null,
              timeStartAuthorised: null,
              timeEndAuthorised: null,
              parentId: newRequest.id,
              id: uid(),
              star: 5,
              show: false,
              step: null,
              accountId: 100374,
              position: "GĐSX",
              isAuthority: false,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          }
        }
        console.log("this.order.Department.id", this.order.departmentId);

        // ) {
        if (
          (newRequest.slug == "di-cong-tac" &&
            this.userInfo.account != "05T019") ||
          (newRequest.slug == "mua-hang" &&
            this.order.proposalFormId != 1026 && //Đề xuất mua hàng/cấp vật tư (Vật tư K.Dự Án - Tủ bếp)
            this.order.proposalFormId == 1028) || //Đề xuất mua hàng/cấp vật tư(Sửa chữa tiêu hao - NM YS1B)
          newRequest.slug == "sua-chua"
        ) {
          let department = await this.GET_DEPARTMENTSBYID(
            this.metaValue.departmentParent
          );
          console.log("departmentName 1", department);

          if (department.PARENT_ID) {
            department = await this.GET_DEPARTMENTSBYID(department.PARENT_ID);
          }
          console.log("departmentName 2", department);
          console.log("GĐ Khối");
          // phiếu của khối chế biến gỗ
          if (department.ID == 102299 || department.ID == 102395 || department.ID == 102497) {
            const myDepartment = await this.GET_DEPARTMENTSBYID(
              this.userInfo.departmentId
            );
            if (myDepartment.accountId == this.userInfo.id) {
              newRequest = await {
                ...newRequest,
                accountIdAuthorised: null,
                timeStartAuthorised: null,
                timeEndAuthorised: null,
                parentId: newRequest.id,
                id: uid(),
                star: 7,
                show: false,
                step: null,
                accountId: this.userInfo.id,
                position: "Trưởng phòng",
                isAuthority: false,
                uyQuyen: this.metaValue.uyQuyen,
              };
              await newRequests.push(newRequest);
            }
          } else {
            let payload7 = {
              slug: this.order.slug,
              accountId: department.accountId,
              timeRequest: moment().format("l"),
            };
            let dataCheckTBP7 = await this.checkPermissionAuthorised(payload7);
            console.log("ủy quyền TGĐ", dataCheckTBP7.data.data);
            if (
              dataCheckTBP7.data.data.length > 0 &&
              this.order.proposalFormId == 1028 //Đề xuất mua hàng/cấp vật tư(Sửa chữa tiêu hao - Khối CBG)
            ) {
              newRequest = await {
                ...newRequest,
                parentId: newRequest.id,
                id: uid(),
                accountIdAuthorised:
                  dataCheckTBP7.data.data[0].accountIdAuthorised,
                timeStartAuthorised:
                  dataCheckTBP7.data.data[0].timeStartAuthority,
                timeEndAuthorised: dataCheckTBP7.data.data[0].timeEndAuthority,
                timeAuthorityActive: null,
                position: "Ban TGĐ",
                accountId: department.accountId,
                isAuthority: true,
                show: false,
                step: null,
                star: 7,
                uyQuyen: this.metaValue.uyQuyen,
              };
              await newRequests.push(newRequest);
            } else {
              if (newRequest.slug == "xac-nhan-cong") {
              } else {
                newRequest = await {
                  ...newRequest,
                  accountIdAuthorised: null,
                  timeStartAuthorised: null,
                  timeEndAuthorised: null,
                  parentId: newRequest.id,
                  id: uid(),
                  star: 7,
                  show: false,
                  step: null,
                  accountId: department.accountId,
                  position: "Ban TGĐ",
                  isAuthority: false,
                  uyQuyen: this.metaValue.uyQuyen,
                };
                await newRequests.push(newRequest);
              }
            }
          }
        }
        if (
          (newRequest.slug == "di-cong-tac" &&
            this.userInfo.account != "05T019") ||
          (newRequest.slug == "mua-hang" &&
            this.order.proposalFormId != 1026 && //Đề xuất mua hàng/cấp vật tư (Vật tư K.Dự Án - Tủ bếp)
            this.order.proposalFormId == 1029) || //Đề xuất mua hàng/cấp vật tư(Chế tạo - Khối CBG) //Đề xuất mua hàng/cấp vật tư(Sửa chữa tiêu hao - NM YS1B)
          (this.metaValue.selection == "Nghỉ phép" &&
            this.userInfo.id == newRequest.accountId) ||
          newRequest.slug == "sua-chua"
        ) {
          console.log("GĐ Bằng");
          let payload7 = {
            slug: this.order.slug,
            accountId: 101721,
            timeRequest: moment().format("l"),
          };
          let dataCheckTBP7 = await this.checkPermissionAuthorised(payload7);
          console.log("ủy quyền TGĐ", dataCheckTBP7.data.data);
          if (dataCheckTBP7.data.data.length > 0) {
            newRequest = await {
              ...newRequest,
              parentId: newRequest.id,
              id: uid(),
              accountIdAuthorised:
                dataCheckTBP7.data.data[0].accountIdAuthorised,
              timeStartAuthorised:
                dataCheckTBP7.data.data[0].timeStartAuthority,
              timeEndAuthorised: dataCheckTBP7.data.data[0].timeEndAuthority,
              timeAuthorityActive: null,
              position: "Ban TGĐ",
              accountId: 101721,
              isAuthority: true,
              show: false,
              step: null,
              star: 7,
              uyQuyen: this.metaValue.uyQuyen,
            };
            await newRequests.push(newRequest);
          } else {
            if (newRequest.slug == "xac-nhan-cong") {
            } else {
              newRequest = await {
                ...newRequest,
                accountIdAuthorised: null,
                timeStartAuthorised: null,
                timeEndAuthorised: null,
                parentId: newRequest.id,
                id: uid(),
                star: 7,
                show: false,
                step: null,
                accountId: 101721,
                position: "Ban TGĐ",
                isAuthority: false,
                uyQuyen: this.metaValue.uyQuyen,
              };
              await newRequests.push(newRequest);
            }
          }
          // }
        }
        console.log("sau TGĐ Bằng ", newRequests);
        // Trần thị Thu Hàn ban TGĐ -- created by : HTHIEU(27/11/2020)
        if (
          this.order.departmentId == 102314 || // dự án nội địa DA -NM Nam Hồng
          this.order.departmentId == 102395 || // Ván công nghiệp (VCN)
          this.order.departmentId == 102310 || // NM Vìnforex
          this.order.departmentId == 102311 || // Nhà máy VCN Yên Sơn (YS2)
          this.order.departmentId == 102396 || // Phòng Kinh Doanh 1
          this.order.departmentId == 102314 || //NM Nam Hồng
          this.order.departmentId == 102315 || //Phòng kinh doanh dự án
          this.order.departmentId == 102316 || //Phòng kế hoạch dự án
          this.order.departmentId == 102316 || //Phòng kế hoạch dự án
          this.order.departmentId == 102422 || //Khối Dự Án và Tủ Bếp
          this.order.departmentId == 102423 || //NM Nam Hồng(DA)
          this.order.departmentId == 102424 || //Phòng Kinh Doanh(DA)
          this.order.departmentId == 102425 || //Phòng QC(DA)
          this.order.departmentId == 102426 || //Phòng Kế Hoạch(DA)
          this.order.departmentId == 102427 || //NM Quang Minh(DA)
          this.order.departmentId == 102428 || //Kinh doanh dự án(DA)
          this.order.departmentId == 102429 || //Bộ phận quản lý thầu phụ và vật tư(DA)
          this.order.departmentId == 102430 || //Bộ phận kiểm soát thanh toán(DA)
          this.order.departmentId == 102431 || //Bộ phận thiết kế(DA)
          this.order.departmentId == 102432 || //Bộ phận KHSX(DA)
          this.order.departmentId == 102433 || //Bộ phận thi công(DA)
          this.order.departmentId == 102434 || //Bộ phận hồ sơ(DA)
          this.order.departmentId == 102435 || //Phòng Cơ Điện(DA)
          this.order.departmentId == 102436 //Phòng bảo vệ NH
        ) {
          if (
            newRequest.slug == "dang-ky-xe" ||
            newRequest.slug == "di-cong-tac" ||
            newRequest.slug == "de-nghi-luong" ||
            newRequest.slug == "tuyen-nhan-vien" ||
            newRequest.slug == "chuyen-nhan-vien" ||
            (newRequest.slug == "mua-hang" &&
              this.order.proposalFormId == 1026 &&
              this.order.proposalFormId != 1028 &&
              this.order.proposalFormId != 1029 &&
              this.order.proposalFormId != 1031) ||
            newRequest.slug == "vat-tu" ||
            this.metaValue.selection ==
              "Xin nghỉ việc(kết thúc hợp đồng lao động)" ||
            (this.metaValue.selection == "Nghỉ phép" &&
              this.userInfo.id == newRequest.accountId) ||
            this.metaValue.selection == "Xin nghỉ không lương" ||
            (this.metaValue.selection == "cap-bao-ho-lao-dong" &&
              newRequest.slug != "xac-nhan-cong" &&
              newRequest.slug != "xin-ra-cong") ||
            newRequest.slug == "sua-chua"
          ) {
            let payload7 = {
              slug: this.order.slug,
              accountId: 101678,
              timeRequest: moment().format("l"),
            };
            let dataCheckTBP7 = await this.checkPermissionAuthorised(payload7);
            console.log("ủy quyền TGĐ", dataCheckTBP7.data.data[0]);
            console.log("ban TGĐ Hàn");
            if (dataCheckTBP7.data.data.length > 0) {
              newRequest = await {
                ...newRequest,
                parentId: newRequest.id,
                id: uid(),
                accountIdAuthorised:
                  dataCheckTBP7.data.data[0].accountIdAuthorised,
                timeStartAuthorised:
                  dataCheckTBP7.data.data[0].timeStartAuthority,
                timeEndAuthorised: dataCheckTBP7.data.data[0].timeEndAuthority,
                timeAuthorityActive: null,
                star: 7,
                accountId: 101678,
                position: "Ban TGĐ",
                isAuthority: true,
                show: false,
                step: null,
                uyQuyen: this.metaValue.uyQuyen,
              };
              await newRequests.push(newRequest);
            } else {
              newRequest = await {
                ...newRequest,
                parentId: newRequest.id,
                id: uid(),
                star: 7,
                show: false,
                step: null,
                accountId: 101678,
                position: "Ban TGĐ",
                isAuthority: false,
                uyQuyen: this.metaValue.uyQuyen,
              };
              await newRequests.push(newRequest);
            }
          }
        }
        // Đỗ Thị Bạch Tuyết
        if (
          this.metaValue.selection == "Nghỉ phép" &&
          newRequest.position == "Ban TGĐ" &&
          (this.order.departmentId == 100000 ||
            this.order.departmentId == 102293 ||
            this.order.departmentId == 102304 ||
            this.order.departmentId == 102320 ||
            this.order.departmentId == 102339 ||
            this.order.departmentId == 102340 ||
            this.order.departmentId == 102366 ||
            this.order.departmentId == 102397 ||
            this.order.departmentId == 102427 ||
            this.order.departmentId == 102482)
        ) {
          newRequest.accountId = 101687;
        }
        // Trần Thị Thu Hàn
        if (
          this.metaValue.selection == "Nghỉ phép" &&
          newRequest.position == "Ban TGĐ" &&
          (this.order.departmentId == 102396 ||
            this.order.departmentId == 102451 ||
            this.order.departmentId == 102498 ||
            this.order.departmentId == 102531 ||
            this.order.departmentId == 102533 ||
            this.order.departmentId == 102612 ||
            this.order.departmentId == 102317 ||
            this.order.departmentId == 102318 ||
            this.order.departmentId == 102319 ||
            this.order.departmentId == 102394 ||
            this.order.departmentId == 102398)
        ) {
          newRequest.accountId = 101678;
        }
        // nguyễn thị phượng
        if (
          this.metaValue.selection == "Nghỉ phép" &&
          newRequest.position == "Ban TGĐ" &&
          (this.order.departmentId == 102423 ||
            this.order.departmentId == 102424 ||
            this.order.departmentId == 102425 ||
            this.order.departmentId == 102426 ||
            this.order.departmentId == 102435)
        ) {
          newRequest.accountId = 101691;
        }
        if (
          this.metaValue.selection == "Nghỉ phép" &&
          newRequest.position == "Ban TGĐ" &&
          this.order.departmentId == 102528
        ) {
          newRequest.accountId = 101914;
        }
        //Chữ ký Ban lãnh đạo

        // hàm sắp tăng dần theo phân cấp -- created by : HTHIEU(27/11/2020)
        newRequests.sort(this.compareValues("star", "asc"));
        let a = null;

        //hàm xử lý hiển thị cho người cấp thấp nhất
        for (let i = 0; i < newRequests.length; i++) {
          console.log(newRequests);
          if (i == 0) {
            newRequests[i].show = true;
            newRequests[i].step = i;
          } else newRequests[i].step = i;
        }
        console.log("newRequests", newRequests);
        newRequests.forEach((e) => {});
        this.requests = newRequests;
      }
    },
    // hàm sắp xếp động -- created by : HTHIEU(27/11/2020)
    compareValues(key, order = "asc") {
      return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // nếu không tồn tại
          return 0;
        }
        const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order == "desc" ? comparison * -1 : comparison;
      };
    },
    async promptToApproved() {
      // this.$q
      //   .dialog({
      //     title: "Xác nhận",
      //     message: "Bạn muốn gửi phê duyệt?",
      //     ok: {
      //       push: true
      //     },
      //     cancel: {
      //       color: "red"
      //     },
      //     persistent: true
      //   })
      //   .onOk(async () => {
      await this.taoDSKy();
      await this.sendToApproved(this.requests);
      console.log("this.requests", this.requests);
      if (
        (this.requests[0].position == "Ban TGĐ" &&
        this.requests[0].slug == "xin-nghi-viec") || (
          this.requests[0].position == "Trưởng phòng" &&
          this.requests[0].slug == "mua-hang"
        )
      ) {
        this.request.id = this.requests[0].id;
        await this.completedRequest({ request: this.request });
      }
      let payload = {
        notification: {
          title: "Thank for sub",
          body: "firebase cloud",
          icon: "https://cdn.quasar.dev/img/boy-avatar.png",
        },
      };
      let dataTokenFCM;
      // check người gửi đầu tiên để bắn notification -  createdby : HTHIEU(2021-01-22)
      await this.requests.forEach(async (e) => {
        if (e.show == 1) {
          let payload10 = {
            accountId: e.accountId,
          };
          let departmentName = await this.GET_DEPARTMENTSBYID(e.departmentId);
          dataTokenFCM = await this.getTokenFCM(payload10);
          console.log("dataTokenFCM", dataTokenFCM);
          await dataTokenFCM.data.data.forEach(async (element) => {
            console.log("dghasdasd");
            if (element.tokenFCM != "undefined") {
              let baseUrl = null;
              if (process.env.PROD) {
                baseUrl = `https://app.woodsland.com.vn:1001/#/yeu-cau-duyet?id=${e.id}`;
              } else {
                baseUrl = `http://localhost:8080/#/yeu-cau-duyet?id=${e.id}`;
              }
              let dataSendFCM = await this.$sendFcm(
                `Có phiếu gửi tới ${this.getAccountById(e.accountId).lastName}`,
                `${e.title} - người gửi : ${
                  this.getAccountById(e.fromAccountId).lastName
                } - mã NV : ${
                  this.getAccountById(e.fromAccountId).account
                } - phòng ban : ${departmentName.NAME}`,
                e.id,
                payload,
                element.tokenFCM
              );
              let payloadFCM = {
                // lưu thông tin gửi thông báo FCM
                email: "null",
                baseUrl: baseUrl,
                accountId: this.userInfo.id,
                toAccountId: this.getAccountById(e.accountId).id,
                tokenFCM: element.tokenFCM,
                messageId: dataSendFCM.data.results[0].message_id,
                dataBody: `Có phiếu gửi tới ${
                  this.getAccountById(e.accountId).lastName
                } - ${e.title} - người gửi : ${
                  this.getAccountById(e.fromAccountId).lastName
                } - mã NV : ${
                  this.getAccountById(e.fromAccountId).account
                } - phòng ban : ${departmentName.NAME}`,
              };
              await this.sendNotificationMail(payloadFCM); //lưu thông tin FCM
            }
          });
          let baseUrl = null;
          let dataProfile = await this.getAccountByID(e.accountId);
          console.log("dataProfile", dataProfile);
          if (dataProfile.notificationMail == 1) {
            // check nếu người nhận phiếu bật thông báo qua mail
            if (process.env.PROD) {
              baseUrl = `https://app.woodsland.com.vn:1001/#/yeu-cau-duyet?id=${e.id}`;
            } else {
              baseUrl = `http://localhost:8080/#/yeu-cau-duyet?id=${e.id}`;
            }
            let payloadMail = {
              baseUrl: baseUrl,
              email: dataProfile.EMAIL,
              accountId: this.userInfo.id,
              toAccountId: this.getAccountById(e.accountId).id,
              subject: "Có đề xuất cần phê duyệt",
              title: "Nhấp vào đây để đi tới xét duyệt",
              dataBody: `Có phiếu gửi tới ${
                this.getAccountById(e.accountId).lastName
              } - ${e.title} - người gửi : ${
                this.getAccountById(e.fromAccountId).lastName
              } - mã NV : ${
                this.getAccountById(e.fromAccountId).account
              } - phòng ban : ${departmentName.NAME}`,
            };
            await this.sendNotificationMail(payloadMail); //gửi thông báo mail
          }
        }
      });
    },
    async loadDSKy() {
      let requests = await [...this.order.Requests];
      this.requests = requests;
    },
  },
  mounted() {
    this.loadDSKy();
  },
};
</script>
