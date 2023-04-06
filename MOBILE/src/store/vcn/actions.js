import apiConfig from "../../configs/api";
import axios from "axios";
import { getRequest, postRequest, putRequest } from "../../utils/utils";
import { Notify } from "quasar";
import { bienban } from "../../configs/constants";
export function ACTION_CREATE_PACKAGE_ERR_VCN({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post('/api/v2/vcn/createPackageErr', payload)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                Notify.create({
                    message: err.response,
                    color: "red"
                });
                reject(err.response);
            });
    });
}
export async function POST_NHAN_LOT_NO_VCN({ commit }, payload) {
    const data = await postRequest(
        "/api/v2/vcn/" + payload.packageId + "/verify"
    );
    return data.data;
}
export async function getAllGhiNhansVCN({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/vcn/${payload.stepId}/ghi-nhan-phoi1?from=${payload.from}&to=${payload.to}`
    );
    commit("setSanLuongs", data);

}
export async function getAllGhiNhanssanluongVCN({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/vcn/${payload.stepId}/ghi-nhan-SL?from=${payload.from}&to=${payload.to}`
    );
    return data.data;

}

export async function getCodeBylsx({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/vcn/code-by-lsx?number=${payload.number}&order=${payload.order}`
    );
    return data;

}

export async function getSLCoTheNhan({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/vcn/sl-co-the-nhan?number=${payload.number}&code=${payload.code}&stepId=${payload.stepId}&heSo=${payload.heSo}`
    );
    return data;

}

export async function getHeSoQuyDoiBySP({commit}, payload) {
    const {data} = await getRequest(`api/v2/vcn/he-so-quy-doi-by-sp?spTruocRong=${payload.spTruocRong}&spSauRong=${payload.spSauRong}`)
    return data
}

export async function GET_ITEMS_VCN({commit}) {
    const {data} = await getRequest(`api/v2/vcn/itemsVCN`)
    return data
}
export async function NHAP_TON_DAU_KY_VCN({commit}, payload) {
    const {data} = await postRequest(`api/v2/vcn/nhap-ton-dau-ky-vcn`, payload)
    return data
}

export async function loadAllDepartmentVCN({commit}) {
    const {data} = await getRequest(`api/v2/vcn/all-departments-vcn`)
    return data
}
export async function getItemChildInLSXVCN({commit}, payload) {
    const {data} = await getRequest(`api/v2/vcn/item-child-in-lsx-vcn?itemId=${payload.itemId}&number=${payload.number}`)
    return data
}
export async function updateNhanPhoiLoiVCN({commit}, payload) {
    const {data} = await putRequest(`api/v2/vcn/nhan-phoi-loi-vcn`, payload)
    return data
}

export async function getActivePackageVCN({ commit }, payload) {
    let res = await putRequest("/api/v2/vcn/confirmPackageErr?id=" + payload.id + "&verifyBy=" + payload.verifyBy);
    return res.data.data;
}
export function ACTION_GET_QC_HISTORY_BY_STEPID_VCN({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "/api/v2/vcn/" +
                payload.qcStepId +
                "/from/" +
                payload.stepId +
                "?itemId=" +
                payload.itemId
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}

export function ACTION_GET_SOLUTION_QC({ commit }, token) {
    return new Promise((resolve, reject) => {
        axios
            .get('/api/v2/vcn/remedies')
            .then(res => {
                commit("FETCH_SOLUTION_QC", res.data);
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
export async function ACTION_GET_PACKAGE_TYPE({ commit }) {
    let data = await getRequest('/api/v2/vcn/package-type');
    commit("FETCH_PACKAGE_TYPE", data.data);
    return data.data;
}

export function ACTION_GET_INVENTORY_QC_VCN({ commit }, payload) {
    return new Promise((resolve, reject) => {
        const url = "/api/v2/vcn/qc?stepId=" + payload.stepId;
        axios
            .get(url)
            .then(res => {
                commit("FETCH_INVENTORY_QC", res.data.data);
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
export function ACTION_SELECT_INVENTORY_QC({ commit }, inv) {
    commit("SELECT_INVENTORY_QC", inv);
}



export async function getAllKeHoachSanXuatConLaisVCN({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/VCN/${payload.stepId}/ke-hoach-thuc-hien`
    );
    commit("setPos", data);
}
export async function getNextStepVCN({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/VCN/${payload.order}/${payload.number}/${payload.itemId}/stepNext`
    );
    return data.data;
}
export async function getStepChuyenDoiVCN({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/VCN/PO/stepChuyenDoi?number=${payload.number}&stepId=${payload.stepId}`
    );
    return data.data;
}
export async function getItemSauDong({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/VCN/item-sau-dong?number=${payload.number}`
    );
    return data;
}
export async function getSlCoTheXuat({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/VCN/sl-co-the-xuat?code=${payload.code}&itemId=${payload.itemId}`
    );
    return data;
}


export async function createPackageVCN({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/VCN/ghi-nhan`, payload
    );
    return data.data;
}
export async function createPackageBTVCN({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/VCN/ghi-nhan-bt`, payload
    );
    return data.data;
}
export async function createPackageTempVCN({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/VCN/ghi-nhan-temp`, payload
    );
    return data;
}
export async function createPackageLoiVCN({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/VCN/ghi-nhan-loi`, payload
    );
    return data.data;
}
export async function getPoByCodeVCN({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/plans/${payload.code1}/thuc-hien/VCN`
    );
    return data;
}
export async function getListPackageVCN({ commit }, payload) {
    let res = await getRequest("api/v2/VCN/listPackage?factoryId=" + payload.factoryId + "&DESTINATION_ID=" + payload.DESTINATION_ID);
    return res.data.data;
}
export async function getHistoryPackageVCN({ commit }, payload) {
    let res = await getRequest("/api/v2/VCN/historyPackage?DESTINATION_ID=" + payload.DESTINATION_ID + "&verifyBy=" + payload.verifyBy);
    return res.data.data;
}
export async function GET_LOT_WAIT_RECEIPT_VCN({ commit }, payload) {
    const res = await getRequest(
        "api/v2/VCN/cho-xac-nhan?stepId=" +
        payload.stepId
    );
    return res.data;
}
export async function getActivePackage_temp_update_VCN({ commit }, payload1) {
    const res = await getRequest(
        "api/v2/VCN/confirmPackage-temp-update-vcn?id=" + payload1.id + "&status=" + payload1.status+ "&verifyBy=" + payload1.verifyBy);
    return res.data.data;
}
export async function listPackageRough_temp_vcn({ commit }, payload) {
    const res = await getRequest(
        "api/v2/VCN/listPackageRough-temp-vcn?factoryId=" + payload.factoryId + "&DESTINATION_ID=" + payload.DESTINATION_ID);
    return res.data;
}
export async function listPackageRough_temp_status_vcn({ commit }, payload1) {
    const res = await getRequest(
        "api/v2/VCN/listPackageRough-temp-status-vcn?po=" + payload1.po);
    return res.data;
}
export async function getSLChoNhan({ commit }, payload1) {
    const res = await getRequest(
        "api/v2/VCN/sl-cho-nhan?code=" + payload1.code);
    return res.data;
}
export async function listPackageRough_temp_del_vcn({ commit }, payload) {
    const res = await getRequest(
        "api/v2/VCN/listPackageRough-temp-del-vcn?id=" + payload.id);
    return res.data;
}
export async function addPackageVCN({ commit }, payload) {
    const res = await postRequest(
        "api/v2/VCN/ghi-nhan", payload);
    return res.data;
}
export async function GET_LOT_WAIT_RECEIPT_VCN_2({ commit }, payload) {
    const res = await getRequest(
        `/api/v2/VCN/${payload.stepId}/${payload.itemId}/${payload.CREATE_BY}/san-luong-nhan-2`
    );
    return res.data;
}
export async function getAllSanLuongsVCN({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/VCN/${payload.stepId}/xac-nhan-phoi`
    );
    commit("setSanLuongs", data);
}
export async function getPOByFactory({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/vcn/allNumberPOByFactory?factoryId=${payload.factoryId}&week=${payload.week}&year=${payload.year}`
    )
    return data
}
export async function CONFIRM_END_PO({ commit }, payload) {
    const { data } = await putRequest(
        `/api/v2/vcn/endPO`, payload
    )
    return data
}
export async function UNCOMFIRM_END_PO({ commit }, payload) {
    const { data } = await putRequest(
        `/api/v2/vcn/reOpenPO`, payload
    )
    return data
}
export async function DELETE_PO({ commit }, payload) {
    const { data } = await putRequest(
        `/api/v2/vcn/deleteDataPO`, payload
    )
    return data
}
export async function getFactory({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/departments`)
    return data.data

}
export async function getXuongByFactoryId({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/xuong-by-factory?factoryId=${payload.factoryId}`)
    return data.data

}