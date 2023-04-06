import apiConfig from "../../configs/api";
import axios from "axios";
import { getRequest, postRequest, putRequest } from "../../utils/utils";
import { Notify } from "quasar";
import { bienban } from "../../configs/constants";


export function ACTION_SELECT_SOURCE({ commit }, source) {
    commit("SELECT_SOURCE", source);
}
//chon chuc nang
export async function getHistoryPackage2({ commit }, payload) {
    let res = await getRequest("/api/v2/packages/historyPackage2?stepId=" + payload.stepId + 
    "&verifyBy=" + payload.verifyBy +
    "&from="+ payload.fromDate +
    "&to="+ payload.toDate
    );
    return res.data.data;
}
export async function LOGIN({ commit, getters }, userReq) {
    commit("REQUEST_PENDING");
    let data = await postRequest(apiConfig.AUTHENTICATION, userReq);
    if (data) {
        const user = data.data.data;
        localStorage.setItem("user_info", JSON.stringify(user));
        let last_login = new Date().toISOString().slice(0, 10);
        localStorage.setItem("last_login", last_login);
        commit("REQUEST_DONE");
        commit("AUTH_SUCCESS_INIT", {
            user,
            getters
        });
        commit("AUTH_SUCCESS", {
            user,
            getters
        }); //AUTH_SUCCESS_INIT
    } else {
        commit("REQUEST_DONE");
        localStorage.removeItem("user_info");
    }
}
export function ACTION_LOGOUT({ commit }) {
    commit("LOGOUT");
}
export async function ACTION_GET_PALLET_IN_LINE({ commit }, params) {
    commit("REQUEST_PENDING");
    let res = await getRequest(
        apiConfig.PALLETS_IN_LINE + params.sourceId + "/not-out"
    );
    commit("FETCH_PALLETS_IN_LINE", res.data.data.pallet);
    commit("REQUEST_DONE");
    return res.data.data;
}
// lấy thông tin chi tiết của pallet và chọn luôn pallet đó
export async function ACTION_GET_DETAIL_PALLET({ commit }, params) {
    let url = apiConfig.DETAIL_PALLET + params.palletCode;
    const data = await getRequest(url);
    commit("FETCH_PALLET_DETAIL", data.data.data);
    return data.data;
}
//item
export async function ACTION_FETCH_ITEMS({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_ALL_ITEMS + "?factoryId=" + payload.factoryId
    );
    commit("FETCH_ALL_ITEM", res.data.data);
    return res.data.data;
}
export async function ITEMS_CAP_GO({ commit }, payload) {
    let res = await getRequest(
        "/api/v2/dinh-muc-phoi"  + "/qc-cap-pcd?factoryId=" + payload.factoryId
        + "&number="+ payload.number
    );
   
    return res.data.data;
}
export async function ITEMS_NHAP_TON({ commit }, payload) {
    let res = await getRequest(
        "/api/v2/dinh-muc-phoi"  + "/items-nhap-ton?factoryId=" + payload.factoryId
        + "&department="+ payload.department
    );
   
    return res.data.data;
}
export async function PALLET_FULL_TOP({ commit }, payload) {
    let res = await getRequest(
        "/api/v2/dinh-muc-phoi"  + "/palet-full-top?maket=" + payload.maket
    );
   
    return res.data.data;
}
export async function GET_GO_LUA_PHOI_ID({ commit }, payload) {
    const res = await getRequest(
        "/api/v2/dinh-muc-kho" +
        "/nhan-go?stepId=" + payload.stepId +
        "&height="+ payload.height +
        "&width="+ payload.width +
        "&length="+ payload.length +
        "&ID="+ payload.ID

    );
    return res.data;
}

export async function UPDATE_GO_LUA_PHOI({ commit }, payload) {
    const res = await putRequest(
        "/api/v2/dinh-muc-kho/go-lua-phoi", payload
    );
    return res.data;
}
export async function UPDATE_GO_LUA_PHOI_BAO({ commit }, payload) {
    const res = await putRequest(
        "/api/v2/dinh-muc-kho/go-lua-phoi-bao", payload
    );
    return res.data;
}

export async function GET_GO_LUA_PHOI_RECEIPT({ commit }, payload) {
    const res = await getRequest(
        "/api/v2/dinh-muc-kho" +
        "/go-lua-phoi?stepId=" +
        payload.stepId
    );
    return res.data;
}
export async function GET_GO_LUA_PHOI_RECEIPT_BAO({ commit }, payload) {
    const res = await getRequest(
        "/api/v2/dinh-muc-kho" +
        "/go-lua-phoi-bao?stepId=" +
        payload.stepId
    );
    return res.data;
}
export async function SP_VANITY({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_ALL_ITEMS + "/sanpham"
    );
    // commit("FETCH_ALL_ITEM", res.data);
    return res.data;
}
export async function ACTION_FETCH_ITEMS_STOCK({ commit }, payload) {
    let res = await getRequest(`/api/v2//dinh-muc-phoi/items-stock?number=${payload.group}`);
    return res;
}
export async function ACTION_FETCH_ITEMS_PACKAGE({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_ALL_ITEMS + "/package"
    );
    return res.data;
}
export async function ACTION_FETCH_ITEMS_BY_TYPE({ commit }, typeid) {
    let res = await getRequest(apiConfig.GET_ITEM + "?typeId=" + typeid);
    commit("FETCH_ALL_ITEM", res.data.data);
    return res.data.data;
}
export async function GET_ITEMS({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_ITEM +
        "?factoryId=" +
        payload.factoryId +
        "&typeId=" +
        payload.typeId
    );
    commit("FETCH_ALL_ITEM", res.data.data);
    return res.data.data;
}

export async function getItems({ commit }) {
    let res = await getRequest("/api/v2/dinh-muc-phoi//all");
    return res.data;
}

//Chọn qui cách tinh
export function ACTION_CHOOSE_ITEM({ commit }, item) {
    commit("CHOOSE_ITEM", item);
}
//xóa qui cách tinh đã chọn
export function ACTION_REMOVE_ITEM({ commit }) {
    commit("REMOVE_ITEM");
}
//update qty item chooose when input qty
export function ACTION_UPDATE_QTY({ commit }, payload) {
    commit("UPDATE_QTY_ITEM", payload);
}
//lấy loại package
export async function ACTION_GET_PACKAGE_TYPE({ commit }) {
    let data = await getRequest(apiConfig.GET_PACKAGE_TYPE);
    commit("FETCH_PACKAGE_TYPE", data.data.data);
    return data.data;
}
export function ACTION_LOAD_DONE_CREATE_PALLET({ commit }) {
    commit("LOAD_DONE_CREATE_PALLET");
}
export function ACTION_LOAD_DONE_CREATE_PALLET_INIT({ commit }) {
    commit("LOAD_DONE_INIT");
}
//fetch data woods
export async function ACTION_FETCH_WOOD_ITEMS({ commit }, factoryId) {
    let data = await getRequest(
        apiConfig.GET_ONLY_WOODS_ITEMS + "?factoryId=" + factoryId
    );
    commit("FETCH_WOODS_ITEM_ONLY", data.data.data);
    return data.data;
}
export function MERGE_ITEMS_WITH_WOODS({ commit }) {
    commit("PUSH_ITEMS");
}
export function ACTION_LOAD_XEP_SAY_DONE({ commit }, status) {
    commit("CHANGE_XEP_SAY_DONE", status);
}
//select loai pallet xep say
export function ACTION_SELECT_TYPE_IN_OUT({ commit }, type) {
    commit("CHANGE_TYPE_PALLET_XEP_SAY", type);
}

//add wood in array woodsSelected
export function ACTION_CHOOSE_WOODS({ commit }, wood) {
    commit("ADD_WOODS_SELECT", wood);
}
//remove wood from woodsSelected
export function ACTION_REMOVE_WOOD({ commit }, wood) {
    commit("REMOVE_WOOD", wood);
}
//remove all woodsSelected
export function ACTION_REMOVE_ALL_WOOD({ commit }) {
    commit("REMOVE_ALL_WOODSELECTED");
}

//call request create pallet
export function ACTION_CREATE_PALLET({ commit }, body) {
    commit("REQUEST_PENDING");
    return new Promise((reslove, reject) => {
        const url = apiConfig.POST_CREATE_PALLET;
        axios
            .post(url, body)
            .then(res => {
                commit("REQUEST_DONE");
                reslove(res.data);
            })
            .catch(err => {
                commit("REQUEST_DONE");
                reslove(err.response.data);
            });
    });
}
export const getTonGoTuoi = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/ton-go-tuoi?stepId=${payload.stepId}&end=${payload.toDate} 23:59
        &makho=${payload.makho}&factoryId=${payload.factoryId}&ngay=${payload.ngay}`
    );

    return data;
};

export const getTonSayLai = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/ton-say-lai?factoryId=${payload.factoryId}`
    );

    return data;
};

export const getMaLoGoByCC = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/ma-lo-go-by-cc?dai=${payload.dai}&rong=${payload.rong}&day=${payload.day}`
    );

    return data;
};
//chon 1 qui cach tho
export function ACTION_SELECT_ONE_MATERIAL({ commit }, material) {
    commit("SELECT_MATERIAL", material);
}
export function ACTION_REMOVE_MATERIAL_SELECTED({ commit }) {
    commit("REMOVE_MATERIAL_SELECTED");
}
export function ACTION_UPDATE_MATERIAL_QTY({ commit }, payload) {
    commit("UPDATE_QTY_MATERIAL", payload);
}
// chọn pallet
export function ACTION_CHOOSE_PALLET({ commit }, pallet) {
    commit("", pallet);
}
//lấy keo hóa chất
export async function ACTION_GET_SUPPLIES({ commit }, token) {
    let data = await getRequest(apiConfig.GET_SUPPILES);
    commit("FETCH_SUPPLIES", data.data.data);
    return data.data.data;
}
//lấy thông tin nhà cung cấp
export async function ACTION_GET_PROVIDERS({ commit }) {
    let res = await getRequest(apiConfig.GET_PROVIDERS);
    commit("FETCH_PROVIDERS", res.data.data);
    return res.data.data;
}
// lấy thông tin số lô
export async function ACTION_GET_PARCELS({ commit }) {
    let res = await getRequest(apiConfig.GET_PARCELS);
    commit("FETCH_PARCELS", res.data.data);
    return res.data.data;
}
//thêm thông tin lô, keo hóa chất vào pallet vag công đoạn
export function ACTION_ADD_SUPPLIES_TO_PALLET({ commit }, payload) {
    const url =
        apiConfig.POST_ADD_SUPPLIES_TO_PL + "/" + payload.palletCode + "/supplies";
    const data = {
        suppliesId: payload.suppliesId,
        stepOfPalletId: payload.stepOfPalletId,
        quantity: payload.quantity || 1,
        parcel: payload.parcelCode,
        vendorId: payload.vendorId,
        token: payload.token
    };
    return new Promise((resolve, reject) => {
        axios
            .post(url, data)
            .then(res => {
                if (res.data.meta.success === true) {
                    Notify.create({
                        message: "Thêm thành công !",
                        color: "cyan"
                    });
                    resolve(res.data.data);
                } else {
                    Notify.create({
                        message: res.data.meta.messages.message,
                        color: "red"
                    });
                    reject(res.data.meta.messages.message);
                }
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
//lấy danh sachs pallêt đang chờ nhận
export async function ACTION_FETCH_PALLET_WAIT_RECIVE({ commit }, params) {
    let res = await getRequest(
        apiConfig.GET_PALLET_WAIT_RECIVE + params.stepId + "/in-not-verify"
    );
    commit("FETCH_PALLET_WAIT_RECIVE", res.data.data.pallet);
    return res.data;
}
// lấy danh sách pallet đã xuất nhưng chưa nhận
export function ACTION_FETCH_PALLET_OUT_STOCK({ commit }, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                apiConfig.GET_PALLET_WAIT_RECIVE +
                params.sourceId +
                "/out-not-verify?token=" +
                params.token
            )
            .then(res => {
                if (res.data.meta.success === true) {
                    commit("FETCH_PALLET_OUT_STOCK", res.data.data.pallet);
                    resolve(res.data.data.pallet);
                } else {
                    reject(res.data.meta.messages.message || "*&@^!&*^*!");
                }
            });
    }).catch(err => {
        console.log(err);
    });
}
// nhận pallet về công đoạn
export function ACTION_RECIVED_PALLET({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_RECIVED_PALLET + payload.packageId + "/verify", {
                token: payload.token
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
export function ACTION_STEP_PALLET({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(
                apiConfig.POST_STEP_PALLET + payload.palletCode + "/move",
                payload.data
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}

// lấy thông tin các mẻ sấy(kế hoạch sấy)
export async function ACTION_GET_BATCH({ commit }, payload) {
    let data = await getRequest(apiConfig.GET_BATCHS + payload.queryGetBatch);
    if (data.data.data) {
        let params = {
            batchs: data.data.data,
            factoryId: payload.factoryId
        };
        commit("GET_BATCH", params);
    }
    return data.data;
}
//chọn mẻ sấy
export function ACTION_SELECT_BATCH({ commit }, batch) {
    commit("SELECT_BATCH", batch);
}
// lấy danh sách lò sấy
export async function ACTION_GET_KILNS({ commit }, payload) {
    let res = await getRequest(apiConfig.GET_KILNS);
    let params = {
        kilns: res.data.data,
        factoryId: payload.factoryId
    };
    commit("FETCH_KILNS", params);
    return res.data.data;
}
export async function ACTION_GET_RANGES_BATCH({ commit }) {
    let res = await getRequest(apiConfig.GET_RANGES_BATCH);
    commit("FETCH_RANGES", res.data.data);
    return res.data.data;
}
// TẠO MẺ SẤY
export function ACTION_CREATE_BATCH({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(
                apiConfig.POST_CREATE_BATCH + payload.kilnId + "/batch",
                payload.data
            )
            .then(res => {
                if (res.data.meta.success === true) {
                    Notify.create({
                        message: "Tạo kế hoạch sấy thành công !",
                        color: "green"
                    });
                    resolve(res.data);
                } else {
                    Notify.create({
                        message: res.data.meta.messages.message,
                        color: "red"
                    });
                    reject(res.data);
                }
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
//LẤY TỒN QC
export function ACTION_GET_INVENTORY_QC({ commit }, payload) {
    return new Promise((resolve, reject) => {
        const url = apiConfig.GET_TON_QC + "?stepId=" + payload.stepId;
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
//lấy danh sách biện pháp xử lý hàng lỗi
export function ACTION_GET_SOLUTION_QC({ commit }, token) {
    return new Promise((resolve, reject) => {
        axios
            .get(apiConfig.GET_SOLUTIONS_QC)
            .then(res => {
                commit("FETCH_SOLUTION_QC", res.data.data);
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}

export async function getListPallet({ commit }, payload) {
    let res = await getRequest(`api/v2/ballets/bao-cao-cho-say?factoryId=${payload.factoryId}&from=2021-03-01&to=2025-01-01`);
    return res.data.data;
}
export async function getListPalletcode({ commit }, payload) {
    let res = await getRequest(`api/v2/ballets/pallet-code?palletCode=${payload.palletCode}`);
    return res.data.data;
}
//xóa pallet
export async function reInBath({ commit }, payload) {
    const url = `${apiConfig.POST_CREATE_PALLET}/reInBath/${payload.code}`;
    await axios
        .delete(url)
}

// lấy ra danh sách hàng lỗi công đoạn  createdBy : HTHIEU(25/02/2021)
export async function getListPackage({ commit }, payload) {
    let res = await getRequest("api/v2/packages/listPackage?factoryId=" + payload.factoryId + "&DESTINATION_ID=" + payload.DESTINATION_ID);
    return res.data.data;
}
export async function getcongdoannhanloi({ commit }, payload) {
    let res = await getRequest("api/v2/packages/congdoannhanloi?factoryId=" + payload.factoryId + "&itemId=" + payload.itemId);
    return res.data.data;
}
// lấy ra danh sách hàng lỗi công đoạn  createdBy : HTHIEU(25/02/2021)
export async function listPackageRough({ commit }, payload) {
    let res = await getRequest("api/v2/packages/listPackageRough?factoryId=" + payload.factoryId + "&DESTINATION_ID=" + payload.DESTINATION_ID);
    return res.data.data;
}
export async function listPackageRough_temp({ commit }, payload) {
    let res = await getRequest("api/v2/packages/listPackageRough-temp?factoryId=" + payload.factoryId + "&DESTINATION_ID=" + payload.DESTINATION_ID);
    return res.data.data;
}
export async function listPackageRough_temp_pallet({ commit }, payload) {
    let res = await getRequest("api/v2/packages/listPackageRough-temp-pallet");
    return res.data.data;
}
export async function listPackageRough_temp_del({ commit }, payload) {
    let res = await getRequest("api/v2/packages/listPackageRough-temp-del?id=" + payload.id);
    return res.data.data;
}
export async function getLSXLuaPhoi({ commit }, payload) {
    let res = await getRequest(`api/v2/packages/lsx-lua-phoi?factoryId=${payload.factoryId}&year=${payload.year}&week=${payload.week}&departmentId=${payload.departmentId}
    `);
    return res.data.data;
}
export async function getQuyCachTinh({ commit }, payload) {
    let res = await getRequest(`api/v2/packages/quy-cach-tinh?number=${payload.number}&departmentId=${payload.departmentId}
    `);
    return res.data.data;
}
export async function getQuyCachTinh2({ commit }, payload) {
    let res = await getRequest(`api/v2/packages/quy-cach-tinh-2
    `);
    return res.data.data;
}
export async function getGoNguyenLieu({ commit }) {
    let res = await getRequest(`api/v2/packages/go-nguyen-lieu`);
    return res.data.data;
}
export async function ghiNhanLoiLuaPhoi({ commit }, payload) {
    let res = await postRequest(`api/v2/packages/ghi-nhan-loi-lua-phoi`, payload);
    return res.data;
}
export async function listPackageRough_temp_status({ commit }, payload) {
    let res = await getRequest("api/v2/packages/listPackageRough-temp-status?po=" + payload.po);
    return res.data.data;
}
// Xác nhận hàng lỗi createdBy : HTHIEU(25/02/2021)
export async function getActivePackage({ commit }, payload) {
    let res = await getRequest("/api/v2/packages/confirmPackage?id=" + payload.id + "&verifyBy=" + payload.verifyBy);
    return res.data.data;
}
export async function getActivePackagehuyloi({ commit }, payload) {
    let res = await getRequest("/api/v2/packages/confirmPackagehuyloi?id=" + payload.id + "&verifyBy=" + payload.verifyBy);
    return res.data.data;
}
export async function getActivePackage_create_by({ commit }, payload) {
    let res = await getRequest("/api/v2/packages/confirmPackage-create-by?id=" + payload.id + "&verifyBy=" + payload.verifyBy
    + "&CREATE_BY=" + payload.CREATE_BY+ "&CREATE_DATE=" + payload.CREATE_DATE);
    return res.data.data;
}
export async function getActivePackage_temp({ commit }, payload1) {
    let res = await getRequest("/api/v2/packages/confirmPackage-temp?id=" + payload1.id + "&verifyBy=" + payload1.verifyBy);
    return res.data.data;
}
export async function update_Package_dauvao({ commit }, payload2) {
    let res = await getRequest("/api/v2/packages/qc-dau-vao?id=" + payload2.id + "&PACKAGE_TEMP_ID=" + payload2.PACKAGE_TEMP_ID);
    return res.data.data;
}
export async function xacnhanqc1({ commit }, payload) {
    let res = await getRequest("/api/v2/packages/xac-nhan-qc1?ID=" + payload.ID + "&verifyBy=" + payload.verifyBy);
    return res.data.data;
}
export async function update_pallet_nhapkho({ commit }, payload2) {
    let res = await getRequest("/api/v2/packages/update-pallet-nhap-kho?id=" + payload2.id + "&PACKAGE_TEMP_ID=" + payload2.PACKAGE_TEMP_ID);
    return res.data.data;
}
export async function getActivePackage_temp_update({ commit }, payload1) {
    let res = await getRequest("/api/v2/packages/confirmPackage-temp-update?id=" + payload1.id + "&status=" + payload1.status+ "&verifyBy=" + payload1.verifyBy);
    return res.data.data;
}
export async function getActivePackage_update2({ commit }, payload1) {
    let res = await getRequest("/api/v2/packages/confirmPackage-update-2?id=" + payload1.id + "&status=" + payload1.status+ "&verifyBy=" + payload1.verifyBy);
    return res.data.data;
}
// Xác nhận hàng lỗi createdBy : HTHIEU(25/02/2021)
export async function getHistoryPackage({ commit }, payload) {
    let res = await getRequest("/api/v2/packages/historyPackage?DESTINATION_ID=" + payload.DESTINATION_ID + "&verifyBy=" + payload.verifyBy);
    return res.data.data;
}


export async function historyPackageRough({ commit }, payload) {
    let res = await getRequest("/api/v2/packages/historyPackageRough?DESTINATION_ID=" + payload.DESTINATION_ID + "&verifyBy=" + payload.verifyBy);
    return res.data.data;
}

export function ACTION_CREATE_PACKAGE({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_CREATE_PACKAGE, payload)
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

// QC Xác nhận mẻ sấy đạt chất lượng ra lò
export function ACTION_QC_CONFIRM_BATCH({ commit }, payload) {
    commit("REQUEST_PENDING");
    return new Promise((resolve, reject) => {
        axios
            .post(
                apiConfig.POST_QC_CONFIRM_BATCH + payload.batchId + "/verify",
                payload.data
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
        commit("REQUEST_DONE");
    });
}
export function ACTION_IN_BATCH({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_VAO_LO + payload.palletCode + "/move", payload.data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.log(err);
                reject(err.response);
            });
    });
}
// RA LÒ
export function ACTION_OUT_BATCH({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_RA_LO + payload.batchId + "/export", payload.data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
// RA LÒ say lai
export function ACTION_OUT_BATCH_SAYLAI({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_RA_LO + payload.batchId + "/export-say-lai", payload.data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
//topic fcm
export function ACTION_GET_SUBCRIBERS({ commit }, topics) {
    commit("GET_TOPICS", topics);
}
//lấy thông tin công đoạn xuất theo item
export async function ACTION_GET_DESTINATION_BY_ITEM({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_DES_BY_ITEM + payload.itemId + "/routing"
    );
    return res.data;
}
// đổi mật khẩu
export function ACTION_CHANGE_PASS({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .put(apiConfig.PUT_CHANGE_PASS, payload.data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
export function ACTION_CHANGE_PASS_UPDATE({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .put(apiConfig.PUT_CHANGE_PASS_UPDATE, payload.data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
export function ACTION_GET_IKEA_SEARCH({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .get(apiConfig.IKEA_SEARCH + payload.ikeaCode + "/decode")
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}
export function ACTION_CANCEL_IKEA({ commit }, payload) {
    commit("REQUEST_PENDING");
    return new Promise((resolve, reject) => {
        axios
            .delete(apiConfig.CANCEL_IKEA + payload.ikeaCode)
            .then(res => {
                commit("REQUEST_DONE");
                resolve(res.data);
            })
            .catch(err => {
                commit("REQUEST_DONE");
                resolve(err.response.data);
            });
    });
}
export async function GET_HE_SO_LSX({ commit }, payload) {
    const data = await getRequest(
        "/api/v2/packages/LSX?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId

    );
    return data.data;
}
export async function XUAT_VAT_TU({ commit }, payload) {
    const data = await getRequest(`/api/v2/production-order/xuat-vat-tu?number=${payload.number}`);
    return data.data;
}
export async function GET_MA_VAT_TU({ commit }, payload) {
    const data = await getRequest(`/api/v2/production-order/get-ma-vt`);
    return data.data;
}
export async function POST_NHAN_LOT_NO_XGB({ commit }, payload) {
    const data = await postRequest(
        apiConfig.POST_RECIVED_PALLET + payload.packageId + "/verify-xgb"
    );
    return data.data;
}
export async function updatePhieuYeuCauVTGDSX ({ commit }, payload){
    const { data } = await putRequest(
        `/api/v2/packages/update-phieu-yeu-cau-vt-gdsx`, payload
    )
    return data;
}

export const getPermissionInScreen = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/role-menu/permission/in/screen?path=${payload.path}&accountId=${payload.accountId}`
    );

    return data;
};

export const postPermissionInScreen = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/role-menu/permission/in/post-screen`,payload
    );

    return data;
};

export async function deleteEmMunThuKho ({ commit }, payload){
    const { data } = await putRequest(
        `/api/v2/dinh-muc-phoi/delete-ep-mun-thu-kho/${payload.id}`
    )
    return data;
}
//lấy lệnh sản xuất
export async function ACTION_LOAD_PROD_ORDERS({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_PROD_ORDERS + "?factoryId=" + payload.factoryId
    );
    return res.data;
}
export async function ACTION_LOAD_PROD_ORDERS_BY_FACTORY({ commit },
    factoryId
) {
    let res = await getRequest(
        apiConfig.GET_PROD_ORDERS + "?factoryId=" + factoryId
    );
    return res.data;
}

// lấy thông tin loại gỗ , accaia ....
export async function ACTION_LOAD_WOOD_TYPES({ commit }, type) {
    let data = await getRequest(apiConfig.GET_WOOD_TYPES + "?type=" + type);
    return data.data;
}

//tạo biên bản kiểm tra độ ẩm
export function ACTION_CREATE_BB_MC({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_CREATE_BB_MC, payload)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}
export async function XUAT_VT({ commit }, payload) {
    let data = await postRequest(
        `/api/v2/production-order/yeu-cau-xuat-vat-tu`, payload
    );
    return data.data;
}
export async function NHAP_TON_SON({ commit }, payload) {
    let data = await postRequest(
        `/api/v2/production-order/nhap-ton-son`, payload
    );
    return data.data;
}
// load biên bản kiểm tra độ ẩm theo mẻ sấy
export function ACTION_LOAD_BB_MC_BY_BATCHID({ commit }, batchId) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                apiConfig.GET_BB_MC_BY_BATCHID +
                batchId +
                "/" +
                bienban.BB_KIEM_TRA_DO_AM_LO_SAY
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}
export async function getItemInKilnBatch({ commit }, id) {
    let data = await getRequest(apiConfig.GET_BATCHS + "/itemInKilnBatch?plCode=" + id);
    return data.data;
}
// load biên bản kiểm tra khuyết tật theo mẻ sấy
export function ACTION_LOAD_BB_KT_BY_BATCHID({ commit }, batchId) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                apiConfig.GET_BB_KT_BY_BATCHID +
                batchId +
                "/" +
                bienban.BB_KHAO_SAT_KHUYET_TAT_LO_SAY
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}
// load biên bản kiểm tra cơ điện theo mẻ sấy
export function ACTION_LOAD_BB_CO_DIEN_BY_BATCHID({ commit }, batchId) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                apiConfig.GET_BB_KT_BY_BATCHID +
                batchId +
                "/" +
                bienban.BB_KIEM_TRA_LO_SAY
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}
//tạo biên bản kiểm tra độ ẩm
export function ACTION_CREATE_BB_KT({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_CREATE_BB_KT, payload)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}

//chọn biên bản độ ẩm để xem
export function ACTION_SELECT_BBMC({ commit }, bbmc) {
    commit("SELECT_BB_MC", bbmc);
}
//chọn biên bản khuyết tật để xem
export function ACTION_SELECT_BBKT({ commit }, bbmc) {
    commit("SELECT_BB_KT", bbmc);
}
//chọn biên bản Cơ điện để xem
export function ACTION_SELECT_BBCODIEN({ commit }, bb) {
    commit("SELECT_BB_CODIEN", bb);
}

// lấy thông tin lịch sử xuất hàng sang QC
export function ACTION_GET_QC_HISTORY_BY_STEPID({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                apiConfig.GET_QC_HISTORY_BY_STEP_ID +
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

// cập nhâth trangh thái của mẻ sấy
export function ACTION_KILN_BATCH_UPDATE_STATUS({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .put(
                apiConfig.PUT_STATUS_BATCH + payload.kilnBatchId + "/status",
                payload.data
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}
export async function CREATE_COC_DONG_GOI({ commit }, payload) {
    let data = await postRequest(apiConfig.CREATE_COC_DONG_GOI, payload);
    return data.data;
}
export async function GET_COC_BY_DATE({ commit }, currentDate) {
    let res = await getRequest(
        apiConfig.CREATE_COC_DONG_GOI + "?factoryId=100000"
    );
    return res.data;
}
export async function GET_PRODUCTS({ commit }) {
    let res = await getRequest(apiConfig.GET_PRODUCTS);
    commit("GET_PRODUCTS", res.data.data);
    return res.data;
}
export async function GET_COC_BY_ID({ commit }, id) {
    let res = await getRequest(apiConfig.CREATE_COC_DONG_GOI + "/" + id);
    return res.data;
}
export function SELECT_DCOC({ commit }, dcoc) {
    commit("SELECT_DCOC", dcoc);
}
export async function UPDATE_DCOC({ commit }, payload) {
    let data = await putRequest(
        apiConfig.CREATE_COC_DONG_GOI + "/" + payload.id,
        payload.data
    );
    return data.data;
}
export async function GET_WORKERS_FROM_TO({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_WORKERS +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&createBy=" +
        payload.createBy
    );
    return res.data;
}
export async function INSERT_WORK_TIME({ commit }, payload) {
    let data = await postRequest(apiConfig.GET_WORKERS, payload);
    return data.data;
}
export async function GET_TY_LE_SAN_XUAT({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_RATE_PLAN +
        "?departmentId=" +
        payload.departmentId +
        "&week=" +
        payload.week +
        "&year=" +
        payload.year
    );
    return res.data;
}
export async function GET_DETAI_PO({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_SAN_LUONG +
        "?code=" +
        payload.code +
        "&number=" +
        payload.number
    );
    return res.data;
}
export async function CONFIRM_END_PO({ commit }, payload) {
    console.log("payload", payload);
    let res = await putRequest(
        apiConfig.GET_SAN_LUONG + "/confirmEndPO", payload
    );
    return res.data;
}
export async function UNCOMFIRM_END_PO({ commit }, payload) {
    let res = await putRequest(
        apiConfig.GET_SAN_LUONG +
        "/unConfirmEndPO", payload
    );
    return res.data;
}
export async function DELETE_PO({ commit }, payload) {
    console.log("payload", payload);
    const data = await axios.delete(`/api/v2/san-luong/deletePODeep/${payload.number}/${payload.factoryId}`)
    return data.data;
}

export async function GET_PO({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_SAN_LUONG +
        "/getPO" +
        "?week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId +
        "&year=" + payload.year
    );
    return res.data;
}

export async function POST_SAN_LUONG({ commit }, payload) {
    const data = await postRequest(apiConfig.POST_CREATE_PACKAGE, payload);
    return data.data;
}

export async function addPackage({ commit }, payload) {
    const data = await postRequest("/api/v2/packages/ghi-nhan", payload);
    return data.data;
}
export async function GET_MA_PALLET({ commit }, payload) {
    const data = await postRequest("/api/v2/packages/ma-pallet", payload);
    return data.data;
}
export async function VIEW_TIN_TUC({ commit }, payload) {
    const data = await getRequest( "/api/v2/notify/viewtintuc" + "?accountId=" + payload.accountId + 
    "&start=" + payload.fromDate + "&end=" + payload.toDate,
    payload);
    return data.data;
}
export async function VIEW_TIN_TUC_TB({ commit }, payload1) {
    const data = await getRequest(
        `/api/v2/notify/viewtintuctb?accountId=${payload1.accountId}`
    );
    return data.data;
}
export async function VIEW_TIN_TUC_TB_MANAGER({ commit }, payload1) {
    const data = await getRequest(
        `/api/v2/notify/viewtintuctbManager?accountId=${payload1.accountId}`
    );
    return data.data;
}
export async function VIEW_PHONG_BAN({ commit }, payload) {
    const data = await getRequest(`/api/v2/notify/viewphongban?id=${payload.ID}&infoId=${payload.infoId}`);
    return data.data;
}
export async function UPDATE_FORM_TIN_TUC({ commit }, payload) {
    const data = await getRequest("/api/v2/notify/formid"+ "?accountId=" + payload.accountId +
    "&infoId=" + payload.infoId, payload);
    return data.data;
}
export async function UPDATE_FORM_TIN_TUC_CONFIRM({ commit }, payload) {
    const data = await getRequest("/api/v2/notify/confirm-formid"+ "?accountId=" + payload.accountId +
    "&infoId=" + payload.infoId, payload);
    return data.data;
}
export async function VIEW_FORM_TIN_TUC({ commit }, payload2) {
    const data = await getRequest("/api/v2/notify/viewformid"+ "?accountId=" + payload2.accountId +
    "&infoId=" + payload2.infoId, payload2);
    return data.data;
}
export async function addPackage1({ commit }, payload) {
    const data = await postRequest("/api/v2/packages/ghi-nhan-1", payload);
    return data.data;
}
export async function GET_LIST_SAN_LUONG({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_SAN_LUONG +
        `?year=${payload.year}&week=${payload.week}&stepId=${payload.stepId}&number=${payload.number}`
    );
    return res.data;
}
export async function GET_VAT_TU({ commit }, token) {
    const data = await getRequest(apiConfig.GET_SUPPILES);
    return data.data;
}
export async function GET_DETAIL_PACKAGE({ commit }, packageId) {
    const data = await getRequest(
        apiConfig.POST_CREATE_PACKAGE + "?packageId=" + packageId
    );
    return data.data;
}
export async function GET_NCC({ commit }) {
    const res = await getRequest(apiConfig.GET_PROVIDERS);
    return res.data;
}
export async function GET_LICH_SU_CONFIRM({ commit }, payload) {
    const res = await getRequest(
        apiConfig.POST_CREATE_PACKAGE +
        "/lich-su" +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&stepId=" +
        payload.stepId
    );
    return res.data;
}
export async function GET_LICH_SU_GHI_LOI({ commit }, payload) {
    const res = await getRequest(
        apiConfig.POST_CREATE_PACKAGE +
        "/lich-su-ghi-loi" +
        "?ID=" +
        payload.ID 
       
    );
    return res.data;
}

export async function GET_LOT_WAIT_RECEIPT({ commit }, payload) {
    const res = await getRequest(
        apiConfig.POST_CREATE_PACKAGE +
        "/cho-xac-nhan-phuong?stepId=" +
        payload.stepId
    );
    return res.data;
}
export async function GET_LOT_WAIT_LUA_DAT({ commit }, payload) {
    const res = await getRequest(
        apiConfig.POST_CREATE_PACKAGE +
        "/cho-xac-nhan-lua-dat?stepId=" +
        payload.stepId
    );
    return res.data;
}
export async function GET_LUA_DAT({ commit }, payload) {
    const res = await getRequest(
        apiConfig.POST_CREATE_PACKAGE +
        "/get-lua-dat?stepId=" +
        payload.stepId
    );
    return res.data;
}
export async function GET_XUAT_LUA_DAT({ commit }, payload) {
    const res = await getRequest(
        apiConfig.POST_CREATE_PACKAGE +
        "/get-xuat-lua-dat?stepId=" +
        payload.sourceId +
        "&from=" +
        payload.from +
        "&to=" +
        payload.to
    );
    return res.data;
}
export async function GET_XUAT_HA_CAP({ commit }, payload) {
    const res = await getRequest(
        apiConfig.POST_CREATE_PACKAGE +
        "/get-xuat-ha-cap?stepId=" +
        payload.sourceId +
        "&from=" +
        payload.from +
        "&to=" +
        payload.to
    );
    return res.data;
}
export async function GET_XAC_NHAN_QC({ commit }, payload) {
    const res = await getRequest(
        apiConfig.POST_CREATE_PACKAGE +
        "/get-xac-nhan-qc?stepId=" +
        payload.stepId +
        "&itemId=" +
        payload.itemId 
    );
    return res.data;
}
export async function GET_LOT_WAIT_RECEIPT2({ commit }, payload) {
    const res = await getRequest(
        apiConfig.POST_CREATE_PACKAGE + "/cho-xac-nhan2?stepId=" + payload.stepId
    );
    return res.data;
}

export async function GET_LOT_WAIT_RECEIPT_PHUONG({ commit }, payload) {
    const res = await getRequest(
        `/api/v2/packages/${payload.ID}/${payload.CREATE_BY}/san-luong-nhan-2`
    );
    return res.data;
}

//apiConfig.POST_RECIVED_PALLET+payload.packageId+'/verify'
export async function POST_NHAN_LOT_NO({ commit }, payload) {
    const data = await postRequest(
        apiConfig.POST_RECIVED_PALLET + payload.packageId + "/verify"
    );
    return data.data;
}

export async function PUT_SAN_LUONG_ID({ commit }, payload1) {
    const data = await postRequest(
        `/api/v2/packages/${payload1.ID}/${payload1.QUANTITY}/sua-san-luong3`
    );
    return data.data;
}

export async function POST_NHAN_LOT_NO2({ commit }, payload) {
    const data = await postRequest(
        apiConfig.POST_RECIVED_PALLET + payload.packageId + "/verify2",
        payload
    );
    return data.data;
}
export async function CAP_PHOI({ commit }, payload) {
    const data = await postRequest(
        apiConfig.GET_SAN_LUONG + "/cap-phoi",
        payload
    );
    console.log("dataCP", data);
    return data.data;
}
export async function INSERT_PACKAGE({ commit }, payload) {
    const data = await postRequest(
        apiConfig.GET_SAN_LUONG + "/insert-package",
        payload
    );
    console.log("dataCP", data);
    return data.data;
}
export async function INSERT_PACKAGE_TEMP({ commit }, payload) {
    const data = await postRequest(
        apiConfig.GET_SAN_LUONG + "/insert-package-temp",
        payload
    );
    console.log("dataCP", data);
    return data.data;
}
export async function INSERT_ITEM_IN_PACKAGE({ commit }, payload) {
    const data = await postRequest(
        apiConfig.GET_SAN_LUONG + "/insert-in-package",
        payload
    );
    console.log("dataCP", data);
    return data.data;
}

export async function INSERT_QC_LUA_DAT({ commit }, payload) {
    const data = await postRequest(
        apiConfig.GET_SAN_LUONG + "/insert-qc-lua-dat",
        payload
    );

    return data.data;
}
export async function INSERT_QC_DAU_VAO({ commit }, payload) {
    const data = await postRequest(
        apiConfig.GET_SAN_LUONG + "/insert-qc-dau-vao",
        payload
    );

    return data.data;
}
export async function INSERT_PALLET_NHAP_KHO({ commit }, payload) {
    const data = await postRequest(
        apiConfig.GET_SAN_LUONG + "/insert-pallet-nhap-kho",
        payload
    );

    return data.data;
}
export async function GET_COC({ commit }, payload) {
    const res = await getRequest(apiConfig.PO + "/" + payload.po + "/supplies");
    return res.data;
}
export async function ADD_COC({ commit }, payload) {
    const res = await postRequest(
        apiConfig.PO + "/" + payload.po + "/supplies",
        payload
    );
    return res.data;
}
export async function GET_QC_PACKAGE({ commit }, payload) {
    const res = await getRequest(
        apiConfig.GET_PALLET_WAIT_RECIVE + "/" + payload.stepId + "/import"
    );
    return res.data;
}
export async function COMPLETED_PO({ commit }, payload) {
    const res = await putRequest(apiConfig.PO + "/" + payload.po, payload);
    return res.data;
}

export async function GET_NUMBER_PO({ commit }, payload) {
    const res = await getRequest(
        apiConfig.PO + "/number?year=" + payload.year + "&week=" + payload.week
    );
    return res.data;
}
export async function GET_MARKET({ commit }, payload) {
    const res = await getRequest(apiConfig.MARKET);
    return res.data;
}
export async function NHAP_TON_DAU_KY({ commit }, payload) {
    const res = await postRequest(apiConfig.TON_DAU_KY, payload);
    return res.data;
}
export async function KL_TON_DAU_KY({ commit }, payload) {
    const res = await getRequest(apiConfig.TON_DAU_KY + "/ton?departmentId=" + payload.departmentId + "&itemId=" + payload.itemId + "&nguonPhoi=" + payload.nguonPhoi + "&luaPhoi=" + payload.luaPhoi+
    "&ngay=" + payload.ngay+"&day=" + payload.day+"&rong=" + payload.rong+"&dai=" + payload.dai);
    return res.data;
}
export async function KL_TON_CONG({ commit }, payload) {
    const res = await getRequest(apiConfig.TON_DAU_KY + "/toncong" + "?name=" + payload.Nameid, payload);
    return res.data;
}
export async function KL_TON_DAU_KY_PACKAGE({ commit }, payload) {
    const res = await getRequest(apiConfig.TON_DAU_KY + "/tonPackage?departmentId=" + payload.departmentId + "&itemId=" + payload.itemId + "&nguonPhoi=" + payload.nguonPhoi + "&marketCode=" + payload.marketCode);
    return res.data;
}
export async function ADD_KH({ commit }, payload) {
    const data = await postRequest("/api/v2/production-order", payload);
    return data.data;
}

export async function getAllTonDauKys({ commit }) {
    const { data } = await getRequest("/api/v2/ton-dau-ky");
    commit("setTonDauKys", data.data);
}
export async function getAlllichsucapphoi({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/lich-su-cap-phoi/${payload.stepId}/capphoi`
    );
    return data.data;
}
export async function getAllSanLuongs({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/packages/${payload.stepId}/xac-nhan-phoi`
    );
    commit("setSanLuongs", data);
}


export async function getAllChoNhans({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/packages/${payload.stepId}/phoi-cho-nhan`
    );
    commit("setSanLuongs", data);
}

export async function getAllGhiNhans({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/packages/${payload.stepId}/ghi-nhan-phoi`
    );
    commit("setSanLuongs", data);
}

export async function getAllGhiNhans1({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/packages/${payload.stepId}/ghi-nhan-phoi1?from=${payload.from}&to=${payload.to}`
    );
    commit("setSanLuongs", data);

}
export async function getAllGhiNhanpallet({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/packages/${payload.stepId}/ghi-nhan-pallet?from=${payload.from}&to=${payload.to}`
    );
    return data;

}

export async function getAllGhiNhanLoi({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/packages/${payload.stepId}/ghi-nhan-phoi-loi?from=${payload.from}&to=${payload.to}`
    );
    return data;

}

export async function getAllGhiNhanssanluong({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/packages/${payload.stepId}/ghi-nhan-SL?from=${payload.from}&to=${payload.to}`
    );
    commit("setSanLuongs", data);
    return data.data;
}

export async function getAllKeHoachSanXuatConLais({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.stepId}/ke-hoach-thuc-hien`
    );
    return data;
}
export async function getAllKeHoachSanXuatConLaislp({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.stepId}/ke-hoach-thuc-hien-lp`
    );
    return data;
}
export async function getNumberByStepId({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.stepId}/number-by-stepId`
    );
    return data;
}

export async function getItemGoTho({ commit },stepId) {
    const { data } = await getRequest(
        `/api/v2//dinh-muc-phoi/item-go-tho?DESTINATION_ID=${stepId}`
    );
        return data;
}

export async function getItemLoi({ commit }, stepId) {
    const { data } = await getRequest(
        `/api/v2/dinh-muc-phoi/item-loi?stepId=${stepId}`
    );
        return data;
}

export async function getItemInBom({ commit }) {
    const { data } = await getRequest(
        `/api/v2/dinh-muc-phoi/item-in-bom`
    );
        return data;
}
export async function getListPackageluadat({ commit }, payload) {
    let res = await getRequest("api/v2/packages/listPackageluadat?factoryId=" + payload.factoryId + "&DESTINATION_ID=" + payload.DESTINATION_ID);
    return res.data.data;
}
export async function getListPackagexuatluadat({ commit }, payload) {
    let res = await getRequest("api/v2/packages/listPackagexuatluadat?factoryId=" + payload.factoryId + "&sourceId=" + payload.sourceId
    + "&to=" + payload.to+ "&from=" + payload.from);
    return res.data.data;
}
export async function getActivePackageluadat({ commit }, payload) {
    let res = await getRequest("/api/v2/packages/confirmPackageluadat?id=" + payload.id + "&verifyBy=" + payload.verifyBy);
    return res.data.data;
}

export async function insertLuaHaCap({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/dinh-muc-phoi/lua-ha-cap`, payload
    );
        return data;
}

export async function getDepartmentVGT({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2//dinh-muc-phoi/department-vgt`
    );
        return data;
}

export async function getTonGoTho({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/production-order/ton-go-tho`,payload
    );
    return data;
}
export async function getKeHoachGoTho({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/production-order/ton-go-tho-ke-hoach`,payload
    );
    return data;
}
export async function insertXuatGoBao({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/production-order/xuat-go-bao`,payload
    );
    return "OK";
}
export async function DELETE_PHOI_IN_PACKAGE({ commit }, payload) {
    const res = await postRequest(
        `/api/v2/packages/delete-phoi-in-package`, payload
    );
    return res.data;
}
export async function UPDATE_STATUS_XUAT_GO_BAO({ commit }, payload) {
    const res = await putRequest(
        `/api/v2/packages/update-status-go-bao`, payload
    );
    return res.data;
}
export async function GET_NHAN_GO_BAO_CAT({ commit }, payload) {
    const res = await putRequest(
        `/api/v2/packages/nhan-go-bao-cat`, payload
    );
    return res.data;
}
export async function GET_NHAN_GO_TH({ commit }, payload) {
    const res = await putRequest(
        `/api/v2/packages/nhan-go-th`, payload
    );
    return res.data;
}
export async function getTraLaiGoTho({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/production-order/ton-go-tho-tra-lai`,payload
    );
    return data;
}
export async function deleteGoThoTraLai({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/production-order/delete-go-tho-tra-lai`,payload
    );
    return data;
}
export async function insertXuatGoCatHaCap({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/production-order/xuat-go-cat-ha-cap`,payload
    );
    return data;
}
export async function getAllsanphamnhan({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/production-order/nhan-phoi-nhieu-lenh`,payload
    );
    return data;
}

export async function getAllsanpham({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.stepId}/san-pham`
    );
   // commit("setPos", data);
    return data;
}
export async function getAllsanphamlp({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.stepId}/san-pham-lp`
    );
   // commit("setPos", data);
    return data;
}
export async function getlenhsx({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/production-order/100000/san-xuat`,
        payload
    );
    return data;
}
export async function getPoByCode({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.code1}/thuc-hien`
    );
    return data;
}


// export async function getAllLsx({ commit }, payload) {
//     const { data } = await getRequest(
//         `/api/v2/production-order/number-steps`
//     );
//     return data;
// }
export async function getPoByCode1({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.code}/thuc-hien`
    );
    return data;
}

export async function getAllNumbers({ commit }) {
    const { data } = await getRequest(`/api/v2/production-order/lenh-san-xuat`);
    console.log(data);
    return data;
}

export async function getAllNumbersByStepId({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.stepId}/lenh-san-xuat`
    );
    console.log(data);
    return data;
}

export async function getCDThucHienKeHoachLSX({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.number}/${payload.stepId}/thuc-hien`
    );
    console.log(data);
    return data;
}

export async function getTonTaiTo({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.stepId}/ton-tai-to`
    );
    commit("setTonTaiTos", data)
    return data;
}

export async function getDinhMucs({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.stepId}/${payload.item}/dinh-muc?factoryId=${payload.factoryId}`
    );
    await commit("setDinhMucs", data);
    return data;
}

export async function getTyLeTHs({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.stepId}/ty-le-thuc-hien`
    );
    await commit("setTyLeTHs", data);
}

export async function getPhoiNhapVe({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.stepId}/nhan-phoi-nhap-ve`
    );
    return data;
}

export async function putPhoiNhapVe({ commit }, payload) {
    const { data } = await putPhoiNhapVe(
        `/api/v2/production-order/${payload.stepId}/nhan-phoi-nhap-ve`
    );
    return data;
}

export async function handleQc({ commit },payload){
    const { data } = await postRequest(
        `/api/v2/handleQc`,payload
    )
    return data;
}

export async function getCodeInDoiTra ({ commit }){
    const { data } = await getRequest(
        `/api/v2/packages/code-in-doi-tra`
    )
    return data;
}
export async function getkhachhang({ commit }, payload) {
    const res = await getRequest(
        `/api/v2/packages/khach-hang`
    );
    return res.data;
}
export async function getListCodeInDoiTra ({ commit }, payload){
    const { data } = await getRequest(
        `/api/v2/packages/list-code-doi-tra?start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59`
    )
    return data;
}

export async function getLSXVatTuByFactory ({ commit }, payload){
    const { data } = await getRequest(
        `/api/v2/packages/lsx-vat-tu-by-factory?factoryId=${payload.factoryId}&year=${payload.year}&week=${payload.week}`
    )
    return data;
}
export async function getSoLanCapVTByLSX ({ commit }, payload){
    const { data } = await getRequest(
        `/api/v2/packages/so-lan-cap-vt-by-lsx?number=${payload.number}`
    )
    return data;
}
export async function getPhieuCapVatTu ({ commit }, payload){
    const { data } = await getRequest(
        `/api/v2/packages/phieu-cap-vat-tu?number=${payload.number}&soLan=${payload.soLan}`
    )
    return data;
}
export async function updatePhieuYeuCauVT ({ commit }, payload){
    const { data } = await putRequest(
        `/api/v2/packages/update-phieu-yeu-cau-vt`, payload
    )
    return data;
}
export async function updatePhieuYeuCauVTVatTu ({ commit }, payload){
    const { data } = await putRequest(
        `/api/v2/packages/update-phieu-yeu-cau-vt-vat-tu`, payload
    )
    return data;
}

export async function getDoiTraByCode ({ commit }, payload){
    const { data } = await getRequest(
        `/api/v2/packages/doi-tra-by-code?code=${payload.code}`
    )
    return data;
}

export async function insertPhieuDoiTra ({ commit }, payload){
    const { data } = await postRequest(
        `/api/v2/packages/phieu-doi-tra`, payload
    )
    return data;
}

export async function deleteListDoiTra ({ commit }, payload){
    const { data } = await putRequest(
        `/api/v2/packages/delete-doi-tra?code=${payload.code}`
    )
    return data;
}

export async function updateQcDoiTraQC ({ commit }, payload){
    const { data } = await putRequest(
        `/api/v2/packages/update-qc-doi-tra`, payload
    )
    return data;
}

export async function updateQcDoiTraGDSX ({ commit }, payload){
    const { data } = await putRequest(
        `/api/v2/packages/update-gdsx-doi-tra`, payload
    )
    return data;
}

export async function getAllCustomer ({ commit }){
    const { data } = await getRequest(
        `/api/v2/dinh-muc-phoi/customer-all`
    )
    return data;
}
export async function getNumberEpMun ({ commit }, payload){
    const { data } = await getRequest(
        `/api/v2/dinh-muc-phoi/ep-mun-number?code=${payload.code}`
    )
    return data;
}
export async function getCodeInWeekEpMun ({ commit }, payload){
    const { data } = await getRequest(
        `/api/v2/dinh-muc-phoi/code-in-week-ep-mun?week=${payload.week}`
    )
    return data;
}
export async function getEpMunDetail ({ commit }, payload){
    const { data } = await getRequest(
        `/api/v2/dinh-muc-phoi/ep-mun-detail?code=${payload.code}&number=${payload.number}`
    )
    return data;
}
export async function insertEpMun ({ commit }, payload){
    const { data } = await postRequest(
        `/api/v2/dinh-muc-phoi/ep-mun`, payload
    )
    return data;
}
export async function updateEpMunThuKho ({ commit }, payload){
    const { data } = await postRequest(
        `/api/v2/dinh-muc-phoi/ep-mun-thu-kho`, payload
    )
    return data;
}