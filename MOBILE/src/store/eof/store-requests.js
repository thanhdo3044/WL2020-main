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

    deleteRequest({ commit }, id) {
        commit("deleteRequest", id);
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
    completedRequest: async({ commit }, payload) => {
        console.log("Duyệt");
        if (payload.request.id) {
            let data = await client.put("/api/v1/requests/" + payload.request.id + "?nextId=" + payload.nextId, {
                id: payload.request.id,
                completed: true,
                status: "Đã ký",
            });
            if (data) commit("selectRequest", data.data.data);
        }
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

    getAllRequestsToday: async({ commit }, payload) => {
        let data = await client.get("/api/v1/requests-active", payload);
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