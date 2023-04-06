import { v4 as uuidv4 } from "uuid";
import client from "../../utils";

const state = {
    request: {},
    requests: {
        data: []
    },
    requestsTodo: {
        data: []
    }
};

const mutations = {
    deleteRequest(state, id) {
        let index = state.requests.data.findIndex(item => item.id === id);
        state.requests.data.splice(index, 1);
    },

    updateRequest(state, payload) {
        let found = state.requests.data.find(item => item.id === payload.id);
        if (found) found = payload;
    },

    addRequest(state, payload) {
        state.requests.data.push(payload.data);
    },

    resetRequest(state, payload) {
        state.request = {
            ...state.request.data,
            id: "",
            userId: "",
            costcenterId: "",
            companyId: "c4ced5f1-06bb-49ed-bbf0-cfd3732bb696",
            title: "Phê duyệt: đang tải...",
            completed: false,
            status: "",
            ...payload
        };
    },

    selectRequest: (state, request) => (state.request = request),
    setRequests: (state, requests) => (state.requests = requests)
};

const actions = {
    selectRequest({ commit }, payload) {
        commit("selectRequest", payload);
    },

    deleteRequest: async({ commit }, orderId) => {
        console.log("deleteRequest");
        let data = await client.put("/api/v1/requests?orderId=" + orderId);
        if (data) {
            commit("deleteRequest", data.data);
        }
    },

    permissionAuthorised: async({ commit }, payload) => {
        console.log("permissonAuthorised", payload.permissonAuthorised);
        let data = await client.post(
            "/api/v2/permissionAuthorised/" + payload.id,
            payload.permissonAuthorised
        );
        console.log(data);
        return data;
        // if (data) commit("permissionAuthorised", data.data);
    },
    getPermissionAuthorised: async({ commit }, payload) => {
        let data = await client.get("/api/v2/permissionAuthorised/" + payload);
        console.log(data);
        return data;
        // if (data) commit("permissionAuthorised", data.data);
    },
    getDepartmentMuaHang: async({ commit }) => {
        let data = await client.get("/api/v2/requests/department");
        console.log(data);
        return data.data.data;
    },
    delPermissionAuthorised: async({ commit }, payload) => {
        let data = await client.delete(
            "/api/v2/permissionAuthorised/" + payload.accountId + "?id=" + payload.id
        );
        console.log(data);
        return data;
        // if (data) commit("permissionAuthorised", data.data);
    },
    editPermissionAuthorised: async({ commit }, payload) => {
        let data = await client.put(
            "/api/v2/permissionAuthorised/" + payload.accountId,
            payload
        );
        console.log(data);
        return data;
        // if (data) commit("permissionAuthorised", data.data);
    },
    getAllRequestsToday: async({ commit }, payload) => {
        let data = await client.get("/api/v1/requests-active?accountId=" + payload.accountId);
        return data.data;
    },

    searchSuccessReq: async({ commit }, payload) => {
        let data = await client.post("/api/v2/requests/123", payload);
        console.log(data);
        return data;
        // if (data) commit("permissionAuthorised", data.data);
    },

    sendTokenFCM: async({ commit }, payload) => {
        console.log("payloadInserFCMToken", payload);
        let data = await client.post("/api/v1/notification", payload);
        return data;
    },
    getTokenFCM: async({ commit }, payload) => {
        console.log("payloadGetFCMToken", payload);
        let data = await client.get(
            `/api/v1/notification?accountId=${payload.accountId}`
        );
        return data;
    },
    deleteTokenFCM: async({ commit }, payload) => {
        console.log("payloadDelFCMToken", payload);
        let data = await client.put("/api/v1/notification", payload);
        return data;
    },

    // bắn messages FCM 
    sendMessageActiveReq: async({ commit }, payload) => {
        console.log("send messages active Req");
        let data = await client.post("/api/v2/sendMessageReq", payload);
        commit("dataMessages");
        return data.data;
    },

    checkPermissionAuthorised: async({ commit }, payload) => {
        let data = await client.put("/api/v2/requests-isAuthority", {
            accountId: payload.accountId,
            slug: payload.slug,
            timeRequest: payload.timeRequest
        });
        console.log(data);
        return data;
        // if (data) commit("permissionAuthorised", data.data);
    },

    addRequest: async({ commit }, request) => {
        if (request.id) {
            delete request.position;
            let data = await client.put("/api/v1/requests/" + request.id, request);
            if (data) request = data.data;
        } else {
            let data = await client.post("/api/v1/requests/", {
                ...request,
                id: uuidv4()
            });
            console.log(data);
            if (data) commit("addRequest", data.data);
        }
    },
    // trưởng phòng phê duyệt
    completedRequest: async({ commit }, payload) => {
        console.log("Duyệt");
        if (payload.request.id) {
            let data = await client.put(
                "/api/v1/requests/" + payload.request.id + "?nextId=" + payload.nextId, {
                    id: payload.request.id,
                    completed: true,
                    status: "Đã ký",
                    accountId2Active: null
                }
            );
            if (data) commit("selectRequest", data.data.data);
        }
    },

    // Bật thông báo mail
    activeNotificationMail: async({ commit }, payload) => {
        console.log("Bật thông báo mail");
        let data = await client.put(
            "/api/v2/active-notificationMail", payload
        );
        return data;
    },

    // send thông báo mail
    sendNotificationMail: async({ commit }, payload) => {
        console.log("send thông báo mail");
        let data = await client.post(
            "/api/v2/send-mail", payload
        );
        return data;
    },

    // Tắt thông báo mail
    unActiveNotificationMail: async({ commit }, payload) => {
        console.log("Tắt thông báo mail");
        let data = await client.put(
            "/api/v2/unActive-notificationMail", payload
        );
        return data;
    },

    // phó phòng phê duyệt
    completedRequest2: async({ commit }, payload) => {
        console.log("Duyệt");
        if (payload.request.id) {
            let data = await client.put(
                "/api/v1/requests/" + payload.request.id + "?nextId=" + payload.nextId, {
                    id: payload.request.id,
                    completed: true,
                    status: "Đã ký",
                    accountId2Active: 1
                }
            );
            if (data) commit("selectRequest", data.data.data);
        }
    },
    completedTimeVT: async({ commit }, payload) => {
        console.log("payload", payload);
        console.log("completedTimeVT");
        let data = await client.post("/api/v2/requests-active", {
            statusAccept: `${payload.statusAccept}`,
            timeVTAccept: `${payload.timeVTAccept}`,
            id: `${payload.id}`,
            timeVTAcceptEnd: `${payload.timeVTAcceptEnd}`
        });
        return data;
    },
    deleteReqAuthority: async({ commit }, payload) => {
        console.log("deleteReqAuthority");
        console.log("payload", payload);
        let data = await client.delete(
            "/api/v2/requests?idReqAuthority=" + payload
        );
        return data;
    },
    isAuthority: async({ commit }, payload) => {
        console.log("isAuthority");
        console.log("payload", payload);
        let data = await client.post(
            `/api/v2/requests-isAuthority?id=${payload.id}&isAuthority=${payload.isAuthority}`
        );
        return data;
    },
    confirmSuccessOrder: async({ commit }, payload) => {
        console.log("confirmSuccessOrder");
        console.log("payload", payload);
        let data = await client.put(
            `/api/v2/requests-active/${payload.id}?successOrder=${payload.successOrder}`
        );
        return data;
    },
    deleteRequestById: async({ commit }, id) => {
        console.log("deleteRequestById");
        console.log("payload", id);
        let data = await client.delete(`/api/v2/requests-active/${id}`);
        return data;
    },
    activeRequestsMeta: async({ commit }, payload) => {
        console.log("payload", payload);
        console.log("activeRequestsMeta");
        let data = await client.put("/api/v2/requests-active?id=" + payload.id, {
            statusRequests: `${payload.statusRequests}`
        });
        return data;
    },
    cancelRequest: async({ commit }, request) => {
        console.log("Hủy");
        if (request.id) {
            let data = await client.put("/api/v1/requests/" + request.id, {
                id: request.id,
                completed: false,
                status: "Không"
            });
            if (data) commit("selectRequest", data.data.data);
        }
    },

    getAllRequests: async({ commit }, accountId) => {
        let data = await client.get("/api/v1/requests/?accountId=" + accountId);
        if (data) commit("setRequests", data.data);
        return data.data;
    },
    getOneRequest: async({ commit }, id) => {
        let result = {};
        let data = await client.get("/api/v1/requests/" + id);
        if (data) {
            result = data.data.data;
            commit("selectRequest", result);
        }
        return result;
    },

    resetRequest({ commit }, payload) {
        commit("resetRequest", payload);
    }
};

const getters = {
    requestsTodo: state => {
        return {
            ...state.requests
        };
    },
    requestsCompleted: state => {
        return {
            ...state.requests
        };
    },
    request: state => {
        return {
            ...state.request
        };
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};