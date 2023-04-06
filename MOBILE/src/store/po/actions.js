import { getRequest, postRequest, putRequest } from "../../utils/utils";
import apiConfig from "../../configs/api";

export async function getAllPos({ commit }) {
    let data = await getRequest(apiConfig.P_POS);
    commit("setPos", data.data);
    return data.data;
}

export function resetPos({ commit }) {
    commit("resetPos");
}

export async function getPosByStepId({ commit }, payload) {
    console.log(payload);
    let data = await getRequest(
        `/api/v2/production-order/${payload.stepId}/lenh-san-xuat`
    );
    commit("setPos", data.data);
    return data.data;
}

export async function getPosByNumberAndStep({ commit }, payload) {
    console.log("getPosByNumberAndStep");
    let data = await getRequest(
        `/api/v2/khsx/${payload.number}/cap-phoi?stepId=${payload.stepId}`
    );
    commit("setPos", data.data);
    return data.data;
}

export async function getAllNguonPhoi({ commit }, payload) {
    let data = await getRequest(
        `/api/v2/production-order/${payload.code}/nguon-phoi`
    );
    return data.data;
}

export async function themTonKeHoach({ commit }, payload) {
    let data = await postRequest(
        `/api/v2/production-order/${payload.code}/cap-phoi`,
        payload
    );
    return data.data;
}

export async function themTonKeHoach2({ commit }, payload) {
    let data = await postRequest(
        `/api/v2/production-order/${payload.code}/cap-phoi-2`,
        payload
    );
    return data.data;
}
export async function themTonKeHoach3({ commit }, payload) {
    let data = await postRequest(
        `/api/v2/production-order/${payload.code}/cap-phoi-3`,
        payload
    );
    return data.data;
}

export async function getAllLsx({ commit }, payload) {
    let { data } = await postRequest(`/api/v2/production-order/${payload.departentId}/${payload.itemId}/number-steps
        `, payload);
    commit("setNumbers", data.data);
    return data;
}

export async function taoPhoi({ dispatch }, poIds) {
    let result = await putRequest(apiConfig.P_POS + "/none/tao", {
        poIds
    });
    dispatch("getAllPos");
    return result;
}

export async function huyPhoi({ dispatch }, poIds) {
    let result = await putRequest(apiConfig.P_POS + "/none/huy", {
        poIds
    });
    dispatch("getAllPos");
    return result;
}

export async function duyetPhoi({ dispatch }, poIds) {
    let result = await putRequest(apiConfig.P_POS + "/none/duyet", {
        poIds
    });
    dispatch("getAllPos");
    return result;
}

export async function huyDuyet({ dispatch }, poIds) {
    let result = await putRequest(apiConfig.P_POS + "/none/huy-duyet", {
        poIds
    });
    dispatch("getAllPos");
    return result;
}

export async function lenhSanXuatThucHien({ commit }, stepId) {
    const { data } = await getRequest(
        `/api/v2/khsx/${stepId}
        /lenh-san-xuat-thuc-hien`
    );
    commit("setPos", data);
}

export async function getPO({ commit }, payload) {
    try {
        const result = await getRequest(apiConfig.P_POS + `/getAllPO?factoryId=${payload.factoryId}&from=${payload.from}&to=${payload.to}`);
        return result.data
    } catch (error) {
        console.log(error)
    }
}
