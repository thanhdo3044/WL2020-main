import axios from "axios";
import { getRequest, postRequest, putRequest } from "../../utils/utils";
import { Notify } from "quasar";

export async function getMachineByFactoryId({ commit }, payload) {
    let data = await getRequest("/api/v2/machine/machineByFactoryId?factoryId=" + payload.factoryId +"&starTime="+ payload.starTime
    + "&endTime="+ payload.endTime);
    console.log(data.data.data);
    return data.data.data;
}
export async function getkiemtramaycap2({ commit }, payload) {
    let data = await getRequest("/api/v2/machine/getmuckiemtramaycap2?cap=" + payload.cap +"&manhommay="+ payload.manhommay
    );
    return data.data.data;
}
export async function getkiemtramaycap3({ commit }, payload) {
    let data = await getRequest("/api/v2/machine/getmuckiemtramaycap3?cap=" + payload.cap +"&manhommay="+ payload.manhommay
    +"&phankiemtra="+ payload.phankiemtra);
    return data.data.data;
}
export async function getdulieukiemtramaycap2({ commit }, payload) {
    let data = await getRequest("/api/v2/machine/getdulieumuckiemtramaycap2?week=" + payload.week +"&tenMay="+ payload.tenMay
    +"&nam="+ payload.nam+"&factoryId="+ payload.factoryId
    );
    return data.data.data;
}
export async function nhommaycap2({ commit }, payload) {
    let data = await getRequest("/api/v2/machine/machinecap2?cap=" + payload.cap);

    return data.data.data;
}
export async function getkiemtramayFactoryId({ commit }, payload) {
    let data = await getRequest("/api/v2/machine/kiem-tra-may-day?factoryId=" + payload.factoryId +"&starTime="+ payload.starTime
    + "&endTime="+ payload.endTime + "&tenMay="+ payload.tenMay );
    return data.data.data;
}
export async function getdulieukiemtramaycap3({ commit }, payload) {
    let data = await getRequest("/api/v2/machine/kiem-tra-may-cap-3?factoryId=" + payload.factoryId +"&starTime="+ payload.starTime
    + "&endTime="+ payload.endTime + "&tenMay="+ payload.tenMay + "&phankiemtra="+ payload.phankiemtra + "&month="+ payload.month
    + "&year="+ payload.year );
    return data.data.data;
}
export async function getQuantityReportByAccountId({ commit }, accountId) {
    let data = await getRequest(`/api/v2/machine/show-report-by-accountId?accountId=${accountId}`);
    return data.data.data[0];
}

export async function getAllMachine({ commit }) {
    let data = await getRequest("/api/v2/machine/show");
    console.log(data.data.data);
    return data.data.data;
}

export async function getItemByMachine({ commit }) {
    let data = await getRequest("/api/v2/machine/items");
    console.log(data.data.data);
    return data.data.data;
}
export async function insertQuatityReport({ commit }, payload) {
    await postRequest(
        `/api/v2/machine/report-machine`, payload
    );
    return "OK";
}

export async function getQuantityReportByEndTime({ commit }) {
    let data = await getRequest("/api/v2/machine/active");
    return data.data.data;
}

export async function updateQuantityReport({ commit }, payload) {
    await postRequest(
        `/api/v2/machine/update-report`, payload
    );
    return "OK";
}

export async function getMachineIsWorkingByMachineId({ commit }, machineId) {
    let data = await getRequest(`/api/v2/machine/working?machineId=${machineId}`);
    return data.data.data;
}

export async function insertManagedMachineTroble({ commit }, payload) {
    let data = await postRequest(`/api/v2/machine/add-managed-machine-trouble`, payload);
    return data.data;
}
export async function insertManagedMachineday({ commit }, payload) {
    let data = await postRequest(`/api/v2/machine/add-managed-machine-day`, payload);
    return data.data;
}
export async function insertManagedMachinecap3({ commit }, payload) {
    let data = await postRequest(`/api/v2/machine/add-managed-machine-cap-3`, payload);
    return data.data;
}
export async function insertManagedMachinecap2({ commit }, payload) {
    let data = await postRequest(`/api/v2/machine/add-managed-machine-cap-2`, payload);
    return data.data;
}
export async function updateManagedMachineday({ commit }, payload) {
    let data = await postRequest(`/api/v2/machine/update-managed-machine-day`, payload);
    return data.data;
}
export async function updateManagedMachinecap2({ commit }, payload) {
    let data = await postRequest(`/api/v2/machine/update-managed-machine-cap-2`, payload);
    return data.data;
}
export async function updateManagedMachinecap3({ commit }, payload) {
    let data = await postRequest(`/api/v2/machine/update-managed-machine-cap-3`, payload);
    return data.data;
}
export async function insertManagedMachineMaintenance({ commit }, payload) {
    let data = await postRequest(`/api/v2/machine/add-managed-machine-maintenance`, payload);
    return data.data;
}

export async function getManagedMachines({ commit }, factoryId) {
    let data = await getRequest("/api/v2/machine/managed-machine?factoryId=" + factoryId);
    console.log(data.data.data);
    return data.data.data;
}
export async function updateManagedMachineTrouble({ commit }, payload) {
    let data = await postRequest(`/api/v2/machine/update-managed-machine-trouble`,payload);
    console.log(data.data.data);
    return data.data;
}


// export async function updateManagedMachineTrouble({ commit }, payload) {
//     let data = await putRequest(
//         `/api/v2/machine/update-managed-machine-trouble2`, payload
//     );
//     return data.data;
// }

export async function updateManagedMachineTroubleCD({ commit }, payload) {
    let data = await putRequest(
        `/api/v2/machine/update-managed-machine-trouble/co-dien`, payload
    );
    return data.data;
}

export async function updateManagedMachineTroubleF({ commit }, payload) {
    let data = await putRequest(
        `/api/v2/machine/update-managed-machine-trouble/factory`, payload
    );
    return data.data;
}

export async function getStandardPower({ commit }, payload) {
    let data = await getRequest(`/api/v2/machine/standard-power?machineId=${payload.machineId}&itemId=${payload.itemId}`);
    console.log(data.data.data);
    return data.data.data;
}
export async function getMachineMaintenance({ commit }) {
  let data = await getRequest("/api/v2/machine/machine-maintain");
  return data.data.data;
}