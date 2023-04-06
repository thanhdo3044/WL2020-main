import { v4 as uuidv4 } from "uuid";
import client from "../../utils";
import moment from "moment";

const state = {};

const mutations = {};

const actions = {
  getMeetingRoomByLocation: async ({ commit }, payload) => {
    let data = await client.get(
      "/api/v1/meeting/get-by-location?location=" + payload.location
    );
    return data.data.data;
  },
  createBookMeeting: async ({ commit }, payload) => {
    let data = await client.post("/api/v1/bookMeeting", payload);
    return data.data.data;
  },
  deleteBookMeeting: async ({ commit }, payload) => {
    let data = await client.delete("/api/v1/bookMeeting/"+payload.id, payload);
    return data.data.data;
  },
  updateBookMeeting: async ({ commit }, payload) => {
    let data = await client.put("/api/v1/bookMeeting/"+payload.id, payload);
    return data.data.data;
  },
  createBookMeetingApproved: async ({ commit }, payload) => {
    let data = await client.post("/api/v1/bookMeetingApproved", payload);
    return data.data.data;
  },
  getMeetingRoomById: async ({ commit }, payload) => {
    let data = await client.get(
      "/api/v1/meetingRoom/" + payload.id
    );
    return data.data.data;
  },
  getByStartTime: async ({ commit }, payload) => {
    let data = await client.get(
      `/api/v1/meeting/getByStartTime?roomId=${payload.roomId}&startTime=${payload.startTime}&date=${payload.date}`
    );
    return data.data.data;
  },
  getByEndTime: async ({ commit }, payload) => {
    let data = await client.get(
      `/api/v1/meeting/getByEndTime?roomId=${payload.roomId}&startTime=${payload.startTime}&endTime=${payload.endTime}&date=${payload.date}`
    );
    return data.data.data;
  },
  getByDate: async ({ commit }, payload) => {
    let data = await client.get(
      `/api/v1/meeting/getByDate?roomId=${payload.roomId}&date=${payload.date}`
    );
    return data.data.data;
  },
  getDateBooking: async ({ commit }, payload) => {
    let data = await client.get(
      `/api/v1/meeting/getDateBooking?accountId=${payload.accountId}`
    );
    return data.data.data;
  },
  getAllDateBooking: async ({ commit }, payload) => {
    let data = await client.get(
      `/api/v1/meeting/getAllDateBooking?accountId=${payload.accountId}`
    );
    return data.data.data;
  },
  getAllBookingInDay: async ({ commit }, payload) => {
    let data = await client.get(
      `/api/v1/meeting/getAllBookingInDay?date=${payload.date}&accountId=${payload.accountId}`
    );
    return data.data.data;
  },
  getBookingInDay: async ({ commit }, payload) => {
    let data = await client.get(
      `/api/v1/meeting/get-booking-in-day?accountId=${payload.accountId}&date=${payload.date}`
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
