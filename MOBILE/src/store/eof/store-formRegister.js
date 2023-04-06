import { v4 as uuidv4 } from "uuid";
import client from "../../utils";
import moment from "moment";

const state = {};

const mutations = {};

const actions = {
  getFormRegister: async ({ commit }) => {
    let data = await client.get(
      "/api/v1/form-register"
    );
    return data.data.data;
  },
  getFormQuestion: async ({ commit }, payload) => {
    let data = await client.get(
      "/api/v1/form-register/question?formId="+payload.formId
    );
    return data.data.data;
  },
  getFormRegisterById: async ({ commit }, payload) => {
    let data = await client.get(`/api/v1/form-register/form-register-by-id?formId=${payload.formId}`);
    return data.data.data;
  },
  getFormRegisterManager: async ({ commit }, payload) => {
    let data = await client.get(`/api/v1/form-register/form-register-manager?accountId=${payload.accountId}&from=${payload.fromDate}&to=${payload.toDate}&departmentId=${payload.departmentId}`);
    return data.data.data;
  },
  getTitleByAccount: async ({ commit }, payload) => {
    let data = await client.get(`/api/v1/form-register/show-title-by-account?accountId=${payload.accountId}&from=${payload.fromDate}&to=${payload.toDate}`);
    return data.data.data;
  },
  GET_DEPARTMENT_IS_MANAGER: async ({ commit }, payload) => {
    let data = await client.get(`/api/v1/form-register/get-deprtment-by-nanager?accountId=${payload.accountId}`);
    return data.data.data;
  },
  getUserAnswerByAccountId: async ({ commit }, payload) => {
    let data = await client.get(`/api/v1/form-register/user-answer/by-accountId?formId=${payload.formId}&accountId=${payload.accountId}`);
    return data.data.data;
  },
  insertUserFormRegister: async ({ commit }, payload) => {
    let data = await client.post(
      "/api/v1/form-register/user-form-register",payload
    );
    return data.data.data;
  },
  insertUserAnswer: async ({ commit }, payload) => {
    let data = await client.post(
      "/api/v1/form-register/user-answer",payload
    );
    return data.data.data;
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
