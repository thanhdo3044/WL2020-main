import Vue from "vue";
import Vuex from "vuex";

import production from "./production";
import funiture from "./funiture";
import base from "./base";
import wood from "./wood";
import po from "./po";
import eofs from "./eofMobile";
import eof from "./eof";
import lenhSanXuats from "./lenh-san-xuat";
import vcn from "./vcn";
import machine from "./machine";
Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
const Store = new Vuex.Store({
    modules: {
        production,
        funiture,
        base,
        po,
        wood,
        ...eof,
        ...eofs,
        lenhSanXuats,
        vcn,
        machine
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
});
export default Store;