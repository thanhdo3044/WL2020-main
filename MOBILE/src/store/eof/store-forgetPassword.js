import { v4 as uuidv4 } from "uuid";
import client from "../../utils";

const state = {
  message: {},
  messages: {}
};

const mutations = {
  
};

const actions = {
  checkProfileAccount : async({ commit }, payload)=> {
    let data = await client.post("/api/v2/forgetPassword", payload);
    return data.data;
  },
  sendMailOTP : async({ commit }, payload)=> {
    let data = await client.post("/api/v2/send-mail-OTP", payload);
    return data.data;
  },
  checkMailOTP : async({ commit }, payload)=> {
    let data = await client.post("/api/v2/check-Mail-OTP", payload);
    return data.data.data;
  },

};

const getters = {
 
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
