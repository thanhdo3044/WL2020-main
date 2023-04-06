import {
    postRequest,
    putRequest,
    delRequest,
    getRequest
} from "../../utils/utils";
export async function getAllLenhSanXuats({ commit }) {
    const { data } = await getRequest("/api/v2/production-order/lenh-san-xuat");
    commit("setLenhSanXuats", data);
}
export async function getLenhSanXuatChiTiets({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.number}/ke-hoach-chi-tiet`
    );
    commit("setKeHoachSanXuats", data);
}

export async function getLenhSanXuatCapPhois({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.factoryId}/ke-hoach-san-xuat-cong-doan`
    );
    commit("setKeHoachSanXuats", data);
}

export async function updatePo({ commit }, payload) {
    const { data } = await putRequest(
        `/api/v2/production-order/${payload.code}`,
        payload
    );
    return data;
}