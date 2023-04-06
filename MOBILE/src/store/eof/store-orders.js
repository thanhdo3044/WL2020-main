import { v4 as uuidv4 } from "uuid";
import client from "../../utils";
import {
    setToken,
} from "../../utils/utils";
const state = {
    orders: {},
    requests: [],
    messages: [],
    orderMeta: {},
    dsBieuMau: [],
    cars: [],
    accounts: [],
    order: {},
    departments: [],
    proposalForms: []
};

import apiConfig from "../../configs/api";

const mutations = {
    setRequests(state, payload) {
        state.requests = payload;
    },

    addMessage(state, payload) {
        state.order.Messages.push(payload.data);
    },
    deleteOrder(state, id) {
        let index = state.orders.data.findIndex(item => item.id === id);
        state.orders.data.splice(index, 1);
    },

    addOrder(state, payload) {
        state.orders.data.push(payload.data);
        state.order = payload.data;
    },

    resetOrder(state, payload) {
        state.order = {
            ...state.order,
            id: "",
            costcenterId: "e378f3b1-9e35-4090-bc0a-92297d41a9e3",
            companyId: "c4ced5f1-06bb-49ed-bbf0-cfd3732bb696",
            code: "202011/8TH",
            name: "Phiếu đề xuất mua hàng",
            note: "Mô tả đề xuất nếu có",
            status: "Mới",
            completed: false,
            ...payload
        };
    },

    selectOrder: (state, order) => (state.order = order),
    setOrders: (state, orders) => (state.orders = orders),
    getAllOrders: async(state, key) => {
        let data = await client.get("/api/v2/orders/?accountId=" + key);
        if (data) state.orders = data.data;

    },
    resetRequests: (state, payload) => {
        let tmp = [];
        let nextId = null;
        state.requests.forEach(item => {
            let id = uuidv4();
            item = {
                ...payload,
                ...item,
                id,
                nextId,
                orderableType: "order"
            };
            tmp.push(item);
            nextId = id;
        });
        state.requests = tmp;
    },

    setRequest: (state, payload) => {
        state.order.Requests = payload;
    },

    setDSBieuMau: (state, payload) => {
        state.dsBieuMau = payload.map(b => ({
            id: b.proposalFormId,
            slug: b.ProposalForm.slug,
            name: b.ProposalForm.name
        }));
    },

    getAllCars: (state, payload) => {
        state.cars = payload;
    },

    getAllAccounts: (state, payload) => {
        state.accounts = payload;
    },

    getAllDepartments: (state, payload) => {
        state.departments = payload;
    },

    getAllProposalForms: (state, payload) => {
        state.proposalForms = payload;
    }
};

const actions = {
    getPaySplitByAccount: async({ commit },payload)=>{
        const data = await client.get(`/api/v1/payslipByAccount/${payload.mnv}/${payload.year}`)
        return data.data
    },
    getPayslitT13ByAccount: async({ commit },payload)=>{
        const data = await client.post(`/api/v1/payslipByAccount/${payload.mnv}/${payload.year}`)
        return data.data
    },
    getPaySplitById: async({ commit },payload)=>{
        const data = await client.get(`/api/v1/payslipById/${payload.id}`)
        return data.data
    },
    getAllProposalForms: async({ commit }) => {
        let { data } = await client.get("/api/v3/proposal-forms");
        if (data) commit("getAllProposalForms", data.data);
    },

    getAllDepartments: async({ commit }) => {
        let { data } = await client.get("/api/v3/departments");
        if (data) commit("getAllDepartments", data.data);
    },

    getAllAccounts: async({ commit },payload) => {
        // setToken(window.localStorage.getItem('tokenFBB2'));
        let { data } = await client.post("/api/v3/accounts/raw",payload);
        if (data) commit("getAllAccounts", data.data);
        return data.data;
    },
    GET_ACCOUNTS: async({ commit },payload) =>{
        const data = await client.get("/api/v2/accounts",payload);
        return data.data;
    },
    getAllCars: async({ commit }) => {
        let { data } = await client.get("/api/v3/cars");
        if (data) commit("getAllCars", data.data);
    },

    getAllAccountForms: async({ commit }, payload) => {
        let { data } = await client.get(apiConfig.ACCOUNT_FORMS + payload);
        if (data) commit("setDSBieuMau", data);
    },

    resetRequests: async({ commit }, payload) => {
        await commit("resetRequests", payload);
    },

    getAllRequests: async({ commit }, approvalableId) => {
        let data = await client.get(
            "/api/v1/approval-steps/?approvalableId=" + approvalableId
        );
        if (data) {
            await commit("setRequests", data.data.data);
        }
    },

    selectOrder({ commit }, payload) {
        commit("selectOrder", payload);
    },

    deleteOrder: async({ commit }, id) => {
        let data = await client.delete("/api/v2/orders/" + id);
        if (data) commit("deleteOrder", id);
    },

    addMessage: async({ commit }, message) => {
        if (message.id) {
            let data = await client.put("/api/v1/messages/" + message.id, message);
            if (data) message = data.data;
        } else {
            let data = await client.post("/api/v1/messages/", {
                ...message,
                id: uuidv4()
            });
            if (data) commit("addMessage", data.data);
        }
    },

    addOrder: async({ commit }, order) => {
        delete order.OrderLines;
        delete order.Requests;
        delete order.Messages;
        delete order.number;
        delete order.OrderMeta;
        if (order.id) {
            await client.put("/api/v2/orders/" + order.id, order);
            await commit("getAllOrders", order.accountId);
        } else {
            let data = await client.post("/api/v2/orders/", {
                ...order,
                id: uuidv4()
            });
            await commit("getAllOrders", order.accountId);
            return data;
        }
    },
    confirmPriorityLevel: async({ commit }, payload) => {
        let data = await client.put("/api/v2/orders/confirmPriorityLevel?id=" + payload.id + "&priorityLevel=" + payload.priorityLevel)
        return data;
    },
    getMaVT: async({ commit }, payload) => {
        console.log('getMaVT')
        let data = await client.get("/api/v1/dmvt/getMaVT?ma_vt=" + payload.ma_vt)
        return data;
    },
    getAllOrders: async({ commit }, key) => {
        await commit("getAllOrders", key);
        let data = await client.get("/api/v2/orders/?accountId=" + key);
        return data.data;
    },

    getOrderByStatus: async({ commit}, payload)=>{
        let data = await client.get(`/api/v2/orders/order/status?accountId=${payload.accountId}&trangThai=${payload.status}`);
        return data.data;
    },

    getOrderByStatusAndDate: async({ commit}, payload)=>{
        let data = await client.get(`/api/v2/orders/order/status/date?accountId=${payload.accountId}&trangThai=${payload.status}&from=${payload.from}&to=${payload.to}`);
        return data.data;
    },

    getOneOrder: async({ commit }, id) => {
        let data = await client.get("/api/v2/orders/" + id);
        if (data) commit("selectOrder", data.data.data);
        return data;
    },
    updOrder: async({ commit }, payload) => {
        let data = await client.post("/api/v2/orders/" + payload.id, { intendedUse: payload.intendedUse });
        if (data) commit("selectOrder", data.data.data);
        return data;
    },

    resetOrder({ commit }, payload) {
        commit("resetOrder", payload);
    },

    sendToApproved: async({ commit }, payload) => {
        let data = await client.import("/api/v1/requests/import", payload);
        if (data) commit("setRequest", data.data.data);
    }
};

const getters = {
    orders: state => state.orders,

    requests: state => state.requests,

    messages: state => state.order.Messages,

    order: state => state.order,

    dSBieuMauSuDung: state => state.dsBieuMau,

    cars: state => state.cars,

    accounts: state => state.accounts,

    departments: state => state.departments,

    proposalForms: state => state.proposalForms,

    getProposalFormById: state => id => {
        return state.proposalForms.find(a => a.id === id);
    },

    getAccountById: state => id => {
        return state.accounts.find(a => a.id === id);
    },

    getDepartmentById: state => id => {
        return state.departments.find(d => d.id === id);
    },

    getCarById: state => id => {
        return state.cars.find(c => c.id === id);
    },

    getCarsOption: state =>
        state.cars.map(c => ({
            label: c.code,
            seats: c.seats,
            value: c.id,
            description: c.name,
            category: "1"
        })),

    getAccountsOption: state =>
        state.accounts.map(a => ({
            label: [a.account, a.lastName].join("-"),
            value: a.id,
            description: a.postion,
            category: "1"
        }))
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};